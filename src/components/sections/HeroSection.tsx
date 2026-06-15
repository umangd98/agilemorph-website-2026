import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";

export function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-background"
      aria-labelledby="hero-heading"
    >
      {/* Radial glow accent */}
      <div
        className="pointer-events-none absolute inset-0 select-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 70% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      <Container className="py-20 lg:py-28 relative z-10">
        <div className="max-w-3xl">
          {/* Animated badge */}
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-pill border border-primary/20 bg-primary/10 px-4 py-1.5"
            style={{
              animation: "fadeInUp 0.8s ease-out forwards",
            }}
          >
            <span
              className="h-2 w-2 rounded-full bg-primary"
              style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <span className="font-body text-xs font-bold uppercase tracking-widest text-primary">
              Next-Gen Digital Acceleration
            </span>
          </div>

          {/* Main heading */}
          <h1
            id="hero-heading"
            className="mb-8 font-heading text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.2s both",
            }}
          >
            Let AI{" "}
            <span className="text-primary">seamlessly</span>{" "}
            elevate your brand.
          </h1>

          {/* Body */}
          <p
            className="mb-12 max-w-2xl font-body text-lg leading-relaxed text-muted-foreground"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.4s both",
            }}
          >
            We revolutionize efficiency with{" "}
            <strong className="font-bold text-primary">AI Automation</strong>{" "}
            to maximize impact, craft impactful experiences through{" "}
            <strong className="font-bold text-primary">Web Development</strong>{" "}
            with user‑friendly platforms, and amplify influence via{" "}
            <strong className="font-bold text-primary">Digital Marketing</strong>.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col gap-4 sm:flex-row"
            style={{
              animation: "fadeInUp 0.8s ease-out 0.6s both",
            }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 font-body text-sm font-bold text-white shadow-xl shadow-primary/25 hover:bg-primary-dark hover:shadow-primary/40 active:scale-95 transition-all"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-8 py-4 font-body text-sm font-bold text-foreground hover:bg-surface transition-all"
            >
              Explore Our Services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
