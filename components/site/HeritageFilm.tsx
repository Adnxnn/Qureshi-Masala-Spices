'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from '@/app/our-heritage/Heritage.module.css'

export default function HeritageFilm() {
  const video = useRef<HTMLVideoElement>(null)
  const manuallyPaused = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    const element = video.current
    if (!element) return
    element.defaultMuted = true
    element.muted = true
    const start = () => {
      if (document.hidden || manuallyPaused.current) return
      element.play().then(() => setBlocked(false)).catch(() => { setBlocked(true); setPlaying(false) })
    }
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
    if (!element.paused) { manuallyPaused.current = true; element.pause() }
    else { manuallyPaused.current = false; element.play().then(() => setBlocked(false)).catch(() => setBlocked(true)) }
  }

  return <>
    <video ref={video} className={styles.video} src="/images/Background01.MP4" autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-label="Qureshi’s heritage film" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
    <div className={styles.filmShade} aria-hidden="true" />
    <div className={styles.filmControls}>
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause heritage film' : 'Play heritage film'}>{playing ? <Pause size={16} /> : <Play size={16} />}<span>{playing ? 'Pause film' : 'Play film'}</span></button>
      {blocked && <span role="status">Your browser paused autoplay.</span>}
    </div>
  </>
}
