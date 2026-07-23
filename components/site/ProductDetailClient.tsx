'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Award,
  CookingPot,
  Drumstick,
  Fish,
  Flame,
  Leaf,
  Salad,
  Sparkles,
  Soup,
  UtensilsCrossed,
  Waves,
  Wheat,
  type LucideIcon
} from 'lucide-react'
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
const categoryIcons: Record<string, LucideIcon[]> = {
  chicken: [Drumstick, Flame, CookingPot, UtensilsCrossed],
  seafood: [Fish, Waves, Soup, CookingPot],
  vegetarian: [Salad, Soup, Leaf, CookingPot],
  spice: [Wheat, Soup, CookingPot, UtensilsCrossed]
}

const qualityDetails = [
  { icon: Leaf, text: 'No Preservatives' },
  { icon: Wheat, text: 'Freshly Ground' },
  { icon: Sparkles, text: 'Authentic Taste' },
  { icon: Award, text: 'Premium Quality' }
]

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()
  const router = useRouter()

  const selectedVariant: ProductVariant = product.variants[selectedVariantIndex]

  // Get icons for current category
  const bestUsedIcons = categoryIcons[product.category] || [Wheat, Soup, CookingPot, UtensilsCrossed]

  return (
    <div className="royal-page royal-grain min-h-screen pb-24">
      {/* Back button */}
      <div className="pt-24 sm:pt-32 pb-6 sm:pb-8 px-4 sm:px-8 max-w-6xl mx-auto">
        <Link href="/shop" className="royal-eyebrow inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-gold">
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
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-[3px] border border-gold/15 bg-[radial-gradient(circle_at_50%_40%,rgba(91,23,24,0.35),transparent_38%),linear-gradient(145deg,#211713,#0a0806_72%)] p-6 shadow-[0_34px_80px_rgba(0,0,0,0.48)] sm:p-8 lg:p-12"
            >
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={`${product.name}`}
                  width={550}
                  height={550}
                  className="h-full w-full object-contain drop-shadow-[0_28px_22px_rgba(0,0,0,0.5)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.025]"
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
              <span className="royal-eyebrow text-muted">{product.category}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="royal-eyebrow text-muted">{product.variants.length} Sizes</span>
            </div>
            {product.badge && (
              <div
                className="royal-eyebrow mb-4 inline-block border border-gold/35 bg-gold/10 px-3 py-2 text-gold sm:mb-5 sm:px-4"
              >
                {product.badge}
              </div>
            )}

            <h1 className="royal-title mb-4 text-4xl text-cream sm:mb-5 sm:text-5xl md:text-6xl lg:text-7xl">
              {product.name}
            </h1>

            <p className="mb-7 max-w-xl text-sm leading-relaxed text-muted sm:mb-8 sm:text-base md:text-lg">{product.description}</p>

            {/* Weight selection */}
            <div className="mb-7 sm:mb-8">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3 sm:mb-4">Select Weight</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {product.variants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`min-h-[48px] min-w-[100px] flex-1 rounded-[2px] border px-4 py-3 text-[9px] font-bold uppercase tracking-[0.24em] transition-colors sm:min-h-[52px] sm:px-6 sm:py-3.5 sm:text-xs ${
                      idx === selectedVariantIndex
                        ? 'border-gold/70 bg-gold/10 text-gold'
                        : 'border-white/10 bg-black/30 text-muted hover:border-gold/30 hover:text-cream'
                    }`}
                  >
                    {formatWeight(variant.weight_grams)} · ₹{variant.price}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <span className="font-display text-3xl text-cream sm:text-4xl md:text-5xl">₹{selectedVariant.price}</span>
              {selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price && (
                <>
                  <span className="font-display text-lg sm:text-xl md:text-2xl text-white/30 line-through">₹{selectedVariant.original_price}</span>
                  <span className="border border-gold/30 bg-gold/10 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.25em] text-gold sm:px-4 sm:text-[10px]">
                    {Math.round((1 - selectedVariant.price / selectedVariant.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 mb-7 sm:mb-8">
              <div className="flex items-center overflow-hidden rounded-[3px] border border-white/10 bg-black/30">
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
                className="royal-button flex min-h-[52px] flex-1 items-center justify-center gap-2.5 px-6 py-3.5 text-[10px] sm:px-8 sm:py-4 sm:text-xs"
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
              className="royal-button-secondary mb-9 min-h-[52px] w-full px-6 py-3.5 text-[10px] sm:mb-12 sm:px-8 sm:py-4 sm:text-xs"
            >
              Buy Now
            </button>

            {/* Why Choose This */}
            <div className="mb-8 sm:mb-9">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-5">Why Choose This</p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {qualityDetails.map((f, i) => (
                  <div
                    key={i}
                    className="royal-panel flex items-center gap-3 rounded-[3px] p-3.5 transition-colors hover:border-gold/25 sm:gap-4 sm:p-4.5"
                  >
                    <f.icon aria-hidden="true" className="size-5 shrink-0 text-gold sm:size-6" strokeWidth={1.4} />
                    <div className="text-[8px] font-semibold uppercase tracking-[0.25em] text-muted sm:text-[10px]">{f.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Used For */}
            <div className="mb-9 sm:mb-12">
              <p className="text-[8px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4 sm:mb-5">Best Used For</p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {bestUsedIcons.map((Icon, i) => (
                  <div key={i} className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-black/30 text-gold transition-colors hover:border-gold/35 sm:size-12">
                    <Icon aria-hidden="true" className="size-5" strokeWidth={1.4} />
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
              <h2 className="royal-title mb-5 text-3xl text-cream sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
                Authenticity <span className="text-gradient-gold">in every pinch.</span>
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
              <div className="royal-panel rounded-[3px] bg-[radial-gradient(circle_at_50%_25%,rgba(199,161,90,0.12),transparent_45%)] p-8 text-center sm:p-12 sm:p-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full border-2 border-gold mx-auto mb-5 sm:mb-7 flex items-center justify-center bg-black/30">
                  <span className="font-display text-4xl sm:text-5xl md:text-6xl text-gold">Q</span>
                </div>
                <p className="font-serif italic text-white/50 text-base sm:text-lg md:text-xl">Pure Flavour. Endless Taste.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative mt-14 overflow-hidden rounded-[3px] border border-gold/20 bg-[linear-gradient(125deg,#290a0b,#5b1718_52%,#24100f)] px-4 py-12 text-center sm:mt-24 sm:px-8 sm:py-16">
          <div className="absolute inset-0 font-display text-[5rem] sm:text-[7rem] md:text-[10rem] md:text-[12rem] text-black/5 flex items-center justify-center pointer-events-none tracking-wider">
            FLAVOUR
          </div>
          <h2 className="royal-title relative mb-4 text-3xl text-cream sm:mb-5 sm:text-4xl md:text-5xl lg:text-6xl">
            Ready to elevate your cooking?
          </h2>
          <p className="relative mb-7 text-sm text-cream/65 sm:mb-9 sm:text-base md:text-lg">
            Add {product.name} to your cart today and experience authentic Coorg flavours
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-5 relative">
            <Link href="/shop" className="royal-button px-6 py-3.5 text-[10px] sm:px-10 sm:py-4.5 sm:text-xs">
              Explore Products
            </Link>
            <Link href="/order" className="royal-button-secondary bg-black/35 px-6 py-3.5 text-[10px] sm:px-10 sm:py-4.5 sm:text-xs">
              Order Now
            </Link>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/15 bg-[#080705]/95 p-4 backdrop-blur-md sm:p-5 lg:hidden">
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
            className="royal-button flex min-h-[52px] flex-1 items-center justify-center gap-2.5 px-5 py-3.5 text-[10px] sm:px-7 sm:py-4 sm:text-xs"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
