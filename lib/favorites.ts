'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesStore = {
  productIds: string[]
  toggle: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
}

export const useFavorites = create<FavoritesStore>()(
  persist(
    set => ({
      productIds: [],
      toggle: productId => set(state => ({
        productIds: state.productIds.includes(productId)
          ? state.productIds.filter(id => id !== productId)
          : [...state.productIds, productId],
      })),
      remove: productId => set(state => ({ productIds: state.productIds.filter(id => id !== productId) })),
      clear: () => set({ productIds: [] }),
    }),
    { name: 'qms-favorites-v1', partialize: state => ({ productIds: state.productIds }) }
  )
)
