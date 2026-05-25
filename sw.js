// YWY Service Worker v1.0
const CACHE = 'ywv-v1';
const ASSETS = ['/'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network first — ดึงข้อมูลใหม่เสมอ (สำคัญสำหรับ app ที่บันทึกข้อมูล real-time)
self.addEventListener('fetch', e => {
  // ไม่ cache API calls ไปยัง GAS
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    fetch(e.request)
      .catch(() => caches.match(e.request))
  );
});
