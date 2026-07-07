import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-loader-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading()) {
      <div class="flight-bar" aria-hidden="true">
        <div class="track"></div>
        <div class="plane">✈</div>
      </div>
    }
  `,
  styles: [`
    .flight-bar {
      position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 3000;
      overflow: visible;
    }
    .track {
      position: absolute; inset: 0;
      background: var(--fc-gradient);
      animation: track-grow 0.9s ease-in-out infinite;
      transform-origin: left;
    }
    .plane {
      position: absolute; top: -9px; font-size: 14px;
      animation: plane-fly 0.9s ease-in-out infinite;
    }
    @keyframes track-grow {
      0% { transform: scaleX(0); }
      50% { transform: scaleX(0.7); }
      100% { transform: scaleX(1); }
    }
    @keyframes plane-fly {
      0% { left: 0%; }
      50% { left: 65%; }
      100% { left: 100%; }
    }
  `],
})
export class LoaderBarComponent {
  private router = inject(Router);
  readonly loading = signal(false);

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) this.loading.set(true);
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => this.loading.set(false), 200);
      }
    });
  }
}
