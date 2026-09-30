'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { useFavorites } from '@/lib/favorites'
import { useFavoritesFeedback } from '@/lib/favorites-feedback'

export default function FavoriteButton({ productId, productName, className = '' }: { productId: string; productName: string; className?: string }) {
  const [mounted, setMounted] = useState(false)
  const saved = useFavorites(state => state.productIds.includes(productId))
  const toggle = useFavorites(state => state.toggle)
  const { showFeedback } = useFavoritesFeedback()
  useEffect(() => setMounted(true), [])
  const active = mounted && saved

  return <button
    type="button"
    className={className}
    aria-label={`${active ? 'Remove' : 'Save'} ${productName} ${active ? 'from' : 'to'} favorites`}
    aria-pressed={active}
    title={active ? 'Remove from favorites' : 'Save to favorites'}
    onClick={() => {
      const wasSaved = useFavorites.getState().productIds.includes(productId)
      toggle(productId)
      showFeedback(productName, !wasSaved)
    }}
  ><Heart size={20} fill={active ? 'currentColor' : 'none'} strokeWidth={1.8} aria-hidden="true" /></button>
}
