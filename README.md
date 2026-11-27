# Tienda Liebre — E-Commerce Web Application

**Tienda Liebre** is a modern, full-featured e-commerce web application built with **React**, **TypeScript**, and **Vite**. It delivers a complete online shopping experience—including interactive **3D product previews**, category-based discounts, a multi-step checkout with credit card preview and installment plans, a virtual shopping assistant (**TilliBot**), light/dark themes, and a dedicated **Admin Panel** for inventory and user management.

---

## Features

- **Storefront & Promotions**
  - Editorial hero carousel, Black Friday countdown banner, featured products carousel, and category-grouped **Best Sellers** flip cards.
  - Dynamic category-based discounts: **45% OFF** on smartphones, **15% OFF** on vehicles, **25% OFF** on cameras & accessories, and **30% OFF** on gaming products.
- **Catalog, Search & Filtering**
  - Search by product name, SKU code, or category, filter by stock/category, and sort products across `/productos` and `/categoria/:slug`.
- **Interactive Product Pages & 3D Viewer**
  - Color variant galleries, interactive **360° 3D glTF 2.0 models** powered by `@google/model-viewer`, full technical specifications, related products, and customer reviews persisted in `localStorage`.
- **Cart & Multi-Step Checkout**
  - Persistent shopping cart with stock limits and promo code support (`LIEBRE25` for **25% OFF**).
  - Live credit card preview (`react-credit-cards-2`) with automatic brand detection and dynamic installment plans:
    - **Visa:** 1, 3, 6, 9, and up to **12 interest-free installments**
    - **Mastercard:** 1, 3, 6, 9, 12, and up to **18 interest-free installments**
    - **American Express:** up to **6 interest-free installments** (plus 9 and 12 financed)
  - Order confirmation with a **printable invoice**.
- **Authentication, Profile & Wishlist**
  - Registration, login, protected routes, editable profile data, saved payment card for shopper accounts, and per-user wishlist (`/favoritos`).
- **Admin Dashboard (`/admin`)**
  - Inventory KPIs (total products, accumulated stock, low-stock alerts, registered users).
  - Full product CRUD with unique SKU validation and mandatory product image support (either **Image URL** or **Upload from PC** via click/drag-and-drop with WebP optimization for `localStorage`).
  - Registered user management with root-admin protection.
- **TilliBot Virtual Assistant**
  - Interactive chat assistant that searches products by category or budget, compares models side by side, checks cart status, explains installment/coupon options, and links to WhatsApp support.
- **Additional Flows & UX**
  - **Sell My Product** submission form, **Resellers** section, **How to Get There** store location, **About Us**, custom **404** error page, and **Light / Dark mode** toggle.

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Core** | React 19, TypeScript, Vite 8, React Compiler (`babel-plugin-react-compiler`) |
| **Routing** | React Router DOM v7 |
| **Forms & Validation** | React Hook Form, Zod v4, `@hookform/resolvers` |
| **3D & UI** | `@google/model-viewer`, `react-credit-cards-2`, `react-icons`, Custom CSS Variables |
| **Tooling & Deployment** | `pnpm`, ESLint 10, `typescript-eslint`, Vercel (`vercel.json` SPA rewrites) |

---

## Demo Accounts & Promo Code

All accounts, inventory changes, reviews, cart items, and wishlists are stored locally in the browser (`localStorage`).

| Role | Name | Email | Password |
| --- | --- | --- | --- |
| **Admin** | Sofía Admin | `admin@tiendaliebre.com` | `Admin1234` |
| **Guest** | Micaela Soraire | `mmicaslo@gmail.com` | `Invitado123` |
| **Guest** | Juan Pablo Reyes | `juan.reyes@gmail.com` | `Invitado456` |

- **Checkout Promo Code:** `LIEBRE25` (**25% OFF**)

---

## Getting Started

### Prerequisites

- **Node.js** `>= 20`
- **pnpm** (`npm install -g pnpm` or enable via `corepack enable`)

### Installation & Local Development

```bash
# 1. Clone the repository
git clone https://github.com/micaslo/modulo2-ecommercepro.git
cd modulo2-ecommercepro

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

### Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Starts the Vite development server with HMR and serves 3D model assets. |
| `pnpm build` | Runs TypeScript type-checking (`tsc -b`) and builds the production bundle (`vite build`). |
| `pnpm preview` | Previews the production build locally. |
| `pnpm lint` | Runs ESLint across the entire repository. |

---

## Project Structure

```text
src/
├── assets/          # Images, logos, and 3D glTF models
├── components/      # Reusable UI components (Navbar, Footer, BestSellers, Checkout, Admin, TilliBot, etc.)
├── context/         # AuthProvider, ThemeProvider, and React contexts
├── data/            # Seed products, product details, media mappings, checkout config, and categories
├── hooks/           # Custom hooks (useAuth, useCart, useProducts, useWishlist, form hooks)
├── pages/           # Route-level pages (Hero, Catalog, Category, Product, Cart, Admin, Profile, Login, etc.)
├── routes/          # ProtectedRoute wrapper for authenticated and admin-only routes
├── schemas/         # Zod validation schemas for auth, checkout, products, resellers, and reviews
├── services/        # TilliBot recommendation & conversation engine
├── types/           # TypeScript interfaces and domain types
└── utils/           # Helpers for routing and wishlist persistence
```

---

## Team

- **Micaela** — Tech Leader (TL)
- **Juan Pablo** — Scrum Master
- **Luis** — Developer
- **Rosario** — Developer
