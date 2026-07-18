import type { Product } from '@/types'

export const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

export const formatWeight = (grams: number) =>
  grams >= 1000 ? `${grams / 1000} kg` : `${grams} g`

export const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)

export const getStartingPrice = (product: Product) =>
  Math.min(...product.variants.map((v) => v.price))

export const getMaxPrice = (product: Product) =>
  Math.max(...product.variants.map((v) => v.price))

export type ShopCategory =
  | 'all'
  | 'chicken-masalas'
  | 'mutton-masalas'
  | 'kebab-grill'
  | 'biryani-korma'
  | 'fish-masalas'
  | 'everyday-essentials'

export type CookingStyle =
  | 'fry'
  | 'curry'
  | 'grill'
  | 'barbecue'
  | 'tandoor'
  | 'biryani'
  | 'kebab'
  | 'everyday'

export type ProteinFilter = 'chicken' | 'mutton' | 'fish' | 'veg'

export type SortOption =
  | 'featured'
  | 'best-selling'
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'

export const SHOP_CATEGORIES: { value: ShopCategory; label: string; description: string }[] = [
  { value: 'all', label: 'All Products', description: 'Browse the full Qureshi\'s range' },
  { value: 'chicken-masalas', label: 'Chicken Masalas', description: 'Masalas for chicken dishes' },
  { value: 'mutton-masalas', label: 'Mutton Masalas', description: 'Rich blends for mutton' },
  { value: 'kebab-grill', label: 'Kebab & Grill', description: 'Grill, kebab and barbecue' },
  { value: 'biryani-korma', label: 'Biryani & Korma', description: 'Celebration and curry classics' },
  { value: 'fish-masalas', label: 'Fish Masalas', description: 'Coastal fry and curry blends' },
  { value: 'everyday-essentials', label: 'Everyday Essentials', description: 'Pantry staples for daily cooking' },
]

export const COOKING_STYLES: { value: CookingStyle; label: string }[] = [
  { value: 'fry', label: 'Fry' },
  { value: 'curry', label: 'Curry' },
  { value: 'grill', label: 'Grill' },
  { value: 'barbecue', label: 'Barbecue' },
  { value: 'tandoor', label: 'Tandoor' },
  { value: 'biryani', label: 'Biryani' },
  { value: 'kebab', label: 'Kebab' },
  { value: 'everyday', label: 'Everyday Cooking' },
]

const PRODUCT_SHOP_CATEGORY: Record<string, ShopCategory[]> = {
  '1': ['chicken-masalas', 'kebab-grill'],
  '2': ['chicken-masalas', 'kebab-grill'],
  '3': ['chicken-masalas', 'mutton-masalas'],
  '4': ['mutton-masalas'],
  '5': ['chicken-masalas', 'everyday-essentials'],
  '6': ['biryani-korma', 'everyday-essentials'],
  '7': ['biryani-korma'],
  '8': ['fish-masalas'],
  '9': ['fish-masalas'],
  '10': ['everyday-essentials'],
  '11': ['chicken-masalas', 'kebab-grill'],
  '12': ['chicken-masalas', 'kebab-grill'],
  '13': ['everyday-essentials'],
}

const PRODUCT_COOKING: Record<string, CookingStyle[]> = {
  '1': ['kebab', 'grill'],
  '2': ['kebab', 'grill'],
  '3': ['curry'],
  '4': ['curry'],
  '5': ['curry', 'everyday'],
  '6': ['curry'],
  '7': ['biryani'],
  '8': ['fry'],
  '9': ['curry'],
  '10': ['everyday'],
  '11': ['barbecue', 'grill'],
  '12': ['tandoor', 'grill'],
  '13': ['everyday', 'curry'],
}

const BEST_SELLER_IDS = new Set(['1', '7', '12'])

export function getShopCategories(product: Product): ShopCategory[] {
  return PRODUCT_SHOP_CATEGORY[product.id] ?? ['everyday-essentials']
}

export function getCookingStyles(product: Product): CookingStyle[] {
  return PRODUCT_COOKING[product.id] ?? ['everyday']
}

export function isBestSeller(product: Product): boolean {
  return BEST_SELLER_IDS.has(product.id) || product.badge?.toLowerCase().includes('best') === true
}

