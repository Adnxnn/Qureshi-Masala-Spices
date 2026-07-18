'use server'

import { promises as fs } from 'fs'
import path from 'path'
import type { Product, Recipe, RecipeIngredient, RecipeStep } from '@/types'

// Helper to generate slug from name
const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

// Recipes data file path
const RECIPES_FILE_PATH = path.join(process.cwd(), 'data', 'admin-recipes.json')
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.json')

// Ensure recipes file exists
async function ensureRecipesFile() {
  try {
    await fs.access(RECIPES_FILE_PATH)
  } catch {
    // Initialize with default recipes from lib/recipes.ts
    const { RECIPES } = await import('./recipes')
    const initialRecipes: Recipe[] = RECIPES.map((r, index) => ({
      id: r.id,
      name: r.title,
      slug: r.slug,
      short_description: r.description,
      full_description: r.description,
      ingredients: r.ingredients.map((text, i) => ({ text, order: i } as RecipeIngredient)),
      preparation_steps: r.instructions.map((text, i) => ({ text, order: i } as RecipeStep)),
      cooking_time: parseInt(r.cookTime) || null,
      preparation_time: parseInt(r.prepTime) || null,
      total_time: (parseInt(r.prepTime) || 0) + (parseInt(r.cookTime) || 0) || null,
      servings: parseInt(r.servings) || null,
      difficulty: r.difficulty,
      cuisine_or_category: r.category,
      is_vegetarian: r.category.toLowerCase() === 'vegetarian',
      is_featured: index === 0,
      thumbnail_url: r.image,
      additional_images: [],
      video_url: null,
      external_video_url: null,
      seo_title: r.title,
      seo_description: r.description,
      is_published: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
    await fs.writeFile(RECIPES_FILE_PATH, JSON.stringify(initialRecipes, null, 2), 'utf-8')
  }
}

export async function adminGetRecipes(): Promise<Recipe[]> {
  await ensureRecipesFile()
  const jsonData = await fs.readFile(RECIPES_FILE_PATH, 'utf-8')
  return JSON.parse(jsonData)
}

export async function adminUpsertRecipe(recipe: Partial<Recipe>) {
  await ensureRecipesFile()
  const recipes = await adminGetRecipes()

  if (recipe.id) {
    // Update existing recipe
    const index = recipes.findIndex(r => r.id === recipe.id)
    if (index !== -1) {
      recipes[index] = { 
        ...recipes[index], 
        ...recipe, 
        updated_at: new Date().toISOString(),
        slug: recipe.name ? generateSlug(recipe.name) : recipes[index].slug
      }
    }
  } else {
    // Add new recipe
    const newRecipe: Recipe = {
      id: `recipe-${Date.now()}`,
      name: recipe.name || '',
      slug: recipe.name ? generateSlug(recipe.name) : '',
      short_description: recipe.short_description || '',
      full_description: recipe.full_description || '',
      ingredients: recipe.ingredients || [],
      preparation_steps: recipe.preparation_steps || [],
      cooking_time: recipe.cooking_time ?? null,
      preparation_time: recipe.preparation_time ?? null,
      total_time: recipe.total_time ?? ((recipe.preparation_time ?? 0) + (recipe.cooking_time ?? 0) || null),
      servings: recipe.servings ?? null,
      difficulty: recipe.difficulty || 'Easy',
      cuisine_or_category: recipe.cuisine_or_category || '',
      is_vegetarian: recipe.is_vegetarian ?? false,
      is_featured: recipe.is_featured ?? false,
      thumbnail_url: recipe.thumbnail_url || null,
      additional_images: recipe.additional_images || [],
      video_url: recipe.video_url || null,
      external_video_url: recipe.external_video_url || null,
      seo_title: recipe.seo_title || '',
      seo_description: recipe.seo_description || '',
      is_published: recipe.is_published ?? false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    recipes.push(newRecipe)
  }

  await fs.writeFile(RECIPES_FILE_PATH, JSON.stringify(recipes, null, 2), 'utf-8')
  return recipes
}

export async function adminDeleteRecipe(id: string) {
  await ensureRecipesFile()
  let recipes = await adminGetRecipes()
  recipes = recipes.filter(r => r.id !== id)
  await fs.writeFile(RECIPES_FILE_PATH, JSON.stringify(recipes, null, 2), 'utf-8')
  return recipes
}

export async function adminGetProducts() {
  const jsonData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8')
  const products = JSON.parse(jsonData) as Array<Partial<Product>>
  return products.map((product, index) => ({
    ...product,
    id: String(product.id ?? index + 1),
    slug: product.slug || generateSlug(product.name || ''),
    created_at: product.created_at || new Date(0).toISOString(),
  }))
}

export async function adminGetOrders() {
  const filePath = path.join(process.cwd(), 'data', 'admin-orders.json')
  const jsonData = await fs.readFile(filePath, 'utf-8')
  const orders = JSON.parse(jsonData)
  // Convert created_at strings back to Date objects if needed for client-side display
  return orders.map((order: any) => ({
    ...order,
    created_at: new Date(order.created_at)
  }))
}

export async function adminUpsertProduct(product: any) {
  const jsonData = await fs.readFile(PRODUCTS_FILE_PATH, 'utf-8')
  const products = JSON.parse(jsonData)

  const existingProductIndex = products.findIndex((p: any) => p.id === product.id)

  if (existingProductIndex !== -1) {
    // Update existing product
    products[existingProductIndex] = {
      ...products[existingProductIndex],
      ...product,
      id: String(products[existingProductIndex].id),
      slug: generateSlug(product.name || products[existingProductIndex].name),
      created_at: products[existingProductIndex].created_at || new Date().toISOString(),
    }
  } else {
    // Add new product
    products.push({
      ...product,
      id: String(Date.now()),
      slug: generateSlug(product.name || ''),
      created_at: new Date().toISOString(),
    })
  }

  await fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2), 'utf-8')
  return products
}

export async function adminUpdateOrderStatus(orderId: string, newStatus: string) {
  const filePath = path.join(process.cwd(), 'data', 'admin-orders.json')
  const jsonData = await fs.readFile(filePath, 'utf-8')
  const orders = JSON.parse(jsonData)

  const orderIndex = orders.findIndex((order: any) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    await fs.writeFile(filePath, JSON.stringify(orders, null, 2), 'utf-8')
  }
}

export async function getPromoCodes() {
  const filePath = path.join(process.cwd(), 'data', 'admin-promos.json')
  try {
    const jsonData = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(jsonData)
  } catch (error) {
    return []
  }
}

export async function addPromoCode(promoCode: any) {
  const filePath = path.join(process.cwd(), 'data', 'admin-promos.json')
  const promoCodes = await getPromoCodes()
  const newPromo = { ...promoCode, id: `promo-${Date.now()}`, usedCount: 0, isActive: true }
  promoCodes.push(newPromo)
  await fs.writeFile(filePath, JSON.stringify(promoCodes, null, 2), 'utf-8')
  return newPromo
}

export async function updatePromoCode(id: string, updates: Partial<any>) {
  const filePath = path.join(process.cwd(), 'data', 'admin-promos.json')
  const promoCodes = await getPromoCodes()
  const index = promoCodes.findIndex((p: any) => p.id === id)
  if (index !== -1) {
    promoCodes[index] = { ...promoCodes[index], ...updates }
    await fs.writeFile(filePath, JSON.stringify(promoCodes, null, 2), 'utf-8')
  }
}

export async function deletePromoCode(id: string) {
  const filePath = path.join(process.cwd(), 'data', 'admin-promos.json')
  let promoCodes = await getPromoCodes()
  promoCodes = promoCodes.filter((p: any) => p.id !== id)
  await fs.writeFile(filePath, JSON.stringify(promoCodes, null, 2), 'utf-8')
}
