'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, ProductVariant, PromoCode } from '@/types'

type CartStore = {
  items: CartItem[]
  appliedPromoCode: PromoCode | null
  addItem: (product: Product, variant: ProductVariant) => void
  removeItem: (productId: string, weight: number) => void
  updateQty: (productId: string, weight: number, qty: number) => void
  clearCart: () => void
  applyPromoCode: (promoCode: PromoCode | null) => void
  totalItems: () => number
  totalAmount: () => number
}

// Helper to get a unique key for cart items
const getCartItemKey = (productId: string, weight: number) => `${productId}-${weight}`

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedPromoCode: null,

      addItem: (product, variant) => {
        const key = getCartItemKey(product.id, variant.weight_grams)
        const existing = get().items.find(i => 
          getCartItemKey(i.product.id, i.variant.weight_grams) === key
        )
        if (existing) {
          set(s => ({
            items: s.items.map(i =>
              getCartItemKey(i.product.id, i.variant.weight_grams) === key 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
            )
          }))
        } else {
          set(s => ({ items: [...s.items, { product, variant, quantity: 1 }] }))
        }
      },

      removeItem: (productId, weight) =>
        set(s => ({ 
          items: s.items.filter(i => 
            getCartItemKey(i.product.id, i.variant.weight_grams) !== getCartItemKey(productId, weight)
          ) 
        })),

      updateQty: (productId, weight, qty) => {
        const key = getCartItemKey(productId, weight)
        if (qty <= 0) { 
          get().removeItem(productId, weight); 
          return 
        }
        set(s => ({
          items: s.items.map(i =>
            getCartItemKey(i.product.id, i.variant.weight_grams) === key 
              ? { ...i, quantity: qty } 
              : i
          )
        }))
      },

      clearCart: () => set({ items: [], appliedPromoCode: null }),

      applyPromoCode: (promoCode: PromoCode | null) => set({ appliedPromoCode: promoCode }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalAmount: () =>
        get().items.reduce((sum, i) => sum + i.variant.price * i.quantity, 0),
    }),
    { name: 'qureshis-cart-v2' }
  )
)
