import { getProducts } from '@/lib/actions'
import ClientShopPage from './ClientShopPage'

export default async function ShopPage() {
  const allProducts = await getProducts()
  return <ClientShopPage initialProducts={allProducts} />
}
