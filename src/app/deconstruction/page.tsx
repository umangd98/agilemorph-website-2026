import type { Metadata } from "next";

import { CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";
import { Teardown } from "@/components/site/Teardown";

// A trial page for the teardown animation. Kept out of search until it moves to the homepage.
export const metadata: Metadata = {
  title: "Deconstruction",
  description: "How Agilemorph takes a business apart, finds where AI fits, builds it and puts it back together.",
  alternates: { canonical: "/deconstruction" },
  robots: { index: false, follow: false },
};

export default function DeconstructionPage() {
  return (
    <PageShell>
      <Teardown />
      <CtaBand />
    </PageShell>
  );
}
