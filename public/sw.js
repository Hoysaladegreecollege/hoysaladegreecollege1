// Service Worker for Web Push Notifications - HDC Portal
// Version tag forces update on each deploy
const SW_VERSION = 'v-' + Date.now();

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear ALL old caches on activation to ensure fresh content
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(names.map((name) => caches.delete(name)));
    }).then(() => clients.claim())
  );
});

// Do NOT cache any fetch requests - always go to network
self.addEventListener('fetch', (event) => {
  // Let all requests pass through to network (no caching)
  return;
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: data.tag || 'hdc-notification-' + Date.now(),
    data: { url: data.url || '/dashboard/student' },
    vibrate: [200, 100, 200],
    requireInteraction: true,
    actions: data.actions || [],
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'HDC Portal', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
