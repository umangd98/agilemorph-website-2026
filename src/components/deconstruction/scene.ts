import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { GTAOPass } from "three/addons/postprocessing/GTAOPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";

import { clamp01, ease, mix, seg } from "./story";

/*
 * The teardown scene. The models come from Blender (3d/deconstruction/kit.py),
 * exported as one GLB with every part named. Everything here is posed from a
 * single scroll position p (0..1) plus a clock t for things that idle, such as
 * particles and pulses. Labels are DOM elements over the canvas, positioned by
 * projecting 3D anchor points every frame.
 */

const DEPTS = ["Operations", "Finance", "Customer support", "Sales", "Marketing", "People and HR"];
const OPS = 0, FIN = 1, SUP = 2, SALES = 3, MKT = 4, NEXT = 1;
const GREEN = new THREE.Color(0x2fd06a);
const AMBER = new THREE.Color(0xe0a24a);
const TRIM = new THREE.Color(0xd7e2ee);
const CLAY = new THREE.Color(0xc9ced4);

/** Rest heights of each part inside a module, from the Blender kit. */
const REST = [0, 0.14, 0.58, 1.06, 1.44];
const DATA_TOP = 0.58;
const AI_H = 0.18;
const RING_R = 4.4;

type Quality = "high" | "low";

export type SceneHandle = {
  render: (p: number, t: number) => void;
  resize: () => void;
  dispose: () => void;
};

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.4, "rgba(255,255,255,.8)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function bezier(out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3, u: number) {
  const iu = 1 - u;
  return out.set(
    iu * iu * a.x + 2 * iu * u * b.x + u * u * c.x,
    iu * iu * a.y + 2 * iu * u * b.y + u * u * c.y,
    iu * iu * a.z + 2 * iu * u * b.z + u * u * c.z,
  );
}

function path(points: THREE.Vector3[], u: number, out: THREE.Vector3) {
  const lens: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = points[i]!.distanceTo(points[i - 1]!);
    lens.push(l);
    total += l;
  }
  let d = clamp01(u) * total;
  for (let i = 1; i < points.length; i++) {
    const l = lens[i - 1]!;
    if (d <= l) return out.copy(points[i - 1]!).lerp(points[i]!, l ? d / l : 0);
    d -= l;
  }
  return out.copy(points[points.length - 1]!);
}

/** Collect every mesh material under an object, cloned so this object can be tinted on its own. */
function ownMaterials(root: THREE.Object3D) {
  const mats: THREE.MeshStandardMaterial[] = [];
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const list = Array.isArray(m.material) ? m.material : [m.material];
    const cloned = list.map((x) => (x as THREE.MeshStandardMaterial).clone());
    m.material = Array.isArray(m.material) ? cloned : cloned[0]!;
    mats.push(...cloned);
    m.castShadow = true;
    m.receiveShadow = true;
  });
  return mats;
}

