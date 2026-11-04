"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";

import { CalendlyBookButton } from "@/components/CalendlyBookButton";
import { Container } from "./Container";
import { Logo } from "./Logo";
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
  { label: "Events", href: "/events" },
];

type LinkMenuKey = "products" | "resources";

type NavItem = NavLink & {
  children?: true;
  type?: "services" | LinkMenuKey;
};

/* -------------------------------------------------------------------------- */
/* Product configuration                                                       */
/* -------------------------------------------------------------------------- */

const PRODUCT_LINKS: ServiceNavLink[] = [
  {
    slug: "ai-content-management",
    label: "CAT",
    href: "/products/ai-content-management-tool",
    desc: "AI-powered content workflows for teams",
    isNew: true,
  },
];

const RESOURCE_LINKS: ServiceNavLink[] = [
  {
    slug: "peak-week-calculator",
    label: "Peak Week Calculator",
    href: "/resources/peak-week-calculator",
    desc: "Plan Black Friday support hours, day by day",
    isNew: true,
  },
];

const LINK_MENUS: Record<
  LinkMenuKey,
  {
    label: string;
    heading: string;
    links: ServiceNavLink[];
    panelMarginLeft?: string;
  }
> = {
  products: {
    label: "Products",
    heading: "AI-powered products",
    links: PRODUCT_LINKS,
    panelMarginLeft: "clamp(40px, 10vw, 100px)",
  },
  resources: {
    label: "Resources",
    heading: "Free tools and playbooks",
    links: RESOURCE_LINKS,
  },
};

const isLinkMenuKey = (type: NavItem["type"]): type is LinkMenuKey =>
  type === "products" || type === "resources";

