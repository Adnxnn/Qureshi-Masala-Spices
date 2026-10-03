'use client'

import { useEffect, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useCartNotifications } from '@/lib/cart-notifications'
import { calculateOrderTotal, MINIMUM_ORDER_AMOUNT } from '@/lib/utils'
import styles from './MinimumOrderUnlock.module.css'

function orderTotal() {
  const { items, appliedPromoCode } = useCart.getState()
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  return calculateOrderTotal(subtotal, appliedPromoCode).total
}

export default function MinimumOrderUnlock() {
  const { notifications } = useCartNotifications()
  const [visible, setVisible] = useState(false)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    let previous = orderTotal()
    const unsubscribe = useCart.subscribe(() => {
      const current = orderTotal()
      // Hydration restores an old bag, not a new unlock. Celebrate only a real change.
      if (useCart.persist.hasHydrated() && previous < MINIMUM_ORDER_AMOUNT && current >= MINIMUM_ORDER_AMOUNT) {
        setPending(true)
      }
      previous = current
    })
    const unsubscribeHydration = useCart.persist.onFinishHydration(() => { previous = orderTotal() })
    return () => { unsubscribe(); unsubscribeHydration() }
  }, [])

  // The product confirmation stays up for 3.8 seconds. Wait until it has
  // actually left the notification queue, then allow its exit animation to end.
  useEffect(() => {
    if (!pending || notifications.length > 0) return
    const timer = setTimeout(() => {
      setVisible(true)
      setPending(false)
    }, 450)
    return () => clearTimeout(timer)
  }, [pending, notifications.length])

  // If another product is added during the celebration, give that message
  // priority and replay the unlock afterwards.
  useEffect(() => {
    if (visible && notifications.length > 0) {
      setVisible(false)
      setPending(true)
    }
  }, [visible, notifications.length])

  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(() => setVisible(false), 2400)
    return () => clearTimeout(timer)
  }, [visible])

  if (!visible) return null
  return <div className={styles.stage} role="status" aria-live="polite">
    <div className={styles.card}>
      <div className={styles.halo} aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <span className={styles.seal}><Check size={36} strokeWidth={2.6} /></span>
      <span className={styles.eyebrow}><Sparkles size={15} /> A LITTLE MILESTONE</span>
      <strong>Order unlocked.</strong>
      <p>You’ve reached the ₹{MINIMUM_ORDER_AMOUNT} minimum. Your bag is ready when you are.</p>
    </div>
  </div>
}
