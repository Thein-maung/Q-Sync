// Quantum AI PWA Service Worker
const CACHE_NAME = 'quantum-ai-v2.0.0';
const APP_SHELL_CACHE = 'quantum-ai-shell-v1';

// Files to cache for app shell
const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/chat.html', 
  '/voice.html',
  '/styles.css',
  '/app.js',
  '/debug.js',
  '/pwa.js',
  '/manifest.json'
];

// Quantum API cache (for future use)
const API_CACHE_NAME = 'quantum-ai-api-v1';

// Install event - cache app shell
self.addEventListener('install', (event) => {
  console.log('🧠 Quantum AI PWA: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(APP_SHELL_CACHE)
        .then((cache) => {
          console.log('📦 Caching app shell');
          return cache.addAll(APP_SHELL_FILES);
        }),
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('🧠 Quantum AI PWA: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== APP_SHELL_CACHE && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
          .then((fetchResponse) => {
            // Cache new requests (except API calls)
            if (event.request.url.startsWith(self.location.origin) && 
                !event.request.url.includes('/api/')) {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, fetchResponse.clone());
                  return fetchResponse;
                });
            }
            return fetchResponse;
          })
          .catch(() => {
            // Fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Background sync for offline messages (future feature)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-messages') {
    console.log('🔄 Background sync for quantum messages');
    event.waitUntil(doBackgroundSync());
  }
});

// Push notifications for quantum events
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Quantum AI event occurred',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Quantum AI'
      },
      {
        action: 'close', 
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Quantum AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.matchAll({type: 'window'}).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Background sync implementation
async function doBackgroundSync() {
  // Future: Sync offline quantum messages
  console.log('🔄 Syncing quantum messages...');
}