const fs = require('fs');
const path = require('path');
const readline = require('readline');

const args = process.argv.slice(2);
const help = () => {
  console.log('Usage: node logmon.js <filename> [filter]');
  console.log('  <filename>  Required. Path to the log file.');
  console.log('  [filter]    Optional. Substring filter (e.g., "ERROR").');
};

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  help();
  process.exit(0);
}

const filename = args[0];
const filter = args[1]; // Optional filter string
const fullPath = path.resolve(filename);

let lastSize = 0;
let watcher = null;

/**
 * Reads new lines from the file and prints them if they match the filter.
 * @param {string} filePath 
 * @param {number} start 
 * @param {number} end 
 */
function streamNewLines(filePath, start, end) {
  if (start >= end) return;

  const stream = fs.createReadStream(filePath, { start, end: end - 1 });
  const rl = readline.createInterface({
    input: stream,
    terminal: false
  });

  rl.on('line', (line) => {
    if (!filter || line.includes(filter)) {
      console.log(line);
    }
  });

  rl.on('close', () => {
    // End of stream
  });
}

/**
 * Initializes or re-initializes the file watcher.
 */
function startWatching() {
  if (watcher) {
    watcher.close();
  }

  // Ensure file exists before starting
  try {
    const stats = fs.statSync(fullPath);
    lastSize = stats.size;
    console.log(`[*] Started watching: ${fullPath}${filter ? ` (Filtering for: "${filter}")` : ''}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`[!] Error: File "${filename}" not found. Waiting for it to be created...`);
      // Retry after some time if it doesn't exist yet
      setTimeout(startWatching, 1000);
      return;
    }
    throw err;
  }

  watcher = fs.watch(fullPath, (eventType) => {
    if (eventType === 'rename') {
      // Rotation handled here: file may have been moved/deleted/replaced
      console.log('[*] File rotation/rename detected. Re-initializing watcher...');
      setTimeout(startWatching, 100);
      return;
    }

    if (eventType === 'change') {
      fs.stat(fullPath, (err, stats) => {
        if (err) {
          if (err.code === 'ENOENT') {
            console.log('[*] File disappeared during change. Waiting for it...');
            startWatching();
          }
          return;
        }

        if (stats.size < lastSize) {
          // File was truncated (e.g., echoed into with > instead of >>)
          console.log('[*] File truncated. Resetting position...');
          const oldSize = lastSize;
          lastSize = stats.size; // Update before streaming to avoid race
          streamNewLines(fullPath, 0, stats.size);
        } else if (stats.size > lastSize) {
          const oldSize = lastSize;
          lastSize = stats.size; // Update before streaming to avoid race
          streamNewLines(fullPath, oldSize, stats.size);
        }
      });
    }
  });

  watcher.on('error', (err) => {
    console.error(`[!] Watcher error: ${err.message}`);
    setTimeout(startWatching, 1000);
  });
}

// Initial start
startWatching();

// Graceful exit
process.on('SIGINT', () => {
  console.log('\n[*] Gracefully shutting down...');
  if (watcher) watcher.close();
  process.exit(0);
});

// Handle uncaught exceptions so it doesn't crash on transient I/O errors
process.on('uncaughtException', (err) => {
  console.error(`[!] Uncaught Exception: ${err.message}`);
  // Attempt to recover
  setTimeout(startWatching, 1000);
});
