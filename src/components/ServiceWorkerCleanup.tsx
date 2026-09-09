import Script from "next/script";

/*
 * This app registers no service worker. But browsers that previously registered
 * one on this origin (e.g. another project served on localhost:3000, or an old
 * deploy) keep an orphaned worker that intercepts requests and serves stale
 * content. This runs early on every load to unregister any such worker and drop
 * its caches, so a single fresh load permanently cleans the browser up. Paired
 * with the self-destructing /public/sw.js kill-switch.
 */
const cleanupScript = `(function(){try{if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(function(rs){rs.forEach(function(r){r.unregister();});}).catch(function(){});}if(window.caches&&caches.keys){caches.keys().then(function(ks){ks.forEach(function(k){caches.delete(k);});}).catch(function(){});}}catch(e){}})();`;

export function ServiceWorkerCleanup() {
  return (
    <Script
      id="sw-cleanup"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: cleanupScript }}
    />
  );
}
