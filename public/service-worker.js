const CACHE_NAME = 'memorial-data';

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/api/interviews') ||
    event.request.url.includes('/api/newsics') ||
    event.request.url.includes('/api/ebenums')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      }),
    );
  }
});
