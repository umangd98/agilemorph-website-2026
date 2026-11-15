import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

/**
 * The closed department engine, live. The model and its contact shading come
 * from the same Blender scene as the film (3d/deconstruction/film.py, glb mode):
 * shading that doesn't depend on the light is baked in, while the lights, the
 * team spotlight and the green spill are live, so the engine can turn freely.
 */
export type EngineHandle = { setSpin: (deg: number) => void; resize: () => void; dispose: () => void };

const BASE = "/deconstruction-three";

export async function createEngine(canvas: HTMLCanvasElement, mobile: boolean): Promise<EngineHandle> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.75 : 2));
  renderer.toneMapping = THREE.AgXToneMapping;
  RectAreaLightUniformsLib.init();

  const scene = new THREE.Scene();
  const bg = new THREE.Color().setRGB(5 / 255, 6 / 255, 7 / 255, THREE.SRGBColorSpace);
  scene.background = bg;
  scene.fog = new THREE.Fog(bg, 16, 30);

  // Same lens and position as the film's opening shot
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 200);
  cam.position.set(0, 6.4, 12.8);
  cam.lookAt(0, 0.7, 0);

  // Blender's area lights, as soft rectangle lights
  const area = (pos: [number, number, number], size: number, intensity: number, colour: THREE.ColorRepresentation) => {
    const l = new THREE.RectAreaLight(colour, intensity, size, size);
    l.position.set(...pos);
    l.lookAt(0, 0, 0);
    scene.add(l);
  };
  area([-7, 9, 8], 7, 1.4, 0xffeed9);
  area([7, 5, -9], 6, 1.0, new THREE.Color(0.62, 0.78, 1.0));
  area([0, 11, 0], 9, 0.12, 0xffffff);
  // The wedge facing the camera is always in the same place, so its green spill is a fixed light
  const spill = new THREE.PointLight(0x3ee07a, 0, 4, 1.6);
  spill.position.set(0, 2.2, 2.2);
  scene.add(spill);

  const tl = new THREE.TextureLoader();
  const [ao, floorLight, gltf] = await Promise.all([
    tl.loadAsync(`${BASE}/ao.webp`),
    tl.loadAsync(`${BASE}/floor-light.webp`),
    new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath("/draco/")).loadAsync(`${BASE}/engine.glb`),
  ]);
  ao.channel = 1;
  ao.flipY = false;

  // The floor's light and shadow are baked; the engine is round, so they hold as it turns
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(16, 128),
    new THREE.MeshBasicMaterial({ map: floorLight, color: new THREE.Color(0.012, 0.0125, 0.0135) }),
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const labels: THREE.MeshStandardMaterial[] = [];
  const trims: THREE.MeshStandardMaterial[] = [];
  let engine: THREE.Object3D | null = null;
  gltf.scene.traverse((o) => {
    if (!engine && o.name.startsWith("Engine")) engine = o;
    if (!(o instanceof THREE.Mesh)) return;
    const m = o.material as THREE.MeshStandardMaterial;
    // Glowing parts skip the baked shading: their thin islands in the bake would break them into dashes
    const glows = /^(Trim|Label|Band|DbRing)/.test(m.name);
    if (!glows && (o.name.startsWith("Engine") || o.parent?.name.startsWith("Engine"))) {
      m.aoMap = ao;
      // Let the baked shading darken direct light too, not only ambient
      m.onBeforeCompile = (s) => {
        s.fragmentShader = s.fragmentShader.replace(
          "#include <aomap_fragment>",
          "#include <aomap_fragment>\nreflectedLight.directDiffuse *= ambientOcclusion;\nreflectedLight.directSpecular *= mix(1.0, ambientOcclusion, 0.7);",
        );
      };
    }
    const lm = /^Label(\d)$/.exec(m.name);
    if (lm) labels[Number(lm[1])] = m;
    const tm = /^Trim(?:\.(\d+))?$/.exec(m.name);
    if (tm) trims[tm[1] ? Number(tm[1]) : 0] = m;
  });
  scene.add(gltf.scene);

  // The composer draws off screen, so it needs its own multisampling or thin trims break into dashes
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { samples: 4, type: THREE.HalfFloatType }));
  composer.addPass(new RenderPass(scene, cam));
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.05, 0.5, 2);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const white = new THREE.Color(0xf2f4f1), green = new THREE.Color(0x3ee07a), trimWhite = new THREE.Color(0xd7e2ee);
  let spin = 8;

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    cam.aspect = w / h;
    // Desktop film: 38mm lens across a 36mm-wide sensor. Phone film: 36mm lens, 24mm-tall sensor.
    cam.fov = THREE.MathUtils.radToDeg(mobile ? 2 * Math.atan(12 / 36) : 2 * Math.atan(18 / 38 / (w / h)));
    cam.updateProjectionMatrix();
  };

  const render = () => {
    const e = engine as THREE.Object3D | null;
    if (e) e.rotation.y = THREE.MathUtils.degToRad(spin);
    let front = 0;
    for (let i = 0; i < 6; i++) {
      const s = Math.max(0, Math.cos(THREE.MathUtils.degToRad(i * 60 + 30 + spin - 270))) ** 10;
      front = Math.max(front, s);
      const l = labels[i];
      if (l) { l.emissive.copy(white).lerp(green, s); l.emissiveIntensity = 1.3 * (1 + 1.3 * s); }
      const t = trims[i];
      if (t) { t.emissive.copy(trimWhite); t.emissiveIntensity = 2 + 4 * s; }
    }
    spill.intensity = 0.5 * front;
    composer.render();
  };

  resize();
  return {
    setSpin: (deg) => { spin = deg; render(); },
    resize: () => { resize(); render(); },
    dispose: () => {
      composer.dispose();
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
