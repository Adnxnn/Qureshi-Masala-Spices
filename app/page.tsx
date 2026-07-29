import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { getProducts } from '@/lib/actions'
import HeroSection from '@/components/site/HeroSection'
import ProductGrid from '@/components/site/ProductGrid'
import QureshiDifference from '@/components/site/QureshiDifference'
import StatsMarquee from '@/components/site/StatsMarquee'

export const dynamic = 'force-dynamic'

const reviews = [
  ['Rahul Mehta', 'Madikeri', 'Best chicken masala I have used. The flavour is fresh, balanced and tastes like home.'],
  ['Ayesha Begum', 'Hyderabad', 'The biryani masala gives a deep aroma without overpowering the dish.'],
  ['Divya Rao', 'Bengaluru', 'Clean ingredients, beautiful packs and genuinely reliable flavour in every batch.'],
] as const

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <HeroSection />
      <StatsMarquee />

      <section className="minimal-products">
        <div className="minimal-section-heading minimal-section-heading--row">
          <div>
            <p className="minimal-kicker">Shop the collection</p>
            <h2>Everyday essentials.<br />Distinctive blends.</h2>
          </div>
          <Link href="/shop" className="minimal-text-link">View all products <ArrowRight size={15} /></Link>
        </div>
        <ProductGrid products={products.slice(0, 8)} />
      </section>

      <QureshiDifference />

      <section className="minimal-story-preview">
        <div className="minimal-story-preview__media">
          <Image
            src="/images/our_heritage_1.jpeg"
            alt="Traditional spices prepared in Kodagu"
            fill
            sizes="(max-width: 899px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="minimal-story-preview__copy">
          <p className="minimal-kicker">Rooted in Kodagu</p>
          <h2>Tradition, made useful for today.</h2>
          <p>
            We carry family recipes forward with better sourcing, careful small-batch blending and packaging designed to keep every masala fresh.
          </p>
          <Link href="/our-heritage" className="minimal-button minimal-button--light">
            Discover our heritage <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="minimal-reviews">
        <div className="minimal-section-heading">
          <p className="minimal-kicker">Customer notes</p>
          <h2>Loved in kitchens across India.</h2>
        </div>
        <div className="minimal-reviews__grid">
          {reviews.map(([name, location, review]) => (
            <article key={name}>
              <div className="minimal-reviews__stars" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
              </div>
              <blockquote>“{review}”</blockquote>
              <p>{name}<span>{location}</span></p>
            </article>
          ))}
        </div>
      </section>

      <section className="minimal-final-cta">
        <p className="minimal-kicker">Pure flavour. Endless taste.</p>
        <h2>Find the blend your kitchen has been missing.</h2>
        <Link href="/shop" className="minimal-button">Shop all masalas <ArrowRight size={16} /></Link>
      </section>
    </>
  )
}
