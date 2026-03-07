const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'app.log');

if (fs.existsSync(logFile)) fs.unlinkSync(logFile);
fs.writeFileSync(logFile, 'Initial log line\n');

console.log(`[Simulator] Log file created: ${logFile}`);
console.log(`[Simulator] Run "node logmon.js ${logFile} ERROR" in a separate terminal to test filtering.`);

let counter = 1;
const interval = setInterval(() => {
  const types = ['INFO', 'DEBUG', 'ERROR', 'WARN'];
  const type = types[Math.floor(Math.random() * types.length)];
  const line = `${type}: Message #${counter++} at ${new Date().toISOString()}\n`;
  
  fs.appendFileSync(logFile, line);
  process.stdout.write(`[Simulator] Appended: ${line}`);

  // Simulate rotation every 10 messages
  if (counter % 10 === 0) {
    console.log('[Simulator] Rotating log file...');
    const oldFile = `${logFile}.old`;
    if (fs.existsSync(oldFile)) fs.unlinkSync(oldFile);
    fs.renameSync(logFile, oldFile);
    fs.writeFileSync(logFile, `New log started after rotation #${counter / 10}\n`);
    console.log('[Simulator] Done rotating.');
  }

  if (counter > 35) {
    clearInterval(interval);
    console.log('[Simulator] Finished simulation. You can Ctrl+C logmon.');
  }
}, 1000);
