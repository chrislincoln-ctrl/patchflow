import type { Patch } from '../types';
import { CANONICAL_PATCH, CANONICAL_SCENARIO, TEST_SUMMARY } from './canonical';

// ── Diff, aligned with the real sample-project code (checkout.ts, tax.ts) ────
const DIFFS: Record<string, Patch['files'][number]['diff']> = {
  'src/services/checkout.ts': [
    { type: 'header', content: '@@ line 24 — calculateFinalTotal() (buggy version)' },
    { type: 'context', content: '  const subtotal = lineItems.reduce(' },
    { type: 'context', content: '    (sum, item) => sum + item.qty * item.unitPrice, 0' },
    { type: 'context', content: '  );' },
    { type: 'context', content: '' },
    { type: 'removed', content: '-  // ⚠ BUG: tax aggregated before discount — wrong order per spec §4.3.1' },
    { type: 'removed', content: '-  const taxByJurisdiction = await aggregateTaxByJurisdiction(' },
    { type: 'removed', content: '-    lineItems,' },
    { type: 'removed', content: '-    taxRules,' },
    { type: 'added', content: '+  // ✓ FIX: apply discount first, then aggregate tax (spec §4.3.1)' },
    { type: 'added', content: '+  const discount = coupon ? computeDiscount(subtotal, coupon) : 0;' },
    { type: 'added', content: '+  const discountedSubtotal = subtotal - discount;' },
    { type: 'added', content: '+' },
    { type: 'added', content: '+  const taxByJurisdiction = await aggregateTaxByJurisdiction(' },
    { type: 'added', content: '+    lineItems,' },
    { type: 'added', content: '+    taxRules,' },
    { type: 'added', content: '+    discountedSubtotal,  // ← proportional taxable base per jurisdiction' },
    { type: 'context', content: '  );' },
    { type: 'context', content: '  const totalTax = Object.values(taxByJurisdiction)' },
    { type: 'context', content: '    .reduce((sum, t) => sum + t, 0);' },
    { type: 'context', content: '' },
    { type: 'removed', content: '-  const discount = coupon ? computeDiscount(subtotal, coupon) : 0;' },
    { type: 'context', content: '' },
    { type: 'context', content: '  return {' },
    { type: 'context', content: '    subtotal,' },
    { type: 'context', content: '    discount,' },
    { type: 'context', content: '    tax: totalTax,' },
    { type: 'context', content: '    total: discountedSubtotal + totalTax,' },
    { type: 'context', content: '  };' },
    { type: 'context', content: '}' },
  ],
  'src/services/tax.ts': [
    { type: 'header', content: '@@ line 8 — aggregateTaxByJurisdiction()' },
    { type: 'context', content: 'export async function aggregateTaxByJurisdiction(' },
    { type: 'context', content: '  lineItems: LineItem[],' },
    { type: 'context', content: '  taxRules: TaxRule[],' },
    { type: 'added', content: '+  discountedSubtotal?: number,  // optional: enables proportional discounted base' },
    { type: 'context', content: '): Promise<Record<string, number>> {' },
    { type: 'context', content: '  ...' },
    { type: 'context', content: '  const taxBase = discountedSubtotal !== undefined' },
    { type: 'context', content: '      ? itemSubtotal * (discountedSubtotal / totalSubtotal)' },
    { type: 'context', content: '      : itemSubtotal;' },
  ],
};

// ── Regression test content — mirrors tests/checkout.coupon-tax.spec.ts ──────
const REGRESSION_TEST_CONTENT = `import { describe, it, expect } from 'vitest';
import { calculateFinalTotal, calculateFinalTotalFixed } from '../src/services/checkout';
import {
  mockTaxRules, phoneCase, usbCable, laptopStand, mouse,
  coupon10Percent, coupon200Fixed,
} from './fixtures/checkout.fixtures';

// =============================================================
// REGRESSION TESTS — INC-2024-0847
// coupon + heterogeneous tax rate interaction
// =============================================================
describe('checkout — coupon + multi-rate tax (regression: INC-2024-0847)', () => {
  it('BUGGY: produces incorrect total for 10% coupon + 5%+18% GST', async () => {
    const items = [phoneCase, usbCable];
    const result = await calculateFinalTotal(items, coupon10Percent, mockTaxRules);
    // Documents the BUG the current code produces:
    // subtotal 1298, tax on undiscounted base 103.77
    expect(result.subtotal).toBe(1298);
    expect(result.total).toBeCloseTo(${CANONICAL_SCENARIO.buggyTotal.toFixed(2)}, 1);
  });

  it('FIXED: applies 10% coupon before aggregating 5%+18% GST', async () => {
    const items = [phoneCase, usbCable];
    const result = await calculateFinalTotalFixed(items, coupon10Percent, mockTaxRules);
    // Discount first: 1298 − 129.80 = 1168.20 discounted base
    expect(result.subtotal).toBe(1298);
    expect(result.discount).toBeCloseTo(${CANONICAL_SCENARIO.discount.toFixed(2)}, 1);
    expect(result.total).toBeGreaterThan(1200);
    expect(result.total).toBeLessThan(result.subtotal);
  });

  it('FIXED: no-coupon result unchanged (no regression)', async () => {
    const items = [phoneCase, usbCable];
    const buggy = await calculateFinalTotal(items, null, mockTaxRules);
    const fixed = await calculateFinalTotalFixed(items, null, mockTaxRules);
    expect(fixed.total).toBeCloseTo(buggy.total, 2);
  });

  it('FIXED: applies fixed-amount coupon before tax', async () => {
    const items = [laptopStand];
    const noCoupon = await calculateFinalTotalFixed(items, null, mockTaxRules);
    const result = await calculateFinalTotalFixed(items, coupon200Fixed, mockTaxRules);
    expect(result.discount).toBe(200);
    expect(result.subtotal).toBe(2998);
    expect(result.total).toBeLessThan(noCoupon.total);
    expect(noCoupon.total - result.total).toBeGreaterThanOrEqual(200);
  });

  it('FIXED: single-rate tax without coupon unchanged', async () => {
    const items = [mouse];
    const result = await calculateFinalTotalFixed(items, null, mockTaxRules);
    expect(result.total).toBeCloseTo(942.82, 1);
  });
});

// =============================================================
// EXISTING TESTS — coupon-only scenarios
// =============================================================
describe('checkout — coupon only (flat tax rate)', () => {
  it('applies 10% coupon to single-rate order', async () => { /* ... */ });
  it('applies fixed coupon capped at subtotal', async () => { /* ... */ });
  it('no coupon leaves discount at zero', async () => { /* ... */ });
});
// ${TEST_SUMMARY.total} tests total · all passing (${TEST_SUMMARY.runner})`;

export const patch: Patch = {
  summary: CANONICAL_PATCH.summary,
  description: CANONICAL_PATCH.description,
  unrelatedFilesTouched: CANONICAL_PATCH.unrelatedFilesTouched,
  safetyAssessment: CANONICAL_PATCH.safetyAssessment,
  files: CANONICAL_PATCH.files.map(f => ({
    path: f.path,
    linesAdded: f.linesAdded,
    linesRemoved: f.linesRemoved,
    diff: DIFFS[f.path] ?? [],
  })),
  regressionTest: {
    filename: 'tests/checkout.coupon-tax.spec.ts',
    testCount: TEST_SUMMARY.total,
    description:
      'Regression coverage for the coupon + heterogeneous-tax interaction — the exact gap that let the bug ship. The reproduction test deliberately asserts the buggy total first.',
    content: REGRESSION_TEST_CONTENT,
  },
};
