'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Flame, Fish, Leaf, CookingPot } from 'lucide-react'
import styles from './SpiceFinder.module.css'
const ideas = [
  { label: 'A weekend feast', icon: CookingPot, title: 'Make it a biryani day.', text: 'Layer rice, your favourite ingredients, and a blend made for the occasion.', query: 'biryani', accent: '#a04d31' },
  { label: 'Something grilled', icon: Flame, title: 'Bring the grill to life.', text: 'Explore kebab blends for your next gathering around the table.', query: 'kebab', accent: '#8f4c32' },
  { label: 'Coastal comfort', icon: Fish, title: 'A taste of the coast.', text: 'Find the right blend for fish curries and crisp, flavourful fries.', category: 'seafood', accent: '#496d69' },
  { label: 'Everyday comfort', icon: Leaf, title: 'Simple meals. Big flavour.', text: 'Make room for comforting vegetarian favourites in your weekly rotation.', category: 'vegetarian', accent: '#536343' },
]
export default function SpiceFinder() {
  const [selected, setSelected] = useState(0)
  const idea = ideas[selected]
  const Icon = idea.icon
  return <section className={styles.finder} aria-labelledby="spice-finder-title">
    <div className={styles.heading}><p>THE KITCHEN COMPANION</p><h2 id="spice-finder-title">What’s cooking?</h2><span>A little inspiration for your next meal.</span></div>
    <div className={styles.options} role="group" aria-label="Choose your cooking mood">{ideas.map((item, index) => { const ItemIcon = item.icon; return <button key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><ItemIcon size={20} />{item.label}<ArrowUpRight size={16} /></button> })}</div>
    <div className={styles.result} style={{ '--spice-accent': idea.accent } as React.CSSProperties}><div className={styles.orbit} aria-hidden="true"><span /><span /><Icon size={50} strokeWidth={1} /></div><div aria-live="polite"><h3>{idea.title}</h3><p>{idea.text}</p><Link href={'/shop?' + (idea.query ? 'q=' + idea.query : 'category=' + idea.category)}>Find your blend <ArrowUpRight size={18} /></Link></div></div>
  </section>
}
