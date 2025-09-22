
const CACHE_NAME = 'epc-planner-v1';
const ASSETS = [
  '/', '/index.html', '/app.jsx', '/manifest.webmanifest',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // cleanup old caches if needed
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Network-first for same-origin, cache-first for CDN
  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      try {
        const net = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, net.clone());
        return net;
      } catch (e) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(event.request);
        return cached || Response.error();
      }
    })());
  } else {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const net = await fetch(event.request);
      cache.put(event.request, net.clone());
      return net;
    })());
  }
});
