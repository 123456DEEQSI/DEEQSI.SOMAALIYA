/* Deeqsi service worker – wuxuu keydiyaa qaabka websaydhka si uu u furmo xitaa internet la'aan.
   Xogta deeq-bixiyeyaasha (Firebase) weligeed ma keydinayo, had iyo jeer waa nooleeyaa. */
const CACHE = "deeqsi-v1";
const SHELL = ["./deeqsi.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return; // Firebase iyo Google Fonts: ha taaban

  // Bogagga: marka hore internet, haddii uu go'o kayd
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./deeqsi.html", copy)); return res; })
        .catch(() => caches.match("./deeqsi.html"))
    );
    return;
  }
  // Faylasha kale: kayd marka hore
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    }))
  );
});
