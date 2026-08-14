import { describe, it, expect } from 'vitest';
import { normalizeValue, normalizeEnrichedAttributes } from '../../server/utils/unitNormalizer.js';

describe('Unit Normalizer Utility', () => {
  it('should convert inches to mm', () => {
    const result = normalizeValue('1.5 inch');
    expect(result.normalized).toBe(38.1);
    expect(result.unit).toBe('mm');
  });

  it('should convert HP to kW', () => {
    const result = normalizeValue('10 HP');
    expect(result.normalized).toBe(7.46);
    expect(result.unit).toBe('kW');
  });

  it('should convert PSI to bar', () => {
    const result = normalizeValue('100 PSI');
    expect(result.normalized).toBe(6.89);
    expect(result.unit).toBe('bar');
  });

  it('should convert Fahrenheit to Celsius', () => {
    const result = normalizeValue('212 °F');
    expect(result.normalized).toBe(100);
    expect(result.unit).toBe('°C');
  });

  it('should normalize all attributes in a record', () => {
    const attrs = {
      length: { value: '2 inch', confidence: 'high', source: 'extracted' },
      power: { value: '5 HP', confidence: 'medium', source: 'inferred' }
    };

    const normalized = normalizeEnrichedAttributes(attrs);
    expect(normalized.length.normalized_value).toBe(50.8);
    expect(normalized.length.normalized_unit).toBe('mm');
    expect(normalized.power.normalized_value).toBe(3.73);
    expect(normalized.power.normalized_unit).toBe('kW');
  });
});
