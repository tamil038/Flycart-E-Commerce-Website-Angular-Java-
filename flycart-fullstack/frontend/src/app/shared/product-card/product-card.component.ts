import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, StarRatingComponent],
  template: `
    <div class="product-card">
      <a [routerLink]="['/products', product.id]" class="thumb-link">
        <img [src]="product.image" [alt]="product.name" loading="lazy">
        @if (product.mrp > product.price) {
          <span class="discount">{{ discountPct() }}% OFF</span>
        }
        @if (product.stock <= 5) {
          <span class="low-stock">Only {{ product.stock }} left</span>
        }
        <button class="wish-btn" (click)="onWish($event)" [attr.aria-pressed]="wishlist.has(product.id)" aria-label="Toggle wishlist">
          {{ wishlist.has(product.id) ? '♥' : '♡' }}
        </button>
      </a>
      <div class="body">
        <span class="cat">{{ product.category }}</span>
        <a [routerLink]="['/products', product.id]" class="name">{{ product.name }}</a>
        <app-star-rating [rating]="product.rating" [count]="product.reviewCount"></app-star-rating>
        <div class="price-row">
          <span class="price">₹{{ product.price | number }}</span>
          @if (product.mrp > product.price) { <span class="mrp">₹{{ product.mrp | number }}</span> }
        </div>
        <button class="btn btn-primary btn-sm btn-block" (click)="cart.add(product)">Add to Cart</button>
      </div>
    </div>
  `,
  styles: [`
    .product-card { background: var(--fc-card); border: 1px solid var(--fc-border); border-radius: var(--radius-md); overflow: hidden; transition: 0.2s; display: flex; flex-direction: column; height: 100%; }
    .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .thumb-link { position: relative; display: block; }
    .thumb-link img { width: 100%; height: 190px; object-fit: cover; background: var(--fc-bg-alt); }
    .discount { position: absolute; top: 10px; left: 10px; background: var(--fc-red); color: #fff; font-size: 0.68rem; font-weight: 800; padding: 4px 8px; border-radius: 6px; }
    .low-stock { position: absolute; bottom: 10px; left: 10px; background: var(--fc-ink); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 3px 8px; border-radius: 6px; opacity: 0.85; }
    .wish-btn { position: absolute; top: 8px; right: 8px; background: #fff; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1rem; color: var(--fc-red); box-shadow: var(--shadow-sm); }
    .body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
    .cat { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fc-coral); }
    .name { font-weight: 700; text-decoration: none; color: var(--fc-ink); font-size: 0.98rem; }
    .price-row { display: flex; align-items: baseline; gap: 8px; margin-top: auto; }
    .price { font-weight: 800; color: var(--fc-red); font-size: 1.05rem; }
    .mrp { text-decoration: line-through; color: var(--fc-muted-2); font-size: 0.85rem; }
  `],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() wished = new EventEmitter<Product>();

  cart = inject(CartService);
  wishlist = inject(WishlistService);

  discountPct(): number {
    return Math.round(((this.product.mrp - this.product.price) / this.product.mrp) * 100);
  }

  onWish(ev: Event): void {
    ev.preventDefault();
    ev.stopPropagation();
    this.wishlist.toggle(this.product.id, this.product.name);
    this.wished.emit(this.product);
  }
}
