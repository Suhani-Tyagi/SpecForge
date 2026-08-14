import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_BASE_PATH = path.resolve(__dirname, '../../specforge-knowledge-base.json');

class KnowledgeBaseService {
  constructor() {
    this.kb = null;
    this.loadKB();
  }

  loadKB() {
    try {
      const data = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf-8');
      this.kb = JSON.parse(data);
      console.log(`[KnowledgeBase] Loaded ${this.kb.taxonomy.length} categories, ${this.kb.reference_products.length} reference products, ${this.kb.consistency_rules.length} consistency rules.`);
    } catch (err) {
      console.error('[KnowledgeBase] Error loading specforge-knowledge-base.json:', err);
      this.kb = { meta: {}, taxonomy: [], reference_products: [], consistency_rules: [] };
    }
  }

  getTaxonomy() {
    return this.kb.taxonomy || [];
  }

  getReferenceProducts() {
    return this.kb.reference_products || [];
  }

  getConsistencyRules() {
    return this.kb.consistency_rules || [];
  }

  getCategoryByCode(code) {
    return this.getTaxonomy().find(cat => cat.code === code);
  }

  findBestCategory(inputString) {
    if (!inputString) return this.getTaxonomy()[0];
    const text = inputString.toLowerCase();
    
    // Direct code match
    const codeMatch = this.getTaxonomy().find(cat => cat.code === inputString);
    if (codeMatch) return codeMatch;

    // Subcategory or category match
    let bestCat = null;
    let maxScore = 0;

    for (const cat of this.getTaxonomy()) {
      let score = 0;
      if (text.includes(cat.subcategory.toLowerCase())) score += 5;
      if (text.includes(cat.category.toLowerCase())) score += 3;
      cat.typical_attributes.forEach(attr => {
        if (text.includes(attr.replace(/_/g, ' '))) score += 1;
      });

      if (score > maxScore) {
        maxScore = score;
        bestCat = cat;
      }
    }

    return bestCat || this.getTaxonomy()[0];
  }

  /**
   * RAG Lookup: Retrieve reference products and aggregate category metrics for context
   */
  getRAGContext(categoryCode, rawAttributes = {}) {
    const category = this.getCategoryByCode(categoryCode) || this.getTaxonomy()[0];
    const categoryRefProducts = this.getReferenceProducts().filter(p => p.category_code === category.code);
    
    // Fallback to all reference products if none in exact category
    const refPool = categoryRefProducts.length > 0 ? categoryRefProducts : this.getReferenceProducts();

    // Aggregate default attributes across reference products
    const attributeDefaults = {};
    const attributeStats = {};

    category.typical_attributes.forEach(attrKey => {
      const values = [];
      refPool.forEach(prod => {
        if (prod.attributes && prod.attributes[attrKey]) {
          values.push(prod.attributes[attrKey].value);
        }
      });

      if (values.length > 0) {
        // Use most frequent value or first value as category default
        attributeDefaults[attrKey] = values[0];
        attributeStats[attrKey] = {
          sampleValues: values,
          count: values.length
        };
      }
    });

    return {
      category,
      referenceProducts: refPool,
      attributeDefaults,
      attributeStats,
      applicableRules: this.getRulesForCategory(category.category)
    };
  }

  getRulesForCategory(categoryName) {
    if (!categoryName) return this.getConsistencyRules();
    return this.getConsistencyRules().filter(r => 
      r.applies_to.toLowerCase() === categoryName.toLowerCase() ||
      categoryName.toLowerCase().includes(r.applies_to.toLowerCase())
    );
  }

  /**
   * Validate consistency rules on product attributes
   */
  validateAttributes(categoryName, attributes) {
    const rules = this.getRulesForCategory(categoryName);
    const violations = [];

    // Helper to get raw numeric/string value from attribute object or primitive
    const getVal = (key) => {
      const field = attributes[key];
      if (field === undefined || field === null) return null;
      const v = typeof field === 'object' ? field.value : field;
      if (v === 'unknown' || v === '' || v === null || v === undefined) return null;
      const num = parseFloat(v);
      return isNaN(num) ? v : num;
    };

    rules.forEach(rule => {
      const text = rule.rule.toLowerCase();

      // Rule 1: Fasteners - diameter_mm < length_mm
      if (text.includes('diameter_mm must be less than length_mm')) {
        const dia = getVal('diameter_mm');
        const len = getVal('length_mm');
        if (dia !== null && len !== null && typeof dia === 'number' && typeof len === 'number') {
          if (dia >= len) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'diameter_mm',
              message: `Diameter (${dia}mm) must be less than length (${len}mm) for standard fasteners.`
            });
          }
        }
      }

      // Rule 2: Bearings - outer_diameter_mm > bore_diameter_mm
      if (text.includes('outer_diameter_mm must be greater than bore_diameter_mm')) {
        const od = getVal('outer_diameter_mm');
        const id = getVal('bore_diameter_mm');
        if (od !== null && id !== null && typeof od === 'number' && typeof id === 'number') {
          if (od <= id) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'outer_diameter_mm',
              message: `Outer diameter (${od}mm) must be strictly greater than bore diameter (${id}mm).`
            });
          }
        }
      }

      // Rule 3: Motors - RPM correlation
      if (text.includes('rpm should correlate')) {
        const rpm = getVal('rpm');
        if (rpm !== null && typeof rpm === 'number') {
          // Check standard 50Hz motor synchronous ranges (3000, 1500, 1000, 750) with 15% slip margin
          const isValidRpm = (rpm > 650 && rpm < 1100) || (rpm > 1200 && rpm < 1650) || (rpm > 2500 && rpm < 3300);
          if (!isValidRpm && rpm > 0) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'rpm',
              message: `RPM value (${rpm}) deviates from standard AC induction motor pole ranges (e.g. ~1440 RPM for 4-pole, ~2880 RPM for 2-pole).`
            });
          }
        }
      }

      // Rule 4: Pumps - outlet_size_mm <= inlet_size_mm
      if (text.includes('outlet_size_mm is typically less than or equal to inlet_size_mm')) {
        const outlet = getVal('outlet_size_mm');
        const inlet = getVal('inlet_size_mm');
        if (outlet !== null && inlet !== null && typeof outlet === 'number' && typeof inlet === 'number') {
          if (outlet > inlet) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'outlet_size_mm',
              message: `Pump outlet size (${outlet}mm) exceeds inlet size (${inlet}mm). Inlet should be equal or larger.`
            });
          }
        }
      }

      // Rule 5: Valves - max_temp_c vs material
      if (text.includes('max_temp_c should be consistent with stated material')) {
        const temp = getVal('max_temp_c');
        const mat = (getVal('material') || '').toString().toLowerCase();
        if (temp !== null && typeof temp === 'number' && mat.includes('pvc')) {
          if (temp > 60) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'max_temp_c',
              message: `Max temperature (${temp}°C) exceeds safety rating for PVC material (max ~60°C).`
            });
          }
        }
      }
    });

    return violations;
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
