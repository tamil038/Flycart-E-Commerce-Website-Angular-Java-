# 🛫 Flycart — Full-Stack E-Commerce Storefront

Flycart is a two-part e-commerce project: a modern **Angular 17** storefront and a **Spring Boot 3 (Java 21)** REST API. The two apps currently run side by side as independent, fully working systems — the frontend uses browser `localStorage` for its data today, and the backend exposes a complete REST API backed by an H2 database, ready to be wired in.

```
flycart-fullstack/
├── frontend/     Angular 17 storefront (what shoppers see)
└── backend/      Spring Boot REST API (Java 21, H2 database, JWT auth)
```

---

## ✨ Features

**Storefront (frontend)**
- Product catalog with search, category filters, and sorting (relevance, price, rating)
- Product detail pages with image gallery, quantity stepper, highlights, and customer reviews
- Wishlist with heart-icon toggle on every product card
- Cart and checkout flow with coupon codes (`FLY10`, `WELCOME15`, `FIRST50`)
- Visual order-tracking stepper (Processing → Packed → Shipped → Out for Delivery → Delivered)
- Toast notifications, animated route-loading bar, mobile nav drawer
- Signals-based reactive state (`signal()` / `computed()`) instead of manual re-renders
- Lazy-loaded standalone components per route, route guards for checkout/orders/profile

**API (backend)**
- JWT-based authentication (signup/login)
- Product, cart, wishlist, order, and profile endpoints
- Server-side coupon validation matching the frontend's rules
- H2 file-based database, auto-seeded with a 12-product catalog on first run
- Global exception handling with clean JSON error responses
- Spring Security filter chain with CORS configured for the Angular dev server

