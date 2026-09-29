import { getPublicRecipes } from '@/lib/actions'
import RecipesClient from './RecipesClient'

export const dynamic = 'force-dynamic'

export default async function RecipesPage() {
  const recipes = await getPublicRecipes()
  return <RecipesClient allRecipes={recipes} />
}
