// See https://developers.google.com/web/tools/workbox/guides/configure-workbox
workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

// We need this in Webpack plugin (refer to swSrc option): https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#full_injectmanifest_config
workbox.precaching.precacheAndRoute(self.__precacheManifest);

workbox.routing.registerRoute(new RegExp('^https://fonts.(?:googleapis|gstatic).com/(.*)'), workbox.strategies.cacheFirst());
workbox.routing.registerRoute("/images/", workbox.strategies.staleWhileRevalidate());
// app-shell
workbox.routing.registerNavigationRoute("/");

self.addEventListener('push', e => {
  console.log("[Service Worker] Push received: " + e.data.text());
  const title = "Zerosum";
  const options = {
    body: e.data.text(),
    icon: 'images/dice-512.png',
    badge: 'images/dice-512.png'
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', e => {
  console.log("[Service Worker] Notification clicked");
  e.notification.close();
  e.waitUntil(clients.openWindow('https://zerosum.ml'))
});