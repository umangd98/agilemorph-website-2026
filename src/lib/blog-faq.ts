type Span = { _type?: string; text?: string };
type Block = { _type?: string; style?: string; children?: Span[] };

const isBlock = (value: unknown): value is Block =>
  typeof value === "object" && value !== null && (value as Block)._type === "block";

const textOf = (block: Block) =>
  (block.children ?? []).map((span) => span.text ?? "").join("").trim();

const FAQ_HEADING = /\b(faq|frequently asked questions)\b/i;

/**
 * Pulls the question-and-answer pairs out of a post's FAQ section, so the page
 * can mark them up as FAQPage. The section starts at an h2 named FAQ or
 * "Frequently Asked Questions" and runs to the next h2. A question is either
 * an h3/h4 or a short paragraph ending in "?"; the paragraphs after it are the
 * answer. Returns nothing unless every question has an answer, so the schema
 * never claims a Q&A the reader can't see.
 */
export function extractFaq(body: unknown[] | undefined): Array<{ question: string; answer: string }> {
  const blocks = (body ?? []).filter(isBlock);
  const start = blocks.findIndex((block) => block.style === "h2" && FAQ_HEADING.test(textOf(block)));
  if (start === -1) return [];

  const items: Array<{ question: string; answer: string }> = [];
  for (const block of blocks.slice(start + 1)) {
    if (block.style === "h2") break;
    const text = textOf(block);
    if (!text) continue;
    const isQuestion =
      block.style === "h3" || block.style === "h4" || (text.endsWith("?") && text.length <= 160);
    if (isQuestion) {
      items.push({ question: text, answer: "" });
    } else if (items.length) {
      const last = items[items.length - 1]!;
      last.answer = last.answer ? `${last.answer} ${text}` : text;
    }
  }

  return items.length && items.every((item) => item.answer) ? items : [];
}
