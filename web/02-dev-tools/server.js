const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/api/user', (req, res) => {
    const traceId = 'TRC-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    res.set('X-Debug-Trace', traceId);

    if (req.query.fail === '1') {
        return res.status(500).json({ error: "Internal Server Error: Database offline." });
    }

    res.json({
        name: "Divya Mirza",
        email: "divya.mirza@example.com"
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));