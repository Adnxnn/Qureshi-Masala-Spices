import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="minimal-hero">
      <div className="minimal-hero__copy">
        <p className="minimal-kicker">Qureshi&apos;s Masala &amp; Spices</p>
        <h1>
          Full flavour.<br />Nothing extra.
        </h1>
        <p className="minimal-hero__body">
          Authentic, small-batch masalas made with carefully selected ingredients and no preservatives.
        </p>
        <div className="minimal-hero__actions">
          <Link href="/shop" className="minimal-button">
            Shop masalas <ArrowRight size={16} />
          </Link>
          <Link href="/our-story" className="minimal-text-link">Our story</Link>
        </div>
        <dl className="minimal-hero__facts">
          <div><dt>100%</dt><dd>Natural</dd></div>
          <div><dt>0</dt><dd>Preservatives</dd></div>
          <div><dt>20</dt><dd>Signature blends</dd></div>
        </dl>
      </div>

      <div className="minimal-hero__product">
        <div className="minimal-hero__halo" aria-hidden="true" />
        <Image
          src="/images/Kebab Masala.png"
          alt="Qureshi's Chicken Kebab Masala pouch"
          fill
          priority
          sizes="(max-width: 899px) 86vw, 46vw"
          className="object-contain"
        />
        <p>Chicken Kebab Masala <span>From ₹120</span></p>
      </div>
    </section>
  )
}
