'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import type { CartItem, User, OrderWithItems, PlaceOrderPayload, Product, ProductVariant, Database, PromoCode } from '@/types'
import { createServerSupabaseClient } from './supabaseServer'
import { calculateOrderTotal } from './utils'
import { sendNewOrderWhatsAppAlert } from './whatsapp-server'
import { sendOrderEmails } from './order-emails'

// ============================================
// ADMIN SUPABASE CLIENT (for orders bypassing RLS)
// ============================================
const createAdminSupabaseClient = () => {

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

type PromoRedemptionRecord = PromoCodeRecord & {
  usage_id: string
}

function normalisePromoCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '')
}

function normaliseEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalisePhone(phone: string) {
  return phone.replace(/\D/g, '')
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

async function redeemPromoCode(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  code: string,
  user: User | null,
  customerData: { email: string; phone: string },
) {
  const { data, error } = await (supabase as any).rpc('redeem_promo_code', {
    p_code: normalisePromoCode(code),
    p_user_id: user?.id ?? null,
    p_customer_email: normaliseEmail(customerData.email),
    p_customer_phone: normalisePhone(customerData.phone),
  })

  if (error) {
    console.error('[redeemPromoCode]', error)
    throw new Error(`Unable to redeem promo code: ${error.message}`)
  }

  const record = (Array.isArray(data) ? data[0] : data) as
    | PromoRedemptionRecord
    | null

  if (!record) return null

  return {
    usageId: record.usage_id,
    promoCode: mapPromoCode(record),
  }
}

async function releasePromoCodeRedemption(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  usageId: string | null,
) {
  if (!usageId) return

  const { error } = await (supabase as any).rpc(
    'release_promo_code_redemption',
    { p_usage_id: usageId },
  )

  if (error) {
    console.error('[releasePromoCodeRedemption]', error)
  }
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
export type AuthActionResult =
  | { success: true; requiresEmailConfirmation?: boolean }
  | { success: false; error: string }

type ProfileDetails = {
  full_name?: string
  phone?: string
  address?: string
  city?: string
  pincode?: string
}

function authErrorMessage(message: string) {
  const normalisedMessage = message.toLowerCase()

  if (normalisedMessage.includes('invalid login credentials')) {
    return 'The email or password is incorrect.'
  }

  if (normalisedMessage.includes('email not confirmed')) {
    return 'Please confirm your email before signing in.'
  }

  if (normalisedMessage.includes('already registered')) {
    return 'An account with this email already exists. Sign in instead.'
  }

  return 'We could not complete the sign-in request. Please try again.'
}

async function ensureUserProfile(
  authUser: {
    id: string
    email?: string | null
    user_metadata?: Record<string, unknown>
  },
  details: ProfileDetails = {},
) {
  const adminSupabase = createAdminSupabaseClient()
  const metadata = authUser.user_metadata ?? {}
  const email = normaliseEmail(authUser.email ?? '')
  const fallbackName = email.split('@')[0] || 'Customer'

  const { data: existingProfile, error: existingProfileError } = await (
    adminSupabase as any
  )
    .from('users')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle()

  if (existingProfileError) {
    console.error('[ensureUserProfile] lookup failed', existingProfileError)
    return null
  }

  if (existingProfile) {
    return existingProfile as User
  }

  const { data, error } = await (adminSupabase as any)
    .from('users')
    .insert({
      id: authUser.id,
      email,
      full_name:
        details.full_name?.trim() ||
        (typeof metadata.full_name === 'string'
          ? metadata.full_name.trim()
          : '') ||
        fallbackName,
      phone:
        details.phone?.trim() ||
        (typeof metadata.phone === 'string' ? metadata.phone.trim() : ''),
      address: details.address?.trim() || null,
      city: details.city?.trim() || null,
      pincode: details.pincode?.trim() || null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('[ensureUserProfile]', error)
    return null
  }

  return data as User
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  try {
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError) {
      console.warn('Error fetching user profile:', profileError)
      return null
    }

    if (userProfile) {
      return userProfile
    }

    // Repair older auth accounts that were created before their public profile
    // row. This runs with the server-only service role and never exposes admin
    // credentials to the browser.
    return ensureUserProfile(user)
  } catch (err) {
    console.error('Unexpected error in getCurrentUser:', err)
    return null
  }
}

export async function registerUser(formData: {
  full_name: string
  email: string
  phone: string
  password: string
  address?: string
  city?: string
  pincode?: string
}): Promise<AuthActionResult> {
  const supabase = createServerSupabaseClient()
  const email = normaliseEmail(formData.email)

  if (!formData.full_name.trim() || !email || !formData.phone.trim()) {
    return { success: false, error: 'Name, email and phone number are required.' }
  }

  if (formData.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
      }
    }
  })

  if (authError) {
    return { success: false, error: authErrorMessage(authError.message) }
  }

  if (!authData.user || authData.user.identities?.length === 0) {
    return {
      success: false,
      error: 'An account with this email already exists. Sign in instead.',
    }
  }

  const profile = await ensureUserProfile(authData.user, formData)

  if (!profile) {
    return {
      success: false,
      error: 'Your account was created, but the profile could not be prepared. Please sign in and try again.',
    }
  }

  revalidatePath('/')

  return {
    success: true,
    requiresEmailConfirmation: !authData.session,
  }
}

