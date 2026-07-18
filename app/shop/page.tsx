import { getProducts } from '@/lib/actions'
import ClientShopPage from './ClientShopPage'

export const dynamic = 'force-dynamic'

export default async function ShopPage() {
  const allProducts = await getProducts()
  return <ClientShopPage initialProducts={allProducts} />
}
