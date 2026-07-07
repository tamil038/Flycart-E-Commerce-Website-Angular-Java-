import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-wrap">
      <div class="auth-art" aria-hidden="true">
        <div class="path"></div>
        <span class="plane">✈</span>
        <h2>Shop fast.<br>Live better.</h2>
        <p>Flycart gets great products to your door — quick, simple and a little bit delightful.</p>
      </div>

      <div class="auth-box fc-animate-in">
        <div class="tabs">
          <button class="tab" [class.active]="mode() === 'login'" (click)="mode.set('login')">Log In</button>
          <button class="tab" [class.active]="mode() === 'signup'" (click)="mode.set('signup')">Sign Up</button>
        </div>

        @if (mode() === 'login') {
          <form class="stack" (ngSubmit)="submit()" #f="ngForm">
            <div class="field">
              <label for="email">Email</label>
              <input id="email" type="email" name="email" [(ngModel)]="email" required placeholder="you@example.com">
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" type="password" name="password" [(ngModel)]="password" required minlength="4" placeholder="••••••••">
            </div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="f.invalid">Log In</button>
          </form>
        } @else {
          <form class="stack" (ngSubmit)="submit()" #f2="ngForm">
            <div class="field">
              <label for="name">Full Name</label>
              <input id="name" type="text" name="name" [(ngModel)]="name" required placeholder="Your name">
            </div>
            <div class="field">
              <label for="email2">Email</label>
              <input id="email2" type="email" name="email" [(ngModel)]="email" required placeholder="you@example.com">
            </div>
            <div class="field">
              <label for="password2">Password</label>
              <input id="password2" type="password" name="password" [(ngModel)]="password" required minlength="4" placeholder="Create a password">
            </div>
            <button class="btn btn-primary btn-block" type="submit" [disabled]="f2.invalid">Create Account</button>
          </form>
        }
        <p class="hint">This is a demo store — any email & password combination works.</p>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrap { min-height: calc(100vh - 140px); display: grid; grid-template-columns: 1fr 1fr; }
    .auth-art {
      background: var(--fc-gradient-deep); color: #fff; position: relative; overflow: hidden;
      display: flex; flex-direction: column; justify-content: center; padding: 10%;
    }
    .auth-art h2 { font-size: 2.4rem; margin-bottom: 14px; }
    .auth-art p { max-width: 360px; opacity: 0.92; line-height: 1.5; }
    .path {
      position: absolute; left: -10%; top: 30%; width: 130%; height: 2px;
      background-image: repeating-linear-gradient(to right, rgba(255,255,255,0.55) 0 10px, transparent 10px 20px);
      transform: rotate(-8deg);
    }
    .plane { position: absolute; left: 55%; top: 26%; font-size: 2.2rem; transform: rotate(-8deg); animation: bob 3s ease-in-out infinite; }
    @keyframes bob { 0%, 100% { transform: rotate(-8deg) translateY(0); } 50% { transform: rotate(-8deg) translateY(-8px); } }

    .auth-box {
      display: flex; flex-direction: column; justify-content: center;
      max-width: 400px; width: 100%; margin: 0 auto; padding: 40px 20px;
    }
    .tabs { display: flex; gap: 8px; background: var(--fc-bg-alt); border-radius: 999px; padding: 5px; margin-bottom: 26px; }
    .tab { flex: 1; border: none; background: transparent; padding: 10px; border-radius: 999px; font-weight: 700; cursor: pointer; color: var(--fc-muted); }
    .tab.active { background: var(--fc-gradient); color: #fff; box-shadow: var(--shadow-sm); }
    .stack { display: flex; flex-direction: column; gap: 16px; }
    .hint { margin-top: 18px; font-size: 0.8rem; color: var(--fc-muted); text-align: center; }

    @media (max-width: 860px) { .auth-wrap { grid-template-columns: 1fr; } .auth-art { padding: 40px 8%; min-height: 220px; } }
  `],
})
export class AuthComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  mode = signal<'login' | 'signup'>('login');
  email = '';
  password = '';
  name = '';

  submit(): void {
    this.auth.login(this.email, this.name);
    this.toast.success(this.mode() === 'signup' ? 'Account created — welcome to Flycart!' : 'Welcome back!');
    this.router.navigate(['/home']);
  }
}
