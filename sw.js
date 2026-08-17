const CACHE_NAME='mittags-v3';
const URLS_TO_CACHE=['./','/index.html','manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(URLS_TO_CACHE).catch(()=>null)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request).then(r=>{
      if(r)return r;
      return fetch(e.request).then(r=>{
        if(!r||r.status!==200||r.type==='error')return r;
        const c=r.clone();
        caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c));
        return r;
      }).catch(()=>caches.match('/')
      );
    })
  );
});
