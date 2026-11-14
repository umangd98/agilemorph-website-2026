"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { NAV } from "@/content/site";
import { cn } from "@/lib/utils";

import { BookButton } from "./Button";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <Container>
        <nav aria-label="Main" className="flex h-16 items-center justify-between gap-6">
          <Logo priority />

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "text-[0.9375rem] transition-colors",
                    isActive(item.href)
                      ? "text-ink underline decoration-green decoration-2 underline-offset-[10px]"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <BookButton className="min-h-10 px-5 text-sm" />
          </div>

          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-ink lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </Container>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto border-t border-rule bg-paper lg:hidden"
      >
        <Container className="flex flex-col py-6">
          {[...NAV, { label: "Contact", href: "/contact" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "border-b border-rule-soft py-4 font-display text-2xl font-semibold tracking-[-0.02em]",
                isActive(item.href) ? "text-green" : "text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
          <BookButton className="mt-8 w-full" />
        </Container>
      </div>
    </header>
  );
}
