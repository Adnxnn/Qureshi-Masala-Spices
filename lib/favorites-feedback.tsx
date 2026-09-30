'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Heart, HeartCrack, Volume2, VolumeX } from 'lucide-react'
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
  const [soundEnabled, setSoundEnabled] = useState(true)
  const timeout = useRef<number | null>(null)
  const nextId = useRef(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    setSoundEnabled(window.localStorage.getItem('qms-favorites-sound') !== 'off')
    return () => { if (timeout.current) window.clearTimeout(timeout.current) }
  }, [])

  const showFeedback = useCallback((productName: string, added: boolean) => {
    if (timeout.current) window.clearTimeout(timeout.current)
    setFeedback({ id: ++nextId.current, productName, added })
    if (window.localStorage.getItem('qms-favorites-sound') !== 'off') playHeartSound(added)
    timeout.current = window.setTimeout(() => setFeedback(null), 2100)
  }, [])

  const toggleSound = () => setSoundEnabled(current => {
    window.localStorage.setItem('qms-favorites-sound', current ? 'off' : 'on')
    return !current
  })

  return <Context.Provider value={{ showFeedback }}>
    {children}
    <AnimatePresence mode="wait" initial={false}>
      {feedback && <motion.div key={feedback.id} className={styles.region}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? .1 : .2 }}>
        <div className={styles.scrim} aria-hidden="true" />
        <motion.div className={`${styles.card} ${feedback.added ? styles.added : styles.removed}`} role="status" aria-live="polite"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .64, y: 25, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .88, y: -12 }}
          transition={reducedMotion ? { duration: .1 } : { type: 'spring', stiffness: 330, damping: 22 }}>
          <div className={styles.halo} aria-hidden="true" />
          <div className={styles.icon} aria-hidden="true">
            {feedback.added ? <Heart size={57} fill="currentColor" strokeWidth={1.4} /> : <HeartCrack size={61} fill="currentColor" strokeWidth={1.7} />}
          </div>
          <strong>{feedback.added ? 'Saved with love' : 'Removed from favorites'}</strong>
          <p>{feedback.productName}</p>
          <button type="button" className={styles.sound} onClick={toggleSound} aria-label={soundEnabled ? 'Mute favorites sound' : 'Turn on favorites sound'} title={soundEnabled ? 'Mute sound' : 'Turn on sound'}>{soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
          <span className={styles.sparkOne} aria-hidden="true">✦</span><span className={styles.sparkTwo} aria-hidden="true">✦</span><span className={styles.sparkThree} aria-hidden="true">✦</span>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </Context.Provider>
}

export function useFavoritesFeedback() {
  const context = useContext(Context)
  if (!context) throw new Error('useFavoritesFeedback must be used within FavoritesFeedbackProvider')
  return context
}
