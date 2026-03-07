import app from './app';
import dotenv from 'dotenv';
import { initDb } from './db/connection';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  initDb();
  app.listen(PORT, () => {
    console.log(`Security Drills Server running on http://localhost:${PORT}`);
  });
}

startServer();
