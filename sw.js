/* Whiteout Survival 3475 Tools — Service Worker
 * Cache version: bump CACHE_VERSION when you deploy new assets.
 */
const CACHE_VERSION = 'v26-20261030';
const CACHE_NAME = `wos-3475-${CACHE_VERSION}`;

// Core shell + assets needed offline
const PRECACHE = [
  './',
  './index.html',
  './style.css?v=19',
  './database.js?v=9',
  './manifest.webmanifest',
  './js/utils.js?v=11',
  './js/modal.js?v=9',
  './js/ui-extras.js?v=1',
  './js/main.js?v=9',
  './js/building.js?v=12',
  './js/troops.js?v=10',
  './js/war-academy.js?v=11',
  './js/charms.js?v=9',
  './js/hero-gear.js?v=9',
  './js/chief-gear.js?v=9',
  './js/svs.js?v=9',
  './js/rfc.js?v=9',
  './js/ascii-config.js?v=1',
  './js/ascii-art.js?v=11',
  './js/ascii-share.js?v=2',
  './js/ascii-editor.js?v=3',
  './icons/favicon.ico',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
      .catch((err) => console.warn('[SW] precache failed', err))
  );
});

// Activate: drop old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('wos-3475-') && k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - HTML / navigation: network-first, fallback to cache
// - JS/CSS/manifest: stale-while-revalidate
// - images & icons: cache-first
// - external CDN: network-only (or cache if already stored)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Skip non-http(s) and Google Apps Script API
  if (!url.protocol.startsWith('http')) return;
  if (url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com')) {
    return; // always network for live share API
  }

  // Navigation / HTML
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(networkFirst(req));
    return;
  }

  // Same-origin static assets
  if (sameOrigin) {
    const path = url.pathname;
    if (/\.(png|jpg|jpeg|webp|gif|ico|svg|woff2?)$/i.test(path)) {
      event.respondWith(cacheFirst(req));
      return;
    }
    if (/\.(js|css|webmanifest)$/i.test(path) || path.endsWith('/')) {
      event.respondWith(staleWhileRevalidate(req));
      return;
    }
  }

  // CDN (bootstrap-icons etc.): stale-while-revalidate
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('unpkg.com')) {
    event.respondWith(staleWhileRevalidate(req));
    return;
  }
});

async function networkFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req) || await cache.match('./index.html') || await cache.match('./');
    if (cached) return cached;
    throw e;
  }
}

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const fresh = await fetch(req);
    if (fresh && fresh.ok) cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(req);
  const networkPromise = fetch(req)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(req, fresh.clone());
      return fresh;
    })
    .catch(() => null);
  return cached || (await networkPromise) || Response.error();
}

// Allow page to force update
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
