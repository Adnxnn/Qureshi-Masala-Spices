'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Clock,
  Users,
  Check,
  Loader2,
  X,
} from 'lucide-react'
import {
  adminGetRecipes,
  adminUpsertRecipe,
  adminDeleteRecipe,
} from '@/lib/admin-actions'
import RecipeImageUploader from '@/components/admin/RecipeImageUploader'
import type { Recipe } from '@/types'

const EMPTY_RECIPE: Partial<Recipe> = {
  name: '',
  short_description: '',
  full_description: '',
  ingredients: [],
  preparation_steps: [],
  cooking_time: null,
  preparation_time: null,
  servings: null,
  difficulty: 'Easy',
  cuisine_or_category: '',
  is_vegetarian: false,
  is_featured: false,
  thumbnail_url: null,
  additional_images: [],
  video_url: null,
  external_video_url: null,
  seo_title: '',
  seo_description: '',
  is_published: false,
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] =
    useState<Partial<Recipe>>(EMPTY_RECIPE)
  const [newIngredient, setNewIngredient] = useState('')
  const [newStep, setNewStep] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const fetchRecipes = async () => {
    const fetchedRecipes = await adminGetRecipes()
    setRecipes(fetchedRecipes)
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const resetForm = () => {
    setFormData({
      ...EMPTY_RECIPE,
      ingredients: [],
      preparation_steps: [],
      additional_images: [],
    })
    setNewIngredient('')
    setNewStep('')
    setFormError(null)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  const handleAddIngredient = () => {
    const ingredient = newIngredient.trim()

    if (!ingredient) return

    setFormData((current) => ({
      ...current,
      ingredients: [
        ...(current.ingredients || []),
        {
          text: ingredient,
          order: current.ingredients?.length || 0,
        },
      ],
    }))

    setNewIngredient('')
  }

  const handleRemoveIngredient = (index: number) => {
    setFormData((current) => ({
      ...current,
      ingredients: current.ingredients
        ?.filter((_, ingredientIndex) => ingredientIndex !== index)
        .map((ingredient, ingredientIndex) => ({
          ...ingredient,
          order: ingredientIndex,
        })),
    }))
  }

  const handleAddStep = () => {
    const step = newStep.trim()

    if (!step) return

    setFormData((current) => ({
      ...current,
      preparation_steps: [
        ...(current.preparation_steps || []),
        {
          text: step,
          order: current.preparation_steps?.length || 0,
        },
      ],
    }))

    setNewStep('')
  }

  const handleRemoveStep = (index: number) => {
    setFormData((current) => ({
      ...current,
      preparation_steps: current.preparation_steps
        ?.filter((_, stepIndex) => stepIndex !== index)
        .map((step, stepIndex) => ({
          ...step,
          order: stepIndex,
        })),
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSaving(true)
    setFormError(null)

    try {
      await adminUpsertRecipe(
        editingId
          ? {
              ...formData,
              id: editingId,
            }
          : formData
      )

      await fetchRecipes()
      closeForm()
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'The recipe could not be saved.'
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (recipe: Recipe) => {
    setFormData({
      ...recipe,
      ingredients: recipe.ingredients || [],
      preparation_steps: recipe.preparation_steps || [],
      additional_images: recipe.additional_images || [],
    })

    setEditingId(recipe.id)
    setFormError(null)
    setShowForm(true)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this recipe?'
    )

    if (!confirmed) return

    try {
      await adminDeleteRecipe(id)
      await fetchRecipes()
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'The recipe could not be deleted.'
      )
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold md:hidden">
            Content management
          </p>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white sm:text-4xl">
            Recipes
          </h1>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showForm) {
              closeForm()
            } else {
              resetForm()
              setShowForm(true)
            }
          }}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-11 sm:w-auto"
        >
          <Plus size={14} aria-hidden="true" />
          {showForm ? 'Cancel' : 'Add Recipe'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 scroll-mt-24 rounded-2xl border border-white/10 bg-[#111] p-4 sm:p-6">
          <h2 className="mb-5 text-sm font-semibold tracking-wider text-white">
            {editingId ? 'Edit Recipe' : 'New Recipe'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-7">
            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="recipe-name"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Recipe name *
                  </label>

                  <input
                    id="recipe-name"
                    type="text"
                    value={formData.name || ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="recipe-category"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Cuisine / category
                  </label>

                  <input
                    id="recipe-category"
                    type="text"
                    value={formData.cuisine_or_category || ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        cuisine_or_category: event.target.value,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="recipe-short-description"
                  className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  Short description *
                </label>

                <input
                  id="recipe-short-description"
                  type="text"
                  value={formData.short_description || ''}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      short_description: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="recipe-full-description"
                  className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  Full description
                </label>

                <textarea
                  id="recipe-full-description"
                  rows={4}
                  value={formData.full_description || ''}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      full_description: event.target.value,
                    }))
                  }
                  className="w-full resize-none border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                Cooking Information
              </h3>

              <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 md:grid-cols-4">
                <div>
                  <label
                    htmlFor="preparation-time"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Preparation time
                  </label>

                  <input
                    id="preparation-time"
                    type="number"
                    min="0"
                    value={formData.preparation_time ?? ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        preparation_time: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cooking-time"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Cooking time
                  </label>

                  <input
                    id="cooking-time"
                    type="number"
                    min="0"
                    value={formData.cooking_time ?? ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        cooking_time: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="servings"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Servings
                  </label>

                  <input
                    id="servings"
                    type="number"
                    min="1"
                    value={formData.servings ?? ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        servings: event.target.value
                          ? Number.parseInt(event.target.value, 10)
                          : null,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="difficulty"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    value={formData.difficulty || 'Easy'}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        difficulty: event.target.value as Recipe['difficulty'],
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 sm:flex sm:flex-wrap sm:items-center sm:gap-5">
                <label className="flex min-h-11 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_vegetarian)}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        is_vegetarian: event.target.checked,
                      }))
                    }
                    className="rounded border-white/30 bg-black text-gold"
                  />

                  <span className="text-[10px] uppercase tracking-wider text-white/60">
                    Vegetarian
                  </span>
                </label>

                <label className="flex min-h-11 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_featured)}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        is_featured: event.target.checked,
                      }))
                    }
                    className="rounded border-white/30 bg-black text-gold"
                  />

                  <span className="text-[10px] uppercase tracking-wider text-white/60">
                    Featured
                  </span>
                </label>

                <label className="flex min-h-11 cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.is_published)}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        is_published: event.target.checked,
                      }))
                    }
                    className="rounded border-white/30 bg-black text-gold"
                  />

                  <span className="text-[10px] uppercase tracking-wider text-white/60">
                    Published
                  </span>
                </label>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                Recipe Media
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <RecipeImageUploader
                  label="Recipe thumbnail"
                  description="Main image shown on recipe cards and the recipe page."
                  value={
                    formData.thumbnail_url
                      ? [formData.thumbnail_url]
                      : []
                  }
                  onChange={(urls) =>
                    setFormData((current) => ({
                      ...current,
                      thumbnail_url: urls[0] ?? null,
                    }))
                  }
                  maxFiles={1}
                />

                <RecipeImageUploader
                  label="Additional recipe images"
                  description="Optional gallery images. Add up to six."
                  value={formData.additional_images || []}
                  onChange={(urls) =>
                    setFormData((current) => ({
                      ...current,
                      additional_images: urls,
                    }))
                  }
                  maxFiles={6}
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="video-url"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    Video URL
                  </label>

                  <input
                    id="video-url"
                    type="url"
                    value={formData.video_url || ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        video_url: event.target.value || null,
                      }))
                    }
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="external-video-url"
                    className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                  >
                    External video URL
                  </label>

                  <input
                    id="external-video-url"
                    type="url"
                    value={formData.external_video_url || ''}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        external_video_url: event.target.value || null,
                      }))
                    }
                    placeholder="YouTube, Instagram or another video URL"
                    className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                Ingredients
              </h3>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(event) =>
                    setNewIngredient(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddIngredient()
                    }
                  }}
                  placeholder="Add an ingredient..."
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                />

                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="min-h-12 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20 sm:min-h-11"
                >
                  Add
                </button>
              </div>

              <ul className="space-y-2">
                {(formData.ingredients || []).map(
                  (ingredient, index) => (
                    <li
                      key={`${ingredient.text}-${index}`}
                      className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-black/50 px-3 py-2"
                    >
                      <span className="min-w-0 break-words text-xs leading-5 text-white/80">
                        {ingredient.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        aria-label={`Remove ingredient ${index + 1}`}
                        className="flex h-9 w-9 items-center justify-center text-red-400 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </li>
                  )
                )}
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                Preparation Steps
              </h3>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newStep}
                  onChange={(event) => setNewStep(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddStep()
                    }
                  }}
                  placeholder="Add a preparation step..."
                  className="min-h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-black px-3 py-2 text-white focus:border-gold focus:outline-none sm:min-h-11 sm:text-sm"
                />

                <button
                  type="button"
                  onClick={handleAddStep}
                  className="min-h-12 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white/20 sm:min-h-11"
                >
                  Add
                </button>
              </div>

              <ol className="space-y-2">
                {(formData.preparation_steps || []).map(
                  (step, index) => (
                    <li
                      key={`${step.text}-${index}`}
                      className="flex items-start justify-between gap-2 rounded-xl border border-white/5 bg-black/50 px-3 py-2"
                    >
                      <div className="min-w-0 flex items-start gap-3">
                        <span className="mt-0.5 text-xs font-bold text-gold">
                          {index + 1}.
                        </span>

                        <span className="min-w-0 break-words text-xs leading-5 text-white/80">
                          {step.text}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveStep(index)}
                        aria-label={`Remove preparation step ${index + 1}`}
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-red-400 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </li>
                  )
                )}
              </ol>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider text-gold">
                SEO
              </h3>

              <div>
                <label
                  htmlFor="seo-title"
                  className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  SEO title
                </label>

                <input
                  id="seo-title"
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      seo_title: event.target.value,
                    }))
                  }
                  className="min-h-11 w-full border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="seo-description"
                  className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-white/40"
                >
                  SEO description
                </label>

                <textarea
                  id="seo-description"
                  rows={3}
                  value={formData.seo_description || ''}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      seo_description: event.target.value,
                    }))
                  }
                  className="w-full resize-none border border-white/10 bg-black px-3 py-2 text-xs text-white focus:border-gold focus:outline-none"
                />
              </div>
            </section>

            {formError && (
              <p
                role="alert"
                className="rounded border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
              >
                {formError}
              </p>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gold py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-wait disabled:opacity-70 sm:min-h-11"
              >
                {isSaving && (
                  <Loader2
                    size={14}
                    className="animate-spin"
                    aria-hidden="true"
                  />
                )}

                {isSaving
                  ? 'Saving…'
                  : editingId
                    ? 'Update Recipe'
                    : 'Create Recipe'}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={isSaving}
                className="min-h-12 rounded-xl bg-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20 disabled:opacity-50 sm:min-h-11"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="overflow-hidden rounded-xl border border-white/10 bg-[#111] p-4"
          >
            {recipe.thumbnail_url && (
              <div className="mb-4 h-40 overflow-hidden rounded border border-white/5">
                <img
                  src={recipe.thumbnail_url}
                  alt={recipe.name}
                  width={640}
                  height={360}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="mb-2 flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">
                {recipe.name}
              </h2>

              <div className="flex flex-shrink-0 items-center gap-1">
                {recipe.is_featured && (
                  <span
                    className="text-xs text-yellow-500"
                    aria-label="Featured recipe"
                  >
                    ★
                  </span>
                )}

                {recipe.is_published ? (
                  <span className="flex items-center gap-1 text-xs text-green-400">
                    <Check size={10} aria-hidden="true" />
                    Published
                  </span>
                ) : (
                  <span className="text-xs text-orange-400">Draft</span>
                )}
              </div>
            </div>

            <p className="mb-3 line-clamp-2 text-xs text-white/50">
              {recipe.short_description}
            </p>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-white/40">
              {recipe.preparation_time && (
                <div className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  <span>{recipe.preparation_time}m prep</span>
                </div>
              )}

              {recipe.servings && (
                <div className="flex items-center gap-1">
                  <Users size={12} aria-hidden="true" />
                  <span>{recipe.servings} servings</span>
                </div>
              )}

              <span
                className={`rounded px-2 py-0.5 text-xs ${
                  recipe.difficulty === 'Easy'
                    ? 'bg-green-500/10 text-green-400'
                    : recipe.difficulty === 'Medium'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-red-500/10 text-red-400'
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(recipe)}
                className="flex min-h-11 flex-1 items-center justify-center gap-1 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <Edit2 size={12} aria-hidden="true" />
                Edit
              </button>

              <button
                type="button"
                onClick={() => handleDelete(recipe.id)}
                aria-label={`Delete ${recipe.name}`}
                className="flex h-11 w-11 items-center justify-center bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {recipes.length === 0 && !showForm && (
        <div className="py-20 text-center text-sm text-white/30">
          No recipes found. Select Add Recipe to create your first recipe.
        </div>
      )}
    </div>
  )
}
