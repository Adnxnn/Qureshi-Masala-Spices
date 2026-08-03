'use client'
import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search, ArrowUpDown } from 'lucide-react'
import ProductGrid from '@/components/site/ProductGrid'
import type { Product } from '@/types'

export default function ClientShopPage({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('featured')

  // Categories
  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'chicken', label: 'Chicken' },
    { value: 'seafood', label: 'Seafood' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'spice', label: 'Spices' },
  ]

  // Filter and sort products (client side)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.variants[0].price - b.variants[0].price)
        break
      case 'price-high':
        result.sort((a, b) => b.variants[0].price - a.variants[0].price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'featured':
      default:
        // Keep original order with best sellers first
        break
    }

    return result
  }, [initialProducts, selectedCategory, searchQuery, sortBy])

  return (
    <div className="royal-page royal-grain px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative background logo */}
        <div className="pointer-events-none absolute left-1/2 top-6 z-0 w-[250px] -translate-x-1/2 select-none opacity-[0.035] sm:top-10 sm:w-[600px] lg:w-[900px]">
          <Image
            src="/images/Qureshi's Nav.png"
            alt=""
            width={900}
            height={228}
            className="h-auto w-full"
          />
        </div>
        
        {/* Header */}
        <div className="mb-8 sm:mb-12 relative z-10">
          <p className="royal-eyebrow mb-3">The Qureshi&apos;s collection</p>
          <h1 className="royal-title mb-3 text-5xl sm:mb-4 sm:text-6xl md:text-7xl lg:text-8xl">A spice for every story.</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base md:text-lg">Explore our collection of authentic, handcrafted spice blends made with traditional recipes.</p>
        </div>

        {/* Filters - All in One Horizontal Line */}
        <div className="mb-8 sm:mb-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="royal-field py-3.5 pl-11 pr-4 text-sm placeholder:text-white/20 sm:py-4 sm:pr-5 sm:text-base"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-1 items-center gap-2 sm:gap-2.5 overflow-x-auto hide-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`min-h-11 flex-shrink-0 rounded-[2px] border px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.24em] transition-colors sm:px-5 sm:py-3 sm:text-[10px] ${
                    selectedCategory === cat.value
                      ? 'border-gold/65 bg-gold/10 text-gold-light'
                      : 'border-white/10 bg-black/30 text-muted hover:border-gold/30 hover:text-cream'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="min-w-[160px] sm:min-w-[180px]">
              <div className="relative">
                <ArrowUpDown className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" size={16} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="royal-field cursor-pointer appearance-none px-4 py-3.5 text-sm sm:px-5 sm:py-4 sm:text-base"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="name">Name: A → Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 relative z-10">
          <div className="inline-flex items-center gap-3 px-4 sm:px-5 py-2 border-b border-white/10">
            <span className="text-white/40 text-[10px] sm:text-[11px] tracking-[0.3em] uppercase">
              <span className="text-gold font-semibold">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'} found
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="relative z-10">
            <ProductGrid products={filteredProducts} loading={false} />
          </div>
        ) : (
          <div className="royal-panel py-20 text-center sm:py-32">
            <div className="font-display text-4xl text-white/30 sm:mb-5 sm:text-5xl md:text-6xl">No products found.</div>
            <p className="text-white/20 text-sm sm:text-base md:text-lg max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  )
}
