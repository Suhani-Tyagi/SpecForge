import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../api/index.js';

describe('SpecForge API Routes Integration Tests', () => {
  it('GET /api/health should return status healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.system).toBe('SpecForge AI Product Intelligence');
  });

  it('GET /api/knowledge-base should return taxonomy and reference products', async () => {
    const res = await request(app).get('/api/knowledge-base');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.taxonomy.length).toBe(20);
    expect(res.body.reference_products.length).toBe(12);
  });

  it('POST /api/pipeline/full should succeed for Execute mode payload', async () => {
    const res = await request(app)
      .post('/api/pipeline/full')
      .send({
        inputType: 'text',
        categoryCode: '23-15-16',
        textContent: 'Deep groove ball bearing 6205-2RS, rubber sealed, 25mm bore.'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.finalRecord).toBeDefined();
    expect(res.body.finalRecord.category_code).toBe('23-15-16');
  });

  it('POST /api/pipeline/full should succeed for Instant Demo Mode payload', async () => {
    const res = await request(app)
      .post('/api/pipeline/full')
      .send({
        inputType: 'text',
        categoryCode: '26-10-15',
        textContent: 'Industrial 3-Phase AC Induction Motor 5.5 kW 415V 1440 RPM'
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.finalRecord).toBeDefined();
  });

  it('POST /api/pipeline/extract should validate input payload with Zod (400 on text > 5000 chars)', async () => {
    const res = await request(app)
      .post('/api/pipeline/extract')
      .send({ inputType: 'text', textContent: 'A'.repeat(6000) });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Validation failed');
  });

  it('POST /api/pipeline/extract should reject invalid category codes with 400', async () => {
    const res = await request(app)
      .post('/api/pipeline/extract')
      .send({ inputType: 'text', textContent: 'Valid text', categoryCode: 'invalid_code' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/pipeline/batch should validate batch size (min 1, max 10)', async () => {
    const res = await request(app)
      .post('/api/pipeline/batch')
      .send({ items: [] });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
