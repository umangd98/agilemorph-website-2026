import Script from "next/script";

import { THEME_STORAGE_KEY } from "@/lib/theme";

// The site is light-only. Force light before paint and clear any stale
// preference from when the theme toggle still existed.
const themeScript = `(function(){try{var r=document.documentElement;r.classList.remove("dark");r.style.colorScheme="light";localStorage.removeItem(${JSON.stringify(THEME_STORAGE_KEY)});}catch(e){}})();`;

export function ThemeScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
