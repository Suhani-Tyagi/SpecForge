import { describe, it, expect } from 'vitest';
import { geminiService } from '../../server/services/geminiService.js';
import { ExtractionResponseSchema, EnrichmentResponseSchema, ValidationResponseSchema } from '../../server/schemas/aiSchemas.js';

describe('AI Response Validation & Parsing Unit Tests', () => {
  it('should parse clean JSON strings correctly', () => {
    const raw = '{"product_name": "Test Motor", "category_code": "23-15-16"}';
    const parsed = geminiService.parseJSONResponse(raw);
    expect(parsed.product_name).toBe('Test Motor');
  });

  it('should strip markdown code fences cleanly', () => {
    const markdown = '```json\n{"product_name": "Test Motor", "category_code": "23-15-16"}\n```';
    const parsed = geminiService.parseJSONResponse(markdown);
    expect(parsed.product_name).toBe('Test Motor');
  });

  it('should extract embedded JSON if text precedes code fence', () => {
    const messy = 'Here is your output:\n{"product_name": "Test Motor", "category_code": "23-15-16"}';
    const parsed = geminiService.parseJSONResponse(messy);
    expect(parsed.product_name).toBe('Test Motor');
  });

  it('should validate structured Stage 1 Extraction Schema using Zod', () => {
    const sample = {
      product_name: 'Submersible Pump P-100',
      category_code: '40-14-17',
      category_name: 'Pumps -> Submersible Pumps',
      raw_attributes: { flow_rate: '500 L/min', max_head: '20 m' },
      extraction_summary: 'Extracted pump attributes'
    };
    const res = ExtractionResponseSchema.safeParse(sample);
    expect(res.success).toBe(true);
  });

  it('should validate structured Stage 2 Enrichment Schema using Zod', () => {
    const sample = {
      product_name: 'Submersible Pump P-100',
      category_code: '40-14-17',
      category_name: 'Pumps -> Submersible Pumps',
      enriched_attributes: {
        flow_rate: { value: '500 L/min', confidence: 'high', source: 'extracted', reasoning: 'Explicit' }
      },
      enrichment_summary: 'Enriched flow rate'
    };
    const res = EnrichmentResponseSchema.safeParse(sample);
    expect(res.success).toBe(true);
  });

  it('should validate structured Stage 3 Validation Schema using Zod', () => {
    const sample = {
      status: 'valid',
      quality_score: 92,
      summary: 'Product passes all rules',
      rule_violations: [],
      recommendations: ['Approved for catalog publication']
    };
    const res = ValidationResponseSchema.safeParse(sample);
    expect(res.success).toBe(true);
  });
});
