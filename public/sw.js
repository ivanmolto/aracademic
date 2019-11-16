const CACHE_NAME = 'ArAcademic';

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);

    if (url.origin !== location.origin || request.method.toLowerCase() !== 'get') {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(request).then(response => {
                return response || fetch(request).then(response => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    cache.put(request, response.clone());

                    return response;
                });
            });
        })
    );
});
