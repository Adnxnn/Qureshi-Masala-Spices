'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import type {
  OrderStatus,
  OrderWithItems,
  Product,
  Recipe,
  PromoCode,
} from '@/types'

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
// PROMO CODES — SUPABASE
// ============================================

type PromoCodeRecord = {
  id: string
  code: string
  discount: number
  type: PromoCode['type']
  is_active: boolean
  usage_limit: number
  used_count: number
  created_at: string
  promo_code_usages?: Array<{
    user_id: string | null
    customer_email: string | null
    customer_phone: string | null
    used_at: string
  }>
}

function normalisePromoCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

function mapPromoCode(record: PromoCodeRecord): PromoCode {
  return {
    id: record.id,
    code: record.code,
    discount: Number(record.discount),
    type: record.type,
    isActive: record.is_active,
    usageLimit: record.usage_limit,
    usedCount: record.used_count,
    usedBy: (record.promo_code_usages ?? []).map((usage) => ({
      userId: usage.user_id ?? undefined,
      customerEmail: usage.customer_email ?? undefined,
      customerPhone: usage.customer_phone ?? undefined,
      usedAt: usage.used_at,
    })),
    createdAt: record.created_at,
  }
}

function validatePromoValues(input: {
  code: string
  discount: number
  type: PromoCode['type']
  usageLimit: number
}) {
  if (!/^[A-Z0-9_-]{3,32}$/.test(input.code)) {
    throw new Error('Promo code must be 3–32 letters, numbers, hyphens or underscores.')
  }

  if (!Number.isFinite(input.discount) || input.discount <= 0) {
    throw new Error('Discount must be greater than zero.')
  }

  if (input.type === 'percentage' && input.discount > 100) {
    throw new Error('Percentage discount cannot be more than 100%.')
  }

  if (!Number.isInteger(input.usageLimit) || input.usageLimit < 1) {
    throw new Error('Usage limit must be at least 1.')
  }
}

export async function getPromoCodes(): Promise<PromoCode[]> {
  const supabase = await requireAdmin()
  const { data, error } = await supabase
    .from('promo_codes')
    .select(
      '*, promo_code_usages(user_id, customer_email, customer_phone, used_at)',
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getPromoCodes]', error)
    throw new Error(`Unable to load promo codes: ${error.message}`)
  }

  return ((data ?? []) as unknown as PromoCodeRecord[]).map(mapPromoCode)
}

export async function addPromoCode(
  promoCode: Omit<
    PromoCode,
    'id' | 'usedCount' | 'createdAt' | 'usedBy' | 'isActive'
  > & {
    isActive?: boolean
  },
): Promise<PromoCode> {
  const supabase = await requireAdmin()
  const code = normalisePromoCode(promoCode.code)
  const discount = Number(promoCode.discount)
  const usageLimit = Number(promoCode.usageLimit)

  validatePromoValues({
    code,
    discount,
    type: promoCode.type,
    usageLimit,
  })

  const { data, error } = await supabase
    .from('promo_codes')
    .insert({
      code,
      discount,
      type: promoCode.type,
      usage_limit: usageLimit,
      is_active: promoCode.isActive ?? true,
      used_count: 0,
    })
    .select('*')
    .single()

  if (error) {
    console.error('[addPromoCode]', error)
    if (error.code === '23505') {
      throw new Error('A promo code with this name already exists.')
    }
    throw new Error(`Unable to create promo code: ${error.message}`)
  }

  revalidatePath('/admin/promo-codes')
  revalidatePath('/order')
  return mapPromoCode(data as unknown as PromoCodeRecord)
}

export async function updatePromoCode(
  id: string,
  updates: Partial<PromoCode>,
): Promise<PromoCode> {
  const supabase = await requireAdmin()
  const { data: current, error: currentError } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('id', id)
    .single()

  if (currentError || !current) {
    throw new Error('Promo code could not be found.')
  }

  const currentRecord = current as unknown as PromoCodeRecord
  const code =
    updates.code === undefined
      ? currentRecord.code
      : normalisePromoCode(updates.code)
  const discount =
    updates.discount === undefined
      ? Number(currentRecord.discount)
      : Number(updates.discount)
  const type = updates.type ?? currentRecord.type
  const usageLimit =
    updates.usageLimit === undefined
      ? currentRecord.usage_limit
      : Number(updates.usageLimit)

  validatePromoValues({ code, discount, type, usageLimit })

  if (usageLimit < currentRecord.used_count) {
    throw new Error(
      `Usage limit cannot be lower than the current usage count (${currentRecord.used_count}).`,
    )
  }

  const { data, error } = await supabase
    .from('promo_codes')
    .update({
      code,
      discount,
      type,
      usage_limit: usageLimit,
      is_active: updates.isActive ?? currentRecord.is_active,
    })
    .eq('id', id)
    .select('*')
    .single()

  if (error) {
    console.error('[updatePromoCode]', error)
    if (error.code === '23505') {
      throw new Error('A promo code with this name already exists.')
    }
    throw new Error(`Unable to update promo code: ${error.message}`)
  }

  revalidatePath('/admin/promo-codes')
  revalidatePath('/order')
  return mapPromoCode(data as unknown as PromoCodeRecord)
}

export async function deletePromoCode(id: string): Promise<void> {
  const supabase = await requireAdmin()
  const { error } = await supabase.from('promo_codes').delete().eq('id', id)

  if (error) {
    console.error('[deletePromoCode]', error)
    throw new Error(`Unable to delete promo code: ${error.message}`)
  }

  revalidatePath('/admin/promo-codes')
  revalidatePath('/order')
}
