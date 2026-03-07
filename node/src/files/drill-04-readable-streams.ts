import { createReadStream } from 'fs';

const path = 'big.txt';

const stream = createReadStream(path);

let chunkCount = 0;
let totalBytes = 0;

stream.on('data', (chunk) => {
  chunkCount++;
  totalBytes += chunk.length;

  console.log(`Chunk ${chunkCount} - ${chunk.length} bytes`);
});

stream.on('end', () => {
  console.log(`Total chunks: ${chunkCount}`);
  console.log(`Total bytes read: ${totalBytes}`);
});

stream.on('error', (err: any) => {
  if (err.code === 'ENOENT') {
    console.error('File not found.');
  } else {
    console.error('Stream error:', err);
  }
});
