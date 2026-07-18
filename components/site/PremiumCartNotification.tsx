'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { useCartNotifications } from '@/lib/cart-notifications'

// Play soft sound
function playCartSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08)
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  } catch (e) {
    // Fallback if browser blocks audio
  }
}

const PremiumCartNotification = () => {
  const { notifications, removeNotification } = useCartNotifications()
  const hasPlayedRef = useRef<Record<string, boolean>>({})

  useEffect(() => {
    notifications.forEach((n) => {
      if (!hasPlayedRef.current[n.id]) {
        playCartSound()
        hasPlayedRef.current[n.id] = true
      }
    })
  }, [notifications])

  return (
    <div className="fixed z-50 pointer-events-none bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:-translate-x-0 flex flex-col items-center sm:items-end gap-3 w-[90%] sm:w-auto">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            onRemove={() => removeNotification(notification.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

const NotificationCard = ({
  notification,
  onRemove,
}: {
  notification: { id: string; productName: string; productImage?: string }
  onRemove: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35, duration: 0.4 }}
      className="pointer-events-auto w-full sm:w-[380px] bg-black/70 backdrop-blur-2xl border border-gold/25 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-4 relative overflow-hidden"
    >
      {/* Subtle gold dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <GoldDust />
      </div>

      <div className="flex items-center gap-4 relative z-10">
        {/* Product Image */}
        <div className="flex-shrink-0">
          {notification.productImage ? (
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
              <Image
                src={notification.productImage}
                alt={notification.productName}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-gold/30 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
              <CheckCircle2 className="text-gold" size={20} />
            </div>
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm sm:text-base truncate">
            {notification.productName}
          </h4>
          <p className="text-gold/90 text-xs sm:text-sm mt-1 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="flex-shrink-0" />
            Added to cart
          </p>
        </div>

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
        >
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/40 flex items-center justify-center">
            <CheckCircle2 className="text-gold" size={20} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

const GoldDust = () => {
  const particles = Array.from({ length: 8 }, (_, i) => i)

  return (
    <div className="absolute inset-0">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-gold/60"
          initial={{
            x: `${Math.random() * 100}%`,
            y: '100%',
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: ['100%', '-10%'],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

export default PremiumCartNotification
