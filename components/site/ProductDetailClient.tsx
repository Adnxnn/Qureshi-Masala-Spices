'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product, ProductVariant } from '@/types'

// Helper to format weight
const formatWeight = (grams: number) => {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }
  return `${grams}g`
}

// Get "Best Used For" icon mapping
const categoryIcons: Record<string, string[]> = {
  chicken: ['🍗', '🔥', '🍖', '🥘'],
  seafood: ['🐟', '🦐', '🍤', '🥘'],
  vegetarian: ['🥗', '🍲', '🍛', '🥘'],
  spice: ['🍛', '🍲', '🥘', '🍝']
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()
  const router = useRouter()

  const selectedVariant: ProductVariant = product.variants[selectedVariantIndex]

  // Get icons for current category
  const bestUsedIcons = categoryIcons[product.category] || ['🍛', '🍲', '🥘', '🍝']

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pb-24">
      {/* Back button */}
      <div className="pt-24 sm:pt-32 pb-6 sm:pb-8 px-4 sm:px-8 max-w-6xl mx-auto">
        <Link href="/shop" className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-all duration-300 text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em]">
          <ArrowLeft size={14} /> Back to Shop
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-16 sm:pb-20">
        <div
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:gap-16 items-start"
        >
          {/* Left: Image Gallery */}
          <div className="relative">
            {/* Main image */}
            <div
              className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden aspect-square flex items-center justify-center p-6 sm:p-8 lg:p-12 shadow-2xl group"
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={`${product.name}`}
                  width={550}
                  height={550}
                  className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='550' height='550' viewBox='0 0 550 550'%3E%3Crect width='550' height='550' fill='%231f2937'/%3E%3C/svg%3E"
                />
              ) : (
                <div className="text-white/30 text-center">
                  Product Image
                </div>
              )}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="pt-2 lg:pt-4">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40">{product.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40">{product.variants.length} Sizes</span>
            </div>
            {product.badge && (
              <div
                className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[9px] font-bold tracking-[0.3em] sm:tracking-[0.35em] uppercase text-black mb-4 sm:mb-5 rounded-full"
                style={{ background: product.accent_color || '#F5C518' }}
              >
                {product.badge}
              </div>
            )}

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-white mb-4 sm:mb-5">
              {product.name}
            </h1>

            <p className="text-white/50 text-sm sm:text-base md:text-lg mb-7 sm:mb-8 leading-relaxed">{product.description}</p>

            {/* Weight selection */}
            <div className="mb-7 sm:mb-8">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3 sm:mb-4">Select Weight</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`flex-1 min-w-[100px] px-4 sm:px-5 sm:px-6 py-3 sm:py-3.5 border text-[9px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-2xl min-h-[48px] sm:min-h-[52px] ${
                      idx === selectedVariantIndex
                        ? 'border-gold text-gold bg-gold/10 shadow-[0_0_20px_rgba(245,197,24,0.2)]'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 bg-black/40 hover:bg-black/60'
                    }`}
                  >
                    {formatWeight(variant.weight_grams)} · ₹{variant.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <span className="font-display text-2xl sm:text-4xl md:text-5xl text-white">₹{selectedVariant.price}</span>
              {selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price && (
                <>
                  <span className="font-display text-lg sm:text-xl md:text-2xl text-white/30 line-through">₹{selectedVariant.original_price}</span>
                  <span className="px-3 sm:px-4 py-1.5 text-[8px] sm:text-[10px] font-bold tracking-[0.25em] uppercase text-gold bg-gold/15 border border-gold/30 rounded-full">
                    {Math.round((1 - selectedVariant.price / selectedVariant.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 mb-7 sm:mb-8">
              <div className="flex items-center border border-white/10 rounded-2xl bg-black/40 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 sm:px-5 py-3.5 sm:py-4 text-white/50 hover:text-white transition-colors duration-300 min-h-[52px] hover:bg-white/5"
                >
                  -
                </button>
                <span className="px-6 sm:px-8 py-3.5 sm:py-4 text-white font-display text-lg sm:text-xl border-x border-white/5">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 sm:px-5 py-3.5 sm:py-4 text-white/50 hover:text-white transition-colors duration-300 min-h-[52px] hover:bg-white/5"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addItem(product, selectedVariant)
                  }
                  addNotification(product.name, product.image_url)
                }}
                className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-gold to-yellow-400 text-black px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:from-yellow-300 hover:to-gold hover:shadow-[0_0_40px_rgba(245,197,24,0.4)] transition-all duration-300 min-h-[52px] rounded-2xl"
              >
                <ShoppingBag size={16} />
                Add to Cart · ₹{selectedVariant.price * quantity}
              </button>
            </div>

            <button
              onClick={() => {
                addItem(product, selectedVariant)
                router.push('/order')
              }}
              className="w-full border border-gold text-gold px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-all duration-300 mb-9 sm:mb-12 min-h-[52px] rounded-2xl"
            >
              Buy Now
            </button>

            {/* Why Choose This */}
            <div className="mb-8 sm:mb-9">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-5">Why Choose This</p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: '🌿', text: 'No Preservatives' },
                  { icon: '⚗️', text: 'Freshly Ground' },
                  { icon: '✨', text: 'Authentic Taste' },
                  { icon: '🏆', text: 'Premium Quality' }
                ].map((f, i) => (
                  <div
                    key={i}
                    className="bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-300 p-3.5 sm:p-4.5 rounded-2xl flex items-center gap-3 sm:gap-4"
                  >
                    <div className="text-xl sm:text-2xl md:text-3xl">{f.icon}</div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">{f.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Used For */}
            <div className="mb-9 sm:mb-12">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-5">Best Used For</p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {bestUsedIcons.map((icon, i) => (
                  <div key={i} className="w-11 h-11 sm:w-12 sm:h-12 bg-black/40 border border-white/10 hover:border-gold/30 transition-all duration-300 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                    {icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quality / Authenticity Section */}
        <section className="mt-14 sm:mt-24 border-t border-white/10 pt-12 sm:pt-20">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-12 lg:gap-16 items-center">
            <div>
              <div className="text-[8px] sm:text-[10px] tracking-[0.4em] uppercase text-gold mb-3 sm:mb-4">Why Qureshi's</div>
              <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-5xl uppercase leading-tight mb-5 sm:mb-6 text-white">
                Authenticity <span className="text-gradient-gold">in every pinch</span>
              </h2>
              <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-7">
                Our spices are handcrafted in small batches using traditional recipes passed down through generations.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {[
                  'Sourced from the finest spice-growing regions of Karnataka',
                  'Small-batch blended in Coorg for maximum freshness',
                  'Lab-tested and certified 100% natural',
                  'Zero preservatives, zero artificial colors'
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-3 sm:gap-4 items-start">
                    <CheckCircle size={16} className="text-gold mt-0.5 shrink-0" />
                    <span className="text-white/55 text-xs sm:text-sm md:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-3xl p-8 sm:p-12 sm:p-16 text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-gold mx-auto mb-5 sm:mb-7 flex items-center justify-center bg-black/30">
                  <span className="font-display text-4xl sm:text-5xl md:text-6xl text-gold">Q</span>
                </div>
                <p className="font-serif italic text-white/50 text-base sm:text-lg md:text-xl">Pure Flavour. Endless Taste.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-14 sm:mt-24 bg-gold py-12 sm:py-16 px-4 sm:px-8 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute inset-0 font-display text-[5rem] sm:text-[7rem] md:text-[10rem] md:text-[12rem] text-black/5 flex items-center justify-center pointer-events-none tracking-wider">
            FLAVOUR
          </div>
          <h2 className="font-display text-xl sm:text-3xl md:text-4xl lg:text-6xl text-black uppercase leading-tight mb-4 sm:mb-5 relative">
            Ready to elevate your cooking?
          </h2>
          <p className="text-black/60 text-sm sm:text-base md:text-lg mb-7 sm:mb-9 relative">
            Add {product.name} to your cart today and experience authentic Coorg flavours
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 relative">
            <Link href="/shop" className="bg-black text-gold px-6 sm:px-10 py-3.5 sm:py-4.5 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-900 transition-all duration-300 rounded-2xl">
              Explore Products
            </Link>
            <Link href="/order" className="bg-black text-white px-6 sm:px-10 py-3.5 sm:py-4.5 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-900 transition-all duration-300 rounded-2xl">
              Order Now
            </Link>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-md border-t border-white/10 p-4 sm:p-5 z-50">
        <div className="flex items-center justify-between gap-4 max-w-6xl mx-auto">
          <div>
            <div className="text-white/50 text-[8px] sm:text-[10px] tracking-[0.3em] uppercase mb-0.5">Total</div>
            <div className="font-display text-2xl sm:text-3xl text-white">₹{selectedVariant.price * quantity}</div>
          </div>
          <button
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                addItem(product, selectedVariant)
              }
              addNotification(product.name, product.image_url)
            }}
            className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-gold to-yellow-400 text-black px-5 sm:px-7 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:from-yellow-300 hover:to-gold transition-all duration-300 min-h-[52px] rounded-2xl"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
