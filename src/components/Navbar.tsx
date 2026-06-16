"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

import { Container } from "./Container";
import { Logo } from "./Logo";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blog" },
  {
    label: "Services",
    href: "/services/ai-automation",
    children: [
      { label: "AI Automation", href: "/services/ai-automation" },
      { label: "Website Development", href: "/services/website-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Virtual Assistance", href: "/services/virtual-assistance" },
      { label: "Book Keeping", href: "/services/bookkeeping" },
    ],
  },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled || !isHome
          ? "rgba(255,255,255,0.95)"
          : "rgba(15,23,42,0.85)",
        borderBottom: scrolled || !isHome
          ? "1px solid rgba(226,232,240,0.7)"
          : "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: scrolled ? "0 1px 16px rgba(15,23,42,0.06)" : "none",
      }}
    >
      <Container>
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          <Logo />

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const lightText = !scrolled && isHome;

              if ("children" in link) {
                return (
                  <li key={link.href} className="relative">
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      aria-expanded={servicesOpen}
                      className={`flex items-center gap-1 font-body text-sm font-medium transition-colors ${
                        lightText
                          ? "text-slate-300 hover:text-white"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-xl border border-border bg-background py-2 shadow-xl">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2.5 font-body text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
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
                    className={`border-b-2 pb-0.5 font-body text-sm font-medium transition-colors ${
                      isActive
                        ? "border-primary text-primary"
                        : lightText
                        ? "border-transparent text-slate-300 hover:text-white"
                        : "border-transparent text-muted-foreground hover:text-primary"
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
            className="hidden items-center justify-center rounded-lg bg-primary px-6 py-3 font-body text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark active:scale-95 md:inline-flex"
          >
            Get in Touch
          </Link>

          {/* Mobile toggle */}
          <button
            type="button"
            className={`p-2 md:hidden ${!scrolled && isHome ? "text-white" : "text-foreground"}`}
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
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-2 py-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border-b border-border/40 py-2.5 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-primary last:border-0"
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
