import 'dotenv/config';
import inspector from 'node:inspector';

/**
 * Small CLI tool called 'info'.
 * Requirements:
 * - Print process ID, Node version, working directory.
 * - Read config from .env (with defaults).
 * - Accept one or more arguments.
 * - Handle --debug by enabling --inspect.
 * - Handle SIGINT by printing a message.
 */

// 1. Reading config from .env with defaults
const port = process.env.APP_PORT || 3000;
const infoMessage = process.env.INFO_MESSAGE || 'Hello, world!';
const userTag = process.env.USER_TAG || 'anonymous';

// 2. Printing Process and System Information
console.log('--- System Info ---');
console.log(`Process ID:       ${process.pid}`);
console.log(`Node Version:     ${process.version}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log('');

// 3. Printing Config Values
console.log('--- Config ---');
console.log(`Port:             ${port}`);
console.log(`Message:          ${infoMessage}`);
console.log(`User Tag:         ${userTag}`);
console.log('');

// 4. Accepting and printing arguments (skipping 'node' and 'index.js')
const args = process.argv.slice(2);
if (args.length > 0) {
  console.log('--- Arguments ---');
  args.forEach((arg, index) => {
    console.log(`Arg ${index + 1}: ${arg}`);
  });
  console.log('');
}

// 5. Handling --debug flag to enable inspector
if (args.includes('--debug')) {
  console.log('** DEBUG FLAG DETECTED - Enabling Node Inspector... **');
  inspector.open();
  console.log(`Debugger listening at: ${inspector.url() || 'ws://127.0.0.1:9229/...'}`);
  console.log('');
}

// 6. Handling SIGINT gracefully
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully.');
  process.exit(0);
});

// To allow SIGINT to be captured, the process must stay alive.
console.log('Tool is running. Press Ctrl+C to shut down.');
setInterval(() => {
  // Keeping the event loop active.
}, 1000);
