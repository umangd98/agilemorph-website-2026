/*
 * Kill-switch service worker.
 *
 * This app does NOT use a service worker. However, browsers that previously
 * registered a service worker on this origin (e.g. another project served on
 * localhost:3000, or an earlier deploy) keep an orphaned worker that intercepts
 * requests and serves stale/broken content. Browsers periodically re-fetch the
 * worker script from /sw.js, so serving this self-unregistering worker makes
 * those stale workers tear themselves down and drop their caches.
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {
        /* ignore */
      }
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })(),
  );
});
