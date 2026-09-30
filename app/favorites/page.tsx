import type { Metadata } from 'next'
import { getProducts } from '@/lib/actions'
import FavoritesClient from './FavoritesClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Your Favorites',
  description: 'Keep your favorite QMS blends together and add the packs you love to your cart.',
  robots: { index: false, follow: true },
}

export default async function FavoritesPage() {
  const products = await getProducts()
  return <FavoritesClient products={products} />
}
