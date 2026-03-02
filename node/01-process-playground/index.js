import 'dotenv/config';
import inspector from 'node:inspector';

const port = process.env.APP_PORT || 3000;
const infoMessage = process.env.INFO_MESSAGE || 'Hello, world!';
const userTag = process.env.USER_TAG || 'anonymous';

console.log('--- System Info ---');
console.log(`Process ID:       ${process.pid}`);
console.log(`Node Version:     ${process.version}`);
console.log(`Working Directory: ${process.cwd()}`);
console.log('');


console.log('--- Config ---');
console.log(`Port:             ${port}`);
console.log(`Message:          ${infoMessage}`);
console.log(`User Tag:         ${userTag}`);
console.log('');

const args = process.argv.slice(2);
if (args.length > 0) {
  console.log('--- Arguments ---');
  args.forEach((arg, index) => {
    console.log(`Arg ${index + 1}: ${arg}`);
  });
  console.log('');
}

process.on('SIGINT', () => {
  console.log('\nShutting down gracefully.');
  process.exit(0);
});


console.log('Tool is running. Press Ctrl+C to shut down.');
setInterval(() => {
  
}, 1000);
