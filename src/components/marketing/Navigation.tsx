"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { NavLink } from "@/sanity/types";
export function Navigation({
  links,
  serviceLinks = [],
}: {
  links: NavLink[];
  serviceLinks?: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  return (
    <header className="border-line bg-background/95 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between gap-4">
          <Logo />
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 lg:flex"
          >
            {links.map((l) =>
              l.href === "/services" ? (
                <details
                  key={l.href}
                  className="group relative"
                  onKeyDown={(event) => {
                    if (event.key === "Escape") {
                      event.currentTarget.open = false;
                      event.currentTarget.querySelector("summary")?.focus();
                    }
                  }}
                >
                  <summary className="text-fg-muted hover:text-signal flex cursor-pointer list-none items-center gap-1 text-sm [&::-webkit-details-marker]:hidden">
                    {l.label}
                    <ChevronDown size={14} aria-hidden />
                  </summary>
                  <div className="border-line bg-background absolute top-full left-0 mt-4 w-80 rounded-xl border p-2 shadow-lg">
                    {[
                      { label: "All services", href: "/services" },
                      ...serviceLinks,
                      {
                        label: "Diagnostic AI audit",
                        href: "/services/ai-audit",
                      },
                    ].map((service) => (
                      <Link
                        className="hover:bg-primary/5 text-fg block rounded-lg px-3 py-3 text-sm"
                        key={service.href}
                        href={service.href}
                        onClick={(event) =>
                          event.currentTarget
                            .closest("details")
                            ?.removeAttribute("open")
                        }
                      >
                        {service.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  className="text-fg-muted hover:text-signal text-sm"
                  key={l.href}
                  href={l.href}
                >
                  {l.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact#book"
              className="bg-signal text-bg hidden rounded-full px-5 py-2.5 text-xs font-medium lg:block"
            >
              Discuss your project
            </Link>
            <button
              ref={toggle}
              className="rounded-lg p-2 lg:hidden"
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {open && (
          <nav
            id="mobile-nav"
            aria-label="Mobile navigation"
            className="border-line flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto border-t py-4 lg:hidden"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                toggle.current?.focus();
              }
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="hover:bg-primary/5 rounded-lg px-3 py-3 text-base"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-line mt-2 border-t pt-3">
              <p className="text-fg-muted px-3 pb-2 text-xs">Service areas</p>
              {serviceLinks.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  onClick={() => setOpen(false)}
                  className="text-fg-muted hover:text-signal block rounded-lg px-3 py-2 text-sm"
                >
                  {service.label}
                </Link>
              ))}
            </div>
            <Link
              onClick={() => setOpen(false)}
              className="bg-signal text-bg mt-2 rounded-full px-4 py-3 text-center text-sm font-medium"
              href="/contact#book"
            >
              Discuss your project
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
}
