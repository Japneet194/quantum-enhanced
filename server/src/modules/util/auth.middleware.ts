import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) {
    const allowFallback = process.env.DEV_AUTH_FALLBACK === 'true' || process.env.NODE_ENV !== 'production';
    if (allowFallback) {
      const devUser = (req.headers['x-dev-user-id'] as string) || 'dev-user';
      if (!devUser) {
        console.warn('Auth: missing Authorization; using dev fallback but no X-Dev-User-Id provided.');
      } else {
        console.log('Auth: using dev fallback for user', devUser);
      }
      req.userId = devUser || 'dev-user';
      return next();
    }
    return res.status(401).json({ message: 'Missing Authorization header' });
  }
  const token = header.replace('Bearer ', '');
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret) as any;
    req.userId = payload.sub as string;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}
