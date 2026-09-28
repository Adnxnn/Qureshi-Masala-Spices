import Image from 'next/image'
import Link from 'next/link'
import styles from '@/components/site/Editorial.module.css'

const CHAPTERS = [
  { title: 'The recipes', description: 'Family cooking and familiar flavours inspire the blends we make.' },
  { title: 'The ingredients', description: 'Spices bring aroma, warmth and character to every meal.' },
  { title: 'The craft', description: 'Careful preparation and blending help each ingredient find its place.' },
  { title: 'Your kitchen', description: 'Make these flavours your own, from everyday dishes to food shared with friends.' },
]
export default function OurHeritagePage() {
  return <div className={styles.page}><div className={styles.container}>
    <header className={styles.hero}>
      <div><p className={styles.eyebrow}>Our heritage</p><h1>A legacy of<br /><em>flavour.</em></h1><p>Rooted in family recipes and the connections we make over food. Explore the story that shapes every Qureshi&apos;s blend.</p><div className={styles.actions}><a href="#journey" className="royal-button">Explore our journey</a><Link href="/shop" className="royal-button-secondary">Discover the blends</Link></div></div>
      <div className={styles.image}><Image src="/images/QMS.jpeg" alt="Qureshi's Masala and Spices heritage" fill priority sizes="(max-width: 767px) 100vw, 50vw" /></div>
    </header>
    <section className={`${styles.section} ${styles.split}`}>
      <div className={styles.image}><Image src="/images/Ourheritage1.jpg" alt="A glimpse into Qureshi's spice-making story" fill sizes="(max-width: 767px) 100vw, 50vw" /></div>
      <div className={styles.copy}><p className={styles.eyebrow}>Where it started</p><h2>Recipes worth passing on.</h2><p>Our journey began with a simple belief: authentic food deserves authentic spices. Traditional recipes and time-honoured blending techniques inspire the taste of home in every pack.</p><p>What started as a passion for preserving culinary traditions has grown into a commitment to bringing those flavours to kitchens everywhere.</p></div>
    </section>
    <section id="journey" className={styles.section}><p className={styles.eyebrow}>The things we carry forward</p><h2>From family recipes to your table.</h2><ol className={styles.timeline}>{CHAPTERS.map((item, index) => <li key={item.title} className={styles.event}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></section>
    <section className={`${styles.section} ${styles.copy}`}><p className={styles.eyebrow}>Looking ahead</p><h2>The next chapter is at your table.</h2><p>From aromatic biryani to a warming bowl of curry, we believe food is a memory, a celebration and a connection between generations.</p></section>
    <section className={styles.cta}><h2>Bring a little tradition home.</h2><p>Explore the blends and find inspiration for your next meal.</p><div className={styles.actions}><Link href="/shop" className="royal-button">Explore the spices</Link><Link href="/recipes" className="royal-button-secondary">Explore recipes</Link></div></section>
  </div></div>
}
