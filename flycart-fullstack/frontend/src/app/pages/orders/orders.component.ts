import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ORDER_STAGES, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="page container">
      <h1>My Orders</h1>

      @if (orderService.orders().length === 0) {
        <div class="card empty">
          <p>You haven't placed any orders yet.</p>
          <a routerLink="/products" class="btn btn-primary">Shop Now</a>
        </div>
      } @else {
        <div class="order-list">
          @for (o of orderService.orders().slice().reverse(); track o.id) {
            <div class="order-card card">
              <div class="order-head">
                <div>
                  <h3>Order #{{ o.id }}</h3>
                  <span class="date">{{ o.date }}</span>
                </div>
                <span class="stage-badge">{{ o.stage }}</span>
              </div>

              <div class="items">
                @for (i of o.items; track i.id) {
                  <div class="row"><span>{{ i.name }} × {{ i.qty }}</span><span>₹{{ i.price * i.qty | number }}</span></div>
                }
                @if (o.discount > 0) { <div class="row discount"><span>Discount ({{ o.couponCode }})</span><span>−₹{{ o.discount | number }}</span></div> }
                <div class="row"><strong>Total</strong><strong>₹{{ o.total | number }}</strong></div>
                <div class="row muted"><span>Payment: {{ o.payment }}</span></div>
              </div>

              <div class="tracker">
                @for (stage of stages; track stage; let i = $index) {
                  <div class="step" [class.done]="stageIndex(o.stage) >= i" [class.current]="stageIndex(o.stage) === i">
                    <span class="dot"></span>
                    <span class="label">{{ stage }}</span>
                  </div>
                }
              </div>

              @if (o.stage !== 'Delivered') {
                <button class="btn btn-sm btn-outline" (click)="orderService.advanceStage(o.id)">Simulate Next Update</button>
              }
            </div>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .empty { text-align: center; padding: 70px 20px; }
    .order-list { display: flex; flex-direction: column; gap: 20px; }
    .order-card { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
    .order-head { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--fc-border); padding-bottom: 12px; }
    .order-head h3 { font-size: 1.05rem; }
    .date { color: var(--fc-muted-2); font-size: 0.8rem; }
    .stage-badge { background: var(--fc-bg-alt); color: var(--fc-red-dark); font-weight: 800; font-size: 0.75rem; padding: 6px 12px; border-radius: 999px; height: fit-content; }
    .items { display: flex; flex-direction: column; gap: 4px; }
    .row { display: flex; justify-content: space-between; color: var(--fc-muted); font-size: 0.9rem; }
    .row.discount span:last-child { color: var(--fc-success); }
    .row.muted { color: var(--fc-muted-2); font-size: 0.8rem; }

    .tracker { display: flex; align-items: flex-start; gap: 4px; padding: 10px 4px 0; overflow-x: auto; }
    .step { flex: 1; min-width: 90px; display: flex; flex-direction: column; align-items: center; position: relative; text-align: center; }
    .step::before {
      content: ''; position: absolute; top: 6px; left: -50%; width: 100%; height: 2px; background: var(--fc-border); z-index: 0;
    }
    .step:first-child::before { display: none; }
    .step.done::before { background: var(--fc-red); }
    .dot { width: 14px; height: 14px; border-radius: 50%; background: var(--fc-border); z-index: 1; margin-bottom: 6px; }
    .step.done .dot { background: var(--fc-red); }
    .step.current .dot { box-shadow: 0 0 0 4px var(--fc-bg-alt); animation: pulse 1.4s ease-in-out infinite; }
    @keyframes pulse { 0%, 100% { box-shadow: 0 0 0 4px var(--fc-bg-alt); } 50% { box-shadow: 0 0 0 8px var(--fc-bg-alt); } }
    .label { font-size: 0.72rem; font-weight: 700; color: var(--fc-muted); }
    .step.done .label { color: var(--fc-ink); }
  `],
})
export class OrdersComponent {
  orderService = inject(OrderService);
  stages = ORDER_STAGES;

  stageIndex(stage: string): number {
    return this.stages.indexOf(stage as (typeof this.stages)[number]);
  }
}
