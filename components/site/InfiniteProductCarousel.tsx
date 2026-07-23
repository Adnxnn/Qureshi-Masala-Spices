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
        className="flex items-stretch gap-4 overflow-x-auto md:gap-6 hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {allProducts.map((product, idx) => (
          <div
            key={`${product.id}-${idx}`}
            className="flex w-[150px] flex-shrink-0 self-stretch sm:w-[190px] md:w-[230px]"
          >
            <div className="group flex w-full flex-col overflow-hidden bg-transparent transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-[radial-gradient(circle_at_50%_40%,rgba(199,161,90,0.09),transparent_24%),radial-gradient(circle_at_50%_55%,rgba(91,23,24,0.18),transparent_52%),#0c0a08] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.3)]">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-3 drop-shadow-[0_22px_24px_rgba(0,0,0,0.58)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.04]"
                  priority={idx < 6}
                />
              </div>
              <div className="flex min-h-[82px] flex-1 flex-col items-center px-2 pb-2 pt-4 text-center sm:min-h-[92px] md:px-3 md:pt-5">
                <h3 className="line-clamp-2 min-h-[2.1em] font-display text-base font-semibold leading-[1.05] text-white sm:text-lg md:text-xl">
                  {product.name}
                </h3>
                <p className="mt-2 text-[8px] uppercase tracking-[0.28em] text-white/35 sm:text-[9px] md:text-[10px]">
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
