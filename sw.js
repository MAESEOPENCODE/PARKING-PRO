const CACHE = 'donde-aparque-v4';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./apple-touch-icon.png',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css',
  'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isTile = /tile\.openstreetmap|arcgisonline/.test(url.host);
  e.respondWith(caches.match(e.request).then(cached => {
    const net = fetch(e.request).then(res => {
      if (res && res.ok && (isTile || res.type === 'basic')) { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
      return res;
    }).catch(() => cached);
    return cached || net;
  }));
});
