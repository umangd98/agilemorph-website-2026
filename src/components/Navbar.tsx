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
import {
  getServiceIcon,
  type ServiceNavGroups,
  type ServiceNavLink,
} from "@/lib/services";
import type { NavLink } from "@/sanity/types";

type NavbarProps = {
  serviceGroups: ServiceNavGroups;
  navLinks?: NavLink[];
};

const defaultNavLinks: NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Blogs", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
];

type NavItem = NavLink & { children?: true };

function ServiceLinkRow({
  link,
  active,
  compact = false,
  showArrow = false,
  highlighted = false,
  onNavigate,
}: {
  link: ServiceNavLink;
  active: boolean;
  compact?: boolean;
  showArrow?: boolean;
  highlighted?: boolean;
  onNavigate: () => void;
}) {
  const Icon = getServiceIcon(link.slug);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl transition-all duration-150 ${
        compact ? "px-2.5 py-2" : "px-3 py-3"
      } ${
        active || highlighted
          ? "bg-primary/8 text-primary"
          : "text-foreground hover:bg-muted"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg transition-colors ${
          compact ? "h-7 w-7" : "h-8 w-8"
        } ${
          active
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
        }`}
      >
        <Icon size={compact ? 14 : 15} />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-body text-sm font-semibold leading-tight">{link.label}</span>
        {!compact && (
          <span className="font-body text-xs text-muted-foreground">{link.desc}</span>
        )}
      </span>
      <ArrowRight
        size={13}
        className={`ml-auto shrink-0 transition-all duration-150 ${
          showArrow
            ? highlighted
              ? "translate-x-0.5 opacity-70"
              : "opacity-30 group-hover:translate-x-0.5 group-hover:opacity-50"
            : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-40"
        }`}
      />
    </Link>
  );
}

function SubServiceCard({
  link,
  active,
  onNavigate,
}: {
  link: ServiceNavLink;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = getServiceIcon(link.slug);

  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className={`group flex gap-2.5 rounded-xl border p-3 transition-all duration-150 ${
        active
          ? "border-primary/25 bg-primary/8 text-primary"
          : "border-transparent bg-muted/40 text-foreground hover:border-border hover:bg-muted"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          active
            ? "bg-primary/15 text-primary"
            : "bg-background text-muted-foreground group-hover:text-primary"
        }`}
      >
        <Icon size={15} />
      </span>
      <span className="min-w-0">
        <span className="block font-body text-sm font-semibold leading-tight">{link.label}</span>
        <span className="mt-0.5 block font-body text-xs leading-snug text-muted-foreground">
          {link.desc}
        </span>
      </span>
    </Link>
  );
}

function ServicesDropdownFooter({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="border-t border-border bg-muted/40 px-4 py-2.5">
      <p className="font-body text-xs text-muted-foreground">
        Need something custom?{" "}
        <Link
          href="/contact"
          className="font-semibold text-primary hover:underline"
          onClick={onNavigate}
        >
          Let&apos;s talk →
        </Link>
      </p>
    </div>
  );
}

export function Navbar({ serviceGroups, navLinks = defaultNavLinks }: NavbarProps) {
  const { primary, aiAutomationSubs, additional } = serviceGroups;
  const links = navLinks.length > 0 ? navLinks : defaultNavLinks;
  const contactLink = links.find((link) => link.href === "/contact") ?? links[links.length - 1];
  const linksBeforeServices = links.filter((link) => link.href !== contactLink?.href);

  const navItems: NavItem[] = [
    ...linksBeforeServices,
    { label: "Services", href: "/services", children: true },
    ...(contactLink ? [contactLink] : []),
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLLIElement>(null);

  const closeMenus = () => {
    setServicesOpen(false);
    setAiPanelOpen(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setAiPanelOpen(false);
  }, [pathname]);

  const isHome = pathname === "/";
  const heroAtTop = isHome && !scrolled;
  const isDarkTheme = resolvedTheme === "dark";
  const inverseHeader = heroAtTop;

  const isLinkActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const isAiAutomationRoute =
    (primary && isLinkActive(primary.href)) ||
    aiAutomationSubs.some((sub) => isLinkActive(sub.href));

  useEffect(() => {
    if (servicesOpen) {
      setAiPanelOpen(isAiAutomationRoute);
    } else {
      setAiPanelOpen(false);
    }
  }, [servicesOpen, isAiAutomationRoute]);

  return (
    <>
      <header
        className={`site-header sticky top-0 z-[100] transition-all duration-500 ${scrolled ? "site-header--scrolled" : ""}`}
        data-header={inverseHeader ? "inverse" : undefined}
      >
        <Container>
          <nav className="flex h-[68px] items-center justify-between" aria-label="Main navigation">
            <Logo priority />

            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((link) => {
                const isServices = "children" in link;
                const isActive = isServices
                  ? pathname.startsWith("/services")
                  : pathname.startsWith(link.href);

                if (isServices) {
                  return (
                    <li key={link.href} className="relative" ref={dropdownRef}>
                      <div
                        className={`flex items-center rounded-lg transition-all duration-200 ${
                          servicesOpen || isActive
                            ? isDarkTheme
                              ? "bg-white/10 text-white"
                              : "bg-primary/8 text-primary"
                            : isDarkTheme
                              ? "text-slate-300 hover:bg-white/8 hover:text-white"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setServicesOpen(false)}
                          className="rounded-l-lg px-4 py-2 font-body text-sm font-medium"
                        >
                          {link.label}
                        </Link>
                        <button
                          type="button"
                          onClick={() => setServicesOpen((v) => !v)}
                          aria-expanded={servicesOpen}
                          aria-label="Toggle services menu"
                          className="rounded-r-lg px-2 py-2"
                        >
                          <ChevronDown
                            size={13}
                            className={`mt-px opacity-70 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      <div
                        className="absolute right-0 top-full z-50 mt-2"
                        style={{
                          opacity: servicesOpen ? 1 : 0,
                          transform: servicesOpen
                            ? "translateY(0) scale(1)"
                            : "translateY(-6px) scale(0.97)",
                          pointerEvents: servicesOpen ? "auto" : "none",
                          transition: "opacity 200ms ease, transform 200ms ease",
                        }}
                      >
                        <div
                          className="relative"
                          onMouseLeave={() => setAiPanelOpen(false)}
                        >
                          <div className="w-[280px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
                            <div className="p-2">
                              {primary ? (
                                <div onMouseEnter={() => setAiPanelOpen(true)}>
                                  <ServiceLinkRow
                                    link={primary}
                                    active={isLinkActive(primary.href)}
                                    highlighted={aiPanelOpen}
                                    showArrow
                                    onNavigate={() => setServicesOpen(false)}
                                  />
                                </div>
                              ) : null}

                              {additional.length > 0 ? (
                                <div
                                  className="mt-2 border-t border-border/70 pt-2"
                                  onMouseEnter={() => setAiPanelOpen(false)}
                                >
                                  <p className="px-3 pb-1 font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    General services
                                  </p>
                                  <div className="flex flex-col gap-0.5">
                                    {additional.map((child) => (
                                      <ServiceLinkRow
                                        key={child.href}
                                        link={child}
                                        active={isLinkActive(child.href)}
                                        compact
                                        onNavigate={() => setServicesOpen(false)}
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            <ServicesDropdownFooter onNavigate={() => setServicesOpen(false)} />
                          </div>

                          <div
                            className={`absolute left-full top-0 ml-2 w-[min(440px,calc(100vw-20rem))] rounded-2xl border border-border bg-background p-4 shadow-2xl shadow-black/10 transition-all duration-200 ease-out ${
                              aiPanelOpen
                                ? "pointer-events-auto translate-x-0 opacity-100"
                                : "pointer-events-none invisible -translate-x-1 opacity-0"
                            }`}
                            onMouseEnter={() => setAiPanelOpen(true)}
                            aria-hidden={!aiPanelOpen}
                          >
                            <div className="mb-3 flex items-center justify-between gap-3">
                              <div>
                                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-primary">
                                  AI Automation
                                </p>
                                <p className="font-heading text-sm font-bold text-foreground">
                                  Specializations
                                </p>
                              </div>
                              {primary ? (
                                <Link
                                  href={primary.href}
                                  onClick={() => setServicesOpen(false)}
                                  className="inline-flex shrink-0 items-center gap-1 font-body text-xs font-semibold text-primary hover:underline"
                                >
                                  View all
                                  <ArrowRight size={12} />
                                </Link>
                              ) : null}
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {aiAutomationSubs.map((child) => (
                                <SubServiceCard
                                  key={child.href}
                                  link={child}
                                  active={isLinkActive(child.href)}
                                  onNavigate={() => setServicesOpen(false)}
                                />
                              ))}
                            </div>
                          </div>
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

      <div
        className="fixed inset-0 z-40 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }}
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

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navItems.map((link) => {
              const isServices = "children" in link;
              const isActive = isServices
                ? pathname.startsWith("/services")
                : pathname.startsWith(link.href);

              if (isServices) {
                return (
                  <div key={link.href}>
                    <div className="flex items-center gap-1">
                      <Link
                        href={link.href}
                        onClick={closeMenus}
                        className={`flex-1 rounded-xl px-4 py-3 font-body text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-primary/8 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((v) => !v)}
                        aria-expanded={servicesOpen}
                        aria-label="Toggle services menu"
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {servicesOpen ? (
                      <div className="ml-2 mt-1 space-y-4 border-l-2 border-primary/20 pl-3">
                        {primary ? (
                          <Link
                            href={primary.href}
                            onClick={closeMenus}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 font-body text-sm font-semibold text-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                          >
                            {primary.label}
                          </Link>
                        ) : null}

                        {aiAutomationSubs.length > 0 ? (
                          <div>
                            <p className="px-3 pb-1 font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Specializations
                            </p>
                            <div className="flex flex-col gap-0.5">
                              {aiAutomationSubs.map((child) => {
                                const Icon = getServiceIcon(child.slug);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeMenus}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 font-body text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                                  >
                                    <Icon size={14} />
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        {additional.length > 0 ? (
                          <div>
                            <p className="px-3 pb-1 font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              General services
                            </p>
                            <div className="flex flex-col gap-0.5">
                              {additional.map((child) => {
                                const Icon = getServiceIcon(child.slug);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    onClick={closeMenus}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 font-body text-sm text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary"
                                  >
                                    <Icon size={14} />
                                    {child.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
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
                  onClick={closeMenus}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

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
