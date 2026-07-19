import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Users, ChefHat, ArrowRight, CheckCircle } from 'lucide-react'
import { getPublicRecipes } from '@/lib/actions'
import RecipeAddToCart from '@/components/site/RecipeAddToCart'
import type { Product, ProductVariant } from '@/types'

export const dynamic = 'force-dynamic'

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const allRecipes = await getPublicRecipes()
  const requestedSlug = decodeURIComponent(params.slug).trim().toLowerCase()
  const recipe = allRecipes.find(
    (candidate: any) => candidate.slug?.trim().toLowerCase() === requestedSlug
  )

  if (!recipe) {
    notFound()
  }

  const relatedRecipes = allRecipes.filter((r: any) => r.id !== recipe.id && r.cuisine_or_category === recipe.cuisine_or_category).slice(0, 3)
  const relatedProducts = recipe.recipe_products?.map((rp: any) => rp.products) || []

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/recipes" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors duration-300">
            <ArrowLeft size={16} />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em]">Back to Recipes</span>
          </Link>
        </div>

        {/* Hero */}
        <div className="mb-12">
          <div className="relative rounded-3xl overflow-hidden mb-8">
            {recipe.thumbnail_url ? (
              <Image
                src={recipe.thumbnail_url}
                alt={recipe.name}
                width={1200}
                height={600}
                className="w-full h-72 sm:h-96 object-cover"
                priority
              />
            ) : (
              <div className="w-full h-72 sm:h-96 bg-white/5 flex items-center justify-center">
                <ChefHat size={64} className="text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              {recipe.cuisine_or_category && (
                <span className="inline-block px-4 py-2 bg-gold text-black text-[10px] font-bold tracking-[0.25em] uppercase rounded-full mb-4">
                  {recipe.cuisine_or_category}
                </span>
              )}
              {recipe.is_vegetarian && (
                <span className="ml-2 inline-block px-4 py-2 bg-green-500/20 text-green-400 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full border border-green-500/30 mb-4">
                  Vegetarian
                </span>
              )}
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl uppercase">
                {recipe.name}
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 items-center">
            {recipe.preparation_time && (
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={18} />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Prep Time</div>
                  <div className="text-sm font-medium">{recipe.preparation_time} mins</div>
                </div>
              </div>
            )}
            {recipe.cooking_time && (
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={18} />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Cook Time</div>
                  <div className="text-sm font-medium">{recipe.cooking_time} mins</div>
                </div>
              </div>
            )}
            {recipe.total_time && (
              <div className="flex items-center gap-2 text-white/60">
                <Clock size={18} />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Total Time</div>
                  <div className="text-sm font-medium">{recipe.total_time} mins</div>
                </div>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2 text-white/60">
                <Users size={18} />
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Servings</div>
                  <div className="text-sm font-medium">{recipe.servings}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-white/60">
              <ChefHat size={18} />
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">Difficulty</div>
                <div className="text-sm font-medium">{recipe.difficulty}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Ingredients */}
          <div className="lg:col-span-5">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-2xl sm:text-3xl uppercase mb-6">Ingredients</h2>
              <ul className="space-y-4">
                {(recipe.ingredients || []).sort((a: any, b: any) => a.order - b.order).map((ingredient: any, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                    <span className="text-white/70">{ingredient.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Related Masalas */}
            {relatedProducts.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="text-[10px] uppercase tracking-[0.3em] text-gold mb-2">
                  You'll Need
                </div>
                {relatedProducts.map((product: any) => (
                  <div key={product.id} className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-2xl p-6 sm:p-8">
                    <h3 className="font-display text-xl sm:text-2xl uppercase mb-4">{product.name}</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-20 h-20 bg-black/40 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-xl sm:text-2xl text-gold">
                          ₹{product.variants[0].price}
                        </div>
                        <div className="text-white/40 text-xs">
                          {product.variants[0].weight_grams}g
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 bg-white/10 text-white flex items-center justify-center gap-2 px-4 py-3 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl hover:bg-white/20"
                      >
                        View Product
                      </Link>
                      <RecipeAddToCart product={product} variant={product.variants[0]} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="lg:col-span-7">
            <div className="mb-12">
              <h2 className="font-display text-2xl sm:text-3xl uppercase mb-6">Instructions</h2>
              <ol className="space-y-6">
                {(recipe.preparation_steps || []).sort((a: any, b: any) => a.order - b.order).map((step: any, index: number) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center font-display text-xl">
                      {index + 1}
                    </div>
                    <p className="text-white/70 text-base leading-relaxed pt-1">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>

            {recipe.full_description && (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 mb-12">
                <h2 className="font-display text-2xl sm:text-3xl uppercase mb-6">About this Recipe</h2>
                <p className="text-white/70 text-base leading-relaxed">{recipe.full_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl uppercase mb-8">
              You May Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedRecipes.map((r: any) => (
                <Link key={r.id} href={`/recipes/${r.slug}`} className="group">
                  <div className="bg-black/40 border border-white/10 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300">
                    <div className="relative h-48 overflow-hidden">
                      {r.thumbnail_url ? (
                        <Image
                          src={r.thumbnail_url}
                          alt={r.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <ChefHat size={32} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-display text-xl sm:text-2xl uppercase mb-2 group-hover:text-gold transition-colors duration-300">
                        {r.name}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">{r.short_description}</p>
                      <div className="flex items-center gap-2 text-gold text-[10px] font-bold tracking-[0.25em] uppercase">
                        View Recipe
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}