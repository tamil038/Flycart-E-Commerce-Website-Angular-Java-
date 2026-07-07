import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-complete',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="center container">
      <div class="card">
        <div class="big-check">✔</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thanks for shopping with <strong>Flycart</strong>. Your order is already on its way to the runway.</p>
        @if (order(); as o) {
          <p class="order-id">Order ID: <span>#{{ o.id }}</span></p>
          <p class="total-line">Total paid: <strong>₹{{ o.total | number }}</strong> · {{ o.payment }}</p>
        }
        <div class="actions">
          <a routerLink="/orders" class="btn btn-primary">View My Orders</a>
          <a routerLink="/products" class="btn btn-outline">Continue Shopping</a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .center { min-height: 60vh; display: flex; align-items: center; justify-content: center; padding: 40px 0; }
    .card { text-align: center; padding: 44px 36px; max-width: 480px; }
    .big-check {
      font-size: 44px; width: 96px; height: 96px; border-radius: 50%;
      background: var(--fc-success-bg); color: var(--fc-success);
      display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
      animation: pop 0.5s cubic-bezier(.2,.9,.3,1.4) both;
    }
    @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    h2 { font-size: 1.5rem; margin-bottom: 10px; }
    p { color: var(--fc-muted); line-height: 1.55; }
    .order-id { margin-top: 16px; font-weight: 700; color: var(--fc-ink); }
    .order-id span { color: var(--fc-red); }
    .total-line { margin-top: 4px; }
    .actions { display: flex; gap: 12px; justify-content: center; margin-top: 26px; flex-wrap: wrap; }
  `],
})
export class OrderCompleteComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private queryParamMap = toSignal(this.route.queryParamMap);

  order = computed(() => {
    const id = Number(this.queryParamMap()?.get('id'));
    return this.orderService.getById(id);
  });
}
