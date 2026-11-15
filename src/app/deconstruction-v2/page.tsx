import type { Metadata } from "next";

import { Teardown3D } from "@/components/deconstruction/Teardown3D";
import { CtaBand } from "@/components/site/blocks";
import { PageShell } from "@/components/site/PageShell";

// The Blender-modelled teardown, on trial before it moves to the homepage. Kept out of search until then.
export const metadata: Metadata = {
  title: "Deconstruction v2",
  description: "How Agilemorph takes a business apart, finds where AI fits, builds it in, ships it, gets it used and keeps improving it.",
  alternates: { canonical: "/deconstruction-v2" },
  robots: { index: false, follow: false },
};

export default function DeconstructionV2Page() {
  return (
    <PageShell>
      <Teardown3D />
      <CtaBand heading="Let's take your business apart, together." />
    </PageShell>
  );
}
