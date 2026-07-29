import { Leaf, ShieldCheck, Sparkles, Wheat } from 'lucide-react'

const details = [
  { icon: ShieldCheck, title: 'Authentic recipes', text: 'Blends shaped by real family cooking, not generic seasoning formulas.' },
  { icon: Wheat, title: 'Freshly ground', text: 'Prepared in considered batches to protect natural aroma and character.' },
  { icon: Leaf, title: 'Clean ingredients', text: 'Carefully selected spices with no added preservatives or artificial colour.' },
  { icon: Sparkles, title: 'Made with care', text: 'Consistent quality from sourcing and cleaning through blending and packing.' },
] as const

export default function QureshiDifference() {
  return (
    <section className="minimal-difference">
      <div className="minimal-section-heading">
        <p className="minimal-kicker">Why Qureshi&apos;s</p>
        <h2>Only what flavour needs.</h2>
        <p>Four simple promises behind every pack.</p>
      </div>
      <div className="minimal-difference__grid">
        {details.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
