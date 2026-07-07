import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container grid">
        <div>
          <div class="brand">Flycart</div>
          <p class="tag">Shop fast. Live better.</p>
        </div>
        <div class="col">
          <h4>Shop</h4>
          <a routerLink="/products">All Products</a>
          <a routerLink="/wishlist">Wishlist</a>
          <a routerLink="/orders">Track Order</a>
        </div>
        <div class="col">
          <h4>Company</h4>
          <a routerLink="/about">About Flycart</a>
          <a routerLink="/contact">Contact Us</a>
        </div>
        <div class="col">
          <h4>Stay in the loop</h4>
          <p class="tag">Get deals before they land.</p>
        </div>
      </div>
      <div class="bottom container">
        <span>© {{ year }} Flycart. All rights reserved.</span>
        <span class="dashes" aria-hidden="true">✈ - - - - - - - - - -</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer { margin-top: auto; background: var(--fc-ink); color: #f4e9e7; padding-top: 44px; }
    .grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.2fr; gap: 24px; padding-bottom: 30px; }
    .brand { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: #fff; }
    .tag { color: #cba7a3; margin-top: 6px; font-size: 0.9rem; }
    .col { display: flex; flex-direction: column; gap: 10px; }
    .col h4 { color: #fff; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px; }
    .col a { color: #dcb9b6; text-decoration: none; font-size: 0.92rem; }
    .col a:hover { color: #fff; }
    .bottom { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.12); padding: 16px 5%; font-size: 0.8rem; color: #b8938f; flex-wrap: wrap; gap: 8px; }
    .dashes { letter-spacing: 2px; }
    @media (max-width: 720px) { .grid { grid-template-columns: 1fr 1fr; } }
  `],
})
export class FooterComponent {
  year = new Date().getFullYear();
}
