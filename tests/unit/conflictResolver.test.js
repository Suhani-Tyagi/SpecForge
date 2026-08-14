import { describe, it, expect } from 'vitest';
import { resolveAttributeConflicts, evaluateCommerceReadiness, SOURCE_PRECEDENCE } from '../../server/utils/conflictResolver.js';

describe('Source Authority Conflict Resolver Unit Tests', () => {
  it('should define correct precedence weights for sources', () => {
    expect(SOURCE_PRECEDENCE.verified_structured.weight).toBe(100);
    expect(SOURCE_PRECEDENCE.supplier_doc.weight).toBe(85);
    expect(SOURCE_PRECEDENCE.extracted.weight).toBe(70);
    expect(SOURCE_PRECEDENCE.rag_inferred.weight).toBe(55);
    expect(SOURCE_PRECEDENCE.category_default.weight).toBe(40);
  });

  it('should resolve conflicts and assign source weights', () => {
    const enriched = {
      bore_diameter_mm: { value: 25, confidence: 'high', source: 'extracted', reasoning: 'Explicit bore' },
      material: { value: 'Chrome Steel', confidence: 'medium', source: 'category_default', reasoning: 'Default' }
    };

    const res = resolveAttributeConflicts(enriched, 'Supplier text mentions 30mm bore diameter');
    expect(res.attributes.bore_diameter_mm.weight).toBe(70);
    expect(res.attributes.material.weight).toBe(40);
    expect(res.attributes.bore_diameter_mm.validationStatus).toBe('PASS');
  });

  it('should evaluate commerce readiness gate for ready records', () => {
    const record = { product_name: 'Ball Bearing 6205', category_code: '23-15-16' };
    const attributes = {
      bore_diameter_mm: { value: 25, confidence: 'high', source: 'extracted', reasoning: 'Stated' },
      outer_diameter_mm: { value: 52, confidence: 'high', source: 'extracted', reasoning: 'Stated' },
      width_mm: { value: 15, confidence: 'medium', source: 'rag_inferred', reasoning: 'RAG' }
    };
    const validation = { status: 'valid', quality_score: 90, rule_violations: [] };

    const gate = evaluateCommerceReadiness(record, attributes, validation);
    expect(gate.status).toBe('READY_FOR_CATALOG');
    expect(gate.score).toBeGreaterThanOrEqual(75);
    expect(gate.blockingIssues.length).toBe(0);
  });

  it('should flag blocking issues for missing required attributes', () => {
    const record = { product_name: '', category_code: '' };
    const attributes = {};

    const gate = evaluateCommerceReadiness(record, attributes, {});
    expect(gate.status).toBe('NOT_READY');
    expect(gate.blockingIssues.length).toBeGreaterThan(0);
  });
});
