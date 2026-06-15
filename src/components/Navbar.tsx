"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Container } from "./Container";
import { Logo } from "./Logo";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blogs" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "Web Development", href: "/services/web-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Virtual Assistance", href: "/services/virtual-assistance" },
    ],
  },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/60 shadow-sm">
      <Container>
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if ("children" in link) {
                return (
                  <li key={link.href} className="relative">
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      className="flex items-center gap-1 font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="absolute top-full left-0 mt-3 w-56 rounded-xl bg-background shadow-xl border border-border py-2 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 text-sm font-body text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                            onClick={() => setServicesOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`font-body text-sm font-medium transition-colors pb-0.5 ${
                      isActive
                        ? "text-primary font-bold border-b-2 border-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <Link
            href="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark active:scale-95 transition-all"
          >
            Get in Touch
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 text-foreground"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <Container className="py-5 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-muted-foreground hover:text-primary py-2.5 transition-colors border-b border-border/40 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-4 inline-flex justify-center rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-white"
              onClick={() => setMenuOpen(false)}
            >
              Get in Touch
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
