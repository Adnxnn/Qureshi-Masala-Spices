import Image from 'next/image'
import Link from 'next/link'
import styles from '@/components/site/Editorial.module.css'

const TIMELINE_ITEMS = [
  {
    year: '1998',
    title: 'The Beginning',
    description: 'Our journey started in a small kitchen in Bangalore, where we perfected our first masala blend using traditional recipes passed down through generations.'
  },
  {
    year: '2005',
    title: 'First Shop',
    description: 'We opened our first retail store, introducing our authentic blends to the local community.'
  },
  {
    year: '2012',
    title: 'Expanding Reach',
    description: 'Started shipping across India, bringing our flavors to kitchens nationwide.'
  },
  {
    year: '2020',
    title: 'Digital Presence',
    description: 'Launched our online store, making it easier for customers to get our products delivered to their doorstep.'
  },
  {
    year: '2026',
    title: 'Today',
    description: 'Continuing our legacy of delivering pure, authentic spices, while preserving the traditional methods that make us special.'
  }
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
    <section id="journey" className={styles.section}><p className={styles.eyebrow}>Through the years</p><h2>Our journey, one chapter at a time.</h2><ol className={styles.timeline}>{TIMELINE_ITEMS.map(item => <li key={item.year} className={styles.event}><time dateTime={item.year}>{item.year}</time><h3>{item.title}</h3><p>{item.description}</p></li>)}</ol></section>
    <section className={`${styles.section} ${styles.copy}`}><p className={styles.eyebrow}>Looking ahead</p><h2>The next chapter is at your table.</h2><p>From aromatic biryani to a warming bowl of curry, we believe food is a memory, a celebration and a connection between generations.</p></section>
    <section className={styles.cta}><h2>Bring a little tradition home.</h2><p>Explore the blends and find inspiration for your next meal.</p><div className={styles.actions}><Link href="/shop" className="royal-button">Explore the spices</Link><Link href="/recipes" className="royal-button-secondary">Explore recipes</Link></div></section>
  </div></div>
}
