// OrderFlow API — Checkout Service
// THIS FILE CONTAINS THE INTENTIONAL BUG (INC-2024-0847)
//
// Bug: coupon discount is applied AFTER tax aggregation.
// The API spec §4.3.1 requires: apply discount BEFORE tax.
// Introduced in commit b7f3d9a (2024-01-18) during tax pipeline refactor.

import type { LineItem } from '../models/LineItem';
import type { Coupon, CheckoutTotal, TaxRule } from '../models/Order';
import { computeDiscount } from './coupon';
import { aggregateTaxByJurisdiction } from './tax';

// ============================================================
// BUGGY VERSION — DO NOT USE IN PRODUCTION
// ============================================================
export async function calculateFinalTotal(
  lineItems: LineItem[],
  coupon: Coupon | null,
  taxRules: TaxRule[],
): Promise<CheckoutTotal> {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice, 0
  );

  // ⚠ BUG (line 24): Tax aggregated before discount — wrong order per spec §4.3.1
  // Should be: compute discountedSubtotal first, pass it to aggregateTaxByJurisdiction
  const taxByJurisdiction = await aggregateTaxByJurisdiction(
    lineItems,
    taxRules,
    // discountedSubtotal NOT passed → tax computed on full, undiscounted subtotal
  );
  const totalTax = Object.values(taxByJurisdiction)
    .reduce((sum, t) => sum + t, 0);

  // Discount applied AFTER tax — this is wrong
  const discount = coupon ? computeDiscount(subtotal, coupon) : 0;

  return {
    subtotal,
    discount,
    tax: totalTax,
    total: Math.round((subtotal + totalTax - discount) * 100) / 100,
    taxBreakdown: taxByJurisdiction,
  };
}

// ============================================================
// FIXED VERSION (after patch)
// ============================================================
export async function calculateFinalTotalFixed(
  lineItems: LineItem[],
  coupon: Coupon | null,
  taxRules: TaxRule[],
): Promise<CheckoutTotal> {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice, 0
  );

  // ✓ FIX: Apply discount first, then aggregate tax (spec §4.3.1)
  const discount = coupon ? computeDiscount(subtotal, coupon) : 0;
  const discountedSubtotal = subtotal - discount;

  const taxByJurisdiction = await aggregateTaxByJurisdiction(
    lineItems,
    taxRules,
    discountedSubtotal, // ← correct: pass discounted subtotal
  );
  const totalTax = Object.values(taxByJurisdiction)
    .reduce((sum, t) => sum + t, 0);

  return {
    subtotal,
    discount,
    tax: Math.round(totalTax * 100) / 100,
    total: Math.round((discountedSubtotal + totalTax) * 100) / 100,
    taxBreakdown: taxByJurisdiction,
  };
}
