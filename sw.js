/**
 * Service Worker: Hapkido Athlete Tracker PWA
 * Version: 20260901-2
 * Strategy: Cache-First with Network Fallback (100% Offline Capable)
 */

const CACHE_NAME = 'hapkido-tracker-v20260901-2';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './hapkido-init.js',
  './hapkido-data.js',
  './hapkido-auth.js',
  './hapkido-athletes.js',
  './hapkido-physical.js',
  './hapkido-exams.js',
  './hapkido-combat.js',
  './hapkido-schools.js',
  './hapkido-torneos.js',
  './hapkido-vocab.js',
  './manifest.json',
  './icons/favicon-64.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './vendor/chartjs/chart.umd.min.js',
  './vendor/fontawesome/css/all.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './vendor/fontawesome/webfonts/fa-solid-900.ttf',
  './vendor/fontawesome/webfonts/fa-regular-400.woff2',
  './vendor/fontawesome/webfonts/fa-regular-400.ttf',
  './vendor/fontawesome/webfonts/fa-brands-400.woff2',
  './vendor/fontawesome/webfonts/fa-brands-400.ttf',
  './vendor/fontawesome/webfonts/fa-v4compatibility.woff2',
  './vendor/fontawesome/webfonts/fa-v4compatibility.ttf',
  './vendor/fonts/fonts.css',
  './vendor/fonts/font_0.woff2',
  './vendor/fonts/font_1.woff2',
  './vendor/fonts/font_2.woff2',
  './vendor/fonts/font_3.woff2',
  './vendor/fonts/font_4.woff2',
  './vendor/fonts/font_5.woff2',
  './vendor/fonts/font_6.woff2',
  './vendor/fonts/font_7.woff2',
  './vendor/fonts/font_8.woff2',
  './vendor/fonts/font_9.woff2',
  './vendor/fonts/font_10.woff2',
  './vendor/fonts/font_11.woff2',
  './vendor/fonts/font_12.woff2',
  './vendor/fonts/font_13.woff2',
  './vendor/fonts/font_14.woff2'
];

// Install Event: Precaches the entire application shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching offline app shell...');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch(err => console.warn('[SW] Pre-cache warning:', err))
  );
});

// Activate Event: Clears previous cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Cache-First strategy with dynamic runtime caching
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {
        // Fallback to cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});