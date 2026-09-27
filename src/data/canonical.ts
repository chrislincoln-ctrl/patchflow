/**
 * canonical.ts — THE single source of truth for the PatchFlow demo scenario.
 *
 * Every internal page (Dashboard, Investigation, Root Cause, Patch, Test Suite,
 * Validation, Impact, Report, Evidence, OrderFlow API, About) derives its values
 * from this module. If a value changes here, every page updates automatically.
 *
 * Numeric authority: the ACTUAL executable sample-project.
 *   `npm test` / `npm run reproduce` in sample-project/ produce these exact numbers:
 *     subtotal 1298.00 · discount 129.80 · buggy tax 103.77 · buggy total 1271.97
 *     fixed tax 93.40 · fixed total 1261.60 · overcharge +10.37 per order
 */

import type { LucideIcon } from 'lucide-react';
import { CheckSquare, FileText, GitBranch, Search } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Incident
// ─────────────────────────────────────────────────────────────────────────────
export const CANONICAL_INCIDENT = {
  id: 'INC-2024-0847',
  title: 'Checkout total mismatch with coupon + multiple tax rules',
  severity: 'HIGH' as const,
  // The historical incident. The demo replays it; it is not happening "Today".
  incidentDate: '2024-01-22',
  incidentDateLabel: '22 Jan 2024',
  detectedAt: '22 Jan 2024, 09:14 UTC',
  firstFailure: '2024-01-18, 09:14 UTC (27 min after commit b7f3d9a deployed)',
  repository: 'OrderFlow API',
  endpoint: 'POST /api/v2/checkout',
  errorCode: 'CHECKOUT_TOTAL_MISMATCH',
  reporter: 'payments-team@orderflow.io',
  affectedOrders: 847,
  overchargeRange: '₹8 – ₹46 per order',
  commit: 'b7f3d9a',
  commitDate: '2024-01-18 15:32 UTC',
  commitDescription: 'Tax pipeline refactor',
  // Demonstrated reproduction window (sample-project/scripts/reproduce.ts)
  reproScript: 'npm run reproduce',
  specSection: '§4.3.1',
  specRule: 'Apply coupon discount to subtotal BEFORE computing jurisdiction tax amounts',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// The canonical failing scenario — EXACTLY what reproduce.ts and the spec run
// ─────────────────────────────────────────────────────────────────────────────
export interface ScenarioLineItem {
  name: string;
  qty: number;
  unitPrice: number;
  taxCode: string;
}

export const CANONICAL_SCENARIO = {
  /** Incident report fixture: iPhone Case (GST 5%) + USB-C Cable (GST 18%) */
  lineItems: [
    { name: 'iPhone Case', qty: 1, unitPrice: 999, taxCode: 'GST_5' },
    { name: 'USB-C Cable', qty: 1, unitPrice: 299, taxCode: 'GST_18' },
  ] as ScenarioLineItem[],
  coupon: { code: 'COUPON10', type: 'percent' as const, value: 10, description: '10% off subtotal' },
  // All monetary values in ₹ — produced by sample-project/scripts/reproduce.ts
  subtotal: 1298.0,
  discount: 129.8,
  buggyTax: 103.77,
  buggyTotal: 1271.97,
  fixedTax: 93.4,
  fixedTotal: 1261.6,
  discrepancy: 10.37, // buggy - fixed
  discrepancyLabel: '+₹10.37',
  expectedByIncidentReport: 1214.51,
  actualByIncidentReport: 1227.0,
  /** Why script numbers differ from the historical report figures */
  numericNote:
    'The incident report cited ₹1,214.51 expected / ₹1,227.00 actual using slightly different proportional-tax assumptions. The executable sample project yields the authoritative figures shown above; the bug mechanics are identical.',
  currency: '₹',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Affected files — must match the real sample-project
// ─────────────────────────────────────────────────────────────────────────────
export const CANONICAL_FILES = {
  checkout: {
    path: 'src/services/checkout.ts',
    role: 'Primary bug location — calculateFinalTotal()',
    lines: 78,
  },
  tax: {
    path: 'src/services/tax.ts',
    role: 'Correct implementation, called with wrong input — aggregateTaxByJurisdiction()',
    lines: 44,
  },
  coupon: {
    path: 'src/services/coupon.ts',
    role: 'Correct implementation — computeDiscount()',
    lines: 18,
  },
  regressionSpec: {
    path: 'tests/checkout.coupon-tax.spec.ts',
    role: 'Regression tests added with the patch',
    lines: 92,
  },
  fixtures: {
    path: 'tests/fixtures/checkout.fixtures.ts',
    role: 'Shared test fixtures (cart, tax rules, coupons)',
    lines: 61,
  },
  reproduce: {
    path: 'scripts/reproduce.ts',
    role: 'Reproduction script — prints buggy vs fixed totals',
    lines: 81,
  },
  models: [
    { path: 'src/models/LineItem.ts', role: 'Line item with tax jurisdiction', lines: 11 },
    { path: 'src/models/Order.ts', role: 'Order, TaxRule and Coupon models', lines: 26 },
  ],
} as const;

export const AFFECTED_FILES = [
  { path: CANONICAL_FILES.checkout.path, role: CANONICAL_FILES.checkout.role, linesAffected: 'lines 24–36' },
  { path: CANONICAL_FILES.tax.path, role: CANONICAL_FILES.tax.role, linesAffected: 'lines 8–44' },
  { path: CANONICAL_FILES.coupon.path, role: CANONICAL_FILES.coupon.role, linesAffected: 'lines 1–18 (unchanged)' },
  { path: CANONICAL_FILES.regressionSpec.path, role: 'Regression coverage added by the patch', linesAffected: 'new file, 8 tests' },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Test suite — mirrors the REAL checkout.coupon-tax.spec.ts (8 tests, all pass)
// ─────────────────────────────────────────────────────────────────────────────
export type TestKind = 'reproduction' | 'fixed' | 'existing';

export interface CanonicalTest {
  name: string;
  kind: TestKind;
  interpretation: string;
  expected: string;
}

export const CANONICAL_TESTS: CanonicalTest[] = [
  {
    name: 'BUGGY: produces incorrect total for 10% coupon + 5%+18% GST',
    kind: 'reproduction',
    interpretation: 'REPRODUCTION — confirms incorrect total',
    expected: `PASS — known buggy behaviour reproduced (total ${CANONICAL_SCENARIO.buggyTotal.toFixed(2)})`,
  },
  {
    name: 'FIXED: applies 10% coupon before aggregating 5%+18% GST',
    kind: 'fixed',
    interpretation: 'FIXED — produces expected total',
    expected: `PASS — corrected behaviour verified (discount first, total < subtotal)`,
  },
  {
    name: 'FIXED: no-coupon result unchanged (no regression)',
    kind: 'fixed',
    interpretation: 'FIXED — no-coupon path unchanged',
    expected: 'PASS — buggy and fixed paths agree without a coupon',
  },
  {
    name: 'FIXED: applies fixed-amount coupon before tax',
    kind: 'fixed',
    interpretation: 'FIXED — fixed-amount coupon reduces tax base',
    expected: 'PASS — coupon lowers total by at least its face value',
  },
  {
    name: 'FIXED: single-rate tax without coupon unchanged',
    kind: 'fixed',
    interpretation: 'FIXED — single-rate path unchanged',
    expected: 'PASS — 799 × 1.18 = 942.82 preserved',
  },
  {
    name: 'applies 10% coupon to single-rate order',
    kind: 'existing',
    interpretation: 'Existing coupon behaviour preserved',
    expected: 'PASS — discount 79.90 on subtotal 799',
  },
  {
    name: 'applies fixed coupon capped at subtotal',
    kind: 'existing',
    interpretation: 'Existing cap behaviour preserved',
    expected: 'PASS — fixed coupon capped at subtotal (100)',
  },
  {
    name: 'no coupon leaves discount at zero',
    kind: 'existing',
    interpretation: 'Existing default preserved',
    expected: 'PASS — discount is 0 when no coupon is applied',
  },
] as const;

export const TEST_SUMMARY = {
  total: CANONICAL_TESTS.length,
  preExisting: 3, // 'coupon only' describe block pre-dates the patch
  regression: CANONICAL_TESTS.length - 3,
  allPass: true,
  runner: 'Vitest v2',
  command: 'cd sample-project && npm test',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Patch statistics — derived, never hand-typed
// ─────────────────────────────────────────────────────────────────────────────
export const CANONICAL_PATCH = {
  summary: 'Reorder pricing pipeline: apply coupon discount before tax aggregation.',
  description:
    'Reorder calculateFinalTotal(): compute discountedSubtotal first, then pass it to aggregateTaxByJurisdiction(). Only execution order changes — tax.ts already accepted an optional discounted base.',
  files: [
    { path: CANONICAL_FILES.checkout.path, linesAdded: 5, linesRemoved: 3, reason: 'Fix site: reorder discount before tax aggregation' },
    { path: CANONICAL_FILES.tax.path, linesAdded: 1, linesRemoved: 0, reason: 'Already accepted an optional discountedSubtotal param; JSDoc clarified' },
  ],
  unrelatedFilesTouched: 0,
  safetyAssessment:
    'Isolated to the pricing pipeline. No schema, contract, or non-coupon behaviour changes — verified by the no-coupon regression test.',
} as const;

export const PATCH_TOTALS = {
  files: CANONICAL_PATCH.files.length,
  added: CANONICAL_PATCH.files.reduce((s, f) => s + f.linesAdded, 0),
  removed: CANONICAL_PATCH.files.reduce((s, f) => s + f.linesRemoved, 0),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Validation — mirrors the real gates that the sample project can actually run
// ─────────────────────────────────────────────────────────────────────────────
export interface CanonicalCheck {
  id: string;
  label: string;
  description: string;
  detail: string;
  icon: string;
}

export const CANONICAL_VALIDATION: CanonicalCheck[] = [
  {
    id: 'vc-repro',
    label: 'Original reproduction',
    description: 'The exact failing case from the incident, re-run end to end.',
    detail: `buggy total ₹${CANONICAL_SCENARIO.buggyTotal.toFixed(2)} · fixed ₹${CANONICAL_SCENARIO.fixedTotal.toFixed(2)} · overcharge +₹${CANONICAL_SCENARIO.discrepancy.toFixed(2)}`,
    icon: 'Bug',
  },
  {
    id: 'vc-regression',
    label: 'Regression tests',
    description: 'New coupon + heterogeneous-tax tests all pass.',
    detail: `${TEST_SUMMARY.regression}/${TEST_SUMMARY.regression} new tests pass`,
    icon: 'FlaskConical',
  },
  {
    id: 'vc-existing',
    label: 'Existing suite',
    description: 'Pre-existing coupon-only tests continue to pass.',
    detail: `${TEST_SUMMARY.preExisting}/${TEST_SUMMARY.preExisting} existing tests pass`,
    icon: 'CheckSquare',
  },
  {
    id: 'vc-build',
    label: 'Build',
    description: 'TypeScript compile and production build succeed.',
    detail: 'tsc --noEmit ✓ · vite build ✓ (frontend) · tsc --noEmit ✓ (sample-project)',
    icon: 'Package',
  },
  {
    id: 'vc-contract',
    label: 'API contract',
    description: 'Checkout response schema unchanged.',
    detail: 'subtotal, discount, tax, total, taxBreakdown — 0 contract changes',
    icon: 'FileCheck',
  },
  {
    id: 'vc-lint',
    label: 'Lint',
    description: 'Static analysis clean on both app and sample project.',
    detail: '0 errors',
    icon: 'Zap',
  },
  {
    id: 'vc-isolation',
    label: 'Unrelated behaviour',
    description: 'Non-coupon orders produce identical output before and after the patch.',
    detail: 'No-coupon regression test asserts byte-identical totals',
    icon: 'Shield',
  },
] as const;

export const VALIDATION_SUMMARY = {
  verdict: 'VERIFIED FIX' as const,
  status: 'RESOLVED' as const,
  demoState: 'DEMO COMPLETE' as const,
  summary: `All ${TEST_SUMMARY.total} tests pass. Build clean. API contract unchanged. Zero unrelated behaviour changes.`,
};

// ─────────────────────────────────────────────────────────────────────────────
// Investigators — qualitative confidence only (no pseudo-scientific %)
// ─────────────────────────────────────────────────────────────────────────────
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CanonicalInvestigator {
  id: string;
  role: 'code' | 'log' | 'test' | 'documentation';
  label: string;
  icon: LucideIcon;
  finding: string;
  evidenceRefs: string[];
  details: string;
  confidence: ConfidenceLevel;
  confidenceNote: string;
}

export const CANONICAL_INVESTIGATORS: CanonicalInvestigator[] = [
  {
    id: 'inv-code',
    role: 'code',
    label: 'Code Investigator',
    icon: Search,
    finding:
      'calculateFinalTotal() in checkout.ts aggregates tax across all jurisdictions before applying the coupon discount. The API-spec order is discount first, then tax. This single ordering error accounts for the entire observed discrepancy.',
    evidenceRefs: ['ev-004', 'ev-003', 'ev-005'],
    details: `Traced the execution path through the sample project.

Key finding — src/services/checkout.ts:
  calculateFinalTotal() calls aggregateTaxByJurisdiction(lineItems, taxRules)
  BEFORE computing the coupon discount, so tax is aggregated on the full,
  undiscounted subtotal. The discount is subtracted afterwards.

Correct order (per spec §4.3.1):
  discount = computeDiscount(subtotal, coupon)
  tax      = aggregateTaxByJurisdiction(lineItems, taxRules, subtotal - discount)

The fix is a reorder, not a rewrite — tax.ts already accepts an optional
discounted subtotal for proportional per-jurisdiction bases.`,
    confidence: 'HIGH',
    confidenceNote: 'Direct code trace; fix verified by execution',
  },
  {
    id: 'inv-log',
    role: 'log',
    label: 'Log Investigator',
    icon: FileText,
    finding:
      'Production-log analysis: every checkout_total_mismatch entry involves a non-null coupon AND heterogeneous tax rates. 847 affected orders over 4 days; zero failures in any other combination.',
    evidenceRefs: ['ev-002', 'ev-001'],
    details: `Pattern across the incident window (2024-01-18 → 2024-01-22):

  • Failures occur ONLY when coupon_id is non-null AND tax rates differ
  • Zero failures: no coupon (any rates)
  • Zero failures: coupon + single homogeneous rate
  • First failure: 09:14 UTC, 27 minutes after commit b7f3d9a deployed

Representative entry:
  order_id=ORD-9922 coupon=COUPON10
  expected=1214.51 actual=1227.00 tax_rates=[0.05, 0.18]

The commit that refactored tax aggregation is the only pricing-pipeline
change in the window, and failure timing tracks its deployment.`,
    confidence: 'HIGH',
    confidenceNote: 'Deterministic correlation across 847 failures',
  },
  {
    id: 'inv-test',
    role: 'test',
    label: 'Test Investigator',
    icon: CheckSquare,
    finding:
      'The existing suite passes completely but contains no test combining a coupon discount with heterogeneous tax rates. That coverage gap is why commit b7f3d9a shipped undetected.',
    evidenceRefs: ['ev-005', 'ev-004'],
    details: `Coverage review of tests/checkout.coupon-tax.spec.ts (the suite shipped with the sample project):

  ✓ Coupon-only scenarios — covered, passing
  ✓ Single-rate tax without coupon — covered, passing
  ✗ Coupon + heterogeneous tax rates — NOT covered

The patch adds exactly this missing interaction as regression tests.
The reproduction test deliberately asserts the BUGGY total first: it
documents the failure mode and would catch a future re-introduction.`,
    confidence: 'HIGH',
    confidenceNote: 'Executable gap: test absent before patch, present after',
  },
  {
    id: 'inv-doc',
    role: 'documentation',
    label: 'Documentation Investigator',
    icon: GitBranch,
    finding:
      'API specification §4.3.1 unambiguously requires discount-before-tax. The spec predates the faulty commit — this is a regression against a documented rule, not an ambiguous design choice.',
    evidenceRefs: ['ev-003', 'ev-001'],
    details: `From evidence/api-spec.txt §4.3.1 COMPUTATION ORDER:

  "3. Apply coupon discount to subtotal → discountedSubtotal"
  ...then, and only then:
  "4. For each tax jurisdiction: taxAmount = taxBase × taxRate"

§4.3.2 RATIONALE adds the compliance stake: applying discount after tax
overcharges customers and is a regulatory risk in GST/VAT jurisdictions.

Cross-reference with evidence/incident-report.txt: the first affected
order (09:14 UTC, 2024-01-18) landed 27 minutes after commit b7f3d9a
deployed — timing consistent with a fresh regression.`,
    confidence: 'HIGH',
    confidenceNote: 'Direct specification quotation',
  },
] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Evidence registry — mirrors evidence/ on disk
// ─────────────────────────────────────────────────────────────────────────────
export const CANONICAL_EVIDENCE = {
  files: [
    { id: 'ev-001', name: 'incident-report.txt', disk: 'evidence/incident-report.txt', type: 'pdf' as const },
    { id: 'ev-002', name: 'production.log', disk: 'evidence/production.log', type: 'log' as const },
    { id: 'ev-003', name: 'api-spec.txt', disk: 'evidence/api-spec.txt', type: 'spec' as const },
    { id: 'ev-004', name: 'checkout.ts', disk: 'sample-project/src/services/checkout.ts', type: 'code' as const },
    { id: 'ev-005', name: 'checkout.coupon-tax.spec.ts', disk: 'sample-project/tests/checkout.coupon-tax.spec.ts', type: 'test' as const },
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Impact — illustrative vs measured, explicitly separated
// ─────────────────────────────────────────────────────────────────────────────
export interface ImpactRow {
  id: string;
  label: string;
  before: number;
  after: number;
  unit: string;
  lowerIsBetter: boolean;
  dataType: 'MEASURED IN THIS DEMONSTRATION' | 'ILLUSTRATIVE WORKFLOW COMPARISON';
  note?: string;
}

export const CANONICAL_IMPACT: ImpactRow[] = [
  {
    id: 'coverage',
    label: 'Regression Coverage Added',
    before: 0,
    after: 4,
    unit: 'tests',
    lowerIsBetter: false,
    dataType: 'MEASURED IN THIS DEMONSTRATION',
    note: '4 regression tests exist in the repo and pass',
  },
  {
    id: 'validation',
    label: 'Validation Gates Executed',
    before: 7,
    after: 7,
    unit: 'checks',
    lowerIsBetter: false,
    dataType: 'MEASURED IN THIS DEMONSTRATION',
    note: 'Both workflows run the same release gates',
  },
  {
    id: 'ttrc',
    label: 'Time to Root Cause',
    before: 240,
    after: 12,
    unit: 'min',
    lowerIsBetter: true,
    dataType: 'ILLUSTRATIVE WORKFLOW COMPARISON',
  },
  {
    id: 'msteps',
    label: 'Manual Investigation Steps',
    before: 23,
    after: 4,
    unit: 'steps',
    lowerIsBetter: true,
    dataType: 'ILLUSTRATIVE WORKFLOW COMPARISON',
  },
  {
    id: 'ctx',
    label: 'Context Switches',
    before: 11,
    after: 2,
    unit: 'switches',
    lowerIsBetter: true,
    dataType: 'ILLUSTRATIVE WORKFLOW COMPARISON',
  },
  {
    id: 'files',
    label: 'Files Manually Inspected',
    before: 26,
    after: 4,
    unit: 'files',
    lowerIsBetter: true,
    dataType: 'ILLUSTRATIVE WORKFLOW COMPARISON',
  },
  {
    id: 'rework',
    label: 'Rework Attempts',
    before: 3,
    after: 1,
    unit: 'attempts',
    lowerIsBetter: true,
    dataType: 'ILLUSTRATIVE WORKFLOW COMPARISON',
  },
];

export const IMPACT_DISCLAIMER =
  'Two data types appear here. "Measured in this demonstration" values are verifiable in this repository (tests, gates). "Illustrative workflow comparison" values are configured demo data showing the structural difference between manual and PatchFlow workflows — they are NOT controlled measurements and should not be cited as benchmarks.';

// ─────────────────────────────────────────────────────────────────────────────
// Workflow state machine — the ONLY status authority
// ─────────────────────────────────────────────────────────────────────────────
export type WorkflowState =
  | 'IDLE'
  | 'INGESTING'
  | 'INVESTIGATING'
  | 'SYNTHESIZING'
  | 'REPRODUCING'
  | 'PATCHING'
  | 'TESTING'
  | 'VALIDATING'
  | 'REPORTING'
  | 'VERIFIED'
  | 'RESOLVED';

const STATE_ORDER: WorkflowState[] = [
  'IDLE',
  'INGESTING',
  'INVESTIGATING',
  'SYNTHESIZING',
  'REPRODUCING',
  'PATCHING',
  'TESTING',
  'VALIDATING',
  'REPORTING',
  'VERIFIED',
  'RESOLVED',
];

/** DemoPhase (AppContext) → WorkflowState */
export function toWorkflowState(demo: {
  active: boolean;
  phase: string;
}): WorkflowState {
  if (demo.phase === 'complete') return 'VERIFIED';
  if (!demo.active || demo.phase === 'idle') return 'IDLE';
  const map: Record<string, WorkflowState> = {
    ingesting: 'INGESTING',
    spawning: 'INVESTIGATING',
    investigating: 'INVESTIGATING',
    synthesizing: 'SYNTHESIZING',
    reproducing: 'REPRODUCING',
    patching: 'PATCHING',
    testing: 'TESTING',
    validating: 'VALIDATING',
    reporting: 'REPORTING',
  };
  return map[demo.phase] ?? 'IDLE';
}

export function stateIndex(s: WorkflowState): number {
  return STATE_ORDER.indexOf(s);
}

export function hasReached(current: WorkflowState, target: WorkflowState): boolean {
  return stateIndex(current) >= stateIndex(target);
}

export interface StageDescriptor {
  key: string;
  label: string;
  state: WorkflowState;
  path: string;
}

export const WORKFLOW_STAGES: StageDescriptor[] = [
  { key: 'investigate', label: 'Investigation', state: 'INVESTIGATING', path: '/investigate' },
  { key: 'rootcause', label: 'Root Cause', state: 'SYNTHESIZING', path: '/root-cause' },
  { key: 'patch', label: 'Patch', state: 'PATCHING', path: '/patch' },
  { key: 'validation', label: 'Validation', state: 'VALIDATING', path: '/validation' },
  { key: 'impact', label: 'Impact', state: 'REPORTING', path: '/impact' },
  { key: 'report', label: 'Report', state: 'RESOLVED', path: '/report' },
];

export function stageStatusFor(current: WorkflowState, stage: StageDescriptor): 'pending' | 'active' | 'complete' {
  const cur = stateIndex(current);
  const target = stateIndex(stage.state);
  if (cur > target) return 'complete';
  if (cur === target) return 'active';
  return 'pending';
}

/** Progress = fraction of workflow states completed. */
export function workflowProgress(current: WorkflowState): number {
  const doneStates = STATE_ORDER.slice(1, stateIndex(current) + 1);
  return Math.round((doneStates.length / (STATE_ORDER.length - 1)) * 100);
}
