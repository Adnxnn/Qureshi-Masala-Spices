'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ArrowRight, X, Plus, Eye, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product, ProductVariant } from '@/types'

// Helper to generate slug
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Helper to format weight (g or kg)
const formatWeight = (grams: number) => {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }
  return `${grams}g`
}

// Skeleton component
function ProductSkeleton() {
  return (
    <div className="relative bg-black/40 p-4 sm:p-6 flex flex-col rounded-2xl border border-white/5">
      <div className="animate-pulse">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 sm:p-6 rounded-2xl w-full aspect-square flex items-center justify-center">
            <div className="bg-white/10 h-20 sm:h-32 w-20 sm:w-32 rounded-full" />
          </div>
        </div>
        <div className="h-4 sm:h-5 bg-white/5 rounded w-3/4 mb-1.5" />
        <div className="h-3 sm:h-4 bg-white/5 rounded w-1/2 mb-3 sm:mb-4" />
        <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          <div className="h-8 sm:h-9 bg-white/5 rounded-lg w-16 sm:w-20" />
          <div className="h-8 sm:h-9 bg-white/5 rounded-lg w-16 sm:w-20" />
        </div>
        <div className="mt-auto">
          <div className="h-10 sm:h-12 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

// Quick View Modal
function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0)
  const selectedVariant = product.variants[selectedVariantIndex]
  const [adding, setAdding] = useState(false)
  const [buttonState, setButtonState] = useState<'idle' | 'pressed' | 'sparking'>('idle')

  const handleAdd = () => {
    setButtonState('pressed')
    setTimeout(() => {
      setButtonState('sparking')
      addItem(product, selectedVariant)
      addNotification(product.name, product.image_url)
      setAdding(true)
      setTimeout(() => {
        setAdding(false)
        setButtonState('idle')
        onClose()
      }, 500)
    }, 150)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-8" onClick={onClose}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-br from-zinc-950 to-black w-full sm:max-w-4xl rounded-t-2xl sm:rounded-2xl border border-white/10 overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10">
            <div>
              <h3 className="font-display text-xl sm:text-2xl uppercase text-white">{product.name}</h3>
              <p className="text-[9px] sm:text-[10px] uppercase text-white/30 mt-1 tracking-[0.3em]">{product.category}</p>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6">
            <div className="bg-gradient-to-br from-zinc-900/80 to-black rounded-2xl p-6 sm:p-8 flex items-center justify-center">
              <Image
                src={product.image_url}
                alt={product.name}
                width={350}
                height={350}
                className="max-h-full max-w-full object-contain"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350' viewBox='0 0 350 350'%3E%3Crect width='350' height='350' fill='%231f2937'/%3E%3C/svg%3E"
              />
            </div>

            <div className="flex flex-col py-2">
              <p className="text-white/50 text-sm sm:text-base md:text-lg mb-5 sm:mb-7 leading-relaxed">{product.short_description || product.description}</p>

              <div className="mb-5 sm:mb-7">
                <p className="text-[9px] sm:text-[10px] uppercase text-white/30 mb-3 sm:mb-4 font-medium tracking-[0.3em]">Select Weight</p>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {product.variants.map((variant, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`flex-1 min-w-[90px] sm:min-w-[100px] px-4 sm:px-5 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl border ${
                        idx === selectedVariantIndex
                          ? 'border-gold text-gold bg-gold/10'
                          : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70 bg-black/40'
                      }`}
                    >
                      {formatWeight(variant.weight_grams)} · ₹{variant.price}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-7">
                <span className="font-display text-2xl sm:text-3xl md:text-4xl text-white">₹{selectedVariant.price}</span>
                {selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price && (
                  <>
                    <span className="font-display text-lg sm:text-xl text-white/30 line-through">₹{selectedVariant.original_price}</span>
                    <span className="px-2.5 py-1 text-[8px] font-bold tracking-[0.25em] uppercase text-gold bg-gold/10 border border-gold/20 rounded-full">
                      {Math.round((1 - selectedVariant.price / selectedVariant.original_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="mt-auto space-y-3 sm:space-y-4">
                <motion.button
                  onClick={handleAdd}
                  disabled={adding}
                  animate={{
                    scale: buttonState === 'pressed' ? 0.97 : buttonState === 'sparking' ? 1.03 : 1,
                    boxShadow: buttonState === 'sparking'
                      ? '0 0 50px rgba(245,197,24,0.5)'
                      : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-gold to-yellow-400 text-black px-6 sm:px-7 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase hover:from-yellow-300 hover:to-gold transition-all duration-300 rounded-xl relative overflow-hidden"
                >
                  <ShoppingBag size={18} />
                  {adding ? 'Adding to Cart...' : 'Add to Cart'}
                  {buttonState === 'sparking' && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1.5 h-1.5 bg-white/80 rounded-full"
                          initial={{ x: '50%', y: '50%', opacity: 0, scale: 0 }}
                          animate={{
                            x: `${30 + i * 15}%`,
                            y: `${28 + i * 10}%`,
                            opacity: [0, 1, 0],
                            scale: [0, 2, 0],
                          }}
                          transition={{ duration: 0.6, delay: i * 0.03 }}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>

                <Link
                  href={`/product/${generateSlug(product.name)}`}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 px-6 sm:px-7 py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl"
                >
                  View Full Details
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ProductGrid({ products, loading = false }: { products: Product[]; loading?: boolean }) {
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [pressedProductId, setPressedProductId] = useState<string | null>(null)

  useEffect(() => {
    if (loading) {
      setIsLoading(true)
      const timer = setTimeout(() => setIsLoading(false), 1000)
      return () => clearTimeout(timer)
    }
    setIsLoading(false)
  }, [loading])

  const handleSelectVariant = (productId: string, variantIndex: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantIndex
    }))
  }

  const getSelectedVariant = (product: Product): ProductVariant => {
    const selectedIndex = selectedVariants[product.id] ?? 0
    return product.variants[selectedIndex]
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(12)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {products.map((p, i) => {
          const selectedVariant = getSelectedVariant(p)
          const isOutOfStock = p.stock_qty <= 0

          return (
            <Link
              href={`/product/${generateSlug(p.name)}`}
              key={p.id}
            >
              <motion.div
                className={`group relative bg-gradient-to-b from-zinc-900/80 to-black border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-gold/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col ${isOutOfStock ? 'opacity-70' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                {/* Product Image */}
                <div className="p-4 sm:p-6 flex justify-center">
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl sm:rounded-3xl w-full aspect-square flex items-center justify-center relative overflow-hidden">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={220}
                        height={220}
                        className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-1"
                        priority={i < 4}
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Crect width='220' height='220' fill='%231f2937'/%3E%3C/svg%3E"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m16 10v4M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}

                    {/* Subtle shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    {/* Quick view button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setQuickViewProduct(p)
                      }}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-400 bg-black/80 hover:bg-gold hover:text-black text-white p-2.5 rounded-xl backdrop-blur-md border border-white/10 hover:border-gold"
                    >
                      <Eye size={16} />
                    </button>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase text-white/60">
                        {p.category}
                      </span>
                    </div>

                    {/* Out of stock badge */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/75 flex items-center justify-center backdrop-blur-md">
                        <span className="px-4 py-2 bg-white/10 text-white/70 text-[10px] tracking-[0.3em] uppercase font-bold rounded-full border border-white/20">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex flex-col flex-1">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="font-display text-sm sm:text-base md:text-lg uppercase leading-tight text-white line-clamp-2 group-hover:text-gold transition-colors duration-300">
                      {p.name}
                    </h3>
                    {p.short_description && (
                      <p className="text-white/40 text-xs mt-1.5 line-clamp-2">
                        {p.short_description}
                      </p>
                    )}
                  </div>

                  {/* Weight pills */}
                  <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
                    {p.variants.slice(0, 3).map((variant, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => {
                          e.preventDefault()
                          if (!isOutOfStock) handleSelectVariant(p.id, idx)
                        }}
                        disabled={isOutOfStock}
                        className={`px-2.5 sm:px-3 py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase transition-all duration-300 rounded-lg border ${
                          selectedVariants[p.id] === idx
                            ? 'border-gold text-gold bg-gold/10'
                            : 'border-white/10 text-white/35 hover:border-white/20 hover:text-white/60 bg-black/40'
                        } ${isOutOfStock ? 'cursor-not-allowed' : ''}`}
                      >
                        {formatWeight(variant.weight_grams)}
                      </button>
                    ))}
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <span className="font-display text-base sm:text-lg md:text-xl text-white">₹{selectedVariant.price}</span>
                      {selectedVariant.original_price && selectedVariant.original_price > selectedVariant.price && (
                        <span className="font-display text-xs sm:text-sm text-white/30 line-through">₹{selectedVariant.original_price}</span>
                      )}
                    </div>
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault()
                        if (isOutOfStock) return
                        setPressedProductId(p.id)
                        setTimeout(() => {
                          addItem(p, selectedVariant)
                          addNotification(p.name, p.image_url)
                          setTimeout(() => setPressedProductId(null), 400)
                        }, 150)
                      }}
                      disabled={isOutOfStock}
                      animate={{
                        scale: pressedProductId === p.id ? [1, 0.97, 1.03, 1] : 1,
                        boxShadow: pressedProductId === p.id
                          ? '0 0 40px rgba(245,197,24,0.5)'
                          : 'none',
                      }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl relative overflow-hidden ${
                        isOutOfStock
                          ? 'cursor-not-allowed bg-white/10 text-white/30'
                          : 'bg-gradient-to-r from-gold to-yellow-400 text-black hover:from-yellow-300 hover:to-gold hover:shadow-[0_0_30px_rgba(245,197,24,0.4)] transition-all'
                      }`}
                    >
                      <Plus size={14} />
                      Quick Add
                      {pressedProductId === p.id && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1.5 h-1.5 bg-white/80 rounded-full"
                              initial={{ x: '50%', y: '50%', opacity: 0, scale: 0 }}
                              animate={{
                                x: `${30 + i * 18}%`,
                                y: `${30 + i * 12}%`,
                                opacity: [0, 1, 0],
                                scale: [0, 1.8, 0],
                              }}
                              transition={{ duration: 0.5, delay: i * 0.04 }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </>
  )
}
