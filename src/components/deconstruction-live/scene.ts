import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { clamp01, seg } from "../deconstruction-v3/story";

/**
 * The department engine, live. Everything here mirrors the Blender scene in
 * 3d/deconstruction/film.py (glbfull mode): the same parts, camera path, lift,
 * core and team colours, so the page can treat it exactly like the film.
 * Screen points come back in the film's own pixel space (1600 x 900 on desktop,
 * 960 x 1200 on phones), which keeps the page's layout code unchanged.
 */

export type LiveAnchor = { layers: number[][]; left: number[][]; hollow: number[]; core: number[]; centre: number[]; rim: number };
export type LiveState = { t: number; spin: number; bp: number; zoom: number };
export type LiveHandle = {
  res: [number, number];
  draw: (s: LiveState) => void;
  anchors: (t: number, zoom: number) => LiveAnchor;
  setSize: (cssW: number, cssH: number) => void;
  dispose: () => void;
};

const BASE = "/deconstruction-live";
const R2 = 3.2;
const LAYER_H = [0.22, 0.42, 0.5, 0.4, 0.12];
const REST = [0, 0.22, 0.7, 1.26, 1.66];
const LIFT = 2.7;
const SALES = 3;
/** Camera keys from film.py, in Blender's axes (z up): [t, position, target]. */
const CAM: Array<[number, [number, number, number], [number, number, number]]> = [
  [0.0, [0, -12.8, 6.4], [0, 0, 0.7]],
  [0.14, [0, -13.4, 6.8], [0, 0, 0.9]],
  [0.38, [0, -19.5, 7.6], [0, 0, 2.7]],
  [0.63, [0, -19.5, 7.6], [0, 0, 2.7]],
  [0.84, [0, -14.4, 7.6], [0, 0, 1.2]],
  [1.0, [0, -0.02, 18.5], [0, 0, 0.0]],
];
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Blender (x, y, z), z up, to three.js (x, z, -y), y up. */
const b2t = (v: [number, number, number]) => new THREE.Vector3(v[0], v[2], -v[1]);

function camAt(t: number) {
  let k = 0;
  while (k < CAM.length - 2 && t > CAM[k + 1]![0]) k++;
  const [ta, pa, ga] = CAM[k]!, [tb, pb, gb] = CAM[k + 1]!;
  const u = ease(clamp01((t - ta) / (tb - ta)));
  const lerp3 = (a: number[], b: number[]) => [0, 1, 2].map((j) => a[j]! + (b[j]! - a[j]!) * u) as [number, number, number];
  return { pos: b2t(lerp3(pa, pb)), target: b2t(lerp3(ga, gb)) };
}

const liftAt = (t: number) => LIFT * seg(t, 0.14, 0.38) * (1 - seg(t, 0.66, 0.84));
const coreAt = (t: number) => seg(t, 0.63, 0.8);

