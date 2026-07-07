import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="stars" [attr.aria-label]="rating + ' out of 5 stars'">
      @for (i of [0,1,2,3,4]; track i) {
        <span class="star" [class.filled]="i < Math.round(rating)">★</span>
      }
    </span>
    @if (showCount) {
      <span class="count">({{ count }})</span>
    }
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; gap: 6px; }
    .stars { display: inline-flex; gap: 1px; font-size: 0.95em; }
    .star { color: var(--fc-border); }
    .star.filled { color: var(--fc-gold); }
    .count { color: var(--fc-muted); font-size: 0.85em; font-weight: 600; }
  `],
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() count = 0;
  @Input() showCount = true;
  protected Math = Math;
}
