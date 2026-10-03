'use client'

import { useEffect, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { calculateOrderTotal, MINIMUM_ORDER_AMOUNT } from '@/lib/utils'
import styles from './MinimumOrderUnlock.module.css'

function orderTotal() {
  const { items, appliedPromoCode } = useCart.getState()
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  return calculateOrderTotal(subtotal, appliedPromoCode).total
}

export default function MinimumOrderUnlock() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let previous = orderTotal()
    let timeout: ReturnType<typeof setTimeout> | undefined
    const unsubscribe = useCart.subscribe(() => {
      const current = orderTotal()
      // Hydration restores an old bag, not a new unlock. Celebrate only a real change.
      if (useCart.persist.hasHydrated() && previous < MINIMUM_ORDER_AMOUNT && current >= MINIMUM_ORDER_AMOUNT) {
        setVisible(true)
        clearTimeout(timeout)
        timeout = setTimeout(() => setVisible(false), 2400)
      }
      previous = current
    })
    const unsubscribeHydration = useCart.persist.onFinishHydration(() => { previous = orderTotal() })
    return () => { unsubscribe(); unsubscribeHydration(); clearTimeout(timeout) }
  }, [])

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
