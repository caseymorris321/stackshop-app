# WatersLab

An e-commerce site for water bottles and hydration products. The homepage has a 3D ocean animation (Three.js) and includes calculators for figuring out daily hydration needs and sweat rate.

**Stack:** TanStack Start (React 19), Tailwind CSS, PostgreSQL with Drizzle ORM, Clerk for auth.

## Setup

```bash
npm install
npm run dev
```

Runs on http://localhost:3000

## Project Structure

```
src/
├── routes/          # Pages (index, store, cart, etc.)
├── components/
│   ├── sections/    # Homepage sections
│   ├── layout/      # Nav and footer
│   └── calculators/ # Hydration calculators
├── data/            # Server functions
└── db/              # Database schema
```

## Features

- Product store with activity-based filtering
- Save products and add to cart
- Hydration calculator and sweat rate calculator
- Contact form
