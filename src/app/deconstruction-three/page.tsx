import type { Metadata } from "next";

import { EngineCompare } from "@/components/deconstruction-three/EngineCompare";
import { PageShell } from "@/components/site/PageShell";

// A side-by-side trial of the film against live 3D. Kept out of search.
export const metadata: Metadata = {
  title: "Film or live 3D",
  description: "The department engine's opening turn as a rendered film and as live three.js, side by side.",
  alternates: { canonical: "/deconstruction-three" },
  robots: { index: false, follow: false },
};

export default function DeconstructionThreePage() {
  return (
    <PageShell>
      <EngineCompare />
    </PageShell>
  );
}
