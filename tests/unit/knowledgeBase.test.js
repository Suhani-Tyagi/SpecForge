import { describe, it, expect } from 'vitest';
import { knowledgeBaseService } from '../../server/services/knowledgeBase.js';

describe('KnowledgeBaseService', () => {
  it('should load taxonomy with 20 categories', () => {
    const taxonomy = knowledgeBaseService.getTaxonomy();
    expect(taxonomy.length).toBe(20);
    expect(taxonomy[0]).toHaveProperty('code');
    expect(taxonomy[0]).toHaveProperty('category');
    expect(taxonomy[0]).toHaveProperty('subcategory');
  });

  it('should load 12 reference products', () => {
    const refProducts = knowledgeBaseService.getReferenceProducts();
    expect(refProducts.length).toBe(12);
    expect(refProducts[0]).toHaveProperty('id');
    expect(refProducts[0]).toHaveProperty('attributes');
  });

  it('should load consistency rules', () => {
    const rules = knowledgeBaseService.getConsistencyRules();
    expect(rules.length).toBeGreaterThanOrEqual(5);
  });

  it('should match best category by code or name', () => {
    const catByCode = knowledgeBaseService.getCategoryByCode('23-15-16');
    expect(catByCode.subcategory).toBe('Ball Bearings');

    const catByFuzzy = knowledgeBaseService.findBestCategory('3-Phase AC motor 5.5kW');
    expect(catByFuzzy.category).toBe('Motors & Drives');
  });

  it('should validate Bearing diameter rule correctly (outer_diameter_mm > bore_diameter_mm)', () => {
    // Valid bearing
    const validViolations = knowledgeBaseService.validateAttributes('Bearings', {
      bore_diameter_mm: { value: 25 },
      outer_diameter_mm: { value: 52 }
    });
    expect(validViolations.length).toBe(0);

    // Invalid bearing (OD <= ID)
    const invalidViolations = knowledgeBaseService.validateAttributes('Bearings', {
      bore_diameter_mm: { value: 50 },
      outer_diameter_mm: { value: 40 }
    });
    expect(invalidViolations.length).toBe(1);
    expect(invalidViolations[0].field).toBe('outer_diameter_mm');
  });

  it('should validate Fastener diameter vs length rule (diameter_mm < length_mm)', () => {
    const violations = knowledgeBaseService.validateAttributes('Fasteners', {
      diameter_mm: { value: 50 },
      length_mm: { value: 10 }
    });
    expect(violations.length).toBe(1);
    expect(violations[0].field).toBe('diameter_mm');
  });
});
