"use client";

import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

import { cn } from "@/lib/utils";

/*
 * The teardown. A business drawn as a machined part: channels, people,
 * workflows, data and systems of record, stacked like the elements of a lens.
 * Scrolling takes it apart, turns it into a blueprint, finds the gap where AI
 * fits, builds the missing part, and puts it all back together with the new
 * part inside. Every piece is generated here, so there is no model to load.
 */

/* -------------------------------------------------------------------------- */
/* Story                                                                       */
/* -------------------------------------------------------------------------- */

const STAGES = [
  {
    at: 0,
    loop: null,
    title: "Every business is a machine.",
    body: "People, workflows, data and systems, running together. From the outside, it's hard to see where AI would help.",
  },
  {
    at: 0.08,
    loop: "Find",
    title: "We take it apart, with your teams.",
    body: "Our engineers embed with the people who do the work and see how it really runs, piece by piece.",
  },
  {
    at: 0.22,
    loop: "Find",
    title: "Every part, mapped.",
    body: "Where work comes in, who handles it, how it moves, where the data lives and which systems hold the record.",
  },
  {
    at: 0.36,
    loop: "Find",
    title: "We find where AI fits.",
    body: "The gap between the work and the system, where effort leaks and records go stale. That is where we build.",
  },
  {
    at: 0.47,
    loop: "Build",
    title: "We build the missing part.",
    body: "Made to fit the systems you already run, with checks, logs and a person in the loop. Not another tool beside them.",
  },
  {
    at: 0.63,
    loop: "Ship",
    title: "We ship it back in.",
    body: "Live in production, inside your stack, with one team first so problems surface early.",
  },
  {
    at: 0.77,
    loop: "Adopt",
    title: "We make sure it gets used.",
    body: "Training, nudges and usage tracked person by person, until the new way is simply how work gets done.",
  },
  {
    at: 0.88,
    loop: "Iterate",
    title: "Then we make it better.",
    body: "Every week, from what your people tell us. Then the same loop on the next workflow.",
  },
] as const;

const LOOP = ["Find", "Build", "Ship", "Adopt", "Iterate"] as const;

const LABELS = [
  { key: "channels", name: "Channels", note: "Email, WhatsApp, calls, forms" },
  { key: "people", name: "People", note: "The teams who do the work" },
  { key: "workflows", name: "Workflows", note: "How work moves between them" },
  { key: "data", name: "Data", note: "Records, documents, reports" },
  { key: "systems", name: "Systems of record", note: "CRM, ERP, helpdesk" },
] as const;

