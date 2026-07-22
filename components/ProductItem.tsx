'use client'

import { useState, useRef } from 'react'
import { TrendingDown, UploadCloud } from 'lucide-react'
import type { Product } from '@/types'

interface ProductItemProps {
  product: Product
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
    <article className={`overflow-hidden rounded-xl border border-white/10 bg-dark p-4 sm:p-5 ${!localProduct.is_active ? 'opacity-50' : ''}`}>
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {localProduct.image_url ? (
            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-800 sm:h-16 sm:w-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={localProduct.image_url} alt={localProduct.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: localProduct.accent_color }} />
          )}
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="break-words font-medium text-white">{localProduct.name}</span>
              {localProduct.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase text-black"
                  style={{ background: localProduct.accent_color }}>{localProduct.badge}</span>
              )}
              {!localProduct.is_active && <span className="text-[10px] text-red-400 tracking-wider uppercase">Inactive</span>}
            </div>
            <div className="break-words text-xs leading-5 text-white/45">{localProduct.category} · {localProduct.tags.join(', ')}</div>
          </div>
        </div>

        {/* Stock update */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-2.5 sm:justify-end sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex items-center gap-1">
            {localProduct.stock_qty < 10 && <TrendingDown size={12} className="text-red-400" />}
            <span className={`text-xs ${localProduct.stock_qty < 10 ? 'text-red-400' : 'text-white/50'}`}>
              {localProduct.stock_qty} left
            </span>
          </div>
          <input
            aria-label={`Stock quantity for ${localProduct.name}`}
            type="number"
            value={localProduct.stock_qty}
            min={0}
            inputMode="numeric"
            className="min-h-11 w-24 rounded-lg border border-white/10 bg-black px-2 text-center text-white focus:border-gold focus:outline-none sm:w-20 sm:text-sm"
            onChange={(e) => handleStockChange(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <div className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2">Product Image</div>
        <button
          type="button"
          aria-label={`Choose a product image for ${localProduct.name}`}
          onDragOver={(e) => { e.preventDefault() }}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="w-full cursor-pointer rounded-xl border border-dashed border-white/20 p-4 text-center transition-colors hover:border-gold/50 hover:bg-gold/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:p-6"
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
        </button>
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
          {localProduct.variants.map((variant, idx) => (
            <div key={idx} className="rounded-xl border border-white/5 bg-black/50 p-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/70">{variant.weight_grams}g</span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[9px] tracking-[0.15em] uppercase text-white/40 mb-1">Original Price (₹)</label>
                  <input
                    aria-label={`${variant.weight_grams} gram original price for ${localProduct.name}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={variant.original_price || variant.price}
                    className="min-h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-white focus:border-gold focus:outline-none sm:text-sm"
                    onChange={(e) => handleVariantChange(idx, 'original_price', parseInt(e.target.value) || variant.price)}
                  />
                </div>
                <div>
                  <label className="block text-[9px] tracking-[0.15em] uppercase text-white/40 mb-1">Discounted Price (₹)</label>
                  <input
                    aria-label={`${variant.weight_grams} gram discounted price for ${localProduct.name}`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={variant.price}
                    className="min-h-11 w-full rounded-lg border border-white/10 bg-black px-3 text-white focus:border-gold focus:outline-none sm:text-sm"
                    onChange={(e) => handleVariantChange(idx, 'price', parseInt(e.target.value) || variant.price)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
