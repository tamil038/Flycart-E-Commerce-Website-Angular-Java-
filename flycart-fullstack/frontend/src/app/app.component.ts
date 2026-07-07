import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';
import { LoaderBarComponent } from './shared/loader-bar/loader-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, LoaderBarComponent],
  template: `
    <app-loader-bar></app-loader-bar>
    <app-navbar></app-navbar>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-toast></app-toast>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    .app-main { flex: 1; }
  `],
})
export class AppComponent {}
