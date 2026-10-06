import type { ReactNode } from "react";
import { SiteNavbar } from "@/components/SiteNavbar";
import { SiteFooter } from "@/components/SiteFooter";
export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="bg-background sr-only z-[100] rounded-lg p-4 focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <SiteNavbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
