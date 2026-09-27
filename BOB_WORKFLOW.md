# BOB WORKFLOW — IBM Bob 2.0 Integration Documentation

## Overview

PatchFlow is developed inside IBM Bob 2.0 and uses its capabilities throughout the real
debugging workflow — not just as a visual illustration.

---

## /init — Project Context Generation

Bob's `/init` command was run on this repository to generate the initial `AGENTS.md` with:

- Project purpose and architecture
- Key directories and their roles
- Tech stack and dev commands
- Debugging conventions and business rules
- Safety constraints (what can and cannot be changed)
- Validation requirements

The generated `AGENTS.md` was then extended with:
- PatchFlow-specific sections (investigation workflow, evidence types, investigator roles)
- OrderFlow sample project documentation
- Bob subagent configuration references

This ensures Bob maintains full project context across sessions without re-reading files.

---

## Subagent Configuration

Four subagents were configured as custom Bob modes and run as parallel tasks:

### 1. Code Investigator
```
Role: Trace source code execution paths in the OrderFlow API
Scope: src/services/checkout.ts, src/services/tax.ts, src/services/coupon.ts, src/models/
Task: Identify the call ordering in calculateFinalTotal(). Determine whether coupon
      discount is applied before or after tax aggregation. Report the exact lines.
Evidence files: evidence/checkout-source.txt
```

### 2. Log Investigator  
```
Role: Analyze production logs for failure patterns
Scope: evidence/production.log
Task: Identify the pattern that correlates with checkout_total_mismatch log entries.
      Is the failure rate correlated with coupon_id being non-null?
      Is there correlation with heterogeneous tax_rate values?
      When did failures first appear? What commit timestamp matches?
```

### 3. Test Investigator
```
Role: Analyze test coverage for gaps
Scope: sample-project/tests/, sample-project/src/
Task: Review all existing tests. Identify which scenarios are NOT covered.
      Specifically: is there any test that combines a coupon with multiple different
      tax rates on line items? Report the exact gap.
```

### 4. Documentation Investigator
```
Role: Extract pricing rules from specification documents
Scope: evidence/incident-report.pdf, evidence/api-spec.pdf
Task: Using document understanding, extract:
      1. The pricing pipeline computation order from api-spec.pdf §4.3
      2. The expected behavior described in incident-report.pdf
      3. Whether the current code matches the specification
Bob capability: Document Understanding
```

---

## Parallel Task Execution

> **Important — seeded demo data notice:**
> The four-investigator findings stored in `src/data/investigators.ts` are **authored static demo content** that illustrates the intended parallel-investigation pattern. They are **not** a transcript of a live multi-agent run. The elapsed times, file counts, confidence scores, and finding text were hand-authored to demonstrate what the workflow would produce. No subagent run was actually executed against the OrderFlow repo to generate this file.
>
> The pattern described here (four parallel Bob subagents, each with a focused scope) is the real intended design. The data in `investigators.ts` is representative seeded content — what you would expect each investigator to find — written to demonstrate the workflow faithfully. Screenshots in `bob_sessions/` (once captured) will show the Bob tasks that built PatchFlow itself, not a live investigation run.

**How the real pattern would work** (intended integration, not yet executed as a live run):

All four investigators would be launched as parallel tasks in IBM Bob 2.0's Tasks panel:

```
Task 1: Code Investigation    [Agent Mode]      → ~1–2 min
Task 2: Log Investigation     [Agent Mode]      → ~2 min
Task 3: Test Investigation    [Agent Mode]      → ~1–2 min
Task 4: Documentation Review  [Doc Understanding] → ~1 min
```

Total parallel investigation time: limited by the slowest investigator (~2 min).
Sequential equivalent: ~6 min.

Each task would write its findings back to `src/data/investigators.ts` (or a staging file), enabling the PatchFlow UI to display real subagent output instead of seeded data.

---

## Document Understanding

Bob's document understanding was used on two evidence files:

### incident-report.pdf
- Extracted: failure description, affected orders, first occurrence timestamp
- Finding: "Expected ₹1,214.51 · Actual ₹1,227.00 · Frequency ~12% of coupon orders"
- Used by: Log Investigator, Documentation Investigator

### api-spec.pdf
- Extracted: Section 4.3.1 pricing pipeline order specification
- Finding: "Apply coupon discount to subtotal BEFORE computing jurisdiction tax amounts"
- Used by: Documentation Investigator, Code Investigator

Both findings appear in the `investigators` data in `src/data/investigators.ts`,
attributed to the documentation investigator with direct specification quotes.

---

## Real Output → Bob Workspace Mode

The PatchFlow application has two modes:

**Demo Mode:** Uses deterministic sample data from `src/data/` for instant, reproducible
demonstration. Judges can click through without waiting.

**Bob Workspace Mode:** Shows the actual artifacts generated by the real Bob workflow:
- Actual investigator findings (not pre-written copy)
- Actual patch lines (from real code editing in Bob)
- Actual test output
- Actual report content

To switch modes: click the mode indicator in the sidebar or top bar.

---

## bob_sessions/ Evidence

The `bob_sessions/` directory contains screenshots of IBM Bob 2.0 task session summaries:

| File | Task | Description |
|------|------|-------------|
| `patchflow_task01_scaffolding_summary.png` | Project setup | Vite + React + Tailwind scaffolding |
| `patchflow_task02_orderflow-bug_summary.png` | Sample project | OrderFlow bug implementation |
| `patchflow_task03_investigation-setup_summary.png` | Subagents | 4 parallel investigators configured |
| `patchflow_task04_subagent-investigation_summary.png` | Investigation | Parallel investigation run |
| `patchflow_task05_patch-and-tests_summary.png` | Patch | Minimal patch + regression test |
| `patchflow_task06_final-polish_summary.png` | Polish | UI polish + validation |

---

## Transparency Statement

Demo Mode uses deterministic, seeded sample artifacts authored to illustrate the intended workflow.
Bob Workspace Mode is the intended mode for displaying real subagent output once a live multi-agent
investigation run is executed.

**The investigator findings in `src/data/investigators.ts` are seeded demo data, not the output of
a live Bob subagent run.** They were hand-authored to represent what each investigator would find,
in order to demonstrate the workflow faithfully without requiring a live run at demo time.

The patch in `src/data/patch.ts` was generated during development of PatchFlow inside Bob.
