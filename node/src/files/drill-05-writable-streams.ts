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