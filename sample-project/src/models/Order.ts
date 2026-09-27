// OrderFlow API — Sample Project
// TaxRule model

export interface TaxRule {
  code: string;
  jurisdiction: string;
  rate: number; // e.g. 0.05 for 5%
  description: string;
}

// Coupon model
export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
}

// Checkout total result
export interface CheckoutTotal {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  taxBreakdown: Record<string, number>;
}
