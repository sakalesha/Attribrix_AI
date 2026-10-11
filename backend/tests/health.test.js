// It tests the health endpoints of the backend module.

const request = require('supertest');
const app = require('../src/app');

describe('Backend API Health & Endpoints', () => {
  it('GET /health returns 200 and status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('service', 'attribrix-backend');
    expect(res.body).toHaveProperty('dependencies');
  });

  it('GET /api/v1/health returns 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });

  it('GET /api/v1/auth/status returns open catalog status for MVP', async () => {
    const res = await request(app).get('/api/v1/auth/status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.authenticated).toBe(false);
  });
});
