export const openapi = {
  openapi: '3.0.0',
  info: { title: 'QEADS API', version: '0.1.0' },
  servers: [{ url: 'http://localhost:4000' }],
  paths: {
    '/auth/register': { post: { summary: 'Register', requestBody: { required: true }, responses: { '201': { description: 'Created' } } } },
    '/auth/login': { post: { summary: 'Login', requestBody: { required: true }, responses: { '200': { description: 'OK' } } } },
    '/transactions': {
      get: { summary: 'List transactions', parameters: [], responses: { '200': { description: 'OK' } } },
      post: { summary: 'Create transaction', responses: { '201': { description: 'Created' } } }
    },
    '/transactions/sms': { post: { summary: 'Parse SMS and create transaction', responses: { '201': { description: 'Created' } } } },
    '/analytics/patterns': { get: { summary: 'Category averages', responses: { '200': { description: 'OK' } } } },
    '/analytics/anom': { get: { summary: 'Recent anomalies', responses: { '200': { description: 'OK' } } } },
  }
};
