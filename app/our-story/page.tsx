import Link from 'next/link'
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import KodaguPageHero from '@/components/site/KodaguPageHero'

const process = [
  ['01', 'Select', 'We begin with carefully chosen whole spices from trusted suppliers.'],
  ['02', 'Clean', 'Every ingredient is sorted and cleaned before it reaches the grinder.'],
  ['03', 'Blend', 'Traditional recipes are prepared in small batches for balance and consistency.'],
  ['04', 'Seal', 'Each blend is packed promptly to hold on to its natural aroma and flavour.'],
] as const

export default function OurStoryPage() {
  return (
    <div className="qms-editorial-page minimal-editorial-page">
      <KodaguPageHero
        eyebrow="Our story"
        index="03"
        title={<>More than masala.<br /><strong>A tradition shared.</strong></>}
        description="Qureshi's began with a simple belief: the flavour people remember from home should be possible in every kitchen."
        meta={['Family rooted', 'Small-batch craft', 'Made in Kodagu']}
      />

      <section className="minimal-narrative">
        <p className="minimal-kicker">Where it began</p>
        <div className="minimal-narrative__grid">
          <h2>Built from flavour memory.</h2>
          <div>
            <p>
              Our recipes grew from family kitchens where spice was measured by experience, aroma and instinct. That knowledge became the foundation for Qureshi&apos;s Masala &amp; Spices.
            </p>
            <p>
              Today, we preserve that character through careful sourcing, small-batch grinding and clear, dependable blends made for modern everyday cooking.
            </p>
          </div>
        </div>
      </section>

      <section className="minimal-values">
        <article>
          <Sparkles size={24} strokeWidth={1.5} />
          <h2>Authentic</h2>
          <p>Recipes shaped by the food we know, cook and serve ourselves.</p>
        </article>
        <article>
          <Leaf size={24} strokeWidth={1.5} />
          <h2>Natural</h2>
          <p>Real spices without added preservatives or artificial colour.</p>
        </article>
        <article>
          <ShieldCheck size={24} strokeWidth={1.5} />
          <h2>Consistent</h2>
          <p>Careful preparation so your favourite dish tastes right every time.</p>
        </article>
      </section>

      <section className="minimal-process">
        <div className="minimal-section-heading">
          <p className="minimal-kicker">How we make it</p>
          <h2>A shorter path from spice to pack.</h2>
        </div>
        <div className="minimal-process__list">
          {process.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="minimal-final-cta">
        <p className="minimal-kicker">Taste the story</p>
        <h2>Bring Qureshi&apos;s into your kitchen.</h2>
        <Link href="/shop" className="minimal-button">Shop the collection <ArrowRight size={16} /></Link>
      </section>
    </div>
  )
}
