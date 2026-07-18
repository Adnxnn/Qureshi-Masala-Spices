'use client'

import { useState, useRef } from 'react'
import { UploadCloud } from 'lucide-react'

interface ImageUploadProps {
  productId: string
  currentImageUrl: string
}

export default function ImageUpload({ productId, currentImageUrl }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        // Update the product in the backend
        const { adminUpdateProductImage } = await import('@/lib/actions')
        await adminUpdateProductImage(productId, result.imageUrl)
        window.location.reload() // Refresh to see the changes
      } else {
        alert('Failed to upload image')
        setPreviewUrl(currentImageUrl)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setPreviewUrl(currentImageUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleImageChange(files[0])
    }
  }

  return (
    <div>
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
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded overflow-hidden bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Product" className="w-full h-full object-cover" />
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
  )
}
