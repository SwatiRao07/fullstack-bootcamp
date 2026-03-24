import fs from 'fs';
import path from 'path';
import data from './data.js';

const __dirname = path.resolve();
const publicDir = path.join(__dirname, 'public', 'projects');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const projectsHtml = data.projects.map(p => `
  <div class="project-card">
    <h3>${p.name}</h3>
    <p><span class="badge">${p.status}</span></p>
    <p><strong>Lead:</strong> ${p.lead}</p>
    <p><strong>Tech:</strong> ${p.tech.join(', ')}</p>
  </div>
`).join('');

const template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Projects (SSG)</title>
  <style>
    body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .project-card { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; background: #eee; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>Projects (SSG)</h1>
  <div id="project-list">
    ${projectsHtml}
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, 'static.html'), template);
console.log('Successfully generated public/projects/static.html');
