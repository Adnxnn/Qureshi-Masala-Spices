import Link from 'next/link'
import { ArrowDown, ArrowRight, BookOpen, Heart, Leaf, Sparkles } from 'lucide-react'
import HeritageFilm from '@/components/site/HeritageFilm'
import styles from './Heritage.module.css'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Heritage', description: "Explore the recipes, ingredients and craft that inspire Qureshi's Masala & Spices.", alternates: { canonical: '/our-heritage' } }

const chapters = [
  { number: '01', label: 'THE BEGINNING', title: 'A recipe becomes a memory.', text: 'The aromas we grow up with stay with us. Family cooking and familiar flavours inspire the blends we make today.', symbol: '✳' },
  { number: '02', label: 'THE INGREDIENTS', title: 'Character in every spice.', text: 'Warmth, fragrance and depth begin with the ingredients. Each one has a part to play in the food we share.', symbol: '✦' },
  { number: '03', label: 'THE CRAFT', title: 'Balance is everything.', text: 'Careful preparation and blending bring different flavours together, guided by recipes worth passing on.', symbol: '❋' },
  { number: '04', label: 'THE NEXT CHAPTER', title: 'Now, it is yours.', text: 'In your kitchen, these flavours take on a life of their own: weekday dinners, celebrations and meals with people you love.', symbol: '✳' },
]

export default function OurHeritagePage() {
  return <div className={styles.page}>
    <header className={styles.filmHero}>
      <HeritageFilm />
      <div className={styles.heroContent}>
        <p className={styles.eyebrow}>QURESHI’S / OUR HERITAGE</p>
        <h1>Flavour is a way<br />of <em>remembering.</em></h1>
        <p>Some recipes live beyond the page. They travel through families, kitchens and the meals we gather around.</p>
        <div className={styles.heroActions}><a href="#chapters">Explore the heritage <ArrowDown size={17} /></a><Link href="/shop">Discover the blends <ArrowRight size={17} /></Link></div>
      </div>
      <span className={styles.heroSide} aria-hidden="true">PURE FLAVOUR / ENDLESS TASTE</span>
    </header>
    <main>
      <section className={styles.intro} aria-labelledby="intro-title">
        <div className={styles.introLabel}><span>01 — THE THREAD</span><Leaf size={27} strokeWidth={1.4} /></div>
        <div><h2 id="intro-title">More than a blend.<br /><em>A connection.</em></h2><p>At Qureshi’s, heritage is something you make, serve and share. We take inspiration from traditional Indian kitchens and the joy of food that brings everyone to the table.</p></div>
      </section>
      <section id="chapters" className={styles.chapters} aria-labelledby="chapters-title">
        <div className={styles.chapterLead}><p className={styles.eyebrow}>THE FLAVOURS WE CARRY</p><h2 id="chapters-title">A living tradition,<br /><em>one meal at a time.</em></h2><p>Our story continues with every cook who makes a recipe their own.</p></div>
        <ol className={styles.chapterList}>{chapters.map(chapter => <li key={chapter.number} className={styles.chapter}><div className={styles.chapterNumber}>{chapter.number}<span aria-hidden="true">{chapter.symbol}</span></div><div className={styles.chapterText}><p>{chapter.label}</p><h3>{chapter.title}</h3><span>{chapter.text}</span></div></li>)}</ol>
      </section>
      <section className={styles.table} aria-labelledby="table-title">
        <div className={styles.tableGraphic} aria-hidden="true"><span className={styles.plateOuter} /><span className={styles.plateInner} /><span className={styles.plateCentre}>Q</span><span className={styles.plateStar}>✦</span></div>
        <div className={styles.tableCopy}><p className={styles.eyebrow}>FROM OUR TABLE TO YOURS</p><h2 id="table-title">The best part is<br /><em>what you make of it.</em></h2><p>From aromatic biryani to a comforting curry, the food you cook becomes part of your own story.</p><div className={styles.tableLinks}><Link href="/recipes"><BookOpen size={18} /> Find a recipe <ArrowRight size={17} /></Link><Link href="/our-story"><Heart size={18} /> Meet Qureshi’s <ArrowRight size={17} /></Link></div></div>
      </section>
      <section className={styles.closing}><Sparkles size={25} strokeWidth={1.3} /><p>THE NEXT CHAPTER STARTS IN YOUR KITCHEN</p><h2>Make tradition <em>your own.</em></h2><Link href="/shop">Explore our spices <ArrowRight size={19} /></Link></section>
    </main>
  </div>
}
