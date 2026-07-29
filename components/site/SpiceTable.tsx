'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { ArrowUpRight, Check, Plus } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product, ProductVariant } from '@/types'

type Category = Product['category'] | 'all'

const CATEGORY_LABELS: Record<Category, string> = {
  all: 'All Blends',
  spice: 'Spice',
  chicken: 'Chicken',
  seafood: 'Seafood',
  vegetarian: 'Vegetarian',
}

const CATEGORY_ACCENTS: Record<Product['category'], string> = {
  spice: '#E8A317',
  chicken: '#C1121F',
  seafood: '#257C7A',
  vegetarian: '#4A6C2F',
}

const CARD_ROTATIONS = [-2.8, 1.9, -1.2, 2.5, -1.9, 1.2]

function formatWeight(grams: number) {
  return grams >= 1000 ? `${grams / 1000}kg` : `${grams}g`
}

function getAccent(product: Product) {
  return /^#[0-9a-f]{6}$/i.test(product.accent_color || '')
    ? product.accent_color
    : CATEGORY_ACCENTS[product.category]
}

function getProductSlug(product: Product) {
  return product.slug || product.name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function SpiceCard({ product, index }: { product: Product; index: number }) {
  const reduceMotion = useReducedMotion()
  const { addItem } = useCart()
  const { addNotification } = useCartNotifications()
  const [variantIndex, setVariantIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 24 })
  const selectedVariant: ProductVariant | undefined = product.variants[variantIndex]
  const accent = getAccent(product)
  const isOutOfStock = product.stock_qty <= 0
  const restingRotation = CARD_ROTATIONS[index % CARD_ROTATIONS.length]
  const productSlug = getProductSlug(product)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const resetTilt = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rotateX.set(y * -5)
    rotateY.set(x * 6)
  }

  const handleAdd = () => {
    if (!selectedVariant || isOutOfStock) return
    addItem(product, selectedVariant)
    addNotification(product.name, product.image_url)
    setAdded(true)
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetTimer.current = setTimeout(() => setAdded(false), 1400)
  }

  if (!selectedVariant) return null

  return (
    <motion.article
      className="qms-spice-card"
      style={{
        '--spice-accent': accent,
        '--resting-rotation': `${restingRotation}deg`,
        rotateX,
        rotateY,
      } as React.CSSProperties}
      initial={reduceMotion ? false : { opacity: 0, y: 54, rotate: restingRotation * 2.1 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: restingRotation }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.62, delay: Math.min(index * 0.045, 0.22), ease: [0.22, 1, 0.36, 1] }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="qms-spice-card-topline" aria-hidden="true">
        <span>Batch {String((index % 9) + 1).padStart(2, '0')}</span>
        <span>{product.category}</span>
      </div>

      <Link
        href={`/product/${productSlug}`}
        className="qms-spice-product-link"
        aria-label={`View ${product.name}`}
      >
        <span className="qms-spice-image-stage">
          <span className="qms-spice-halo" aria-hidden="true" />
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 639px) 78vw, (max-width: 1023px) 44vw, 28vw"
            className="qms-spice-image"
            priority={index < 3}
          />
          {product.badge ? <span className="qms-spice-badge">{product.badge}</span> : null}
          <span className="qms-spice-view-mark" aria-hidden="true">
            <ArrowUpRight size={16} />
          </span>
        </span>
      </Link>

      <div className="qms-spice-card-copy">
        <p className="qms-spice-microcopy">
          Ground fresh <span aria-hidden="true">•</span> No preservatives
        </p>
        <Link href={`/product/${productSlug}`} className="qms-spice-name">
          {product.name}
        </Link>
        <p className="qms-spice-description">{product.short_description || product.description}</p>
      </div>

      <div className="qms-spice-commerce">
        <div className="qms-spice-variants" aria-label={`Choose weight for ${product.name}`}>
          {product.variants.map((variant, variantIdx) => (
            <button
              key={`${product.id}-${variant.weight_grams}`}
              type="button"
              className="qms-spice-weight"
              data-selected={variantIdx === variantIndex}
              onClick={() => setVariantIndex(variantIdx)}
              aria-pressed={variantIdx === variantIndex}
            >
              {formatWeight(variant.weight_grams)}
            </button>
          ))}
        </div>

        <div className="qms-spice-buy-row">
          <div>
            <span className="qms-spice-price-label">Price</span>
            <span className="qms-spice-price">₹{selectedVariant.price}</span>
          </div>
          <button
            type="button"
            className="qms-spice-add"
            data-added={added}
            disabled={isOutOfStock}
            onClick={handleAdd}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name}, ${formatWeight(selectedVariant.weight_grams)} to cart`}
          >
            {added ? <Check size={17} /> : <Plus size={17} />}
            <span>{isOutOfStock ? 'Sold Out' : added ? 'Added' : 'Quick Add'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default function SpiceTable({ products }: { products: Product[] }) {
  const [category, setCategory] = useState<Category>('all')

  const availableCategories = useMemo(() => {
    const categories: Category[] = ['all', 'spice', 'chicken', 'seafood', 'vegetarian']
    return categories.filter((item) => item === 'all' || products.some((product) => product.category === item))
  }, [products])

  const visibleProducts = useMemo(
    () => (category === 'all' ? products : products.filter((product) => product.category === category)).slice(0, 6),
    [category, products],
  )

  return (
    <div className="qms-spice-table-shell">
      <div className="qms-spice-filters" role="group" aria-label="Filter masalas by category">
        {availableCategories.map((item) => {
          const count = item === 'all'
            ? products.length
            : products.filter((product) => product.category === item).length

          return (
            <button
              key={item}
              type="button"
              className="qms-spice-filter"
              data-active={category === item}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
            >
              <span>{CATEGORY_LABELS[item]}</span>
              <span className="qms-spice-filter-count">{String(count).padStart(2, '0')}</span>
            </button>
          )
        })}
      </div>

      <p className="qms-spice-swipe-hint">
        Swipe the table <span aria-hidden="true">→</span>
      </p>

      <motion.div
        key={category}
        className="qms-spice-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {visibleProducts.map((product, index) => (
          <SpiceCard key={product.id} product={product} index={index} />
        ))}
      </motion.div>
    </div>
  )
}
