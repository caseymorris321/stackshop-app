import { db } from '@/db'
import { savedProducts, products } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'

export async function saveProduct(userId: string, productId: string) {
  // Check if already saved
  const existing = await db
    .select()
    .from(savedProducts)
    .where(
      and(
        eq(savedProducts.userId, userId),
        eq(savedProducts.productId, productId)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    return existing[0]
  }

  const [saved] = await db
    .insert(savedProducts)
    .values({ userId, productId })
    .returning()

  return saved
}

export async function removeSavedProduct(userId: string, productId: string) {
  await db
    .delete(savedProducts)
    .where(
      and(
        eq(savedProducts.userId, userId),
        eq(savedProducts.productId, productId)
      )
    )
}

export async function getSavedProducts(userId: string) {
  const saved = await db
    .select({
      id: savedProducts.id,
      userId: savedProducts.userId,
      productId: savedProducts.productId,
      createdAt: savedProducts.createdAt,
      product: products,
    })
    .from(savedProducts)
    .innerJoin(products, eq(savedProducts.productId, products.id))
    .where(eq(savedProducts.userId, userId))

  return saved
}

export async function isProductSaved(userId: string, productId: string) {
  const result = await db
    .select()
    .from(savedProducts)
    .where(
      and(
        eq(savedProducts.userId, userId),
        eq(savedProducts.productId, productId)
      )
    )
    .limit(1)

  return result.length > 0
}

export async function getSavedProductsCount(userId: string) {
  const result = await db
    .select({ count: count() })
    .from(savedProducts)
    .where(eq(savedProducts.userId, userId))

  return result[0]?.count ?? 0
}
