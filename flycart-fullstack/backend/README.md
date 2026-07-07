# Flycart Backend 🛫

A Spring Boot REST API for the Flycart storefront — Java 21, Spring Security + JWT, Spring Data JPA,
H2 (file-based) database. Covers Auth, Products, Cart, Wishlist, Orders and Profile.

## Requirements

- **Java 21** (JDK). Check with `java -version`. If your machine has a different JDK (e.g. 23) already
  installed for other Spring Boot projects, that works too — just update `<java.version>` in `pom.xml`.
- **Maven** (or use the included `mvnw` wrapper if you add one — this project assumes a system Maven install).

## Run it

```bash
cd flycart-backend
mvn spring-boot:run
```

The API starts on **http://localhost:8080**. On first run, it seeds the H2 database with the same
12-product catalog the Angular frontend uses, so there's real data to hit immediately.

Data is stored in `./data/flycartdb.mv.db` (created automatically) and persists across restarts —
delete that file if you ever want a completely fresh database.

### H2 console (optional, for poking at the data directly)
Visit **http://localhost:8080/h2-console** with:
- JDBC URL: `jdbc:h2:file:./data/flycartdb`
- User: `sa`, Password: *(blank)*

## API Reference

All endpoints are under `/api`. Endpoints marked 🔒 require an `Authorization: Bearer <token>` header
(the token you get back from login/signup).

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
| PUT | `/api/cart/{productId}` | `{ qty }` (absolute, sets the quantity) |
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
| POST | `/api/orders` | `{ customer: {name, phone, address, city, state, zip}, payment, couponCode }` — places an order from the current cart, then clears it |
| GET | `/api/orders` | List your orders, most recent first |
| GET | `/api/orders/{id}` | One order |
| PATCH | `/api/orders/{id}/advance` | Moves the order to its next tracking stage (demo/simulation) |

Coupon codes recognised server-side: `FLY10`, `WELCOME15`, `FIRST50` — same rules as the frontend had.

### Profile 🔒
| Method | Endpoint | Body |
|---|---|---|
| GET | `/api/profile` | — |
| PUT | `/api/profile` | `{ name, address }` |

## Project structure

```
src/main/java/com/flycart/backend/
  model/        User, Product, Review, CartItem, WishlistItem, Order, OrderItem, OrderStage
  repository/   Spring Data JPA repositories
  dto/          Request/response records, grouped by feature (AuthDtos, ProductDtos, CartDtos, OrderDtos, ProfileDtos)
  service/      Business logic (AuthService, ProductService, CartService, WishlistService, OrderService, CouponService, UserService)
  controller/   REST endpoints
  security/     JwtService, JwtAuthFilter, CustomUserDetailsService
  config/       SecurityConfig (JWT filter chain, CORS, password encoding)
  exception/    ApiException + a global @RestControllerAdvice for clean JSON error responses
  seed/         DataSeeder — inserts the product catalog on first run
```

## Connecting the Angular frontend

Point Angular's services at `http://localhost:8080/api` via `HttpClient` instead of `localStorage`.
Store the JWT (e.g. in a signal + `localStorage` just for the token) and attach it as
`Authorization: Bearer <token>` on requests to any 🔒 endpoint using an `HttpInterceptor`.

## A note on verification

This backend was written and carefully reviewed by hand, but — unlike the Angular frontend, which was
built and compiled in a live sandbox — **it has not been run through an actual Maven build**, because
this environment's network doesn't have access to Maven Central to download Spring's dependencies.
Run `mvn spring-boot:run` yourself as the first step; if anything doesn't compile, paste the error back
and it'll get fixed immediately.
