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
            <div className="group overflow-hidden rounded-[3px] border border-gold/15 bg-gradient-to-b from-dark to-black transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-gold/40">
              <div className="relative aspect-[3/4] bg-[radial-gradient(circle_at_50%_42%,rgba(91,23,24,0.22),transparent_48%),#0c0907] p-4">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-3 drop-shadow-[0_22px_24px_rgba(0,0,0,0.58)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04]"
                  priority={idx < 6}
                />
              </div>
              <div className="p-3 md:p-4 text-center">
                <h3 className="font-display text-base font-semibold leading-tight text-white sm:text-lg md:text-xl">
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
