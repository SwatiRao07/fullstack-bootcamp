import http from 'node:http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running. Send SIGINT or SIGTERM to stop me.\n');
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  console.log(`To stop, use Ctrl+C (SIGINT) or run: kill -SIGTERM ${process.pid}`);
});

// Signal Handler for SIGINT (Ctrl + C)
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Shutting down gracefully');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

// Signal Handler for SIGTERM
process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Cleaning up before exit');
  server.close(() => {
    console.log('Server shut down. Exit successful.');
    process.exit(0);
  });
});

process.on('exit', (code) => {
  console.log(`Exiting process with code: ${code}.`);
});
