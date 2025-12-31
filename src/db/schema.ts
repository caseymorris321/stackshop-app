import {
  pgTable,
  varchar,
  numeric,
  integer,
  text,
  pgEnum,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core'

const badgeValues = ['New', 'Sale', 'Featured', 'Limited'] as const
const inventoryValues = ['in-stock', 'backorder', 'preorder'] as const
const categoryValues = ['running', 'cycling', 'gym', 'outdoor', 'recovery', 'everyday'] as const

export const badgeEnum = pgEnum('badge', badgeValues)
export const inventoryEnum = pgEnum('inventory', inventoryValues)
export const categoryEnum = pgEnum('category', categoryValues)

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  badge: badgeEnum('badge'),
  category: categoryEnum('category').default('everyday'),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviews: integer('reviews').notNull().default(0),
  image: varchar('image', { length: 512 }).notNull(),
  inventory: inventoryEnum('inventory').notNull().default('in-stock'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type ProductSelect = typeof products.$inferSelect
export type ProductInsert = typeof products.$inferInsert

// Cart items table - stores items in user's cart
export const cartItems = pgTable('cart_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  // For logged-in users (Clerk user ID)
  userId: varchar('user_id', { length: 256 }),
  // For guest users (session cookie)
  sessionId: varchar('session_id', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type CartItemSelect = typeof cartItems.$inferSelect &
  typeof products.$inferSelect

export type CartItemInsert = typeof cartItems.$inferInsert

// Saved products table - stores user's saved/wishlist items
export const savedProducts = pgTable('saved_products', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id', { length: 256 }).notNull(),
  productId: uuid('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type SavedProductSelect = typeof savedProducts.$inferSelect
export type SavedProductInsert = typeof savedProducts.$inferInsert

// Export enum value types inferred from the enum definitions
export type BadgeValue = (typeof badgeValues)[number]
export type InventoryValue = (typeof inventoryValues)[number]
export type CategoryValue = (typeof categoryValues)[number]

export const categories = categoryValues