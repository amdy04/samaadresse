// SamaAdresse Service Worker - Mode Hors Ligne (Offline Support)
const CACHE_NAME = 'samaadresse-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
];

// Installation : Mise en cache des assets statiques essentiels
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Mise en cache des ressources statiques');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Suppression ancien cache :', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes réseau : Stratégie Stale-While-Revalidate pour l'API, Cache-First pour les assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Pour les requêtes de résolution d'adresse (/api/v1/public/resolve/)
  if (url.pathname.includes('/api/v1/public/resolve/')) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Si le réseau échoue (mode hors ligne), on sert depuis le cache !
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[ServiceWorker] Récupération hors ligne de l’adresse :', event.request.url);
              return cachedResponse;
            }
            return new Response(JSON.stringify({
              error: 'Adresse non disponible hors ligne. Veuillez vous connecter au réseau.'
            }), {
              headers: { 'Content-Type': 'application/json' },
              status: 503
            });
          });
        })
    );
    return;
  }

  // Pour les autres requêtes, Network first avec fallback cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
