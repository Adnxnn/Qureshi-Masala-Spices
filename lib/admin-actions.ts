'use server'

import { promises as fs } from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import type {
  OrderStatus,
  OrderWithItems,
  Product,
  Recipe,
  PromoCode,
} from '@/types'

const PROMOS_FILE_PATH = path.join(process.cwd(), 'data', 'admin-promos.json')

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

async function requireAdmin() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('You must be signed in to access the admin panel.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    throw new Error('You are not authorised to perform this action.')
  }

  return supabase
}

// ============================================
// RECIPES — SUPABASE
// ============================================

export async function adminGetRecipes(): Promise<Recipe[]> {
  const supabase = await requireAdmin()
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[adminGetRecipes]', error)
    throw new Error(`Unable to load recipes: ${error.message}`)
  }

  return (data ?? []) as Recipe[]
}

export async function adminUpsertRecipe(recipe: Partial<Recipe>): Promise<Recipe> {
  const supabase = await requireAdmin()

  const name = recipe.name?.trim()
  if (!name) throw new Error('Recipe name is required.')

  const payload = {
    name,
    slug: generateSlug(name),
    short_description: recipe.short_description?.trim() || '',
    full_description: recipe.full_description?.trim() || '',
    ingredients: recipe.ingredients ?? [],
    preparation_steps: recipe.preparation_steps ?? [],
    cooking_time: recipe.cooking_time ?? null,
    preparation_time: recipe.preparation_time ?? null,
    servings: recipe.servings ?? null,
    difficulty: recipe.difficulty ?? 'Easy',
    cuisine_or_category: recipe.cuisine_or_category?.trim() || null,
    is_vegetarian: recipe.is_vegetarian ?? false,
    is_featured: recipe.is_featured ?? false,
    thumbnail_url: recipe.thumbnail_url?.trim() || null,
    additional_images: recipe.additional_images ?? [],
    video_url: recipe.video_url?.trim() || null,
    external_video_url: recipe.external_video_url?.trim() || null,
    seo_title: recipe.seo_title?.trim() || null,
    seo_description: recipe.seo_description?.trim() || null,
    is_published: recipe.is_published ?? false,
  }

  // total_time is deliberately omitted because PostgreSQL generates it.
  const query = recipe.id
    ? supabase.from('recipes').update(payload).eq('id', recipe.id)
    : supabase.from('recipes').insert(payload)

  const { data, error } = await query.select().single()

  if (error) {
    console.error('[adminUpsertRecipe]', error)
    throw new Error(`Unable to save recipe: ${error.message}`)
  }

  revalidatePath('/admin/recipes')
  revalidatePath('/recipes')
  revalidatePath(`/recipes/${data.slug}`)

  return data as Recipe
}

export async function adminDeleteRecipe(id: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('recipes').delete().eq('id', id)

  if (error) {
    console.error('[adminDeleteRecipe]', error)
    throw new Error(`Unable to delete recipe: ${error.message}`)
  }

  revalidatePath('/admin/recipes')
  revalidatePath('/recipes')
}

// ============================================
// ORDERS — SUPABASE
// ============================================

export async function adminGetOrders(search = ''): Promise<OrderWithItems[]> {
  const supabase = await requireAdmin()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  const safeSearch = search.trim().replace(/[,%()]/g, '')
  if (safeSearch) {
    query = query.or(
      `customer_name.ilike.%${safeSearch}%,customer_email.ilike.%${safeSearch}%,customer_phone.ilike.%${safeSearch}%,id.ilike.%${safeSearch}%`,
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('[adminGetOrders]', error)
    throw new Error(`Unable to load orders: ${error.message}`)
  }

  return (data ?? []) as unknown as OrderWithItems[]
}

export async function adminUpdateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<void> {
  const allowedStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'dispatched',
    'delivered',
    'cancelled',
  ]

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error('Invalid order status.')
  }

  const supabase = await requireAdmin()
  const { error } = await supabase
    .from('orders')
    .update({ status: newStatus })
    .eq('id', orderId)

  if (error) {
    console.error('[adminUpdateOrderStatus]', error)
    throw new Error(`Unable to update order status: ${error.message}`)
  }

  revalidatePath('/admin/orders')
  revalidatePath('/account')
}

// ============================================
// PRODUCTS — SUPABASE
// ============================================

export async function adminGetProducts(): Promise<Product[]> {
  const supabase = await requireAdmin()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Unable to load products: ${error.message}`)
  return (data ?? []) as Product[]
}

export async function adminUpsertProduct(product: any): Promise<Product> {
  const supabase = await requireAdmin()
  const name = product.name?.trim()
  if (!name) throw new Error('Product name is required.')

  const payload = {
    name,
    slug: generateSlug(name),
    description: product.description ?? '',
    short_description: product.short_description ?? '',
    variants: product.variants ?? [],
    stock_qty: product.stock_qty ?? 0,
    category: product.category ?? 'spice',
    accent_color: product.accent_color ?? '#E8730A',
    tags: product.tags ?? [],
    badge: product.badge ?? null,
    image_url: product.image_url ?? '',
    is_active: product.is_active ?? true,
  }

  const query = product.id
    ? supabase.from('products').update(payload).eq('id', product.id)
    : supabase.from('products').insert(payload)

  const { data, error } = await query.select().single()
  if (error) throw new Error(`Unable to save product: ${error.message}`)

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  revalidatePath('/')
  return data as Product
}

// ============================================
// PROMO CODES — EXISTING JSON STORAGE
// A Supabase promo_codes table is required before these can persist on Vercel.
// ============================================

export async function getPromoCodes(): Promise<PromoCode[]> {
  try {
    const jsonData = await fs.readFile(PROMOS_FILE_PATH, 'utf-8')
    return JSON.parse(jsonData) as PromoCode[]
  } catch {
    return []
  }
}

export async function addPromoCode(
  promoCode: Omit<PromoCode, 'id' | 'usedCount' | 'createdAt' | 'usedBy' | 'isActive'> & {
    usedBy?: PromoCode['usedBy']
    isActive?: boolean
  },
) {
  const promoCodes = await getPromoCodes()
  const newPromo: PromoCode = {
    ...promoCode,
    id: `promo-${Date.now()}`,
    isActive: promoCode.isActive ?? true,
    usedCount: 0,
    usedBy: promoCode.usedBy ?? [],
    createdAt: new Date().toISOString(),
  }
  promoCodes.push(newPromo)
  await fs.writeFile(PROMOS_FILE_PATH, JSON.stringify(promoCodes, null, 2), 'utf-8')
  return newPromo
}

export async function updatePromoCode(id: string, updates: Partial<PromoCode>) {
  const promoCodes = await getPromoCodes()
  const index = promoCodes.findIndex((promo) => promo.id === id)
  if (index === -1) return
  promoCodes[index] = { ...promoCodes[index], ...updates }
  await fs.writeFile(PROMOS_FILE_PATH, JSON.stringify(promoCodes, null, 2), 'utf-8')
}

export async function deletePromoCode(id: string) {
  const promoCodes = (await getPromoCodes()).filter((promo) => promo.id !== id)
  await fs.writeFile(PROMOS_FILE_PATH, JSON.stringify(promoCodes, null, 2), 'utf-8')
}