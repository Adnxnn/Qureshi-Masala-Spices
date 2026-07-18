'use client'

import { adminGetProducts, adminUpsertProduct } from '@/lib/admin-actions'
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import ProductItem from '@/components/ProductItem'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
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

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await adminGetProducts()
      setProducts(fetchedProducts)
    }
    fetchProducts()
  }, [])

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

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
      created_at: new Date()
    }

    await adminUpsertProduct(newProduct)
    
    const updatedProducts = await adminGetProducts()
    setProducts(updatedProducts)

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
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase text-white tracking-wider">Products</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gold text-black px-5 py-2.5 text-xs font-bold tracking-wider uppercase cursor-pointer hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-[#111] border border-white/10 p-6 rounded mb-8">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wider">New Product</h3>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Product Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Chicken Masala"
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
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
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none resize-none"
              />
            </div>
            <button type="submit" className="w-full bg-gold text-black py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors mt-2">
              Create Product
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
