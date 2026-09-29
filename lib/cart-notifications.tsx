'use client'
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'

export type CartNotification = {
  id: string
  productName: string
  productImage?: string
}

type CartNotificationsContextType = {
  notifications: CartNotification[]
  soundEnabled: boolean
  toggleSound: () => void
  addNotification: (productName: string, productImage?: string) => void
  removeNotification: (id: string) => void
}

const CartNotificationsContext = createContext<CartNotificationsContextType | undefined>(undefined)

function playCartChime() {
  try {
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) return
    const context = new AudioContextClass()
    void context.resume().catch(() => {})
    const now = context.currentTime
    ;[[880, 0], [1320, .095]].forEach(([frequency, offset]) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(frequency, now + offset)
      gain.gain.setValueAtTime(.0001, now + offset)
      gain.gain.exponentialRampToValueAtTime(.045, now + offset + .012)
      gain.gain.exponentialRampToValueAtTime(.0001, now + offset + .18)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(now + offset)
      oscillator.stop(now + offset + .19)
    })
    window.setTimeout(() => { void context.close().catch(() => {}) }, 500)
  } catch { /* Audio is optional when a browser does not support it. */ }
}

export function CartNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<CartNotification[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    setSoundEnabled(window.localStorage.getItem('qureshis-cart-sound') !== 'off')
  }, [])

  const toggleSound = useCallback(() => {
    setSoundEnabled(current => {
      window.localStorage.setItem('qureshis-cart-sound', current ? 'off' : 'on')
      return !current
    })
  }, [])

  const addNotification = useCallback((productName: string, productImage?: string) => {
    const id = crypto.randomUUID()
    setNotifications((prev) => [...prev, { id, productName, productImage }])
    if (soundEnabled) playCartChime()
    
    setTimeout(() => {
      removeNotification(id)
    }, 2800) // Auto dismiss after ~2.8s
  }, [soundEnabled])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <CartNotificationsContext.Provider value={{ notifications, soundEnabled, toggleSound, addNotification, removeNotification }}>
      {children}
    </CartNotificationsContext.Provider>
  )
}

export function useCartNotifications() {
  const context = useContext(CartNotificationsContext)
  if (!context) {
    throw new Error('useCartNotifications must be used within a CartNotificationsProvider')
  }
  return context
}
