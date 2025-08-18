// Service Worker para PWA - Latin Learning App
// Este archivo permite que la app funcione offline y se instale como aplicación

const CACHE_NAME = 'latin-app-v1';
const urlsToCache = [
  '/latin-learning-app/',
  '/latin-learning-app/index.html',
  '/latin-learning-app/manifest.json',
  // Los assets se añadirán dinámicamente después del build
];

// Evento de instalación - cachea los recursos iniciales
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  // Activa el service worker inmediatamente
  self.skipWaiting();
});

// Evento de activación - limpia caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Toma control de todas las páginas inmediatamente
  self.clients.claim();
});

// Evento fetch - estrategia Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, la clonamos y guardamos en cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, intentamos obtener del cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Si no está en cache y es una navegación, devolvemos index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/latin-learning-app/index.html');
            }
          });
      })
  );
});