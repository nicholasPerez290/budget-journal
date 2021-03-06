const FILES_TO_CACHE = [
    '/',
    '/index.js',
    '/index.html',
    '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    '/db.js'
  ];

  const CACHE_NAME = "budget-cache"
  const DATA_CACHE_NAME = "data-budget-cache"

  self.addEventListener("install", function(event) {
      event.waitUntil(
          caches.open(CACHE_NAME).then(cache => {
              console.log("cache successful")
              return cache.addAll(FILES_TO_CACHE)
          })
      )
      self.skipWaiting();
  })
  self.addEventListener("activate", function(event) {
    event.waitUntil(
      caches.keys().then(keyList => {
        return Promise.all(
          keyList.map(key => {
            if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
              console.log("Removing old cache data", key);
              return caches.delete(key);
            }
          })
        );
      })
    );
  
    self.clients.claim();
  });
  self.addEventListener("fetch", function(event) {
    
    if (event.request.url.includes("/api/")) {
      event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
            .then(response => {
              
              if (response.status === 200) {
                cache.put(event.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
             
              return cache.match(event.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
  
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  