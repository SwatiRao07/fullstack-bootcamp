import express from 'express';
import cookieParser from 'cookie-parser';
import data from './data.js';

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('public'));


app.get('/health', (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get('/', (req, res) => {
  const { projects, articles, team } = data;
  
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TeamHub | Intranet</title>
      <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; }
        .stats { display: flex; gap: 1rem; margin-bottom: 2rem; }
        .card { border: 1px solid #ddd; padding: 1.5rem; border-radius: 8px; flex: 1; text-align: center; background: #fafafa; }
        .card h2 { margin: 0; color: #555; font-size: 1rem; }
        .card p { font-size: 2rem; margin: 0.5rem 0 0; font-weight: bold; }
        nav { display: flex; gap: 1rem; border-bottom: 2px solid #eee; padding-bottom: 1rem; margin-bottom: 1rem; }
        nav a { text-decoration: none; color: #0070f3; font-weight: bold; }
        #error-message { color: red; display: none; margin-bottom: 1rem; border: 1px solid red; padding: 0.5rem; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>TeamHub</h1>
      <nav>
        <a href="/projects">Projects</a>
        <a href="/articles">Articles</a>
        <a href="/team">Team</a>
      </nav>
      
      <div id="error-message">Projects unavailable</div>
      
      <div class="stats">
        <div class="card">
          <h2>Projects</h2>
          <p id="project-count">0</p>
        </div>
        <div class="card">
          <h2>Articles</h2>
          <p>${articles.length}</p>
        </div>
        <div class="card">
          <h2>Team Size</h2>
          <p>${team.length}</p>
        </div>
      </div>

      <script>
        fetch('/api/projects')
          .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
          })
          .then(projects => {
            document.getElementById('project-count').innerText = projects.length;
          })
          .catch(err => {
            console.error('Fetch error:', err);
            document.getElementById('error-message').style.display = 'block';
          });
      </script>
    </body>
    </html>
  `);
});

app.get('/api/projects', (req, res) => {
  res.json(data.projects);
});


app.get('/api/projects/:id', (req, res) => {
  const project = data.projects.find(p => p.id === req.params.id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.get('/api/articles', (req, res) => {
  res.json(data.articles);
});


app.get('/api/articles/:id', (req, res) => {
  const article = data.articles.find(a => a.id === req.params.id);
  if (article) {
    res.json(article);
  } else {
    res.status(404).json({ error: 'Article not found' });
  }
});

app.get('/api/team', (req, res) => {
  res.json(data.team);
});


app.get('/people', (req, res) => {
  res.redirect(301, '/team');
});


app.get('/set-theme', (req, res) => {
  res.cookie('theme', 'light', { path: '/', httpOnly: true });
  res.json({ ok: true });
});


app.get('/team', (req, res) => {
  res.send('<h1>Team Directory</h1><p>Welcome to the team directory.</p>');
});



app.get('/projects/csr', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Projects (CSR)</title>
      <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .project-card { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; background: #eee; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <h1>Projects (CSR)</h1>
      <div id="project-list">Loading...</div>
      <script>
        fetch('/api/projects')
          .then(res => res.json())
          .then(projects => {
            const list = document.getElementById('project-list');
            list.innerHTML = projects.map(p => \`
              <div class="project-card">
                <h3>\${p.name}</h3>
                <p><span class="badge">\${p.status}</span></p>
                <p><strong>Lead:</strong> \${p.lead}</p>
                <p><strong>Tech:</strong> \${p.tech.join(', ')}</p>
              </div>
            \`).join('');
          });
      </script>
    </body>
    </html>
  `);
});


app.get('/projects/ssr', (req, res) => {
  const projectsHtml = data.projects.map(p => `
    <div class="project-card">
      <h3>${p.name}</h3>
      <p><span class="badge">${p.status}</span></p>
      <p><strong>Lead:</strong> ${p.lead}</p>
      <p><strong>Tech:</strong> ${p.tech.join(', ')}</p>
    </div>
  `).join('');

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Projects (SSR)</title>
      <style>
        body { font-family: sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
        .project-card { border: 1px solid #ddd; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; }
        .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; background: #eee; font-size: 0.8rem; }
      </style>
    </head>
    <body>
      <h1>Projects (SSR)</h1>
      <div id="project-list">
        ${projectsHtml}
      </div>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`TeamHub v1 running at http://localhost:${PORT}`);
});
