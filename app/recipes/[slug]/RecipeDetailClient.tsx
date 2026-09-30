'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, Clock3, Users, Utensils } from 'lucide-react'
import RecipeAddToCart from '@/components/site/RecipeAddToCart'
import type { RecipeWithProducts } from '@/types'
import styles from '../Recipes.module.css'

export default function RecipeDetailClient({ recipe, allRecipes }: { recipe: RecipeWithProducts; allRecipes: RecipeWithProducts[] }) {
  const related = allRecipes.filter(item => item.id !== recipe.id && item.cuisine_or_category === recipe.cuisine_or_category).slice(0, 3)
  const products = recipe.recipe_products?.map(item => item.products).filter(product => product?.is_active && product.variants?.length) || []
  const firstProduct = products[0]

  return <main className={styles.page}><div className={styles.container}>
    <Link href="/recipes" className={styles.back}><ArrowLeft size={16} /> All recipes</Link>
    <header className={styles.detailHero}>
      <div className={styles.detailPhoto}>{recipe.thumbnail_url ? <Image src={recipe.thumbnail_url} alt={recipe.name} fill priority sizes="(max-width: 900px) 100vw, 55vw" /> : <Utensils size={70} aria-hidden="true" />}<span>QURESHI&apos;S / THE KITCHEN EDIT</span></div>
      <div><p className={styles.eyebrow}>{recipe.cuisine_or_category || 'FROM OUR KITCHEN'}</p><h1>{recipe.name}</h1><p>{recipe.short_description}</p><div className={styles.facts}>{recipe.preparation_time && <span><Clock3 size={16} /> {recipe.preparation_time} min prep</span>}{recipe.cooking_time && <span><Clock3 size={16} /> {recipe.cooking_time} min cook</span>}{recipe.servings && <span><Users size={16} /> Serves {recipe.servings}</span>}<span>{recipe.difficulty}</span>{recipe.is_vegetarian && <span>Vegetarian</span>}</div><div className={styles.detailActions}><a href="#method">Start cooking <ArrowUpRight size={17} /></a>{firstProduct && <Link href={`/product/${firstProduct.slug}`}>Meet the masala <ArrowUpRight size={17} /></Link>}</div></div>
    </header>
    <div className={styles.cookLayout}>
      <aside><div className={styles.ingredients} id="ingredients"><p className={styles.eyebrow}>BEFORE YOU BEGIN</p><h2>Ingredients.</h2><ul>{[...(recipe.ingredients || [])].sort((a,b) => a.order-b.order).map((ingredient,index) => <li key={`${ingredient.order}-${index}`}><Check size={16} aria-hidden="true" /><span>{ingredient.text}</span></li>)}</ul></div>
        {products.map(product => <div key={product.id} className={styles.productNote}><p>THE BLEND BEHIND THE DISH</p><Link href={`/product/${product.slug}`}>{product.image_url && <Image src={product.image_url} alt="" width={62} height={75} />}<strong>{product.name}</strong></Link><span>Choose your preferred pack size on the product page.</span><div><Link href={`/product/${product.slug}`}>View packs</Link>{product.stock_qty > 0 && <RecipeAddToCart product={product} variant={product.variants[0]} />}</div></div>)}
      </aside>
      <section id="method" aria-labelledby="method-title"><p className={styles.eyebrow}>THE METHOD</p><h2>Let&apos;s make it.</h2><ol className={styles.steps}>{[...(recipe.preparation_steps || [])].sort((a,b) => a.order-b.order).map((step,index) => <li key={`${step.order}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><p>{step.text}</p></li>)}</ol>{recipe.full_description && <div className={styles.about}><h3>A little more about this dish.</h3><p>{recipe.full_description}</p></div>}</section>
    </div>
    {related.length > 0 && <section className={styles.related}><p className={styles.eyebrow}>KEEP COOKING</p><h2>Another dish for your table.</h2><div className={styles.relatedGrid}>{related.map(item => <Link key={item.id} href={`/recipes/${item.slug}`}>{item.thumbnail_url && <Image src={item.thumbnail_url} alt="" width={95} height={70} />}<span><strong>{item.name}</strong><small>Cook this recipe ↗</small></span></Link>)}</div></section>}
    <div className={styles.listFooter}><p>Something good starts with a spice.</p><Link href="/shop">Explore the collection <ArrowUpRight size={18} /></Link></div>
  </div></main>
}
