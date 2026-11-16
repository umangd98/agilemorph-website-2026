import type { ReactNode } from "react";

import { Footer } from "./Footer";
import { Header } from "./Header";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
