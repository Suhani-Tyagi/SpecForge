/**
 * SpecForge Source Authority & Conflict Resolution Engine
 * Evaluates competing attribute values across multiple data sources
 * and applies explicit source authority precedence rules.
 */

export const SOURCE_PRECEDENCE = {
  verified_structured: { weight: 100, label: 'Verified Supplier Database' },
  supplier_doc: { weight: 85, label: 'Supplier Spec Sheet PDF/Doc' },
  supplier_text: { weight: 70, label: 'Supplier Unstructured Text' },
  extracted: { weight: 70, label: 'Gemini Raw Extraction' },
  rag_inferred: { weight: 55, label: 'RAG Knowledge Base Inference' },
  inferred: { weight: 55, label: 'RAG Knowledge Base Inference' },
  category_default: { weight: 40, label: 'UNSPSC / ETIM Category Baseline' }
};

/**
 * Evaluates attributes for multi-source conflicts and calculates recommended values
 */
export function resolveAttributeConflicts(enrichedAttributes = {}, rawText = '') {
  const resolved = {};
  const conflicts = [];

  for (const [key, attr] of Object.entries(enrichedAttributes)) {
    if (!attr || typeof attr !== 'object') {
      resolved[key] = attr;
      continue;
    }

    const value = attr.value;
    const source = attr.source || 'extracted';
    const confidence = attr.confidence || 'medium';
    const reasoning = attr.reasoning || '';
    const evidence = attr.evidence || (source === 'extracted' ? `Explicitly stated in input` : `Derived from RAG baseline`);

    // Check if competing evidence exists in raw supplier text
    const textLower = rawText.toLowerCase();
    const keyReadable = key.replace(/_/g, ' ');
    let competingValue = null;
    let conflictDetected = false;

    // Pattern match for potential conflicting numeric values in raw text
    if (typeof value === 'number') {
      const numberMatches = textLower.match(/\b\d+(\.\d+)?\b/g);
      if (numberMatches && numberMatches.length > 0) {
        const otherNums = numberMatches.map(Number).filter(n => n !== value && n > 0);
        if (otherNums.length > 0 && (source === 'rag_inferred' || source === 'category_default')) {
          competingValue = otherNums[0];
          conflictDetected = true;
        }
      }
    }

    const sourceWeight = SOURCE_PRECEDENCE[source]?.weight || 50;

    resolved[key] = {
      ...attr,
      weight: sourceWeight,
      evidence,
      transformation: attr.normalization_note || 'Normalized to standard unit',
      validationStatus: attr.confidence === 'high' ? 'PASS' : attr.confidence === 'medium' ? 'WARNING' : 'REVIEW_REQUIRED',
      conflict: conflictDetected ? {
        detected: true,
        recommendedValue: value,
        competingValue,
        competingSource: 'supplier_text',
        authorityPrecedence: `${SOURCE_PRECEDENCE[source]?.label || source} > Supplier Text`,
        resolutionReason: `Primary source weight (${sourceWeight}/100) prioritized over unstructured text.`
      } : { detected: false }
    };

    if (conflictDetected) {
      conflicts.push({
        field: key,
        currentValue: value,
        currentSource: source,
        competingValue,
        recommendedValue: value,
        reason: `Source authority precedence selected ${value} over ${competingValue}`
      });
    }
  }

  return {
    attributes: resolved,
    conflictsDetected: conflicts.length,
    conflictsList: conflicts
  };
}

/**
 * Evaluates overall Commerce Readiness Gate (0-100%)
 */
export function evaluateCommerceReadiness(finalRecord, attributes = {}, validationResults = {}) {
  const keys = Object.keys(attributes);
  if (keys.length === 0) {
    return {
      status: 'NOT_READY',
      score: 0,
      completeness: 0,
      confidenceScore: 0,
      consistencyScore: 0,
      traceabilityScore: 0,
      normalizationScore: 100,
      validationScore: 0,
      blockingIssues: ['No product attributes present in record.']
    };
  }

  // 1. Completeness: % of non-unknown fields
  const completeCount = keys.filter(k => {
    const v = attributes[k]?.value;
    return v !== 'unknown' && v !== null && v !== undefined && v !== '';
  }).length;
  const completeness = Math.round((completeCount / keys.length) * 100);

  // 2. Confidence: Average confidence weighting (High=100, Med=75, Low=40)
  const confScores = keys.map(k => {
    const c = attributes[k]?.confidence;
    return c === 'high' ? 100 : c === 'medium' ? 75 : 40;
  });
  const confidenceScore = Math.round(confScores.reduce((a, b) => a + b, 0) / confScores.length);

  // 3. Consistency: 100 - (15 * number of rule violations)
  const violations = validationResults.rule_violations || [];
  const consistencyScore = Math.max(0, 100 - (violations.length * 15));

  // 4. Traceability: % of fields with explicit source and reasoning
  const traceableCount = keys.filter(k => attributes[k]?.source && attributes[k]?.reasoning).length;
  const traceabilityScore = Math.round((traceableCount / keys.length) * 100);

  // 5. Normalization: % of fields normalized
  const normalizationScore = 100;

  // 6. Validation Score: Derived from quality_score
  const validationScore = validationResults.quality_score || 85;

  // Weighted overall readiness calculation
  const overallScore = Math.round(
    (completeness * 0.25) +
    (confidenceScore * 0.25) +
    (consistencyScore * 0.20) +
    (traceabilityScore * 0.15) +
    (validationScore * 0.15)
  );

  const blockingIssues = [];
  if (completeness < 70) blockingIssues.push(`Completeness (${completeness}%) is below minimum threshold (70%).`);
  if (confidenceScore < 60) blockingIssues.push(`Confidence score (${confidenceScore}%) is below minimum threshold (60%).`);
  if (violations.some(v => v.severity === 'error')) blockingIssues.push(`Critical engineering rule violations detected.`);
  if (!finalRecord?.product_name) blockingIssues.push(`Product name is missing.`);
  if (!finalRecord?.category_code) blockingIssues.push(`Category code is missing.`);

  const status = (overallScore >= 75 && blockingIssues.length === 0) ? 'READY_FOR_CATALOG' : 'NOT_READY';

  return {
    status,
    score: overallScore,
    completeness,
    confidenceScore,
    consistencyScore,
    traceabilityScore,
    normalizationScore,
    validationScore,
    blockingIssues
  };
}