/** Line drawing from the scene's normals and depth: the blueprint look, drawn live. */
const BLUEPRINT = {
  uniforms: {
    tNormal: { value: null as THREE.Texture | null },
    tDepth: { value: null as THREE.Texture | null },
    texel: { value: new THREE.Vector2() },
    near: { value: 0.1 },
    far: { value: 200 },
    opacity: { value: 0 },
  },
  vertexShader: "varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader: `
    uniform sampler2D tNormal; uniform sampler2D tDepth; uniform vec2 texel; uniform float near; uniform float far; uniform float opacity;
    varying vec2 vUv;
    float lin(vec2 uv) { float z = texture2D(tDepth, uv).x * 2.0 - 1.0; return 2.0 * near * far / (far + near - z * (far - near)); }
    void main() {
      vec3 n0 = texture2D(tNormal, vUv).xyz;
      float d0 = lin(vUv);
      float e = 0.0;
      for (int i = 0; i < 4; i++) {
        vec2 o = i == 0 ? vec2(texel.x, 0.0) : i == 1 ? vec2(-texel.x, 0.0) : i == 2 ? vec2(0.0, texel.y) : vec2(0.0, -texel.y);
        vec3 n = texture2D(tNormal, vUv + o).xyz;
        float d = lin(vUv + o);
        e = max(e, smoothstep(0.25, 0.5, length(n - n0)));
        e = max(e, smoothstep(0.012, 0.03, abs(d - d0) / min(d, d0)));
      }
      vec3 paper = vec3(0.914, 0.918, 0.894);
      vec3 ink = vec3(0.16, 0.17, 0.19);
      gl_FragColor = vec4(mix(paper, ink, e * 0.92), opacity);
    }`,
};

export async function createLive(canvas: HTMLCanvasElement, mobile: boolean): Promise<LiveHandle> {
  const res: [number, number] = mobile ? [960, 1200] : [1600, 900];
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.autoClear = false;
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const bg = new THREE.Color().setRGB(5 / 255, 6 / 255, 7 / 255, THREE.SRGBColorSpace);
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, 18, 40);

  // The film's lenses: 38mm across a 36mm-wide sensor on desktop, 36mm on a 24mm-tall sensor on phones
  const vfov = mobile ? 2 * Math.atan(12 / 36) : 2 * Math.atan(18 / 38 / (16 / 9));
  const cam = new THREE.PerspectiveCamera(THREE.MathUtils.radToDeg(vfov), res[0] / res[1], 0.1, 200);

  const area = (pos: [number, number, number], size: number, intensity: number, colour: THREE.ColorRepresentation) => {
    const l = new THREE.RectAreaLight(colour, intensity, size, size);
    l.position.set(...pos);
    l.lookAt(0, 0, 0);
    scene.add(l);
  };
  area([-7, 9, 8], 7, 1.4, 0xffeed9);
  area([7, 5, -9], 6, 1.0, new THREE.Color(0.62, 0.78, 1.0));
  area([0, 11, 0], 9, 0.12, 0xffffff);
  // The wedge at the front is always in the same place, so its green spill is a fixed light
  const spill = new THREE.PointLight(0x3ee07a, 0, 4, 1.6);
  spill.position.set(0, 2.2, 2.2);
  scene.add(spill);
  const glow = new THREE.PointLight(0x4dff8c, 0, 9, 1.4);
  glow.position.set(0, 1.0, 0);
  scene.add(glow);

  const tl = new THREE.TextureLoader();
  const [ao, floorLight, gltf] = await Promise.all([
    tl.loadAsync(`${BASE}/ao-${mobile ? "2k" : "4k"}.webp`),
    tl.loadAsync(`${BASE}/floor-light.webp`),
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath("/draco/")).loadAsync(`${BASE}/engine.glb`),
  ]);
  ao.channel = 1;
  ao.flipY = false;
  ao.anisotropy = 4;

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 128),
    new THREE.MeshBasicMaterial({ map: floorLight, color: new THREE.Color(0.012, 0.0125, 0.0135) }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const find = (prefix: string) => {
    let hit: THREE.Object3D | null = null;
    gltf.scene.traverse((o) => { if (!hit && o.name.startsWith(prefix)) hit = o; });
    if (!hit) throw new Error(`Missing ${prefix} in engine.glb`);
    return hit as THREE.Object3D;
  };
  const layers = [0, 1, 2, 3, 4].map((k) => find(`L${k}`));
  const dial = find("Dial");
  const coreBase = find("CoreBase");
  const column = find("Column");
  const dashes = find("Dashes");
  const rings = find("FloorRings");

  // Layers and the floor dial turn together; the core and the slot stay still
  const spinner = new THREE.Group();
  for (const o of [...layers, dial]) spinner.add(o);
  scene.add(spinner);
  scene.add(gltf.scene);

  const labels: THREE.MeshStandardMaterial[][] = [[], [], [], [], [], []];
  const trims: THREE.MeshStandardMaterial[][] = [[], [], [], [], [], []];
  const seen = new Set<THREE.Material>();
  gltf.scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    const m = o.material as THREE.MeshPhysicalMaterial;
    if (seen.has(m)) return;
    seen.add(m);
    if (m.name === "AIGlass") { m.transmission = 0; m.transparent = true; m.opacity = 0.62; }
    // Glowing parts skip the baked shading: their thin islands would break them into dashes
    if (!/^(Trim|Label|Band|DbRing|Green|AICore|Slot|FR)/.test(m.name) && o.geometry.getAttribute("uv1")) {
      m.aoMap = ao;
      m.onBeforeCompile = (s) => {
        s.fragmentShader = s.fragmentShader.replace(
          "#include <aomap_fragment>",
          "#include <aomap_fragment>\nreflectedLight.directDiffuse *= ambientOcclusion;\nreflectedLight.directSpecular *= mix(1.0, ambientOcclusion, 0.7);",
        );
      };
    }
    const lm = /^Label(\d)$/.exec(m.name);
    if (lm) labels[Number(lm[1])]!.push(m);
    const tm = /^Trim(?:\.(\d+))?$/.exec(m.name);
    if (tm) trims[tm[1] ? Number(tm[1]) : 0]!.push(m);
  });

  // Solid pass, multisampled because the composer draws off screen
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType }));
  composer.renderToScreen = true;
  composer.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.05, 0.5, 2);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // Blueprint pass: normals and depth into a target, then lines drawn over the solid pass
  const normalTarget = new THREE.WebGLRenderTarget(1, 1, { depthTexture: new THREE.DepthTexture(1, 1) });
  const normalMat = new THREE.MeshNormalMaterial();
  const lineMat = new THREE.ShaderMaterial({ ...BLUEPRINT, uniforms: THREE.UniformsUtils.clone(BLUEPRINT.uniforms), transparent: true, depthTest: false, depthWrite: false });
  lineMat.uniforms.tNormal!.value = normalTarget.texture;
  lineMat.uniforms.tDepth!.value = normalTarget.depthTexture;
  const quadScene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), lineMat);
  quad.frustumCulled = false;
  quadScene.add(quad);
  const quadCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const white = new THREE.Color(0xf2f4f1), green = new THREE.Color(0x3ee07a), trimWhite = new THREE.Color(0xd7e2ee), trimGreen = new THREE.Color(0x2fd06a);
  const tmp = new THREE.Color();

  const placeCamera = (t: number, zoom: number) => {
    const { pos, target } = camAt(t);
    cam.position.copy(pos);
    cam.up.set(0, 1, 0);
    // Straight down at the end: keep "up" on screen pointing away from the viewer, as Blender's track does
    if (t > 0.98) cam.up.set(0, 0, -1);
    cam.lookAt(target);
    cam.zoom = zoom;
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
  };

  const project = (v: THREE.Vector3) => {
    const q = v.clone().project(cam);
    return [((q.x + 1) / 2) * res[0], ((1 - q.y) / 2) * res[1]];
  };

  const anchors = (t: number, zoom: number): LiveAnchor => {
    placeCamera(t, zoom);
    const lift = liftAt(t), c = coreAt(t);
    const zs = LAYER_H.map((h, k) => REST[k]! + lift * k * 0.34 + h * 0.6);
    const top = REST[4]! + lift * 4 * 0.34 + 0.12;
    const centre = project(b2t([0, 0, top]));
    return {
      layers: zs.map((z) => project(b2t([R2 * 0.98, -0.5, z]))),
      left: zs.map((z) => project(b2t([-R2 * 0.98, -0.5, z]))),
      hollow: project(b2t([0, 0, 0.12])),
      core: project(b2t([0, 0, 1.9 * c + 0.2])),
      centre,
      rim: Math.abs(project(b2t([R2 + 0.12, 0, REST[4]! + 0.12]))[0]! - project(b2t([0, 0, REST[4]! + 0.12]))[0]!),
    };
  };

  let cssW = 1, cssH = 1;
  const setSize = (w: number, h: number) => {
    cssW = Math.max(1, w); cssH = Math.max(1, h);
    // Keep the drawing under about four million pixels, whatever the screen
    const pr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4e6 / (cssW * cssH)));
    renderer.setPixelRatio(pr);
    renderer.setSize(cssW, cssH, false);
    composer.setPixelRatio(pr);
    composer.setSize(cssW, cssH);
    bloom.resolution.set(cssW / 2, cssH / 2);
    normalTarget.setSize(Math.round(cssW * pr), Math.round(cssH * pr));
    lineMat.uniforms.texel!.value.set(1 / (cssW * pr), 1 / (cssH * pr));
  };

  const draw = ({ t, spin, bp, zoom }: LiveState) => {
    placeCamera(t, zoom);
    spinner.rotation.y = THREE.MathUtils.degToRad(spin);
    const lift = liftAt(t);
    layers.forEach((o, k) => { o.position.y = lift * k * 0.34; });
    const c = coreAt(t);
    coreBase.visible = column.visible = c > 0.01;
    coreBase.scale.set(Math.max(c, 0.001), 1, Math.max(c, 0.001));
    column.scale.set(1, Math.max(c, 0.001), 1);
    glow.intensity = 6 * c;
    dashes.visible = seg(t, 0.2, 0.28) * (1 - seg(t, 0.6, 0.66)) >= 0.5;
    let front = 0;
    for (let i = 0; i < 6; i++) {
      const s = Math.max(0, Math.cos(THREE.MathUtils.degToRad(i * 60 + 30 + spin - 270))) ** 10;
      front = Math.max(front, s);
      const g = i === SALES ? seg(t, 0.74, 0.84) : seg(t, 0.88 + i * 0.015, 0.95 + i * 0.015);
      tmp.copy(trimWhite).lerp(trimGreen, g);
      for (const m of trims[i]!) { m.emissive.copy(tmp); m.emissiveIntensity = 2 + 4 * g + 4 * s * (1 - g); }
      for (const m of labels[i]!) { m.emissive.copy(white).lerp(green, s); m.emissiveIntensity = 1.3 * (1 + 1.3 * s); }
    }
    spill.intensity = 0.5 * front * (1 - seg(t, 0.14, 0.3));

    renderer.setRenderTarget(null);
    renderer.clear();
    if (bp < 0.999) composer.render();
    if (bp > 0.001) {
      // Lines only from the engine, as in the film's blueprint: no floor, no floor rings
      floor.visible = false; rings.visible = false;
      const fog = scene.fog, back = scene.background;
      scene.fog = null; scene.background = null;
      scene.overrideMaterial = normalMat;
      renderer.setRenderTarget(normalTarget);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, cam);
      scene.overrideMaterial = null;
      scene.fog = fog; scene.background = back;
      floor.visible = true; rings.visible = true;
      renderer.setRenderTarget(null);
      lineMat.uniforms.opacity!.value = bp;
      renderer.render(quadScene, quadCam);
    }
  };

  return {
    res,
    draw,
    anchors,
    setSize,
    dispose: () => {
      composer.dispose();
      normalTarget.dispose();
      renderer.dispose();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: THREE.Material) => m.dispose());
        }
      });
      ao.dispose();
      floorLight.dispose();
    },
  };
}