export function getProteins(product: Product): ProteinFilter[] {
  const proteins: ProteinFilter[] = []
  const name = product.name.toLowerCase()
  const tags = product.tags.map((t) => t.toLowerCase())

  if (product.category === 'chicken' || name.includes('chicken') || tags.includes('chicken')) {
    proteins.push('chicken')
  }
  if (name.includes('mutton') || tags.includes('mutton')) proteins.push('mutton')
  if (product.category === 'seafood' || name.includes('fish') || tags.includes('fish')) {
    proteins.push('fish')
  }
  if (product.category === 'vegetarian' || tags.includes('veg')) proteins.push('veg')
  return proteins
}

export function getCategoryLabel(category: Product['category']) {
  const map: Record<Product['category'], string> = {
    chicken: 'Chicken',
    seafood: 'Fish',
    vegetarian: 'Vegetarian',
    spice: 'Spice Blend',
  }
  return map[category] ?? 'Masala'
}

export type ProductFilters = {
  category?: ShopCategory
  cooking?: CookingStyle
  protein?: ProteinFilter
  weight?: number
  minPrice?: number
  maxPrice?: number
  bestSeller?: boolean
  query?: string
  sort?: SortOption
}

export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let result = [...products]

  if (filters.category && filters.category !== 'all') {
    result = result.filter((p) => getShopCategories(p).includes(filters.category!))
  }

  if (filters.cooking) {
    result = result.filter((p) => getCookingStyles(p).includes(filters.cooking!))
  }

  if (filters.protein) {
    result = result.filter((p) => getProteins(p).includes(filters.protein!))
  }

  if (filters.weight) {
    result = result.filter((p) =>
      p.variants.some((v) => v.weight_grams === filters.weight)
    )
  }

  if (filters.minPrice !== undefined) {
    result = result.filter((p) => getStartingPrice(p) >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => getStartingPrice(p) <= filters.maxPrice!)
  }

  if (filters.bestSeller) {
    result = result.filter(isBestSeller)
  }

  if (filters.query?.trim()) {
    const q = filters.query.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
  }

  return sortProducts(result, filters.sort ?? 'featured')
}

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]

  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => getStartingPrice(a) - getStartingPrice(b))
    case 'price-desc':
      return sorted.sort((a, b) => getStartingPrice(b) - getStartingPrice(a))
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'best-selling':
      return sorted.sort((a, b) => Number(isBestSeller(b)) - Number(isBestSeller(a)))
    case 'featured':
    default:
      return sorted.sort((a, b) => Number(isBestSeller(b)) - Number(isBestSeller(a)))
  }
}

export function getRelatedProducts(product: Product, all: Product[], limit = 4): Product[] {
  const styles = getCookingStyles(product)
  const categories = getShopCategories(product)

  return all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => {
      const score = (candidate: Product) => {
        let s = 0
        if (candidate.category === product.category) s += 2
        if (getShopCategories(candidate).some((c) => categories.includes(c))) s += 2
        if (getCookingStyles(candidate).some((c) => styles.includes(c))) s += 1
        if (isBestSeller(candidate)) s += 1
        return s
      }
      return score(b) - score(a)
    })
    .slice(0, limit)
}

export function getAvailableWeights(products: Product[]): number[] {
  const weights = new Set<number>()
  products.forEach((p) => p.variants.forEach((v) => weights.add(v.weight_grams)))
  return Array.from(weights).sort((a, b) => a - b)
}

export function parseShopSearchParams(searchParams: URLSearchParams): ProductFilters {
  const category = searchParams.get('category') as ShopCategory | null
  const cooking = searchParams.get('cooking') as CookingStyle | null
  const protein = searchParams.get('protein') as ProteinFilter | null
  const weight = searchParams.get('weight')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sort = searchParams.get('sort') as SortOption | null

  return {
    category: category && category !== 'all' ? category : undefined,
    cooking: cooking ?? undefined,
    protein: protein ?? undefined,
    weight: weight ? Number(weight) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    bestSeller: searchParams.get('bestSeller') === 'true',
    query: searchParams.get('q') ?? undefined,
    sort: sort ?? 'featured',
  }
}

export function buildShopSearchParams(filters: ProductFilters): string {
  const params = new URLSearchParams()
  if (filters.category && filters.category !== 'all') params.set('category', filters.category)
  if (filters.cooking) params.set('cooking', filters.cooking)
  if (filters.protein) params.set('protein', filters.protein)
  if (filters.weight) params.set('weight', String(filters.weight))
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.bestSeller) params.set('bestSeller', 'true')
  if (filters.query) params.set('q', filters.query)
  if (filters.sort && filters.sort !== 'featured') params.set('sort', filters.sort)
  return params.toString()
}
