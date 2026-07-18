'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

const announcements = [
  "Freshly ground in small batches — authentic taste, every time.",
  "Order directly via WhatsApp for quick delivery.",
  "Looking to stock our products? Get in touch!",
  "Available in multiple pack sizes to suit your needs."
]

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
  }

  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(nextSlide, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused])

  return (
    <div 
      className="w-full bg-gradient-to-r from-[#6B1A1A] via-[#8B2525] to-[#6B1A1A] text-white py-2.5 px-4 border-b border-[#C9A84C]/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="text-xs sm:text-sm font-medium tracking-wide text-center"
            >
              {announcements[currentIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? <Play size={14} /> : <Pause size={14} />}
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextSlide}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
