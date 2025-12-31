import type { ProductSelect } from '@/db/schema'

export type MutateCartFnInput =
  | {
      action: 'add' | 'remove' | 'update'
      productId: string
      quantity: number
      userId?: string | null
    }
  | {
      action: 'clear'
      productId?: never
      quantity?: never
      userId?: string | null
    }

export type CartItem = ProductSelect & { quantity: number }