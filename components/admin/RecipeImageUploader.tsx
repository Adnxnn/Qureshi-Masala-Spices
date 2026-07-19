'use client'

import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

type RecipeImageUploaderProps = {
  label: string
  description: string
  value: string[]
  onChange: (urls: string[]) => void
  maxFiles?: number
}

async function uploadImage(file: File) {
  const body = new FormData()
  body.append('file', file)

  const response = await fetch('/api/upload', {
    method: 'POST',
    body,
  })

  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.imageUrl) {
    throw new Error(result?.error || 'The image could not be uploaded.')
  }

  return result.imageUrl as string
}

export default function RecipeImageUploader({
  label,
  description,
  value,
  onChange,
  maxFiles = 1,
}: RecipeImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadFiles = async (selectedFiles: File[]) => {
    if (!selectedFiles.length || isUploading) return

    setError(null)

    const invalidType = selectedFiles.find(
      (file) => !ALLOWED_TYPES.includes(file.type)
    )

    if (invalidType) {
      setError('Choose a JPG, PNG, WebP, or GIF image.')
      return
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_FILE_SIZE
    )

    if (oversizedFile) {
      setError(`${oversizedFile.name} is larger than 5 MB.`)
      return
    }

    const availableSlots =
      maxFiles === 1 ? 1 : Math.max(maxFiles - value.length, 0)

    if (availableSlots === 0) {
      setError(`You can upload up to ${maxFiles} images.`)
      return
    }

    const filesToUpload = selectedFiles.slice(0, availableSlots)

    if (filesToUpload.length < selectedFiles.length) {
      setError(
        `Only ${availableSlots} more image${
          availableSlots === 1 ? '' : 's'
        } can be added.`
      )
    }

    setIsUploading(true)

    try {
      const uploadedUrls = await Promise.all(
        filesToUpload.map(uploadImage)
      )

      onChange(
        maxFiles === 1
          ? uploadedUrls.slice(-1)
          : [...value, ...uploadedUrls]
      )
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'The image could not be uploaded.'
      )
    } finally {
      setIsUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  const removeImage = (url: string) => {
    onChange(value.filter((imageUrl) => imageUrl !== url))
    setError(null)
  }

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-[10px] tracking-[0.2em] uppercase text-white/50">
          {label}
        </label>

        <p className="mt-1 text-[11px] leading-4 text-white/35">
          {description}
        </p>
      </div>

      {value.length > 0 && (
        <div
          className={
            maxFiles === 1
              ? 'grid grid-cols-1'
              : 'grid grid-cols-2 sm:grid-cols-3 gap-3'
          }
        >
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={`group relative overflow-hidden rounded border border-white/10 bg-black ${
                maxFiles === 1 ? 'aspect-[16/9]' : 'aspect-square'
              }`}
            >
              <img
                src={url}
                alt={`${label} preview ${index + 1}`}
                width={640}
                height={360}
                loading="lazy"
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/90 to-transparent p-3 pt-10">
                <span className="truncate text-[10px] text-white/70">
                  {maxFiles === 1
                    ? 'Current image'
                    : `Image ${index + 1}`}
                </span>

                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  aria-label={`Remove ${label.toLowerCase()} image ${
                    index + 1
                  }`}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-red-500/15 text-red-300 transition-colors hover:bg-red-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Trash2 size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFiles > 1}
        onChange={(event) =>
          uploadFiles(Array.from(event.target.files || []))
        }
        className="sr-only"
        aria-label={`Choose ${label.toLowerCase()} images`}
      />

      <button
        type="button"
        disabled={isUploading}
        aria-busy={isUploading}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          uploadFiles(Array.from(event.dataTransfer.files))
        }}
        className={`flex min-h-32 w-full flex-col items-center justify-center gap-3 rounded border border-dashed px-5 py-6 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-wait disabled:opacity-70 ${
          isDragging
            ? 'border-gold bg-gold/10'
            : 'border-white/15 bg-black/50 hover:border-gold/60 hover:bg-gold/[0.04]'
        }`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gold">
          {isUploading ? (
            <Loader2
              size={20}
              className="animate-spin"
              aria-hidden="true"
            />
          ) : value.length > 0 ? (
            <ImagePlus size={20} aria-hidden="true" />
          ) : (
            <UploadCloud size={20} aria-hidden="true" />
          )}
        </span>

        <span>
          <span className="block text-xs font-semibold text-white">
            {isUploading
              ? 'Uploading image…'
              : value.length > 0 && maxFiles === 1
                ? 'Replace image'
                : 'Choose images or drag them here'}
          </span>

          <span className="mt-1 block text-[11px] text-white/35">
            JPG, PNG, WebP or GIF · maximum 5 MB each
          </span>
        </span>
      </button>

      {error && (
        <p role="alert" className="text-[11px] leading-4 text-red-300">
          {error}
        </p>
      )}
    </div>
  )
}