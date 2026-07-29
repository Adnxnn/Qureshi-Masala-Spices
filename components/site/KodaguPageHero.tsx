import type { ReactNode } from 'react'

type KodaguPageHeroProps = {
  eyebrow: string
  title: ReactNode
  description: string
  index: string
  meta?: string[]
  image?: string
  imageAlt?: string
  imageLabel?: string
  imageMode?: 'cover' | 'product'
  compact?: boolean
  children?: ReactNode
}

export default function KodaguPageHero({
  eyebrow,
  title,
  description,
  meta = [],
  compact = false,
  children,
}: KodaguPageHeroProps) {
  return (
    <section className={`minimal-page-hero ${compact ? 'minimal-page-hero--compact' : ''}`}>
      <div className="minimal-page-hero__inner">
        <p className="minimal-kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="minimal-page-hero__description">{description}</p>
        {meta.length ? (
          <div className="minimal-page-hero__meta">
            {meta.map((item) => <span key={item}>{item}</span>)}
          </div>
        ) : null}
        {children ? <div className="minimal-page-hero__actions">{children}</div> : null}
      </div>
    </section>
  )
}
