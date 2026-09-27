# PatchFlow — Agentic Debugging Workflow

> Built for the IBM Bob 2.0 Hackathon · January 2024

[![Built with IBM Bob 2.0](https://img.shields.io/badge/Built%20with-IBM%20Bob%202.0-7C7CFF)](https://ibm.com)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://typescriptlang.org)

## The Problem

Debugging is fragmented. When a bug is reported, a developer simultaneously searches logs, inspects code,
traces dependencies, and reads documentation — context-switching between tools and losing the evidence trail
at every step. There is no systematic structure, no parallel investigation, and no guaranteed connection
between the diagnosis and the fix.

## The Solution

**PatchFlow** transforms debugging from an ad-hoc, manual process into a structured agentic workflow:

```
INCIDENT → EVIDENCE → 4 PARALLEL INVESTIGATORS → ROOT CAUSE → REPRODUCTION → PATCH → REGRESSION TEST → VALIDATION → REPORT
```

Each stage is connected. Evidence informs investigation. Investigation confirms root cause.
Root cause drives the minimal patch. The patch is immediately validated against the root cause.
The entire chain is preserved in a final report.

## Why Debugging?

Debugging is the most context-intensive, evidence-heavy, and cognitively expensive part of software development.
It is also the workflow best suited to agentic decomposition:

- Multiple independent evidence sources (logs, code, tests, docs) that can be investigated in parallel
- A clear convergence requirement (root cause must be confirmed by all investigators)
- A well-defined success criterion (tests pass, bug reproduced and fixed)
- A documented output (the debugging report)

## How PatchFlow Works

### 1. Evidence Ingestion
Incident reports, production logs, API specifications, source code, and test suites are loaded and indexed.
Bob's document understanding ingests PDFs — `incident-report.pdf` and `api-spec.pdf` — and extracts
structured findings without manual copy-paste.

### 2. Parallel Investigation (4 Bob Subagents)
Instead of one AI conversation accumulating unrelated context, the debugging task is decomposed:

| Investigator | Focus | Bob Capability |
|---|---|---|
| Code Investigator | Trace execution paths, identify call ordering issues | Agent Mode |
| Log Investigator | Correlate log patterns, identify failure signatures | Agent Mode |
| Test Investigator | Analyze coverage gaps, identify missing regression tests | Agent Mode |
| Documentation Investigator | Extract spec rules, identify violations | Document Understanding |

The intended design is for these to run as **parallel tasks** in IBM Bob 2.0, each with a focused scope and no shared context.

> **Seeded demo data notice:** The four-investigator findings shown in the app (`src/data/investigators.ts`) are hand-authored static content that illustrates what each investigator would find. They are **not** the output of a live multi-agent run against the OrderFlow repo. See `BOB_WORKFLOW.md` for a full explanation of what was seeded vs. what ran live.

### 3. Root Cause Synthesis
Independent findings are cross-referenced into a single root cause explanation with an evidence chain.
Convergence across 4 independent investigators provides high-confidence identification.

### 4. Minimal Patch
The smallest change that fixes the root cause is generated and reviewed.
PatchFlow enforces: only affected files, zero unrelated changes, regression test required.

### 5. Validation
Automated gate checks: reproduction, regression tests, full test suite, build, API contract, lint.
Result: VERIFIED FIX or a clear failure state with actionable next steps.

## IBM Bob 2.0's Role

PatchFlow is **built inside Bob** and demonstrates Bob capabilities throughout:

- **Agent Mode:** Used for all multi-step development tasks and code generation in this project
- **Subagents / Parallel Tasks:** The investigation workflow is designed for four parallel Bob subagents (Code, Log, Test, Documentation). The findings in the demo are seeded data illustrating this pattern — not live subagent output.
- **Document Understanding:** The workflow shows how `incident-report.pdf` and `api-spec.pdf` would be ingested directly via Bob's document understanding capability
- **Persistent Project Context:** `AGENTS.md` maintains project context across Bob sessions

See `bob_sessions/` for task session evidence and `BOB_WORKFLOW.md` for the complete workflow, including a clear statement of what is seeded demo data vs. what ran live.

## The Demo Scenario: OrderFlow API

A small e-commerce order management API (Node.js + TypeScript + Express + SQLite).

**The bug:** When an order contains a discount coupon AND products subject to different
tax rates (e.g., GST 5% and GST 18%), the checkout total is incorrect.

**Root cause:** `calculateFinalTotal()` in `checkout.ts` calls `aggregateTaxByJurisdiction()`
with the undiscounted subtotal. The API specification (§4.3.1) requires the discount to be
applied *before* tax calculation. The error was introduced in commit `b7f3d9a` during a
tax pipeline refactor.

**The fix:** 3-line reorder — compute discount first, pass discounted subtotal to tax aggregation.

## How to Run Locally

```bash
# Prerequisites: Node.js 18+, npm 8+

# 1. Clone the repository
git clone https://github.com/your-username/patchflow
cd patchflow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# → http://localhost:5173

# 4. Run production build
npm run build
npm run preview
```

## How to Run the Debugging Demo

1. Open http://localhost:5173
2. Click **RUN THE DEBUGGING DEMO** on the landing page, OR
3. Navigate to `/dashboard` and click **Run Demo**
4. Watch the 9-phase workflow execute with realistic logs and animated progress
5. After completion, explore each stage: Investigation → Root Cause → Patch → Validation → Impact → Report

**Demo reset:** Click **Reset Demo** in the dashboard header — no page refresh required.

## Sample Project Tests

```bash
cd patchflow/sample-project
npm install
npm test
```

Tests document both the buggy behavior and the fixed behavior.
`tests/checkout.coupon-tax.spec.ts` contains the regression tests added as part of the patch.

## How Impact Is Measured

All impact figures are labeled **"Illustrative Demo Data"** and are not derived from controlled experiments.
They represent a configured demonstration workflow comparison stored in `src/data/impact.json`.
The UI calculates reduction percentages dynamically from `before`/`after` values in that file.

**No statistic is presented as a scientifically measured result.**

## Architecture

```
src/
├── components/         # AppShell, Sidebar, CommandPalette
├── context/            # AppContext (demo state, mode switching)
├── data/               # incidents.ts, investigators.ts, evidence.ts, rootCause.ts, patch.ts, validation.ts, impact.json
├── pages/              # Landing, Dashboard, Investigation, RootCause, PatchPage, Validation, Impact, Report, Evidence, Judge, Project
└── types/              # Shared TypeScript interfaces

sample-project/
├── src/services/       # checkout.ts (bug + fix), tax.ts, coupon.ts
├── src/models/         # LineItem.ts, Order.ts
└── tests/              # checkout.coupon-tax.spec.ts, fixtures/
```

### Service Interfaces

The architecture separates data from presentation:
- `AppContext` — Demo orchestration, mode switching (Demo / Bob Workspace)
- `src/data/` — Central data files; all pages consume these
- Pages are pure presentation components reading from `src/data/`

**Bob Workspace Mode** shows where real Bob-generated artifacts enter the application.
**Demo Mode** uses the deterministic data from `src/data/`.

## Limitations

- PatchFlow is a demonstration platform, not a production CI/CD system
- The sample project is fictional — no real company data
- Impact figures are illustrative, not scientifically validated
- Bob Workspace Mode reflects a real Bob workflow but requires the Bob IDE environment

## Future Integration Possibilities

- **watsonx Orchestrate:** Automate the investigation workflow end-to-end via orchestration
- **watsonx.ai:** Replace deterministic demo data with LLM-generated root cause analysis
- **GitHub/GitLab integration:** Connect to real repositories and pull requests
- **Slack/Teams notifications:** Alert on investigation completion and patch availability
- **CI/CD pipeline integration:** Trigger PatchFlow automatically on test failures or incident reports
