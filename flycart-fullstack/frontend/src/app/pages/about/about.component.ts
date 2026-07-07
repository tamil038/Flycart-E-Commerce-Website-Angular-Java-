import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="page container">
      <h1>About Flycart</h1>
      <div class="hero-card">
        <p class="lead">Founded in 2026, Flycart exists for one simple reason: shopping should feel light, quick, and a little bit fun — not like a chore.</p>
      </div>
      <div class="grid">
        <div class="card">
          <span class="icon">✈️</span>
          <h3>Fast by design</h3>
          <p>From browsing to doorstep, we cut every unnecessary step so orders land quicker.</p>
        </div>
        <div class="card">
          <span class="icon">🎯</span>
          <h3>Curated, not cluttered</h3>
          <p>Every product on Flycart is picked for quality — we'd rather stock less and stock well.</p>
        </div>
        <div class="card">
          <span class="icon">🤝</span>
          <h3>Built on trust</h3>
          <p>Transparent pricing, honest reviews, and easy 7-day returns on everything we sell.</p>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .page { padding: 40px 0 70px; }
    h1 { text-align: center; margin-bottom: 24px; font-size: 2rem; color: var(--fc-ink); }
    .hero-card { background: var(--fc-gradient-deep); color: #fff; border-radius: var(--radius-lg); padding: 40px; text-align: center; margin-bottom: 34px; }
    .lead { font-size: 1.2rem; max-width: 640px; margin: 0 auto; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
    .grid .card { padding: 28px 22px; text-align: center; }
    .icon { font-size: 2rem; display: block; margin-bottom: 12px; }
    .grid h3 { margin-bottom: 8px; font-size: 1.05rem; }
    .grid p { color: var(--fc-muted); font-size: 0.9rem; line-height: 1.5; }
  `],
})
export class AboutComponent {}
