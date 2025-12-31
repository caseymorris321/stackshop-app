import dotenv from 'dotenv'
import type { ProductInsert } from '../src/db/schema'

process.env.NITRO_PRESET = 'node-server'
process.env.NODE_ENV = process.env.NODE_ENV || 'production'

dotenv.config()

const sampleProducts: Array<ProductInsert> = [
  // Running products
  {
    name: 'Marathon Electrolyte Powder',
    description:
      'High-performance electrolyte mix designed for long-distance runners. Contains optimal sodium, potassium, and magnesium ratios to prevent cramping and maintain peak performance during marathons and ultra runs.',
    price: '34.99',
    badge: 'Featured',
    category: 'running',
    rating: '4.9',
    reviews: 342,
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Trail Runner Hydration Vest',
    description:
      'Lightweight 2L hydration vest with front flask pockets. Breathable mesh back panel and adjustable straps for a bounce-free fit on technical trails.',
    price: '89.99',
    badge: 'New',
    category: 'running',
    rating: '4.7',
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  // Cycling products
  {
    name: 'Aero Cycling Bottle 750ml',
    description:
      'Aerodynamic squeeze bottle with high-flow valve. BPA-free, dishwasher safe, and fits standard bike cages. Perfect for road cycling and triathlons.',
    price: '24.99',
    category: 'cycling',
    rating: '4.6',
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Endurance Carb + Electrolyte Mix',
    description:
      'Dual-source carbohydrate blend with electrolytes for sustained energy during long rides. 60g carbs per serving with easy-to-digest maltodextrin and fructose.',
    price: '44.99',
    badge: 'Sale',
    category: 'cycling',
    rating: '4.8',
    reviews: 201,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  // Gym products
  {
    name: 'BCAA Hydration Formula',
    description:
      'Branch chain amino acids with added electrolytes and B-vitamins. Supports muscle recovery and hydration during intense training sessions. Zero sugar, great taste.',
    price: '39.99',
    category: 'gym',
    rating: '4.5',
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Insulated Gym Bottle 1L',
    description:
      'Double-wall vacuum insulated stainless steel bottle. Keeps drinks cold for 24 hours. Wide mouth for ice, leak-proof lid with carry loop.',
    price: '32.99',
    badge: 'Featured',
    category: 'gym',
    rating: '4.8',
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  // Outdoor products
  {
    name: 'Wilderness Purification Tablets',
    description:
      'Emergency water purification tablets for hiking and camping. Each tablet purifies 1L of water in 30 minutes. Essential for backcountry adventures.',
    price: '14.99',
    category: 'outdoor',
    rating: '4.4',
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Collapsible Hiking Bottle 500ml',
    description:
      'Ultra-lightweight silicone bottle that rolls up when empty. Perfect for ultralight backpacking. BPA-free with leak-proof cap and carabiner clip.',
    price: '18.99',
    badge: 'New',
    category: 'outdoor',
    rating: '4.3',
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  // Recovery products
  {
    name: 'Post-Workout Recovery Mix',
    description:
      'Complete recovery formula with electrolytes, protein, and tart cherry extract. Reduces muscle soreness and restores hydration after intense training.',
    price: '49.99',
    badge: 'Featured',
    category: 'recovery',
    rating: '4.7',
    reviews: 134,
    image: 'https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Sleep & Restore Electrolytes',
    description:
      'Nighttime hydration formula with magnesium glycinate and L-theanine. Supports muscle relaxation and quality sleep while replenishing electrolytes.',
    price: '29.99',
    category: 'recovery',
    rating: '4.6',
    reviews: 87,
    image: 'https://images.unsplash.com/photo-1558017487-06bf9f82613a?w=400&h=400&fit=crop',
    inventory: 'backorder',
  },
  // Everyday products
  {
    name: 'Daily Hydration Drops',
    description:
      'Concentrated electrolyte drops for everyday hydration. Add to any beverage for a boost of essential minerals. No sugar, no calories, no artificial flavors.',
    price: '19.99',
    category: 'everyday',
    rating: '4.5',
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
  {
    name: 'Smart Water Bottle 600ml',
    description:
      'Tracks your daily water intake via smartphone app. LED reminders to drink. Rechargeable battery lasts 30 days. Sync with fitness apps.',
    price: '54.99',
    badge: 'New',
    category: 'everyday',
    rating: '4.4',
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop',
    inventory: 'in-stock',
  },
]

async function seed() {
  try {
    // Dynamically import database modules after environment variables are loaded
    const { db } = await import('../src/db/index')
    const { products, cartItems } = await import('../src/db/schema')

    console.log('🌱 Starting database seed...')

    // Check if --reset flag is passed
    const shouldReset =
      process.argv.includes('--reset') || process.argv.includes('-r')

    if (shouldReset) {
      console.log('🗑️  Clearing existing data...')
      await db.delete(cartItems)
      console.log('   Cleared cart items')
      await db.delete(products)
      console.log('   Cleared all products')
    } else {
      // Check if products already exist
      const existingProducts = await db.select().from(products).limit(1)

      if (existingProducts.length > 0) {
        console.log('⚠️  Products already exist in the database.')
        console.log(
          '   Run with --reset flag to clear and reseed: npm run db:seed -- --reset',
        )
        process.exit(0)
      }
    }

    // Insert sample products
    console.log(`📦 Inserting ${sampleProducts.length} products...`)
    await db.insert(products).values(sampleProducts)

    console.log('✅ Database seeded successfully!')
    console.log(`   Inserted ${sampleProducts.length} products`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Only run seed() if this file is executed directly (not imported)
// This script should only run when executed via npm run db:seed
// It should NOT run when imported by other modules (like Vite during dev)
const isRunningAsScript =
  process.argv[1]?.includes('seed.ts') || process.argv[1]?.includes('tsx')

if (isRunningAsScript) {
  seed()
}
