const CACHE_NAME = 'memorial-data';

self.addEventListener('fetch', (event) => {
  if (
    event.request.url.includes('/api/articleNews') ||
    event.request.url.includes('/api/pages') ||
    event.request.url.includes('/api/editorial') ||
    event.request.url.includes('/api/watchNews') ||
    event.request.url.includes('/api/youtubeNews')
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
