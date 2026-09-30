'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Clock3, Pause, Play, Utensils } from 'lucide-react'
import styles from './SpiceToSupper.module.css'

export type SupperPair = {
  recipeId?: string
  recipeName?: string
  recipeSlug?: string
  recipeImage: string | null
  recipeTime: number | null
  productName: string
  productSlug: string
  productImage: string
  productDescription: string
  packSize: number | null
}

export default function SpiceToSupper({ pairs }: { pairs: SupperPair[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (pairs.length < 2 || paused || hovered || !inView || reducedMotion) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex(index => (index + 1) % pairs.length)
    }, 3500)
    return () => window.clearInterval(timer)
  }, [activeIndex, pairs.length, paused, hovered, inView, reducedMotion])
  if (!pairs.length) return null
  const pair = pairs[activeIndex]
  const recipeAvailable = Boolean(pair.recipeSlug && pair.recipeImage)
  const move = (direction: number) => setActiveIndex(index => (index + direction + pairs.length) % pairs.length)

  return <section ref={sectionRef} className={styles.section} aria-labelledby="spice-to-supper-title" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false) }}>
    <div className={styles.container}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>THE SPICE-TO-SUPPER EDIT</p><h2 id="spice-to-supper-title">One good blend.<br /><em>A whole new meal.</em></h2></div>
        <p>Meet every masala in the QMS collection. Find a dish to make tonight, or explore the blend that inspires it.</p>
      </div>
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.spiceSide}>
            <span className={styles.sceneLabel}>01 / THE BLEND</span>
            <span className={styles.orbit} aria-hidden="true" />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={pair.productSlug} className={styles.pack} initial={{ opacity: 0, y: reducedMotion ? 0 : 22, rotate: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0, rotate: -5 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -15 }} transition={{ duration: reducedMotion ? 0 : .4 }}><Image src={pair.productImage} alt={`${pair.productName} pack`} fill sizes="(max-width: 700px) 45vw, 22vw" /></motion.div>
            </AnimatePresence>
            <span className={styles.packName}>{pair.productName}</span>
          </div>
          <span className={styles.transitionMark} aria-hidden="true"><ArrowRight size={21} strokeWidth={1.6} /></span>
          <div className={`${styles.dishSide} ${recipeAvailable ? '' : styles.blendSide}`}>
            <span className={styles.sceneLabel}>02 / {recipeAvailable ? 'YOUR TABLE' : 'THE IDEA'}</span>
            <AnimatePresence mode="wait" initial={false}>
              {recipeAvailable ? <motion.div key={pair.recipeId} className={styles.dishImage} initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .45 }}><Image src={pair.recipeImage!} alt={pair.recipeName || ''} fill sizes="(max-width: 700px) 55vw, 33vw" /></motion.div> : <motion.div key={pair.productSlug} className={styles.blendGraphic} initial={{ opacity: 0, scale: reducedMotion ? 1 : .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .4 }} aria-hidden="true"><span className={styles.graphicRing} /><Utensils size={60} strokeWidth={.7} /></motion.div>}
            </AnimatePresence>
            <span className={styles.dishName}>{recipeAvailable ? pair.recipeName : 'Make it your own.'}</span>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelEyebrow}>{recipeAvailable ? 'MAKE IT TONIGHT' : 'MEET THE MASALA'}</p>
          <div className={styles.panelBody}>
            <span className={styles.slideNumber}>{String(activeIndex + 1).padStart(2, '0')} <span>/ {String(pairs.length).padStart(2, '0')}</span></span>
            <h3>{recipeAvailable ? pair.recipeName : pair.productName}</h3>
            <p>{recipeAvailable ? `Start with ${pair.productName}${pair.packSize ? ` · ${pair.packSize >= 1000 ? `${pair.packSize / 1000} kg` : `${pair.packSize} g`} pack` : ''}` : pair.productDescription}</p>
            {recipeAvailable && pair.recipeTime && <span className={styles.time}><Clock3 size={15} /> {pair.recipeTime} min</span>}
          </div>
          <div className={styles.carouselControls} aria-label="Masala carousel controls">
            <div className={styles.arrows}>
              <button type="button" onClick={() => move(-1)} aria-label="Previous masala" disabled={pairs.length < 2}><ChevronLeft size={20} /></button>
              <button type="button" onClick={() => move(1)} aria-label="Next masala" disabled={pairs.length < 2}><ChevronRight size={20} /></button>
              {!reducedMotion && pairs.length > 1 && <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play automatic masala carousel' : 'Pause automatic masala carousel'}>{paused ? <Play size={17} /> : <Pause size={17} />}</button>}
            </div>
            <span className={styles.controlNote}>{paused || reducedMotion ? 'Browse at your pace' : 'Automatically exploring the collection'}</span>
          </div>
          {pairs.length > 1 && <div className={styles.dots} role="group" aria-label="Choose a masala">{pairs.map((item, index) => <button key={item.productSlug} type="button" aria-label={`Show ${item.productName}, ${index + 1} of ${pairs.length}`} aria-current={index === activeIndex ? 'true' : undefined} onClick={() => setActiveIndex(index)} />)}</div>}
          <div className={styles.links}>{recipeAvailable && <Link href={`/recipes/${pair.recipeSlug}`}>Cook this recipe <ArrowUpRight size={18} /></Link>}<Link href={`/product/${pair.productSlug}`}>Explore the masala <ArrowUpRight size={17} /></Link></div>
        </div>
      </div>
    </div>
  </section>
}
