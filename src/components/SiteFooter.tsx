import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Container } from "@/components/Container";
import { getContent, getServices, primaryServices } from "@/lib/content";
import type { SettingsContent } from "@/lib/content-types";
export async function SiteFooter() {
  const [settings, services] = await Promise.all([
    getContent<SettingsContent>("siteSettings"),
    getServices(),
  ]);
  return (
    <footer className="border-line bg-bg-elevated border-t py-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="text-fg-muted mt-5 max-w-sm text-sm leading-relaxed">
              Software and AI engineering for SMBs and enterprises. Based in
              Nagpur, India. Working with businesses worldwide.
            </p>
            <div className="mt-5 flex flex-wrap gap-5">
              {settings.socialLinks.map((l) => (
                <a
                  className="text-signal text-sm underline"
                  href={l.url}
                  key={l.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <nav aria-label="Footer services">
            <p className="mb-4 font-mono text-xs tracking-wider uppercase">
              What we build
            </p>
            <ul className="space-y-3">
              {primaryServices(services).map((s) => (
                <li key={s._id}>
                  <Link
                    className="text-fg-muted hover:text-signal text-sm"
                    href={`/services/${s.slug.current}`}
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Footer links">
            <p className="mb-4 font-mono text-xs tracking-wider uppercase">
              AgileMorph
            </p>
            <ul className="space-y-3">
              {settings.footerQuickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    className="text-fg-muted hover:text-signal text-sm"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="border-line text-fg-muted mt-10 border-t pt-6 font-mono text-xs">
          © {new Date().getFullYear()} AgileMorph Solutions.
        </p>
      </Container>
    </footer>
  );
}
