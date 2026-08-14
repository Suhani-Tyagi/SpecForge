/**
 * Unit Normalization Layer
 * Normalizes imperial and metric dimensions, power ratings, pressure, temperature, etc.
 * Returns normalized metric values while preserving original raw strings.
 */
export function normalizeValue(value, unitTypeHint = '') {
  if (value === null || value === undefined || value === 'unknown') {
    return { value, normalized: null, unit: null };
  }

  const str = String(value).trim();
  const num = parseFloat(str);

  if (isNaN(num)) {
    return { value, normalized: null, unit: null };
  }

  const lower = str.toLowerCase();

  // Length / Dimensions (Inches -> MM)
  if (lower.includes('inch') || lower.includes('"') || lower.endsWith('in')) {
    const mmVal = Math.round(num * 25.4 * 100) / 100;
    return { value: str, normalized: mmVal, unit: 'mm', note: `${num} inch = ${mmVal} mm` };
  }
  if (lower.includes('cm')) {
    const mmVal = Math.round(num * 10 * 100) / 100;
    return { value: str, normalized: mmVal, unit: 'mm', note: `${num} cm = ${mmVal} mm` };
  }
  if (lower.includes('m') && !lower.includes('mm') && !lower.includes('rpm')) {
    const mmVal = Math.round(num * 1000 * 100) / 100;
    return { value: str, normalized: mmVal, unit: 'mm', note: `${num} m = ${mmVal} mm` };
  }

  // Power (HP -> kW)
  if (lower.includes('hp') || lower.includes('horsepower')) {
    const kwVal = Math.round(num * 0.7457 * 100) / 100;
    return { value: str, normalized: kwVal, unit: 'kW', note: `${num} HP = ${kwVal} kW` };
  }

  // Pressure (PSI -> bar)
  if (lower.includes('psi')) {
    const barVal = Math.round(num * 0.0689476 * 100) / 100;
    return { value: str, normalized: barVal, unit: 'bar', note: `${num} PSI = ${barVal} bar` };
  }

  // Temperature (F -> C)
  if (lower.includes('°f') || lower.includes('deg f') || lower.includes(' fahrenheit')) {
    const cVal = Math.round(((num - 32) * 5 / 9) * 100) / 100;
    return { value: str, normalized: cVal, unit: '°C', note: `${num} °F = ${cVal} °C` };
  }

  return { value: num, normalized: num, unit: unitTypeHint || null };
}

/**
 * Normalizes all attributes in an enriched product payload
 */
export function normalizeEnrichedAttributes(attributes = {}) {
  const normalized = {};

  Object.entries(attributes).forEach(([key, attr]) => {
    const rawVal = typeof attr === 'object' ? attr.value : attr;
    const normResult = normalizeValue(rawVal, key);

    normalized[key] = {
      ...(typeof attr === 'object' ? attr : { value: attr, confidence: 'high', source: 'extracted', reasoning: 'Extracted attribute' }),
      original_value: rawVal,
      normalized_value: normResult.normalized !== null ? normResult.normalized : rawVal,
      normalized_unit: normResult.unit,
      normalization_note: normResult.note || null
    };
  });

  return normalized;
}