> **Current status:** the two apps are not yet wired together. The frontend works entirely on its own using `localStorage`; the backend is a complete, independent API. See [Connecting frontend to backend](#connecting-frontend-to-backend) below.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17 (standalone components), TypeScript, SCSS, RxJS, Signals |
| Backend | Spring Boot 3.3.5, Java 21, Spring Security, Spring Data JPA |
| Database | H2 (file-based, `./data/flycartdb.mv.db`) |
| Auth | JWT (`jjwt` 0.11.5) |
| Build tools | npm / Angular CLI, Maven |

---

## 📋 Requirements

| Tool | Needed for | Check with |
|---|---|---|
| Node.js 18+ | frontend | `node -v` |
| Java 21 (or your installed JDK) | backend | `java -version` |
| Maven | backend | `mvn -v` |

---

## 🚀 Quick Start

**1. Start the backend** (auto-seeds the H2 database on first run):

```bash
cd backend
mvn spring-boot:run
```
Runs on **http://localhost:8080**.

**2. Start the frontend**, in a second terminal:

```bash
cd frontend
npm install
npm start
```
Runs on **http://localhost:4200**.

**3. Open http://localhost:4200** in your browser. Login accepts any email + password (frontend demo mode, no backend call yet).

**Build the frontend for production:**
```bash
cd frontend
npm run build
```
Output goes to `dist/flycart/browser` — deploy to any static host (Netlify, Vercel, GitHub Pages, S3, etc).

---

## 📁 Project Structure

**Frontend** (`frontend/src/app/`)
```
core/
  models/      Product, Order, CartItem interfaces
  services/    CartService, WishlistService, AuthService, OrderService, ProductService, ToastService
  guards/      authGuard
shared/
  navbar, footer, toast, star-rating, product-card, loader-bar
pages/
  auth, home, products, product-detail, cart, wishlist,
  checkout, order-complete, orders, profile, about, contact, not-found
```

**Backend** (`backend/src/main/java/com/flycart/backend/`)
```
model/        User, Product, Review, CartItem, WishlistItem, Order, OrderItem, OrderStage
repository/   Spring Data JPA repositories
dto/          Request/response records (AuthDtos, ProductDtos, CartDtos, OrderDtos, ProfileDtos)
service/      Business logic (AuthService, ProductService, CartService, WishlistService, OrderService, CouponService, UserService)
controller/   REST endpoints
security/     JwtService, JwtAuthFilter, CustomUserDetailsService
config/       SecurityConfig (JWT filter chain, CORS, password encoding)
exception/    ApiException + global @RestControllerAdvice
seed/         DataSeeder — inserts the product catalog on first run
```

---

## 🔌 API Reference

Base path: `/api`. Endpoints marked 🔒 require an `Authorization: Bearer <token>` header (returned from login/signup).

### Auth
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/auth/signup` | `{ name, email, password }` |
| POST | `/api/auth/login` | `{ email, password }` |

Both return `{ token, profile: { name, email, address } }`.

### Products (public)
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/products?category=&term=&sort=` | `sort` = `relevance` \| `price-asc` \| `price-desc` \| `rating` |
| GET | `/api/products/featured` | Bestseller-tagged products |
| GET | `/api/products/{id}` | Single product |
| GET | `/api/products/{id}/reviews` | Reviews for a product |
| GET | `/api/products/{id}/related` | Same-category products |

### Cart 🔒
| Method | Endpoint | Body |
|---|---|---|
| GET | `/api/cart` | — |
| POST | `/api/cart` | `{ productId, qty }` |
| PUT | `/api/cart/{productId}` | `{ qty }` (absolute) |
| DELETE | `/api/cart/{productId}` | — |
| DELETE | `/api/cart` | Clears the whole cart |

### Wishlist 🔒
| Method | Endpoint | Notes |
|---|---|---|
| GET | `/api/wishlist` | List of saved products |
| POST | `/api/wishlist/{productId}` | Toggles saved/unsaved, returns `{ saved: true/false }` |

### Orders 🔒
| Method | Endpoint | Body |
|---|---|---|
| POST | `/api/orders` | `{ customer: {name, phone, address, city, state, zip}, payment, couponCode }` |
| GET | `/api/orders` | List your orders, most recent first |
| GET | `/api/orders/{id}` | One order |
| PATCH | `/api/orders/{id}/advance` | Moves the order to its next tracking stage (demo) |

### Profile 🔒
| Method | Endpoint | Body |
|---|---|---|
| GET | `/api/profile` | — |
| PUT | `/api/profile` | `{ name, address }` |

### H2 Console (optional)
Visit **http://localhost:8080/h2-console**:
- JDBC URL: `jdbc:h2:file:./data/flycartdb`
- User: `sa` · Password: *(blank)*

Data persists in `./data/flycartdb.mv.db` across restarts — delete that file for a clean slate.

---

## 🔗 Connecting Frontend to Backend

Right now the Angular app reads/writes everything through `localStorage`, and the API sits unused. To wire them together:

1. Point `ProductService`, `CartService`, `WishlistService`, `AuthService`, and `OrderService` at `http://localhost:8080/api` using `HttpClient` instead of `localStorage`.
2. Store the JWT returned from login/signup (e.g. in a signal, persisted to `localStorage` just for the token).
3. Add an `HttpInterceptor` that attaches `Authorization: Bearer <token>` to requests hitting any 🔒 endpoint.
4. Update `app.config.ts` to provide `HttpClient` and the interceptor.

Since every component already consumes these services through Angular's DI, no other component code needs to change.

---

## ⚠️ Known Issues / Notes

- **Backend has not been run through a live Maven build** in the environment it was authored in (no network access to Maven Central there). Run `mvn spring-boot:run` yourself as the first sanity check — if anything fails to compile, it's a quick fix.
- **JWT secret in `application.properties` is a placeholder** (`app.jwt.secret=...change-this-in-production...`). Replace it with a securely generated secret before any real deployment, and load it from an environment variable rather than committing it.
- Frontend and backend are **not yet integrated** (see above) — this is expected, not a bug.

---

## 🗺️ Roadmap

- [ ] Wire Angular services to the Spring Boot API via `HttpClient`
- [ ] Move JWT secret and other config to environment variables
- [ ] Add automated tests (frontend: Karma/Jasmine or Jest; backend: `spring-boot-starter-test` is already a dependency)
- [ ] CI pipeline (GitHub Actions) for build + test on push
- [ ] Deploy frontend (static host) and backend (container/VM) separately

---

## 📄 License

Add a license of your choice (e.g. MIT) here before making the repository public.
