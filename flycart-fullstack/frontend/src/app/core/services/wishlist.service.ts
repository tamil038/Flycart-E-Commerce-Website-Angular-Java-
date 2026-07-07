import { Injectable, computed, signal } from '@angular/core';
import { ToastService } from './toast.service';

const WISHLIST_KEY = 'flycart.wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  readonly ids = signal<number[]>(this.read());
  readonly count = computed(() => this.ids().length);

  constructor(private toast: ToastService) {}

  private read(): number[] {
    try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]'); } catch { return []; }
  }

  private persist(): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.ids()));
  }

  has(id: number): boolean {
    return this.ids().includes(id);
  }

  toggle(id: number, name?: string): void {
    if (this.has(id)) {
      this.ids.set(this.ids().filter((x) => x !== id));
      if (name) this.toast.info(`${name} removed from wishlist`);
    } else {
      this.ids.set([...this.ids(), id]);
      if (name) this.toast.success(`${name} saved to wishlist`);
    }
    this.persist();
  }

  remove(id: number): void {
    this.ids.set(this.ids().filter((x) => x !== id));
    this.persist();
  }
}
