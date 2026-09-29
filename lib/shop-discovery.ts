import type { Product } from '@/types'

export const shopFilters = [
  { value: 'all', label: 'All spices' },
  { value: 'chicken', label: 'For chicken' },
  { value: 'seafood', label: 'For seafood' },
  { value: 'vegetarian', label: 'For vegetarian dishes' },
  { value: 'mutton', label: 'For mutton' },
  { value: 'biryani', label: 'Biryani & korma' },
  { value: 'pantry', label: 'Pantry staples' },
] as const

export type ShopFilter = (typeof shopFilters)[number]['value']

export function matchesShopFilter(product: Product, filter: ShopFilter): boolean {
  if (filter === 'all') return true
  const name = product.name.toLowerCase()
  const tags = (product.tags || []).map(tag => tag.toLowerCase())
  if (filter === 'chicken') return product.category === 'chicken' || name.includes('chicken') || tags.includes('chicken')
  if (filter === 'seafood') return product.category === 'seafood' || name.includes('fish') || tags.includes('fish')
  if (filter === 'vegetarian') return product.category === 'vegetarian' || tags.includes('veg') || name.includes('veg/non-veg')
  if (filter === 'mutton') return name.includes('mutton') || tags.includes('mutton')
  if (filter === 'biryani') return /biryani|korma/.test(name)
  return /powder|garam masala|rasam|sambar/.test(name)
}

export function productUseLabel(product: Product): string {
  if (/biryani|korma/i.test(product.name)) return 'Biryani & korma'
  if (/mutton/i.test(product.name) && !/chicken/i.test(product.name)) return 'For mutton'
  if (product.category === 'chicken') return 'For chicken'
  if (product.category === 'seafood') return 'For seafood'
  if (product.category === 'vegetarian') return 'For vegetarian dishes'
  if (/powder|garam masala/i.test(product.name)) return 'Pantry staple'
  return 'Versatile blend'
}
