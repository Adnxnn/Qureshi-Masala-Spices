import { getProducts } from '@/lib/actions'
import ClientShopPage from './ClientShopPage'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Shop Masalas & Spices',
  description: "Explore QMS spice blends for biryani, kebabs, curries, seafood and everyday cooking. Choose a pack size and order through WhatsApp.",
  alternates: { canonical: '/shop' },
}

export default async function ShopPage() {
  const allProducts = await getProducts()
  return <ClientShopPage initialProducts={allProducts} />
}
