import { getPublicRecipes } from '@/lib/actions'
import RecipesClient from './RecipesClient'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Recipes', description: "Cook with QMS. Discover recipes and the blends behind every dish.", alternates: { canonical: '/recipes' } }

export default async function RecipesPage() {
  const recipes = await getPublicRecipes()
  return <RecipesClient allRecipes={recipes} />
}
