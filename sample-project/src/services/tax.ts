// OrderFlow API — Tax Service
// aggregateTaxByJurisdiction: correct implementation
// Called with wrong input in the buggy checkout.ts version.

import type { LineItem } from '../models/LineItem';
import type { TaxRule } from '../models/Order';

/**
 * Aggregate tax amounts by jurisdiction.
 *
 * CORRECT version: accepts an optional discountedSubtotal to apply
 * proportional discount to the taxable base per jurisdiction.
 *
 * BUGGY call site (checkout.ts < b7f3d9a): called without discountedSubtotal,
 * so tax is computed against the full undiscounted subtotal.
 */
export async function aggregateTaxByJurisdiction(
  lineItems: LineItem[],
  taxRules: TaxRule[],
  discountedSubtotal?: number,
): Promise<Record<string, number>> {
  const totalSubtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice, 0
  );

  const result: Record<string, number> = {};

  for (const item of lineItems) {
    const rule = taxRules.find(r => r.code === item.taxCode);
    if (!rule) continue;

    const itemSubtotal = item.qty * item.unitPrice;

    // If discountedSubtotal provided, compute proportional taxable base
    const taxBase = discountedSubtotal !== undefined
      ? itemSubtotal * (discountedSubtotal / totalSubtotal)
      : itemSubtotal;

    result[rule.jurisdiction] = (result[rule.jurisdiction] ?? 0) +
      Math.round(taxBase * rule.rate * 100) / 100;
  }

  return result;
}
