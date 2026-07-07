import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page container">
      <h1>My Profile</h1>
      <div class="layout">
        <div class="card form-card">
          <div class="avatar">{{ initials() }}</div>
          <div class="field">
            <label for="pname">Name</label>
            <input id="pname" [(ngModel)]="form.name" placeholder="Your name">
          </div>
          <div class="field">
            <label for="pemail">Email</label>
            <input id="pemail" type="email" [(ngModel)]="form.email" placeholder="you@example.com">
          </div>
          <div class="field">
            <label for="paddr">Address</label>
            <textarea id="paddr" [(ngModel)]="form.address" placeholder="Full address"></textarea>
          </div>
          <button class="btn btn-primary" (click)="save()">Save Profile</button>
        </div>

        <div class="recent">
          <h2>Recent Orders</h2>
          @if (orderService.orders().length === 0) {
            <p class="muted">No orders yet.</p>
          } @else {
            @for (o of orderService.orders().slice(-3).reverse(); track o.id) {
              <div class="order-card card">
                <div class="row"><strong>#{{ o.id }}</strong><span class="muted">{{ o.date }}</span></div>
                <div class="row"><span>Total</span><strong>₹{{ o.total | number }}</strong></div>
                <span class="stage">{{ o.stage }}</span>
              </div>
            }
          }
        </div>
      </div>
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 26px; align-items: start; }
    .form-card { padding: 28px; display: flex; flex-direction: column; gap: 16px; }
    .avatar {
      width: 64px; height: 64px; border-radius: 50%; background: var(--fc-gradient); color: #fff;
      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.3rem; margin-bottom: 6px;
    }
    .recent h2 { font-size: 1.1rem; margin-bottom: 14px; }
    .order-card { padding: 16px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; font-size: 0.9rem; }
    .muted { color: var(--fc-muted-2); font-size: 0.8rem; }
    .stage { align-self: flex-start; background: var(--fc-bg-alt); color: var(--fc-red-dark); font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 999px; }

    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  orderService = inject(OrderService);

  form = { ...this.auth.profile() };

  initials(): string {
    const n = this.form.name || 'Flycart Shopper';
    return n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  }

  save(): void {
    this.auth.saveProfile(this.form);
    this.toast.success('Profile saved!');
  }
}
