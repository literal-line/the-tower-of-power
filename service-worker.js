var version = 'v0.1-20210304-1037est';
var assets = [
  './',
  './index.html',
  './the-tower-of-power.js',
  './style.css',
  './assets/floors.json',
  './assets/5-seconds-of-silence.mp3',
  './assets/arcade_n.ttf',
  './assets/iconHelp.png',
  './assets/iconControls.png',
  './assets/font.png',
  './assets/quiquePixel.png',
  './assets/title.png',
  './assets/tilesFloor.png',
  './assets/jingle.mp3',
  './assets/insertCredit.mp3',
  './assets/roundStart.mp3',
  './assets/roundPlay.mp3'
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
