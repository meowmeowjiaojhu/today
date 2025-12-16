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

// 安裝時快取
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 攔截請求：優先用快取
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
