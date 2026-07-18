'use client'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product, ProductVariant } from '@/types'

export default function RecipeAddToCart({ product, variant }: { product: Product; variant: ProductVariant }) {
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()

  const handleAdd = () => {
    addItem(product, variant)
    addNotification(product.name, product.image_url)
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-gold hover:bg-yellow-300 text-black flex items-center justify-center gap-2 px-6 py-3 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl"
    >
      <ShoppingBag size={14} />
      Add to Cart
    </button>
  )
}
