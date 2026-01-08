const CACHE_NAME = "app-cache-v1";
const OFFLINE_URL = "/offline.html";

// Files that should always be available offline
const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/app.js",
    "/manifest.json",
    OFFLINE_URL
];

// Install: cache core assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );

    // Activate immediately
    self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

// Fetch: network-first for pages, cache-first for assets
self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Only handle GET requests
    if (request.method !== "GET") return;

    // HTML pages → network first
    if (request.headers.get("accept")?.includes("text/html")) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, copy);
                    });
                    return response;
                })
                .catch(() => caches.match(request).then(res => res || caches.match(OFFLINE_URL)))
        );
        return;
    }

    // Static assets → cache first
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;

            return fetch(request).then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, copy);
                });
                return response;
            });
        })
    );
});
