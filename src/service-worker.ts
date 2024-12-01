/// <reference lib="webworker" />
export default null
declare let self: ServiceWorkerGlobalScope

// import localforage from 'localforage';

// const store = localforage.createInstance({
//     name: "apps"
// });


// fetch('http://localhost:5173/')
//     .then(response => response.text())
//     .then(data => {
//         console.log('Data from localhost 5713:', data);
//     })
//     .catch(error => {
//         console.error('Error fetching from localhost 5713:', error);
//     });

self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
    console.log('Service Worker done installing.');
    // Perform install steps if needed (e.g., caching resources)
    // store.setItem('greet', 'hello world')

});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
        // Respond to the request
        event.respondWith(
            (async () => {

                // const match = await caches.match(event.request);
                // console.log('hello', await store.getItem('greet'))

                const url = new URL(event.request.url);
                // console.log('fetch this', url.pathname)
                const intercept = url.pathname.startsWith('/app')


                if (intercept) {
                    const namespace = url.pathname.split('/')[2]
                    const originalParam = url.searchParams.get('original')
                    if (!originalParam) throw new Error('original param not found');
                    const original = decodeURIComponent(originalParam)
                    console.log('Intercept:', event.request.url, namespace);
                    const responseData = { message: 'Hello from the Service Worker!', namespace, original };
                    return new Response(JSON.stringify(responseData), {
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                // return caches.open(RUNTIME).then(cache => {
                //     return fetch(event.request).then(response => {
                //       // Put a copy of the response in the runtime cache.
                //       return cache.put(event.request, response.clone()).then(() => {
                //         return response;
                //       });
                //     });
                //   });

                // Fallback to the network for other requests
                const response = await fetch(event.request);
                return response;
            })()
        );
    }
})

// self.addEventListener("message", async (event) => {
// const message = event.data as AppMessage;
// });
