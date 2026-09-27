import type { Evidence } from '../types';

export const evidenceItems: Evidence[] = [
  {
    id: 'ev-001',
    name: 'incident-report.pdf',
    type: 'pdf',
    source: 'evidence/',
    relevantLines: 'pp. 2–4',
    finding:
      'Checkout total is incorrect when COUPON10 is applied to a cart with items taxed at 5% and 12%. Expected ₹1,214.51, received ₹1,227.00. Error first appeared in commit b7f3d9a (2024-01-18). Frequency: ~12% of coupon-bearing orders.',
    usedBy: ['log', 'documentation'],
    content: `INCIDENT REPORT — INC-2024-0847
Date: 2024-01-22
Severity: HIGH
Reporter: Payments Team

DESCRIPTION
-----------
Checkout endpoint POST /api/v2/checkout returns an incorrect total
when a discount coupon is applied to a cart containing products
with differing tax rates.

OBSERVED BEHAVIOUR
------------------
Cart: [iPhone case (5% GST, ₹999), USB-C cable (18% GST, ₹299)]
Coupon: COUPON10 (10% off subtotal)
Expected total: ₹1,214.51
Actual total:   ₹1,227.00
Discrepancy:    ₹12.49

REPRODUCTION RATE
-----------------
~12% of coupon-bearing orders. Higher rate when order crosses
multi-jurisdiction tax boundaries.

FIRST SEEN
----------
Commit b7f3d9a — 2024-01-18 15:32 UTC
Author: dev-checkout@orderflow.io`,
  },
  {
    id: 'ev-002',
    name: 'production.log',
    type: 'log',
    source: 'evidence/',
    relevantLines: 'Lines 1847–1923, 2041–2089',
    finding:
      'Log correlation confirms failures occur exclusively when coupon_id is non-null AND order contains items with heterogeneous tax_rate values. Zero failures in coupon-only or multi-tax-only orders.',
    usedBy: ['log', 'code'],
    content: `2024-01-22T09:14:03Z INFO  POST /api/v2/checkout 200 84ms order_id=ORD-9921
2024-01-22T09:14:11Z WARN  checkout_total_mismatch order_id=ORD-9922 expected=1214.51 actual=1227.00 coupon=COUPON10
2024-01-22T09:14:14Z INFO  POST /api/v2/checkout 200 91ms order_id=ORD-9923
2024-01-22T09:15:02Z WARN  checkout_total_mismatch order_id=ORD-9924 expected=876.23 actual=884.49 coupon=SAVE20
2024-01-22T09:16:44Z WARN  checkout_total_mismatch order_id=ORD-9925 expected=2341.00 actual=2384.22 coupon=NEWUSER
...
[1847 lines — pattern: failures correlate with coupon_id != null AND heterogeneous tax_rate values in line_items]`,
  },
  {
    id: 'ev-003',
    name: 'api-spec.pdf',
    type: 'spec',
    source: 'evidence/',
    relevantLines: 'Section 4.3 — Pricing Pipeline',
    finding:
      'API specification Section 4.3 defines: discount must be applied to taxable subtotal BEFORE jurisdiction tax calculations. Current implementation applies discount AFTER tax aggregation — directly contradicting the spec.',
    usedBy: ['documentation', 'code'],
    content: `ORDERFLOW API SPECIFICATION v2.4.1
Section 4.3 — Pricing Pipeline

4.3.1 COMPUTATION ORDER
The checkout pricing pipeline MUST execute in the following order:

  1. Compute line-item subtotals (qty × unit_price)
  2. Apply coupon discount to subtotal → discountedSubtotal
  3. For each tax jurisdiction:
       taxAmount = discountedSubtotal × taxRate
  4. Sum all taxAmount values → totalTax
  5. finalTotal = discountedSubtotal + totalTax

4.3.2 RATIONALE
Applying coupon before tax ensures the discount is reflected
in the taxable base, as required by GST/VAT regulations in
supported jurisdictions.

4.3.3 MULTI-JURISDICTION HANDLING
When line items span multiple tax jurisdictions, each item's
discountedSubtotal must contribute proportionally to each
jurisdiction's taxable base.`,
  },
  {
    id: 'ev-004',
    name: 'checkout.ts',
    type: 'code',
    source: 'sample-project/src/services/',
    relevantLines: 'Lines 87–134',
    finding:
      'calculateFinalTotal() aggregates tax amounts from all line items FIRST, then subtracts the coupon discount from the already-taxed total. This inverts the correct order defined in the API spec.',
    usedBy: ['code', 'test'],
    content: `// checkout.ts — BUGGY VERSION (lines 87–134)
async function calculateFinalTotal(
  lineItems: LineItem[],
  coupon: Coupon | null,
  taxRules: TaxRule[]
): Promise<CheckoutTotal> {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice, 0
  );

  // ⚠ BUG: Tax is aggregated BEFORE discount is applied
  const taxByJurisdiction = await aggregateTaxByJurisdiction(
    lineItems, taxRules
  );
  const totalTax = Object.values(taxByJurisdiction)
    .reduce((sum, t) => sum + t, 0);

  // Discount applied AFTER tax — wrong per spec §4.3.1
  const discount = coupon
    ? computeDiscount(subtotal, coupon)
    : 0;

  return {
    subtotal,
    discount,
    tax: totalTax,
    total: subtotal + totalTax - discount,
  };
}`,
  },
  {
    id: 'ev-005',
    name: 'checkout.test.ts',
    type: 'test',
    source: 'sample-project/tests/',
    relevantLines: 'Lines 1–89',
    finding:
      'Existing test suite has 89 passing tests covering coupon-only and tax-only scenarios independently. No test exercises coupon + heterogeneous tax rates together — the exact scenario that exposes the bug.',
    usedBy: ['test', 'code'],
    content: `// checkout.test.ts — existing tests
describe('Checkout — coupon scenarios', () => {
  it('applies 10% coupon to flat subtotal', ...)   // PASS
  it('applies fixed-amount coupon correctly', ...)  // PASS
  it('rejects expired coupon', ...)                 // PASS
});

describe('Checkout — tax scenarios', () => {
  it('calculates single-rate GST correctly', ...)   // PASS
  it('calculates dual-rate GST correctly', ...)     // PASS
  it('applies IGST for inter-state orders', ...)    // PASS
});

// ❌ MISSING: test for coupon + heterogeneous tax rates
// describe('Checkout — coupon + multi-tax scenarios', () => {
//   ...  <-- NO SUCH TEST EXISTS
// });`,
  },
];
