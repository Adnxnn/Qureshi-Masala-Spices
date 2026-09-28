'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product } from '@/types'
import styles from './ProductDetail.module.css'

const weight = (grams: number) => grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export default function ProductDetailClient({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [hydrated, setHydrated] = useState(false)
  const [feedback, setFeedback] = useState('')
  const items = useCart(state => state.items)
  const addItem = useCart(state => state.addItem)
  const { addNotification } = useCartNotifications()
  const router = useRouter()
  useEffect(() => { setHydrated(true) }, [])
  const variant = product.variants[selected] || product.variants[0]
  const inCart = hydrated ? items.filter(item => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0) : 0
  const remaining = Math.max(0, product.stock_qty - inCart)
  const unavailable = !product.is_active || product.stock_qty <= 0 || !variant
  const count = Math.min(quantity, Math.max(1, remaining))
  const disabled = !hydrated || unavailable || remaining < 1
  const label = unavailable ? 'Currently unavailable' : remaining < 1 ? 'Stock limit reached' : 'Add to cart'

  function add(checkout = false) {
    // Recheck the current store so repeated taps cannot exceed displayed stock.
    const current = useCart.getState().items.filter(item => item.product.id === product.id).reduce((sum, item) => sum + item.quantity, 0)
    if (disabled || !variant || current + count > product.stock_qty) return
    for (let i = 0; i < count; i++) addItem(product, variant)
    setFeedback(`${count} × ${weight(variant.weight_grams)} added to your cart.`)
    addNotification(product.name, product.image_url)
    if (checkout) router.push('/order')
  }

  return <div className={styles.page}>
    <div className={styles.container}>
      <Link href="/shop" className={styles.back}><ArrowLeft size={16} /> Back to all spices</Link>
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.halo} aria-hidden="true" />
          {product.image_url ? <Image src={product.image_url} alt={`${product.name} pack`} fill priority sizes="(max-width: 767px) 90vw, 45vw" className={styles.pack} /> : <ShoppingBag size={72} aria-label="Product image unavailable" />}
          <span className={styles.galleryLabel}>Qureshi&apos;s Masala &amp; Spices</span>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>{product.category === 'spice' ? 'Spices & blends' : product.category}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.price}><strong>{variant ? money(variant.price) : 'Unavailable'}</strong>{variant && variant.original_price > variant.price && <del>{money(variant.original_price)}</del>}</div>
          <p className={styles.availability}>{unavailable ? 'This blend is currently unavailable.' : remaining < 1 ? 'All available packs are already in your cart.' : 'Available to order'}</p>
          {variant && <fieldset className={styles.sizes}><legend>Choose your pack</legend><div>{product.variants.map((option, index) => <button type="button" key={option.weight_grams} aria-pressed={selected === index} disabled={unavailable} onClick={() => { setSelected(index); setFeedback('') }}><span>{weight(option.weight_grams)}</span><small>{money(option.price)}</small>{selected === index && <Check size={16} aria-hidden="true" />}</button>)}</div></fieldset>}
          <div className={styles.purchase}>
            <div className={styles.quantity} aria-label="Quantity">
              <button type="button" aria-label="Decrease quantity" disabled={count <= 1 || disabled} onClick={() => setQuantity(count - 1)}><Minus size={18} /></button>
              <output aria-label="Selected quantity">{count}</output>
              <button type="button" aria-label="Increase quantity" disabled={count >= remaining || disabled} onClick={() => setQuantity(count + 1)}><Plus size={18} /></button>
            </div>
            <button type="button" className="royal-button" disabled={disabled} onClick={() => add()}><ShoppingBag size={18} />{label}</button>
          </div>
          <button type="button" className={`royal-button-secondary ${styles.checkout}`} disabled={disabled} onClick={() => add(true)}>Add &amp; continue to checkout</button>
          <p role="status" className={styles.feedback}>{feedback}</p>
          <div className={styles.orderNote}><MessageCircle size={20} aria-hidden="true" /><p>Place your order here, then confirm delivery and payment with our team on WhatsApp. No online payment is collected.</p></div>
          <div className={styles.accordions}>
            <details><summary>Delivery &amp; ordering</summary><p>Delivery availability, charges and timing are confirmed by our team on WhatsApp after you submit your order.</p><Link href="/contact">Ask about your delivery area →</Link></details>
            <details><summary>Storage &amp; product information</summary><p>Keep sealed in a cool, dry place. Check the pack label for ingredients, allergens, storage instructions and best-before information.</p></details>
            <details><summary>Need a little inspiration?</summary><p>Find ideas for your next meal in our recipe collection.</p><Link href="/recipes">Explore recipes →</Link></details>
          </div>
        </div>
      </div>
      <section className={styles.more}><div><p className={styles.eyebrow}>Keep exploring</p><h2>Your next favourite is waiting.</h2></div><Link href="/shop" className="royal-button-secondary">Shop all spices</Link></section>
    </div>
    <div className={styles.sticky}><div><small>{variant ? weight(variant.weight_grams) : 'Pack unavailable'} · {count} pack{count === 1 ? '' : 's'}</small><strong>{variant ? money(variant.price * count) : 'Unavailable'}</strong></div><button type="button" className="royal-button" disabled={disabled} onClick={() => add()}><ShoppingBag size={18} />{label}</button></div>
  </div>
}
