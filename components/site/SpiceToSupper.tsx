'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import styles from './SpiceToSupper.module.css'

export type SupperPair = {
  recipeId: string
  recipeName: string
  recipeSlug: string
  recipeImage: string
  recipeTime: number | null
  productName: string
  productSlug: string
  productImage: string
  packSize: number | null
}

export default function SpiceToSupper({ pairs }: { pairs: SupperPair[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)
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
    if (pairs.length < 2 || !inView || reducedMotion) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex(index => (index + 1) % pairs.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [activeIndex, pairs.length, inView, reducedMotion])
  if (!pairs.length) return null
  const pair = pairs[activeIndex]

  return <section ref={sectionRef} className={styles.section} aria-labelledby="spice-to-supper-title">
    <div className={styles.container}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>THE SPICE-TO-SUPPER EDIT</p><h2 id="spice-to-supper-title">One good blend.<br /><em>A whole new meal.</em></h2></div>
        <p>See the QMS blends behind our recipes, one delicious idea after another.</p>
      </div>
      <div className={styles.stage}>
        <div className={styles.scene}>
          {pairs.length > 1 && <span className={styles.preloadImages} aria-hidden="true"><Image src={pairs[(activeIndex + 1) % pairs.length].productImage} alt="" fill sizes="(max-width: 700px) 45vw, 22vw" loading="eager" /><Image src={pairs[(activeIndex + 1) % pairs.length].recipeImage} alt="" fill sizes="(max-width: 700px) 55vw, 33vw" loading="eager" /></span>}
          <div className={styles.spiceSide}>
            <span className={styles.sceneLabel}>01 / THE BLEND</span>
            <span className={styles.orbit} aria-hidden="true" />
            <AnimatePresence mode="sync" initial={false}>
              <motion.div key={pair.productSlug} className={styles.pack} initial={{ opacity: 0, y: reducedMotion ? 0 : 12, rotate: reducedMotion ? 0 : -8 }} animate={{ opacity: 1, y: 0, rotate: -5 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}><Image src={pair.productImage} alt={`${pair.productName} pack`} fill sizes="(max-width: 700px) 45vw, 22vw" /></motion.div>
            </AnimatePresence>
            <span className={styles.packName}>{pair.productName}</span>
          </div>
          <div className={styles.dishSide}>
            <span className={styles.sceneLabel}>02 / YOUR TABLE</span>
            <AnimatePresence mode="sync" initial={false}>
              <motion.div key={pair.recipeId} className={styles.dishImage} initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.03 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .25 }}><Image src={pair.recipeImage} alt={pair.recipeName} fill sizes="(max-width: 700px) 55vw, 33vw" /></motion.div>
            </AnimatePresence>
            <span className={styles.dishName}>{pair.recipeName}</span>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelEyebrow}>MAKE IT TONIGHT</p>
          <div className={styles.panelBody}>
            <span className={styles.slideNumber}>{String(activeIndex + 1).padStart(2, '0')} <span>/ {String(pairs.length).padStart(2, '0')}</span></span>
            <h3>{pair.recipeName}</h3>
            <p>{`Start with ${pair.productName}${pair.packSize ? ` · ${pair.packSize >= 1000 ? `${pair.packSize / 1000} kg` : `${pair.packSize} g`} pack` : ''}`}</p>
            {pair.recipeTime && <span className={styles.time}><Clock3 size={15} /> {pair.recipeTime} min</span>}
          </div>
          <div className={styles.links}><Link href={`/recipes/${pair.recipeSlug}`}>Cook this recipe <ArrowUpRight size={18} /></Link><Link href={`/product/${pair.productSlug}`}>Explore the masala <ArrowUpRight size={17} /></Link></div>
        </div>
      </div>
    </div>
  </section>
}
