const CACHE_NAME = "today-pwa-v1";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/meowlogo192.png",
  "./icons/meowlogo512.png",
  "./icons/meowOG.png"
];

// ✅ 安裝：快取外殼（不包含 lines.js）
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting(); // ✅ 新 SW 安裝完立刻可接手
});

// ✅ 啟用：清掉舊快取 + 立刻接管頁面
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim(); // ✅ 立刻控制所有已開頁面
});

// ✅ 攔截請求
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // ✅ 句子庫：網路優先（確保你更新，大家拿到）
  if (url.pathname.endsWith("/today/lines.js")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // ✅ 外殼：快取優先（速度快）
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