export async function loginUser(formData: {
  email: string
  password: string
}): Promise<AuthActionResult> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: normaliseEmail(formData.email),
    password: formData.password
  })

  if (error || !data.user) {
    return {
      success: false,
      error: authErrorMessage(error?.message ?? 'Unable to sign in'),
    }
  }

  const profile = await ensureUserProfile(data.user)
  if (!profile) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'We could not load your account profile. Please try again.',
    }
  }

  revalidatePath('/')
  revalidatePath('/account')
  return { success: true }
}

export async function adminLoginUser(formData: {
  email: string
  password: string
}): Promise<AuthActionResult> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normaliseEmail(formData.email),
    password: formData.password,
  })

  if (error || !data.user) {
    return {
      success: false,
      error: authErrorMessage(error?.message ?? 'Unable to sign in'),
    }
  }

  const profile = await ensureUserProfile(data.user)

  if (!profile?.is_admin) {
    await supabase.auth.signOut()
    return {
      success: false,
      error: 'This account does not have administrator access.',
    }
  }

  revalidatePath('/admin')
  return { success: true }
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
  try {
    const user = await getCurrentUser()
    if (!user) {
      console.warn('Cannot update profile: user not logged in')
      return { success: false, error: 'Please sign in again to update your profile.' }
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from('users').update(formData).eq('id', user.id)
    if (error) {
      console.warn('Error updating user profile:', error)
      return { success: false, error: 'We could not save your details. Please try again.' }
    }

    revalidatePath('/account')
    return { success: true }
  } catch (err) {
    console.error('Unexpected error in updateUserProfile:', err)
    return { success: false, error: 'We could not save your details. Please try again.' }
  }
}

// ============================================
// ORDERS
// ============================================
export type PlaceOrderResult =
  | { success: true; order: Database['public']['Tables']['orders']['Row'] }
  | { success: false; error: string }

// Generic, customer-safe message. Next.js redacts the .message of any error
// *thrown* out of a Server Action in production builds (you only get a
// "digest" to correlate with server logs), so to actually show the customer
// something useful we catch everything below and return it as a normal
// value instead of throwing. Full technical detail always goes to the
// server console via console.error so it's still visible in deployment logs.
const ORDER_FAILURE_MESSAGE =
  'We could not place your order right now. Please try again in a moment, or message us on WhatsApp and we will sort it out directly.'
const PROMO_FAILURE_MESSAGE =
  'This promo code is no longer available, has reached its usage limit, or has already been used with these customer details.'

