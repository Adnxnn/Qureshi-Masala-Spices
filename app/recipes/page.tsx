'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, Users, ChefHat, Search } from 'lucide-react'
import { getPublicRecipes } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState<any[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipes() {
      const recipes = await getPublicRecipes()
      setAllRecipes(recipes)
      setFilteredRecipes(recipes)
      setLoading(false)
    }
    loadRecipes()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes(allRecipes)
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase()
      setFilteredRecipes(
        allRecipes.filter(
          (recipe) =>
            recipe.name.toLowerCase().includes(lowerCaseQuery) ||
            recipe.short_description.toLowerCase().includes(lowerCaseQuery) ||
            recipe.cuisine_or_category.toLowerCase().includes(lowerCaseQuery)
        )
      )
    }
  }, [searchQuery, allRecipes])

  // const categories = ['All', ...new Set(allRecipes.map((r: any) => r.cuisine_or_category).filter(Boolean))]

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
            Recipes
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-6">
            Cook Like a Pro
          </h1>
          <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Discover authentic recipes made with Qureshi's Masala & Spices
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-12 max-w-lg mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/40 border border-white/10 text-white pl-12 pr-5 py-3.5 rounded-2xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300 placeholder:text-white/20 text-base backdrop-blur-sm"
          />
        </div>

        {/* Loading / No Recipes Found */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-white/30 text-lg">Loading recipes...</div>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-white/30 text-lg">No recipes found</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeCard({ recipe }: { recipe: any }) {
  const imageUrl = recipe.product?.image_url || recipe.thumbnail_url;
  const masalaName = recipe.product?.name;
  const totalTime = recipe.preparation_time + recipe.cooking_time;

  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block h-full">
      <div className="bg-black/40 border border-white/10 hover:border-gold/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full">
        <div className="relative h-56 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={recipe.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center">
              <ChefHat size={48} className="text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            {recipe.cuisine_or_category && (
              <span className="inline-block px-3 py-1 bg-gold text-black text-[10px] font-bold tracking-[0.25em] uppercase rounded-full mr-2">
                {recipe.cuisine_or_category}
              </span>
            )}
            {recipe.is_vegetarian && (
              <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full border border-green-500/30">
                Vegetarian
              </span>
            )}
            {/* {recipe.is_featured && (
              <span className="ml-2 inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-[10px] font-bold tracking-[0.25em] uppercase rounded-full border border-yellow-500/30">
                Featured
              </span>
            )} */}
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display text-2xl sm:text-3xl uppercase mb-2 group-hover:text-gold transition-colors duration-300 flex-grow">
            {recipe.name}
          </h3>
          {masalaName && (
            <p className="text-gold/80 text-xs font-semibold uppercase tracking-wider mb-2">
              Made with: {masalaName}
            </p>
          )}
          <p className="text-white/50 text-sm mb-4 line-clamp-2">
            {recipe.short_description}
          </p>
          <div className="flex items-center gap-4 text-white/40 text-sm mb-4">
            {recipe.preparation_time && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{recipe.preparation_time}m prep</span>
              </div>
            )}
            {recipe.cooking_time && (
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{recipe.cooking_time}m cook</span>
              </div>
            )}
            {totalTime > 0 && (
              <div className="flex items-center gap-2 text-gold">
                <Clock size={14} />
                <span>{totalTime}m total</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2">
                <Users size={14} />
                <span>{recipe.servings} servings</span>
              </div>
            )}
            <span className={`text-xs px-2 py-0.5 rounded ${
              recipe.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
              recipe.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>{recipe.difficulty}</span>
          </div>
          <div className="flex items-center gap-2 text-gold text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase mt-auto">
            <span>View Recipe</span>
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
