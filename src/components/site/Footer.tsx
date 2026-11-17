import Link from "next/link";

import { Container } from "@/components/Container";
import { Logo } from "@/components/Logo";
import { COMPANY, FOOTER_TAGLINE, NAV } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule">
      <Container className="grid gap-12 py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-5 text-[0.9375rem] text-ink-muted">{FOOTER_TAGLINE}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-3 text-[0.9375rem]">
            {[...NAV, { label: "Contact", href: "/contact" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="flex flex-col gap-3 text-[0.9375rem] not-italic">
          <a href={`mailto:${COMPANY.email}`} className="text-ink underline decoration-rule underline-offset-4 hover:decoration-green">
            {COMPANY.email}
          </a>
          <span className="text-ink-muted">{COMPANY.location}</span>
          <span className="flex flex-wrap gap-x-4 gap-y-2">
            {COMPANY.social.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </span>
        </address>
      </Container>
      <Container className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-rule-soft py-6 text-sm text-ink-faint">
        <span>&copy; {year} {COMPANY.legalName}. All rights reserved.</span>
        <Link href="/privacy" className="hover:text-ink">
          Privacy policy
        </Link>
      </Container>
    </footer>
  );
}
