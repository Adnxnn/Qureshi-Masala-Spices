'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import styles from './Storefront.module.css'
import carousel from './HeroProductCarousel.module.css'

type Slide = { id: string; name: string; image: string; href: string }
const fallback: Slide = { id: 'biryani', name: 'Biryani Masala', image: '/images/Biryani Masala.png', href: '/shop?q=biryani' }

export default function HeroProductCarousel({ products }: { products: Slide[] }) {
  const slides = products.length ? products : [fallback]
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(true)
  const reducedMotion = useReducedMotion()
  const activeIndex = index % slides.length
  const active = slides[activeIndex]
  const playing = !paused && !hovered && !focused && visible && reducedMotion === false && slides.length > 1

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex(current => (current + 1) % slides.length), 1500)
    return () => window.clearTimeout(timer)
  }, [playing, index, slides.length])

  function move(direction: number) {
    setPaused(true)
    setIndex(current => (current + direction + slides.length) % slides.length)
  }

  return <div
    className={`${styles.heroArt} ${carousel.art}`}
    role="region"
    aria-roledescription="carousel"
    aria-label="Explore our masalas"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}
  >
    <div className={styles.heroHalo} />
    <span className={styles.heroVertical}>PURE FLAVOUR / ENDLESS TASTE</span>
    <div className={`${styles.heroPack} ${carousel.pack}`}>
      <AnimatePresence initial={false}>
        <motion.div key={active.id} className={carousel.slide}
          initial={{ opacity: 0, x: reducedMotion ? 0 : 90 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reducedMotion ? 0 : -90 }}
          transition={{ duration: reducedMotion ? 0 : 0.45, ease: 'easeInOut' }}
        >
          <Image src={active.image} alt={`Qureshi's ${active.name} pack`} fill priority={activeIndex === 0} sizes="(max-width: 767px) 70vw, 38vw" />
        </motion.div>
      </AnimatePresence>
      {slides.length > 1 && <div className={carousel.preload} aria-hidden="true"><Image src={slides[(activeIndex + 1) % slides.length].image} alt="" fill sizes="(max-width: 767px) 70vw, 38vw" loading="eager" /></div>}
    </div>
    <span className={`${styles.heroStamp} ${carousel.stamp}`}>The art of<br /><em>everyday</em><br />flavour.</span>
    <div className={`${styles.heroCaption} ${carousel.caption}`}>
      <div className={carousel.name} aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <strong>{active.name}</strong>
      </div>
      <div className={carousel.controls}>
        {slides.length > 1 && <>
          <button type="button" onClick={() => move(-1)} aria-label="Previous masala"><ChevronLeft size={18} /></button>
          {!reducedMotion && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Start automatic slideshow' : 'Pause automatic slideshow'}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>}
          <button type="button" onClick={() => move(1)} aria-label="Next masala"><ChevronRight size={18} /></button>
        </>}
        <Link href={active.href} aria-label={`Explore ${active.name}`}><ArrowUpRight size={22} /></Link>
      </div>
    </div>
  </div>
}

