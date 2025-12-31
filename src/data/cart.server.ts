import { and, desc, eq } from 'drizzle-orm'
import { db } from '@/db'
import { cartItems, products } from '@/db/schema'

type CartContext = {
  userId?: string | null
}

/**
 * Gets the where clause for cart queries based on user or session
 */
async function getCartOwnerCondition(ctx: CartContext) {
  if (ctx.userId) {
    return eq(cartItems.userId, ctx.userId)
  }
  // Dynamic import to avoid bundling server-only code
  const { getOrCreateSessionId } = await import('@/lib/cart-session.server')
  const sessionId = getOrCreateSessionId()
  return eq(cartItems.sessionId, sessionId)
}

export const getCartItemsCount = async (ctx: CartContext = {}) => {
  const cart = await getCartItems(ctx)
  const count = cart.items.reduce(
    (acc: number, item) => acc + Number(item.quantity),
    0,
  )
  return {
    count,
    total: cart.items.reduce(
      (acc: number, item) => acc + Number(item.price) * Number(item.quantity),
      0,
    ),
  }
}

export const getCartItems = async (ctx: CartContext = {}) => {
  const whereCondition = await getCartOwnerCondition(ctx)

  const cart = await db
    .select()
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(whereCondition)
    .orderBy(desc(cartItems.createdAt))

  return {
    items: cart.map((item) => ({
      ...item.products,
      quantity: item.cart_items.quantity,
    })),
  }
}

export async function removeFromCart(productId: string, ctx: CartContext = {}) {
  const whereCondition = await getCartOwnerCondition(ctx)

  await db.delete(cartItems).where(
    and(eq(cartItems.productId, productId), whereCondition)
  )
  return await getCartItems(ctx)
}

export async function clearCart(ctx: CartContext = {}) {
  const whereCondition = await getCartOwnerCondition(ctx)

  await db.delete(cartItems).where(whereCondition)
  return await getCartItems(ctx)
}

export async function updateCartItem(productId: string, quantity: number = 1, ctx: CartContext = {}) {
  const qty = Math.max(0, Math.min(quantity, 99))
  const whereCondition = await getCartOwnerCondition(ctx)

  if (qty === 0) {
    await db.delete(cartItems).where(
      and(eq(cartItems.productId, productId), whereCondition)
    )
  } else {
    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.productId, productId), whereCondition))
      .limit(1)

    if (existingItem.length > 0) {
      await db
        .update(cartItems)
        .set({ quantity: qty })
        .where(and(eq(cartItems.productId, productId), whereCondition))
    }
  }
}

export async function addToCart(productId: string, quantity: number = 1, ctx: CartContext = {}) {
  const qty = Math.max(1, Math.min(quantity, 99))
  const whereCondition = await getCartOwnerCondition(ctx)

  const existingItem = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.productId, productId), whereCondition))
    .limit(1)

  if (existingItem.length > 0) {
    await updateCartItem(productId, existingItem[0].quantity + qty, ctx)
  } else {
    // Insert new item with either userId or sessionId
    if (ctx.userId) {
      await db.insert(cartItems).values({
        productId,
        quantity: qty,
        userId: ctx.userId,
        sessionId: null,
      })
    } else {
      const { getOrCreateSessionId } = await import('@/lib/cart-session.server')
      const sessionId = getOrCreateSessionId()
      await db.insert(cartItems).values({
        productId,
        quantity: qty,
        userId: null,
        sessionId,
      })
    }
  }

  return await getCartItems(ctx)
}

/**
 * Merges guest cart into user cart when user logs in
 * - Moves all session cart items to the user
 * - If product exists in both, adds quantities
 * - Clears the session cookie after merge
 */
export async function mergeGuestCartToUser(userId: string) {
  const { getSessionId, clearSessionId } = await import('@/lib/cart-session.server')
  const sessionId = getSessionId()
  if (!sessionId) return // No guest cart to merge

  // Get guest cart items
  const guestItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.sessionId, sessionId))

  if (guestItems.length === 0) return

  // Get user's existing cart items
  const userItems = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))

  const userProductIds = new Set(userItems.map(item => item.productId))

  for (const guestItem of guestItems) {
    if (userProductIds.has(guestItem.productId)) {
      // Product exists in user cart - add quantities
      const existingUserItem = userItems.find(i => i.productId === guestItem.productId)!
      const newQty = Math.min(existingUserItem.quantity + guestItem.quantity, 99)

      await db
        .update(cartItems)
        .set({ quantity: newQty })
        .where(and(
          eq(cartItems.userId, userId),
          eq(cartItems.productId, guestItem.productId)
        ))

      // Delete the guest item
      await db.delete(cartItems).where(eq(cartItems.id, guestItem.id))
    } else {
      // Transfer guest item to user
      await db
        .update(cartItems)
        .set({ userId, sessionId: null })
        .where(eq(cartItems.id, guestItem.id))
    }
  }

  // Clear the session cookie
  clearSessionId()
}
