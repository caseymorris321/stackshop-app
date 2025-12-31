# WatersLab

## General Overview

A hydration-focused e-commerce site selling water bottles and hydration products. Built with TanStack Start (React 19) and styled with Tailwind CSS. Features a 3D ocean animation on the homepage, hydration calculators, and a full shopping cart system.

## Quick Start

```bash
npm install
npm run dev
```

Runs on http://localhost:3000

## Project Structure

- `src/routes/` - Page routes (index, store, cart, etc.)
- `src/components/sections/` - Homepage sections (Hero, About, Calculators, Contact)
- `src/components/layout/` - Navigation and Footer
- `src/components/calculators/` - Hydration and Sweat Rate calculators
- `src/data/` - Server functions for products, cart, saved items
- `src/db/` - Database schema (Drizzle ORM)

## Features

The homepage has several sections: a Three.js ocean animation hero, about section, hydration calculators, and contact form. Products can be filtered by activity type. Users can save products and add them to cart. Authentication is handled by Clerk.

## Database

Uses PostgreSQL with Drizzle ORM. The schema includes products, cart items, and saved products tables.
