const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    ts: new Date().toISOString()
  });
});

const mockUsers = {
  "1": { id: 1, name: "Aman" },
  "2": { id: 2, name: "Raman" }
};

app.get('/users/:id', (req, res) => {
  const user = mockUsers[req.params.id];
  
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.post('/echo', (req, res) => {
  res.status(201).json(req.body);
});

app.get('/set-theme-cookie', (req, res) => {
  res.cookie('theme', 'dark', { path: '/' });
  res.send('Cookie has been set');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});