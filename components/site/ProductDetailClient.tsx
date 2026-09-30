'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import type { Product } from '@/types'
import { productUseLabel } from '@/lib/shop-discovery'
import styles from './ProductDetail.module.css'

const weight = (grams: number) => grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`
const money = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

type RelatedRecipe = { name: string; slug: string; image: string | null; time: number | null }

export default function ProductDetailClient({ product, relatedRecipes = [] }: { product: Product; relatedRecipes?: RelatedRecipe[] }) {
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
    addNotification(product.name, product.image_url, variant.weight_grams, count)
    if (checkout) router.push('/order')
  }

  return <div className={styles.page}>
    <div className={styles.container}>
      <Link href="/shop" className={styles.back}><ArrowLeft size={16} /> Back to all spices</Link>
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.halo} aria-hidden="true" />
          {product.image_url ? <Image src={product.image_url} alt={`${product.name} pack`} fill priority sizes="(max-width: 767px) 90vw, 45vw" className={styles.pack} /> : <ShoppingBag size={72} aria-label="Product image unavailable" />}
          <span className={styles.galleryLabel}>QMS</span>
        </div>
        <div className={styles.details}>
          <p className={styles.eyebrow}>{productUseLabel(product)}</p>
          <h1>{product.name}</h1>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.atGlance} aria-label="Product overview"><span>Made for <strong>{product.short_description || product.name}</strong></span><span>Pack choices <strong>{product.variants.map(item => weight(item.weight_grams)).join(' · ')}</strong></span></div>
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
          <div className={styles.orderNote}><MessageCircle size={20} aria-hidden="true" /><p><strong>Know the full cost before confirming.</strong> The price above is for the spice pack. Delivery availability, charge and timing are quoted on WhatsApp after you send your order request. No payment is collected here.</p></div>
          {relatedRecipes[0] && <Link href={`/recipes/${relatedRecipes[0].slug}`} className={styles.recipePrompt}><span><small>FROM PACK TO PLATE</small><strong>Make {relatedRecipes[0].name}</strong><em>{relatedRecipes[0].time ? `${relatedRecipes[0].time} min recipe` : 'See the recipe'}</em></span><ArrowUpRight size={20} aria-hidden="true" /></Link>}
          <div className={styles.accordions}>
            <details><summary>Delivery &amp; ordering</summary><p>Delivery availability, charges and timing are confirmed by our team on WhatsApp after you submit your order.</p><Link href="/contact">Ask about your delivery area →</Link></details>
            <details><summary>Ingredients, allergens &amp; storage</summary><p>Keep sealed in a cool, dry place. The full ingredient list, allergen details and best-before date are printed on the pack. Please ask our team for the current label before ordering if you need to check an ingredient or allergen.</p><Link href="/contact">Ask about this pack →</Link></details>
            <details><summary>Need a little inspiration?</summary><p>Find ideas for your next meal in our recipe collection.</p><Link href="/recipes">Explore recipes →</Link></details>
          </div>
        </div>
      </div>
      {relatedRecipes.length > 0 && <section className={styles.recipeSection} aria-labelledby="product-recipes-title"><p className={styles.eyebrow}>From this pack to your plate</p><h2 id="product-recipes-title">A reason to get cooking.</h2><div className={styles.recipeGrid}>{relatedRecipes.map(recipe => <Link key={recipe.slug} href={`/recipes/${recipe.slug}`} className={styles.recipeCard}>{recipe.image && <span className={styles.recipeImage}><Image src={recipe.image} alt="" fill sizes="(max-width: 767px) 85vw, 30vw" /></span>}<span className={styles.recipeText}><strong>{recipe.name}</strong><small>{recipe.time ? `${recipe.time} min · ` : ''}See recipe ↗</small></span></Link>)}</div></section>}
      <section className={styles.more}><div><p className={styles.eyebrow}>Keep exploring</p><h2>Your next favourite is waiting.</h2></div><Link href="/shop" className="royal-button-secondary">Shop all spices</Link></section>
    </div>
    <div className={styles.sticky}><div><small>{variant ? weight(variant.weight_grams) : 'Pack unavailable'} · {count} pack{count === 1 ? '' : 's'}</small><strong>{variant ? money(variant.price * count) : 'Unavailable'}</strong></div><button type="button" className="royal-button" disabled={disabled} onClick={() => add()}><ShoppingBag size={18} />{label}</button></div>
  </div>
}
