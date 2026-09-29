'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product } from '@/types'
import { productUseLabel } from '@/lib/shop-discovery'
import styles from './Storefront.module.css'

const weight = (grams: number) => grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)
const slug = (product: Product) => product.slug || product.name.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

function ProductCard({ product }: { product: Product }) {
  const [selectedWeight, setSelectedWeight] = useState(product.variants[0]?.weight_grams)
  const [feedback, setFeedback] = useState('')
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => { setHydrated(true) }, [])
  const addItem = useCart(state => state.addItem)
  const items = useCart(state => state.items)
  const { addNotification } = useCartNotifications()
  const variant = product.variants.find(item => item.weight_grams === selectedWeight) || product.variants[0]
  const quantityInCart = items.filter(item => item.product.id === product.id).reduce((total, item) => total + item.quantity, 0)
  const soldOut = !product.is_active || product.stock_qty <= 0 || !variant
  const atLimit = hydrated && quantityInCart >= product.stock_qty
  const href = `/product/${slug(product)}`

  function add() {
    const currentQuantity = useCart.getState().items.filter(item => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0)
    if (!variant || soldOut || currentQuantity >= product.stock_qty) return
    addItem(product, variant)
    addNotification(product.name, product.image_url, variant.weight_grams, 1)
    setFeedback(`${weight(variant.weight_grams)} added to your cart.`)
  }

  return (
    <article className={styles.productCard}>
      <Link href={href} className={styles.productImage} aria-label={`Explore ${product.name}`}>
        {product.image_url ? <Image src={product.image_url} alt={product.name} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 33vw, 25vw" className={styles.packImage} /> : <ShoppingBag size={64} aria-hidden="true" />}
        {soldOut && <span className={styles.productBadge}>Sold out</span>}
        <span className={styles.imageHint}>Explore blend ↗</span>
      </Link>
      <div className={styles.productBody}>
        <p className={styles.eyebrow}>{productUseLabel(product)}</p>
        <h3><Link href={href}>{product.name}</Link></h3>
        <p className={styles.productDescription}>{product.short_description || 'Find your next favourite flavour.'}</p>
        {variant && <fieldset className={styles.weights}>
          <legend className={styles.srOnly}>Choose pack size for {product.name}</legend>
          {product.variants.map(option => <button type="button" key={option.weight_grams} aria-pressed={option.weight_grams === variant.weight_grams} disabled={soldOut} onClick={() => { setSelectedWeight(option.weight_grams); setFeedback('') }}>{weight(option.weight_grams)}</button>)}
        </fieldset>}
        <div className={styles.productBottom}>
          <div><span className={styles.price}>{variant ? money(variant.price) : 'Unavailable'}</span>{variant && variant.original_price > variant.price && <del className={styles.oldPrice}>{money(variant.original_price)}</del>}</div>
          <button type="button" className={styles.addButton} disabled={soldOut || atLimit} onClick={add} aria-label={soldOut ? `${product.name} unavailable` : atLimit ? `Stock limit reached for ${product.name}` : `Add ${product.name}, ${variant ? weight(variant.weight_grams) : ''} to cart`}><Plus size={17} aria-hidden="true" /><span>{soldOut ? 'Unavailable' : atLimit ? 'In cart' : 'Add'}</span></button>
        </div>
        <span className={styles.srOnly} role="status">{feedback}</span>
      </div>
    </article>
  )
}

export default function ProductGrid({ products, loading = false }: { products: Product[]; loading?: boolean }) {
  if (loading) return <div className={styles.productGrid} aria-busy="true" aria-label="Loading products">{Array.from({ length: 4 }, (_, index) => <div className={styles.skeleton} key={index} />)}</div>
  return <div className={styles.productGrid}>{products.map(product => <ProductCard key={product.id} product={product} />)}</div>
}
