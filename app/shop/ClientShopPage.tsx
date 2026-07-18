'use client'
import { useState, useMemo } from 'react'
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
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative">
        {/* Decorative background logo */}
        <div className="absolute top-6 sm:top-10 left-1/2 -translate-x-1/2 w-[250px] sm:w-[350px] sm:w-[600px] lg:w-[900px] pointer-events-none select-none z-0 opacity-[0.08]">
          <img
            src="/images/Qureshi's Nav.png"
            alt=""
            className="w-full h-auto"
          />
        </div>
        
        {/* Header */}
        <div className="mb-8 sm:mb-12 relative z-10">
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase text-white mb-3 sm:mb-4">Our Spices</h1>
          <p className="text-white/50 text-sm sm:text-base md:text-lg max-w-2xl">Explore our collection of authentic, handcrafted spice blends made with traditional recipes.</p>
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
                className="w-full bg-black/40 border border-white/10 text-white pl-11 sm:pr-5 pr-4 py-3.5 sm:py-4 rounded-2xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300 placeholder:text-white/20 text-sm sm:text-base backdrop-blur-sm hover:border-white/20"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-1 items-center gap-2 sm:gap-2.5 overflow-x-auto hide-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex-shrink-0 px-4 sm:px-5 py-2.5 sm:py-3 text-[9px] sm:text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-2xl border ${
                    selectedCategory === cat.value
                      ? 'border-gold text-gold bg-gold/10 shadow-[0_0_20px_rgba(245,197,24,0.15)]'
                      : 'border-white/10 text-gold hover:border-white/20 hover:text-white/70 bg-black/40 hover:bg-black/60'
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
                  className="w-full bg-black/40 border border-white/10 text-white px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300 appearance-none cursor-pointer text-sm sm:text-base backdrop-blur-sm hover:border-white/20"
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
          <div className="text-center py-20 sm:py-32 bg-black/30 border border-white/10 rounded-3xl backdrop-blur-sm">
            <div className="font-display text-3xl sm:text-4xl md:text-5xl text-white/30 mb-4 sm:mb-5">No products found</div>
            <p className="text-white/20 text-sm sm:text-base md:text-lg max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  )
}
