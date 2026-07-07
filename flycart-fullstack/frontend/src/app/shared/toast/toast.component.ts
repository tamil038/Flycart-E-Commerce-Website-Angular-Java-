import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-stack" role="status" aria-live="polite">
      @for (t of toast.toasts(); track t.id) {
        <div class="toast" [class]="t.type" (click)="toast.dismiss(t.id)">
          <span class="icon">{{ icon(t.type) }}</span>
          <span>{{ t.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-stack {
      position: fixed; top: 20px; right: 20px; z-index: 2000;
      display: flex; flex-direction: column; gap: 10px; max-width: min(340px, 90vw);
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      background: #fff; color: var(--fc-ink);
      border-radius: 12px; padding: 12px 16px;
      box-shadow: var(--shadow-lg);
      border-left: 4px solid var(--fc-red);
      font-size: 0.9rem; font-weight: 600;
      cursor: pointer;
      animation: toast-in 0.28s cubic-bezier(.2,.8,.3,1) both;
    }
    .toast.success { border-left-color: var(--fc-success); }
    .toast.error { border-left-color: #c62828; }
    .toast.info { border-left-color: var(--fc-coral); }
    .icon { font-size: 1.1rem; }
    @keyframes toast-in {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }
  `],
})
export class ToastComponent {
  toast = inject(ToastService);

  icon(type: string): string {
    return type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  }
}
