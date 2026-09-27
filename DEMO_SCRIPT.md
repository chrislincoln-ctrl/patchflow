# DEMO SCRIPT — PatchFlow Judge Demonstration
## IBM Bob 2.0 Hackathon — Timed to ~5 minutes

---

### 0:00 — 0:20 · Landing Page

**Open:** https://patchflow.vercel.app (or http://localhost:5173)

> "This is PatchFlow. Debugging is an investigation problem — and most developers treat it like a treasure hunt.
> They search logs, grep through code, read docs, and context-switch 11+ times before finding the cause.
> PatchFlow structures that as a workflow."

Point to the headline: **"DEBUG THE BUG. NOT THE ENTIRE CODEBASE."**

**Click:** RUN THE DEBUGGING DEMO

---

### 0:20 — 0:45 · Evidence Ingestion

**On screen:** Phase 01 — INGESTING EVIDENCE (animated logs stream)

> "The first thing PatchFlow does is ingest all available evidence — the incident report PDF,
> production logs from the last 4 days, the API specification PDF, source files, and the test suite.
> No copy-paste. IBM Bob 2.0's document understanding reads incident-report.pdf and api-spec.pdf directly."

Point to the log lines: `→ Ingesting incident-report.pdf ... ✓ Evidence ingestion complete`

---

### 0:45 — 1:15 · Parallel Investigation

**On screen:** Phase 02–03 — SPAWNING INVESTIGATORS + PARALLEL ANALYSIS

> "Instead of one AI conversation accumulating context from 40 different files, PatchFlow decomposes
> the task. Four IBM Bob subagents run in parallel — each with a focused scope."

Navigate to `/investigate` (or it auto-navigates):

- **Code Investigator:** "Traced the checkout execution path. Found that `calculateFinalTotal()`
  calls tax aggregation before applying the coupon discount."
- **Log Investigator:** "Analyzed 4,203 log entries. 100% failure rate when coupon + mixed tax rates.
  Zero failures otherwise."
- **Test Investigator:** "127 existing tests all pass — but there is no test for coupon + heterogeneous
  tax rates combined. That gap let the bug slip through."
- **Documentation Investigator:** "Read the API spec PDF. Section 4.3.1 explicitly states:
  discount before tax. Current code does the opposite."

> "Four independent investigators. No shared context. All converge on the same 3-line region."

---

### 1:15 — 1:35 · Root Cause

Navigate to `/root-cause`

> "High-confidence root cause: the checkout pipeline aggregates tax against the full undiscounted
> subtotal, then subtracts the coupon. The spec requires the reverse."

Point to the evidence chain: **INCIDENT → SYMPTOM → CODE PATH → BUSINESS RULE → ROOT CAUSE**

Click a "Why PatchFlow believes this" reason:

> "Log correlation is 100%. The commit that introduced this was deployed 27 minutes before
> the first failure appeared in logs. And the API spec has said this all along."

---

### 1:35 — 1:55 · Reproduction

**On screen:** Phase 05 — REPRODUCING FAILURE (demo logs)

> "PatchFlow reproduces the exact failing case: iPhone Case (5% GST) + USB-C Cable (18% GST) + COUPON10.
> Expected ₹1,214.51. Actual ₹1,227.00. Bug confirmed."

---

### 1:55 — 2:20 · Patch

Navigate to `/patch`

> "The minimal patch: 6 lines added, 3 removed, 2 files, zero unrelated changes.
> The fix reorders two function calls. That's it."

Show the diff — point to the green `+` lines:

> "`const discount = coupon ? computeDiscount(subtotal, coupon) : 0;` — moved up.
> `discountedSubtotal` is now passed to the tax aggregation function instead of the raw subtotal."

Show the regression test file:

> "A regression test is generated simultaneously: 4 test cases covering the exact interaction
> that caused the bug."

---

### 2:20 — 2:40 · Validation

Navigate to `/validation`

Watch checks animate in one by one:

> "Release-gate checks: reproduction passes, regression tests pass, all 131 tests pass,
> build clean, API contract unchanged, lint clean, unrelated behaviour unchanged."

Wait for the verdict: **VERIFIED FIX**

> "Not 'probably fixed.' Verified. Every gate passed. The investigation, patch, and validation
> are connected — you can trace from the incident report to the passing test."

---

### 2:40 — 3:00 · Impact

Navigate to `/impact`

> "These numbers are illustrative demo data — labeled as such. But they communicate the
> structural difference: the number of manual investigation steps went from 23 to 4,
> context switches from 11 to 2, and a regression test was added that never existed."

Point to the disclaimer:

> "We don't present invented statistics as real. The bar chart is from a configured
> demonstration workflow stored in impact.json."

**End on:** "From bug report to verified fix. That's PatchFlow."

---

### Optional: Judge Mode (bonus 30 seconds)

Navigate to `/judge`

> "For anyone who wants the condensed version — the Judge Mode shows the entire story
> from problem to measured impact in one grid. Each card corresponds to a real artifact
> in the repository."

---

## Key Points to Emphasize

1. **Not a chatbot** — a structured agentic workflow with stages, gates, and verified output
2. **Actually uses Bob** — Agent Mode, Subagents, Parallel Tasks, Document Understanding
3. **Evidence-based** — every claim traces to an artifact; no invented statistics
4. **Minimal patch** — the fix is the smallest change that solves the root cause
5. **Connected** — incident → evidence → investigation → root cause → patch → test → verified
