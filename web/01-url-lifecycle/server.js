const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.get('/api/ping', (req, res) => {
    res.json({ "ok": true });
});

app.get('/old-home', (req, res) => {
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <link rel="stylesheet" href="/style.css">
            <title>Express Implementation</title>
        </head>
        <body>
            <h1>Express Route Test</h1>
            <p>Check the console and network tab.</p>
            <script src="/app.js"></script>
        </body>
        </html>
    `);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res) => {
    res.status(404).send('<h1>404</h1><p>Path not found.</p>');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});