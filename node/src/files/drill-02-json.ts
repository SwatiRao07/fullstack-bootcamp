import { writeFile, readFile, unlink } from 'fs/promises';

async function writeJson() {
  const data = {
    name: 'Swati',
    role: 'Developer',
    active: true,
  };

  await writeFile('data.json', JSON.stringify(data, null, 2));

  console.log('JSON written.');
}

writeJson();

async function readJson() {
  const raw = await readFile('data.json', 'utf-8');
  const parsed = JSON.parse(raw);

  console.log(parsed);
}

readJson();

async function safeReadJson(path: string) {
  try {
    const raw = await readFile(path, 'utf-8');
    return JSON.parse(raw);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log('File not found.');
    } else if (err instanceof SyntaxError) {
      console.log('Invalid JSON format.');
    } else {
      throw err;
    }
    return null;
  }
}

await unlink('data.json');
console.log('JSON file deleted.');
