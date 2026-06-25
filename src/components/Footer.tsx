import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import type { FooterServiceGroups } from "@/lib/services";
import type { NavLink, SocialLink, SocialPlatform } from "@/sanity/types";

const emptyServiceGroups: FooterServiceGroups = {
  primary: null,
  aiAutomationSubs: [],
  additional: [],
};

function socialIconForPlatform(platform?: SocialPlatform) {
  switch (platform) {
    case "linkedin":
      return LinkedInIcon;
    case "instagram":
      return InstagramIcon;
    case "facebook":
      return FacebookIcon;
    default:
      return LinkedInIcon;
  }
}

type FooterProps = {
  serviceGroups?: FooterServiceGroups;
  quickLinks?: NavLink[];
  socialLinks?: SocialLink[];
  newsletterHeading?: string;
  newsletterDescription?: string;
};

const footerLinkClass =
  "font-body text-sm text-muted-foreground transition-colors hover:text-primary";

function FooterNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={`${footerLinkClass} inline-block leading-snug`}>
      {label}
    </Link>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );
}

function FooterSectionHeading({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-5 font-heading text-xs font-bold uppercase tracking-widest text-foreground">
      {children}
    </h4>
  );
}

function FooterLinkList({ links }: { links: { href: string; label: string }[] }) {
  return (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <FooterNavLink href={link.href} label={link.label} />
        </li>
      ))}
    </ul>
  );
}

function FooterServices({ groups }: { groups: FooterServiceGroups }) {
  const { primary, aiAutomationSubs, additional } = groups;

  return (
    <>
      <FooterSectionHeading>Services</FooterSectionHeading>

      <div className="space-y-6">
        {primary ? (
          <div>
            <Link
              href={primary.href}
              className="font-body text-sm font-semibold text-foreground transition-colors hover:text-primary"
            >
              {primary.label}
            </Link>

            {aiAutomationSubs.length > 0 ? (
              <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                {aiAutomationSubs.map((link) => (
                  <li key={link.href}>
                    <FooterNavLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {additional.length > 0 ? (
          <div className="border-t border-border/70 pt-5">
            <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              General services
            </p>
            <FooterLinkList links={additional} />
          </div>
        ) : null}
      </div>
    </>
  );
}

export function Footer({
  serviceGroups = emptyServiceGroups,
  quickLinks = [],
  socialLinks = [],
  newsletterHeading = "Newsletter",
  newsletterDescription = "Stay updated with the latest in digital acceleration.",
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-border bg-footer">
      <Container className="pt-14 pb-6 sm:pt-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
          <div className="sm:col-span-2 lg:col-span-3">
            <Logo className="mb-5" />
            <p className="mb-6 max-w-sm font-body text-sm leading-relaxed text-muted-foreground">
              Empowering modern enterprises with agile digital transformation and innovative
              AI‑driven ecosystems.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((link) => {
                const Icon = socialIconForPlatform(link.platform);
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-2">
            <FooterSectionHeading>Quick Links</FooterSectionHeading>
            <FooterLinkList links={quickLinks} />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <FooterServices groups={serviceGroups} />
          </div>

          <div className="lg:col-span-3">
            <FooterSectionHeading>{newsletterHeading}</FooterSectionHeading>
            <p className="mb-5 font-body text-sm leading-relaxed text-muted-foreground">
              {newsletterDescription}
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-muted-foreground">
            &copy; {year} AgileMorph Digital Accelerators. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="font-body text-[10px] uppercase tracking-widest text-muted-foreground">
              System Status: Optimal
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
