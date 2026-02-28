import { TaskManager } from './TaskManager';
import { TaskCLI } from './cli';

async function main() {
  const manager = new TaskManager([]);
  const cli = new TaskCLI(manager);
  await cli.run(process.argv);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});