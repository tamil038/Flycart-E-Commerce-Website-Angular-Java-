import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="page container">
      <h1>Your Shopping Cart</h1>

      @if (cart.items().length === 0) {
        <div class="card empty">
          <span class="emoji">🛒</span>
          <p>Your cart is empty.</p>
          <a routerLink="/products" class="btn btn-primary">Go to Products</a>
        </div>
      } @else {
        <div class="layout">
          <div class="cart-list">
            @for (item of cart.items(); track item.id) {
              <div class="cart-item card">
                <img [src]="item.image" [alt]="item.name">
                <div class="grow">
                  <h3>{{ item.name }}</h3>
                  <p class="price">₹{{ item.price | number }}</p>
                </div>
                <div class="qty">
                  <button (click)="cart.changeQty(item.id, -1)" aria-label="Decrease quantity">−</button>
                  <span>{{ item.qty }}</span>
                  <button (click)="cart.changeQty(item.id, 1)" aria-label="Increase quantity">+</button>
                </div>
                <span class="line-total">₹{{ item.price * item.qty | number }}</span>
                <button class="remove" (click)="cart.remove(item.id)" aria-label="Remove item">✕</button>
              </div>
            }
          </div>

          <aside class="summary card">
            <h2>Order Summary</h2>
            <div class="row"><span>Subtotal</span><span>₹{{ cart.subtotal() | number }}</span></div>
            <div class="row"><span>Shipping</span><span>{{ shipping() === 0 ? 'Free' : '₹' + shipping() }}</span></div>
            @if (cart.subtotal() < 1999) {
              <p class="note">Add ₹{{ 1999 - cart.subtotal() | number }} more for free shipping.</p>
            }
            <div class="row total"><strong>Total</strong><strong>₹{{ cart.subtotal() + shipping() | number }}</strong></div>
            <button class="btn btn-primary btn-block" (click)="proceed()">Proceed to Checkout</button>
          </aside>
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .empty { text-align: center; padding: 70px 20px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .emoji { font-size: 2.4rem; }

    .layout { display: grid; grid-template-columns: 2fr 1fr; gap: 26px; align-items: start; }
    .cart-list { display: flex; flex-direction: column; gap: 14px; }
    .cart-item { display: flex; gap: 16px; align-items: center; padding: 14px; }
    .cart-item img { width: 90px; height: 90px; object-fit: cover; border-radius: 10px; }
    .grow { flex: 1; }
    .grow h3 { font-size: 1rem; }
    .price { color: var(--fc-muted); margin-top: 4px; }
    .qty { display: inline-flex; align-items: center; gap: 10px; background: var(--fc-bg-alt); border-radius: 999px; padding: 6px 12px; }
    .qty button { width: 26px; height: 26px; border-radius: 50%; border: none; background: var(--fc-red); color: #fff; font-weight: 800; cursor: pointer; }
    .line-total { font-weight: 800; color: var(--fc-red); min-width: 80px; text-align: right; }
    .remove { background: none; border: none; color: var(--fc-muted-2); font-size: 1rem; cursor: pointer; }
    .remove:hover { color: var(--fc-red); }

    .summary { padding: 22px; position: sticky; top: 90px; }
    .summary h2 { font-size: 1.15rem; margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; color: var(--fc-muted); font-size: 0.92rem; }
    .row.total { border-top: 1px solid var(--fc-border); margin-top: 6px; padding-top: 14px; color: var(--fc-ink); font-size: 1.05rem; }
    .note { font-size: 0.8rem; color: var(--fc-coral); margin: 4px 0 8px; }

    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } .cart-item { flex-wrap: wrap; } }
  `],
})
export class CartComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private router = inject(Router);

  shipping = computed(() => (this.cart.subtotal() >= 1999 || this.cart.subtotal() === 0 ? 0 : 79));

  proceed(): void {
    this.router.navigate([this.auth.isLoggedIn() ? '/checkout' : '/login']);
  }
}
