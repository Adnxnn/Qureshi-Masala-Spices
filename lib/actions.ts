'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { promises as fs } from 'fs'
import path from 'path'
import type { CartItem, User, OrderWithItems, PlaceOrderPayload, Product, ProductVariant, Database, PromoCode } from '@/types'
import { createServerSupabaseClient } from './supabaseServer'
import { calculateOrderTotal } from './utils'

// File paths
const PROMO_CODES_FILE = path.join(process.cwd(), 'data', 'promo-codes.json')

// Helper to load promo codes
async function loadPromoCodes(): Promise<PromoCode[]> {
  try {
    const data = await fs.readFile(PROMO_CODES_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Helper to save promo codes
async function savePromoCodes(promoCodes: PromoCode[]) {
  await fs.writeFile(PROMO_CODES_FILE, JSON.stringify(promoCodes, null, 2))
}

// Helper function to get next order ID
const getNextOrderId = async () => {
  const orderIdPath = path.join(process.cwd(), '.order-counter.json')
  try {
    const data = await fs.readFile(orderIdPath, 'utf8')
    const current = JSON.parse(data).counter || 1
    await fs.writeFile(orderIdPath, JSON.stringify({ counter: current + 1 }))
    return current
  } catch {
    await fs.writeFile(orderIdPath, JSON.stringify({ counter: 2 }))
    return 1
  }
}

// Helper function to generate slug
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// File paths
const PRODUCTS_FILE = path.join(process.cwd(), 'data', 'products.json')

// Helper to load products
async function loadProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8')
    const products = JSON.parse(data) as Array<Partial<Product>>
    return products.map((product, index) => ({
      ...product,
      id: String(product.id ?? index + 1),
      slug: product.slug || generateSlug(product.name || ''),
      created_at: product.created_at || new Date(0).toISOString(),
    })) as Product[]
  } catch {
    // Return default products if file doesn't exist
    return []
  }
}

// Helper to save products
async function saveProducts(products: Product[]) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2))
}

// Mock order counter for sequential IDs
let orderCounter = 1

// ── UTILITIES ──────────────────────────────────────────────

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return url && key && !url.includes('YOUR_PROJECT_ID') && !key.includes('your_anon_key')
}

// ── PRODUCTS ──────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    return products.filter(p => p.is_active)
  }

  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    if (error) throw error
    return data as Product[]
  } catch (e) {
    console.error('Supabase error, falling back to local data', e)
    const products = await loadProducts()
    return products.filter(p => p.is_active)
  }
}

export async function getProductBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    return products.find(p => p.slug === slug) || null
  }

  try {
    const supabase = createServerSupabaseClient()
    // @ts-ignore
    const { data, error } = await (supabase as any)
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) throw error
    return data
  } catch (e) {
    console.error('Supabase error, falling back to local data', e)
    const products = await loadProducts()
    return products.find(p => p.slug === slug) || null
  }
}

// Admin — get ALL products including inactive
export async function adminGetProducts() {
  if (!isSupabaseConfigured()) {
    return loadProducts()
  }
  const supabase = createServerSupabaseClient()
  // @ts-ignore
  const { data, error } = await (supabase as any)
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

// Update product image
export async function adminUpdateProductImage(productId: string, imageUrl: string) {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    const updatedProducts = products.map(p => 
      p.id === productId ? { ...p, image_url: imageUrl } : p
    )
    await saveProducts(updatedProducts)
    revalidatePath('/admin/products')
    revalidatePath('/')
    return
  }
  
  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any)
    .from('products')
    .update({ image_url: imageUrl })
    .eq('id', productId)
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
    image_url: formData.get('image_url') as string || '',
  }

  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    if (id) {
      const updatedProducts = products.map(p => p.id === id ? { ...p, ...payload } as Product : p)
      await saveProducts(updatedProducts)
    } else {
      const newProduct: Product = {
        ...payload,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      } as Product
      await saveProducts([newProduct, ...products])
    }
    revalidatePath('/admin/products')
    revalidatePath('/')
    return
  }

  const supabase = createServerSupabaseClient()
  if (id) {
    // @ts-ignore
    await (supabase as any).from('products').update(payload).eq('id', id)
  } else {
    // @ts-ignore
    await (supabase as any).from('products').insert(payload)
  }
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function adminDeleteProduct(id: string) {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    const updatedProducts = products.map(p => p.id === id ? { ...p, is_active: false } : p)
    await saveProducts(updatedProducts)
    revalidatePath('/admin/products')
    return
  }

  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any).from('products').update({ is_active: false }).eq('id', id)
  revalidatePath('/admin/products')
}

