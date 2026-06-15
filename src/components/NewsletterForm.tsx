"use client";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex"
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        placeholder="Email address"
        className="w-full rounded-l-lg border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="rounded-r-lg bg-primary px-4 py-2.5 text-white hover:bg-primary-dark transition-colors"
        aria-label="Subscribe"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 2 11 13M22 2 15 22 11 13 2 9l20-7z" />
        </svg>
      </button>
    </form>
  );
}
