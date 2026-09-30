'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './Storefront.module.css'

export default function HomeStoryFilm() {
  const video = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(true)
  useEffect(() => {
    const element = video.current
    if (!element) return
    element.defaultMuted = true
    element.muted = true
    const start = () => { if (!document.hidden && !userPaused.current) void element.play().catch(() => setPlaying(false)) }
    const visibility = () => document.hidden ? element.pause() : start()
    start()
    element.addEventListener('canplay', start)
    document.addEventListener('visibilitychange', visibility)
    document.addEventListener('touchstart', start, { passive: true })
    return () => {
      element.removeEventListener('canplay', start)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('touchstart', start)
      element.pause()
    }
  }, [])
  const toggle = () => {
    const element = video.current
    if (!element) return
    if (element.paused) { userPaused.current = false; void element.play().catch(() => setPlaying(false)) }
    else { userPaused.current = true; element.pause() }
  }
  return <><video ref={video} src="/images/Qureshi_s_Masala_Spices_Ou.mp4" autoPlay muted loop playsInline preload="metadata" aria-label="A glimpse of QMS story" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} /><button type="button" className={styles.storyFilmControl} onClick={toggle} aria-label={playing ? 'Pause story film' : 'Play story film'}>{playing ? <Pause size={15} /> : <Play size={15} />}</button></>
}
