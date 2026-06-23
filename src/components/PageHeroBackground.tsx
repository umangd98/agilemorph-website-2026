type PageHeroBackgroundProps = {
  /** Taller fade for full-viewport heroes (homepage). */
  tall?: boolean;
};

export function PageHeroBackground({ tall = false }: PageHeroBackgroundProps) {
  return (
    <>
      <div className="page-hero-gradient-mesh pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="page-hero-gradient-glow pointer-events-none absolute inset-0"
        aria-hidden="true"
      />

      <div
        className="page-hero-orb pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, var(--hero-orb-green) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "hero-orb 9s ease-in-out infinite",
        }}
      />
      <div
        className="page-hero-orb pointer-events-none absolute -bottom-24 -right-24 h-[360px] w-[360px] rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, var(--hero-orb-cyan) 0%, transparent 65%)",
          filter: "blur(70px)",
          animation: "hero-orb-2 11s ease-in-out infinite",
        }}
      />
      {tall ? (
        <div
          className="page-hero-orb pointer-events-none absolute right-[12%] top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full"
          aria-hidden="true"
          style={{
            background: "radial-gradient(circle, var(--hero-orb-violet) 0%, transparent 65%)",
            filter: "blur(80px)",
            animation: "hero-orb 14s ease-in-out infinite reverse",
          }}
        />
      ) : null}

      <div
        className="site-grid-pattern pointer-events-none absolute inset-0 opacity-80"
        aria-hidden="true"
      />

      <div
        className={`hero-bottom-fade pointer-events-none absolute bottom-0 left-0 right-0 z-[1] ${tall ? "h-24" : "h-12"}`}
        aria-hidden="true"
      />
    </>
  );
}
