import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <main class="page container">
      <h1>Your Wishlist</h1>
      @if (items().length === 0) {
        <div class="card empty">
          <span class="emoji">♡</span>
          <p>Nothing saved yet — tap the heart on any product to keep it here.</p>
          <a routerLink="/products" class="btn btn-primary">Browse Products</a>
        </div>
      } @else {
        <div class="product-grid">
          @for (p of items(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 30px; font-size: 2rem; color: var(--fc-ink); }
    .empty { text-align: center; padding: 70px 20px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
    .emoji { font-size: 2.4rem; color: var(--fc-red); }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }
  `],
})
export class WishlistComponent {
  private productService = inject(ProductService);
  wishlist = inject(WishlistService);

  items = computed(() => this.wishlist.ids().map((id) => this.productService.getById(id)!).filter(Boolean));
}
