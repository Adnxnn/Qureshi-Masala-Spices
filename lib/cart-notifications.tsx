'use client'
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type CartNotification = {
  id: string
  productName: string
  productImage?: string
}

type CartNotificationsContextType = {
  notifications: CartNotification[]
  addNotification: (productName: string, productImage?: string) => void
  removeNotification: (id: string) => void
}

const CartNotificationsContext = createContext<CartNotificationsContextType | undefined>(undefined)

export function CartNotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<CartNotification[]>([])

  const addNotification = useCallback((productName: string, productImage?: string) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, productName, productImage }])
    
    setTimeout(() => {
      removeNotification(id)
    }, 2800) // Auto dismiss after ~2.8s
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <CartNotificationsContext.Provider value={{ notifications, addNotification, removeNotification }}>
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
