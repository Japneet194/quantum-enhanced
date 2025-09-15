import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../util/auth.middleware';
import { TransactionModel } from '../common/models/transaction.model';

export const analyticsRouter = Router();

analyticsRouter.get('/patterns', authMiddleware, async (req: AuthRequest, res: Response) => {
  // simple baseline: average spend per category last 30 days
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const pipeline = [
    { $match: { userId: req.userId, timestamp: { $gte: since } } },
    { $group: { _id: '$category', avg: { $avg: '$amount' }, count: { $sum: 1 } } },
    { $project: { category: '$_id', avg: 1, count: 1, _id: 0 } },
  ];
  const results = await TransactionModel.aggregate(pipeline as any);
  res.json({ categories: results });
});

analyticsRouter.get('/anom', authMiddleware, async (req: AuthRequest, res: Response) => {
  // return latest anomalies
  const items = await TransactionModel.find({ userId: req.userId, isAnomaly: true }).sort({ timestamp: -1 }).limit(20);
  res.json(items);
});
