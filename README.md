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
STAGE 2 — RAG Enrichment Engine (Knowledge Base Reference Retrieval + Inference)
                        ↓
STAGE 3 — Engineering Validation (Consistency Rules Engine + Unit Normalization)
                        ↓
STAGE 4 — Human-In-The-Loop Approval & Governance (Review UI + Undo Stack)
                        ↓
[Commerce-Ready Catalog Feed (JSON / CSV / PIM Export)]
```

---

## 🌟 Key Upgrades & Features

1. **AI Product Data Quality Dashboard**:
   - Real-time derived scores for Overall Quality (0–100), Completeness %, Confidence %, Consistency %, Traceability %, and Human Approval progress.

2. **Field-Level Confidence Heatmap**:
   - WCAG 2.2 AA accessible color-coded badges (`High` = Emerald, `Medium` = Amber, `Low` = Rose) with text labels, icons, source attribution (`Extracted`, `RAG Inferred`, `Category Default`), and reasoning tooltips.

3. **Before / After Data Diff View**:
   - Step-by-step visual diff comparing Raw Input → Extracted → RAG Enriched → Validated → Human Approved with unit normalizations.

4. **Audit Trail & Traceability Timeline**:
   - Timestamped event log tracking field origins from intake to catalog export.

5. **Duplicate Product Detection**:
   - Similarity scoring against reference catalog (e.g. 94% match warning) with view and ignore options.

6. **Controlled Concurrency Batch Processing Queue**:
   - Controlled concurrency runner (Concurrency: 3) via `Promise.allSettled` with pause, resume, cancel, and throughput metrics.

7. **Batch CSV Catalog Importer**:
   - Modal importer for CSV catalog files with valid/invalid row detection.

8. **Security & AI Response Validation**:
   - Complete server-side isolation for Gemini credentials.
   - Helmet Content Security Policy (CSP) & explicit CORS allowlist.
   - SSRF protection guard (`server/utils/ssrfGuard.js`) for URL ingestion.
   - Prompt injection defense (`server/middleware/promptSanitizer.js`).
   - Zod AI response schema validation (`server/schemas/aiSchemas.js`) with 2 retries & exponential backoff.
   - Secrets scanner script (`npm run audit-secrets`).

9. **Automated Testing Suite**:
   - Vitest unit suite covering knowledge base services, unit normalizer, and consistency rules.
   - Supertest integration suite covering Express API routes.
   - GitHub Actions CI workflow (`.github/workflows/ci.yml`).

10. **WCAG 2.2 AA Accessibility & Motion Controls**:
    - Accessible ARIA tablist navigation with arrow-key roving focus.
    - Accessible icon buttons with explicit `aria-label`s.
    - `aria-live="polite"` toast notification system.
    - `@media (prefers-reduced-motion: reduce)` animation controls.

---

## 🛠️ Commands & Scripts

- **Run Dev Server**: `npm run dev:full`
- **Run Unit & Integration Tests**: `npm test`
- **Run Secrets Audit**: `npm run audit-secrets`
- **Build Production Assets**: `npm run build`

---

## ☁️ Deployment on Vercel

1. Push code to GitHub repository (`https://github.com/Suhani-Tyagi/SpecForge.git`).
2. Import project into Vercel.
3. Configure Environment Variable: `GEMINI_API_KEY`.
4. Deploy! Vercel handles Vite static assets and `/api` serverless routes cleanly via `vercel.json`.
