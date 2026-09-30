'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react'
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
  packSize: number
}

export default function SpiceToSupper({ pairs }: { pairs: SupperPair[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  if (!pairs.length) return null
  const pair = pairs[activeIndex]

  return <section className={styles.section} aria-labelledby="spice-to-supper-title">
    <div className={styles.container}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>THE SPICE-TO-SUPPER EDIT</p><h2 id="spice-to-supper-title">One good blend.<br /><em>A whole new meal.</em></h2></div>
        <p>See where a Qureshi&apos;s pack can take you. Choose a dish, meet its masala, then make it your own.</p>
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
          <div className={styles.dishSide}>
            <span className={styles.sceneLabel}>02 / YOUR TABLE</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={pair.recipeId} className={styles.dishImage} initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .45 }}><Image src={pair.recipeImage} alt={pair.recipeName} fill sizes="(max-width: 700px) 55vw, 33vw" /></motion.div>
            </AnimatePresence>
            <span className={styles.dishName}>{pair.recipeName}</span>
          </div>
        </div>
        <div className={styles.panel}>
          <p className={styles.panelEyebrow}>MAKE IT TONIGHT</p>
          <div className={styles.choices} role="group" aria-label="Choose a dish">
            {pairs.map((item, index) => <button key={item.recipeId} type="button" aria-pressed={activeIndex === index} onClick={() => setActiveIndex(index)}><span>0{index + 1}</span>{item.recipeName}</button>)}
          </div>
          <div className={styles.selected} aria-live="polite">
            <p>Start with <strong>{pair.productName}</strong> · {pair.packSize >= 1000 ? `${pair.packSize / 1000} kg` : `${pair.packSize} g`} pack</p>
            {pair.recipeTime && <span><Clock3 size={15} /> {pair.recipeTime} min</span>}
          </div>
          <div className={styles.links}><Link href={`/recipes/${pair.recipeSlug}`}>Cook this recipe <ArrowUpRight size={18} /></Link><Link href={`/product/${pair.productSlug}`}>Explore the masala <ArrowUpRight size={17} /></Link></div>
        </div>
      </div>
    </div>
  </section>
}
