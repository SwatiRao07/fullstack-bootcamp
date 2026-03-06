import express, { Request, Response, NextFunction } from 'express';
import { UserRepositoryPostgres } from '../drill-02-repo-db/userRepository';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json())
app.use((req, res, next) => {
  (req as any).id = uuidv4();
  next();
});

const sendProblem = (res: Response, status: number, title: string, detail: string) => {
  res.setHeader('Content-Type', 'application/problem+json');
  res.status(status).json({
    type: 'about:blank',
    title,
    status,
    detail,
    instance: res.req.url,
  });
};

const getRepo = (req: Request): UserRepositoryPostgres => {
  return req.app.locals.userRepo;
};

app.post('/users', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) {
    return sendProblem(res, 400, 'Invalid Input', 'Missing email or name');
  }
  try {
    const repo = getRepo(req);
    const user = await repo.createUser(email, name);
    res.status(201).json(user);
  } catch (err: any) {
    if (err.code === '23505') {
      // Postgres UNIQUE violation code
      return sendProblem(res, 409, 'Conflict', 'Email already exists');
    }
    sendProblem(res, 500, 'Internal Server Error', 'An unexpected error occurred');
  }
});

app.get('/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return sendProblem(res, 400, 'Bad Request', 'Invalid ID format');
  }
  try {
    const repo = getRepo(req);
    const user = await repo.getUserByEmailOrId(id); 

    if (!user) {
      return sendProblem(res, 404, 'Not Found', 'User does not exist');
    }
    res.status(200).json(user);
  } catch (err: any) {
    sendProblem(res, 503, 'Service Unavailable', 'Database is currently unreachable');
  }
});

app.get('/users', async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const offset = Number(req.query.offset) || 0;

  try {
    const repo = getRepo(req);
    const users = await repo.getUsers(limit, offset);
    res.status(200).json(users);
  } catch (err: any) {
    sendProblem(res, 503, 'Service Unavailable', 'Database is currently unreachable');
  }
});

export default app;
