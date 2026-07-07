import { CartItem } from './product.model';

export interface Customer {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export type OrderStage = 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: number;
  items: CartItem[];
  customer: Customer;
  payment: string;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
  date: string;
  stage: OrderStage;
}
