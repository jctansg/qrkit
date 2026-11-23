// Service worker for the QRKit tools.
// Goal: after the first online visit, everything needed to run the tools —
// the page itself plus CDN-hosted libraries and fonts — is in the Cache API,
// so the apps keep working with no internet connection.

const CACHE = 'qrkit-v1';

// Origins we treat as immutable CDN assets (versioned URLs, safe to cache
// aggressively). Covers jsDelivr, cdnjs, and Google Fonts.
const CDN_HOSTS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

// On install, take over immediately; on activate, drop caches from older
// versions of this worker so storage doesn't grow forever.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  // Only cache GET requests — POST/PUT etc. can't be replayed safely.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (CDN_HOSTS.includes(url.hostname)) {
    // CDN files: cache-first. These are versioned, immutable URLs, so a
    // cached copy is always correct — and it's what makes offline work.
    event.respondWith(
      caches.match(request).then(hit => {
        if (hit) return hit;
        return fetch(request).then(res => {
          // Only store successful responses (avoid caching error pages).
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  if (url.origin === location.origin) {
    // Same-origin files (the HTML pages, manifest, icons, JS libs):
    // network-first so users get fresh code, with the cache as an offline
    // fallback. Navigation requests always try the network first too.
    event.respondWith(
      fetch(request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return res;
      }).catch(() => caches.match(request))
    );
  }
});
