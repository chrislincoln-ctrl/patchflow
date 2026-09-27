// OrderFlow API — Sample Project
// LineItem model

export interface LineItem {
  id: string;
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  taxCode: string;
}