export async function adminUpdateStock(id: string, qty: number) {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    const updatedProducts = products.map(p => p.id === id ? { ...p, stock_qty: qty } : p)
    await saveProducts(updatedProducts)
    revalidatePath('/admin/products')
    return
  }

  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any).from('products').update({ stock_qty: qty }).eq('id', id)
  revalidatePath('/admin/products')
}

export async function adminUpdateProductVariants(id: string, variants: any[]) {
  if (!isSupabaseConfigured()) {
    const products = await loadProducts()
    const updatedProducts = products.map(p => p.id === id ? { ...p, variants } : p)
    await saveProducts(updatedProducts)
    revalidatePath('/admin/products')
    revalidatePath('/')
    return
  }
  
  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any).from('products').update({ variants }).eq('id', id)
  revalidatePath('/admin/products')
  revalidatePath('/')
}

// Server actions for form submissions
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

// ── USER AUTHENTICATION ───────────────────────────────────

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

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

  // If no profile exists, create one
  const { data: newProfile } = await (supabase as any)
    .from('users')
    .insert({
      id: user.id,
      email: user.email!,
      full_name: user.user_metadata.full_name || '',
      phone: user.user_metadata.phone || '',
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
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const supabase = createServerSupabaseClient()
  
  // Sign up user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        phone: formData.phone,
      }
    }
  })

  if (authError) throw new Error(authError.message)

  // Create user profile
  if (authData.user) {
    // @ts-ignore
    await (supabase as any).from('users').insert({
      id: authData.user.id,
      email: formData.email,
      full_name: formData.full_name,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
    })
  }

  revalidatePath('/')
  redirect('/')
}

export async function loginUser(formData: {
  email: string
  password: string
}) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured')
  }

  const supabase = createServerSupabaseClient()
  
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  redirect('/')
}

export async function logoutUser() {
  if (!isSupabaseConfigured()) {
    redirect('/')
    return
  }

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

  if (!isSupabaseConfigured()) {
    return
  }

  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any)
    .from('users')
    .update(formData)
    .eq('id', user.id)

  revalidatePath('/account')
}

// ── ORDERS ──────────────────────────────────────────────

