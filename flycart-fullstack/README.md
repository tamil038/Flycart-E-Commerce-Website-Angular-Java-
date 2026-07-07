# Flycart 🛫 — Full Stack

One folder, two projects:

```
flycart-fullstack/
  frontend/     Angular 17 storefront (what shoppers see)
  backend/      Spring Boot REST API (Java 21, H2 database, JWT auth)
```

They're two separate apps that talk to each other over HTTP — not one build. You run each with its
own tool (`npm` for the frontend, `mvn` for the backend), normally in two separate terminals.

## Quick start

**1. Start the backend first** (it needs to be up before the frontend can log in or load products
from it — though right now the frontend still works standalone using its own `localStorage`, see
note below):

```bash
cd backend
mvn spring-boot:run
```
Runs on **http://localhost:8080**. First run auto-seeds the database with the product catalog.

**2. Start the frontend, in a second terminal:**

```bash
cd frontend
npm install
npm start
```
Runs on **http://localhost:4200**.

**3. Open http://localhost:4200 in your browser.**

## Important: these two aren't wired together yet

Right now:
- **`frontend/`** stores everything (cart, wishlist, orders, login) in the browser's `localStorage` —
  it works completely on its own, with no backend required.
- **`backend/`** exposes a full REST API (`/api/auth`, `/api/products`, `/api/cart`, `/api/wishlist`,
  `/api/orders`, `/api/profile`) backed by a real H2 database — but nothing in the Angular app calls
  it yet.

They're sitting side by side, both fully working independently, but not yet connected. If you want
the frontend to actually read/write through the backend's API instead of `localStorage` — real
accounts, a real database, cart/orders that survive clearing your browser — that's the next step:
updating Angular's services (`CartService`, `AuthService`, `ProductService`, etc.) to call the API via
`HttpClient`, plus a small interceptor to attach your login token to requests. Ask for that whenever
you're ready and it'll be wired up.

## Where to look next

- `frontend/README.md` — Angular project structure, scripts, build notes
- `backend/README.md` — full API reference (every endpoint, request/response shapes), how the
  database and JWT auth work, and a note on what's been verified vs. not

## Requirements to run everything

| Tool | Needed for | Check with |
|---|---|---|
| Node.js 18+ | frontend | `node -v` |
| Java 21 (or your installed JDK) | backend | `java -version` |
| Maven | backend | `mvn -v` |
