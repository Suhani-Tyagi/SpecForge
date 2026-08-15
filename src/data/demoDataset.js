/**
 * Demo Dataset for SpecForge Competition Showcase
 * Contains realistic industrial products, messy inputs, conflicting supplier data,
 * supplier intelligence metrics, and scale benchmark data.
 */

export const DEMO_PRODUCTS = [
  {
    id: "PROD-MOTOR-01",
    sku: "SF-MTR-415V-5HP",
    name: "Industrial 3-Phase Induction Motor 5HP",
    category: "Electric Motors & Drives",
    categoryCode: "23-15-16",
    supplier: "ElectroDrive Corp",
    supplierId: "SUP-001",
    confidence: 0.98,
    riskScore: 12,
    riskLevel: "LOW",
    commerceStatus: "READY",
    lastUpdated: "2026-08-15 14:20",
    rawInput: "Industrial motor, 5 HP, 415V, 3 phase, 1440 RPM, IP55 protection class, IE3 efficiency, Cast Iron frame 112M.",
    attributes: {
      power: { value: "3.7 kW (5 HP)", confidence: 0.99, source: "Supplier PDF (pg 2)", status: "VERIFIED", normalized: "3.7 kW" },
      voltage: { value: "415 V", confidence: 0.98, source: "Supplier Spec Sheet", status: "VERIFIED", normalized: "415 V" },
      phase: { value: "3 Phase", confidence: 0.99, source: "Supplier PDF", status: "VERIFIED", normalized: "3 Phase" },
      speed: { value: "1440 RPM", confidence: 0.96, source: "Supplier PDF", status: "VERIFIED", normalized: "1440 RPM" },
      protectionClass: { value: "IP55", confidence: 0.97, source: "Nameplate Image", status: "VERIFIED", normalized: "IP55" },
      efficiencyClass: { value: "IE3 Premium", confidence: 0.95, source: "Product Catalog", status: "VERIFIED", normalized: "IE3" },
      frameMaterial: { value: "Cast Iron", confidence: 0.94, source: "Supplier PDF", status: "VERIFIED", normalized: "Cast Iron" },
      mountingType: { value: "B3 Foot Mounted", confidence: 0.92, source: "CAD Model Meta", status: "VERIFIED", normalized: "B3" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "PDF Technical Datasheet (DocID: ED-MTR-2026.pdf) parsed successfully" },
      { step: "AI Extraction", detail: "Gemini 2.0 Flash extracted 8 spec key-values with 98% mean confidence" },
      { step: "RAG Enrichment", detail: "Matched against Category 23-15-16 schema. Standard nominal voltage verified." },
      { step: "Engineering Rules", detail: "Passed rule EV-001 (Motor 5HP matching 3.7kW standard rating)." },
      { step: "Source Authority", detail: "Supplier PDF authoritative hierarchy confirmed over text description." }
    ],
    commerceReadiness: {
      completeness: 100,
      confidence: 98,
      consistency: 100,
      traceability: 100,
      blockingIssues: []
    }
  },
  {
    id: "PROD-MOTOR-02",
    sku: "SF-MTR-415V-CONFL",
    name: "Heavy-Duty Industrial Motor (Conflicting Specs)",
    category: "Electric Motors & Drives",
    categoryCode: "23-15-16",
    supplier: "Global Power Supplies",
    supplierId: "SUP-002",
    confidence: 0.81,
    riskScore: 68,
    riskLevel: "HIGH",
    commerceStatus: "BLOCKED",
    lastUpdated: "2026-08-15 15:45",
    rawInput: "Source A (PDF): 5 HP, 415 V, 1440 RPM, IP55. Source B (Portal Text): 5 HP, 380 V, 1450 RPM, IP54.",
    attributes: {
      power: { value: "3.7 kW (5 HP)", confidence: 0.98, source: "PDF & Portal Text", status: "VERIFIED", normalized: "3.7 kW" },
      voltage: { value: "415 V (Source A) vs 380 V (Source B)", confidence: 0.65, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "415 V (Selected by Authority)" },
      phase: { value: "3 Phase", confidence: 0.95, source: "Supplier PDF", status: "VERIFIED", normalized: "3 Phase" },
      speed: { value: "1440 RPM (PDF) vs 1450 RPM (Text)", confidence: 0.72, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "1440 RPM" },
      protectionClass: { value: "IP55 (PDF) vs IP54 (Text)", confidence: 0.70, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "IP55" },
      efficiencyClass: { value: "IE2 Standard", confidence: 0.88, source: "Supplier Catalog", status: "VERIFIED", normalized: "IE2" }
    },
    conflicts: [
      { field: "voltage", sourceA: "415 V (Technical Datasheet)", sourceB: "380 V (Web Description)", resolution: "Datasheet preferred via Source Authority rule SA-02", status: "NEEDS_HUMAN_CONFIRMATION" },
      { field: "speed", sourceA: "1440 RPM at 50Hz", sourceB: "1450 RPM at 50Hz", resolution: "Standard slip speed 1440 RPM selected", status: "RESOLVED_AUTO" },
      { field: "protectionClass", sourceA: "IP55 (Dust & Hose Water)", sourceB: "IP54 (Splash Water)", resolution: "Datasheet IP55 selected", status: "NEEDS_HUMAN_CONFIRMATION" }
    ],
    evidence: [
      { step: "Source Ingestion", detail: "Dual inputs ingested: PDF Datasheet + Distributor Web API snippet" },
      { step: "AI Extraction", detail: "Gemini detected conflicting specs between Datasheet and API text" },
      { step: "Conflict Resolution", detail: "Conflict Engine triggered rule SA-02: Technical Datasheet overrides Web API text" },
      { step: "HITL Routing", detail: "Flagged for Human Review queue due to primary voltage discrepancy" }
    ],
    commerceReadiness: {
      completeness: 88,
      confidence: 81,
      consistency: 60,
      traceability: 95,
      blockingIssues: [
        "Unconfirmed primary voltage discrepancy between Datasheet (415V) and Distributor API (380V)",
        "Protection rating requires human sign-off (IP55 vs IP54)"
      ]
    }
  },
  {
    id: "PROD-PUMP-01",
    sku: "SF-PMP-CENT-750W",
    name: "High-Pressure Centrifugal Chemical Pump",
    category: "Pumps & Fluid Handling",
    categoryCode: "24-10-12",
    supplier: "FluidTech Systems",
    supplierId: "SUP-003",
    confidence: 0.74,
    riskScore: 78,
    riskLevel: "HIGH",
    commerceStatus: "BLOCKED",
    lastUpdated: "2026-08-15 16:10",
    rawInput: "Centrifugal pump 1.0 HP, 2900 RPM, max head 35m, flow rate 120 L/min, SS316 casing. Operating temp missing.",
    attributes: {
      power: { value: "0.75 kW (1.0 HP)", confidence: 0.95, source: "Supplier Spec Text", status: "VERIFIED", normalized: "0.75 kW" },
      maxHead: { value: "35 m", confidence: 0.92, source: "Supplier PDF", status: "VERIFIED", normalized: "35 m" },
      flowRate: { value: "120 L/min (7.2 m³/h)", confidence: 0.90, source: "Supplier PDF", status: "VERIFIED", normalized: "7.2 m³/h" },
      material: { value: "SS316 Stainless Steel", confidence: 0.94, source: "Material Spec Sheet", status: "VERIFIED", normalized: "SS316" },
      maxTemp: { value: "MISSING", confidence: 0.00, source: "N/A", status: "MISSING", normalized: "MISSING" },
      inletDiameter: { value: "DN40 (1.5 inch)", confidence: 0.85, source: "Dimension Drawing", status: "VERIFIED", normalized: "DN40" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "Supplier text datasheet ingested" },
      { step: "RAG Schema Check", detail: "Category 24-10-12 mandates Operating Temperature for Chemical Pump safety compliance" },
      { step: "Validation Rule EV-104", detail: "FAILED: Critical required attribute 'maxTemp' is unpopulated" }
    ],
    commerceReadiness: {
      completeness: 75,
      confidence: 74,
      consistency: 90,
      traceability: 85,
      blockingIssues: [
        "Missing required safety attribute: Maximum Operating Temperature (maxTemp)",
        "Extraction confidence below 75% threshold for chemical fluid pumps"
      ]
    }
  },
  {
    id: "PROD-TX-01",
    sku: "SF-TX-PRESS-420",
    name: "Smart Digital Pressure Transmitter 4-20mA",
    category: "Sensors & Instrumentation",
    categoryCode: "18-12-05",
    supplier: "ElectroDrive Corp",
    supplierId: "SUP-001",
    confidence: 0.99,
    riskScore: 8,
    riskLevel: "LOW",
    commerceStatus: "READY",
    lastUpdated: "2026-08-15 16:30",
    rawInput: "HART Pressure Transmitter, range 0-100 bar, 4-20mA output, 24VDC supply, process connection G1/2 male, ATEX certified Zone 1.",
    attributes: {
      pressureRange: { value: "0 - 100 bar", confidence: 0.99, source: "ATEX Certificate & Datasheet", status: "VERIFIED", normalized: "0-100 bar" },
      outputSignal: { value: "4-20 mA HART", confidence: 0.99, source: "Datasheet pg 1", status: "VERIFIED", normalized: "4-20 mA HART" },
      supplyVoltage: { value: "24 V DC (12-36V)", confidence: 0.98, source: "Datasheet pg 1", status: "VERIFIED", normalized: "24 VDC" },
      processConnection: { value: "G 1/2 Male", confidence: 0.97, source: "CAD Model", status: "VERIFIED", normalized: "G 1/2 A" },
      certification: { value: "ATEX II 2G Ex db IIC T6 Gb", confidence: 0.99, source: "ATEX Cert 2026", status: "VERIFIED", normalized: "ATEX Zone 1" },
      ingressProtection: { value: "IP67 / IP68", confidence: 0.98, source: "Datasheet pg 4", status: "VERIFIED", normalized: "IP68" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "Multimodal ingestion: Datasheet PDF + ATEX Certification Doc" },
      { step: "RAG Enrichment", detail: "HART protocol standard matched with IEC 61158 taxonomy" },
      { step: "Engineering Rules", detail: "All required instrument specifications fully validated" }
    ],
    commerceReadiness: {
      completeness: 100,
      confidence: 99,
      consistency: 100,
      traceability: 100,
      blockingIssues: []
    }
  },
  {
    id: "PROD-VALVE-01",
    sku: "SF-VLV-BALL-2IN",
    name: "Pneumatic Actuated Ball Valve 2-Inch",
    category: "Valves & Actuators",
    categoryCode: "21-04-10",
    supplier: "Apex Industrial Valve Co",
    supplierId: "SUP-004",
    confidence: 0.62,
    riskScore: 84,
    riskLevel: "CRITICAL",
    commerceStatus: "BLOCKED",
    lastUpdated: "2026-08-15 17:00",
    rawInput: "2\" Ball Valve, 600 PSI pressure rating, Teflon seat, Pneumatic double acting actuator 5 bar air supply.",
    attributes: {
      size: { value: "2 inch (DN50)", confidence: 0.92, source: "Supplier Text", status: "VERIFIED", normalized: "DN50" },
      pressureRating: { value: "600 PSI (PN40)", confidence: 0.85, source: "Supplier Text", status: "VERIFIED", normalized: "41.3 bar" },
      seatMaterial: { value: "PTFE (Teflon)", confidence: 0.90, source: "Supplier Text", status: "VERIFIED", normalized: "PTFE" },
      actuatorType: { value: "Pneumatic Double Acting", confidence: 0.88, source: "Supplier Text", status: "VERIFIED", normalized: "Pneumatic DA" },
      bodyMaterial: { value: "UNSPECIFIED STAINLESS", confidence: 0.45, source: "AI Inference", status: "LOW_CONFIDENCE", normalized: "Unknown Grade" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "Low-resolution scanned catalog sheet ingested" },
      { step: "AI Extraction", detail: "Material grade unreadable; low confidence (45%) on body material" },
      { step: "Validation Failure", detail: "Valve body grade required for pressure vessel safety verification" }
    ],
    commerceReadiness: {
      completeness: 70,
      confidence: 62,
      consistency: 80,
      traceability: 60,
      blockingIssues: [
        "Unclear body material specification (Inferred with low confidence 45%)",
        "Missing pressure vessel test certification documentation"
      ]
    }
  }
];

