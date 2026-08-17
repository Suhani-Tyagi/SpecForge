import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../api/index.js';
import { geminiService } from '../../server/services/geminiService.js';

describe('SpecForge API Routes Integration Tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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
    expect(res.body.taxonomy.length).toBeGreaterThan(0);
    expect(res.body.reference_products.length).toBeGreaterThan(0);
  });

  it('POST /api/pipeline/full should succeed for Execute mode payload with mocked AI service', async () => {
    vi.spyOn(geminiService, 'runFullPipeline').mockResolvedValueOnce({
      success: true,
      totalLatencyMs: 120,
      stages: {
        intake: { stage: 1, success: true, data: { product_name: 'Deep groove ball bearing 6205-2RS', category_code: '23-15-16' } },
        enrichment: { stage: 2, success: true, data: { product_name: 'Deep groove ball bearing 6205-2RS', category_code: '23-15-16' } },
        validation: { stage: 3, success: true, data: { product_name: 'Deep groove ball bearing 6205-2RS', category_code: '23-15-16', validation: { status: 'valid', quality_score: 95 } } }
      },
      finalRecord: {
        product_name: 'Deep groove ball bearing 6205-2RS',
        category_code: '23-15-16',
        category_name: 'Bearings -> Ball Bearings',
        attributes: { bore_diameter_mm: { value: 25, unit: 'mm', confidence: 'high', source: 'extracted' } },
        validation: { status: 'valid', quality_score: 95 }
      }
    });

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
