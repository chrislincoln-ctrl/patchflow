# AGENTS.md — PatchFlow Project Context

> Generated via Bob /init and extended for the IBM Bob 2.0 hackathon.
> Last updated: 2024-01-22

## Project Purpose

PatchFlow is a production-quality developer productivity platform demonstrating
agentic debugging workflows built around IBM Bob 2.0.

**Challenge:** IBM Bob 2.0 Hackathon — "Improve a specific developer workflow"
**Workflow selected:** Debugging
**Demo scenario:** OrderFlow API — Coupon + multi-tax checkout total mismatch (INC-2024-0847)

---

## Architecture

```
patchflow/
├── src/                        # React + TypeScript frontend
│   ├── components/             # AppShell, Sidebar, CommandPalette
│   ├── context/                # AppContext — demo state, workspace mode
│   ├── data/                   # All demo data (incidents, investigators, evidence, etc.)
│   ├── pages/                  # Landing, Dashboard, Investigation, RootCause, Patch, Validation, Impact, Report
│   └── types/                  # Shared TypeScript types
├── sample-project/             # OrderFlow API — the debugging target
│   ├── src/services/           # checkout.ts (BUG), tax.ts, coupon.ts
│   ├── src/models/             # LineItem, Order, TaxRule, Coupon
│   └── tests/                  # checkout.coupon-tax.spec.ts + fixtures
├── evidence/                   # incident-report.txt, production.log, api-spec.txt
├── scripts/                    # reproduce.ts, validate.sh
├── reports/                    # Generated investigation reports
├── bob_sessions/               # Required: IBM Bob task session screenshots
├── AGENTS.md                   # This file
├── README.md                   # Project documentation
├── DEMO_SCRIPT.md              # 5-minute judge demonstration script
└── BOB_WORKFLOW.md             # IBM Bob 2.0 workflow documentation
```

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Charts:** Recharts
- **Routing:** React Router v6
- **Sample API:** Node.js + TypeScript (Vitest tests)

## Key Directories

| Directory | Purpose |
|-----------|---------|
| `src/data/` | Central data store — all pages consume this |
| `src/pages/` | One file per route |
| `src/context/AppContext.tsx` | Demo orchestration + mode switching |
| `sample-project/src/services/checkout.ts` | The bug location |
| `evidence/` | Evidence artifacts for investigation |
| `bob_sessions/` | Bob task session evidence (screenshots) |

## Dev Commands

```bash
# PatchFlow web app
cd patchflow
npm install
npm run dev          # Development server — http://localhost:5173
npm run build        # Production build
npm run preview      # Preview production build

# Sample project (OrderFlow API)
cd patchflow/sample-project
npm install
npm test             # Run vitest tests
npm run reproduce    # Reproduce the checkout bug
npm run typecheck    # TypeScript check
```

## Data Model

### Investigation Workflow
```
Incident → Evidence (5 sources) → Investigators (4 parallel) → RootCause → Patch → Validation → Report
```

### Evidence Types
- `pdf` — incident-report.pdf, api-spec.pdf
- `log` — production.log
- `code` — checkout.ts, tax.ts, coupon.ts
- `test` — checkout.test.ts

### Investigator Roles
- `code` — Source code tracing
- `log` — Log pattern analysis
- `test` — Coverage gap identification
- `documentation` — Spec and doc review

## Business Rules

- Coupon discount MUST be applied to subtotal BEFORE tax calculation (API spec §4.3.1)
- Multi-jurisdiction tax: each jurisdiction calculated independently on proportional discounted base
- Patch must touch minimum files; zero unrelated file changes

## Debugging Conventions

- Primary bug: `sample-project/src/services/checkout.ts` lines 24–30
- Evidence chain: incident → log correlation → code path → spec violation → root cause
- Confidence system: qualitative (High/Medium/Low), evidence-based, not numeric AI percentages

## Safety Constraints

- Never modify tax rates or jurisdiction codes
- Patch must not change API response schema
- All existing tests must continue to pass after patch
- Only `checkout.ts` and `tax.ts` are allowed to change

## Validation Requirements

Before any patch is accepted:
1. Original reproduction case passes (expected output matches)
2. New regression tests pass
3. All 127 existing tests pass
4. TypeScript compilation clean
5. Build succeeds
6. API contract unchanged
7. Zero unrelated behaviour changes

## IBM Bob 2.0 Integration

This project is designed to be opened inside IBM Bob 2.0's IDE.

**Subagents configured:**
- `code-investigator` — Traces checkout execution path, identifies call ordering
- `log-investigator` — Analyzes production.log for failure patterns
- `test-investigator` — Reviews test coverage, identifies gaps
- `documentation-investigator` — Parses api-spec.pdf and incident-report.pdf

**Document understanding targets:**
- `evidence/incident-report.pdf` — Parsed for failure description, affected orders
- `evidence/api-spec.pdf` — Parsed for pricing pipeline specification §4.3.1

See `bob_sessions/` for actual task session evidence and `BOB_WORKFLOW.md` for the complete workflow.
