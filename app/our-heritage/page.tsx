import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import KodaguPageHero from '@/components/site/KodaguPageHero'

const timeline = [
  ['The beginning', 'Family recipes become a shared standard for flavour.'],
  ['The craft', 'Traditional spice knowledge is refined into repeatable small-batch blends.'],
  ['The brand', 'Qureshi’s Masala & Spices is created to take those blends beyond our own kitchen.'],
  ['Today', 'A growing collection brings Kodagu-ground masalas to homes and retailers across India.'],
] as const

export default function OurHeritagePage() {
  return (
    <div className="qms-editorial-page minimal-editorial-page">
      <KodaguPageHero
        eyebrow="Our heritage"
        index="04"
        title={<>Rooted in Kodagu.<br /><strong>Made to travel.</strong></>}
        description="Our heritage is not decoration. It is the practical knowledge behind how ingredients are chosen, balanced, ground and used."
        meta={['Kodagu roots', 'Family knowledge', 'Modern consistency']}
      />

      <section className="minimal-narrative">
        <p className="minimal-kicker">A living tradition</p>
        <div className="minimal-narrative__grid">
          <h2>Heritage should make the food better.</h2>
          <div>
            <p>
              Kodagu&apos;s food culture values freshness, depth and balance. We carry those priorities into every product instead of treating heritage as a label.
            </p>
            <p>
              The result is a collection that respects traditional recipes while giving today&apos;s cooks a clear, reliable way to use them.
            </p>
          </div>
        </div>
      </section>

      <section className="minimal-timeline">
        <div className="minimal-section-heading">
          <p className="minimal-kicker">Our path</p>
          <h2>From family knowledge to a growing collection.</h2>
        </div>
        <div className="minimal-timeline__list">
          {timeline.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <blockquote className="minimal-heritage-quote">
        “Keep the recipe honest. Let the ingredients speak.”
        <cite>Our blending principle</cite>
      </blockquote>

      <section className="minimal-final-cta">
        <p className="minimal-kicker">The collection</p>
        <h2>Heritage you can cook with.</h2>
        <Link href="/shop" className="minimal-button">Explore every blend <ArrowRight size={16} /></Link>
      </section>
    </div>
  )
}
