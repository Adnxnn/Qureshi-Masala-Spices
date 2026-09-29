import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, MessageCircle, Package, Utensils } from 'lucide-react'
import { getProducts } from '@/lib/actions'
import HeroProductCarousel from '@/components/site/HeroProductCarousel'
import ProductGrid from '@/components/site/ProductGrid'
import SpiceFinder from '@/components/site/SpiceFinder'
import styles from '@/components/site/Storefront.module.css'

export const dynamic = 'force-dynamic'

const categories = [
  { name: 'Chicken favourites', category: 'chicken', note: 'For grills, curries & gatherings', image: '/images/Chicken Masala.png' },
  { name: 'Coastal flavours', category: 'seafood', note: 'Make the catch of the day count', image: '/images/Fish Curry Masala.png' },
  { name: 'Vegetarian kitchen', category: 'vegetarian', note: 'Everyday dishes, full of character', image: '/images/Sambar Masala.png' },
  { name: 'The spice cupboard', category: 'pantry', note: 'The beginning of something delicious', image: '/images/Garam Masala.png' },
]

export default async function HomePage() {
  const products = await getProducts()
  const selection = products.filter(product => product.is_active && product.stock_qty > 0 && product.variants.length > 0).slice(0, 4)

  return <div className={styles.storefront}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.smallRule} /> Qureshi&apos;s Masala & Spices</p>
        <h1 id="home-title">Good food.<br />Great company.<br /><em>Unforgettable flavour.</em></h1>
        <p className={styles.heroDescription}>For the recipes you grew up with.<br />And the ones you&apos;ll make your own.</p>
        <div className={styles.heroActions}><Link href="/shop" className={styles.primaryButton}>Explore the spices <ArrowUpRight size={19} /></Link><Link href="/our-story" className={styles.textLink}>Our story <ArrowUpRight size={17} /></Link></div>
        <a href="#collection" className={styles.discover}><ArrowDown size={16} /> Discover your next favourite</a>
      </div>
      <HeroProductCarousel products={products.filter(product => product.is_active && product.image_url).map(product => ({
        id: product.id,
        name: product.name,
        image: product.image_url,
        href: `/product/${product.slug || product.name.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
      }))} />
    </section>

    <div className={styles.serviceBar}>
      <div><Package size={19} /><span>Choose a pack that suits your kitchen</span></div>
      <div><Utensils size={19} /><span>Find inspiration in our recipes</span></div>
      <div><MessageCircle size={19} /><span>Order with a personal touch on WhatsApp</span></div>
    </div>

    <SpiceFinder />
    <section id="collection" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>The collection</p><h2>A flavour for<br /><em>every kind of cook.</em></h2></div><p>Weeknight comfort. Weekend feasts. Find the spices that belong in your kitchen.</p></div>
        <div className={styles.categoryGrid}>{categories.map((category, index) => <Link key={category.category} href={`/shop?category=${category.category}`} className={styles.categoryCard}><span className={styles.categoryNumber}>0{index + 1}</span><div className={styles.categoryImage}><Image src={category.image} alt="" fill sizes="(max-width: 767px) 40vw, 20vw" /></div><div><h3>{category.name}</h3><p>{category.note}</p></div><ArrowUpRight className={styles.categoryArrow} size={20} aria-hidden="true" /></Link>)}</div>
      </div>
    </section>

    {selection.length > 0 && <section className={styles.selectionSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Meet your next kitchen staple</p><h2>Ready for <em>your table.</em></h2></div><Link href="/shop" className={styles.textLink}>Shop the full collection <ArrowUpRight size={18} /></Link></div>
        <ProductGrid products={selection} />
      </div>
    </section>}

    <section className={styles.storySection}>
      <div className={styles.storyVisual}><Image src="/images/heritage crafted.jpeg" alt="Spice crafting, part of the Qureshi's story" fill sizes="(max-width: 767px) 100vw, 50vw" /><span>Food connects us.</span></div>
      <div className={styles.storyCopy}><p className={styles.eyebrow}>More than a meal</p><h2>Some stories<br />are told<br /><em>through flavour.</em></h2><p>A familiar aroma. A recipe passed around the family. One more serving shared across the table. These are the moments that inspire Qureshi&apos;s Masala & Spices.</p><p>We believe the right blend is the beginning of a meal worth remembering.</p><Link href="/our-story" className={styles.outlineButton}>Meet Qureshi&apos;s <ArrowUpRight size={18} /></Link></div>
    </section>

    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.editorialGrid}>
          <Link href="/recipes" className={styles.editorialCard}><span className={styles.eyebrow}>From spice to supper</span><Utensils size={30} aria-hidden="true" /><h2>A little inspiration.<br /><em>A delicious result.</em></h2><p>Explore recipes and put your favourite blends to work.</p><span className={styles.textLink}>Find something to cook <ArrowUpRight size={18} /></span></Link>
          <Link href="/stock-our-products" className={styles.editorialCard}><span className={styles.eyebrow}>For retailers</span><Package size={30} aria-hidden="true" /><h2>Make room<br /><em>for good flavour.</em></h2><p>Bring Qureshi&apos;s Masala & Spices to your shelves.</p><span className={styles.textLink}>Stock our products <ArrowUpRight size={18} /></span></Link>
        </div>
        <div className={styles.howToOrder}><div><p className={styles.eyebrow}>Simple, personal ordering</p><h2>Your kitchen.<br /><em>Our next destination.</em></h2></div><ol><li><span>01</span><div><h3>Find your flavour</h3><p>Choose your spices, pack sizes and quantities.</p></div></li><li><span>02</span><div><h3>Share your details</h3><p>Review your cart and enter your delivery address.</p></div></li><li><span>03</span><div><h3>Connect on WhatsApp</h3><p>Submit your order and confirm delivery and payment with our team. No payment is collected on this website.</p></div></li></ol></div>
      </div>
    </section>
  </div>
}
