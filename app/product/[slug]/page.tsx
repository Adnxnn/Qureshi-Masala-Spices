import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductBySlug, getPublicRecipes } from '@/lib/actions'
import ProductDetailClient from '@/components/site/ProductDetailClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Spice not found' }
  return {
    title: product.name,
    description: `${product.description}. Explore pack sizes and order QMS ${product.name} online.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { title: product.name, description: product.description, images: product.image_url ? [product.image_url] : [] },
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const recipes = await getPublicRecipes().catch(() => [])
  const relatedRecipes = recipes.filter((recipe: any) => recipe.recipe_products?.some((item: any) => item.product_id === product.id || item.products?.id === product.id)).slice(0, 3).map((recipe: any) => ({ name: recipe.name as string, slug: recipe.slug as string, image: recipe.thumbnail_url as string | null, time: recipe.total_time as number | null }))
  const offer = product.variants[0]
  const schema = {
    '@context': 'https://schema.org', '@type': 'Product', name: product.name,
    description: product.description,
    image: product.image_url ? new URL(product.image_url, 'https://www.qureshismasalaspices.com').href : undefined,
    brand: { '@type': 'Brand', name: "QMS" },
    offers: offer ? { '@type': 'Offer', priceCurrency: 'INR', price: offer.price, availability: product.is_active && product.stock_qty > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: `https://www.qureshismasalaspices.com/product/${product.slug}` } : undefined,
  }

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><ProductDetailClient product={product} relatedRecipes={relatedRecipes} /></>
}
