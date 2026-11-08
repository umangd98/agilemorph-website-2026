"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { PRIMARY_CTA } from "@/data/positioning";
import { Container } from "./Container";
import { Logo } from "./Logo";

/** Ordered the way a buyer decides: the model, what it builds, the proof. */
export const NAV_ITEMS = [
  { label: "How we work", href: "/how-we-work" },
  { label: "What we build", href: "/what-we-build" },
  { label: "Case studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating. Deferred so the state update does
  // not run synchronously inside the effect.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const inverseHeader = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={`site-header sticky top-0 z-[100] transition-all duration-500 ${
          scrolled ? "site-header--scrolled" : ""
        }`}
        data-header={inverseHeader ? "inverse" : undefined}
      >
        <Container>
          <nav className="flex h-[68px] items-center justify-between" aria-label="Main navigation">
            <Logo priority />

            <ul className="hidden items-center gap-1 lg:flex">
              {NAV_ITEMS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-full px-4 py-2 font-body text-sm transition-colors duration-200 ${
                        active ? "text-fg" : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {link.label}
                      {active ? (
                        <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-signal" />
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden items-center gap-2 lg:flex">
              <CalendlyBookButton className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90 active:scale-95">
                {PRIMARY_CTA.label}
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </CalendlyBookButton>
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>
        </Container>
      </header>

      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
        aria-hidden={!menuOpen}
      >
        <div
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className="absolute right-0 top-0 flex h-full w-[min(320px,100vw)] flex-col bg-background shadow-2xl"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <div className="flex h-[68px] items-center justify-between border-b border-border px-5">
            <Logo />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            {NAV_ITEMS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-3 font-body text-base transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/8 font-medium text-primary"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl px-3 py-3 font-body text-base text-foreground transition-colors hover:bg-muted"
            >
              Contact
            </Link>
          </nav>

          <div className="border-t border-border p-5">
            <CalendlyBookButton
              className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3.5 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 active:scale-95"
              onBook={() => setMenuOpen(false)}
            >
              {PRIMARY_CTA.label}
              <ArrowRight size={14} />
            </CalendlyBookButton>
          </div>
        </div>
      </div>
    </>
  );
}
