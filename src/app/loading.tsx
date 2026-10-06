export default function Loading() {
  return (
    <div className="bg-background min-h-dvh">
      {/* Navbar skeleton */}
      <div className="border-border/50 bg-background/90 sticky top-0 z-50 flex h-16 items-center justify-between border-b px-6 md:px-10">
        <div className="bg-muted h-7 w-36 animate-pulse rounded" />
        <div className="hidden items-center gap-6 md:flex">
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-4 w-16 animate-pulse rounded" />
          <div className="bg-muted h-9 w-28 animate-pulse rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="flex min-h-[88vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <div className="bg-muted h-6 w-28 animate-pulse rounded-full" />
        <div className="flex w-full max-w-3xl flex-col items-center gap-3">
          <div className="bg-muted h-12 w-full animate-pulse rounded-lg" />
          <div className="bg-muted h-12 w-4/5 animate-pulse rounded-lg" />
        </div>
        <div className="flex w-full max-w-xl flex-col items-center gap-2">
          <div className="bg-muted/60 h-4 w-full animate-pulse rounded" />
          <div className="bg-muted/60 h-4 w-5/6 animate-pulse rounded" />
          <div className="bg-muted/60 h-4 w-3/4 animate-pulse rounded" />
        </div>
        <div className="mt-2 flex gap-4">
          <div className="bg-muted h-12 w-36 animate-pulse rounded-full" />
          <div className="bg-muted/50 h-12 w-36 animate-pulse rounded-full" />
        </div>
      </div>
    </div>
  );
}
