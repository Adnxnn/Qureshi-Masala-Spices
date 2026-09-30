import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Leaf, MessageCircle, Package, Utensils } from 'lucide-react'
import { getProducts, getPublicRecipes } from '@/lib/actions'
import HeroProductCarousel from '@/components/site/HeroProductCarousel'
import ProductGrid from '@/components/site/ProductGrid'
import SpiceFinder from '@/components/site/SpiceFinder'
import HomeStoryFilm from '@/components/site/HomeStoryFilm'
import SpiceToSupper, { type SupperPair } from '@/components/site/SpiceToSupper'
import styles from '@/components/site/Storefront.module.css'

export const dynamic = 'force-dynamic'

const categories = [
  { name: 'Chicken favourites', category: 'chicken', note: 'For grills, curries & gatherings', image: '/images/Chicken Masala.png' },
  { name: 'Coastal flavours', category: 'seafood', note: 'Make the catch of the day count', image: '/images/Fish Curry Masala.png' },
  { name: 'Vegetarian kitchen', category: 'vegetarian', note: 'Everyday dishes, full of character', image: '/images/Sambar Masala.png' },
  { name: 'The spice cupboard', category: 'pantry', note: 'The beginning of something delicious', image: '/images/Garam Masala.png' },
]

export default async function HomePage() {
  const [products, recipes] = await Promise.all([getProducts(), getPublicRecipes().catch(() => [])])
  const selection = products.filter(product => product.is_active && product.stock_qty > 0 && product.variants.length > 0).slice(0, 4)
  const recipeSelection = [...recipes].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 3)
  const sortedRecipes = [...recipes].sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
  const supperPairs: SupperPair[] = products.filter(product => product.is_active && product.image_url).map(product => {
    const recipe = sortedRecipes.find(item => item.thumbnail_url && item.recipe_products?.some(link => link.product_id === product.id || link.products?.slug === product.slug))
    return { productName: product.name, productSlug: product.slug, productImage: product.image_url, productDescription: product.short_description || product.description, packSize: product.variants?.[0]?.weight_grams ?? null, recipeId: recipe?.id, recipeName: recipe?.name, recipeSlug: recipe?.slug, recipeImage: recipe?.thumbnail_url ?? null, recipeTime: recipe?.total_time ?? null }
  })

  return <div className={`${styles.storefront} ${styles.home}`}>
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.smallRule} /> QMS</p>
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

    <div className={styles.serviceBar} aria-label="The QMS experience">
      <div><span className={styles.serviceNumber}>01</span><Package size={19} /><span>Pick the pack that suits your kitchen</span></div>
      <div><span className={styles.serviceNumber}>02</span><Utensils size={19} /><span>Find a recipe for your next meal</span></div>
      <div><span className={styles.serviceNumber}>03</span><MessageCircle size={19} /><span>Confirm personally on WhatsApp</span></div>
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

    <SpiceToSupper pairs={supperPairs} />

    <section className={styles.storySection}>
      <div className={styles.storyVisual}><HomeStoryFilm /><span>Food connects us.</span><Link href="/our-story" className={styles.storyFilmLink}>Watch our story <ArrowUpRight size={16} /></Link></div>
      <div className={styles.storyCopy}><p className={styles.eyebrow}>More than a meal</p><h2>Some stories<br />are told<br /><em>through flavour.</em></h2><p>A familiar aroma. A recipe passed around the family. One more serving shared across the table. These are the moments that inspire QMS.</p><p>We believe the right blend is the beginning of a meal worth remembering.</p><Link href="/our-story" className={styles.outlineButton}>Meet QMS <ArrowUpRight size={18} /></Link></div>
    </section>

    {recipeSelection.length > 0 && <section className={styles.recipeSection} aria-labelledby="home-recipes-title"><div className={styles.container}>
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>From spice to supper</p><h2 id="home-recipes-title">The next thing<br /><em>worth making.</em></h2></div><Link href="/recipes" className={styles.textLink}>See every recipe <ArrowUpRight size={18} /></Link></div>
      <div className={styles.recipeGrid}>{recipeSelection.map((recipe, index) => { const image = recipe.thumbnail_url || recipe.recipe_products?.[0]?.products?.image_url; return <Link href={`/recipes/${recipe.slug}`} key={recipe.id} className={styles.recipeCard}><div className={styles.recipeImage}>{image ? <Image src={image} alt="" fill sizes="(max-width: 767px) 82vw, 32vw" /> : <Leaf size={55} aria-hidden="true" />}<span>0{index + 1} / COOK WITH CHARACTER</span></div><div className={styles.recipeInfo}><p>{recipe.cuisine_or_category || (recipe.is_vegetarian ? 'Vegetarian' : 'From our kitchen')}{recipe.total_time ? <> <span aria-hidden="true">·</span> <Clock3 size={13} /> {recipe.total_time} min</> : null}</p><h3>{recipe.name}</h3><span>Explore recipe <ArrowUpRight size={18} /></span></div></Link> })}</div>
    </div></section>}

    <section className={`${styles.section} ${styles.closingSection}`}>
      <div className={styles.container}>
        <div className={styles.closingIntro}><p className={styles.eyebrow}>Beyond the spice jar</p><h2>There&apos;s more to <em>the story.</em></h2><p>From the recipes we share to the shelves we join, discover the world behind the flavour.</p></div>
        <div className={styles.editorialGrid}>
          <Link href="/our-heritage" className={styles.editorialCard}><span className={styles.editorialTop}><Leaf size={23} aria-hidden="true" /><span>01 / Our heritage</span></span><h2>Recipes worth<br /><em>passing on.</em></h2><p>Meet the traditions and moments that inspire every blend.</p><span className={styles.textLink}>Explore our heritage <ArrowUpRight size={18} /></span></Link>
          <Link href="/stock-our-products" className={styles.editorialCard}><span className={styles.editorialTop}><Package size={23} aria-hidden="true" /><span>02 / For retailers</span></span><h2>Good flavour<br /><em>belongs everywhere.</em></h2><p>Bring QMS to your shelves.</p><span className={styles.textLink}>Stock our products <ArrowUpRight size={18} /></span></Link>
        </div>
        <div className={styles.howToOrder}><div><p className={styles.eyebrow}>Simple, personal ordering</p><h2>Your kitchen.<br /><em>Our next destination.</em></h2><Link href="/shop" className={styles.orderCta}>Find your flavour <ArrowRight size={18} /></Link></div><ol><li><span>01</span><div><h3>Find your flavour</h3><p>Choose your spices, pack sizes and quantities.</p></div></li><li><span>02</span><div><h3>Share your details</h3><p>Review your cart and enter your delivery address.</p></div></li><li><span>03</span><div><h3>Connect on WhatsApp</h3><p>Submit your order and confirm delivery and payment with our team. No payment is collected on this website.</p></div></li></ol></div>
      </div>
    </section>
  </div>
}
