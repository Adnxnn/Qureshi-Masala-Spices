'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const DEFAULT_SLIDES = [
  '/images/Ourheritage1.jpg',
  '/images/Ourheritage2.jpg',
  '/images/Ourheritage3.jpg',
  '/images/Ourheritage4.jpg',
  '/images/Ourheritage5.jpg',
  '/images/Ourheritage6.jpg',
  '/images/Ourheritage7.jpg',
  '/images/Ourheritage8.jpg',
  '/images/Ourheritage9.jpg'
]

interface SlideshowProps {
  slides?: string[]
  autoPlay?: boolean
  interval?: number
  className?: string
  aspectRatio?: string
}

export default function Slideshow({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  interval = 4000,
  className = '',
  aspectRatio = 'aspect-square'
}: SlideshowProps) {
  const [index, setIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const next = () => {
    // Pause current video before switching
    const currentVideo = videoRefs.current[index]
    if (currentVideo) currentVideo.pause()
    setIndex((prev) => (prev + 1) % slides.length)
  }

  const prev = () => {
    const currentVideo = videoRefs.current[index]
    if (currentVideo) currentVideo.pause()
    setIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goTo = (i: number) => {
    const currentVideo = videoRefs.current[index]
    if (currentVideo) currentVideo.pause()
    setIndex(i)
  }

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay) return

    // Check if current slide is a video
    const currentSlide = slides[index]
    const isVideo = currentSlide.match(/\.(mp4|webm|ogg)$/i)

    let timer: NodeJS.Timeout
    if (isVideo) {
      // If it's a video, listen for when it ends
      const videoElement = videoRefs.current[index]
      if (videoElement) {
        videoElement.onended = next
      }
    } else {
      // If it's an image, use the interval timer
      timer = setInterval(next, interval)
    }

    return () => {
      if (timer) clearInterval(timer)
      // Clean up onended listener
      if (videoRefs.current[index]) {
        videoRefs.current[index]!.onended = null
      }
    }
  }, [autoPlay, interval, index, slides])

  // Play video when it becomes active
  useEffect(() => {
    const videoElement = videoRefs.current[index]
    if (videoElement && slides[index].match(/\.(mp4|webm|ogg)$/i)) {
      videoElement.currentTime = 0
      videoElement.play().catch(() => {})
    }
  }, [index, slides])

  return (
    <div className={`relative w-full ${aspectRatio} overflow-hidden ${className}`}>
      {/* Main slideshow container */}
      {slides.map((src, i) => {
        const isVideo = src.match(/\.(mp4|webm|ogg)$/i)

        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {isVideo ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[i] = el;
                        }}
                        src={src}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        autoPlay
                        loop
                      />
                    ) : (
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className="object-cover"
              />
            )}
          </div>
        )
      })}

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        aria-label="Show previous slide"
        className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:bg-gold hover:text-black"
      >
        &lt;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        aria-label="Show next slide"
        className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition-all hover:bg-gold hover:text-black"
      >
        &gt;
      </button>

      {/* Dots */}
      <div className="absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 gap-0.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); goTo(i); }}
            aria-label={`Show slide ${i + 1} of ${slides.length}`}
            aria-current={i === index ? 'true' : undefined}
            className="group grid size-11 place-items-center rounded-full"
          >
            <span
              aria-hidden="true"
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-gold' : 'w-2 bg-white/40 group-hover:bg-white/70'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
