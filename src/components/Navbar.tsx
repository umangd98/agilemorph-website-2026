"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import { getServiceIcon, type ServiceNavLink } from "@/lib/services";

type NavbarProps = {
  serviceLinks: ServiceNavLink[];
};

const baseNavLinks = [
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

export function Navbar({ serviceLinks }: NavbarProps) {
  const navLinks = [
    ...baseNavLinks.slice(0, 3),
    {
      label: "Services",
      href: serviceLinks[0]?.href ?? "/services/ai-automation",
      children: serviceLinks,
    },
    baseNavLinks[3],
  ];
  const [menuOpen, setMenuOpen]       = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const pathname  = usePathname();
  const { resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); setServicesOpen(false); }, [pathname]);

  const isHome = pathname === "/";
  const heroAtTop = isHome && !scrolled;
  const isDarkTheme = resolvedTheme === "dark";
  const inverseHeader = heroAtTop;

  return (
    <>
      <header
        className={`site-header sticky top-0 z-50 transition-all duration-500 ${scrolled ? "site-header--scrolled" : ""}`}
        data-header={inverseHeader ? "inverse" : undefined}
      >
        <Container>
          <nav className="flex h-[68px] items-center justify-between" aria-label="Main navigation">

            {/* Logo */}
            <Logo priority />

            {/* Desktop links */}
            <ul className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);

                if ("children" in link) {
                  return (
                    <li key={link.href} className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((v) => !v)}
                        aria-expanded={servicesOpen}
                        className={`flex items-center gap-1.5 rounded-lg px-4 py-2 font-body text-sm font-medium transition-all duration-200 ${
                          servicesOpen
                            ? isDarkTheme
                              ? "bg-white/10 text-white"
                              : "bg-primary/8 text-primary"
                            : isDarkTheme
                            ? "text-slate-300 hover:bg-white/8 hover:text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          size={13}
                          className={`mt-px opacity-70 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Dropdown */}
                      <div
                        className="absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10 transition-all duration-200"
                        style={{
                          opacity: servicesOpen ? 1 : 0,
                          transform: servicesOpen
                            ? "translateX(-50%) translateY(0) scale(1)"
                            : "translateX(-50%) translateY(-6px) scale(0.97)",
                          pointerEvents: servicesOpen ? "auto" : "none",
                        }}
                      >
                        <div className="p-2">
                          {serviceLinks.map((child) => {
                            const Icon = getServiceIcon(child.slug);
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => setServicesOpen(false)}
                                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-150 ${
                                  childActive
                                    ? "bg-primary/8 text-primary"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  childActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                }`}>
                                  <Icon size={15} />
                                </span>
                                <span className="flex flex-col">
                                  <span className="font-body text-sm font-semibold leading-tight">
                                    {child.label}
                                  </span>
                                  <span className="font-body text-xs text-muted-foreground">
                                    {child.desc}
                                  </span>
                                </span>
                                <ArrowRight
                                  size={13}
                                  className="ml-auto shrink-0 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-40"
                                />
                              </Link>
                            );
                          })}
                        </div>
                        {/* Footer hint */}
                        <div className="border-t border-border bg-muted/40 px-4 py-2.5">
                          <p className="font-body text-xs text-muted-foreground">
                            Need something custom?{" "}
                            <Link href="/contact" className="font-semibold text-primary hover:underline" onClick={() => setServicesOpen(false)}>
                              Let's talk →
                            </Link>
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative rounded-lg px-4 py-2 font-body text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? isDarkTheme
                            ? "bg-white/12 text-white"
                            : "bg-primary/8 text-primary"
                          : isDarkTheme
                          ? "text-slate-300 hover:bg-white/8 hover:text-white"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA + theme */}
            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle inverse={isDarkTheme && inverseHeader} />
              <CalendlyBookButton className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-body text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary-dark hover:shadow-primary/40 hover:shadow-xl active:scale-95">
                Get in Touch
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </CalendlyBookButton>
            </div>

            {/* Mobile toggle */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle inverse={isDarkTheme && inverseHeader} />
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden ${
                isDarkTheme
                  ? "text-white hover:bg-white/10"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile drawer — full overlay */}
      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Panel slides in from right */}
        <div
          className="absolute right-0 top-0 flex h-full w-[300px] flex-col bg-background shadow-2xl"
          style={{
            transform: menuOpen ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Panel header */}
          <div className="flex h-[68px] items-center justify-between border-b border-border px-5">
            <Logo />
            <div className="flex items-center gap-1">
              <ThemeToggle />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);

              if ("children" in link) {
                return (
                  <div key={link.href}>
                    <button
                      type="button"
                      onClick={() => setServicesOpen((v) => !v)}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-body text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`text-muted-foreground transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {servicesOpen && (
                      <div className="ml-2 mt-1 flex flex-col gap-0.5 border-l-2 border-primary/20 pl-3">
                        {serviceLinks.map((child) => {
                          const Icon = getServiceIcon(child.slug);
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                            >
                              <Icon size={14} />
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xl px-4 py-3 font-body text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-primary/8 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA at bottom */}
          <div className="border-t border-border p-5">
            <CalendlyBookButton
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 font-body text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark active:scale-95"
              onBook={() => setMenuOpen(false)}
            >
              Get in Touch
              <ArrowRight size={14} />
            </CalendlyBookButton>
          </div>
        </div>
      </div>
    </>
  );
}