/* -------------------------------------------------------------------------- */
/* Timeline helpers                                                            */
/* -------------------------------------------------------------------------- */

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** 0 before a, 1 after b, eased in between. */
const seg = (p: number, a: number, b: number) => ease(clamp01((p - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

const INK = new THREE.Color("#0B0D10");
const PAPER = new THREE.Color("#F0F1EC");
const GREEN = new THREE.Color("#2FD06A");
const GREEN_DEEP = new THREE.Color("#157F3D");
const AMBER = new THREE.Color("#E0A24A");
const NODE_IDLE = new THREE.Color("#3A3F46");

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

function lathe(profile: Array<[number, number]>, segments = 120) {
  const points = profile.map(([r, y]) => new THREE.Vector2(r, y));
  const first = points[0];
  if (first) points.push(first.clone());
  return new THREE.LatheGeometry(points, segments);
}

/** Copies of a part spaced around the axis, facing out. */
function around(part: THREE.BufferGeometry, count: number, radius: number, y = 0, phase = 0) {
  const copies: THREE.BufferGeometry[] = [];
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    const a = phase + (i / count) * Math.PI * 2;
    m.makeRotationY(-a).setPosition(Math.cos(a) * radius, y, Math.sin(a) * radius);
    copies.push(part.clone().applyMatrix4(m));
  }
  const merged = mergeGeometries(copies);
  copies.forEach((g) => g.dispose());
  return merged;
}

type Layer = {
  key: string;
  thickness: number;
  radius: number;
  group: THREE.Group;
  lines: THREE.LineSegments[];
};

export function Teardown() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const leadersRef = useRef<SVGSVGElement>(null);
  const gapLabelRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const host = canvasRef.current;
    const labelsEl = labelsRef.current;
    const leaders = leadersRef.current;
    const gapLabel = gapLabelRef.current;
    if (!section || !sticky || !host || !labelsEl || !leaders || !gapLabel) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      const id = requestAnimationFrame(() => setFailed(true));
      return () => cancelAnimationFrame(id);
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const key = new THREE.DirectionalLight(0xffe2c4, 2.4);
    key.position.set(-4, 6, 6);
    const rim = new THREE.DirectionalLight(0x9fe8bd, 1.2);
    rim.position.set(5, -3, -4);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.15));

    /* Materials */
    const metal = new THREE.MeshStandardMaterial({ color: 0x2b3036, metalness: 0.75, roughness: 0.32, transparent: true });
    const metalLight = new THREE.MeshStandardMaterial({ color: 0x4a5058, metalness: 0.8, roughness: 0.28, transparent: true });
    const glass = new THREE.MeshStandardMaterial({ color: 0x07090b, metalness: 0.2, roughness: 0.04, transparent: true });
    const line = new THREE.LineBasicMaterial({ color: 0x0b0d10, transparent: true, opacity: 0 });
    const aiSolid = new THREE.MeshStandardMaterial({
      color: GREEN_DEEP,
      emissive: GREEN,
      emissiveIntensity: 0.25,
      metalness: 0.55,
      roughness: 0.3,
      transparent: true,
      opacity: 0,
    });
    const aiGlow = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0 });
    const aiLine = new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0 });
    const gapMat = new THREE.LineDashedMaterial({ color: AMBER, dashSize: 0.12, gapSize: 0.08, transparent: true, opacity: 0 });
    const nodeMat = new THREE.MeshStandardMaterial({ metalness: 0.3, roughness: 0.4, transparent: true });

    const disposables: Array<{ dispose: () => void }> = [
      metal, metalLight, glass, line, aiSolid, aiGlow, aiLine, gapMat, nodeMat, envTexture, pmrem,
    ];
    const keep = <T extends { dispose: () => void }>(thing: T) => {
      disposables.push(thing);
      return thing;
    };

    /* Assembly */
    const root = new THREE.Group(); // positioned and oriented by the story
    const spin = new THREE.Group(); // turns about the axis
    root.add(spin);
    scene.add(root);

    function makeLayer(
      layerKey: string,
      thickness: number,
      radius: number,
      parts: Array<[THREE.BufferGeometry, THREE.Material]>,
      edgeAngle = 25,
    ): Layer {
      const group = new THREE.Group();
      const lines: THREE.LineSegments[] = [];
      for (const [geometry, material] of parts) {
        keep(geometry);
        group.add(new THREE.Mesh(geometry, material));
        const edges = keep(new THREE.EdgesGeometry(geometry, edgeAngle));
        const l = new THREE.LineSegments(edges, material === aiSolid ? aiLine : line);
        lines.push(l);
        group.add(l);
      }
      spin.add(group);
      return { key: layerKey, thickness, radius, group, lines };
    }

    const channels = makeLayer("channels", 0.42, 1.3, [
      [
        lathe([
          [0.56, -0.21], [1.24, -0.21], [1.3, -0.15], [1.3, 0.1], [1.2, 0.21], [0.92, 0.21],
          [0.84, 0.13], [0.62, 0.13], [0.56, 0.06],
        ]),
        metalLight,
      ],
      [new THREE.CircleGeometry(0.57, 96).rotateX(-Math.PI / 2).translate(0, 0.02, 0), glass],
      [around(new THREE.BoxGeometry(0.06, 0.1, 0.16), 18, 1.32, -0.02), metal],
    ]);

    const people = makeLayer("people", 0.5, 1.38, [
      [lathe([[1.0, -0.25], [1.32, -0.25], [1.38, -0.19], [1.38, 0.19], [1.32, 0.25], [1.0, 0.25]]), metal],
    ]);
    const NODES = 36;
    const nodes = new THREE.InstancedMesh(keep(new THREE.SphereGeometry(0.055, 14, 10)), nodeMat, NODES);
    {
      const m = new THREE.Matrix4();
      for (let i = 0; i < NODES; i++) {
        const a = (i / NODES) * Math.PI * 2;
        m.makeTranslation(Math.cos(a) * 1.42, (i % 2 ? 0.09 : -0.09), Math.sin(a) * 1.42);
        nodes.setMatrixAt(i, m);
        nodes.setColorAt(i, NODE_IDLE);
      }
      people.group.add(nodes);
    }

    const workflows = makeLayer("workflows", 0.5, 1.36, [
      [lathe([[0.94, -0.25], [1.22, -0.25], [1.26, -0.21], [1.26, 0.21], [1.22, 0.25], [0.94, 0.25]]), metal],
      [around(new THREE.BoxGeometry(0.1, 0.38, 0.11), 44, 1.3), metalLight],
    ]);

    const ai = makeLayer("ai", 0.46, 1.34, [
      [lathe([[0.9, -0.22], [1.28, -0.22], [1.34, -0.17], [1.34, 0.17], [1.28, 0.22], [0.9, 0.22]]), aiSolid],
    ]);
    const glowBand = new THREE.Mesh(keep(new THREE.TorusGeometry(1.355, 0.022, 10, 160).rotateX(Math.PI / 2)), aiGlow);
    ai.group.add(glowBand);

    const grooves: Array<[number, number]> = [[0.98, -0.25]];
    for (let i = 0; i <= 10; i++) grooves.push([i % 2 ? 1.34 : 1.42, -0.25 + i * 0.05]);
    grooves.push([0.98, 0.25]);
    const data = makeLayer("data", 0.5, 1.42, [[lathe(grooves), metal]], 15);

    const systems = makeLayer("systems", 1.2, 1.55, [
      [
        lathe([
          [0.0, -0.6], [1.3, -0.6], [1.45, -0.54], [1.5, -0.44], [1.5, 0.5], [1.45, 0.6], [0.72, 0.6],
          [0.66, 0.52], [0.0, 0.52],
        ]),
        metal,
      ],
      [around(new THREE.BoxGeometry(0.07, 0.86, 0.2), 30, 1.55, -0.02), metalLight],
      [lathe([[0.2, 0.52], [0.5, 0.52], [0.5, 0.62], [0.2, 0.62]], 64), metalLight],
    ]);

    // Order from the front of the machine to the back. The AI slot sits between workflows and data.
    const stack = [channels, people, workflows, ai, data, systems];

    // The gap, as a dashed amber ring where the AI part will go.
    const gapRing = (() => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5));
      }
      const g = keep(new THREE.BufferGeometry().setFromPoints(pts));
      const ringLine = new THREE.Line(g, gapMat);
      ringLine.computeLineDistances();
      spin.add(ringLine);
      return ringLine;
    })();

    // For drawing the AI part on as it is built.
    const aiEdgeCounts = ai.lines.map((l) => l.geometry.getAttribute("position").count);

    /* Poses */
    const qAssembled = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.02, 0, -0.62));
    const qExploded = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.42, 0, -1.02));
    const qBlueprint = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.5, 0, -1.12));
    const q = new THREE.Quaternion();

    /* Sizing */
    let width = 1;
    let height = 1;
    let wide = true;
    function resize() {
      width = host!.clientWidth || 1;
      height = host!.clientHeight || 1;
      wide = width >= 900;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = wide ? 14 : 20;
      camera.updateProjectionMatrix();
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    /* Labels */
    const labelEls = Array.from(labelsEl.querySelectorAll<HTMLElement>("[data-label]"));
    const leaderEls = Array.from(leaders.querySelectorAll<SVGLineElement>("line"));
    const tmp = new THREE.Vector3();
    const best = new THREE.Vector3();

    function screenOf(v: THREE.Vector3) {
      tmp.copy(v).project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    }

    /** The rim point of a layer that sits highest on screen. */
    function topRim(layer: Layer) {
      let bestY = Infinity;
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const v = new THREE.Vector3(Math.cos(a) * layer.radius, 0, Math.sin(a) * layer.radius);
        layer.group.localToWorld(v);
        const s = screenOf(v);
        if (s.y < bestY) {
          bestY = s.y;
          best.copy(v);
        }
      }
      return screenOf(best);
    }

    /* Background, painted on the sticky panel so the text can follow it */
    const bg = new THREE.Color();
    let lastBg = "";

    /* Loop */
    let visible = false;
    let raf = 0;
    let last = performance.now();
    let idle = 0;
    let lastStage = -1;

    const io = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(section);

    function progress() {
      const rect = section!.getBoundingClientRect();
      const run = rect.height - window.innerHeight;
      return run > 0 ? clamp01(-rect.top / run) : 0;
    }

    function frame(now: number) {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const p = progress();

      /* Story values */
      const explode = seg(p, 0.08, 0.2) * (1 - seg(p, 0.63, 0.74));
      const blueprint = seg(p, 0.22, 0.3) * (1 - seg(p, 0.46, 0.5));
      const gapOpen = seg(p, 0.36, 0.43);
      const gapShow = gapOpen * (1 - seg(p, 0.5, 0.56));
      const draw = seg(p, 0.47, 0.57);
      const solid = seg(p, 0.56, 0.63);
      const adopt = clamp01((p - 0.77) / 0.1);
      const iterate = seg(p, 0.88, 1);

      /* Stage text */
      let s = 0;
      STAGES.forEach((st, i) => {
        if (p >= st.at) s = i;
      });
      if (s !== lastStage) {
        lastStage = s;
        setStage(s);
      }

      /* Pose and position */
      q.copy(qAssembled).slerp(qExploded, explode);
      q.slerp(qBlueprint, blueprint * 0.6);
      root.quaternion.copy(q);
      root.scale.setScalar(wide ? mix(1, 0.74, explode) : mix(0.92, 0.52, explode));
      root.position.set(wide ? mix(2.3, 2.15, explode) : 0, wide ? mix(0, -0.2, explode) : mix(1.4, 1.2, explode), 0);

      if (!reduced) idle += dt * mix(0.18, 0.05, Math.max(explode, blueprint)) * (1 + iterate * 2);
      spin.rotation.y = idle + p * Math.PI * 1.2;

      /* Stack along the axis, opening the AI slot when we find it */
      const spacing = 0.04 + explode * 0.8;
      const sizes = stack.map((l) => (l === ai ? l.thickness * gapOpen : l.thickness));
      const gaps = stack.slice(0, -1).map((l, i) => {
        const next = stack[i + 1];
        return l === ai || next === ai ? spacing * gapOpen : spacing;
      });
      const total = sizes.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0);
      let y = total / 2;
      stack.forEach((layer, i) => {
        const size = sizes[i] ?? 0;
        layer.group.position.y = y - size / 2;
        y -= size + (gaps[i] ?? 0);
      });
      gapRing.position.y = ai.group.position.y;
      const pulse = 1 + Math.sin(now / 260) * 0.03;
      gapRing.scale.setScalar(pulse);

      /* Materials */
      const solidOpacity = 1 - blueprint;
      metal.opacity = metalLight.opacity = glass.opacity = nodeMat.opacity = solidOpacity;
      const opaque = solidOpacity > 0.99;
      for (const m of [metal, metalLight, glass, nodeMat]) {
        m.depthWrite = opaque;
      }
      line.opacity = blueprint * 0.85;
      gapMat.opacity = gapShow;

      ai.group.visible = draw > 0;
      ai.lines.forEach((l, i) => l.geometry.setDrawRange(0, Math.floor((aiEdgeCounts[i] ?? 0) * draw)));
      aiLine.opacity = draw * (1 - solid * 0.7);
      aiSolid.opacity = solid;
      aiSolid.depthWrite = solid > 0.99;
      aiSolid.emissiveIntensity = 0.25 + iterate * (0.35 + Math.sin(now / 300) * 0.25);
      aiGlow.opacity = solid * (0.65 + Math.sin(now / 420) * 0.2);

      /* People light up, one after another */
      const c = new THREE.Color();
      for (let i = 0; i < NODES; i++) {
        const lit = clamp01(adopt * 1.6 - (i / NODES) * 0.6);
        c.copy(NODE_IDLE).lerp(GREEN, lit);
        nodes.setColorAt(i, c);
      }
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;

      /* Background: dark, then a paper blueprint, then dark again */
      bg.copy(INK).lerp(PAPER, blueprint);
      const css = `#${bg.getHexString()}`;
      if (css !== lastBg) {
        lastBg = css;
        sticky!.style.backgroundColor = css;
        sticky!.dataset.tone = blueprint > 0.5 ? "light" : "dark";
      }

      renderer.render(scene, camera);

      /* Leader lines and labels, after rendering so world matrices are fresh */
      const showLabels = blueprint * (1 - seg(p, 0.34, 0.38));
      labelsEl!.style.opacity = String(showLabels);
      leaders!.style.opacity = String(showLabels);
      if (showLabels > 0.01) {
        // Callouts above each part, on two staggered rows so neighbours don't collide.
        const rows = wide ? [height * 0.19, height * 0.3] : [height * 0.13, height * 0.19, height * 0.25];
        const anchors = LABELS.map((label) => {
          const layer = stack.find((l) => l.key === label.key);
          return layer ? topRim(layer) : { x: 0, y: 0 };
        });
        const order = anchors.map((a, i) => [a.x, i] as const).sort((m, n) => m[0] - n[0]);
        order.forEach(([, i], rank) => {
          const a = anchors[i];
          const el = labelEls[i];
          const leader = leaderEls[i];
          if (!a || !el || !leader) return;
          const ly = rows[rank % rows.length] ?? 0;
          const lx = Math.min(width - 70, Math.max(70, a.x));
          el.style.transform = `translate(${lx}px, ${ly}px) translate(-50%, -100%)`;
          leader.setAttribute("x1", String(a.x));
          leader.setAttribute("y1", String(a.y - 6));
          leader.setAttribute("x2", String(lx));
          leader.setAttribute("y2", String(ly + 6));
        });
      }

      const gapAnchor = screenOf(ai.group.localToWorld(new THREE.Vector3(1.5, 0, 0)));
      gapLabel!.style.opacity = String(gapShow * (1 - draw));
      gapLabel!.style.transform = `translate(${gapAnchor.x}px, ${gapAnchor.y}px) translate(16px, -50%)`;

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      disposables.forEach((d) => d.dispose());
      nodes.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const current = STAGES[stage]!;

  return (
    <MotionConfig reducedMotion="user">
      <section ref={sectionRef} aria-label="How we take a business apart and put it back together" className="relative h-[640vh]">
        <div
          ref={stickyRef}
          data-tone="dark"
          className="group/tone sticky top-0 h-svh overflow-hidden bg-ink text-white transition-colors duration-300 data-[tone=light]:text-ink"
        >
          <div ref={canvasRef} className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" aria-hidden />

          {/* Blueprint labels */}
          <svg ref={leadersRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-0" aria-hidden>
            {LABELS.map((l) => (
              <line key={l.key} stroke="currentColor" strokeWidth="1" strokeOpacity="0.45" />
            ))}
          </svg>
          <div ref={labelsRef} className="pointer-events-none absolute inset-0 opacity-0" aria-hidden>
            {LABELS.map((l) => (
              <div key={l.key} data-label className="absolute top-0 left-0 w-max max-w-[9rem] pb-1 text-center sm:max-w-[11rem]">
                <p className="font-display text-sm font-semibold sm:text-base">{l.name}</p>
                <p className="mx-auto hidden max-w-[8rem] text-xs opacity-60 sm:block">{l.note}</p>
              </div>
            ))}
          </div>
          <div
            ref={gapLabelRef}
            className="pointer-events-none absolute top-0 left-0 w-max rounded-pill bg-amber px-3 py-1 text-sm font-medium text-white opacity-0"
            aria-hidden
          >
            Where AI fits
          </div>

          {/* Copy */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent px-4 pt-24 pb-24 group-data-[tone=light]/tone:from-transparent sm:px-8 lg:inset-y-0 lg:right-auto lg:flex lg:w-[42%] lg:items-center lg:bg-none lg:pt-0 lg:pb-0 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
            <div className="max-w-md">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.loop ? (
                    <p className="mb-3 text-sm font-medium text-[#5cd68b] group-data-[tone=light]/tone:text-green-deep">
                      {current.loop}
                    </p>
                  ) : null}
                  {stage === 0 ? (
                    <h1 className="type-display text-[clamp(2.4rem,5vw,4.25rem)]">{current.title}</h1>
                  ) : (
                    <h2 className="type-title">{current.title}</h2>
                  )}
                  <p className="type-lede mt-5 opacity-75">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Where we are in the loop */}
          <ol className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm" aria-label="Stage">
            {LOOP.map((name) => {
              const on = current.loop === name;
              return (
                <li
                  key={name}
                  aria-current={on ? "step" : undefined}
                  className={cn(
                    "rounded-pill px-2.5 py-1 ring-1 transition-colors duration-300 sm:px-3",
                    on
                      ? "bg-green text-white ring-green"
                      : "text-current opacity-60 ring-current/25",
                  )}
                >
                  {name}
                </li>
              );
            })}
          </ol>

          {stage === 0 ? (
            <p className="absolute right-6 bottom-6 hidden text-sm opacity-60 lg:block">Scroll to take it apart</p>
          ) : null}

          {failed ? (
            <p className="absolute inset-x-0 top-1/3 text-center text-sm opacity-70">
              This animation needs WebGL, which your browser has turned off.
            </p>
          ) : null}
        </div>
      </section>
    </MotionConfig>
  );
}
