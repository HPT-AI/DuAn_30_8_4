const request = require('supertest');
const gateway = require('../src/app');

describe('API Gateway', () => {
  let app;

  beforeAll(async () => {
    app = gateway.app;
  });

  afterAll(async () => {
    await gateway.stop();
  });

  describe('Health Checks', () => {
    test('GET /health should return 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });

    test('GET /health/detailed should return detailed health info', async () => {
      const response = await request(app)
        .get('/health/detailed')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('components');
      expect(response.body.components).toHaveProperty('redis');
      expect(response.body.components).toHaveProperty('services');
    });

    test('GET /health/live should return liveness status', async () => {
      const response = await request(app)
        .get('/health/live')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'alive');
    });

    test('GET /health/ready should return readiness status', async () => {
      const response = await request(app)
        .get('/health/ready');

      expect(response.body).toHaveProperty('status');
      expect(['ready', 'not_ready']).toContain(response.body.status);
    });
  });

  describe('Metrics', () => {
    test('GET /metrics should return Prometheus metrics', async () => {
      const response = await request(app)
        .get('/metrics')
        .expect(200);

      expect(response.headers['content-type']).toMatch(/text\/plain/);
      expect(response.text).toContain('api_gateway_');
    });

    test('GET /metrics/json should return JSON metrics', async () => {
      const response = await request(app)
        .get('/metrics/json')
        .expect(200);

      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('metrics');
    });
  });

  describe('Root Endpoint', () => {
    test('GET / should return gateway info', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('name', 'API Gateway');
      expect(response.body).toHaveProperty('status', 'running');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('Error Handling', () => {
    test('GET /nonexistent should return 404', async () => {
      const response = await request(app)
        .get('/nonexistent')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
      expect(response.body).toHaveProperty('path', '/nonexistent');
    });
  });

  describe('API Routes', () => {
    test('GET /api/nonexistent should return service not found', async () => {
      const response = await request(app)
        .get('/api/nonexistent/test')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Service not found');
      expect(response.body).toHaveProperty('availableServices');
    });
  });

  describe('Security Headers', () => {
    test('Should include security headers', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });
  });

  describe('CORS', () => {
    test('Should handle CORS preflight', async () => {
      const response = await request(app)
        .options('/')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});