import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Entry from '../models/Entry.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.use(authMiddleware);

router.get('/', async (req, res) => {
  const items = await Entry.find({ userId: req.userId }).sort({ timestamp: -1 }).lean();
  res.json(items);
});

router.post('/', async (req, res) => {
  const { type, amount, note, timestamp } = req.body;
  if (!type || typeof amount !== 'number' || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const entry = await Entry.create({ userId: req.userId, type, amount, note: note || '', timestamp: new Date(timestamp) });
  res.status(201).json(entry);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Entry.findOneAndDelete({ _id: id, userId: req.userId });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

export default router;


