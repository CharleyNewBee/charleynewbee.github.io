const CACHE_NAME = `charles-cook-book-v1`;
const offlineFallbackPage = "offline.html";

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll([
      '/',
      '/*',
      '/sw.js',
      '/index.html',      
      '/search.json'
    ]);
  })());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
  });

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
            const cache = await caches.open(CACHE_NAME);
            const cachedResp = await cache.match(offlineFallbackPage);
            return cachedResp;
        }
    }
  })());
});

