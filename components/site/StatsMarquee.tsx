'use client'

const stats = [
  { value: '100%', label: 'Natural', tone: 'chilli' },
  { value: '0', label: 'Preservatives', tone: 'turmeric' },
  { value: '12+', label: 'Signature Blends', tone: 'leaf' },
  { value: 'Small Batch', label: 'Ground Fresh', tone: 'cotton' },
] as const

const flavours = [
  'Kebab Masala',
  'Fish Fry Masala',
  'Fish Curry Masala',
  'Biryani Masala',
  'Chicken Masala',
  'Garam Masala',
] as const

export default function StatsMarquee() {
  return (
    <section
      className="qms-stats-market"
      aria-label="Qureshi's product highlights"
    >
      <div className="qms-stats-market__grain" aria-hidden="true" />

      <div className="qms-stats-market__rail qms-stats-market__rail--primary">
        <div className="qms-stats-market__track qms-stats-market__track--reverse">
          {[0, 1].map((duplicate) => (
            <div
              key={duplicate}
              className="qms-stats-market__set"
              aria-hidden={duplicate === 1}
            >
              {stats.map((stat, index) => (
                <div
                  key={`${duplicate}-${stat.label}`}
                  className={`qms-stats-market__stamp qms-stats-market__stamp--${stat.tone}`}
                >
                  <span className="qms-stats-market__batch">
                    Batch {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="qms-stats-market__value">{stat.value}</span>
                  <span className="qms-stats-market__label">{stat.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="qms-stats-market__rail qms-stats-market__rail--flavours">
        <div className="qms-stats-market__track">
          {[0, 1].map((duplicate) => (
            <div
              key={duplicate}
              className="qms-stats-market__set qms-stats-market__set--flavours"
              aria-hidden={duplicate === 1}
            >
              {flavours.map((flavour, index) => (
                <span key={`${duplicate}-${flavour}`} className="qms-stats-market__flavour">
                  <span aria-hidden="true" className="qms-stats-market__seed">
                    {index % 2 === 0 ? '✦' : '◆'}
                  </span>
                  {flavour}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
