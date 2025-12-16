const CACHE_NAME = "today-pwa-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./lines.js",
  "./manifest.webmanifest",
  "./icons/meowlogo192.png",
  "./icons/meowlogo512.png",
  "./icons/meowOG.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
