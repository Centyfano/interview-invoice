interface Buyer {
  name: string;
  address: string;
  phone: string;
  email: string;
}
interface Seller {
  name: string;
  address: string;
  phone: string;
  email: string;
}
interface InvoiceItem {
  itemName: string;
  quantity: number;
  pricePerUnit: number;
  totalItem: number;
}
interface Invoice {
  number: number;
  date: string;
  paymentDue: string;
  items: InvoiceItem[];
}

export interface InvoiceType {
  buyer: Buyer;
  seller: Seller;
  invoice: Invoice;
  amount: number;
}
