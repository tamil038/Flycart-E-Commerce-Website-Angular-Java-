import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/product.model';
import { Customer, Order, OrderStage } from '../models/order.model';

const ORDERS_KEY = 'flycart.orders';
export const ORDER_STAGES: OrderStage[] = ['Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export interface PlaceOrderInput {
  items: CartItem[];
  customer: Customer;
  payment: string;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  readonly orders = signal<Order[]>(this.read());

  private read(): Order[] {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch { return []; }
  }

  private persist(): void {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders()));
  }

  place(input: PlaceOrderInput): Order {
    const order: Order = {
      id: Date.now(),
      ...input,
      date: new Date().toLocaleString(),
      stage: 'Processing',
    };
    this.orders.set([...this.orders(), order]);
    this.persist();
    return order;
  }

  getById(id: number): Order | undefined {
    return this.orders().find((o) => o.id === id);
  }

  /** Simulated progression used by the tracking stepper. */
  advanceStage(id: number): void {
    const list = [...this.orders()];
    const order = list.find((o) => o.id === id);
    if (!order) return;
    const idx = ORDER_STAGES.indexOf(order.stage);
    if (idx < ORDER_STAGES.length - 1) {
      order.stage = ORDER_STAGES[idx + 1];
      this.orders.set(list);
      this.persist();
    }
  }
}
