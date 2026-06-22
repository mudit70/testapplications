import express, { type Request, type Response } from 'express';
import { DataSource } from 'typeorm';
import { Board, Card } from './entities.js';
import { BoardsService } from './boards.service.js';
import { enqueueCoverResize, enqueueBoardNotification } from './queue.js';
import { uploadCover } from './storage.js';
import { startRealtime } from './realtime.js';

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Board, Card],
});

const service = new BoardsService(
  dataSource.getRepository(Board),
  dataSource.getRepository(Card),
);

const app = express();
app.use(express.json());

app.get('/api/boards', async (_req: Request, res: Response) => {
  const boards = await service.listBoards();
  res.json(boards);
});

app.get('/api/boards/:id', async (req: Request, res: Response) => {
  const board = await service.getBoard(req.params.id);
  if (!board) return res.status(404).json({ error: 'not found' });
  res.json(board);
});

app.post('/api/boards', async (req: Request, res: Response) => {
  const board = await service.createBoard(req.body.title);
  await enqueueBoardNotification(board.id);
  res.status(201).json(board);
});

app.delete('/api/boards/:id', async (req: Request, res: Response) => {
  await service.deleteBoard(req.params.id);
  res.status(204).send();
});

app.post('/api/boards/:id/cover', async (req: Request, res: Response) => {
  const key = `covers/${req.params.id}.png`;
  await uploadCover(key, req.body);
  await service.setCover(req.params.id, key);
  await enqueueCoverResize(req.params.id, key);
  res.status(202).json({ key });
});

startRealtime();
app.listen(3000);
