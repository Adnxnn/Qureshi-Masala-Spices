'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import type { CartItem, User, OrderWithItems, PlaceOrderPayload, Product, ProductVariant, Database, PromoCode } from '@/types'
import { createServerSupabaseClient } from './supabaseServer'
import { calculateOrderTotal } from './utils'

// File paths for promo codes
const PROMO_CODES_FILE = path.join(process.cwd(), 'data', 'promo-codes.json')

async function loadPromoCodes() {
  try {
    const data = await fs.readFile(PROMO_CODES_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function savePromoCodes(promoCodes: PromoCode[]) {
  try {
    await fs.writeFile(PROMO_CODES_FILE, JSON.stringify(promoCodes, null, 2))
  } catch (error) {
    // On Vercel, filesystem is read-only, so we just log and continue
    console.warn('Could not save promo codes (filesystem is read-only)', error)
  }
}

// ============================================
// ADMIN SUPABASE CLIENT (for orders bypassing RLS)
// ============================================
export const createAdminSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is missing')
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Helper function to generate slugs
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// ============================================
// PRODUCTS
// ============================================
export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')
  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

// Admin functions
export async function adminGetProducts() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function adminUpdateProductImage(productId: string, imageUrl: string) {
  const supabase = createServerSupabaseClient()
  await supabase.from('products').update({ image_url: imageUrl }).eq('id', productId)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function adminUpsertProduct(formData: FormData) {
  const id = formData.get('id') as string | null
  const payload: Partial<Product> = {
    name: formData.get('name') as string,
    slug: generateSlug(formData.get('name') as string),
    description: formData.get('description') as string,
    short_description: formData.get('short_description') as string,
    variants: JSON.parse(formData.get('variants') as string || '[]') as ProductVariant[],
    stock_qty: parseInt(formData.get('stock_qty') as string),
    category: formData.get('category') as Product['category'],
    accent_color: formData.get('accent_color') as string,
    tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
    badge: formData.get('badge') as string || null,
    is_active: formData.get('is_active') === 'true',
    image_url: formData.get('image_url') as string || ''
  }

  const supabase = createServerSupabaseClient()
  if (id) {
    await supabase.from('products').update(payload).eq('id', id)
  } else {
    await supabase.from('products').insert(payload)
  }
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function adminDeleteProduct(id: string) {
  const supabase = createServerSupabaseClient()
  await supabase.from('products').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/products')
}

export async function adminUpdateStock(id: string, qty: number) {
  const supabase = createServerSupabaseClient()
  await supabase.from('products').update({ stock_qty: qty }).eq('id', id)
  revalidatePath('/admin/products')
}

export async function adminUpdateProductVariants(id: string, variants: any[]) {
  const supabase = createServerSupabaseClient()
  await supabase.from('products').update({ variants }).eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function updateStockFromForm(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const qty = parseInt(formData.get('qty') as string)
  await adminUpdateStock(id, qty)
}

export async function updateVariantsFromForm(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const variants = JSON.parse(formData.get('variants') as string)
  await adminUpdateProductVariants(id, variants)
}

// ============================================
// USER AUTHENTICATION
// ============================================
export async function getCurrentUser(): Promise<User | null> {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Get user profile from database
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (userProfile) {
    return userProfile
  }

  // Create a profile if none exists
  const { data: newProfile } = await supabase
    .from('users')
    .insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata.full_name || '',
      phone: user.user_metadata.phone || ''
    })
    .select()
    .single()

  return newProfile
}

export async function registerUser(formData: {
  full_name: string
  email: string
  phone: string
  password: string
  address?: string
  city?: string
  pincode?: string
}) {
  const supabase = createServerSupabaseClient()

  // Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        phone: formData.phone
      }
    }
  })

  if (authError) throw new Error(authError.message)

  // Create user profile
  if (authData.user) {
    await supabase.from('users').insert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode
    })
  }

  revalidatePath('/')
  redirect('/')
}

export async function loginUser(formData: { email: string; password: string }) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  redirect('/')
}

export async function logoutUser() {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()

  revalidatePath('/')
  redirect('/')
}

export async function updateUserProfile(formData: {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  pincode?: string
}) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Not logged in')

  const supabase = createServerSupabaseClient()
  await supabase.from('users').update(formData).eq('id', user.id)

  revalidatePath('/account')
}

