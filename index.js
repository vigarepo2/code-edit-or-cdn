const fetch = require('node-fetch');
const http = require('http');

// Function to handle incoming messages
async function handleRequest(request) {
  const { method } = request;

  if (method === 'POST') {
    const json = await request.json();
    const chatId = json.message.chat.id;
    const messageText = json.message.text;

    // Your message handling logic goes here
    // ...

    // Simulating a response for testing
    return new Response('OK', { status: 200 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}

// Function to send messages
async function sendMessage(chatId, text) {
  // Your code for sending messages via Telegram API
  // ...
}

// Create a basic HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    const data = [];
    req.on('data', (chunk) => {
      data.push(chunk);
    });

    req.on('end', async () => {
      const body = JSON.parse(Buffer.concat(data).toString());
      const result = await handleRequest(body);

      res.writeHead(result.status, { 'Content-Type': 'text/plain' });
      res.end(result.body);
    });
  } else {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
