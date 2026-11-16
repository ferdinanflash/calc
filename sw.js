/* Whiteout Survival 3475 Tools — Service Worker
 * Cache version: bump CACHE_VERSION when you deploy new assets.
 */
const CACHE_VERSION = 'v77-20261117';
const CACHE_NAME = `wos-3475-${CACHE_VERSION}`;

// Core shell + assets needed offline
const PRECACHE = [
  './',
  './index.html',
  './style.css?v=41',
  './database.js?v=9',
  './manifest.webmanifest',
  './js/utils.js?v=11',
  './js/modal.js?v=10',
  './js/ui-extras.js?v=2',
  './js/marvelous-fantasia.js?v=1',
  './js/dreamscape-data.js?v=2',
  './js/dreamscape-memory.js?v=13',
  './images/dreamscape/cropped/garden-s5-stage-1.jpg',
  './images/dreamscape/cropped/garden-s5-stage-2.jpg',
  './images/dreamscape/cropped/garden-s5-stage-3.jpg',
  './images/dreamscape/cropped/garden-s5-stage-4.jpg',
  './images/dreamscape/cropped/garden-s5-stage-5.jpg',
  './js/hero-hub.js?v=4',
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
  './js/mia-fortune.js?v=6',
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
  './js/frosty-fortune.js?v=1',
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
  // Calculator artwork: preload every local image so Furnace, resources, speedups,
  // troops, charms, Chief Gear and Hero Gear icons are ready for offline use.
  './images/belt.webp',
  './images/boots.webp',
  './images/charms/charm-infantry-01.webp',
  './images/charms/charm-infantry-02.webp',
  './images/charms/charm-infantry-03.webp',
  './images/charms/charm-infantry-04.webp',
  './images/charms/charm-infantry-05.webp',
  './images/charms/charm-infantry-06.webp',
  './images/charms/charm-infantry-07.webp',
  './images/charms/charm-infantry-08.webp',
  './images/charms/charm-infantry-09.webp',
  './images/charms/charm-infantry-10.webp',
  './images/charms/charm-infantry-11.webp',
  './images/charms/charm-infantry-12.webp',
  './images/charms/charm-infantry-13.webp',
  './images/charms/charm-infantry-14.webp',
  './images/charms/charm-infantry-15.webp',
  './images/charms/charm-infantry-16.webp',
  './images/charms/charm-infantry-17.webp',
  './images/charms/charm-infantry-18.webp',
  './images/charms/charm-lancer-01.webp',
  './images/charms/charm-lancer-02.webp',
  './images/charms/charm-lancer-03.webp',
  './images/charms/charm-lancer-04.webp',
  './images/charms/charm-lancer-05.webp',
  './images/charms/charm-lancer-06.webp',
  './images/charms/charm-lancer-07.webp',
  './images/charms/charm-lancer-08.webp',
  './images/charms/charm-lancer-09.webp',
  './images/charms/charm-lancer-10.webp',
  './images/charms/charm-lancer-11.webp',
  './images/charms/charm-lancer-12.webp',
  './images/charms/charm-lancer-13.webp',
  './images/charms/charm-lancer-14.webp',
  './images/charms/charm-lancer-15.webp',
  './images/charms/charm-lancer-16.webp',
  './images/charms/charm-lancer-17.webp',
  './images/charms/charm-lancer-18.webp',
  './images/charms/charm-marksman-01.webp',
  './images/charms/charm-marksman-02.webp',
  './images/charms/charm-marksman-03.webp',
  './images/charms/charm-marksman-04.webp',
  './images/charms/charm-marksman-05.webp',
  './images/charms/charm-marksman-06.webp',
  './images/charms/charm-marksman-07.webp',
  './images/charms/charm-marksman-08.webp',
  './images/charms/charm-marksman-09.webp',
  './images/charms/charm-marksman-10.webp',
  './images/charms/charm-marksman-11.webp',
  './images/charms/charm-marksman-12.webp',
  './images/charms/charm-marksman-13.webp',
  './images/charms/charm-marksman-14.webp',
  './images/charms/charm-marksman-15.webp',
  './images/charms/charm-marksman-16.webp',
  './images/charms/charm-marksman-17.webp',
  './images/charms/charm-marksman-18.webp',
  './images/charms/material-guide.webp',
  './images/charms/material-secrets.webp',
  './images/chief-gear/cane-blue.webp',
  './images/chief-gear/cane-gold.webp',
  './images/chief-gear/cane-green.webp',
  './images/chief-gear/cane-purple.webp',
  './images/chief-gear/cane-red.webp',
  './images/chief-gear/cane-t5-3star.jpg',
  './images/chief-gear/cane-t5.webp',
  './images/chief-gear/cane-t6-0star.jpg',
  './images/chief-gear/cane-t6.webp',
  './images/chief-gear/coat-blue.webp',
  './images/chief-gear/coat-gold.webp',
  './images/chief-gear/coat-green.webp',
  './images/chief-gear/coat-purple.webp',
  './images/chief-gear/coat-red.webp',
  './images/chief-gear/contoh.jpg',
  './images/chief-gear/design-plans.webp',
  './images/chief-gear/hardened-alloy.webp',
  './images/chief-gear/helmet-blue.webp',
  './images/chief-gear/helmet-gold.webp',
  './images/chief-gear/helmet-green.webp',
  './images/chief-gear/helmet-purple.webp',
  './images/chief-gear/helmet-red.webp',
  './images/chief-gear/helmet-t6.webp',
  './images/chief-gear/jacket-t5-3star.jpg',
  './images/chief-gear/jacket-t5.webp',
  './images/chief-gear/jacket-t6-0star.jpg',
  './images/chief-gear/jacket-t6.webp',
  './images/chief-gear/lunar-amber.webp',
  './images/chief-gear/pants-blue.webp',
  './images/chief-gear/pants-gold.webp',
  './images/chief-gear/pants-green.webp',
  './images/chief-gear/pants-purple.webp',
  './images/chief-gear/pants-red.webp',
  './images/chief-gear/pants-t5-3star.jpg',
  './images/chief-gear/pants-t5.webp',
  './images/chief-gear/pants-t6-0star.jpg',
  './images/chief-gear/pants-t6.webp',
  './images/chief-gear/polishing-solution.webp',
  './images/chief-gear/ring-blue.webp',
  './images/chief-gear/ring-gold.webp',
  './images/chief-gear/ring-green.webp',
  './images/chief-gear/ring-purple.webp',
  './images/chief-gear/ring-red.webp',
  './images/chief-gear/ring-t5-3star.jpg',
  './images/chief-gear/ring-t5.webp',
  './images/chief-gear/ring-t6-0star.jpg',
  './images/chief-gear/ring-t6.webp',
  './images/chief-gear/t5-t6.jpg',
  './images/chief-gear/watch-blue.webp',
  './images/chief-gear/watch-gold.webp',
  './images/chief-gear/watch-green.webp',
  './images/chief-gear/watch-purple.webp',
  './images/chief-gear/watch-red.webp',
  './images/chief-gear/watch-t6.webp',
  './images/furnace/fc-1.webp',
  './images/furnace/fc-10.webp',
  './images/furnace/fc-2.webp',
  './images/furnace/fc-3.webp',
  './images/furnace/fc-4.webp',
  './images/furnace/fc-5.webp',
  './images/furnace/fc-6.webp',
  './images/furnace/fc-7.webp',
  './images/furnace/fc-8.webp',
  './images/furnace/fc-9.webp',
  './images/gloves.webp',
  './images/goggles.webp',
  './images/hero-gear/infantry-belt.webp',
  './images/hero-gear/infantry-boots.webp',
  './images/hero-gear/infantry-gloves.webp',
  './images/hero-gear/infantry-goggles.webp',
  './images/hero-gear/lancer-belt.webp',
  './images/hero-gear/lancer-boots.webp',
  './images/hero-gear/lancer-gloves.webp',
  './images/hero-gear/lancer-goggles.webp',
  './images/hero-gear/marksman-belt.webp',
  './images/hero-gear/marksman-boots.webp',
  './images/hero-gear/marksman-gloves.webp',
  './images/hero-gear/marksman-goggles.webp',
  './images/resources/fire-crystal-shard.webp',
  './images/resources/refined-fire-crystal.webp',
  './images/troops/infantry.webp',
  './images/troops/lancer.webp',
  './images/troops/marksman.webp',
  './images/英雄头像icon（18代矛兵）.png',
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
      .then(async (cache) => {
      const results = await Promise.allSettled(
        PRECACHE.map((u) => cache.add(new Request(u, { cache: 'reload' })))
      );
      const failed = results.filter((r) => r.status === 'rejected').length;
      if (failed) console.warn('[SW] Some offline assets could not be cached:', failed);
    })
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

  // External static assets (hero portraits, image libraries, fonts): keep a local copy
  // after first successful online load. API/data requests remain network-only.
  if (!sameOrigin && /\\.(png|jpg|jpeg|webp|gif|svg|ico|woff2?|css)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
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
    if (fresh && (fresh.ok || fresh.type === 'opaque')) cache.put(req, fresh.clone());
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
  if (event.data && event.data.type === 'CACHE_URLS' && Array.isArray(event.data.urls)) {
    event.waitUntil((async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(event.data.urls.slice(0, 500).map(async (value) => {
        try {
          const url = new URL(value, self.location.href);
          if (!/^https?:$/.test(url.protocol)) return;
          const request = new Request(url.href, {
            mode: url.origin === self.location.origin ? 'same-origin' : 'no-cors',
            credentials: url.origin === self.location.origin ? 'same-origin' : 'omit'
          });
          const response = await fetch(request);
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(request, response.clone());
          }
        } catch (error) {
          // One unavailable image must not interrupt caching the remaining assets.
        }
      }));
    })());
  }
});
