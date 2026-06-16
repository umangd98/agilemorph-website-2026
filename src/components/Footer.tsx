import Link from "next/link";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const quickLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const serviceLinks = [
  { label: "AI Automation", href: "/services/ai-automation" },
  { label: "Website Development", href: "/services/website-development" },
  { label: "Digital Marketing", href: "/services/digital-marketing" },
  { label: "Virtual Assistance", href: "/services/virtual-assistance" },
  { label: "Book Keeping", href: "/services/bookkeeping" },
];

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <Container className="pt-16 pb-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <Logo className="mb-6" />
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8 max-w-xs">
              Empowering modern enterprises with agile digital transformation and innovative AI‑driven ecosystems.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: LinkedInIcon, label: "LinkedIn", href: "https://linkedin.com" },
                { Icon: TwitterIcon, label: "Twitter/X", href: "https://x.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground mb-6">
              Services
            </h4>
            <ul className="space-y-3.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground mb-6">
              Newsletter
            </h4>
            <p className="font-body text-xs text-muted-foreground mb-4 leading-relaxed">
              Stay updated with the latest in digital acceleration.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
