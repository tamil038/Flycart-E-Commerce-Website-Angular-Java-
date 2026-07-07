import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

interface Coupon { code: string; type: 'percent' | 'flat'; value: number; minSubtotal: number; maxDiscount?: number; }

const COUPONS: Coupon[] = [
  { code: 'FLY10', type: 'percent', value: 10, minSubtotal: 999, maxDiscount: 400 },
  { code: 'WELCOME15', type: 'percent', value: 15, minSubtotal: 1500, maxDiscount: 600 },
  { code: 'FIRST50', type: 'flat', value: 50, minSubtotal: 300 },
];

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="page container">
      <h1>Checkout</h1>

      @if (cart.items().length === 0) {
        <div class="card empty">
          <p>Your cart is empty — add something before checking out.</p>
          <a routerLink="/products" class="btn btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="layout">
          <form class="form-card card" (ngSubmit)="placeOrder()" #f="ngForm">
            <h2>Shipping Details</h2>
            <div class="grid">
              <div class="field"><label for="name">Full Name</label><input id="name" name="name" [(ngModel)]="customer.name" required></div>
              <div class="field"><label for="phone">Phone</label><input id="phone" name="phone" type="tel" pattern="[0-9]{10}" [(ngModel)]="customer.phone" required></div>
              <div class="field span2"><label for="address">Address</label><textarea id="address" name="address" [(ngModel)]="customer.address" required></textarea></div>
              <div class="field"><label for="city">City</label><input id="city" name="city" [(ngModel)]="customer.city" required></div>
              <div class="field"><label for="state">State</label><input id="state" name="state" [(ngModel)]="customer.state" required></div>
              <div class="field"><label for="zip">Zip Code</label><input id="zip" name="zip" [(ngModel)]="customer.zip" required></div>
            </div>

            <h2>Payment Method</h2>
            <div class="pay-options">
              <label class="pay-option" [class.active]="payment === 'COD'">
                <input type="radio" name="pay" value="COD" [(ngModel)]="payment"> 💵 Cash on Delivery
              </label>
              <label class="pay-option" [class.active]="payment === 'Card'">
                <input type="radio" name="pay" value="Card" [(ngModel)]="payment"> 💳 Credit / Debit Card
              </label>
              <label class="pay-option" [class.active]="payment === 'UPI'">
                <input type="radio" name="pay" value="UPI" [(ngModel)]="payment"> 📱 UPI / Net Banking
              </label>
            </div>

            <button class="btn btn-primary btn-block" type="submit" [disabled]="f.invalid">Place Order · ₹{{ total() | number }}</button>
          </form>

          <aside class="summary card">
            <h2>Order Summary</h2>
            <div class="lines">
              @for (item of cart.items(); track item.id) {
                <div class="row"><span>{{ item.name }} × {{ item.qty }}</span><span>₹{{ item.price * item.qty | number }}</span></div>
              }
            </div>

            <div class="coupon">
              <input type="text" placeholder="Coupon code" [(ngModel)]="couponInput" name="coupon" (keyup.enter)="applyCoupon()">
              <button type="button" class="btn btn-sm btn-ghost" (click)="applyCoupon()">Apply</button>
            </div>
            @if (appliedCoupon()) {
              <p class="applied">✓ {{ appliedCoupon()!.code }} applied</p>
            } @else {
              <p class="hint">Try FLY10, WELCOME15 or FIRST50</p>
            }

            <div class="row"><span>Subtotal</span><span>₹{{ cart.subtotal() | number }}</span></div>
            @if (discount() > 0) { <div class="row discount"><span>Discount</span><span>−₹{{ discount() | number }}</span></div> }
            <div class="row"><span>Shipping</span><span>{{ shipping() === 0 ? 'Free' : '₹' + shipping() }}</span></div>
            <div class="row total"><strong>Total</strong><strong>₹{{ total() | number }}</strong></div>
          </aside>
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .empty { text-align: center; padding: 70px 20px; }
    .layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 26px; align-items: start; }
    .form-card { padding: 28px; display: flex; flex-direction: column; gap: 18px; }
    .form-card h2 { font-size: 1.1rem; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
    .span2 { grid-column: 1 / -1; }
    .pay-options { display: flex; flex-direction: column; gap: 10px; }
    .pay-option { display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--fc-border); border-radius: var(--radius-sm); padding: 12px 14px; font-weight: 600; cursor: pointer; }
    .pay-option.active { border-color: var(--fc-red); background: var(--fc-bg-alt); }
    .pay-option input { accent-color: var(--fc-red); }

    .summary { padding: 22px; position: sticky; top: 90px; display: flex; flex-direction: column; gap: 4px; }
    .summary h2 { font-size: 1.1rem; margin-bottom: 10px; }
    .lines { display: flex; flex-direction: column; gap: 6px; padding-bottom: 10px; border-bottom: 1px solid var(--fc-border); margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--fc-muted); padding: 4px 0; }
    .row.discount span:last-child { color: var(--fc-success); font-weight: 700; }
    .row.total { border-top: 1px solid var(--fc-border); margin-top: 8px; padding-top: 14px; color: var(--fc-ink); font-size: 1.05rem; }
    .coupon { display: flex; gap: 8px; margin: 10px 0 6px; }
    .coupon input { flex: 1; border: 1.5px solid var(--fc-border); border-radius: var(--radius-sm); padding: 9px 12px; font-family: inherit; }
    .applied { color: var(--fc-success); font-size: 0.8rem; font-weight: 700; margin-bottom: 8px; }
    .hint { color: var(--fc-muted-2); font-size: 0.78rem; margin-bottom: 8px; }

    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .grid { grid-template-columns: 1fr; } }
  `],
})
export class CheckoutComponent {
  cart = inject(CartService);
  private orderService = inject(OrderService);
  private toast = inject(ToastService);
  private auth = inject(AuthService);
  private router = inject(Router);

  customer = {
    name: this.auth.profile().name || '',
    phone: '',
    address: this.auth.profile().address || '',
    city: '',
    state: '',
    zip: '',
  };
  payment = 'COD';
  couponInput = '';
  appliedCoupon = signal<Coupon | null>(null);

  shipping = computed(() => (this.cart.subtotal() >= 1999 || this.cart.subtotal() === 0 ? 0 : 79));

  discount = computed(() => {
    const c = this.appliedCoupon();
    if (!c) return 0;
    const subtotal = this.cart.subtotal();
    if (subtotal < c.minSubtotal) return 0;
    const raw = c.type === 'flat' ? c.value : Math.round((subtotal * c.value) / 100);
    return c.maxDiscount ? Math.min(raw, c.maxDiscount) : raw;
  });

  total = computed(() => Math.max(0, this.cart.subtotal() - this.discount() + this.shipping()));

  applyCoupon(): void {
    const code = this.couponInput.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code === code);
    if (!found) {
      this.toast.error('That coupon code is not valid.');
      return;
    }
    if (this.cart.subtotal() < found.minSubtotal) {
      this.toast.error(`Add ₹${found.minSubtotal - this.cart.subtotal()} more to use ${found.code}.`);
      return;
    }
    this.appliedCoupon.set(found);
    this.toast.success(`Coupon ${found.code} applied!`);
  }

  placeOrder(): void {
    const order = this.orderService.place({
      items: this.cart.items(),
      customer: this.customer,
      payment: this.payment,
      subtotal: this.cart.subtotal(),
      discount: this.discount(),
      couponCode: this.appliedCoupon()?.code ?? null,
      shipping: this.shipping(),
      total: this.total(),
    });
    this.cart.clear();
    this.toast.success('Order placed successfully!');
    this.router.navigate(['/order-complete'], { queryParams: { id: order.id } });
  }
}