export async function createScene(container: HTMLElement, overlay: HTMLElement, opts: { quality: Quality; reduced: boolean }): Promise<SceneHandle> {
  const high = opts.quality === "high";
  const renderer = new THREE.WebGLRenderer({ antialias: !high, powerPreference: "high-performance" });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = high;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  container.appendChild(renderer.domElement);
  renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050607);
  scene.fog = new THREE.Fog(0x050607, 22, 48);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.42;

  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 200);

  const target = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, samples: high ? 4 : 0 });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  let gtao: GTAOPass | null = null;
  if (high) {
    gtao = new GTAOPass(scene, camera, 4, 4);
    gtao.blendIntensity = 0.9;
    gtao.updateGtaoMaterial({ radius: 0.35, distanceExponent: 1.5, thickness: 1.0, scale: 1.0, samples: 12 });
    composer.addPass(gtao);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(4, 4), 0.42, 0.5, 0.92);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* Lights */
  const key = new THREE.DirectionalLight(0xfff0de, 2.4);
  key.position.set(-8, 14, 9);
  key.castShadow = high;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11, near: 1, far: 40 });
  key.shadow.radius = 6;
  key.shadow.blurSamples = 16;
  key.shadow.bias = -0.0004;
  const rim = new THREE.DirectionalLight(0x8fc4ff, 1.3);
  rim.position.set(7, 6, -11);
  scene.add(key, rim, new THREE.HemisphereLight(0x9fb0c4, 0x050607, 0.35));
  const hubLight = new THREE.PointLight(0x2fd06a, 0, 9, 1.6);
  hubLight.position.y = 1.6;
  scene.add(hubLight);

  /* Floor and depth */
  const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 96), new THREE.MeshStandardMaterial({ color: 0x08090b, roughness: 0.62, metalness: 0.1 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x1d252e, transparent: true, opacity: 0.9 });
  for (const r of [2.6, 5.9, 8.4]) {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 4, 192), ringMat);
    m.rotation.x = -Math.PI / 2;
    m.position.y = 0.003;
    scene.add(m);
  }
  const dot = dotTexture();
  const points = (count: number, color: number, size: number) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({ color, size, map: dot, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    p.frustumCulled = false;
    scene.add(p);
    return p;
  };
  const far = points(1600, 0x7f92a8, 0.07);
  {
    const r = rng(31);
    const a = far.geometry.attributes.position!.array as Float32Array;
    for (let i = 0; i < 1600; i++) {
      const ang = r() * Math.PI * 2, rad = 10 + r() * 30;
      a[i * 3] = Math.cos(ang) * rad;
      a[i * 3 + 1] = r() * 16;
      a[i * 3 + 2] = Math.sin(ang) * rad;
    }
    far.material.opacity = 0.5;
  }
  const nearSeeds = (() => {
    const r = rng(37);
    return Array.from({ length: 260 }, () => { const ang = r() * Math.PI * 2, rad = 1.5 + r() * 11; return { x: Math.cos(ang) * rad, z: Math.sin(ang) * rad, y: r() * 6, v: 0.04 + r() * 0.08 }; });
  })();
  const near = points(nearSeeds.length, 0xa9bccf, 0.13);
  near.material.opacity = 0.2;

  /* Models */
  const draco = new DRACOLoader().setDecoderPath("/draco/");
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync("/deconstruction/kit.glb");
  draco.dispose();
  const kit = gltf.scene;
  // Index every part by name before anything is moved out of the kit
  const byName = new Map<string, THREE.Object3D>();
  kit.traverse((ob) => { if (ob.name && !byName.has(ob.name)) byName.set(ob.name, ob); });
  const get = (name: string) => {
    const o = byName.get(name);
    if (!o) throw new Error(`Missing ${name} in kit.glb`);
    return o;
  };

  const ringPos = DEPTS.map((_, i) => { const a = -Math.PI / 2 + (i / DEPTS.length) * Math.PI * 2 + Math.PI / 6; return new THREE.Vector3(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R); });
  const chartPos = DEPTS.map((_, i) => new THREE.Vector3((i - 2.5) * 2.1, 0, 1.2));

  const mods = DEPTS.map((name, i) => {
    const root = get(`M${i}`);
    scene.add(root);
    root.position.set(0, 0, 0);
    root.rotation.set(0, 0, 0);
    const parts = (["base", "data", "tools", "people", "plate"] as const).map((k) => get(`M${i}_${k}`));
    const mats = ownMaterials(root);
    // Keep text and screens crisp: bright enough to read, not so bright they bloom
    mats.forEach((m) => {
      if (m.name === "Text") m.emissiveIntensity = 0.55;
      if (m.name === "TextSub") m.emissiveIntensity = 0.35;
      if (m.name.startsWith("Screen")) m.emissiveIntensity = 1.1;
      if (m.name === "DbRing") m.emissiveIntensity = 1.4;
    });
    const trims = mats.filter((m) => m.name === "Trim");
    const clay = mats.filter((m) => m.name === "Clay");
    return { name, root, parts, trims, clay, usage: 0, nudged: 0 };
  });

  const leader = get("Leader");
  scene.add(leader);
  const leaderMats = ownMaterials(leader);
  leaderMats.forEach((m) => { m.transparent = true; if (m.name === "Text") m.emissiveIntensity = 0.55; });

  const hub = get("Hub");
  scene.add(hub);
  hub.position.set(0, 0, 0);
  ownMaterials(hub).forEach((m) => {
    if (m.name === "GreenTrim") m.emissiveIntensity = 2.2;
    if (m.name === "AICore") m.emissiveIntensity = 3.5;
  });
  const hubBase = get("HubBase"), hubRim = get("HubRim"), hubColumn = get("HubColumn"), hubCore = get("HubCore");
  const hubRings = [0, 1, 2].map((k) => get(`HubRing${k}`));
  const skillRing = get("SkillRing");
  const columnMat = ((hubColumn as THREE.Mesh).material as THREE.MeshStandardMaterial);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 10, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x2fd06a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  beam.position.y = 5;
  scene.add(beam);

  const aiTemplate = get("AILayer");
  const aiSlabs = mods.map(() => {
    const g = aiTemplate.clone(true);
    g.position.set(0, 0, 0);
    scene.add(g);
    const mats = ownMaterials(g);
    return { g, mats };
  });

  // The empty slot in each team, outlined in green until the AI layer lands in it
  const slotMat = new THREE.LineBasicMaterial({ color: 0x2fd06a, transparent: true, opacity: 0 });
  const slotGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.86, AI_H * 0.85, 1.28));
  const slots = mods.map(() => { const l = new THREE.LineSegments(slotGeo, slotMat); scene.add(l); return l; });

  const sinks = (["SinkChat", "SinkSheet", "SinkMail"] as const).map((n) => {
    const g = get(n);
    scene.add(g);
    const mats = ownMaterials(g);
    mats.forEach((m) => { m.transparent = true; });
    return { g, mats, pos: new THREE.Vector3() };
  });

  /* Connections from the hub, as glowing cables with pulses */
  const conns = ringPos.map((p) => {
    const dir = p.clone().normalize();
    const end = p.clone().addScaledVector(dir, -1.05).setY(DATA_TOP + AI_H / 2);
    const start = dir.clone().multiplyScalar(1.2).setY(0.3);
    const mid = start.clone().lerp(end, 0.5).setY(1.3);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0f3a22, emissive: 0x2fd06a, emissiveIntensity: 0.9, transparent: true, opacity: 0, roughness: 0.4 });
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.032, 8), mat);
    scene.add(tube);
    return { curve, mat };
  });
  const PULSE = 8;
  const pulses = points(conns.length * PULSE, 0xd6ffe6, 0.22);

  /* Work between teams, leaks, the request */
  const edges = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4], [2, 5]] as const;
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x5b6672, transparent: true, opacity: 0 });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(edges.length * 6), 3));
  const edgeLines = new THREE.LineSegments(edgeGeo, edgeMat);
  edgeLines.frustumCulled = false;
  scene.add(edgeLines);
  const hierMat = new THREE.LineBasicMaterial({ color: 0x9aa2ad, transparent: true });
  const hierGeo = new THREE.BufferGeometry();
  hierGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(DEPTS.length * 18), 3));
  const hierLines = new THREE.LineSegments(hierGeo, hierMat);
  hierLines.frustumCulled = false;
  scene.add(hierLines);

  const work = (() => { const r = rng(43); return Array.from({ length: 90 }, () => ({ e: Math.floor(r() * edges.length), off: r(), speed: 0.1 + r() * 0.08, dir: r() > 0.5 })); })();
  const workPts = points(work.length, 0xdfe6ee, 0.13);
  const leakSeeds = (() => { const r = rng(41); const s: Array<{ i: number; sink: number; off: number; speed: number }> = []; for (let i = 0; i < 6; i++) for (let k = 0; k < 12; k++) s.push({ i, sink: Math.floor(r() * 3), off: r(), speed: 0.16 + r() * 0.12 }); return s; })();
  const leakPts = points(leakSeeds.length, 0xe0a24a, 0.2);
  const TRAIL = 16;
  const trail = points(TRAIL, 0xffffff, 0.24);
  const token = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(token);
  const tokenLight = new THREE.PointLight(0xffffff, 0, 4, 2);
  scene.add(tokenLight);

  /* Adoption rings, cached by how full they are */
  const arcCache = new Map<number, THREE.TorusGeometry>();
  const arcGeo = (f: number) => { const q = Math.max(1, Math.round(f * 40)); let g = arcCache.get(q); if (!g) { g = new THREE.TorusGeometry(1.45, 0.04, 8, 96, (q / 40) * Math.PI * 2); arcCache.set(q, g); } return g; };
  const usageRings = mods.map((_, i) => {
    const bg = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.02, 6, 96), new THREE.MeshBasicMaterial({ color: 0x3a434e, transparent: true, opacity: 0 }));
    const fg = new THREE.Mesh(arcGeo(0.01), new THREE.MeshBasicMaterial({ color: 0x2fd06a, transparent: true, opacity: 0 }));
    for (const r of [bg, fg]) { r.rotation.x = -Math.PI / 2; r.position.copy(ringPos[i]!).setY(0.02); scene.add(r); }
    fg.rotation.z = Math.PI / 2;
    return { bg, fg };
  });
  const stageRing = (() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 160; i++) { const a = (i / 160) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * 2.7, 0.03, Math.sin(a) * 2.7)); }
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineDashedMaterial({ color: 0x2fd06a, dashSize: 0.18, gapSize: 0.12, transparent: true, opacity: 0 }));
    l.computeLineDistances();
    scene.add(l);
    return l;
  })();

  /* Overlay labels */
  const el = (cls: string, html = "") => { const d = document.createElement("div"); d.className = cls; d.innerHTML = html; d.style.opacity = "0"; overlay.appendChild(d); return d; };
  const teamLabels = DEPTS.map((n) => el("pointer-events-none absolute left-0 top-0 whitespace-nowrap font-display text-sm font-semibold text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,.9)]", n));
  const partLabel = (title: string, sub: string, green = false) =>
    el(
      "pointer-events-none absolute left-0 top-0 flex items-center gap-2",
      `<span class="h-1.5 w-1.5 rounded-full ${green ? "bg-[#2fd06a]" : "bg-white"}"></span><span class="h-px w-12 ${green ? "bg-[#2fd06a]/80" : "bg-white/40"}"></span><span class="leading-tight [text-shadow:0_1px_12px_rgba(0,0,0,.9)]"><span class="block font-display text-[15px] font-semibold ${green ? "text-[#5cd68b]" : "text-white"}">${title}</span><span class="block text-xs text-white/60">${sub}</span></span>`,
    );
  const parts = { people: partLabel("People", "The sales team"), tools: partLabel("Tools", "CRM, inbox, sheets"), ai: partLabel("AI layer", "Built in by Agilemorph", true), data: partLabel("Data", "Deals, contacts, quotes") };
  const reqEl = el("pointer-events-none absolute left-0 top-0 text-center leading-tight [text-shadow:0_1px_14px_rgba(0,0,0,.95)]");
  const tag = (text: string, tone: "green" | "amber" | "mint" | "dark") =>
    el(`pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-full px-3 py-1 text-[13px] font-semibold ${tone === "green" ? "bg-[#2fd06a] text-[#08130c]" : tone === "amber" ? "bg-[#e0a24a] text-[#1a1206]" : tone === "mint" ? "bg-[#9dffc4] text-[#08130c]" : "bg-[#15191f]/95 text-white ring-1 ring-white/15"}`, text);
  const tags = {
    hub: tag("AI hub", "mint"),
    ship: tag("Live with Sales first", "green"),
    nudge: tag("Usage dropped. Nudged.", "amber"),
    usage: el("pointer-events-none absolute left-0 top-0 whitespace-nowrap text-[13px] text-white/75", "Rings show who's using it"),
    feedback: tag("“Can it draft the replies too?”", "dark"),
    skill: tag("New: drafts replies", "mint"),
    next: tag("Next workflow", "amber"),
  };
  const loopTags = (["Find", "Build", "Ship", "Adopt", "Iterate"] as const).map((n) => tag(n, "dark"));

  /* Camera path along the scroll: p, azimuth, elevation, distance, target x, y, z */
  const KEYS: number[][] = [
    [0.0, 0.0, 0.1, 16.5, 0, 1.3, 0],
    [0.05, 0.03, 0.12, 16.5, 0, 1.25, 0],
    [0.17, 0.55, 0.78, 19.5, 0, 0.4, 0],
    [0.24, 0.85, 0.46, 17, 0.8, 1.5, -0.5],
    [0.3, 1.0, 0.42, 16.5, 0.9, 1.5, -0.6],
    [0.37, 1.15, 0.66, 21, 0, 0.6, 0],
    [0.45, 1.3, 0.64, 20.5, 0, 0.6, 0],
    [0.5, 1.5, 0.3, 13, 0, 1.2, 0],
    [0.6, 1.8, 0.5, 17.5, 0, 0.9, 0],
    [0.7, 2.05, 0.74, 19, 0, 0.4, 0],
    [0.82, 2.3, 0.86, 18.5, 0, 0.3, 0],
    [0.9, 2.55, 0.62, 18, 0, 0.4, 0],
    [1.0, 2.95, 0.56, 18.5, 0, 0.5, 0],
  ];
  function camAt(p: number) {
    let k = 0;
    while (k < KEYS.length - 2 && p > KEYS[k + 1]![0]!) k++;
    const A = KEYS[k]!, B = KEYS[k + 1]!;
    const u = ease(clamp01((p - A[0]!) / (B[0]! - A[0]!)));
    return A.map((v, j) => mix(v, B[j]!, u));
  }

  const pos = DEPTS.map(() => new THREE.Vector3());
  const slotWorld = DEPTS.map(() => new THREE.Vector3());
  const tmp = new THREE.Vector3(), o = new THREE.Vector3(), a = new THREE.Vector3(), b = new THREE.Vector3();
  const usage = (i: number, p: number) => {
    if (i === SALES) return seg(p, 0.62, 0.7);
    const ad = clamp01((p - 0.75) / 0.12);
    const u = clamp01(ad * 1.5 - ((i + 1) / DEPTS.length) * 0.5);
    if (i === MKT) { const dip = seg(ad, 0.35, 0.5) * (1 - seg(ad, 0.66, 0.85)); return clamp01(u - dip * 0.55); }
    return u;
  };
  const nudgeAt = (p: number) => { const ad = clamp01((p - 0.75) / 0.12); return seg(ad, 0.38, 0.48) * (1 - seg(ad, 0.7, 0.8)); };

  function requestAt(p: number, t: number, out: THREE.Vector3): [string, string, boolean] | null {
    const lift = (v: THREE.Vector3) => v.clone().setY(2.0);
    if (p >= 0.3 && p < 0.47) {
      const u = clamp01((p - 0.3) / 0.15);
      const S = lift(pos[SALES]!), F = lift(pos[FIN]!), O = lift(pos[OPS]!), W = sinks[0]!.pos;
      if (u < 0.3) { path([S, F], u / 0.3, out); return ["A request comes in", "Asked on WhatsApp", u > 0.1]; }
      if (u < 0.5) { out.copy(F); out.y += Math.sin(t * 6) * 0.05; return ["Copied into a spreadsheet", "Waiting for someone to pick it up", true]; }
      if (u < 0.72) { path([F, O], (u - 0.5) / 0.22, out); return ["Retyped into the system", "By hand, by another team", true]; }
      const a2 = O.clone(), b2 = O.clone().lerp(W, 0.5); b2.y = 3.6;
      bezier(out, a2, b2, W, (u - 0.72) / 0.28);
      return ["Lost in a chat thread", "Nobody can say where it went", true];
    }
    if (p >= 0.62 && p < 0.775) {
      const u = clamp01((p - 0.635) / 0.11);
      const Hc = new THREE.Vector3(0, 2.1, 0);
      path([lift(pos[SALES]!), Hc, lift(pos[FIN]!), Hc, lift(pos[OPS]!), Hc, lift(pos[SUP]!)], u, out);
      return u < 1 ? ["The same request", "Captured once, routed by the AI layer", false] : ["Done", "Nothing retyped, nothing lost", false];
    }
    return null;
  }

  let W = 1, H = 1, wide = true;
  function resize() {
    W = container.clientWidth || 1;
    H = container.clientHeight || 1;
    wide = W >= 860;
    const pr = Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1.25);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(pr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.fov = W < 700 ? 48 : 34;
    if (wide) camera.setViewOffset(W, H, -W * 0.15, 0, W, H);
    // On phones the copy sits at the bottom, so lift the scene into the top part of the screen
    else camera.setViewOffset(W, H, 0, H * 0.17, W, H);
    camera.updateProjectionMatrix();
  }
  resize();

  const show = (e: HTMLElement, op: number, v?: THREE.Vector3, dx = 0, dy = 0, center = true) => {
    if (op < 0.01 || !v) { e.style.opacity = "0"; return; }
    tmp.copy(v).project(camera);
    if (tmp.z > 1) { e.style.opacity = "0"; return; }
    const x = (tmp.x * 0.5 + 0.5) * W + dx, y = (-tmp.y * 0.5 + 0.5) * H + dy;
    e.style.opacity = op.toFixed(3);
    e.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)${center ? " translate(-50%, -50%)" : " translate(0, -50%)"}`;
  };

  function render(p: number, t: number) {
    const explode = seg(p, 0.2, 0.28) * (1 - seg(p, 0.6, 0.7));
    const ship = seg(p, 0.62, 0.7);
    const it = clamp01((p - 0.885) / 0.11);
    const hubB = seg(p, 0.46, 0.53);
    const slot = seg(p, 0.34, 0.42) * (1 - seg(p, 0.5, 0.56));
    const links = seg(p, 0.58, 0.66);
    const flow = seg(p, 0.8, 0.9);

    /* Modules: stand as a chart, fly to the ring, grow their layers, come apart, take the AI layer, close up */
    mods.forEach((m, i) => {
      const flip = seg(p, 0.05 + i * 0.012, 0.15 + i * 0.012);
      const grow = seg(p, 0.13 + i * 0.01, 0.21 + i * 0.01);
      pos[i]!.copy(chartPos[i]!).lerp(ringPos[i]!, flip);
      m.root.position.copy(pos[i]!);
      m.root.position.y = Math.sin(flip * Math.PI) * 1.2;
      const aiOpen = seg(p, 0.48 + i * 0.015, 0.55 + i * 0.015);
      let lift = 0;
      m.parts.forEach((part, k) => {
        if (k > 0) lift += explode * (0.16 + k * 0.13);
        const shift = k >= 2 ? AI_H * aiOpen : 0;
        if (k < 4) {
          part.scale.set(1, Math.max(0.001, grow), 1);
          part.visible = grow > 0.01;
          part.position.set(Math.sin(k * 1.7 + i) * 0.1 * explode, (REST[k]! + shift) * grow + lift, 0);
          part.rotation.set(0, explode * (k - 2) * 0.12, explode * 0.04 * (k % 2 ? 1 : -1));
        } else {
          // The plate stands up in the chart and lies on top of its team afterwards
          const top = (REST[4]! + shift) * grow + lift;
          part.position.set(0, mix(1.1, top, flip), mix(0.0, 0, flip));
          part.rotation.set(mix(Math.PI / 2, 0, flip) + explode * 0.03, explode * 0.2, 0);
        }
      });
      const dataLift = explode * (0.16 + 0.13);
      slotWorld[i]!.set(pos[i]!.x, m.root.position.y + (DATA_TOP * grow + dataLift) + explode * 0.06, pos[i]!.z);
      const sl = slots[i]!;
      sl.position.copy(slotWorld[i]!).setY(slotWorld[i]!.y + AI_H * 0.45);
      sl.rotation.y = m.parts[1]!.rotation.y;
      sl.visible = slot > 0.01 && aiOpen < 0.98;
      const u = usage(i, p);
      const n = i === MKT ? nudgeAt(p) : 0;
      m.trims.forEach((tm) => { tm.emissive.copy(TRIM).lerp(GREEN, u).lerp(AMBER, n); tm.emissiveIntensity = mix(0.9, 1.8, Math.max(u, n)); });
      m.clay.forEach((cm) => { cm.color.copy(CLAY).lerp(GREEN, u * 0.85); cm.emissive.copy(GREEN); cm.emissiveIntensity = u * 0.35; });
      m.usage = u;
      m.nudged = n;
      const showRing = seg(p, 0.64, 0.7) * (1 - seg(p, 0.91, 0.95));
      const ur = usageRings[i]!;
      (ur.bg.material as THREE.MeshBasicMaterial).opacity = showRing * 0.5;
      ur.fg.geometry = arcGeo(Math.max(0.01, u));
      const fgm = ur.fg.material as THREE.MeshBasicMaterial;
      fgm.opacity = showRing * (u > 0.01 ? 1 : 0);
      fgm.color.set(n > 0.3 ? 0xe0a24a : 0x2fd06a);
      const bgm = ur.bg.material as THREE.MeshBasicMaterial;
      if (i === NEXT && it > 0.72) { bgm.color.set(0xe0a24a); bgm.opacity = seg(it, 0.72, 0.82) * (0.5 + 0.5 * Math.sin(t * 5) ** 2); }
      else bgm.color.set(0x3a434e);
    });

    /* Leadership and reporting lines, only in the chart */
    const lflip = seg(p, 0.04, 0.12);
    leader.position.set(0, mix(3.3, 7, lflip), mix(1.2, -4, lflip));
    leader.rotation.set(Math.PI / 2, 0, 0);
    leaderMats.forEach((m) => { m.opacity = 1 - lflip; });
    leader.visible = lflip < 0.99;
    const hp = hierGeo.attributes.position!.array as Float32Array;
    let h = 0;
    const P3 = (x: number, y: number, z: number) => { hp[h++] = x; hp[h++] = y; hp[h++] = z; };
    mods.forEach((m) => { const c = m.root.position; P3(0, 2.6, 1.2); P3(0, 2.35, 1.2); P3(0, 2.35, 1.2); P3(c.x, 2.35, c.z); P3(c.x, 2.35, c.z); P3(c.x, c.y + 1.82, c.z); });
    hierGeo.attributes.position!.needsUpdate = true;
    hierMat.opacity = 1 - seg(p, 0.03, 0.08);

    const ep = edgeGeo.attributes.position!.array as Float32Array;
    edges.forEach(([i, j], n) => ep.set([pos[i]!.x, 0.05, pos[i]!.z, pos[j]!.x, 0.05, pos[j]!.z], n * 6));
    edgeGeo.attributes.position!.needsUpdate = true;
    edgeMat.opacity = seg(p, 0.14, 0.2) * mix(0.55, 0.15, links);
    slotMat.opacity = slot * (0.55 + 0.45 * Math.sin(t * 4) ** 2);

    /* Hub: the base rises, the column grows, rings drop in one by one */
    hub.visible = hubB > 0.001;
    hubBase.scale.setScalar(Math.max(0.001, hubB));
    hubRim.scale.setScalar(Math.max(0.001, hubB));
    const col = Math.max(0.001, seg(p, 0.48, 0.53));
    hubColumn.scale.set(1, col, 1);
    hubCore.scale.set(1, col, 1);
    hubRings.forEach((r, k) => {
      const d = seg(p, 0.47 + k * 0.015, 0.52 + k * 0.015);
      r.visible = d > 0.01;
      r.position.y = mix(4.5, 0.95 + k * 0.32, d);
      r.rotation.set(Math.sin(t * 0.6 + k) * 0.18, t * (0.35 + k * 0.15), Math.cos(t * 0.5 + k) * 0.12);
    });
    columnMat.emissiveIntensity = 1.1 + flow * 0.5 * (1 + Math.sin(t * 2.4)) * 0.5;
    (beam.material as THREE.MeshBasicMaterial).opacity = seg(p, 0.5, 0.56) * 0.14 * (1 + 0.3 * Math.sin(t * 2));
    hubLight.intensity = hubB * 6;
    const skill = seg(it, 0.3, 0.45);
    skillRing.visible = skill > 0.01;
    skillRing.position.y = mix(3, 1.25, skill);

    /* AI layers fly from the hub into each team's open slot */
    aiSlabs.forEach((s, i) => {
      const f = seg(p, 0.5 + i * 0.016, 0.58 + i * 0.016);
      s.g.visible = f > 0.001;
      a.set(0, 2.1, 0);
      b.copy(slotWorld[i]!).lerp(a, 0.5);
      b.y = 3.4;
      bezier(o, a, b, slotWorld[i]!, f);
      s.g.position.copy(o);
      s.g.rotation.set(0, (1 - f) * 2.4 + mods[i]!.parts[1]!.rotation.y, 0);
      s.g.scale.setScalar(Math.max(0.001, mix(0.35, 1, f)));
      const glow = i === SALES ? ship : usage(i, p);
      s.mats.forEach((m) => { if (m.name === "AIGlass") m.emissiveIntensity = 0.8 + glow * 0.6; if (m.name === "AICore") m.emissiveIntensity = 3; });
    });

    /* Cables and pulses */
    conns.forEach((c, i) => { c.mat.opacity = links * (i === SALES ? 1 : mix(0.35, 1, usage(i, p))); });
    const pp = pulses.geometry.attributes.position!.array as Float32Array;
    conns.forEach((c, i) => {
      for (let k = 0; k < PULSE; k++) {
        const u = (t * 0.32 + k / PULSE) % 1;
        c.curve.getPointAt(k % 2 ? u : 1 - u, o);
        const j = (i * PULSE + k) * 3;
        pp[j] = o.x; pp[j + 1] = o.y; pp[j + 2] = o.z;
      }
    });
    pulses.geometry.attributes.position!.needsUpdate = true;
    pulses.material.opacity = links * mix(0.4, 1, Math.max(ship, flow));

    /* Camera */
    const [, az, el2, d0, tx, ty, tz] = camAt(p) as [number, number, number, number, number, number, number];
    const dist = wide ? d0 : d0 * 1.38 * (1 + 0.45 * (1 - seg(p, 0.05, 0.15)));
    camera.position.set(tx + Math.sin(az) * Math.cos(el2) * dist, ty + Math.sin(el2) * dist, tz + Math.cos(az) * Math.cos(el2) * dist);
    camera.lookAt(tx, ty, tz);
    camera.updateMatrixWorld();

    /* Leak objects float behind the network, as the camera sees it */
    const right = tmp.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize().clone();
    const fwd = new THREE.Vector3();
    camera.getWorldDirection(fwd);
    fwd.setY(0).normalize();
    [-3.8, 0.2, 4.2].forEach((side, i) => sinks[i]!.pos.set(fwd.x * 6 + right.x * side, 3.0 + (i === 1 ? 0.5 : 0), fwd.z * 6 + right.z * side));
    const leaks = seg(p, 0.33, 0.37) * (1 - seg(p, 0.48, 0.53));
    sinks.forEach((s, i) => {
      s.g.visible = leaks > 0.01;
      s.g.position.copy(s.pos);
      s.g.position.y += Math.sin(t * 1.3 + i) * 0.1;
      s.g.lookAt(camera.position);
      s.g.scale.setScalar(1.6);
      s.mats.forEach((m) => { m.opacity = leaks; });
    });
    const lp = leakPts.geometry.attributes.position!.array as Float32Array;
    leakSeeds.forEach((s, i) => {
      a.copy(pos[s.i]!).setY(1.4);
      const Wp = sinks[s.sink]!.pos;
      b.copy(a).lerp(Wp, 0.5);
      b.y = 3.8;
      bezier(o, a, b, Wp, (t * s.speed + s.off) % 1);
      lp[i * 3] = o.x; lp[i * 3 + 1] = o.y; lp[i * 3 + 2] = o.z;
    });
    leakPts.geometry.attributes.position!.needsUpdate = true;
    leakPts.material.opacity = leaks;

    /* Ambient work and dust */
    const wp = workPts.geometry.attributes.position!.array as Float32Array;
    work.forEach((s, i) => {
      const [ei, ej] = edges[s.e]!;
      const A = pos[s.dir ? ei : ej]!, Bn = pos[s.dir ? ej : ei]!;
      o.copy(A).lerp(Bn, (t * s.speed + s.off) % 1);
      wp[i * 3] = o.x; wp[i * 3 + 1] = 0.12; wp[i * 3 + 2] = o.z;
    });
    workPts.geometry.attributes.position!.needsUpdate = true;
    workPts.material.opacity = seg(p, 0.15, 0.2) * (1 - seg(p, 0.6, 0.66)) * 0.7;
    const np = near.geometry.attributes.position!.array as Float32Array;
    nearSeeds.forEach((s, i) => { np[i * 3] = s.x; np[i * 3 + 1] = (s.y + t * s.v) % 6; np[i * 3 + 2] = s.z; });
    near.geometry.attributes.position!.needsUpdate = true;
    far.rotation.y = t * 0.004;

    /* The request and its trail */
    const r = requestAt(p, t, o);
    if (r) {
      token.visible = true;
      token.position.copy(o);
      const tokenColor = r[2] ? 0xffc77a : p > 0.6 ? 0xb9ffd2 : 0xffffff;
      (token.material as THREE.MeshBasicMaterial).color.set(tokenColor);
      tokenLight.position.copy(o);
      tokenLight.intensity = 3;
      tokenLight.color.set(tokenColor);
      const tp = trail.geometry.attributes.position!.array as Float32Array;
      const here = o.clone();
      for (let k = 0; k < TRAIL; k++) {
        const back = requestAt(Math.max(0, p - (k + 1) * 0.0018), t, b) ? b : here;
        tp[k * 3] = back.x; tp[k * 3 + 1] = back.y; tp[k * 3 + 2] = back.z;
      }
      trail.geometry.attributes.position!.needsUpdate = true;
      trail.material.opacity = 0.5;
      trail.material.color.set(tokenColor);
      reqEl.innerHTML = `<span class="block font-display text-base font-semibold ${r[2] ? "text-[#e0a24a]" : "text-[#9dffc4]"}">${r[0]}</span><span class="block text-xs text-white/75">${r[1]}</span>`;
      show(reqEl, 1, here, 0, -46);
    } else {
      token.visible = false;
      tokenLight.intensity = 0;
      trail.material.opacity = 0;
      reqEl.style.opacity = "0";
    }
    (stageRing.material as THREE.LineDashedMaterial).opacity = seg(it, 0.5, 0.65) * 0.8;

    composer.render();

    /* Labels */
    const names = seg(p, 0.17, 0.22) * (1 - explode * 0.7);
    mods.forEach((m, i) => show(teamLabels[i]!, i === SALES && explode > 0.3 ? 0 : names, tmp.set(pos[i]!.x, 2.2, pos[i]!.z).clone()));
    const partOp = clamp01((explode - 0.3) / 0.5);
    const s = mods[SALES]!;
    const anchor = (k: number, dy: number) => new THREE.Vector3(pos[SALES]!.x + 1.0, s.root.position.y + s.parts[k]!.position.y + dy, pos[SALES]!.z);
    show(parts.people, partOp, anchor(3, 0.2), 0, 0, false);
    show(parts.tools, partOp, anchor(2, 0.2), 0, 0, false);
    show(parts.data, partOp, anchor(1, 0.15), 0, 0, false);
    show(parts.ai, partOp * (hubB > 0.5 ? 1 : 0), new THREE.Vector3(pos[SALES]!.x + 1.0, slotWorld[SALES]!.y + 0.06, pos[SALES]!.z), 0, 0, false);
    show(tags.hub, clamp01((hubB - 0.4) / 0.4) * (1 - seg(it, 0.5, 0.6)), new THREE.Vector3(0, 0, 0), 0, 34);
    show(tags.ship, seg(p, 0.62, 0.65) * (1 - seg(p, 0.78, 0.81)), new THREE.Vector3(pos[SALES]!.x, 2.3, pos[SALES]!.z));
    show(tags.nudge, mods[MKT]!.nudged, new THREE.Vector3(pos[MKT]!.x, 2.3, pos[MKT]!.z));
    show(tags.usage, seg(p, 0.76, 0.79) * (1 - seg(p, 0.87, 0.9)), new THREE.Vector3(0, 0, 0), 0, 64);
    const bub = seg(it, 0.02, 0.1) * (1 - seg(it, 0.34, 0.4));
    show(tags.feedback, bub, new THREE.Vector3().copy(pos[SUP]!).lerp(new THREE.Vector3(0, 0, 0), seg(it, 0.08, 0.32)).setY(2.4));
    show(tags.skill, seg(it, 0.32, 0.42) * (1 - seg(it, 0.62, 0.7)), new THREE.Vector3(0, 3.0, 0));
    show(tags.next, seg(it, 0.72, 0.82), new THREE.Vector3(pos[NEXT]!.x, 2.3, pos[NEXT]!.z));
    const lr = seg(it, 0.5, 0.66);
    loopTags.forEach((e, k) => {
      const ang = -Math.PI / 2 + (k / 5) * Math.PI * 2;
      const on = k === 0 && it > 0.8;
      e.className = e.className.replace(/bg-\S+ text-\S+( ring-1 ring-white\/15)?/, on ? "bg-[#2fd06a] text-[#08130c]" : "bg-[#15191f]/95 text-white ring-1 ring-white/15");
      show(e, k / 5 <= lr ? lr : 0, new THREE.Vector3(Math.cos(ang) * 2.7, 0.03, Math.sin(ang) * 2.7));
    });
  }

  // Compile every shader before the first scroll so nothing stalls mid-story
  render(0, 0);
  for (const pp of [0.3, 0.55, 0.7, 0.95]) render(pp, 0);
  render(0, 0);
  if (opts.reduced) far.material.opacity = 0.35;

  return {
    render,
    resize,
    dispose() {
      renderer.dispose();
      composer.dispose();
      env.dispose();
      pmrem.dispose();
      scene.traverse((ob) => {
        const m = ob as THREE.Mesh;
        m.geometry?.dispose?.();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((x) => x.dispose());
      });
      renderer.domElement.remove();
      overlay.replaceChildren();
    },
  };
}
