import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="page container">
      <h1>Contact Us</h1>
      <div class="layout">
        <form class="card form" (ngSubmit)="send()" #f="ngForm">
          <div class="field">
            <label for="cname">Your Name</label>
            <input id="cname" name="cname" [(ngModel)]="name" required placeholder="Your name">
          </div>
          <div class="field">
            <label for="cemail">Your Email</label>
            <input id="cemail" name="cemail" type="email" [(ngModel)]="email" required placeholder="you@example.com">
          </div>
          <div class="field">
            <label for="cmsg">Message</label>
            <textarea id="cmsg" name="cmsg" rows="5" [(ngModel)]="message" required placeholder="How can we help?"></textarea>
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="f.invalid">Send Message</button>
        </form>

        <div class="info">
          <div class="card info-item"><span class="icon">📍</span><div><strong>Head Office</strong><p>Flycart Technologies, Chennai, India</p></div></div>
          <div class="card info-item"><span class="icon">✉️</span><div><strong>Email</strong><p>support&#64;flycart.example</p></div></div>
          <div class="card info-item"><span class="icon">📞</span><div><strong>Phone</strong><p>+91 90000 00000</p></div></div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .layout { display: grid; grid-template-columns: 1.3fr 1fr; gap: 26px; align-items: start; }
    .form { padding: 28px; display: flex; flex-direction: column; gap: 16px; }
    .info { display: flex; flex-direction: column; gap: 14px; }
    .info-item { padding: 18px; display: flex; align-items: flex-start; gap: 14px; }
    .icon { font-size: 1.4rem; }
    .info-item strong { display: block; margin-bottom: 3px; }
    .info-item p { color: var(--fc-muted); font-size: 0.88rem; }

    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } }
  `],
})
export class ContactComponent {
  private toast = inject(ToastService);
  name = '';
  email = '';
  message = '';

  send(): void {
    this.toast.success('Message sent! We will get back to you soon.');
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
