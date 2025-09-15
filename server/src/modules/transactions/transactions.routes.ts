import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { TransactionModel } from '../common/models/transaction.model';
import { authMiddleware, AuthRequest } from '../util/auth.middleware';
import { detectAnomaly } from '../services/anomaly';
import { parseBankSms } from '../services/sms-parser';
import { wssBroadcast } from '../../realtime/ws';
import { computeCarbonScore } from '../services/carbon';
import multer from 'multer';
import Papa from 'papaparse';

export const txRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
// Helper: in dev, allow requests without Authorization by using X-Dev-User-Id
function maybeAuth(req: AuthRequest, res: Response, next: any) {
  const allowDev = process.env.NODE_ENV !== 'production' || process.env.DEV_AUTH_FALLBACK === 'true';
  if (allowDev && !req.headers.authorization) {
    const devUser = (req.headers['x-dev-user-id'] as string) || '000000000000000000000001';
    req.userId = devUser;
    return next();
  }
  return authMiddleware(req, res, next);
}

// Simple ping for diagnostics
txRouter.get('/upload/ping', (_req, res) => res.json({ ok: true }));


const createTxSchema = z.object({
  merchant: z.string().min(1),
  amount: z.number(),
  currency: z.string().min(3).max(3),
  category: z.string().min(1),
  timestamp: z.coerce.date().optional(),
  carbonScore: z.number().min(0).max(100).optional(),
  raw: z.any().optional(),
});

const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

txRouter.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json(parsed.error.format());
  const { q, category, from, to } = parsed.data;
  const filter: any = { userId: req.userId };
  if (category) filter.category = category;
  if (q) filter.merchant = { $regex: q, $options: 'i' };
  if (from || to) filter.timestamp = {};
  if (from) filter.timestamp.$gte = new Date(from!);
  if (to) filter.timestamp.$lte = new Date(to!);
  const items = await TransactionModel.find(filter).sort({ timestamp: -1 }).limit(100);
  res.json(items);
});

txRouter.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = createTxSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());
  // compute average spend for category in last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const stats = await TransactionModel.aggregate([
    { $match: { userId: req.userId, category: parsed.data.category, timestamp: { $gte: since } } },
    { $group: { _id: null, avg: { $avg: '$amount' } } },
  ]) as any[];
  const avg = stats?.[0]?.avg ?? Math.abs(parsed.data.amount); // fallback to current amount
  const { isAnomaly, reason } = detectAnomaly(parsed.data.amount, avg, 2);
  const carbonScore = parsed.data.carbonScore ?? computeCarbonScore(parsed.data.category, parsed.data.amount);
  const tx = await TransactionModel.create({ ...parsed.data, carbonScore, userId: req.userId, isAnomaly, anomalyReason: reason, status: 'pending' });
  wssBroadcast({ type: 'transaction:new', payload: tx });
  res.status(201).json(tx);
});

const smsSchema = z.object({ text: z.string().min(10) });

txRouter.post('/sms', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = smsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());
  const txParsed = parseBankSms(parsed.data.text);
  if (!txParsed) return res.status(422).json({ message: 'Unable to parse SMS' });
  // reuse POST logic
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const stats = await TransactionModel.aggregate([
    { $match: { userId: req.userId, category: txParsed.category, timestamp: { $gte: since } } },
    { $group: { _id: null, avg: { $avg: '$amount' } } },
  ]) as any[];
  const avg = stats?.[0]?.avg ?? Math.abs(txParsed.amount);
  const { isAnomaly, reason } = detectAnomaly(txParsed.amount, avg, 2);
  const carbonScore = computeCarbonScore(txParsed.category, txParsed.amount);
  const tx = await TransactionModel.create({ ...txParsed, carbonScore, userId: req.userId, isAnomaly, anomalyReason: reason, status: 'pending' });
  wssBroadcast({ type: 'transaction:new', payload: tx });
  res.status(201).json(tx);
});

const updateSchema = z.object({
  status: z.enum(['pending', 'verified', 'flagged']).optional(),
  isAnomaly: z.boolean().optional(),
  anomalyReason: z.string().optional(),
});

txRouter.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.format());
  const id = req.params.id;
  const tx = await TransactionModel.findOneAndUpdate(
    { _id: id, userId: req.userId },
    { $set: parsed.data },
    { new: true }
  );
  if (!tx) return res.status(404).json({ message: 'Not found' });
  wssBroadcast({ type: 'transaction:update', payload: tx });
  res.json(tx);
});

// CSV Upload: expects headers: date,merchant,amount,currency(optional)
txRouter.post('/upload/csv', maybeAuth, upload.single('file'), async (req: AuthRequest, res: Response) => {
  const file = (req as unknown as { file?: { buffer: Buffer; originalname: string; mimetype: string; size?: number } }).file;
  if (!file) {
    console.warn('CSV upload: no file present');
  } else {
    console.log('CSV upload received:', { name: file.originalname, type: file.mimetype, size: file.size });
  }
  if (!file) return res.status(400).json({ message: 'file is required' });
  const csvText = file.buffer.toString('utf8');
  const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
  if (parsed.errors?.length) return res.status(400).json({ message: 'Invalid CSV', errors: parsed.errors.map((e: any) => e.message) });

  type Row = { date?: string; merchant?: string; amount?: string; currency?: string };
  const rows = (parsed.data as Row[]).filter(r => r.merchant && r.amount);

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const created: any[] = [];
  for (const r of rows) {
    const merchant = String(r.merchant).trim();
    const amount = Number(String(r.amount).replace(/,/g, ''));
    const currency = (r.currency || 'INR').toUpperCase();
    const timestamp = r.date ? new Date(r.date) : new Date();
    // naive categorization: reuse SMS guesser
    const category = parseBankSms(`INR ${Math.abs(amount)} spent at ${merchant}`)?.category || 'other';
    const stats = await TransactionModel.aggregate([
      { $match: { userId: req.userId, category, timestamp: { $gte: since } } },
      { $group: { _id: null, avg: { $avg: '$amount' } } },
    ]) as any[];
    const avg = stats?.[0]?.avg ?? Math.abs(amount);
    const { isAnomaly, reason } = detectAnomaly(-Math.abs(amount), avg, 2);
    const carbonScore = computeCarbonScore(category, -Math.abs(amount));
    const tx = await TransactionModel.create({
      userId: req.userId,
      merchant,
      amount: -Math.abs(amount),
      currency,
      category,
      timestamp,
      carbonScore,
      isAnomaly,
      anomalyReason: reason,
      status: 'pending',
      raw: r,
    });
    created.push(tx);
  }

  // Simple saving tips from 30-day spend by category
  const agg = await TransactionModel.aggregate([
    { $match: { userId: req.userId, timestamp: { $gte: since } } },
    { $group: { _id: '$category', total: { $sum: { $abs: '$amount' } }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 3 },
  ]);
  const tips = (agg as any[]).map((a, i) => {
    const cat = a._id;
    const total = a.total as number;
    const suggestion = cat === 'food'
      ? 'Plan meals and reduce ordering-in by 20%'
      : cat === 'shopping'
      ? 'Delay non-essential purchases this month'
      : cat === 'fuel'
      ? 'Bundle trips and use public transport when possible'
      : 'Set a weekly budget and track it';
    return {
      rank: i + 1,
      category: cat,
      monthlyTotal: Math.round(total),
      tip: suggestion,
      potentialSavings: Math.round(total * 0.15),
    };
  });

  res.status(201).json({ imported: created.length, tips, items: created });
});
