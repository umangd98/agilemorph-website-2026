import type { Metadata } from "next";

import { EngineFilm } from "@/components/deconstruction-v3/EngineFilm";
import { CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";

// The department engine, on trial before it moves to the homepage. Kept out of search until then.
export const metadata: Metadata = {
  title: "Deconstruction v3",
  description: "How Agilemorph takes a business apart, finds where AI fits, builds it into the heart of it, ships it, gets it used and keeps improving it.",
  alternates: { canonical: "/deconstruction-v3" },
  robots: { index: false, follow: false },
};

export default function DeconstructionV3Page() {
  return (
    <PageShell>
      <EngineFilm />
      <CtaBand heading="Let's take your business apart, together." />
    </PageShell>
  );
}
