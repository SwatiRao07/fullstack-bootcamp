const express = require('express')
const app = express()
const PORT=4000

app.get('/', (req, res) => {
  res.send('<h1>Hello from the toolbox</h1>')
})

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', version: '1.0' })

})

app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/missing', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
    path: req.originalUrl
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})