import type { ReactNode } from 'react'
import Image from 'next/image'

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

function SpiceSeal() {
  return (
    <svg
      aria-hidden="true"
      className="qms-page-hero__seal-art"
      viewBox="0 0 320 320"
      fill="none"
    >
      <circle cx="160" cy="160" r="138" stroke="currentColor" strokeWidth="2" />
      <circle cx="160" cy="160" r="116" stroke="currentColor" strokeDasharray="4 10" />
      <path
        d="M86 176c46 29 102 14 137-45-41 29-81 27-119-7-2 18-8 35-18 52Z"
        fill="currentColor"
        opacity=".95"
      />
      <path
        d="M117 122c8-27 26-43 55-48M70 185l-22 10m183-74 29-3"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M100 226c18 10 38 15 60 15 50 0 92-30 111-72"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="2 9"
      />
    </svg>
  )
}

export default function KodaguPageHero({
  eyebrow,
  title,
  description,
  index,
  meta = [],
  image,
  imageAlt = '',
  imageLabel,
  imageMode = 'cover',
  compact = false,
  children,
}: KodaguPageHeroProps) {
  return (
    <section
      className={`qms-page-hero ${compact ? 'qms-page-hero--compact' : ''} ${
        image ? 'qms-page-hero--media' : 'qms-page-hero--seal'
      }`}
    >
      <div className="qms-page-hero__grain" aria-hidden="true" />
      <div className="qms-page-hero__pigment qms-page-hero__pigment--chilli" aria-hidden="true" />
      <div className="qms-page-hero__pigment qms-page-hero__pigment--turmeric" aria-hidden="true" />

      <div className="qms-page-hero__frame">
        <div className="qms-page-hero__copy">
          <div className="qms-page-hero__eyebrow">
            <span>{index}</span>
            <span>{eyebrow}</span>
          </div>

          <h1 className="qms-page-hero__title">{title}</h1>
          <p className="qms-page-hero__description">{description}</p>

          {meta.length > 0 ? (
            <div className="qms-page-hero__meta" aria-label="Page highlights">
              {meta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}

          {children ? <div className="qms-page-hero__actions">{children}</div> : null}
        </div>

        <div className={`qms-page-hero__media qms-page-hero__media--${imageMode}`}>
          <div className="qms-page-hero__orbit" aria-hidden="true" />
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(max-width: 899px) 92vw, 42vw"
              className={imageMode === 'product' ? 'object-contain' : 'object-cover'}
              priority
            />
          ) : (
            <SpiceSeal />
          )}
          <span className="qms-page-hero__media-index" aria-hidden="true">
            QMS / KODAGU / 26
          </span>
          {imageLabel ? (
            <span className="qms-page-hero__media-label">{imageLabel}</span>
          ) : null}
        </div>
      </div>

      <div className="qms-page-hero__torn-edge" aria-hidden="true" />
    </section>
  )
}
