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
      className="royal-button w-full px-6 py-3 text-[10px] sm:text-xs"
    >
      <ShoppingBag size={14} />
      Add to Cart
    </button>
  )
}
