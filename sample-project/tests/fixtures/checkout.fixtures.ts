// OrderFlow API — Test Fixtures

import type { LineItem } from '../../src/models/LineItem';
import type { TaxRule, Coupon } from '../../src/models/Order';

export const mockTaxRules: TaxRule[] = [
  { code: 'GST_5',  jurisdiction: 'GST_5_PCT',  rate: 0.05, description: 'GST 5%' },
  { code: 'GST_12', jurisdiction: 'GST_12_PCT', rate: 0.12, description: 'GST 12%' },
  { code: 'GST_18', jurisdiction: 'GST_18_PCT', rate: 0.18, description: 'GST 18%' },
  { code: 'GST_28', jurisdiction: 'GST_28_PCT', rate: 0.28, description: 'GST 28%' },
];

export const phoneCase: LineItem = {
  id: 'item-001',
  productId: 'prod-iphone-case',
  name: 'iPhone Case',
  qty: 1,
  unitPrice: 999,
  taxCode: 'GST_5',
};

export const usbCable: LineItem = {
  id: 'item-002',
  productId: 'prod-usb-cable',
  name: 'USB-C Cable',
  qty: 1,
  unitPrice: 299,
  taxCode: 'GST_18',
};

export const laptopStand: LineItem = {
  id: 'item-003',
  productId: 'prod-laptop-stand',
  name: 'Laptop Stand',
  qty: 2,
  unitPrice: 1499,
  taxCode: 'GST_12',
};

export const mouse: LineItem = {
  id: 'item-004',
  productId: 'prod-mouse',
  name: 'Wireless Mouse',
  qty: 1,
  unitPrice: 799,
  taxCode: 'GST_18',
};

export const coupon10Percent: Coupon = {
  code: 'COUPON10',
  type: 'percent',
  value: 10,
  description: '10% off subtotal',
};

export const coupon200Fixed: Coupon = {
  code: 'SAVE200',
  type: 'fixed',
  value: 200,
  description: '₹200 off',
};
