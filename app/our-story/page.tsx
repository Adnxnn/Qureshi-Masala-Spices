import Image from 'next/image'
import Link from 'next/link'
import { Heart, Leaf, Shield, Sparkles } from 'lucide-react'
import styles from '@/components/site/Editorial.module.css'

const values = [
  { icon: Sparkles, title: 'Authenticity', text: 'Traditional recipes, shared across generations.' },
  { icon: Leaf, title: 'Ingredients', text: 'Carefully chosen spices, full of character and aroma.' },
  { icon: Heart, title: 'Care', text: 'A passion for the meals that bring people together.' },
  { icon: Shield, title: 'Craft', text: 'Thoughtful sourcing, preparation and blending.' },
]
const steps = [
  ['Sourcing', 'We work with farmers and suppliers to select the spices that go into our blends.'],
  ['Cleaning', 'The spices are cleaned, sorted and inspected before blending.'],
  ['Blending', 'Traditional recipes guide the balance of flavour in each masala.'],
  ['Packaging', 'Our blends are packed to protect their freshness and aroma on the way to your kitchen.'],
]
export default function OurStoryPage() {
  return <div className={styles.page}><div className={styles.container}>
    <header className={styles.hero}>
      <div><p className={styles.eyebrow}>Our story</p><h1>More than masala.<br /><em>A tradition shared.</em></h1><p>Familiar aromas. Recipes passed around the family. The joy of sitting down to a meal together. This is where our story begins.</p><div className={styles.actions}><Link href="/shop" className="royal-button">Explore our spices</Link><Link href="/our-heritage" className="royal-button-secondary">Our heritage</Link></div></div>
      <div className={styles.image}><Image src="/images/Ourheritage1.jpg" alt="Spices and ingredients from Qureshi's kitchen" fill priority sizes="(max-width: 767px) 100vw, 50vw" /></div>
    </header>
    <section className={`${styles.section} ${styles.split}`}>
      <div className={styles.copy}><p className={styles.eyebrow}>Who we are</p><h2>The story behind every blend.</h2><p>At Qureshi&apos;s Masala &amp; Spices, every blend celebrates tradition, family and the rich culinary heritage passed down through generations.</p><p>Our journey began with a simple belief: great food deserves great spices. Inspired by traditional Indian kitchens, we create masalas that bring the taste of home to everyday meals.</p></div>
      <video className={styles.video} src="/images/Qureshi_s_Masala_Spices_Ou.mp4" controls playsInline preload="none" aria-label="The Qureshi's Masala and Spices story" />
    </section>
    <section className={styles.section}><p className={styles.eyebrow}>What matters to us</p><h2>Good food starts with care.</h2><div className={styles.cards}>{values.map(({ icon: Icon, title, text }) => <article key={title} className={styles.card}><Icon size={26} aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className={styles.section}><p className={styles.eyebrow}>Our process</p><h2>From ingredients to your kitchen.</h2><ol className={styles.steps}>{steps.map(([title, text], index) => <li key={title} className={styles.step}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
    <section className={styles.cta}><h2>Make our story part of your table.</h2><p>Find a familiar favourite or try a new blend.</p><div className={styles.actions}><Link href="/shop" className="royal-button">Shop the collection</Link><Link href="/recipes" className="royal-button-secondary">Find a recipe</Link></div></section>
  </div></div>
}
