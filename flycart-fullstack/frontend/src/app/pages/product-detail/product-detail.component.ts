import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent, ProductCardComponent],
  template: `
    @if (product(); as p) {
      <main class="page container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a routerLink="/home">Home</a> / <a routerLink="/products">Products</a> / <span>{{ p.name }}</span>
        </nav>

        <div class="detail-grid">
          <div class="gallery">
            <img [src]="p.image" [alt]="p.name">
            @if (p.mrp > p.price) { <span class="discount">{{ discountPct() }}% OFF</span> }
          </div>

          <div class="info">
            <span class="cat">{{ p.category }}</span>
            <h1>{{ p.name }}</h1>
            <app-star-rating [rating]="p.rating" [count]="p.reviewCount"></app-star-rating>

            <div class="price-row">
              <span class="price">₹{{ p.price | number }}</span>
              @if (p.mrp > p.price) {
                <span class="mrp">₹{{ p.mrp | number }}</span>
                <span class="save">You save ₹{{ p.mrp - p.price | number }}</span>
              }
            </div>

            <p class="desc">{{ p.description }}</p>

            <ul class="highlights">
              @for (h of p.highlights; track h) { <li>{{ h }}</li> }
            </ul>

            <p class="stock" [class.low]="p.stock <= 5">
              {{ p.stock > 5 ? '✔ In stock' : '⚠ Only ' + p.stock + ' left in stock' }}
            </p>

            <div class="actions">
              <div class="qty">
                <button (click)="qty.set(Math.max(1, qty() - 1))" aria-label="Decrease quantity">−</button>
                <span>{{ qty() }}</span>
                <button (click)="qty.set(Math.min(p.stock, qty() + 1))" aria-label="Increase quantity">+</button>
              </div>
              <button class="btn btn-primary" (click)="cart.add(p, qty())">Add to Cart</button>
              <button class="btn btn-outline" (click)="wishlist.toggle(p.id, p.name)">
                {{ wishlist.has(p.id) ? '♥ Saved' : '♡ Save for later' }}
              </button>
            </div>

            <div class="perks">
              <span>🚚 Free delivery over ₹1,999</span>
              <span>↩ 7-day easy returns</span>
              <span>🔒 Secure checkout</span>
            </div>
          </div>
        </div>

        <section class="reviews">
          <h2>Customer Reviews</h2>
          @if (reviews().length === 0) {
            <p class="muted">No reviews yet for this product.</p>
          } @else {
            <div class="review-list">
              @for (r of reviews(); track r.id) {
                <div class="review card">
                  <div class="review-head">
                    <strong>{{ r.author }}</strong>
                    <app-star-rating [rating]="r.rating" [showCount]="false"></app-star-rating>
                  </div>
                  <p>{{ r.comment }}</p>
                  <span class="date">{{ r.date }}</span>
                </div>
              }
            </div>
          }
        </section>

        @if (related().length > 0) {
          <section class="related">
            <h2>You may also like</h2>
            <div class="product-grid">
              @for (rp of related(); track rp.id) {
                <app-product-card [product]="rp"></app-product-card>
              }
            </div>
          </section>
        }
      </main>
    } @else {
      <div class="container not-found">
        <h2>Product not found</h2>
        <a routerLink="/products" class="btn btn-primary">Back to products</a>
      </div>
    }
  `,
  styles: [`
    .page { padding: 32px 0 70px; }
    .crumbs { font-size: 0.85rem; color: var(--fc-muted); margin-bottom: 20px; }
    .crumbs a { color: var(--fc-muted); text-decoration: none; }
    .crumbs span { color: var(--fc-ink); font-weight: 600; }

    .detail-grid { display: grid; grid-template-columns: 1fr 1.1fr; gap: 44px; margin-bottom: 60px; }
    .gallery { position: relative; background: var(--fc-bg-alt); border-radius: var(--radius-lg); overflow: hidden; }
    .gallery img { width: 100%; height: 420px; object-fit: cover; }
    .discount { position: absolute; top: 16px; left: 16px; background: var(--fc-red); color: #fff; font-weight: 800; font-size: 0.75rem; padding: 6px 12px; border-radius: 8px; }

    .info { display: flex; flex-direction: column; gap: 12px; }
    .cat { color: var(--fc-coral); font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; }
    .info h1 { font-size: 1.9rem; color: var(--fc-ink); }
    .price-row { display: flex; align-items: baseline; gap: 12px; margin: 4px 0; flex-wrap: wrap; }
    .price { font-size: 1.7rem; font-weight: 800; color: var(--fc-red); }
    .mrp { text-decoration: line-through; color: var(--fc-muted-2); }
    .save { color: var(--fc-success); font-weight: 700; font-size: 0.85rem; background: var(--fc-success-bg); padding: 3px 10px; border-radius: 999px; }
    .desc { color: var(--fc-muted); line-height: 1.6; }
    .highlights { padding-left: 18px; color: var(--fc-ink); display: flex; flex-direction: column; gap: 6px; }
    .stock { font-weight: 700; color: var(--fc-success); font-size: 0.9rem; }
    .stock.low { color: var(--fc-red); }

    .actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-top: 6px; }
    .qty { display: inline-flex; align-items: center; gap: 12px; background: var(--fc-bg-alt); border-radius: 999px; padding: 6px 14px; }
    .qty button { width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--fc-red); color: #fff; font-weight: 800; cursor: pointer; }
    .qty span { min-width: 18px; text-align: center; font-weight: 700; }

    .perks { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 12px; font-size: 0.82rem; color: var(--fc-muted); }

    .reviews, .related { margin-bottom: 56px; }
    .reviews h2, .related h2 { margin-bottom: 18px; font-size: 1.4rem; }
    .review-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
    .review { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
    .review-head { display: flex; justify-content: space-between; align-items: center; }
    .review .date { font-size: 0.75rem; color: var(--fc-muted-2); }
    .muted { color: var(--fc-muted); }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .not-found { text-align: center; padding: 100px 0; display: flex; flex-direction: column; gap: 16px; align-items: center; }

    @media (max-width: 860px) { .detail-grid { grid-template-columns: 1fr; } .gallery img { height: 300px; } }
  `],
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  cart = inject(CartService);
  wishlist = inject(WishlistService);
  protected Math = Math;

  qty = signal(1);
  private paramMap = toSignal(this.route.paramMap);

  product = computed(() => {
    const id = Number(this.paramMap()?.get('id'));
    return this.productService.getById(id);
  });

  constructor() {
    effect(() => {
      this.product();
      this.qty.set(1);
    });
  }

  reviews = computed(() => this.productService.getReviews(this.product()?.id ?? -1));
  related = computed(() => {
    const p = this.product();
    return p ? this.productService.getRelated(p) : [];
  });

  discountPct(): number {
    const p = this.product();
    if (!p) return 0;
    return Math.round(((p.mrp - p.price) / p.mrp) * 100);
  }
}
