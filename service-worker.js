const CACHE_NAME = "rf-driver-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/origem.html",
  "/destino.html",
  "/resumo.html",
  "/theme/theme.css",
  "/theme/layout.css",
  "/theme/components.css",
  "/core/global.js",
  "/core/datamanager.js",
  "/js/calculo.js",
  "/manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(
      response => response || fetch(event.request)
    )
  );
});
