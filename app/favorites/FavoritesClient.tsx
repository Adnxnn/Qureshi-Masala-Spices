'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react'
import ProductGrid from '@/components/site/ProductGrid'
import { useFavorites } from '@/lib/favorites'
import type { Product } from '@/types'
import styles from './Favorites.module.css'

export default function FavoritesClient({ products }: { products: Product[] }) {
  const [mounted, setMounted] = useState(false)
  const productIds = useFavorites(state => state.productIds)
  const remove = useFavorites(state => state.remove)
  useEffect(() => setMounted(true), [])

  const savedProducts = mounted ? productIds.map(id => products.find(product => product.id === id)).filter((product): product is Product => !!product) : []
  const unavailableIds = mounted ? productIds.filter(id => !products.some(product => product.id === id)) : []

  return <div className={styles.page}>
    <div className={styles.container}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">Favorites</span></nav>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}><Heart size={15} fill="currentColor" aria-hidden="true" /> YOUR SAVED BLENDS</p><h1>Worth coming <em>back for.</em></h1><p>Keep the flavours you love in one place. Choose a pack size, then add it to your cart whenever you&apos;re ready.</p></div>
        <Link href="/order" className={styles.cartLink}><ShoppingBag size={18} aria-hidden="true" /> View cart <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
      {!mounted ? <p className={styles.loading} role="status">Loading your favorites…</p> : savedProducts.length ? <>
        <div className={styles.count}><p>{savedProducts.length} saved {savedProducts.length === 1 ? 'blend' : 'blends'}</p><Link href="/shop">Explore more spices <ArrowRight size={16} aria-hidden="true" /></Link></div>
        <ProductGrid products={savedProducts} />
      </> : <div className={styles.empty}><span><Heart size={34} strokeWidth={1.4} aria-hidden="true" /></span><h2>Your favorites will appear here.</h2><p>Tap the heart on any spice in the shop to save it for another day.</p><Link href="/shop">Explore the collection <ArrowRight size={18} aria-hidden="true" /></Link></div>}
      {unavailableIds.length > 0 && <div className={styles.unavailable}><p>{unavailableIds.length} saved {unavailableIds.length === 1 ? 'blend is' : 'blends are'} no longer in the collection.</p><button type="button" onClick={() => unavailableIds.forEach(remove)}>Remove unavailable</button></div>}
    </div>
  </div>
}
