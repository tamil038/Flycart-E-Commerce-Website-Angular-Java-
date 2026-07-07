import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="center container">
      <div class="art">✈️</div>
      <h1>404</h1>
      <p>This page took a wrong turn somewhere over the clouds.</p>
      <a routerLink="/home" class="btn btn-primary">Back to Home</a>
    </main>
  `,
  styles: [`
    .center { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; padding: 40px 0; }
    .art { font-size: 3rem; margin-bottom: 6px; }
    h1 { font-size: 3rem; color: var(--fc-red); }
    p { color: var(--fc-muted); margin-bottom: 12px; }
  `],
})
export class NotFoundComponent {}
