import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Sanity webhook → POST /api/revalidate
 * Configure in Sanity Manage: API → Webhooks
 * URL: https://your-domain.com/api/revalidate
 * Header: x-sanity-webhook-secret: <SANITY_REVALIDATE_SECRET>
 * Trigger on create/update/delete for relevant document types.
 */
const DOCUMENT_TAG_MAP: Record<string, string> = {
  homepage: "homepage",
  aboutPage: "aboutPage",
  contactPage: "contactPage",
  pricingPage: "pricingPage",
  blogIndexPage: "blogIndexPage",
  servicesIndexPage: "servicesIndexPage",
  siteSettings: "siteSettings",
  servicePage: "servicePage",
  blogPost: "blogPost",
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json({ message: "Revalidation not configured" }, { status: 501 });
  }

  const headerSecret = request.headers.get("x-sanity-webhook-secret");
  if (headerSecret !== secret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { _type?: string };
    const tag = body._type ? DOCUMENT_TAG_MAP[body._type] : undefined;

    if (tag) {
      revalidateTag(tag, "max");
      return NextResponse.json({ revalidated: true, tag });
    }

    Object.values(DOCUMENT_TAG_MAP).forEach((value) => revalidateTag(value, "max"));
    return NextResponse.json({ revalidated: true, tag: "all" });
  } catch {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }
}
