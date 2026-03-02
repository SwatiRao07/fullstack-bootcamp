// import fs from 'node:fs';
// import path from 'node:path';
// import { Buffer } from 'node:buffer';
// import { fileURLToPath } from 'node:url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const logFilePath = path.join(__dirname, 'log.txt');
// const binFilePath = path.join(__dirname, 'binary.dat');

// // 1. Create a write stream for a log file.
// const writeStream = fs.createWriteStream(logFilePath);

// // 2. Write multiple lines in a loop.
// for (let i = 1; i <= 50; i++) {
//   // 4. Handle backpressure with stream.write() return value.
//   const canContinue = writeStream.write(`Log line #${i}\n`);
//   if (!canContinue) {
//     console.log(`Backpressure detected at line #${i}`);
//   }
// }

// // 3. Ensure the stream is closed with finish event.
// writeStream.on('finish', () => {
//   console.log('Finished writing to log file.');
//   fs.unlinkSync(logFilePath); // Cleanup
// });

// writeStream.end();

// // 5. Write binary data to a file with a Buffer.
// const binStream = fs.createWriteStream(binFilePath);
// const binData = Buffer.from([0x01, 0x02, 0x03, 0xff]);
// binStream.write(binData);
// binStream.on('finish', () => {
//   console.log('Finished writing binary data.');
//   fs.unlinkSync(binFilePath); // Cleanup
// });
// binStream.end();

import { createWriteStream } from "fs";

const logStream = createWriteStream("app.log", {
  flags: "a", // append mode
});

for (let i = 1; i <= 5; i++) {
  logStream.write(`Log line ${i}\n`);
}

logStream.end();

logStream.on("finish", () => {
  console.log("All data flushed to file.");
});

const stream = createWriteStream("big.log" );

let i = 0;
const total = 100000;

function write() {
  let canContinue = true;

  while (i < total && canContinue) {
    i++;
    canContinue = stream.write(`Line ${i}\n`);
  }

  if (i < total) {
    stream.once("drain", write);
  } else {
    stream.end();
  }
}

write();

stream.on("finish", () => {
  console.log("Done writing large file.");
});

const path = "binary.dat";
const buffer = Buffer.alloc(10, 0xff);

const stream1 = createWriteStream(path);

stream1.write(buffer);
stream1.end();

stream1.on("finish", () => {
  console.log("Binary buffer written correctly.");
});

stream1.on("error", (err) => {
  console.error("Write error:", err);
});