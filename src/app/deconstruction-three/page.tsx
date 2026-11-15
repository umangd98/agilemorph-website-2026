import type { Metadata } from "next";

import { EngineLive } from "@/components/deconstruction-live/EngineLive";
import { CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";

// The department engine drawn live in three.js, on trial against the film. Kept out of search.
export const metadata: Metadata = {
  title: "Deconstruction, live 3D",
  description: "How Agilemorph takes a business apart, finds where AI fits, builds it into the heart of it, ships it, gets it used and keeps improving it.",
  alternates: { canonical: "/deconstruction-three" },
  robots: { index: false, follow: false },
};

export default function DeconstructionThreePage() {
  return (
    <PageShell>
      <EngineLive />
      <CtaBand heading="Let's take your business apart, together." />
    </PageShell>
  );
}
