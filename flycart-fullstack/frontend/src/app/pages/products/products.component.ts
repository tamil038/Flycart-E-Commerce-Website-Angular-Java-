import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CATEGORIES, ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <main class="page container">
      <div class="page-head">
        <h1>Explore the Collection</h1>
        <p>{{ results().length }} product{{ results().length === 1 ? '' : 's' }} found</p>
      </div>

      <div class="toolbar">
        <div class="search">
          <span aria-hidden="true">🔎</span>
          <input type="search" placeholder="Search products, categories..." [(ngModel)]="term" (ngModelChange)="onChange()" aria-label="Search products">
        </div>
        <select [(ngModel)]="sort" (ngModelChange)="onChange()" aria-label="Sort products">
          <option value="relevance">Sort: Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <div class="chips">
        @for (cat of categories; track cat) {
          <button class="chip" [class.active]="category === cat" (click)="setCategory(cat)">{{ cat }}</button>
        }
      </div>

      @if (results().length === 0) {
        <div class="empty card">
          <p>No products match your search.</p>
          <button class="btn btn-outline" (click)="reset()">Clear filters</button>
        </div>
      } @else {
        <div class="product-grid">
          @for (p of results(); track p.id) {
            <app-product-card [product]="p"></app-product-card>
          }
        </div>
      }
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 60px; }
    .page-head { text-align: center; margin-bottom: 26px; }
    .page-head h1 { color: var(--fc-ink); font-size: 2.1rem; }
    .page-head p { color: var(--fc-muted); margin-top: 6px; }

    .toolbar { display: flex; gap: 14px; margin-bottom: 18px; flex-wrap: wrap; }
    .search { flex: 1; min-width: 240px; display: flex; align-items: center; gap: 8px; background: #fff; border: 1.5px solid var(--fc-border); border-radius: 999px; padding: 10px 18px; }
    .search input { border: none; outline: none; flex: 1; font-size: 0.95rem; font-family: inherit; }
    .toolbar select { border: 1.5px solid var(--fc-border); border-radius: 999px; padding: 10px 16px; font-family: inherit; background: #fff; font-weight: 600; color: var(--fc-ink); }

    .chips { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 28px; }
    .chip { border: 1.5px solid var(--fc-border); background: #fff; border-radius: 999px; padding: 8px 18px; font-weight: 700; font-size: 0.85rem; cursor: pointer; color: var(--fc-ink); }
    .chip.active { background: var(--fc-gradient); color: #fff; border-color: transparent; }

    .product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 22px; }
    .empty { text-align: center; padding: 60px 20px; display: flex; flex-direction: column; gap: 14px; align-items: center; }
  `],
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  categories = CATEGORIES;
  category = 'All';
  term = '';
  sort = 'relevance';

  private trigger = signal(0);
  results = computed(() => {
    this.trigger();
    return this.productService.search(this.term, this.category, this.sort);
  });

  constructor() {
    const qpCategory = this.route.snapshot.queryParamMap.get('category');
    if (qpCategory) this.category = qpCategory;
    this.onChange();
  }

  setCategory(cat: string): void {
    this.category = cat;
    this.onChange();
  }

  onChange(): void {
    this.trigger.update((v) => v + 1);
  }

  reset(): void {
    this.term = '';
    this.category = 'All';
    this.sort = 'relevance';
    this.onChange();
  }
}
