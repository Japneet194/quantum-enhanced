# QEADS Server

TypeScript Express server with MongoDB, JWT auth, and WebSocket notifications.

## Environment

Copy `.env.example` to `.env` and set values.

## Scripts
- dev: ts-node-dev
- build: tsc
- start: node dist

## Routes
- GET /health
- POST /auth/register {name,email,password}
- POST /auth/login {email,password}
- GET /transactions?category=&q=&from=&to=
- POST /transactions {merchant,amount,currency,category,timestamp?}
- POST /transactions/sms {text}
- GET /analytics/patterns
- GET /analytics/anom

WebSocket path: /ws

## Notes
- This starter implements minimal logic for anomaly detection (2x above avg).
- Extend with robust models and compliance features as needed.
