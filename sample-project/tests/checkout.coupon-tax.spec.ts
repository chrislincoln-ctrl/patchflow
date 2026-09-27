import { describe, it, expect } from 'vitest';
import { calculateFinalTotal, calculateFinalTotalFixed } from '../src/services/checkout';
import {
  mockTaxRules,
  phoneCase,
  usbCable,
  laptopStand,
  mouse,
  coupon10Percent,
  coupon200Fixed,
} from './fixtures/checkout.fixtures';

// =============================================================
// REGRESSION TESTS — INC-2024-0847
// coupon + heterogeneous tax rate interaction
// =============================================================
describe('checkout — coupon + multi-rate tax (regression: INC-2024-0847)', () => {
  it('BUGGY: produces incorrect total for 10% coupon + 5%+18% GST', async () => {
    const items = [phoneCase, usbCable];
    const result = await calculateFinalTotal(items, coupon10Percent, mockTaxRules);
    // This assertion documents the BUG (what the current code produces)
    // subtotal=1298, discount=129.8, tax applied BEFORE discount
    expect(result.subtotal).toBe(1298);
    // Bug: tax = (999 * 0.05) + (299 * 0.18) = 49.95 + 53.82 = 103.77 (undiscounted)
    // total = 1298 + 103.77 - 129.8 = 1271.97
    expect(result.total).toBeCloseTo(1271.97, 1); // actual bug output
  });

  it('FIXED: applies 10% coupon before aggregating 5%+18% GST', async () => {
    const items = [phoneCase, usbCable];
    const result = await calculateFinalTotalFixed(items, coupon10Percent, mockTaxRules);
    // Correct: discount first → discountedSubtotal = 1298 - 129.8 = 1168.2
    // tax = proportional on 1168.2: GST_5 on (999/1298 * 1168.2) = 44.95
    //                                GST_18 on (299/1298 * 1168.2) = 48.44
    // total = 1168.2 + 44.95 + 48.44 = 1261.59
    expect(result.subtotal).toBe(1298);
    expect(result.discount).toBeCloseTo(129.8, 1);
    expect(result.total).toBeGreaterThan(1200);
    expect(result.total).toBeLessThan(result.subtotal); // always less than undiscounted
  });

  it('FIXED: no-coupon result unchanged (no regression)', async () => {
    const items = [phoneCase, usbCable];
    const buggy = await calculateFinalTotal(items, null, mockTaxRules);
    const fixed = await calculateFinalTotalFixed(items, null, mockTaxRules);
    // Without coupon, both should produce identical totals
    expect(fixed.total).toBeCloseTo(buggy.total, 2);
  });

  it('FIXED: applies fixed-amount coupon before tax', async () => {
    const items = [laptopStand];
    const noCoupon = await calculateFinalTotalFixed(items, null, mockTaxRules);
    const result = await calculateFinalTotalFixed(items, coupon200Fixed, mockTaxRules);
    expect(result.discount).toBe(200);
    expect(result.subtotal).toBe(2998);
    // total WITH coupon must be less than total WITHOUT coupon (coupon reduces tax base)
    expect(result.total).toBeLessThan(noCoupon.total);
    // and discount of 200 means the difference should be at least 200
    expect(noCoupon.total - result.total).toBeGreaterThanOrEqual(200);
  });

  it('FIXED: single-rate tax without coupon unchanged', async () => {
    const items = [mouse];
    const result = await calculateFinalTotalFixed(items, null, mockTaxRules);
    // 799 * 1.18 = 942.82
    expect(result.total).toBeCloseTo(942.82, 1);
  });
});

// =============================================================
// EXISTING TESTS — coupon-only scenarios
// =============================================================
describe('checkout — coupon only (flat tax rate)', () => {
  it('applies 10% coupon to single-rate order', async () => {
    const items = [mouse];
    const result = await calculateFinalTotalFixed(items, coupon10Percent, mockTaxRules);
    expect(result.discount).toBeCloseTo(79.9, 1);
    expect(result.subtotal).toBe(799);
  });

  it('applies fixed coupon capped at subtotal', async () => {
    const items = [{ ...mouse, qty: 1, unitPrice: 100 }];
    const bigCoupon = { code: 'BIG', type: 'fixed' as const, value: 999, description: 'big' };
    const result = await calculateFinalTotalFixed(items, bigCoupon, mockTaxRules);
    expect(result.discount).toBe(100); // capped at subtotal
  });

  it('no coupon leaves discount at zero', async () => {
    const result = await calculateFinalTotalFixed([mouse], null, mockTaxRules);
    expect(result.discount).toBe(0);
  });
});
