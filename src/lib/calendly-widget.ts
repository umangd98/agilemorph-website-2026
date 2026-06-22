import { CALENDLY_DISCOVERY_URL } from "@/lib/calendly";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";

let loadPromise: Promise<void> | null = null;

function ensureCalendlyStyles() {
  if (document.querySelector('link[data-calendly-widget="true"]')) return;

  const link = document.createElement("link");
  link.href = WIDGET_CSS;
  link.rel = "stylesheet";
  link.dataset.calendlyWidget = "true";
  document.head.appendChild(link);
}

function loadCalendlyScript() {
  if (window.Calendly) return Promise.resolve();

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-calendly-widget="true"]',
  );

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      if (window.Calendly) {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Failed to load Calendly widget")),
        { once: true },
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    script.dataset.calendlyWidget = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Calendly widget"));
    document.body.appendChild(script);
  });
}

export function loadCalendlyAssets() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();

  if (!loadPromise) {
    loadPromise = (async () => {
      ensureCalendlyStyles();
      await loadCalendlyScript();
    })().catch((error) => {
      loadPromise = null;
      throw error;
    });
  }

  return loadPromise;
}

export async function openCalendlyPopup(url = CALENDLY_DISCOVERY_URL) {
  const popupUrl =
    url === "/contact#book" || url === "/contact" ? CALENDLY_DISCOVERY_URL : url;

  await loadCalendlyAssets();
  window.Calendly?.initPopupWidget({ url: popupUrl });
}

export function isCalendlyBookingHref(href: string) {
  return (
    href === "/contact#book" ||
    href === CALENDLY_DISCOVERY_URL ||
    /^https:\/\/calendly\.com\//i.test(href)
  );
}
