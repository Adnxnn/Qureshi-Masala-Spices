'use client'

import { motion, useReducedMotion } from 'framer-motion'

const proofs = [
  {
    number: '01',
    title: '100% Authentic',
    stamp: 'Traditional recipes',
    description: 'Blends built from the flavour memory of real home kitchens—not generic seasoning shortcuts.',
    tone: 'chilli',
    icon: 'chilli',
  },
  {
    number: '02',
    title: 'Freshly Ground',
    stamp: 'Small batches',
    description: 'Ground in considered batches so the natural aroma reaches your kitchen bright and alive.',
    tone: 'turmeric',
    icon: 'mortar',
  },
  {
    number: '03',
    title: 'Premium Quality',
    stamp: 'Hand-picked',
    description: 'Only carefully selected ingredients earn their place inside a Qureshi’s blend.',
    tone: 'leaf',
    icon: 'leaf',
  },
  {
    number: '04',
    title: 'Heritage Crafted',
    stamp: 'Kodagu roots',
    description: 'Time-honoured blending knowledge, carried forward with the precision of a modern pantry.',
    tone: 'tamarind',
    icon: 'heritage',
  },
] as const

type ProofIcon = (typeof proofs)[number]['icon']

function IngredientIllustration({ icon }: { icon: ProofIcon }) {
  if (icon === 'chilli') {
    return (
      <svg viewBox="0 0 180 150" role="img" aria-label="Hand-drawn red chilli">
        <path className="qms-proof-icon-fill" d="M42 95c27 12 67 3 91-45 6 39-22 77-59 82-22 3-42-9-48-22 7 0 12-5 16-15Z" />
        <path d="M42 95c27 12 67 3 91-45 6 39-22 77-59 82-22 3-42-9-48-22 7 0 12-5 16-15Z" />
        <path d="M130 52c-1-13 8-23 21-27-6 10-8 19-5 28" />
        <path d="M59 110c16 4 37-2 50-14" />
        <circle className="qms-proof-speck" cx="30" cy="53" r="3" />
        <circle className="qms-proof-speck" cx="148" cy="99" r="2.5" />
      </svg>
    )
  }

  if (icon === 'mortar') {
    return (
      <svg viewBox="0 0 180 150" role="img" aria-label="Hand-drawn mortar and pestle">
        <path className="qms-proof-icon-fill" d="M43 70h91c-2 38-18 61-45 61S46 108 43 70Z" />
        <path d="M43 70h91c-2 38-18 61-45 61S46 108 43 70Z" />
        <path d="M58 74c18 7 43 7 61-1" />
        <path className="qms-proof-icon-fill" d="m102 78 36-54c5-8 19 1 14 9l-41 50Z" />
        <path d="m102 78 36-54c5-8 19 1 14 9l-41 50" />
        <path d="M71 131h39" />
        <circle className="qms-proof-speck" cx="37" cy="43" r="3" />
        <circle className="qms-proof-speck" cx="74" cy="45" r="2.5" />
      </svg>
    )
  }

  if (icon === 'leaf') {
    return (
      <svg viewBox="0 0 180 150" role="img" aria-label="Hand-drawn curry leaf sprig">
        <path d="M41 127C70 102 94 76 126 28" />
        <path className="qms-proof-icon-fill" d="M69 98c-20 2-31-8-33-27 20-2 34 7 33 27Z" />
        <path d="M69 98c-20 2-31-8-33-27 20-2 34 7 33 27Z" />
        <path className="qms-proof-icon-fill" d="M93 72c-17-4-24-16-19-33 18 4 27 16 19 33Z" />
        <path d="M93 72c-17-4-24-16-19-33 18 4 27 16 19 33Z" />
        <path className="qms-proof-icon-fill" d="M102 67c3-19 15-28 33-25-2 19-14 30-33 25Z" />
        <path d="M102 67c3-19 15-28 33-25-2 19-14 30-33 25Z" />
        <path className="qms-proof-icon-fill" d="M78 96c8-18 22-24 39-16-8 18-21 26-39 16Z" />
        <path d="M78 96c8-18 22-24 39-16-8 18-21 26-39 16Z" />
        <circle className="qms-proof-speck" cx="139" cy="104" r="3" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 180 150" role="img" aria-label="Hand-drawn Kodagu heritage doorway">
      <path className="qms-proof-icon-fill" d="M41 127V65l49-40 49 40v62Z" />
      <path d="M41 127V65l49-40 49 40v62" />
      <path d="M30 127h120M54 127V71h72v56" />
      <path className="qms-proof-icon-paper" d="M72 127V91c0-12 8-22 18-22s18 10 18 22v36Z" />
      <path d="M72 127V91c0-12 8-22 18-22s18 10 18 22v36" />
      <path d="M82 42h16M90 32v20" />
      <circle className="qms-proof-speck" cx="31" cy="42" r="3" />
      <circle className="qms-proof-speck" cx="147" cy="91" r="2.5" />
    </svg>
  )
}

export default function QureshiDifference() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="qms-difference" aria-labelledby="qms-difference-title">
      <div className="qms-difference-pigment qms-difference-pigment--left" aria-hidden="true" />
      <div className="qms-difference-pigment qms-difference-pigment--right" aria-hidden="true" />

      <div className="qms-difference-shell">
        <header className="qms-difference-heading">
          <div>
            <p className="qms-difference-kicker">The Qureshi Difference / Proof Ledger</p>
            <h2 id="qms-difference-title" className="qms-difference-title">
              Four things<br />
              <span>we never dilute.</span>
            </h2>
          </div>
          <div className="qms-difference-note">
            <span aria-hidden="true">04</span>
            <p>
              Good masala is not just heat. It is ingredient quality, timing, memory and care—held together in every batch.
            </p>
          </div>
        </header>

        <div className="qms-proof-grid">
          {proofs.map((proof, index) => (
            <motion.article
              key={proof.title}
              className={`qms-proof-card qms-proof-card--${proof.tone}`}
              initial={reduceMotion ? false : { opacity: 0, y: 48, rotate: index % 2 === 0 ? -2.5 : 2.5 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: index * 0.055, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="qms-proof-card-topline">
                <span>Proof {proof.number}</span>
                <span>QMS / Kodagu</span>
              </div>

              <div className="qms-proof-illustration">
                <IngredientIllustration icon={proof.icon} />
              </div>

              <div className="qms-proof-copy">
                <p className="qms-proof-stamp">{proof.stamp}</p>
                <h3>{proof.title}</h3>
                <p>{proof.description}</p>
              </div>

              <span className="qms-proof-seal" aria-hidden="true">
                <b>{proof.number}</b>
                Checked
              </span>
            </motion.article>
          ))}
        </div>

        <div className="qms-difference-footer" aria-label="Qureshi's batch promise">
          <span>Made for the everyday kitchen</span>
          <span aria-hidden="true">✦</span>
          <span>Ground with uncommon care</span>
        </div>
      </div>
    </section>
  )
}
