'use client'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product, ProductVariant } from '@/types'

export default function RecipeAddToCart({ product, variant }: { product: Product; variant: ProductVariant }) {
  const addItem = useCart(state => state.addItem)
  const inCart = useCart(state => state.items.filter(item => item.product.id === product.id).reduce((count, item) => count + item.quantity, 0))
  const { addNotification } = useCartNotifications()
  const unavailable = !product.is_active || inCart >= product.stock_qty

  const handleAdd = () => {
    const current = useCart.getState().items.filter(item => item.product.id === product.id).reduce((count, item) => count + item.quantity, 0)
    if (!product.is_active || current >= product.stock_qty) return
    addItem(product, variant)
    addNotification(product.name, product.image_url, variant.weight_grams, 1)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={unavailable}
      className="royal-button w-full px-6 py-3 text-[10px] sm:text-xs"
    >
      <ShoppingBag size={14} />
      {unavailable ? 'Unavailable' : 'Add to cart'}
    </button>
  )
}
