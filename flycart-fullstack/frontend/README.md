# Flycart 🛫

A full, working **Angular 17** e-commerce storefront — rebuilt from the ground up from the original
"Shoppie" static site, renamed to **Flycart**, restyled in a crimson-red brand palette, and extended
with real app architecture instead of copy-pasted HTML pages.

Live demo build already verified with `ng build` (dev + production) — see **Run it** below.

## What's different from the reference site

The original was 10 standalone HTML files sharing one `common.js`. Flycart is a proper Angular app:

- **Real routing & lazy loading** — every page is a lazy-loaded standalone component, so the initial
  bundle is ~96 KB gzipped instead of loading everything up front.
- **Signals-based state** — cart, wishlist, auth and orders are reactive Angular `signal()` services
  with `computed()` totals, instead of re-reading `localStorage` and re-rendering `innerHTML` by hand.
- **New features that didn't exist before:**
  - 🔎 Product **search, category filter & sorting** on the Products page
  - ❤️ A full **Wishlist** page (heart icon on every product card)
  - 📄 A dedicated **Product Detail** page with gallery, quantity stepper, highlights, customer
    reviews and "you may also like" recommendations
  - 🏷️ **Coupon codes** at checkout (`FLY10`, `WELCOME15`, `FIRST50`) with live discount calculation
  - 📦 A visual **order-tracking stepper** (Processing → Packed → Shipped → Out for Delivery →
    Delivered) instead of a chain of `alert()` popups
  - 🔔 A **toast notification** system for add-to-cart, wishlist and form actions
  - ✈️ A "flight path" loading bar that animates across the top of the screen on every route change
  - 🔒 Route guards — checkout, orders and profile require login
  - 📱 Fully responsive, with a mobile nav drawer
- **Red brand system** — crimson `#d62839` + coral `#ff7a59` gradient, paired with a Fraunces/Inter
  type system, replacing the original purple theme entirely.

## Project structure

```
src/app/
  core/
    models/        # Product, Order, CartItem interfaces
    services/       # CartService, WishlistService, AuthService, OrderService, ProductService, ToastService
    guards/          # authGuard
  shared/
    navbar, footer, toast, star-rating, product-card, loader-bar
  pages/
    auth, home, products, product-detail, cart, wishlist,
    checkout, order-complete, orders, profile, about, contact, not-found
```

## Run it

Requires **Node.js 18+**.

```bash
npm install
npm start          # ng serve — http://localhost:4200
```

Login accepts **any email + password** (it's a front-end demo, no backend).

## Build for production

```bash
npm run build
```

Output goes to `dist/flycart/browser`. Deploy that folder to any static host (Netlify, Vercel, GitHub
Pages, S3, etc). The build is already verified to compile cleanly and produces a ~96 KB gzipped
initial bundle with the rest of the pages code-split and lazy-loaded on demand.

> Note: this project links Google Fonts (Fraunces, Inter) directly in `index.html` rather than via
> Angular's build-time font inlining, so it builds correctly in network-restricted environments (like
> CI containers) and simply fetches the fonts at runtime in the browser instead.

## Data

All product, cart, wishlist and order data lives in the browser's `localStorage` — there is no backend.
Swap `ProductService` for a real HTTP call whenever you're ready to connect a backend; every component
already consumes it through Angular's DI, so nothing else needs to change.
