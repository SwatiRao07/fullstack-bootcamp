const message = "You are beautiful";

const buffer = Buffer.from(message, "utf8");
console.log(buffer);

const restored = buffer.toString("utf8");
console.log(restored);

const text = "It is a sunny day.";

const utf8Buffer = Buffer.from(text, "utf8");
console.log("UTF8 buffer:", utf8Buffer);

const base64 = utf8Buffer.toString("base64");
console.log("Base64 encoded:", base64);

const decoded = Buffer.from(base64, "base64").toString("utf8");
console.log("Decoded:", decoded);

const buf = Buffer.alloc(10, 0xff);
console.log(buf);

const str = "Swati"

console.log("String length:", str.length);

const strBuffer = Buffer.from(str, "utf8");
console.log("Buffer byte length:", strBuffer.length);