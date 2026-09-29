'use client'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, ArrowRight, Volume2, VolumeX, X } from 'lucide-react'
import { useCartNotifications } from '@/lib/cart-notifications'
import styles from './CartAdded.module.css'

export default function PremiumCartNotification() {
  const { notifications, soundEnabled, toggleSound, removeNotification } = useCartNotifications()
  const reducedMotion = useReducedMotion()
  return <div className={styles.region} aria-live="polite" aria-relevant="additions">
    <AnimatePresence mode="wait" initial={false}>
      {notifications.slice(-1).map(notification => <motion.div key={notification.id} className={styles.toast}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, scale: .82, rotateX: -24 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: .95 }}
        transition={{ type: 'spring', stiffness: 360, damping: 27, duration: reducedMotion ? .1 : undefined }}>
        <div className={styles.glow} aria-hidden="true" />
        <div className={styles.top}><span className={styles.overline}>A LITTLE MORE FLAVOUR</span><button type="button" className={styles.close} aria-label="Dismiss added to cart message" onClick={() => removeNotification(notification.id)}><X size={18} /></button></div>
        <div className={styles.content}>
          <div className={styles.confirm} aria-hidden="true"><motion.div className={styles.seal} initial={reducedMotion ? false : { scale: .3, rotateY: 90 }} animate={{ scale: 1, rotateY: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 17, delay: .08 }}><Check size={27} strokeWidth={3} /></motion.div></div>
          <div className={styles.words}><strong>Added to your bag</strong><p>{notification.productName}</p><span className={styles.details}><span>{notification.weightGrams >= 1000 ? `${notification.weightGrams / 1000} kg` : `${notification.weightGrams} g`} pack</span><span aria-hidden="true">·</span><span>Qty {notification.quantity}</span></span></div>
          {notification.productImage && <Image className={styles.product} src={notification.productImage} alt="" width={55} height={70} />}
        </div>
        <div className={styles.foot}><Link href="/order" onClick={() => removeNotification(notification.id)}>View your bag <ArrowRight size={16} /></Link><button type="button" className={styles.sound} onClick={toggleSound} aria-label={soundEnabled ? 'Mute add-to-cart sound' : 'Turn on add-to-cart sound'} title={soundEnabled ? 'Mute sound' : 'Turn on sound'}>{soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}</button></div>
      </motion.div>)}
    </AnimatePresence>
  </div>
}
