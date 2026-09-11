import { ImageResponse } from "next/og";

import {
  type CoverFormat,
  type CoverKind,
  coverHeadlineSize,
  coverThemeFor,
  splitCoverTitle,
} from "@/lib/blog-cover";
import { sanityFetch } from "@/sanity/fetch";

const SIZES: Record<CoverFormat, { width: number; height: number }> = {
  landscape: { width: 1200, height: 630 },
  square: { width: 1000, height: 1000 },
};

type CoverPost = { title?: string };

type CoverFont = {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 700;
  style: "normal";
};

/**
 * next/og only bundles Geist Regular. Fetch the weights the cover needs,
 * subset to the glyphs actually drawn. If Google Fonts is unreachable the
 * cover still renders, in the bundled regular weight.
 */
async function loadGeist(weight: 500 | 700, text: string): Promise<CoverFont | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Geist:wght@${weight}&text=${encodeURIComponent(text)}`,
    ).then((res) => res.text());
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const font = await fetch(src);
    if (!font.ok) return null;
    return { name: "Geist", data: await font.arrayBuffer(), weight, style: "normal" };
  } catch {
    return null;
  }
}

const LINE = "rgba(134, 239, 172, 0.45)";
const TILE = "rgba(20, 83, 45, 0.45)";
const GLOW = "rgba(74, 222, 128, 0.6)";
const AMBER = "#fbbf24";

// Motifs are drawn in a 336x420 box and scaled via the svg width/height.
function ManufacturingMotif({ scale }: { scale: number }) {
  const nodes = [
    { x: 16, y: 16 },
    { x: 176, y: 118 },
    { x: 16, y: 220 },
    { x: 176, y: 322 },
  ];
  // Bottom-centre of each node to top-centre of the next (nodes are 144x80).
  const links = [
    { x1: 88, y1: 96, x2: 248, y2: 118 },
    { x1: 248, y1: 198, x2: 88, y2: 220 },
    { x1: 88, y1: 300, x2: 248, y2: 322 },
  ];
  return (
    <svg width={336 * scale} height={420 * scale} viewBox="0 0 336 420">
      {links.map(({ x1, y1, x2, y2 }, i) => (
        <g key={`link-${i}`}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth="2.5" strokeDasharray="7 9" />
          <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="15" fill="rgba(251, 191, 36, 0.18)" />
          <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="6" fill={AMBER} />
        </g>
      ))}
      {nodes.map((node, i) => (
        <g key={`node-${i}`}>
          <rect x={node.x} y={node.y} width="144" height="80" rx="16" fill={TILE} stroke={LINE} strokeWidth="2" />
          <rect x={node.x + 20} y={node.y + 24} width="72" height="8" rx="4" fill="rgba(187, 247, 208, 0.55)" />
          <rect x={node.x + 20} y={node.y + 44} width="104" height="8" rx="4" fill="rgba(187, 247, 208, 0.22)" />
        </g>
      ))}
    </svg>
  );
}

function AgencyMotif({ scale }: { scale: number }) {
  const lit = new Set([1, 6, 8, 11, 13, 18]);
  const tiles = Array.from({ length: 20 }, (_, i) => ({
    i,
    x: 8 + (i % 4) * 80,
    y: 8 + Math.floor(i / 4) * 82,
  }));
  return (
    <svg width={336 * scale} height={420 * scale} viewBox="0 0 336 420">
      {tiles.map(({ i, x, y }) => (
        <g key={i}>
          <rect
            x={x}
            y={y}
            width="64"
            height="64"
            rx="14"
            fill={lit.has(i) ? GLOW : TILE}
            stroke={lit.has(i) ? "rgba(187, 247, 208, 0.8)" : LINE}
            strokeWidth="2"
          />
          {lit.has(i) ? (
            <rect x={x + 16} y={y + 38} width="32" height="7" rx="3.5" fill="rgba(3, 20, 11, 0.55)" />
          ) : null}
        </g>
      ))}
    </svg>
  );
}

function AutomationMotif({ scale }: { scale: number }) {
  const cx = 168;
  const cy = 210;
  const spokes = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    return { x: cx + Math.cos(angle) * 138, y: cy + Math.sin(angle) * 138 };
  });
  return (
    <svg width={336 * scale} height={420 * scale} viewBox="0 0 336 420">
      {spokes.map((spoke, i) => (
        <line key={`l-${i}`} x1={cx} y1={cy} x2={spoke.x} y2={spoke.y} stroke={LINE} strokeWidth="2.5" />
      ))}
      <circle cx={cx} cy={cy} r="104" fill="none" stroke="rgba(134, 239, 172, 0.18)" strokeWidth="2" />
      {spokes.map((spoke, i) => (
        <circle key={`n-${i}`} cx={spoke.x} cy={spoke.y} r="24" fill={TILE} stroke={LINE} strokeWidth="2" />
      ))}
      <circle cx={cx} cy={cy} r="46" fill={GLOW} />
      <circle cx={cx} cy={cy} r="20" fill="rgba(3, 20, 11, 0.5)" />
    </svg>
  );
}

function Motif({ kind, scale }: { kind: CoverKind; scale: number }) {
  if (kind === "manufacturing") return <ManufacturingMotif scale={scale} />;
  if (kind === "agency") return <AgencyMotif scale={scale} />;
  return <AutomationMotif scale={scale} />;
}

/**
 * Renders a post's generated cover. Each format has its own path rather than a
 * query parameter: Netlify's CDN keys cached responses on path only, so a
 * ?format=square request was being served the cached landscape image.
 */
export async function renderCover(slug: string, format: CoverFormat): Promise<Response> {
  const post = await sanityFetch<CoverPost | null>({
    query: `*[_type == "blogPost" && slug.current == $slug][0]{ title }`,
    params: { slug },
    tags: ["blogPost", `blogPost:${slug}`],
  });

  if (!post?.title) {
    return new Response("Not found", { status: 404 });
  }

  const theme = coverThemeFor(slug, post.title);
  const { headline, subline } = splitCoverTitle(post.title);
  const glyphs = `${theme.label.toUpperCase()}${headline}${subline ?? ""}AGILEMORPH`;
  const fonts = (await Promise.all([loadGeist(700, glyphs), loadGeist(500, glyphs)])).filter(
    (font): font is CoverFont => font !== null,
  );

  const square = format === "square";
  const { width, height } = SIZES[format];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #03140b 0%, #0a2e19 55%, #14532d 100%)",
          fontFamily: "Geist",
        }}
      >
        {square ? (
          <div
            style={{
              position: "absolute",
              right: 70,
              bottom: 70,
              display: "flex",
              opacity: 0.85,
            }}
          >
            <Motif kind={theme.kind} scale={0.8} />
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              right: 88,
              top: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Motif kind={theme.kind} scale={1} />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            left: square ? 110 : 112,
            top: square ? 130 : 92,
            bottom: square ? 130 : 84,
            // Landscape stays narrow: at small card ratios only the left of the
            // canvas is visible. Square covers the near-1:1 featured card.
            width: square ? 780 : 540,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                alignSelf: "flex-start",
                gap: 12,
                padding: square ? "12px 22px" : "10px 20px",
                borderRadius: 999,
                border: "1.5px solid rgba(134, 239, 172, 0.35)",
                background: "rgba(21, 128, 61, 0.2)",
                color: "#bbf7d0",
                fontSize: square ? 22 : 20,
                fontWeight: 500,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: 999, background: "#4ade80" }} />
              {theme.label}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: square ? 40 : 34,
                fontSize: coverHeadlineSize(headline, format),
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: -1.5,
                color: "#ffffff",
              }}
            >
              {headline}
            </div>
            {subline ? (
              <div
                style={{
                  display: "flex",
                  marginTop: square ? 22 : 18,
                  fontSize: square ? 36 : 27,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: "#a7f3d0",
                }}
              >
                {subline}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="34" height="34" viewBox="0 0 34 34">
              <path d="M4 17 L17 8 L30 17" stroke="#4ade80" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 27 L17 18 L30 27" stroke="#bbf7d0" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", fontSize: 22, fontWeight: 700, letterSpacing: 5, color: "#ecfdf5" }}>
              AGILEMORPH
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
      },
    },
  );
}
