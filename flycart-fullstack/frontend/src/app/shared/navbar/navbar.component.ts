import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="container inner">
        <a class="logo" routerLink="/home">
          <span class="mark">
            <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true">
              <path d="M6 30 C 14 12, 34 6, 44 6 C 44 16, 38 36, 20 44 C 20 38, 20 34, 16 30 C 12 26, 8 26, 6 30 Z" fill="url(#fc-grad)"/>
              <circle cx="12" cy="36" r="2.4" fill="var(--fc-gold)"/>
              <defs>
                <linearGradient id="fc-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="var(--fc-red)"/>
                  <stop offset="1" stop-color="var(--fc-coral)"/>
                </linearGradient>
              </defs>
            </svg>
          </span>
          Flycart
        </a>

        <button class="burger" (click)="menuOpen.set(!menuOpen())" [attr.aria-expanded]="menuOpen()" aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>

        <nav class="nav-links" [class.open]="menuOpen()">
          <a routerLink="/home" routerLinkActive="active" (click)="menuOpen.set(false)">Home</a>
          <a routerLink="/products" routerLinkActive="active" (click)="menuOpen.set(false)">Products</a>
          <a routerLink="/orders" routerLinkActive="active" (click)="menuOpen.set(false)">My Orders</a>
          <a routerLink="/about" routerLinkActive="active" (click)="menuOpen.set(false)">About</a>
          <a routerLink="/contact" routerLinkActive="active" (click)="menuOpen.set(false)">Contact</a>
        </nav>

        <div class="nav-actions">
          <a class="icon-link" routerLink="/wishlist" aria-label="Wishlist">
            ♥
            @if (wishlist.count() > 0) { <span class="dot">{{ wishlist.count() }}</span> }
          </a>
          <a class="icon-link" routerLink="/cart" aria-label="Cart">
            🛒
            @if (cart.count() > 0) { <span class="dot">{{ cart.count() }}</span> }
          </a>
          @if (auth.isLoggedIn()) {
            <a class="icon-link profile" routerLink="/profile" aria-label="Profile">👤</a>
            <button class="btn btn-sm btn-ghost" (click)="logout()">Logout</button>
          } @else {
            <a class="btn btn-sm btn-primary" routerLink="/login">Login</a>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar { position: sticky; top: 0; z-index: 1000; background: rgba(255,248,246,0.92); backdrop-filter: blur(8px); border-bottom: 1px solid var(--fc-border); }
    .inner { display: flex; align-items: center; gap: 20px; padding: 14px 0; }
    .logo { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-weight: 800; font-size: 1.4rem; color: var(--fc-red-dark); text-decoration: none; margin-right: auto; }
    .mark { display: inline-flex; }
    .nav-links { display: flex; gap: 22px; align-items: center; }
    .nav-links a { text-decoration: none; color: var(--fc-ink); font-weight: 600; font-size: 0.95rem; position: relative; padding-bottom: 4px; }
    .nav-links a.active { color: var(--fc-red); }
    .nav-links a.active::after { content: ''; position: absolute; left: 0; right: 0; bottom: -2px; height: 2px; background: var(--fc-gradient); border-radius: 2px; }
    .nav-links a:hover { color: var(--fc-red); }
    .nav-actions { display: flex; align-items: center; gap: 14px; }
    .icon-link { position: relative; text-decoration: none; font-size: 1.15rem; color: var(--fc-ink); display: inline-flex; }
    .dot { position: absolute; top: -8px; right: -10px; background: var(--fc-red); color: #fff; font-size: 0.65rem; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    .burger { display: none; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 6px; }
    .burger span { width: 22px; height: 2px; background: var(--fc-ink); border-radius: 2px; }

    @media (max-width: 860px) {
      .burger { display: flex; }
      .nav-links {
        position: absolute; top: 100%; left: 0; right: 0;
        background: var(--fc-card); flex-direction: column; align-items: flex-start;
        padding: 16px 5%; gap: 14px; box-shadow: var(--shadow-md);
        display: none;
      }
      .nav-links.open { display: flex; }
    }
  `],
})
export class NavbarComponent {
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  auth = inject(AuthService);
  private router = inject(Router);
  menuOpen = signal(false);

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
