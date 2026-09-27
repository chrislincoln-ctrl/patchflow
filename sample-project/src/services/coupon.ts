// OrderFlow API — Coupon Service
// computeDiscount: correct implementation

import type { Coupon } from '../models/Order';

/**
 * Compute the discount amount for a given subtotal and coupon.
 * This function is correct — it is called at the wrong stage in checkout.ts.
 */
export function computeDiscount(subtotal: number, coupon: Coupon): number {
  if (coupon.type === 'percent') {
    return Math.round((subtotal * coupon.value) / 100 * 100) / 100;
  }
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, subtotal);
  }
  return 0;
}
