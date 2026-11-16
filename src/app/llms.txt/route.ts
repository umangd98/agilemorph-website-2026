import { CASE_STUDIES } from "@/content/case-studies";
import { COMPANY, FAQ, FDE_EXPLAINER, ONE_LINER } from "@/content/site";
import { SITE_URL } from "@/lib/structured-data";
import { sanityFetch } from "@/sanity/fetch";
import { allBlogPostsForLlmsQuery } from "@/sanity/queries";

export const revalidate = 86400;

/**
 * llms.txt (llmstxt.org): a plain-markdown map of the site for AI assistants,
 * built from the same copy the pages render.
 */
export async function GET() {
  let posts: Array<{ slug: string; title: string; excerpt?: string }> = [];
  try {
    posts = (await sanityFetch({ query: allBlogPostsForLlmsQuery, tags: ["blogPost"] })) ?? [];
  } catch {
    posts = [];
  }

  const lines = [
    `# ${COMPANY.name}`,
    "",
    `> ${ONE_LINER}`,
    "",
    FDE_EXPLAINER,
    "",
    `Also known as: AgileMorph, AgileMorph Solutions. Registered name: ${COMPANY.legalName}. Based in ${COMPANY.location}. Contact: ${COMPANY.email}.`,
    "",
    "## Pages",
    `- [How we work](${SITE_URL}/how-we-work): the find, build, ship, adopt, iterate loop, the discovery audit and how engagements are structured.`,
    `- [Case studies](${SITE_URL}/case-studies): anonymised client engagements.`,
    `- [About](${SITE_URL}/about): the founders and the firm.`,
    `- [Contact](${SITE_URL}/contact): book a discovery call.`,
    "",
    "## Case studies",
    ...CASE_STUDIES.map((study) => `- [${study.client}](${SITE_URL}/case-studies/${study.slug}): ${study.headline}`),
    "",
    "## Questions buyers ask",
    ...FAQ.flatMap(([question, answer]) => [`### ${question}`, answer, ""]),
    "## Blog",
    ...posts.map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug})${post.excerpt ? `: ${post.excerpt}` : ""}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
