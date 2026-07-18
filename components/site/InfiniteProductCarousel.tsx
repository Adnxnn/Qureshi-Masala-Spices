'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Product } from '@/types'

interface InfiniteProductCarouselProps {
  products: Product[]
}

export default function InfiniteProductCarousel({ products }: InfiniteProductCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const isPausedRef = useRef(false)
  const lastTimeRef = useRef<number | null>(null)
  const singleSetLength = products.length
  const allProducts = [...products, ...products, ...products]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Set initial position in the middle
    const itemWidth = container.scrollWidth / allProducts.length
    const singleSetWidth = itemWidth * singleSetLength
    container.scrollLeft = singleSetWidth

    // Animation function
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp
      }

      if (!isPausedRef.current) {
        const delta = timestamp - lastTimeRef.current
        lastTimeRef.current = timestamp
        
        container.scrollLeft += delta * 0.15 // Auto-scroll speed

        // Loop detection
        const singleSetWidth = container.scrollWidth / 3
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth
        } else if (container.scrollLeft < singleSetWidth) {
          container.scrollLeft += singleSetWidth
        }
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Pause on hover/touch
    const pause = () => { isPausedRef.current = true }
    const resume = () => { isPausedRef.current = false; lastTimeRef.current = null }

    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)
    container.addEventListener('touchstart', pause)
    container.addEventListener('touchend', resume)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
      container.removeEventListener('touchstart', pause)
      container.removeEventListener('touchend', resume)
    }
  }, [singleSetLength, allProducts.length])

  return (
    <div className="overflow-hidden">
      <div
        ref={containerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {allProducts.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="flex-shrink-0 w-[150px] sm:w-[190px] md:w-[230px]"
          >
            <div className="bg-gradient-to-br from-dark to-black border border-white/5 rounded-xl overflow-hidden group hover:border-gold/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,197,24,0.15)]">
              <div className="aspect-[3/4] relative bg-gray-800">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority={idx < 6}
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-display text-xs sm:text-sm md:text-base uppercase text-white tracking-wide">
                  {product.name}
                </h3>
                <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-white/35 mt-1 md:mt-2">
                  {product.category}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
