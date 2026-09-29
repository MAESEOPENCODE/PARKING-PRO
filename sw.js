const C='ix35-v7';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()).then(()=>self.clients.matchAll({type:'window'})).then(cs=>cs.forEach(c=>{try{c.navigate(c.url)}catch(e){}}))));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url),same=u.origin===location.origin;
  if(!same&&u.hostname!=='cdnjs.cloudflare.com')return;
  const o={cache:'reload'};if(e.request.mode==='navigate')o.redirect='manual';
  e.respondWith((same?fetch(e.request.url,o):fetch(e.request)).then(r=>{if(r.ok){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)));
});