/* -------------------------------------------------------------------------- */
/* Shared Service/Product Row                                                  */
/* -------------------------------------------------------------------------- */

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
        <span className="font-body text-sm font-semibold leading-tight">
          {link.label}
        </span>

        {!compact && (
          <span className="font-body text-xs text-muted-foreground">
            {link.desc}
          </span>
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

/* -------------------------------------------------------------------------- */
/* AI Automation Sub-Service Card                                             */
/* -------------------------------------------------------------------------- */

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
      className={`group relative flex gap-2.5 rounded-xl border p-3 transition-all duration-150 ${
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

      <span className="min-w-0 pr-12">
        <span className="flex items-center gap-2">
          <span className="font-body text-sm font-semibold leading-tight">
            {link.label}
          </span>

          {link.isNew && (
            <span className="absolute right-2.5 top-2.5 z-10">
              <span className="relative inline-flex items-center gap-1.5 rounded-full border border-[#15803d]/20 bg-[#15803d]/10 px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-[#15803d] shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#15803d]/40" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#15803d]" />
                </span>

                NEW
              </span>
            </span>
          )}
        </span>

        <span className="mt-0.5 block font-body text-xs leading-snug text-muted-foreground">
          {link.desc}
        </span>
      </span>
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Services Footer                                                             */
/* -------------------------------------------------------------------------- */

function ServicesDropdownFooter({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
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

/* -------------------------------------------------------------------------- */
/* Products Footer                                                             */
/* -------------------------------------------------------------------------- */

function ProductsDropdownFooter({
  onNavigate,
}: {
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-border bg-muted/40 px-4 py-2.5">
      <p className="font-body text-xs text-muted-foreground">
        Looking for something else?{" "}
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

/* -------------------------------------------------------------------------- */
/* Navbar                                                                      */
/* -------------------------------------------------------------------------- */

export function Navbar({
  serviceGroups,
  navLinks = defaultNavLinks,
}: NavbarProps) {
  const { primary, aiAutomationSubs, additional } = serviceGroups;

  const links = navLinks.length > 0 ? navLinks : defaultNavLinks;

  const contactLink =
    links.find((link) => link.href === "/contact") ??
    links[links.length - 1];

  const linksBeforeServices = links.filter(
    (link) =>
      link.href !== contactLink?.href &&
      link.href !== "/events",
  );

  const navItems: NavItem[] = [
    ...linksBeforeServices,

    {
      label: "Products",
      href: "#",
      type: "products",
      children: true,
    },

    {
      label: "Services",
      href: "/services",
      type: "services",
      children: true,
    },

    {
      label: "Resources",
      href: "#",
      type: "resources",
      children: true,
    },

    {
      label: "Events",
      href: "/events",
    },

    ...(contactLink ? [contactLink] : []),
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [openLinkMenu, setOpenLinkMenu] = useState<LinkMenuKey | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  const servicesDropdownRef = useRef<HTMLLIElement>(null);

  const menuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkMenuCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  /* ------------------------------------------------------------------------ */
  /* Menu timers                                                               */
  /* ------------------------------------------------------------------------ */

  const clearMenuCloseTimer = () => {
    if (menuCloseTimer.current) {
      clearTimeout(menuCloseTimer.current);
      menuCloseTimer.current = null;
    }
  };

  const clearLinkMenuCloseTimer = () => {
    if (linkMenuCloseTimer.current) {
      clearTimeout(linkMenuCloseTimer.current);
      linkMenuCloseTimer.current = null;
    }
  };

  const scheduleMenuClose = () => {
    clearMenuCloseTimer();

    menuCloseTimer.current = setTimeout(() => {
      setServicesOpen(false);
      setAiPanelOpen(false);
    }, 150);
  };

  const scheduleLinkMenuClose = () => {
    clearLinkMenuCloseTimer();

    linkMenuCloseTimer.current = setTimeout(() => {
      setOpenLinkMenu(null);
    }, 150);
  };

  const openServicesMenu = () => {
    clearMenuCloseTimer();
    setOpenLinkMenu(null);
    setServicesOpen(true);
  };

  const openLinkMenuNow = (key: LinkMenuKey) => {
    clearLinkMenuCloseTimer();
    setServicesOpen(false);
    setAiPanelOpen(false);
    setOpenLinkMenu(key);
  };

  const closeMenus = () => {
    setServicesOpen(false);
    setOpenLinkMenu(null);
    setAiPanelOpen(false);
    setMenuOpen(false);
  };

  /* ------------------------------------------------------------------------ */
  /* Scroll                                                                    */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Outside click                                                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(target)
      ) {
        setServicesOpen(false);
        setAiPanelOpen(false);
      }

      if (!(target as Element).closest?.("[data-link-menu]")) {
        setOpenLinkMenu(null);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Cleanup                                                                   */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    return () => {
      clearMenuCloseTimer();
      clearLinkMenuCloseTimer();
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Close menus on route change                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setOpenLinkMenu(null);
    setAiPanelOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------------------ */
  /* Header state                                                              */
  /* ------------------------------------------------------------------------ */

  const isHome = pathname === "/";
  const heroAtTop = isHome && !scrolled;
  const inverseHeader = heroAtTop;

  const isLinkActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const isAiAutomationRoute =
    (primary && isLinkActive(primary.href)) ||
    aiAutomationSubs.some((sub) => isLinkActive(sub.href));

  const isLinkMenuRoute = (key: LinkMenuKey) =>
    LINK_MENUS[key].links.some((item) => isLinkActive(item.href));

  /* ------------------------------------------------------------------------ */
  /* AI panel state                                                            */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (servicesOpen) {
      setAiPanelOpen(isAiAutomationRoute);
    } else {
      setAiPanelOpen(false);
    }
  }, [servicesOpen, isAiAutomationRoute]);

  /* ------------------------------------------------------------------------ */
  /* Render                                                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <header
        className={`site-header sticky top-0 z-[100] transition-all duration-500 ${
          scrolled ? "site-header--scrolled" : ""
        }`}
        data-header={inverseHeader ? "inverse" : undefined}
      >
        <Container>
          <nav
            className="flex h-[68px] items-center justify-between"
            aria-label="Main navigation"
          >
            <Logo priority />

            {/* ---------------------------------------------------------------- */}
            {/* Desktop Navigation                                               */}
            {/* ---------------------------------------------------------------- */}

            <ul className="hidden items-center gap-1 xl:flex">
              {navItems.map((link) => {
                const isServices = link.type === "services";
                const linkMenuKey = isLinkMenuKey(link.type) ? link.type : null;

                const isActive =
                  isServices
                    ? pathname.startsWith("/services")
                    : linkMenuKey
                      ? isLinkMenuRoute(linkMenuKey)
                      : pathname.startsWith(link.href);

                /* ------------------------------------------------------------ */
                /* Products and Resources                                        */
                /* ------------------------------------------------------------ */

                if (linkMenuKey) {
                  const menu = LINK_MENUS[linkMenuKey];
                  const menuOpenNow = openLinkMenu === linkMenuKey;
                  const closeThisMenu = () => setOpenLinkMenu(null);

                  return (
                    <li
                      key={linkMenuKey}
                      className="relative"
                      data-link-menu
                      onMouseEnter={() => openLinkMenuNow(linkMenuKey)}
                      onMouseLeave={scheduleLinkMenuClose}
                    >
                      <div
                        className={`flex items-center rounded-full transition-colors duration-200 ${
                          menuOpenNow || isActive
                            ? "text-fg"
                            : "text-fg-muted hover:text-fg"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(event) => {
                            setServicesOpen(false);
                            setAiPanelOpen(false);
                            // Hover has already opened it for a mouse, so a
                            // mouse click must not close it again. Only keyboard
                            // clicks (detail 0) toggle.
                            setOpenLinkMenu(
                              event.detail === 0 && menuOpenNow
                                ? null
                                : linkMenuKey,
                            );
                          }}
                          aria-expanded={menuOpenNow}
                          aria-haspopup="true"
                          className="flex items-center gap-1.5 rounded-lg px-4 py-2 font-body text-sm font-medium"
                        >
                          {menu.label}

                          <ChevronDown
                            size={13}
                            className={`mt-px opacity-70 transition-transform duration-300 ${
                              menuOpenNow ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      <div
                        className="absolute left-1/2 top-full z-50 mt-2"
                        onMouseEnter={() => openLinkMenuNow(linkMenuKey)}
                        style={{
                          marginLeft: menu.panelMarginLeft,
                          opacity: menuOpenNow ? 1 : 0,
                          transform: menuOpenNow
                            ? "translate(-50%, 0) scale(1)"
                            : "translate(-50%, -6px) scale(0.97)",
                          pointerEvents: menuOpenNow ? "auto" : "none",
                          transition:
                            "opacity 200ms ease, transform 200ms ease, margin-left 200ms ease",
                        }}
                      >
                        <div className="w-[420px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
                          <div className="p-2">
                            <div className="px-3 pb-2 pt-2">
                              <p className="font-body text-[10px] font-bold uppercase tracking-widest text-primary">
                                {menu.label}
                              </p>

                              <p className="mt-0.5 font-heading text-sm font-bold text-foreground">
                                {menu.heading}
                              </p>
                            </div>

                            <div className="border-t border-border/70 pt-2">
                              {menu.links.map((item) => (
                                <ServiceLinkRow
                                  key={item.href}
                                  link={item}
                                  active={isLinkActive(item.href)}
                                  showArrow
                                  onNavigate={closeThisMenu}
                                />
                              ))}
                            </div>
                          </div>

                          <ProductsDropdownFooter onNavigate={closeThisMenu} />
                        </div>
                      </div>
                    </li>
                  );
                }

                /* ------------------------------------------------------------ */
                /* Services                                                      */
                /* ------------------------------------------------------------ */

                if (isServices) {
                  return (
                    <li
                      key="services"
                      className="relative"
                      ref={servicesDropdownRef}
                      onMouseEnter={openServicesMenu}
                      onMouseLeave={scheduleMenuClose}
                    >
                      <div
                        className={`flex items-center rounded-full transition-colors duration-200 ${
                          servicesOpen || isActive
                            ? "text-fg"
                            : "text-fg-muted hover:text-fg"
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
                          onClick={() => {
                            setServicesOpen((value) => !value);
                            setOpenLinkMenu(null);
                          }}
                          aria-expanded={servicesOpen}
                          aria-haspopup="true"
                          aria-label="Toggle services menu"
                          className="rounded-r-lg px-2 py-2"
                        >
                          <ChevronDown
                            size={13}
                            className={`mt-px opacity-70 transition-transform duration-300 ${
                              servicesOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Services Dropdown */}
                      <div
                        className="absolute right-0 top-full z-50 mt-2"
                        onMouseEnter={openServicesMenu}
                        style={{
                          opacity: servicesOpen ? 1 : 0,
                          transform: servicesOpen
                            ? "translateY(0) scale(1)"
                            : "translateY(-6px) scale(0.97)",
                          pointerEvents: servicesOpen ? "auto" : "none",
                          transition:
                            "opacity 200ms ease, transform 200ms ease",
                        }}
                      >
                        <div className="relative flex items-start">
                          {/* Main Services Panel */}
                          <div className="w-[280px] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/10">
                            <div className="p-2">
                              {primary ? (
                                <div
                                  onMouseEnter={() =>
                                    setAiPanelOpen(true)
                                  }
                                >
                                  <ServiceLinkRow
                                    link={primary}
                                    active={isLinkActive(primary.href)}
                                    highlighted={aiPanelOpen}
                                    showArrow
                                    onNavigate={() =>
                                      setServicesOpen(false)
                                    }
                                  />
                                </div>
                              ) : null}

                              {additional.length > 0 ? (
                                <div className="mt-2 border-t border-border/70 pt-2">
                                  <p className="px-3 pb-1 font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    General Services
                                  </p>

                                  <div className="flex flex-col gap-0.5">
                                    {additional.map((child) => (
                                      <ServiceLinkRow
                                        key={child.href}
                                        link={child}
                                        active={isLinkActive(child.href)}
                                        compact
                                        onNavigate={() =>
                                          setServicesOpen(false)
                                        }
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            <ServicesDropdownFooter
                              onNavigate={() =>
                                setServicesOpen(false)
                              }
                            />
                          </div>

                          {/* AI Automation Panel */}
                          <div
                            className={`absolute left-full top-0 -ml-2 w-[min(600px,calc(100vw-20rem))] pl-2 transition-all duration-200 ease-out ${
                              aiPanelOpen
                                ? "pointer-events-auto translate-x-0 opacity-100"
                                : "pointer-events-none invisible -translate-x-1 opacity-0"
                            }`}
                            onMouseEnter={() => {
                              clearMenuCloseTimer();
                              setAiPanelOpen(true);
                            }}
                            aria-hidden={!aiPanelOpen}
                          >
                            <div className="rounded-2xl border border-border bg-background p-4 shadow-2xl shadow-black/10">
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
                                    onClick={() =>
                                      setServicesOpen(false)
                                    }
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
                                    onNavigate={() =>
                                      setServicesOpen(false)
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                }

                /* ------------------------------------------------------------ */
                /* Normal Navigation Links                                       */
                /* ------------------------------------------------------------ */

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`relative rounded-full px-4 py-2 font-body text-sm transition-colors duration-200 ${
                        isActive
                          ? "text-fg"
                          : "text-fg-muted hover:text-fg"
                      }`}
                    >
                      {link.label}

                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-signal" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* ---------------------------------------------------------------- */}
            {/* Desktop CTA                                                       */}

            <div className="hidden items-center gap-2 xl:flex">
              <CalendlyBookButton className="group inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 font-body text-sm font-medium text-bg transition-opacity duration-200 hover:opacity-90 active:scale-95">
                Get In Touch

                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </CalendlyBookButton>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Mobile Toggle                                                     */}

            <div className="flex items-center gap-1 xl:hidden">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg xl:hidden"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* ====================================================================== */}
      {/* Mobile Navigation                                                      */}
      {/* ====================================================================== */}

      <div
        className="fixed inset-0 z-40 xl:hidden"
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
            transform: menuOpen
              ? "translateX(0)"
              : "translateX(100%)",
            transition:
              "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Mobile Header */}
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

          {/* Mobile Links */}
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navItems.map((link) => {
              const isServices = link.type === "services";
              const linkMenuKey = isLinkMenuKey(link.type) ? link.type : null;

              const isActive =
                isServices
                  ? pathname.startsWith("/services")
                  : linkMenuKey
                    ? isLinkMenuRoute(linkMenuKey)
                    : pathname.startsWith(link.href);

              /* -------------------------------------------------------------- */
              /* Mobile Products and Resources                                   */
              /* -------------------------------------------------------------- */

              if (linkMenuKey) {
                const menu = LINK_MENUS[linkMenuKey];
                const menuOpenNow = openLinkMenu === linkMenuKey;

                return (
                  <div key={`mobile-${linkMenuKey}`} data-link-menu>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenLinkMenu(menuOpenNow ? null : linkMenuKey)
                        }
                        aria-expanded={menuOpenNow}
                        className={`flex flex-1 items-center justify-between rounded-xl px-4 py-3 font-body text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-primary/8 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{menu.label}</span>

                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            menuOpenNow ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {menuOpenNow ? (
                      <div className="ml-2 mt-1 space-y-1 border-l-2 border-primary/20 pl-3">
                        <p className="px-3 pb-1 pt-2 font-body text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {menu.label}
                        </p>

                        {menu.links.map((item) => {
                          const Icon = getServiceIcon(item.slug);

                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={closeMenus}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 font-body text-sm transition-colors ${
                                isLinkActive(item.href)
                                  ? "bg-primary/8 font-semibold text-primary"
                                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                              }`}
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon size={14} />
                              </span>

                              <span className="flex min-w-0 flex-col">
                                <span className="font-semibold">
                                  {item.label}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                  {item.desc}
                                </span>
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }

              /* -------------------------------------------------------------- */
              /* Mobile Services                                                 */
              /* -------------------------------------------------------------- */

              if (isServices) {
                return (
                  <div key="mobile-services">
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
                        onClick={() =>
                          setServicesOpen((value) => !value)
                        }
                        aria-expanded={servicesOpen}
                        aria-label="Toggle services menu"
                        className="flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted"
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            servicesOpen ? "rotate-180" : ""
                          }`}
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
                                const Icon = getServiceIcon(
                                  child.slug,
                                );

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
                              General Services
                            </p>

                            <div className="flex flex-col gap-0.5">
                              {additional.map((child) => {
                                const Icon = getServiceIcon(
                                  child.slug,
                                );

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

              /* -------------------------------------------------------------- */
              /* Normal Mobile Links                                             */
              /* -------------------------------------------------------------- */

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

          {/* Mobile CTA */}
          <div className="border-t border-border p-5">
            <CalendlyBookButton
              className="flex w-full items-center justify-center gap-2 rounded-full bg-signal py-3.5 font-body text-sm font-medium text-bg transition-opacity hover:opacity-90 active:scale-95"
              onBook={() => setMenuOpen(false)}
            >
              Get In Touch
              <ArrowRight size={14} />
            </CalendlyBookButton>
          </div>
        </div>
      </div>
    </>
  );
}