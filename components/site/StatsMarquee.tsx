const stats = [
  ['100%', 'Natural ingredients'],
  ['0', 'Added preservatives'],
  ['20', 'Signature blends'],
  ['Kodagu', 'Ground in small batches'],
] as const

export default function StatsMarquee() {
  return (
    <section className="minimal-stats" aria-label="Qureshi's product highlights">
      {stats.map(([value, label]) => (
        <div key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  )
}
