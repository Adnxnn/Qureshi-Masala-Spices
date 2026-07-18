'use client'
import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Eye, Clock, Users, ChefHat, Check, X } from 'lucide-react'
import { adminGetRecipes, adminUpsertRecipe, adminDeleteRecipe } from '@/lib/admin-actions'
import type { Recipe } from '@/types'

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Recipe>>({
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
  })
  const [newIngredient, setNewIngredient] = useState('')
  const [newStep, setNewStep] = useState('')

  useEffect(() => {
    const fetchRecipes = async () => {
      const fetchedRecipes = await adminGetRecipes()
      setRecipes(fetchedRecipes)
    }
    fetchRecipes()
  }, [])

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setFormData(prev => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), { text: newIngredient, order: (prev.ingredients?.length || 0) }]
      }))
      setNewIngredient('')
    }
  }

  const handleRemoveIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index).map((ing, i) => ({ ...ing, order: i }))
    }))
  }

  const handleAddStep = () => {
    if (newStep.trim()) {
      setFormData(prev => ({
        ...prev,
        preparation_steps: [...(prev.preparation_steps || []), { text: newStep, order: (prev.preparation_steps?.length || 0) }]
      }))
      setNewStep('')
    }
  }

  const handleRemoveStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      preparation_steps: prev.preparation_steps?.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i }))
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await adminUpsertRecipe(editingId ? { ...formData, id: editingId } : formData)
    const updatedRecipes = await adminGetRecipes()
    setRecipes(updatedRecipes)
    setShowForm(false)
    setEditingId(null)
    resetForm()
  }

  const handleEdit = (recipe: Recipe) => {
    setFormData(recipe)
    setEditingId(recipe.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      await adminDeleteRecipe(id)
      const updatedRecipes = await adminGetRecipes()
      setRecipes(updatedRecipes)
    }
  }

  const resetForm = () => {
    setFormData({
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
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase text-white tracking-wider">Recipes</h1>
        <button
          onClick={() => {
            if (showForm) {
              setShowForm(false)
              setEditingId(null)
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="bg-gold text-black px-5 py-2.5 text-xs font-bold tracking-wider uppercase cursor-pointer hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          {showForm ? 'Cancel' : 'Add Recipe'}
        </button>
      </div>

      {showForm && (
        <div className="bg-[#111] border border-white/10 p-6 rounded mb-8">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wider">
            {editingId ? 'Edit Recipe' : 'New Recipe'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Recipe Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Cuisine / Category</label>
                  <input
                    type="text"
                    value={formData.cuisine_or_category || ''}
                    onChange={(e) => setFormData({ ...formData, cuisine_or_category: e.target.value })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Short Description *</label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={formData.full_description || ''}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Cooking Information */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">Cooking Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Preparation Time (min)</label>
                  <input
                    type="number"
                    value={formData.preparation_time || ''}
                    onChange={(e) => setFormData({ ...formData, preparation_time: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Cooking Time (min)</label>
                  <input
                    type="number"
                    value={formData.cooking_time || ''}
                    onChange={(e) => setFormData({ ...formData, cooking_time: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Servings</label>
                  <input
                    type="number"
                    value={formData.servings || ''}
                    onChange={(e) => setFormData({ ...formData, servings: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_vegetarian}
                    onChange={(e) => setFormData({ ...formData, is_vegetarian: e.target.checked })}
                    className="rounded border-white/30 bg-black text-gold"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-white/30 bg-black text-gold"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="rounded border-white/30 bg-black text-gold"
                  />
                  <span className="text-[10px] uppercase tracking-wider text-white/60">Published</span>
                </label>
              </div>
            </div>

            {/* Recipe Media */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">Recipe Media</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Thumbnail URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail_url || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value || null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Video URL</label>
                  <input
                    type="text"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value || null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">External Video URL (YouTube, etc.)</label>
                  <input
                    type="text"
                    value={formData.external_video_url || ''}
                    onChange={(e) => setFormData({ ...formData, external_video_url: e.target.value || null })}
                    className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">Ingredients</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddIngredient())}
                  placeholder="Add an ingredient..."
                  className="flex-1 bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="bg-white/10 text-white px-4 py-2 text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {(formData.ingredients || []).map((ing, index) => (
                  <li key={index} className="flex items-center justify-between bg-black/50 px-3 py-2 rounded border border-white/5">
                    <span className="text-xs text-white/80">{ing.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">Preparation Steps</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStep}
                  onChange={(e) => setNewStep(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddStep())}
                  placeholder="Add a step..."
                  className="flex-1 bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="bg-white/10 text-white px-4 py-2 text-xs font-bold hover:bg-white/20 transition-colors"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {(formData.preparation_steps || []).map((step, index) => (
                  <li key={index} className="flex items-start justify-between gap-2 bg-black/50 px-3 py-2 rounded border border-white/5">
                    <div className="flex items-start gap-3">
                      <span className="text-gold text-xs font-bold mt-0.5">{index + 1}.</span>
                      <span className="text-xs text-white/80">{step.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-gold">SEO</h4>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title || ''}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">SEO Description</label>
                <textarea
                  rows={3}
                  value={formData.seo_description || ''}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gold text-black py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors"
              >
                {editingId ? 'Update Recipe' : 'Create Recipe'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                  resetForm()
                }}
                className="bg-white/10 text-white px-6 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-[#111] border border-white/10 rounded p-4">
            {recipe.thumbnail_url && (
              <div className="h-40 mb-4 rounded overflow-hidden border border-white/5">
                <img
                  src={recipe.thumbnail_url}
                  alt={recipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">{recipe.name}</h3>
              <div className="flex items-center gap-1">
                {recipe.is_featured && <span className="text-yellow-500 text-xs">⭐</span>}
                {recipe.is_published ? (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <Check size={10} /> Published
                  </span>
                ) : (
                  <span className="text-orange-400 text-xs">Draft</span>
                )}
              </div>
            </div>
            <p className="text-xs text-white/50 mb-3 line-clamp-2">{recipe.short_description}</p>
            <div className="flex items-center gap-3 mb-4 text-xs text-white/40">
              {recipe.preparation_time && (
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{recipe.preparation_time}m prep</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  <span>{recipe.servings} servings</span>
                </div>
              )}
              <span className={`text-xs px-2 py-0.5 rounded ${
                recipe.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                recipe.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>{recipe.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(recipe)}
                className="flex-1 bg-white/10 text-white px-3 py-2 text-xs font-bold tracking-wider uppercase hover:bg-white/20 transition-colors flex items-center justify-center gap-1"
              >
                <Edit2 size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(recipe.id)}
                className="bg-red-500/10 text-red-400 px-3 py-2 text-xs font-bold tracking-wider uppercase hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
