const CACHE_NAME = "gfv-driver-v2";

const FILES_TO_CACHE = [
  "/",
  "/splash.html",
  "/home.html",
  "/origem.html",
  "/destino.html",
  "/resumo.html",

  "/theme/theme.css",
  "/theme/layout.css",
  "/theme/components.css",

  "/core/global.js",
  "/core/datamanager.js",

  "/manifest.json",

  "/icons/192.png",
  "/icons/512.png",
  "/logo.png"
];

/* =========================
   INSTALL
========================= */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

/* =========================
   ACTIVATE (LIMPA CACHE ANTIGO)
========================= */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  self.clients.claim();
});

/* =========================
   FETCH (NETWORK FIRST INTELIGENTE)
========================= */
self.addEventListener("fetch", event => {

  event.respondWith(

    fetch(event.request)
      .then(response => {

        // Atualiza cache com resposta nova
        const clone = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });

        return response;

      })
      .catch(() => {
        // Se offline → usa cache
        return caches.match(event.request);
      })

  );

});