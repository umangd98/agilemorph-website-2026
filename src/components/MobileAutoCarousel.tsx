"use client";

import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

const AUTO_MS = 5000;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

type MobileAutoCarouselProps = {
  children: ReactNode;
  ariaLabel: string;
  desktopClassName: string;
  className?: string;
  autoMs?: number;
  /** When set, carousel slides use these instead of `children` (e.g. always-expanded cards). */
  mobileChildren?: ReactNode;
  /** Classes applied to each mobile slide wrapper. Default: full-width snap slide. */
  mobileSlideClassName?: string;
  /** Classes applied to the mobile scroll track (e.g. gap, padding). */
  mobileTrackClassName?: string;
};

export function MobileAutoCarousel({
  children,
  ariaLabel,
  desktopClassName,
  className = "",
  autoMs = AUTO_MS,
  mobileChildren,
  mobileSlideClassName = "w-full shrink-0 snap-center",
  mobileTrackClassName = "",
}: MobileAutoCarouselProps) {
  const desktopSlides = Children.toArray(children).filter(isValidElement);
  const mobileSlides = Children.toArray(mobileChildren ?? children).filter(isValidElement);
  const count = mobileSlides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollRaf = useRef<number>(0);
  const isProgrammaticScroll = useRef(false);
  const reducedMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number) => {
      if (!count) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || reducedMotion || count <= 1) return;

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, autoMs);

    return () => window.clearInterval(id);
  }, [paused, reducedMotion, count, autoMs]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const slide = container.children[activeIndex] as HTMLElement | undefined;
    if (!slide) return;

    isProgrammaticScroll.current = true;
    container.scrollTo({
      left: slide.offsetLeft,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    const resetFlag = window.setTimeout(
      () => {
        isProgrammaticScroll.current = false;
      },
      reducedMotion ? 0 : 400,
    );

    return () => window.clearTimeout(resetFlag);
  }, [activeIndex, reducedMotion]);

  useEffect(() => {
    const container = scrollRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    const syncMinHeight = () => {
      let maxHeight = 0;
      for (const child of container.children) {
        maxHeight = Math.max(maxHeight, (child as HTMLElement).offsetHeight);
      }
      viewport.style.minHeight = maxHeight > 0 ? `${maxHeight}px` : "";
    };

    syncMinHeight();

    const observer = new ResizeObserver(syncMinHeight);
    for (const child of container.children) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [count, mobileChildren, children]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || count <= 1) return;

    const onScroll = () => {
      if (isProgrammaticScroll.current) return;

      cancelAnimationFrame(scrollRaf.current);
      scrollRaf.current = requestAnimationFrame(() => {
        const { scrollLeft, offsetWidth } = container;
        if (!offsetWidth) return;
        const next = Math.round(scrollLeft / offsetWidth);
        setActiveIndex(Math.min(Math.max(next, 0), count - 1));
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf.current);
    };
  }, [count]);

  if (!count) return null;

  const handleCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(activeIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(activeIndex + 1);
    }
  };

  return (
    <div className={className}>
      <div className={`hidden md:grid ${desktopClassName}`}>
        {desktopSlides}
      </div>

      <div
        className="md:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPaused(false);
          }
        }}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        onKeyDown={handleCarouselKeyDown}
      >
        <div ref={viewportRef} className="overflow-hidden">
          <div
            ref={scrollRef}
            className={`flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${mobileTrackClassName}`}
            aria-live="polite"
          >
          {mobileSlides.map((slide, index) => (
            <div
              key={slide.key ?? index}
              className={mobileSlideClassName}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${count}`}
            >
              {slide}
            </div>
          ))}
          </div>
        </div>

        {count > 1 ? (
          <div
            className="mt-4 flex items-center justify-center gap-2"
            role="tablist"
            aria-label={`${ariaLabel} slides`}
          >
            {mobileSlides.map((slide, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={slide.key ?? index}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                    active ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/40"
                  }`}
                />
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
