import { ImageResponse } from "next/og";

import { type CoverFont, loadGeist } from "@/lib/blog-cover-image";
import { SHARE_CARDS } from "@/lib/share-images";

const PAPER = "#fbfbf9";
const INK = "#0b0d10";
const MUTED = "#5b6370";
const GREEN = "#157f3d";
const GREEN_SOFT = "#e6f2ea";

export function generateStaticParams() {
  return Object.keys(SHARE_CARDS).map((page) => ({ page }));
}

export const dynamicParams = false;

export async function GET(_request: Request, { params }: { params: Promise<{ page: string }> }) {
  const card = SHARE_CARDS[(await params).page];
  if (!card) return new Response("Not found", { status: 404 });

  const glyphs = `${card.eyebrow.toUpperCase()}${card.headline}AGILEMORPHtheagilemorph.com`;
  const fonts = (await Promise.all([loadGeist(700, glyphs), loadGeist(500, glyphs)])).filter(
    (font): font is CoverFont => font !== null,
  );
  const size = card.headline.length <= 40 ? 76 : card.headline.length <= 64 ? 64 : 54;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: PAPER, padding: "84px 96px", fontFamily: "Geist", borderLeft: `18px solid ${GREEN}` }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignSelf: "flex-start", alignItems: "center", gap: 12, padding: "10px 20px", borderRadius: 999, background: GREEN_SOFT, color: GREEN, fontSize: 22, fontWeight: 500, letterSpacing: 3, textTransform: "uppercase" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: GREEN }} />
            {card.eyebrow}
          </div>
          <div style={{ display: "flex", marginTop: 40, maxWidth: 940, fontSize: size, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, color: INK }}>
            {card.headline}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <svg width="38" height="38" viewBox="0 0 34 34">
              <path d="M4 17 L17 8 L30 17" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 27 L17 18 L30 27" stroke={GREEN} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 6, color: INK }}>AGILEMORPH</div>
          </div>
          <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: MUTED }}>theagilemorph.com</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600" },
    },
  );
}
