const CACHE = 'bioeng110-v16';
const ASSETS = [
    '/',
    '/index.html',
    '/data/questions_biomolecules.json',
    '/data/questions_genetics.json',
    '/data/questions_molecular.json',
    '/data/questions_cellcycle.json',
    '/data/questions_immunology.json',
    '/data/questions_signalling.json',
    '/data/questions_metabolism.json',
    '/favicon.png',
    '/manifest.json',
    '/data/images/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(async cache => {
            await cache.addAll(ASSETS);
            const res = await fetch('/data/images/manifest.json');
            const images = await res.json();
            await cache.addAll(images);
        })
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

self.addEventListener('fetch', e => {
    // Network first for Supabase (always try to sync live data)
    if (e.request.url.includes('supabase.co')) return;
    // Cache first for everything else
    e.respondWith(
        caches.match(e.request).then(cached => cached || fetch(e.request))
    );
});
