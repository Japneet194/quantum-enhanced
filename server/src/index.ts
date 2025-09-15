import type { Request, Response, NextFunction } from 'express';
// Use CommonJS require for runtime compatibility under ts-node-dev
const http = require('http');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
import * as dotenv from 'dotenv';
const { WebSocketServer, WebSocket } = require('ws');
import { connectDb } from './infra/db';
import { authRouter } from './modules/auth/auth.routes';
import { txRouter } from './modules/transactions/transactions.routes';
import { analyticsRouter } from './modules/analytics/analytics.routes';
import { registerWss, wssBroadcast } from './realtime/ws';
import { openapi } from './docs/openapi';

dotenv.config();

const app = express();
app.use(express.json());
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Dev-User-Id', 'x-dev-user-id'],
};
app.use(cors(corsOptions));
// Ensure preflight requests succeed across all routes
app.options('*', cors(corsOptions));
// Helmet typing under CJS interop requires .default
app.use((helmet as any).default ? (helmet as any).default() : (helmet as any)());

// Health
app.get('/health', (_: Request, res: Response) => {
  res.json({ ok: true, service: 'qeads-server', time: new Date().toISOString() });
});

// Docs
app.get('/docs', (_: Request, res: Response) => {
  res.json(openapi);
});

// Routes
app.use('/auth', authRouter);
app.use('/transactions', txRouter);
app.use('/analytics', analyticsRouter);

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const server = http.createServer(app);

// WebSocket for live notifications
const wss = new WebSocketServer({ server, path: '/ws' });
registerWss(wss);
// sample keepalive
setInterval(() => {
  wssBroadcast({ type: 'heartbeat', time: Date.now() });
}, 30000);

const PORT = Number(process.env.PORT || 4000);

async function start() {
  try {
    await connectDb();
  } catch (e) {
    console.warn('Warning: MongoDB not connected. Some routes will fail until DB is available.');
  }
  server.listen(PORT, () => {
    console.log(`QEADS server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error('Failed to start server', e);
  process.exit(1);
});
