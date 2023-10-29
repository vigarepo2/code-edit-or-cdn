const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!');
});

const PORT = 8080; // Setting the server to run on port 8080
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
