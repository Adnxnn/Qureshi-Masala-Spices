'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Users,
  ChefHat,
  Search,
} from 'lucide-react'
import { getPublicRecipes } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<any[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      try {
        const recipes = await getPublicRecipes()
        setAllRecipes(recipes)
        setFilteredRecipes(recipes)
      } catch (error) {
        console.error('Unable to load recipes:', error)
        setAllRecipes([])
        setFilteredRecipes([])
      } finally {
        setLoading(false)
      }
    }

    void loadRecipes()
  }, [])

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      setFilteredRecipes(allRecipes)
      return
    }

    setFilteredRecipes(
      allRecipes.filter((recipe) => {
        const name = String(recipe.name || '').toLowerCase()
        const description = String(
          recipe.short_description || ''
        ).toLowerCase()
        const category = String(
          recipe.cuisine_or_category || ''
        ).toLowerCase()

        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query)
        )
      })
    )
  }, [searchQuery, allRecipes])

  return (
    <div className="royal-page royal-grain min-h-screen w-full overflow-x-hidden pb-20 pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:mb-16">
          <div className="royal-eyebrow mb-4">
            Recipes
          </div>

          <h1 className="royal-title mb-6 text-5xl sm:text-6xl md:text-7xl">
            Cook with character.
          </h1>

          <p className="mx-auto max-w-2xl text-base text-white/60 sm:text-lg md:text-xl">
            Discover authentic recipes made with Qureshi&apos;s
            Masala &amp; Spices
          </p>
        </header>

        <div className="relative mx-auto mb-12 w-full max-w-lg">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
            size={20}
            aria-hidden="true"
          />

          <input
            type="search"
            aria-label="Search recipes"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            className="royal-field py-3.5 pl-12 pr-5 text-base placeholder:text-white/20"
          />
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="text-lg text-white/30">
              Loading recipes...
            </div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-lg text-white/30">
              No recipes found
            </div>
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: any }) {
  const imageUrl =
    recipe.product?.image_url || recipe.thumbnail_url

  const masalaName = recipe.product?.name

  const preparationTime =
    Number(recipe.preparation_time) || 0

  const cookingTime = Number(recipe.cooking_time) || 0
  const totalTime = preparationTime + cookingTime

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group block h-full w-full min-w-0"
    >
      <article className="royal-panel flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[3px] transition-colors duration-300 hover:border-gold/30">
        <div className="relative h-56 w-full overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/5">
              <ChefHat
                size={48}
                className="text-white/20"
                aria-hidden="true"
              />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            {recipe.cuisine_or_category && (
              <span className="inline-block rounded-[2px] border border-gold/60 bg-gold/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-black">
                {recipe.cuisine_or_category}
              </span>
            )}

            {recipe.is_vegetarian && (
              <span className="inline-block rounded-[2px] border border-green-500/30 bg-green-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-green-400">
                Vegetarian
              </span>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-grow flex-col p-5 sm:p-6">
          <h2 className="mb-2 break-words font-display text-3xl text-cream transition-colors duration-300 group-hover:text-gold sm:text-4xl">
            {recipe.name}
          </h2>

          {masalaName && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/80">
              Made with: {masalaName}
            </p>
          )}

          <p className="mb-4 line-clamp-2 text-sm text-white/50">
            {recipe.short_description}
          </p>

          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40 sm:text-sm">
            {preparationTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={14} aria-hidden="true" />
                <span>{preparationTime}m prep</span>
              </div>
            )}

            {cookingTime > 0 && (
              <div className="flex items-center gap-2">
                <Clock size={14} aria-hidden="true" />
                <span>{cookingTime}m cook</span>
              </div>
            )}

            {totalTime > 0 && (
              <div className="flex items-center gap-2 text-gold">
                <Clock size={14} aria-hidden="true" />
                <span>{totalTime}m total</span>
              </div>
            )}

            {recipe.servings && (
              <div className="flex items-center gap-2">
                <Users size={14} aria-hidden="true" />
                <span>{recipe.servings} servings</span>
              </div>
            )}

            <span
              className={`rounded px-2 py-0.5 text-xs ${
                recipe.difficulty === 'Easy'
                  ? 'bg-green-500/10 text-green-400'
                  : recipe.difficulty === 'Medium'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-red-500/10 text-red-400'
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold sm:text-xs">
            <span>View Recipe</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </article>
    </Link>
  )
}
