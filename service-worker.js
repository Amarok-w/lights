const cacheName = 'cache-v1';
// const assets = [
//   'index.html',
//   'js/main.js',
//   'styles/style.css',
//   'styles/null.css',
// ]

const assets = [
  '/lights/index.html',
  '/lights/js/main.js',
  '/lights/styles/style.css',
  '/lights/styles/null.css',
]



self.addEventListener('install', async event => {
  const cache = await caches.open(cacheName)
  await cache.addAll(assets)
})

self.addEventListener('fetch', event => {
  const {request} = event
  event.respondWith(cacheFirst(request))
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  return cached ?? await fetch(request)
}


// const staticCacheName = 'cache-v1';
// const assets = [
//   '/',
//   './index.html',
//   './styles/style.css',
//   './styles/null.css',
//   './img',
//   './fonts'
// ]


// self.addEventListener('install', evt => {
//   evt.waitUntil(
//     caches.open(staticCacheName).then((cache) => {
//       console.log('caching shell assets');
//       cache.addAll(assets);
//     })
//   );
// });

// // событие activate
// self.addEventListener('activate', evt => {
//   evt.waitUntil(
//     caches.keys().then(keys => {
//       return Promise.all(keys
//         .filter(key => key !== staticCacheName)
//         .map(key => caches.delete(key))
//       );
//     })
//   );
// });

// // событие fetch
// self.addEventListener('fetch', evt => {
//   evt.respondWith(
//     caches.match(evt.request).then(cacheRes => {
//       return cacheRes || fetch(evt.request);
//     })
//   );
// });

// console.log('[sw]: install');
