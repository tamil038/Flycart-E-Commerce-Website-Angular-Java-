import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES, ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <section class="hero">
      <div class="container inner">
        <div class="copy fc-animate-in">
          <span class="eyebrow">Free delivery on orders over ₹1,999</span>
          <h1>Shop fast.<br>Land happy.</h1>
          <p>Flycart curates the good stuff — electronics, fashion, home and more — and gets it to your door quicker than you'd expect.</p>
          <div class="cta-row">
            <button class="btn btn-primary" (click)="router.navigate(['/products'])">Shop Now</button>
            <button class="btn btn-outline" (click)="router.navigate(['/products'])">Browse Categories</button>
          </div>
          <div class="stats">
            <div><strong>12k+</strong><span>Happy shoppers</span></div>
            <div><strong>4.4★</strong><span>Average rating</span></div>
            <div><strong>24hr</strong><span>Express dispatch</span></div>
          </div>
        </div>
        <div class="art" aria-hidden="true">
          <div class="orbit"></div>
          <div class="card1">🛍️ New Arrivals</div>
          <div class="card2">🚚 Fast Delivery</div>
          <div class="card3">⭐ Top Rated</div>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <div>
          <span class="eyebrow">Browse</span>
          <h2>Shop by Category</h2>
        </div>
      </div>
      <div class="category-grid">
        @for (cat of categories; track cat) {
          <a class="category-card" [routerLink]="['/products']" [queryParams]="{ category: cat }">
            <span class="emoji">{{ categoryEmoji(cat) }}</span>
            {{ cat }}
          </a>
        }
      </div>
    </section>

    <section class="section container">
      <div class="section-head">
        <div>
          <span class="eyebrow">Handpicked</span>
          <h2>Bestsellers Right Now</h2>
        </div>
        <a routerLink="/products" class="see-all">See all products →</a>
      </div>
      <div class="product-grid">
        @for (p of featured; track p.id) {
          <app-product-card [product]="p"></app-product-card>
        }
      </div>
    </section>

    <section class="promo container">
      <div class="promo-card">
        <div>
          <span class="eyebrow" style="color:#fff9">Limited time</span>
          <h2>Take 10% off your first flight</h2>
          <p>Use code <strong>FLY10</strong> at checkout on any order over ₹999.</p>
        </div>
        <button class="btn" style="background:#fff;color:var(--fc-red-dark)" (click)="router.navigate(['/products'])">Start Shopping</button>
      </div>
    </section>
  `,
  styles: [`
    .hero { background: var(--fc-bg-alt); overflow: hidden; }
    .hero .inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 40px; align-items: center; padding: 64px 0; }
    .hero h1 { font-size: 3rem; line-height: 1.05; margin: 12px 0 16px; color: var(--fc-ink); }
    .hero p { color: var(--fc-muted); max-width: 460px; line-height: 1.55; margin-bottom: 22px; }
    .cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .stats { display: flex; gap: 28px; margin-top: 34px; }
    .stats strong { display: block; font-family: var(--font-display); font-size: 1.3rem; color: var(--fc-red); }
    .stats span { font-size: 0.8rem; color: var(--fc-muted); }

    .art { position: relative; height: 320px; }
    .orbit { position: absolute; inset: 8%; border: 2px dashed var(--fc-coral); border-radius: 50%; opacity: 0.35; animation: spin 30s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .card1, .card2, .card3 {
      position: absolute; background: #fff; border-radius: 14px; box-shadow: var(--shadow-lg);
      padding: 14px 18px; font-weight: 700; font-size: 0.9rem; color: var(--fc-ink);
      animation: float 5s ease-in-out infinite;
    }
    .card1 { top: 8%; left: 10%; }
    .card2 { top: 45%; right: 4%; animation-delay: 1s; }
    .card3 { bottom: 6%; left: 22%; animation-delay: 2s; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

    .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; }
    .category-card {
      background: var(--fc-card); border: 1px solid var(--fc-border); border-radius: var(--radius-md);
      padding: 26px 16px; text-align: center; font-weight: 700; color: var(--fc-ink); text-decoration: none;
      display: flex; flex-direction: column; align-items: center; gap: 10px; transition: 0.2s;
    }
    .category-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); color: var(--fc-red); }
    .emoji { font-size: 1.8rem; }

    .see-all { color: var(--fc-red); font-weight: 700; text-decoration: none; font-size: 0.9rem; }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }

    .promo { padding: 20px 5% 70px; }
    .promo-card {
      background: var(--fc-gradient-deep); color: #fff; border-radius: var(--radius-lg);
      padding: 44px; display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
    }
    .promo-card h2 { font-size: 1.8rem; margin: 10px 0; }
    .promo-card p { opacity: 0.95; }

    @media (max-width: 900px) { .hero .inner { grid-template-columns: 1fr; } .art { display: none; } .hero h1 { font-size: 2.2rem; } }
  `],
})
export class HomeComponent {
  private products = inject(ProductService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  router = inject(Router);

  categories = CATEGORIES.filter((c) => c !== 'All');
  featured = this.products.getFeatured();

  categoryEmoji(cat: string): string {
    const map: Record<string, string> = {
      Electronics: '🎧', Fashion: '🕶️', 'Home & Kitchen': '☕', 'Sports & Fitness': '🏃', Beauty: '💄',
    };
    return map[cat] || '🛍️';
  }
}
