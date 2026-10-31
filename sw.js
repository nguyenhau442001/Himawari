const ASSET_VERSION = '20261031-himawari-v2';
const CACHE_NAME = 'himawari-app-v' + ASSET_VERSION;
const DATA_CACHE_NAME = 'himawari-data-v1';
const FSRS_CDN_URL = 'https://cdn.jsdelivr.net/npm/ts-fsrs@5.4.1/dist/index.umd.js';

const APP_SHELL_URL = new URL('./index.html', self.registration.scope).href;
const ROOT_SHELL_URL = new URL('./', self.registration.scope).href;

const PRECACHE_ASSET_URLS = [
  APP_SHELL_URL,
  ROOT_SHELL_URL,
  './index.html',
  './config/pwa-manifest.json',
  './assets/flashcards.css',
  './assets/css/level-picker.css',
  './assets/css/workstation.css',
  './assets/css/reading-analysis.css',
  './assets/css/study-help-modal.css',
  './assets/css/home-widgets.css',
  './assets/css/dashboard-enhancements.css',
  './assets/js/state.js',
  './assets/js/storage.js',
  './assets/js/srs.js',
  './assets/js/spa-router.js',
  './assets/js/levels.js',
  './assets/js/topics.js',
  './assets/js/hsk30.js',
  './assets/js/sentence-game.js',
  './assets/js/guess-word-game.js',
  './assets/js/speed-quiz-game.js',
  './assets/js/vocabulary-overview.js',
  './assets/js/fast-review.js',
  './assets/js/hanviet-dict.js',
  './assets/js/word-illustrations.js',
  './assets/js/flashcard.js',
  './assets/js/card-interactions.js',
  './assets/js/speechService.js',
  './assets/js/speech.js',
  './assets/js/progress.js',
  './assets/js/due-review.js',
  './assets/js/theme.js',
  './assets/js/backup.js',
  './assets/js/memory-curve.js',
  './assets/js/radicals-state.js',
  './assets/js/radicals.js',
  './assets/js/radical-card.js',
  './assets/js/sidebar-search.js',
  './assets/js/sidebar-radicals-filter.js',
  './assets/js/weak-words.js',
  './assets/js/stroke-canvas.js',
  './assets/js/sidebar-tabs.js',
  './assets/js/word-companion.js',
  './assets/js/grammar-breakdown.js',
  './assets/js/home-widgets.js',
  './assets/js/dashboard-enhancements.js',
  './assets/js/study-help-modal.js',
  './assets/flashcards.js',
].map(path => (path.startsWith('http') ? path : new URL(path, self.registration.scope).href));

const DATA_PATH = new URL('./database/', self.registration.scope).pathname;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.allSettled([
      ...PRECACHE_ASSET_URLS.map(url => cache.add(url).catch(() => {})),
      cache.add(new Request(FSRS_CDN_URL, { mode: 'cors' })).catch(() => {}),
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name =>
      name !== CACHE_NAME && name !== DATA_CACHE_NAME
    ).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // 1. Navigation requests (HTML document) - Network First with Cache Fallback
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone()).catch(() => {});
          return response;
        }
      } catch (e) {
        // Network failed or offline - fall back to cached shell
      }
      const cache = await caches.open(CACHE_NAME);
      const cached = (await cache.match(request, { ignoreSearch: true }))
        || (await cache.match(APP_SHELL_URL, { ignoreSearch: true }))
        || (await cache.match(ROOT_SHELL_URL, { ignoreSearch: true }));
      if (cached) return cached;
      return new Response('Himawari is offline and could not load.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })());
    return;
  }

  // 2. FSRS CDN URL
  if (url.href === FSRS_CDN_URL) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok || response.type === 'opaque') {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      } catch (err) {
        return cached || new Response('', { status: 504 });
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  // 3. Database vocabulary & grammar data - Stale While Revalidate
  if (url.pathname.startsWith(DATA_PATH)) {
    event.respondWith((async () => {
      const cache = await caches.open(DATA_CACHE_NAME);
      const cached = await cache.match(request, { ignoreSearch: true });
      const fetchPromise = fetch(request).then(response => {
        if (response && response.ok) {
          cache.put(request, response.clone()).catch(() => {});
        }
        return response;
      }).catch(() => null);

      if (cached) {
        event.waitUntil(fetchPromise);
        return cached;
      }
      const networkResponse = await fetchPromise;
      if (networkResponse) return networkResponse;
      return cached || new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
    })());
    return;
  }

  // 4. Static assets (JS, CSS, Images, Fonts) - Cache First with Network Fallback
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response && response.ok) {
        cache.put(request, response.clone()).catch(() => {});
      }
      return response;
    } catch (err) {
      return cached || new Response('', { status: 408 });
    }
  })());
});