export async function placeOrder(formData: PlaceOrderPayload, promoCode: PromoCode | null = null) {
  const user = await getCurrentUser()
  
  const subtotal = formData.items.reduce((s, i) => s + i.variant.price * i.quantity, 0)
  const { total } = calculateOrderTotal(subtotal, promoCode)

  if (!isSupabaseConfigured()) {
    // Mock order for local testing
    const orderId = await getNextOrderId()
    const mockOrder = {
      id: String(orderId),
      customer_name: formData.customer_name,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      total_amount: total
    }
    return mockOrder
  }

  const supabase = createServerSupabaseClient()

  // @ts-ignore
  const { data: order, error: orderError } = await (supabase as any)
    .from('orders')
    .insert({
      user_id: user?.id || null,
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      customer_email: formData.customer_email,
      customer_address: formData.customer_address,
      customer_city: formData.customer_city,
      customer_pincode: formData.customer_pincode,
      notes: formData.notes,
      total_amount: total,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) throw new Error(orderError.message)

  const orderItems = formData.items.map(i => ({
    order_id: order.id,
    product_id: i.product.id,
    product_name: i.product.name,
    variant_weight_grams: i.variant.weight_grams,
    quantity: i.quantity,
    unit_price: i.variant.price,
    subtotal: i.variant.price * i.quantity,
  }))

  // @ts-ignore
  const { error: itemsError } = await (supabase as any).from('order_items').insert(orderItems)
  if (itemsError) throw new Error(itemsError.message)

  revalidatePath('/admin/orders')
  revalidatePath('/account')
  return order
}

export async function getUserOrders() {
  const user = await getCurrentUser()
  if (!user) return []

  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createServerSupabaseClient()
  // @ts-ignore
  const { data, error } = await (supabase as any)
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

export async function adminGetOrders(search?: string): Promise<OrderWithItems[]> {
  if (!isSupabaseConfigured()) {
    return []
  }

  const supabase = createServerSupabaseClient()
  // @ts-ignore
  let query = (supabase as any)
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%,id.ilike.%${search}%`)
  }

  // @ts-ignore
  const { data, error } = await query
  if (error) throw new Error(error.message)
  return data as OrderWithItems[]
}

export async function adminUpdateOrderStatus(orderId: string, status: string) {
  if (!isSupabaseConfigured()) {
    return
  }
  const supabase = createServerSupabaseClient()
  // @ts-ignore
  await (supabase as any).from('orders').update({ status }).eq('id', orderId)
  revalidatePath('/admin/orders')
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

// ── RECIPES ──────────────────────────────────────────────

const RECIPES_FILE = path.join(process.cwd(), 'data', 'admin-recipes.json')

async function loadRecipes() {
  try {
    const data = await fs.readFile(RECIPES_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function getPublicRecipes() {
  if (!isSupabaseConfigured()) {
    const recipes = await loadRecipes();
    const products = await loadProducts();
    return recipes
      .filter((r: any) => r.is_published)
      .map((recipe: any) => {
        const product = products.find((p) => p.id === recipe.product_id);
        // Add order to ingredients if not present
        const ingredients = recipe.ingredients?.map((ing: any, idx: number) => ({
          ...ing,
          order: ing.order ?? idx + 1
        }));
        // Add order to preparation_steps if not present
        const preparation_steps = recipe.preparation_steps?.map((step: any, idx: number) => ({
          ...step,
          order: step.order ?? idx + 1
        }));
        return { 
          ...recipe, 
          product,
          ingredients,
          preparation_steps
        };
      });
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*, recipe_products(*, products(*))')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Supabase error, falling back to local data', e);
    const recipes = await loadRecipes();
    const products = await loadProducts();
    return recipes
      .filter((r: any) => r.is_published)
      .map((recipe: any) => {
        const product = products.find((p) => p.id === recipe.product_id);
        // Add order to ingredients if not present
        const ingredients = recipe.ingredients?.map((ing: any, idx: number) => ({
          ...ing,
          order: ing.order ?? idx + 1
        }));
        // Add order to preparation_steps if not present
        const preparation_steps = recipe.preparation_steps?.map((step: any, idx: number) => ({
          ...step,
          order: step.order ?? idx + 1
        }));
        return { 
          ...recipe, 
          product,
          ingredients,
          preparation_steps
        };
      });
  }
}

export async function getRecipeBySlug(slug: string) {
  if (!isSupabaseConfigured()) {
    const recipes = await loadRecipes();
    const products = await loadProducts();
    const recipe = recipes.find((r: any) => r.slug === slug);
    if (!recipe) return null;

    const relatedProduct = products.find(p => p.id === recipe.product_id);
    // Add order to ingredients if not present
    const ingredients = recipe.ingredients?.map((ing: any, idx: number) => ({
      ...ing,
      order: ing.order ?? idx + 1
    }));
    // Add order to preparation_steps if not present
    const preparation_steps = recipe.preparation_steps?.map((step: any, idx: number) => ({
      ...step,
      order: step.order ?? idx + 1
    }));
    return { 
      ...recipe, 
      ingredients,
      preparation_steps,
      recipe_products: relatedProduct ? [
        { 
          recipe_id: recipe.id, 
          product_id: relatedProduct.id, 
          products: relatedProduct 
        }
      ] : []
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('recipes')
      .select('*, recipe_products(*, products(*))')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    if (error) throw error;
    return data;
  } catch (e) {
    console.error('Supabase error, falling back to local data', e);
    const recipes = await loadRecipes();
    const products = await loadProducts();
    const recipe = recipes.find((r: any) => r.slug === slug);
    if (!recipe) return null;

    const relatedProduct = products.find(p => p.id === recipe.product_id);
    // Add order to ingredients if not present
    const ingredients = recipe.ingredients?.map((ing: any, idx: number) => ({
      ...ing,
      order: ing.order ?? idx + 1
    }));
    // Add order to preparation_steps if not present
    const preparation_steps = recipe.preparation_steps?.map((step: any, idx: number) => ({
      ...step,
      order: step.order ?? idx + 1
    }));
    return { 
      ...recipe, 
      ingredients,
      preparation_steps,
      recipe_products: relatedProduct ? [
        { 
          recipe_id: recipe.id, 
          product_id: relatedProduct.id, 
          products: relatedProduct 
        }
      ] : []
    };
  }
}

export async function getRelatedRecipes(currentRecipeSlug: string) {
  const allRecipes = await getPublicRecipes();
  // Simple logic: return 3 other random recipes, excluding the current one.
  return allRecipes
    .filter((r: any) => r.slug !== currentRecipeSlug)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
}
