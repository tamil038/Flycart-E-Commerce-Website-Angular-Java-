import { Injectable, computed, signal } from '@angular/core';
import { CartItem, Product } from '../models/product.model';
import { ToastService } from './toast.service';

const CART_KEY = 'flycart.cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>(this.read());

  readonly count = computed(() => this.items().reduce((sum, i) => sum + i.qty, 0));
  readonly subtotal = computed(() => this.items().reduce((sum, i) => sum + i.qty * i.price, 0));

  constructor(private toast: ToastService) {}

  private read(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  }

  private persist(): void {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items()));
  }

  add(product: Product, qty = 1): void {
    const list = [...this.items()];
    const existing = list.find((i) => i.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      list.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty });
    }
    this.items.set(list);
    this.persist();
    this.toast.success(`${product.name} added to cart`);
  }

  changeQty(id: number, delta: number): void {
    let list = [...this.items()];
    const item = list.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      list = list.filter((i) => i.id !== id);
    }
    this.items.set(list);
    this.persist();
  }

  remove(id: number): void {
    this.items.set(this.items().filter((i) => i.id !== id));
    this.persist();
  }

  clear(): void {
    this.items.set([]);
    this.persist();
  }
}
