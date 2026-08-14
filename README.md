# ⚡ SpecForge — Enterprise AI Industrial Product Intelligence System

> **Competition-Ready Edition** — An AI-powered industrial product intelligence platform designed to transform fragmented, incomplete supplier product data into validated, commerce-ready product intelligence records with field-level traceability (`value`, `confidence`, `source`, `reasoning`).

---

## 🎯 Architecture & Conceptual Flow

SpecForge explicitly separates AI intelligence processing from human catalog governance:

```
[Fragmented Supplier Data (Text / Image / Spec Sheet / URL)]
                        ↓
STAGE 1 — AI Raw Extraction (Gemini 2.0 Flash Vision/Text)
                        ↓
STAGE 2 — RAG Enrichment Engine (Knowledge Base Retrieval & Inference)
                        ↓
STAGE 3 — Engineering Validation (Consistency Rules Engine + Unit Normalization)
                        ↓
STAGE 4 — Source Authority Conflict Resolution (Source Precedence Engine)
                        ↓
STAGE 5 — Commerce Readiness Gate Console (Completeness & Validation Check)
                        ↓
STAGE 6 — Human-In-The-Loop Approval & Governance (Review UI + Evidence Graph)
                        ↓
[Commerce-Ready Catalog Feed (JSON / CSV / PIM Export / Commerce Catalog)]
```

---

## 🌟 Key Features & Evaluator Enhancements

1. **Explainable AI & Evidence Graph**:
   - Every attribute contains `value`, `confidence`, `source`, `evidence`, `reasoning`, `transformation`, `validationStatus`.
   - Accessible **"Why this value?"** interaction opening an Evidence Drawer with concise justification snippets.

2. **Source Authority & Conflict Resolution Engine**:
   - Detects competing values across data sources.
   - Precedence: `Verified Database > Spec Sheet PDF > Supplier Text > RAG Inference > Category Baseline`.
   - Interactive Conflict Resolution UI (`Accept Recommendation`, `Choose Alternative`, `Edit Custom`, `Dismiss`).

3. **Commerce Readiness Gate Console**:
   - Computes derived compliance metrics: Completeness %, Confidence %, Consistency %, Traceability %, Normalization %, Validation %.
   - Clear status: `READY FOR CATALOG` or `NOT READY FOR CATALOG` with an explicit blocking issue checklist.

4. **Engineering Rules Validation Explorer**:
   - Interactive rules engine inspector displaying passed rules, warnings, and failures with input, severity, and recommended actions.

5. **Supplier Data Quality Scorecard**:
   - Visual progression: `Raw Supplier Payload` → `After Extraction` → `After RAG` → `After Validation` → `After Human Review`.

6. **Interactive Guided Demo Scenarios**:
   - 5 guided test scenarios for competition judges:
     1. Clean Product (Ball Bearing 6205)
     2. Missing Attributes (Sparse Motor)
     3. Conflicting Specifications (Fastener Conflict)
     4. Low Confidence Product (Raw Pump Fragment)
     5. Invalid Specification (Over-temperature PVC Valve)

7. **Pipeline Observability & Diagnostics**:
   - Real execution timing breakdown (Extraction ms, RAG ms, Validation ms, Conflict Check ms, Total ms).

8. **Automated Testing Suite (26 Tests)**:
   - Vitest unit suite covering knowledge base, unit normalizer, conflict resolver, and security guards.
   - Supertest integration suite covering Express API routes.
   - GitHub Actions CI workflow (`.github/workflows/ci.yml`).

9. **WCAG 2.2 AA Accessibility & Review Keyboard Shortcuts**:
   - Keyboard review shortcuts (`Enter` = approve, `E` = edit, `R` = reject) with `aria-live` announcements.
   - Roving focus, visible focus rings, ARIA landmarks, `aria-busy`, contrast controls, reduced motion support.

---

## 🛠️ Commands & Scripts

- **Run Dev Server**: `npm run dev:full`
- **Run Unit & Integration Tests**: `npm test`
- **Run Test Coverage Report**: `npm run test:coverage`
- **Run Secrets Audit**: `npm run audit-secrets`
- **Build Production Assets**: `npm run build`

---

## ☁️ Deployment on Vercel

1. Push code to GitHub repository (`https://github.com/Suhani-Tyagi/SpecForge.git`).
2. Import project into Vercel.
3. Configure Environment Variable: `GEMINI_API_KEY`.
4. Deploy! Vercel handles Vite static assets and `/api` serverless routes cleanly via `vercel.json`.