export const SUPPLIER_METRICS = [
  {
    id: "SUP-001",
    name: "ElectroDrive Corp",
    category: "Electric Motors & Sensors",
    qualityScore: 94,
    completeness: 97,
    consistency: 96,
    conflictRate: 3,
    traceability: 98,
    productCount: 1420,
    reviewBurden: "Low (4%)",
    reliabilityIndex: "A+ (Tier 1 Certified)",
    status: "PREFERRED"
  },
  {
    id: "SUP-002",
    name: "Global Power Supplies",
    category: "Heavy Drives & Transformers",
    qualityScore: 81,
    completeness: 84,
    consistency: 78,
    conflictRate: 12,
    traceability: 89,
    productCount: 850,
    reviewBurden: "Medium (18%)",
    reliabilityIndex: "B+ (Standard)",
    status: "ACTIVE"
  },
  {
    id: "SUP-003",
    name: "FluidTech Systems",
    category: "Pumps & Compressors",
    qualityScore: 76,
    completeness: 79,
    consistency: 82,
    conflictRate: 15,
    traceability: 80,
    productCount: 620,
    reviewBurden: "High (24%)",
    reliabilityIndex: "B- (Requires Review)",
    status: "UNDER_AUDIT"
  },
  {
    id: "SUP-004",
    name: "Apex Industrial Valve Co",
    category: "Valves & Flow Controls",
    qualityScore: 68,
    completeness: 71,
    consistency: 65,
    conflictRate: 24,
    traceability: 72,
    productCount: 490,
    reviewBurden: "Critical (36%)",
    reliabilityIndex: "C (High Error Rate)",
    status: "HIGH_RISK"
  }
];

export const SCALE_BENCHMARKS = {
  100: {
    products: 100,
    aiApproved: 88,
    humanReview: 9,
    blocked: 3,
    workloadHoursSaved: 42,
    processingTimeMinutes: 1.4,
    accuracyRate: 99.2,
    costPerProduct: "$0.08"
  },
  1000: {
    products: 1000,
    aiApproved: 875,
    humanReview: 95,
    blocked: 30,
    workloadHoursSaved: 420,
    processingTimeMinutes: 12.5,
    accuracyRate: 99.1,
    costPerProduct: "$0.06"
  },
  10000: {
    products: 10000,
    aiApproved: 8820,
    humanReview: 910,
    blocked: 270,
    workloadHoursSaved: 4250,
    processingTimeMinutes: 98.0,
    accuracyRate: 99.4,
    costPerProduct: "$0.04"
  },
  100000: {
    products: 100000,
    aiApproved: 88900,
    humanReview: 8900,
    blocked: 2200,
    workloadHoursSaved: 43100,
    processingTimeMinutes: 840.0,
    accuracyRate: 99.5,
    costPerProduct: "$0.02"
  }
};
