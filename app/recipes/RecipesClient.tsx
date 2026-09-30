'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock3, Search, Utensils, X } from 'lucide-react'
import type { RecipeWithProducts } from '@/types'
import styles from './Recipes.module.css'

const topics = ['All recipes', 'Chicken', 'Mutton', 'Vegetarian', 'Seafood'] as const

export default function RecipesClient({ allRecipes }: { allRecipes: RecipeWithProducts[] }) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<(typeof topics)[number]>('All recipes')
  const filtered = useMemo(() => allRecipes.filter(recipe => {
    const haystack = [recipe.name, recipe.short_description, recipe.cuisine_or_category, ...recipe.recipe_products.map(item => item.products?.name || '')].join(' ').toLowerCase()
    const matchesQuery = haystack.includes(query.trim().toLowerCase())
    const matchesTopic = topic === 'All recipes' || (topic === 'Vegetarian' ? recipe.is_vegetarian : topic === 'Seafood' ? /fish|prawn|seafood|coastal/.test(haystack) : haystack.includes(topic.toLowerCase()))
    return matchesQuery && matchesTopic
  }), [allRecipes, query, topic])

  return <main className={styles.page}>
    <div className={styles.container}>
      <header className={styles.listHero}><p className={styles.eyebrow}>FROM OUR KITCHEN TO YOURS</p><h1>Cook with <em>character.</em></h1><p>Pick a dish. Find the blend. Make a meal worth sharing.</p><div className={styles.heroRule}><span>THE RECIPE COLLECTION</span><span>{allRecipes.length} ideas to explore</span></div></header>
      <div className={styles.discovery}>
        <div className={styles.topics} role="group" aria-label="Filter recipes by dish">{topics.map(item => <button key={item} type="button" aria-pressed={topic === item} onClick={() => setTopic(item)}>{item}</button>)}</div>
        <label className={styles.search}><Search size={18} aria-hidden="true" /><span className={styles.visuallyHidden}>Search recipes</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a dish or masala…" />{query && <button type="button" aria-label="Clear recipe search" onClick={() => setQuery('')}><X size={17} /></button>}</label>
      </div>
      <p className={styles.count} role="status">Showing {filtered.length} {filtered.length === 1 ? 'recipe' : 'recipes'}</p>
      {filtered.length ? <div className={styles.grid}>{filtered.map((recipe, index) => {
        const product = recipe.recipe_products.find(item => item.products?.is_active)?.products
        return <Link href={`/recipes/${recipe.slug}`} key={recipe.id} className={styles.card}>
          <div className={styles.cardImage}>{recipe.thumbnail_url ? <Image src={recipe.thumbnail_url} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw" /> : <Utensils size={44} aria-hidden="true" />}<span>0{index + 1} / THE KITCHEN EDIT</span></div>
          <div className={styles.cardBody}><div className={styles.cardMeta}><span>{recipe.cuisine_or_category || (recipe.is_vegetarian ? 'Vegetarian' : 'From our kitchen')}</span>{recipe.total_time && <span><Clock3 size={13} /> {recipe.total_time} min</span>}</div><h2>{recipe.name}</h2><p>{recipe.short_description}</p>{product && <small>Made with {product.name}</small>}<span className={styles.cardLink}>Cook this recipe <ArrowUpRight size={17} /></span></div>
        </Link>
      })}</div> : <div className={styles.empty}><Utensils size={30} /><h2>No recipes found.</h2><p>Try a different dish or explore the whole kitchen.</p><button type="button" onClick={() => { setQuery(''); setTopic('All recipes') }}>Show all recipes</button></div>}
      <div className={styles.listFooter}><p>Find the flavour behind the food.</p><Link href="/shop">Explore all spices <ArrowUpRight size={18} /></Link></div>
    </div>
  </main>
}
