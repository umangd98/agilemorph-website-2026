import Link from "next/link";

import { CLIENT_TYPES } from "@/content/site";

/*
 * Who we work with. Each group gets a small isometric build drawn to the same
 * scale: a large, uneven build for an enterprise, a smaller one for a mid-size
 * business, and one block with the outline of what comes next for a startup.
 * Green blocks are where AI has gone in.
 */

type Cell = [i: number, j: number, k: number, kind: "plain" | "green" | "ghost"];

const S = 17;
const COS = Math.cos(Math.PI / 6);
const P = (x: number, y: number, z: number): [number, number] => [(x - y) * COS * S, (x + y) * 0.5 * S - z * S];
const pts = (list: Array<[number, number]>) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function stack(heights: number[][], green: string[]): Cell[] {
  const cells: Cell[] = [];
  heights.forEach((row, j) =>
    row.forEach((h, i) => {
      for (let k = 0; k < h; k++) cells.push([i, j, k, green.includes(`${i},${j},${k}`) ? "green" : "plain"]);
    }),
  );
  return cells;
}

const BUILDS: Cell[][] = [
  stack(
    [
      [3, 2, 2, 1],
      [2, 4, 2, 1],
      [2, 2, 3, 1],
      [1, 1, 1, 2],
    ],
    ["1,1,3", "2,2,2", "0,0,2"],
  ),
  stack(
    [
      [2, 1, 1],
      [1, 2, 1],
    ],
    ["1,1,1"],
  ),
  [
    [1, 0, 0, "ghost"],
    [0, 1, 0, "ghost"],
    [0, 0, 1, "ghost"],
    [0, 0, 0, "green"],
  ],
];

const FILL = {
  plain: ["#ffffff", "#e9eae4", "#d6d8cf", "#b8bbb1"],
  green: ["#3aa865", "#157f3d", "#0f6230", "#0f6230"],
} as const;

function Cube({ cell: [i, j, k, kind] }: { cell: Cell }) {
  const top = pts([P(i, j, k + 1), P(i + 1, j, k + 1), P(i + 1, j + 1, k + 1), P(i, j + 1, k + 1)]);
  const left = pts([P(i, j + 1, k), P(i + 1, j + 1, k), P(i + 1, j + 1, k + 1), P(i, j + 1, k + 1)]);
  const right = pts([P(i + 1, j, k), P(i + 1, j + 1, k), P(i + 1, j + 1, k + 1), P(i + 1, j, k + 1)]);
  if (kind === "ghost") {
    return (
      <g fill="none" stroke="#9ca197" strokeDasharray="3 3" strokeLinejoin="round">
        <polygon points={left} />
        <polygon points={right} />
        <polygon points={top} />
      </g>
    );
  }
  const [t, l, r, stroke] = FILL[kind];
  return (
    <g stroke={stroke} strokeWidth={0.8} strokeLinejoin="round">
      <polygon points={left} fill={l} />
      <polygon points={right} fill={r} />
      <polygon points={top} fill={t} />
    </g>
  );
}

/** Every build is framed against the enterprise's bounds, so the three read at one scale. */
const FRAME = [P(0, 0, 0), P(4, 0, 0), P(0, 4, 0), P(4, 4, 0), P(1, 1, 5)];
const box = (list: Array<[number, number]>) => {
  const xs = list.map((p) => p[0]);
  const ys = list.map((p) => p[1]);
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
};
const F = box(FRAME);

function Build({ cells }: { cells: Cell[] }) {
  // Outlines go underneath so solid blocks cover them; solids paint back to front.
  const ordered = [...cells].sort(
    (a, b) => Number(b[3] === "ghost") - Number(a[3] === "ghost") || a[0] + a[1] + a[2] - (b[0] + b[1] + b[2]) || a[2] - b[2],
  );
  const corners = cells.flatMap(([i, j, k]) => [P(i, j, k), P(i + 1, j + 1, k), P(i + 1, j, k + 1), P(i, j + 1, k + 1), P(i, j, k + 1), P(i + 1, j + 1, k + 1)]);
  const b = box(corners);
  const dx = (F.x0 + F.x1) / 2 - (b.x0 + b.x1) / 2;
  const dy = (F.y0 + F.y1) / 2 - (b.y0 + b.y1) / 2;
  const pad = 6;
  return (
    <svg
      viewBox={`${(F.x0 - pad).toFixed(1)} ${(F.y0 - pad).toFixed(1)} ${(F.x1 - F.x0 + pad * 2).toFixed(1)} ${(F.y1 - F.y0 + pad * 2).toFixed(1)}`}
      className="h-32 w-auto sm:h-40"
      aria-hidden
    >
      <g transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`}>
        {ordered.map((cell) => (
          <Cube key={cell.join()} cell={cell} />
        ))}
      </g>
    </svg>
  );
}

export function ClientTypes() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {CLIENT_TYPES.map((client, i) => (
        <article key={client.name} className="flex flex-col gap-3 rounded-panel bg-white p-5 ring-1 ring-rule sm:p-6">
          <div className="mb-2 grid h-40 place-items-center rounded-xl bg-paper sm:h-48">
            <Build cells={BUILDS[i]!} />
          </div>
          <div>
            <h3 className="type-heading">{client.name}</h3>
            <p className="mt-1.5 text-ink-muted">{client.line}</p>
          </div>
          <p className="mt-auto flex items-center gap-2 text-[0.9375rem]">
            <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-green" />
            <span>
              Starts with <span className="font-medium">{client.start}</span>
            </span>
          </p>
          <Link
            href={client.href}
            className="self-start font-medium text-green underline decoration-green/30 underline-offset-4 hover:decoration-green"
          >
            {client.cta}
          </Link>
        </article>
      ))}
    </div>
  );
}
