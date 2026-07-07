import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/auth/auth.component').then((m) => m.AuthComponent), title: 'Flycart | Login' },
  { path: 'home', loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent), title: 'Flycart | Home' },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent), title: 'Flycart | Products' },
  { path: 'products/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent), title: 'Flycart | Product' },
  { path: 'wishlist', loadComponent: () => import('./pages/wishlist/wishlist.component').then((m) => m.WishlistComponent), title: 'Flycart | Wishlist' },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent), title: 'Flycart | Cart' },
  { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent), title: 'Flycart | Checkout' },
  { path: 'order-complete', canActivate: [authGuard], loadComponent: () => import('./pages/order-complete/order-complete.component').then((m) => m.OrderCompleteComponent), title: 'Flycart | Order Placed' },
  { path: 'orders', canActivate: [authGuard], loadComponent: () => import('./pages/orders/orders.component').then((m) => m.OrdersComponent), title: 'Flycart | My Orders' },
  { path: 'profile', canActivate: [authGuard], loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent), title: 'Flycart | Profile' },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutComponent), title: 'Flycart | About' },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactComponent), title: 'Flycart | Contact' },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent), title: 'Flycart | Not Found' },
];