// ============================================
// ORDERS
// ============================================
export async function placeOrder(
  formData: PlaceOrderPayload,
  promoCode: PromoCode | null = null
): Promise<Database['public']['Tables']['orders']['Row']> {
  const user = await getCurrentUser()

  const subtotal = formData.items.reduce((s, i) => s + i.variant.price * i.quantity, 0)
  const { total } = calculateOrderTotal(subtotal, promoCode)
  const orderInsert: Database['public']['Tables']['orders']['Insert'] = {
    user_id: user?.id || null,
    customer_name: formData.customer_name,
    customer_phone: formData.customer_phone,
    customer_email: formData.customer_email,
    customer_address: formData.customer_address,
    customer_city: formData.customer_city,
    customer_pincode: formData.customer_pincode,
    notes: formData.notes,
    total_amount: total,
    status: 'pending'
  }

  // Use admin client to insert order (bypasses RLS)
  const adminSupabase = createAdminSupabaseClient()

  // Insert order
  const result = await adminSupabase
    .from('orders')
    .insert(orderInsert as any)
    .select()
    .single()
  
  const orderError = result.error
  const order = result.data as Database['public']['Tables']['orders']['Row'] | null

  if (orderError) {
    console.error('Order error:', orderError)
    throw new Error(`Could not place order: ${orderError.message}`)
  }

  if (!order) {
    throw new Error('Could not place order: insert returned no order data')
  }

  // Insert order items
  const orderItems: Database['public']['Tables']['order_items']['Insert'][] = formData.items.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    variant_weight_grams: item.variant.weight_grams,
    quantity: item.quantity,
    unit_price: item.variant.price
  }))

  const { error: itemsError } = await adminSupabase.from('order_items').insert(orderItems as any)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    throw new Error(`Could not add order items: ${itemsError.message}`)
  }

  revalidatePath('/admin/orders')
  revalidatePath('/account')
  return order
}

// Promo code actions
export async function getPromoCodes(): Promise<PromoCode[]> {
  return loadPromoCodes()
}

export async function addPromoCode(promoCodeData: Omit<PromoCode, 'id' | 'createdAt' | 'usedCount' | 'usedBy'>) {
  const promoCodes = await loadPromoCodes()
  const newPromoCode: PromoCode = {
    ...promoCodeData,
    id: Date.now().toString(),
    usedCount: 0,
    usedBy: [],
    createdAt: new Date().toISOString()
  }
  await savePromoCodes([newPromoCode, ...promoCodes])
  revalidatePath('/admin/promo-codes')
}

export async function updatePromoCode(id: string, updates: Partial<PromoCode>) {
  const promoCodes = await loadPromoCodes()
  const updatedPromoCodes = promoCodes.map(pc =>
    pc.id === id ? { ...pc, ...updates } : pc
  )
  await savePromoCodes(updatedPromoCodes)
  revalidatePath('/admin/promo-codes')
}

export async function deletePromoCode(id: string) {
  const promoCodes = await loadPromoCodes()
  await savePromoCodes(promoCodes.filter(pc => pc.id !== id))
  revalidatePath('/admin/promo-codes')
}

export async function validateAndApplyPromoCode(
  code: string,
  user: User | null,
  customerData?: { email: string; phone: string }
): Promise<PromoCode | null> {
  const promoCodes = await loadPromoCodes()
  const promoCode = promoCodes.find(pc => pc.code.toUpperCase() === code.toUpperCase())

  if (!promoCode) return null
  if (!promoCode.isActive) return null
  if (promoCode.usedCount >= promoCode.usageLimit) return null

  // Check if user has already used this promo code
  const hasUserUsed = promoCode.usedBy.some(usage => {
    if (user && usage.userId === user.id) {
      return true
    }
    if (customerData) {
      if (usage.customerEmail === customerData.email || usage.customerPhone === customerData.phone) {
        return true
      }
    }
    return false
  })

  if (hasUserUsed) return null

  return promoCode
}

export async function incrementPromoCodeUsage(
  code: string,
  user: User | null,
  customerData: { email: string; phone: string }
) {
  const promoCodes = await loadPromoCodes()
  const updatedPromoCodes = promoCodes.map(pc => {
    if (pc.code.toUpperCase() === code.toUpperCase()) {
      return {
        ...pc,
        usedCount: pc.usedCount + 1,
        usedBy: [
          ...pc.usedBy,
          {
            userId: user?.id,
            customerEmail: customerData.email,
            customerPhone: customerData.phone,
            usedAt: new Date().toISOString()
          }
        ]
      }
    }
    return pc
  })
  await savePromoCodes(updatedPromoCodes)
}

export async function getUserOrders() {
  const user = await getCurrentUser()
  if (!user) return []

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data as OrderWithItems[]
}

export async function adminGetOrders(search?: string): Promise<OrderWithItems[]> {
  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(
      `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%,id.ilike.%${search}%`
    )
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as OrderWithItems[]
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  const supabase = createServerSupabaseClient()
  await supabase.from('orders').update({ status }).eq('id', orderId)
  revalidatePath('/admin/orders')
}

// ============================================
// RECIPES
// ============================================
export async function getPublicRecipes() {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_products(*, products(*))')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getRecipeBySlug(slug: string) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_products(*, products(*))')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()
  if (error) throw error
  return data
}

export async function getRelatedRecipes(currentRecipeSlug: string) {
  const allRecipes = await getPublicRecipes()
  return allRecipes
    .filter((r: any) => r.slug !== currentRecipeSlug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
}
