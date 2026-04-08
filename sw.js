const CACHE = 'bioeng110-v7';
const ASSETS = [
    '/',
    '/index.html',
    '/data/questions_biomolecules.json',
    '/data/questions_genetics.json',
    '/data/questions_molecular.json',
    '/data/questions_cellcycle.json',
    '/favicon.png',
    '/manifest.json'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(ASSETS))
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
