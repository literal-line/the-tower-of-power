var version = 'v0.1-20210304-1030est';
var assets = [
  './',
  './index.html'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(version).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request)
    })
  )
})
