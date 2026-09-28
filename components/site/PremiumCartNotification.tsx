'use client'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, X } from 'lucide-react'
import { useCartNotifications } from '@/lib/cart-notifications'

export default function PremiumCartNotification() {
  const { notifications, removeNotification } = useCartNotifications()
  const reducedMotion = useReducedMotion()
  return <div className="cart-alerts" aria-live="polite" aria-relevant="additions">
    <AnimatePresence initial={false}>{notifications.slice(-2).map(notification => <motion.div key={notification.id} className="cart-alert" initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
      {notification.productImage ? <Image src={notification.productImage} alt="" width={44} height={56} /> : <CheckCircle2 size={28} aria-hidden="true" />}
      <div><strong>{notification.productName}</strong><p>Added to your cart</p><Link href="/order" onClick={() => removeNotification(notification.id)}>View cart →</Link></div>
      <button type="button" aria-label="Dismiss cart notification" onClick={() => removeNotification(notification.id)}><X size={20} /></button>
    </motion.div>)}</AnimatePresence>
  </div>
}
