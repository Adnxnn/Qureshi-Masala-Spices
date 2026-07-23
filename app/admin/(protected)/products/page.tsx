'use client'

import { adminGetProducts, adminUpsertProduct } from '@/lib/admin-actions'
import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus, X } from 'lucide-react'
import ProductItem from '@/components/ProductItem'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    image_url: '',
    accent_color: '',
    category: 'spice',
    stock_qty: '',
    tags: '',
    badge: '',
    description: ''
  })

  const fetchProducts = useCallback(async () => {
    try {
      setError('')
      const fetchedProducts = await adminGetProducts()
      setProducts(fetchedProducts)
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Unable to load products.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProducts()
  }, [fetchProducts])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const defaultVariants = [
      { weight_grams: 200, price: 120, original_price: 150 },
      { weight_grams: 500, price: 300, original_price: 375 },
      { weight_grams: 1000, price: 600, original_price: 750 }
    ]

    const newProduct = {
      name: formData.name,
      short_description: formData.short_description,
      description: formData.description,
      image_url: formData.image_url,
      accent_color: formData.accent_color,
      category: formData.category,
      stock_qty: parseInt(formData.stock_qty) || 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      badge: formData.badge || null,
      is_active: true,
      variants: defaultVariants,
      created_at: new Date().toISOString()
    }

    try {
      await adminUpsertProduct(newProduct)
      await fetchProducts()

      setShowAddForm(false)
      setFormData({
        name: '',
        short_description: '',
        image_url: '',
        accent_color: '',
        category: 'spice',
        stock_qty: '',
        tags: '',
        badge: '',
        description: ''
      })
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to create the product.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold md:hidden">
            Catalogue management
          </p>
          <h1 className="royal-title text-5xl sm:text-6xl">
            Products
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-gold px-5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-11 sm:w-auto"
        >
          {showAddForm ? <X size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-[2px] border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-300"
        >
          {error}
        </div>
      ) : null}

      {showAddForm && (
        <section className="mb-8 overflow-hidden rounded-[3px] border border-white/10 bg-[#111]">
          <div className="border-b border-white/10 bg-gradient-to-r from-gold/10 to-transparent px-4 py-4 sm:px-6">
            <h2 className="text-sm font-semibold tracking-wider text-white">New Product</h2>
            <p className="mt-1 text-xs leading-5 text-white/40">
              Add the product details. Default 200g, 500g and 1kg variants will be created.
            </p>
          </div>
          <form onSubmit={handleAddProduct} className="space-y-4 p-4 sm:p-6">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Product Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Chicken Masala"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Short Description</label>
              <input
                name="short_description"
                type="text"
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                placeholder="Bold chicken curry blend"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Image URL</label>
              <input
                name="image_url"
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Accent Color (hex)</label>
              <input
                name="accent_color"
                type="text"
                value={formData.accent_color}
                onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                placeholder="#E8730A"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                >
                  <option value="chicken">Chicken</option>
                  <option value="seafood">Seafood</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="spice">Spice</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Stock Qty</label>
                <input
                  name="stock_qty"
                  type="number"
                  value={formData.stock_qty}
                  onChange={(e) => setFormData({ ...formData, stock_qty: e.target.value })}
                  placeholder="100"
                  className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Tags (comma separated)</label>
              <input
                name="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="smoky,bold,spicy"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Badge (optional)</label>
              <input
                name="badge"
                type="text"
                value={formData.badge}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="New"
                className="min-h-12 w-full rounded-[2px] border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Description</label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Full product description..."
                className="w-full resize-none rounded-[2px] border border-white/10 bg-black px-3 py-3 text-white focus:border-gold focus:outline-none sm:text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-gold px-5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : null}
              {saving ? 'Creating Product…' : 'Create Product'}
            </button>
          </form>
        </section>
      )}

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center text-white/40">
          <Loader2 size={24} className="animate-spin text-gold" aria-hidden="true" />
          <span className="ml-3 text-sm">Loading products…</span>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {products.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
          {products.length === 0 ? (
            <div className="rounded-[2px] border border-dashed border-white/10 py-16 text-center text-sm text-white/35">
              No products found.
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
