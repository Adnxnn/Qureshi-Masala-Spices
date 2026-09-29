import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublicRecipes, getRecipeBySlug } from '@/lib/actions'
import RecipeDetailClient from './RecipeDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const recipe = await getRecipeBySlug(params.slug)
  if (!recipe) return { title: 'Recipe not found' }
  return {
    title: recipe.seo_title || recipe.name,
    description: recipe.seo_description || recipe.short_description,
    alternates: { canonical: `/recipes/${recipe.slug}` },
    openGraph: { title: recipe.name, description: recipe.short_description, images: recipe.thumbnail_url ? [recipe.thumbnail_url] : [] },
  }
}

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const [recipe, allRecipes] = await Promise.all([getRecipeBySlug(params.slug), getPublicRecipes()])
  if (!recipe) notFound()
  const schema = {
    '@context': 'https://schema.org', '@type': 'Recipe', name: recipe.name,
    description: recipe.short_description,
    image: recipe.thumbnail_url ? new URL(recipe.thumbnail_url, 'https://www.qureshismasalaspices.com').href : undefined,
    recipeIngredient: recipe.ingredients?.map((item: { text: string }) => item.text),
    recipeInstructions: recipe.preparation_steps?.map((item: { text: string }) => ({ '@type': 'HowToStep', text: item.text })),
    prepTime: recipe.preparation_time ? `PT${recipe.preparation_time}M` : undefined,
    cookTime: recipe.cooking_time ? `PT${recipe.cooking_time}M` : undefined,
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><RecipeDetailClient recipe={recipe} allRecipes={allRecipes} /></>
}
