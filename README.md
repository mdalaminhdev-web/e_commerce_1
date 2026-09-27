# 🌿 BD Organic Food & Grocery E-Commerce Platform

A production-grade, fast, and conversion-optimized e-commerce web application designed for organic grocery, honey, mustard oil, ghee, and natural lifestyle products in Bangladesh. Inspired by local e-commerce leaders like *Ghorer Bazar*, this platform solves operational challenges specific to the Bangladeshi market (Cash on Delivery dominance, flat-rate delivery zones, phone-number-based ordering, and 3PL courier integrations).

---

## ✨ Key Features

### 🛒 Customer Storefront
- **Modern Blue & Clean UI:** Clean typography, lightweight cards, and mobile-first responsive design.
- **Dynamic Product Variants:** Seamless weight selection (e.g., 250g, 500g, 1kg, 5L) with instant price and stock synchronization.
- **Fast Search & Category Navigation:** Debounced live search preview and touch-friendly circular category slider.
- **One-Page Frictionless Checkout:**
  - Designed specifically for the BD market: No complex registration required.
  - Direct zone switcher: **ঢাকার ভিতরে (Inside Dhaka: ৳70)** vs. **ঢাকার বাইরে (Outside Dhaka: ৳130)** with real-time recalculation.
  - Cash on Delivery (COD) default flow with instant confirmation.
- **Mobile Bottom App-Bar:** Native mobile app feel with quick navigation between Home, Categories, Cart, and Admin.

### 🛡️ Admin & Operations Hub
- **KPI Overview Dashboard:** Real-time metrics for daily revenue, total orders, pending orders, and fulfillment status.
- **Order Management:** Status transitions (`pending` → `confirmed` → `processing` → `handed_over` → `delivered`).
- **One-Click Courier Handoff:** Ready-to-use API integration template for **Steadfast Courier** to auto-generate tracking numbers.
- **POS Thermal Invoice Memo:** Browser-printable 80mm POS receipt layout for warehouse dispatch.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6
- **Backend:** Node.js, Express.js, REST API architecture
- **Database:** MySQL 8.0+ with connection pooling (`mysql2/promise`)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Logistics Integration:** Steadfast Courier API contract

---

## 📂 Project Directory Structure

```text
├── backend/
│   ├── database/
│   │   └── schema.sql              # MySQL DDL & Seed Data
│   ├── src/
│   │   ├── config/                 # DB pool & environment loaders
│   │   ├── controllers/            # Auth, Product, Order & Courier logic
│   │   ├── middlewares/            # JWT Guard & Error Handlers
│   │   └── routes/                 # API endpoint routing
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Express application entrypoint
└── frontend/
    ├── src/
    │   ├── components/             # Reusable UI cards, Navbar, Mobile Nav
    │   ├── context/                # Cart & Delivery Zone State Management
    │   ├── pages/                  # Storefront & Admin Backoffice pages
    │   ├── App.jsx
    │   ├── index.css               # Tailwind directives
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
