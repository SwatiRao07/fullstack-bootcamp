import { writeFile, appendFile, readFile, unlink, access, constants } from 'fs/promises';

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  const path = 'sample.txt';

  await writeFile(path, 'Hello, Node.js\n');
  await appendFile(path, 'This is appended text.\n');

  if (await fileExists(path)) {
    const content = await readFile(path, 'utf-8');
    console.log('File content:\n', content);
  }

  await unlink(path);
  console.log('File deleted.');
}

run();
