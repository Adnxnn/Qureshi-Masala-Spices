'use client'

import { useState, useRef } from 'react'
import { UploadCloud } from 'lucide-react'

async function updateProductImage(productId: string, imageUrl: string) {
  const { adminUpdateProductImage } = await import('@/lib/actions')
  await adminUpdateProductImage(productId, imageUrl)
}

export default function ProductImageUpload({
  productId,
  currentImageUrl
}: {
  productId: string
  currentImageUrl?: string
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsUploading(true)

    // Create a preview
    const objectUrl = URL.createObjectURL(file)
    setImageUrl(objectUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setImageUrl(result.imageUrl)
        await updateProductImage(productId, result.imageUrl)
        window.location.reload()
      } else {
        alert('Failed to upload image')
        setImageUrl(currentImageUrl)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
      setImageUrl(currentImageUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFile(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFile(e.target.files[0])
    }
  }

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
          isDragging ? 'border-gold bg-gold/10' : 'border-white/20 hover:border-gold/50'
        }`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
            <p className="text-white/60 text-xs">Uploading...</p>
          </div>
        ) : imageUrl ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded overflow-hidden bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="Product" className="w-full h-full object-cover" />
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
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}
