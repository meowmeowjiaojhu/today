const CACHE_NAME = "today-pwa-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/meowlogo192.png",
  "./icons/meowlogo512.png",
  "./icons/meowOG.png"
];

// 安裝時快取外殼（不快取 lines.js）
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

// 啟用時立刻接手（可避免卡住舊 SW）
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// 攔截請求
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ✅ 句子庫：永遠先抓網路最新（失敗才用舊的）
  if (url.pathname.endsWith("/today/lines.js")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ✅ 其他檔案：快取優先（加速）
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