export async function placeOrder(
  formData: PlaceOrderPayload,
  promoCode: PromoCode | null = null
): Promise<PlaceOrderResult> {
  let redeemedUsageId: string | null = null
  let adminSupabase: ReturnType<typeof createAdminSupabaseClient> | null = null

  try {
    const user = await getCurrentUser()
    adminSupabase = createAdminSupabaseClient()

    let verifiedPromoCode: PromoCode | null = null

    if (promoCode?.code) {
      const redemption = await redeemPromoCode(
        adminSupabase,
        promoCode.code,
        user,
        {
          email: formData.customer_email,
          phone: formData.customer_phone,
        },
      )

      if (!redemption) {
        return { success: false, error: PROMO_FAILURE_MESSAGE }
      }

      redeemedUsageId = redemption.usageId
      verifiedPromoCode = redemption.promoCode
    }

    const subtotal = formData.items.reduce((s, i) => s + i.variant.price * i.quantity, 0)
    const { total } = calculateOrderTotal(subtotal, verifiedPromoCode)

    // place_order is a single Postgres transaction: it inserts the order,
    // inserts the order items, and decrements product stock_qty atomically.
    // If stock is insufficient for any item, the whole thing rolls back.
    const rpcItems = formData.items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.name,
      variant_weight_grams: item.variant.weight_grams,
      quantity: item.quantity,
      unit_price: item.variant.price
    }))

    const { data: order, error: orderError } = await (adminSupabase as any)
      .rpc('place_order', {
        p_user_id: user?.id || null,
        p_customer_name: formData.customer_name,
        p_customer_phone: formData.customer_phone,
        p_customer_email: formData.customer_email,
        p_customer_address: formData.customer_address,
        p_customer_city: formData.customer_city,
        p_customer_pincode: formData.customer_pincode,
        p_notes: formData.notes ?? null,
        p_total_amount: total,
        p_items: rpcItems
      })
      .single()

    if (orderError || !order) {
      console.error('[placeOrder] place_order rpc failed:', JSON.stringify(orderError, null, 2))
      await releasePromoCodeRedemption(adminSupabase, redeemedUsageId)
      redeemedUsageId = null

      const message = orderError?.message?.includes('INSUFFICIENT_STOCK')
        ? 'One or more items in your cart just sold out. Please update your cart and try again.'
        : ORDER_FAILURE_MESSAGE

      return { success: false, error: message }
    }

    // The order is already safely stored. A notification failure must never
    // fail checkout or create a duplicate order.
    const notificationResults = await Promise.allSettled([
      sendNewOrderWhatsAppAlert({ order, formData }),
      sendOrderEmails({ order, formData }),
    ])

    for (const result of notificationResults) {
      if (result.status === 'rejected') {
        console.error('[placeOrder] Post-order notification failed:', result.reason)
      }
    }
    revalidatePath('/admin/orders')
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/admin/promo-codes')
    revalidatePath('/account')
    return { success: true, order }
  } catch (err) {
    if (adminSupabase && redeemedUsageId) {
      await releasePromoCodeRedemption(adminSupabase, redeemedUsageId)
    }
    console.error('[placeOrder] unexpected failure:', err)
    return { success: false, error: ORDER_FAILURE_MESSAGE }
  }
}

// Promo code validation is server-side so admin changes apply to every visitor.
export async function validateAndApplyPromoCode(
  code: string,
): Promise<PromoCode | null> {
  const normalisedCode = normalisePromoCode(code)
  if (!normalisedCode) return null

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await (supabase as any).rpc(
      'validate_promo_code',
      { p_code: normalisedCode },
    )

    if (error) {
      console.error('[validateAndApplyPromoCode]', error)
      return null
    }

    const record = (Array.isArray(data) ? data[0] : data) as
      | PromoCodeRecord
      | null

    if (!record) return null

    const promoCode = mapPromoCode({
      ...record,
      promo_code_usages: [],
    })

    if (!promoCode.isActive || promoCode.usedCount >= promoCode.usageLimit) {
      return null
    }

    return promoCode
  } catch (error) {
    console.error('[validateAndApplyPromoCode] unexpected failure:', error)
    return null
  }
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
