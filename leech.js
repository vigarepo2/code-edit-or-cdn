addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  async function methodNotAllowed(request) {
    return new Response(`Method ${request.method} not allowed.`, {
      status: 405,
      headers: {
        Allow: 'GET',
      },
    });
  }

  if (request.method !== 'GET') return methodNotAllowed(request);

  const base = 'http://pornhub.com';
  const url = new URL(request.url);
  const { pathname, search } = url;
  const destinationURL = `${base}${pathname}${search}`;

  return fetch(destinationURL);
}
