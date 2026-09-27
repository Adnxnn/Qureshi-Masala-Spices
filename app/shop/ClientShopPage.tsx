'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X, ArrowUpRight } from 'lucide-react'
import ProductGrid from '@/components/site/ProductGrid'
import type { Product } from '@/types'
import styles from '@/components/site/Storefront.module.css'

const categories = [
  { value: 'all', label: 'All spices' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'spice', label: 'Spices & blends' },
]
const sorts = ['featured', 'price-low', 'price-high', 'name']
const startingPrice = (product: Product) => product.variants.length ? Math.min(...product.variants.map(variant => variant.price)) : Infinity

export default function ClientShopPage({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [inStock, setInStock] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search)
      setSearchQuery(params.get('q') || '')
      setSelectedCategory(categories.some(item => item.value === params.get('category')) ? params.get('category')! : 'all')
      setSortBy(sorts.includes(params.get('sort') || '') ? params.get('sort')! : 'featured')
      setInStock(params.get('stock') === 'available')
      setReady(true)
    }
    restore()
    window.addEventListener('popstate', restore)
    return () => window.removeEventListener('popstate', restore)
  }, [])

  useEffect(() => {
    if (!ready) return
    const params = new URLSearchParams(window.location.search)
    for (const key of ['q', 'category', 'sort', 'stock']) params.delete(key)
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)
    if (sortBy !== 'featured') params.set('sort', sortBy)
    if (inStock) params.set('stock', 'available')
    const query = params.toString()
    window.history.replaceState(window.history.state, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash)
  }, [ready, searchQuery, selectedCategory, sortBy, inStock])

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const products = initialProducts.filter(product => product.is_active && (selectedCategory === 'all' || product.category === selectedCategory) && (!inStock || (product.stock_qty > 0 && product.variants.length > 0)) && (!query || [product.name, product.description, ...(product.tags || [])].join(' ').toLowerCase().includes(query)))
    if (sortBy === 'price-low') products.sort((a, b) => startingPrice(a) - startingPrice(b))
    if (sortBy === 'price-high') products.sort((a, b) => (Number.isFinite(startingPrice(b)) ? startingPrice(b) : -1) - (Number.isFinite(startingPrice(a)) ? startingPrice(a) : -1))
    if (sortBy === 'name') products.sort((a, b) => a.name.localeCompare(b.name))
    return products
  }, [initialProducts, selectedCategory, inStock, searchQuery, sortBy])

  const hasFilters = !!searchQuery || selectedCategory !== 'all' || inStock || sortBy !== 'featured'
  function reset() { setSearchQuery(''); setSelectedCategory('all'); setInStock(false); setSortBy('featured') }

  return <div className={styles.storefront}>
    <div className={styles.shopIntro}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">The spice collection</span></nav>
        <p className={styles.eyebrow}>A little spice. A lot of possibility.</p>
        <h1 className={styles.title}>Find your<br /><em>signature flavour.</em></h1>
        <div className={styles.introBottom}><p>From everyday favourites to the centrepiece of your next feast. Find a blend, choose your pack, and make it your own.</p><Link href="/recipes" className={styles.textLink}>Need inspiration? Explore recipes <ArrowUpRight size={18} /></Link></div>
      </div>
    </div>
    <section className={styles.section} aria-label="Shop spices">
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div className={styles.searchField}><Search size={20} aria-hidden="true" /><label htmlFor="spice-search" className={styles.srOnly}>Search spices</label><input id="spice-search" type="search" placeholder="Search a spice, dish or flavour…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} /></div>
          <div className={styles.sortField}><label htmlFor="spice-sort">Sort by</label><select id="spice-sort" value={sortBy} onChange={event => setSortBy(event.target.value)}><option value="featured">Collection order</option><option value="price-low">Starting price: low to high</option><option value="price-high">Starting price: high to low</option><option value="name">Name: A to Z</option></select></div>
        </div>
        <div className={styles.filterRow}><div className={styles.categoryPills} role="group" aria-label="Filter by category">{categories.map(category => <button type="button" key={category.value} aria-pressed={selectedCategory === category.value} onClick={() => setSelectedCategory(category.value)}>{category.label}</button>)}</div><label className={styles.stockToggle}><input type="checkbox" checked={inStock} onChange={event => setInStock(event.target.checked)} /> In stock only</label></div>
        <div className={styles.results}><p role="status">{filtered.length} {filtered.length === 1 ? 'blend' : 'blends'} to explore</p>{hasFilters && <button type="button" onClick={reset}>Clear filters <X size={14} aria-hidden="true" /></button>}</div>
        {filtered.length ? <ProductGrid products={filtered} /> : <div className={styles.empty}><Search size={32} aria-hidden="true" /><h2>No blends found.</h2><p>Try another spice name or clear your filters to explore the collection.</p><button type="button" onClick={reset} className={styles.primaryButton}>View all spices</button></div>}
        <div className={styles.helpStrip}><div><p className={styles.eyebrow}>Good food starts with a conversation</p><h2>Need a hand choosing?</h2></div><Link href="/contact" className={styles.outlineButton}>Talk to our team <ArrowUpRight size={17} /></Link></div>
      </div>
    </section>
  </div>
}
