export default function Loading() {
  return (
    <div className="min-h-dvh bg-background">
      {/* Navbar skeleton */}
      <div className="sticky top-0 z-50 h-16 border-b border-border/50 bg-background/90 flex items-center justify-between px-6 md:px-10">
        <div className="h-7 w-36 animate-pulse rounded bg-muted" />
        <div className="hidden md:flex items-center gap-6">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="flex flex-col items-center justify-center min-h-[88vh] px-6 py-20 text-center gap-6">
        <div className="h-6 w-28 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-col items-center gap-3 w-full max-w-3xl">
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-12 w-4/5 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="flex flex-col items-center gap-2 w-full max-w-xl">
          <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-muted/60" />
        </div>
        <div className="flex gap-4 mt-2">
          <div className="h-12 w-36 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-36 animate-pulse rounded-full bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
