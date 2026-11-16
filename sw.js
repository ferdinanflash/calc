/* Whiteout Survival 3475 Tools — Service Worker
 * Cache version: bump CACHE_VERSION when you deploy new assets.
 */
const CACHE_VERSION = 'v61-20261117';
const CACHE_NAME = `wos-3475-${CACHE_VERSION}`;

// Core shell + assets needed offline
const PRECACHE = [
  './',
  './index.html',
  './style.css?v=34',
  './database.js?v=9',
  './manifest.webmanifest',
  './js/utils.js?v=11',
  './js/modal.js?v=9',
  './js/ui-extras.js?v=2',
  './js/marvelous-fantasia.js?v=1',
  './js/dreamscape-data.js?v=1',
  './js/dreamscape-memory.js?v=13',
  './images/dreamscape/cropped/garden-s5-stage-1.jpg',
  './images/dreamscape/cropped/garden-s5-stage-2.jpg',
  './images/dreamscape/cropped/garden-s5-stage-3.jpg',
  './images/dreamscape/cropped/garden-s5-stage-4.jpg',
  './images/dreamscape/cropped/garden-s5-stage-5.jpg',
  './js/hero-hub.js?v=3',
  './js/main.js?v=9',
  './js/building.js?v=12',
  './js/troops.js?v=10',
  './js/war-academy.js?v=11',
  './js/charms.js?v=9',
  './js/hero-gear.js?v=9',
  './js/chief-gear.js?v=9',
  './js/svs.js?v=9',
  './js/rfc.js?v=9',
  './js/halloween-candy.js?v=1',
  './js/mia-fortune.js?v=7',
  './assets/mia-fortune/fortune_token.png',
  './assets/mia-fortune/essence-stone.5a885e57.webp',
  './assets/mia-fortune/gem.png',
  './assets/mia-fortune/multiplier_x2.png',
  './assets/mia-fortune/multiplier_x3.png',
  './assets/mia-fortune/multiplier_x4.png',
  './assets/mia-fortune/multiplier_x5.png',
  './assets/mia-fortune/vip_points.png',
  './assets/mia-fortune/hero_xp_10000.png',
  './assets/mia-fortune/enhancement-xp-component.bc25d724.webp',
  './images/charms/material-design.webp',
  './images/resources/fire-crystal.webp',
  './images/resources/meat.webp',
  './images/resources/wood.webp',
  './images/resources/iron.webp',
  './images/resources/coal.webp',
  './images/resources/steel.webp',
  './images/speedups/general.webp',
  './images/speedups/construction.webp',
  './images/speedups/research.webp',
  './images/speedups/troop-training.webp',
  './images/speedups/troop-healing.webp',
  './images/speedups/learning.webp',
  './js/mergeventure.js?v=1',
  './js/frosty-fortune.js?v=2',
  './assets/frosty-fortune/splendid_chest.png',
  './assets/frosty-fortune/exquisite_chest.png',
  './assets/frosty-fortune/regular_chest.png',
  './assets/frosty-fortune/thorn_of_enigma.png',
  './assets/frosty-fortune/treasure_hunt_chest.png',
  './assets/frosty-fortune/mythic_general_hero_shard.png',
  './assets/frosty-fortune/lucky_hero_gear_chest.png',
  './js/ascii-config.js?v=1',
  './js/ascii-art.js?v=12',
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
