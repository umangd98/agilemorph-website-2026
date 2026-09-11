import { renderCover } from "@/lib/blog-cover-image";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return renderCover(slug, "square");
}
