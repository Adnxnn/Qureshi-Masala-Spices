'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Heart, HeartCrack } from 'lucide-react'
import styles from '@/components/site/FavoritesFeedback.module.css'

type Feedback = { id: number; productName: string; added: boolean }
type FeedbackContext = { showFeedback: (productName: string, added: boolean) => void }
const Context = createContext<FeedbackContext | null>(null)

function playHeartSound(added: boolean) {
  try {
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) return
    const audio = new AudioContextClass()
    void audio.resume().catch(() => {})
    const now = audio.currentTime
    const notes = added ? [523, 659, 784] : [659, 494, 392]
    notes.forEach((frequency, index) => {
      const at = now + index * .095
      const oscillator = audio.createOscillator()
      const gain = audio.createGain()
      oscillator.type = added ? 'sine' : 'triangle'
      oscillator.frequency.setValueAtTime(frequency, at)
      gain.gain.setValueAtTime(.0001, at)
      gain.gain.exponentialRampToValueAtTime(added ? .035 : .024, at + .012)
      gain.gain.exponentialRampToValueAtTime(.0001, at + .18)
      oscillator.connect(gain).connect(audio.destination)
      oscillator.start(at)
      oscillator.stop(at + .19)
    })
    window.setTimeout(() => { void audio.close().catch(() => {}) }, 650)
  } catch { /* Sound is optional if the browser blocks audio. */ }
}

export function FavoritesFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const timeout = useRef<number | null>(null)
  const nextId = useRef(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    return () => { if (timeout.current) window.clearTimeout(timeout.current) }
  }, [])

  const showFeedback = useCallback((productName: string, added: boolean) => {
    if (timeout.current) window.clearTimeout(timeout.current)
    setFeedback({ id: ++nextId.current, productName, added })
    playHeartSound(added)
    timeout.current = window.setTimeout(() => setFeedback(null), 1500)
  }, [])

  return <Context.Provider value={{ showFeedback }}>
    {children}
    <AnimatePresence mode="wait" initial={false}>
      {feedback && <motion.div key={feedback.id} className={styles.region}
        role="status" aria-label={`${feedback.productName} ${feedback.added ? 'saved to favorites' : 'removed from favorites'}`}
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .25, rotate: feedback.added ? -12 : 12 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: [0.25, 1.2, 1], rotate: feedback.added ? [-12, 5, 0] : [12, -8, 0] }}
        exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .55, y: 18 }}
        transition={reducedMotion ? { duration: .1 } : { duration: .58, ease: [0.22, 1, 0.36, 1] }}>
        {feedback.added
          ? <Heart className={styles.heart} size={134} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          : <HeartCrack className={styles.cracked} size={134} fill="#ed5371" color="#8c1e3c" strokeWidth={2.8} aria-hidden="true" />}
      </motion.div>}
    </AnimatePresence>
  </Context.Provider>
}

export function useFavoritesFeedback() {
  const context = useContext(Context)
  if (!context) throw new Error('useFavoritesFeedback must be used within FavoritesFeedbackProvider')
  return context
}
