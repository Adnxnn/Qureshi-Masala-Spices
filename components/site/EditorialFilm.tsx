'use client'
import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import styles from './Editorial.module.css'

export default function EditorialFilm({ src, label }: { src: string; label: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(true)
  const [blocked, setBlocked] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = video.current
    if (!element) return
    element.defaultMuted = true
    element.muted = true
    function start() {
      if (document.hidden || userPaused.current || !element) return
      element.play().then(() => setBlocked(false)).catch(() => { setBlocked(true); setPlaying(false) })
    }
    function visibility() { if (document.hidden) element?.pause(); else start() }
    start()
    element.addEventListener('canplay', start)
    document.addEventListener('visibilitychange', visibility)
    // Some mobile browsers require a first interaction even for muted playback.
    document.addEventListener('touchstart', start, { passive: true })
    return () => {
      element.removeEventListener('canplay', start)
      document.removeEventListener('visibilitychange', visibility)
      document.removeEventListener('touchstart', start)
      element.pause()
    }
  }, [src])
  function toggle() {
    const element = video.current
    if (!element) return
    if (!element.paused) { userPaused.current = true; element.pause() }
    else { userPaused.current = false; element.play().then(() => setBlocked(false)).catch(() => setBlocked(true)) }
  }
  return <div className={styles.filmLayer}><div className={styles.filmViewport}>
    <video ref={video} className={styles.backgroundFilm} src={src} autoPlay muted loop playsInline preload="auto" disablePictureInPicture aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    <div className={styles.filmShade} />
    <div className={styles.filmControls}>
      {failed ? <span role="status">Film unavailable. You can still explore the story below.</span> : <><button type="button" onClick={toggle} aria-label={playing ? 'Pause background film' : 'Play background film'}>{playing ? <Pause size={15} /> : <Play size={15} />}<span>{playing ? 'Pause film' : 'Play film'}</span></button>{blocked && <span role="status">Your browser paused autoplay.</span>}</>}
    </div>
  </div></div>
}
