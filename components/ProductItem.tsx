'use client'

import { useState, useRef } from 'react'
import { TrendingDown, Check, UploadCloud } from 'lucide-react'

interface ProductItemProps {
  product: {
    id: string | number
    name: string
    category: string
    tags: string[]
    badge: string | null
    is_active: boolean
    accent_color: string
    image_url: string
    stock_qty: number
    variants: { weight_grams: number; price: number; original_price: number }[]
  }
}

export default function ProductItem({ product }: ProductItemProps) {
  const [localProduct, setLocalProduct] = useState(product)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Just update local preview for demo
    const objectUrl = URL.createObjectURL(file)
    setLocalProduct(prev => ({ ...prev, image_url: objectUrl }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleImageChange(files[0])
    }
  }

  const handleStockChange = (qty: number) => {
    setLocalProduct(prev => ({ ...prev, stock_qty: qty }))
  }

  const handleVariantChange = (index: number, field: 'price' | 'original_price', value: number) => {
    const updatedVariants = [...localProduct.variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setLocalProduct(prev => ({ ...prev, variants: updatedVariants }))
  }

  return (
    <div className={`bg-dark border border-white/10 p-5 ${!localProduct.is_active ? 'opacity-40' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {localProduct.image_url ? (
            <div className="w-16 h-16 rounded overflow-hidden bg-gray-800 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={localProduct.image_url} alt={localProduct.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: localProduct.accent_color }} />
          )}
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-medium text-white">{localProduct.name}</span>
              {localProduct.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-black"
                  style={{ background: localProduct.accent_color }}>{localProduct.badge}</span>
              )}
              {!localProduct.is_active && <span className="text-[10px] text-red-400 tracking-wider uppercase">Inactive</span>}
            </div>
            <div className="text-xs text-white/35">{localProduct.category} · {localProduct.tags.join(', ')}</div>
          </div>
        </div>

        {/* Stock update */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {localProduct.stock_qty < 10 && <TrendingDown size={12} className="text-red-400" />}
            <span className={`text-xs ${localProduct.stock_qty < 10 ? 'text-red-400' : 'text-white/50'}`}>
              {localProduct.stock_qty} left
            </span>
          </div>
          <input
            type="number"
            value={localProduct.stock_qty}
            min={0}
            className="w-16 bg-black border border-white/10 text-white text-xs px-2 py-1 focus:border-gold focus:outline-none text-center"
            onChange={(e) => handleStockChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Product Image</div>
        <div
          onDragOver={(e) => { e.preventDefault() }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-gold/50 transition-all"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              <p className="text-white/60 text-xs">Uploading...</p>
            </div>
          ) : localProduct.image_url ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded overflow-hidden bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={localProduct.image_url} alt={localProduct.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-white/60 text-xs">Drag & drop a new image or click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud size={32} className="text-white/40" />
              <p className="text-white/60 text-xs">Drag & drop an image here or click to select</p>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleImageChange(e.target.files[0])
            }
          }}
          className="hidden"
        />
      </div>

      {/* Variants editing */}
      <div className="border-t border-white/5 pt-4">
        <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">Variants & Prices</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {localProduct.variants.map((variant, idx) => (
            <div key={idx} className="bg-black/50 p-3 rounded border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/70">{variant.weight_grams}g</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[9px] tracking-[0.15em] uppercase text-white/40 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={variant.original_price || variant.price}
                    className="w-full bg-black border border-white/10 text-white text-xs px-2 py-1.5 focus:border-gold focus:outline-none"
                    onChange={(e) => handleVariantChange(idx, 'original_price', parseInt(e.target.value) || variant.price)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.15em] uppercase text-white/40 mb-1">Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={variant.price}
                    className="w-full bg-black border border-white/10 text-white text-xs px-2 py-1.5 focus:border-gold focus:outline-none"
                    onChange={(e) => handleVariantChange(idx, 'price', parseInt(e.target.value) || variant.price)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
