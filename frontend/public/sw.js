// VARSHANET 2.0 - Ultra-Lightweight Offline & 2G/3G Service Worker
const CACHE_NAME = 'varshanet-pwa-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.svg',
  '/icon-512.svg'
];

// Install Event: Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[VARSHANET SW] Pre-caching static assets for offline & 2G/3G...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[VARSHANET SW] Removing obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Strategy:
// 1. Static Assets (JS, CSS, SVGs, Fonts): Stale-While-Revalidate or Cache-First
// 2. API calls (/api/): Network-first with Cache fallback for seamless 2G resilience
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g. POST citizen report is handled by offline outbox)
  if (request.method !== 'GET') {
    return;
  }

  // API Requests: Network-First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Fallback to cached API data if network is down or flaky 2G timeouts
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            console.log('[VARSHANET SW] Serving cached API response for:', url.pathname);
            return cachedResponse;
          }
          // If no cache, return a friendly offline JSON payload
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'You are currently in an offline or low-signal 2G/3G zone. Showing cached records.'
            }),
            { headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate / Cache-First
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed; if we don't have a cached response, return index.html for navigation
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
