'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Save,
  Tag,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  addPromoCode,
  deletePromoCode,
  getPromoCodes,
  updatePromoCode,
} from '@/lib/admin-actions'
import type { PromoCode } from '@/types'

type PromoForm = {
  code: string
  discount: string
  type: 'percentage' | 'fixed'
  usageLimit: string
}

const EMPTY_FORM: PromoForm = {
  code: '',
  discount: '',
  type: 'percentage',
  usageLimit: '100',
}

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [form, setForm] = useState<PromoForm>(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadPromoCodes = useCallback(async () => {
    try {
      const codes = await getPromoCodes()
      setPromoCodes(codes)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load promo codes.'
      toast.error(message)
      console.error('[promo-codes] load failed:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadPromoCodes()
  }, [loadPromoCodes])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const openCreateForm = () => {
    if (showForm && !editingId) {
      resetForm()
      return
    }

    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(true)
  }

  const openEditForm = (promo: PromoCode) => {
    setForm({
      code: promo.code,
      discount: String(promo.discount),
      type: promo.type,
      usageLimit: String(promo.usageLimit),
    })
    setEditingId(promo.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSavePromo = async () => {
    const code = form.code.trim().toUpperCase().replace(/\s+/g, '')
    const discount = Number(form.discount)
    const usageLimit = Number(form.usageLimit)

    if (!code || !form.discount || !form.usageLimit) {
      toast.error('Complete all promo-code fields.')
      return
    }

    if (!Number.isFinite(discount) || discount <= 0) {
      toast.error('Discount must be greater than zero.')
      return
    }

    if (form.type === 'percentage' && discount > 100) {
      toast.error('Percentage discount cannot exceed 100%.')
      return
    }

    if (!Number.isInteger(usageLimit) || usageLimit < 1) {
      toast.error('Usage limit must be at least 1.')
      return
    }

    setSaving(true)

    try {
      if (editingId) {
        await updatePromoCode(editingId, {
          code,
          discount,
          type: form.type,
          usageLimit,
        })
        toast.success('Promo code updated for everyone.')
      } else {
        await addPromoCode({
          code,
          discount,
          type: form.type,
          usageLimit,
        })
        toast.success('Promo code created and active.')
      }

      await loadPromoCodes()
      resetForm()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to save promo code.'
      toast.error(message)
      console.error('[promo-codes] save failed:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePromo = async (promo: PromoCode) => {
    const confirmed = window.confirm(
      `Delete promo code ${promo.code}? This cannot be undone.`,
    )
    if (!confirmed) return

    setBusyId(promo.id)

    try {
      await deletePromoCode(promo.id)
      setPromoCodes((current) =>
        current.filter((item) => item.id !== promo.id),
      )
      if (editingId === promo.id) resetForm()
      toast.success('Promo code deleted.')
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to delete promo code.'
      toast.error(message)
      console.error('[promo-codes] delete failed:', error)
    } finally {
      setBusyId(null)
    }
  }

  const toggleActive = async (promo: PromoCode) => {
    setBusyId(promo.id)

    try {
      const updated = await updatePromoCode(promo.id, {
        isActive: !promo.isActive,
      })
      setPromoCodes((current) =>
        current.map((item) =>
          item.id === promo.id ? { ...item, ...updated } : item,
        ),
      )
      toast.success(
        updated.isActive
          ? 'Promo code activated for everyone.'
          : 'Promo code deactivated.',
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to update promo code.'
      toast.error(message)
      console.error('[promo-codes] status update failed:', error)
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={26} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
            Shared discounts
          </p>
          <h1 className="font-display text-3xl uppercase tracking-wider text-white sm:text-4xl">
            Promo Codes
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
            Changes are stored in Supabase and apply immediately to every
            customer using checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-11 sm:w-auto"
        >
          {showForm && !editingId ? <X size={14} /> : <Plus size={14} />}
          {showForm && !editingId ? 'Cancel' : 'Add Promo Code'}
        </button>
      </div>

      {showForm && (
        <section className="mb-8 overflow-hidden rounded-2xl border border-white/10 bg-dark">
          <div className="border-b border-white/10 bg-gradient-to-r from-gold/10 to-transparent px-5 py-4 sm:px-6">
            <h2 className="text-sm font-semibold tracking-wide text-white">
              {editingId ? 'Edit Promo Code' : 'Create New Promo Code'}
            </h2>
            <p className="mt-1 text-xs text-white/35">
              {editingId
                ? 'Saving will update this code for every customer.'
                : 'New codes are active immediately after saving.'}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Code
                </span>
                <input
                  type="text"
                  value={form.code}
                  maxLength={32}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      code: event.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="WELCOME10"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 text-sm uppercase text-white outline-none placeholder:text-white/20 focus:border-gold"
                />
              </label>

              <label className="space-y-2">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Discount
                </span>
                <input
                  type="number"
                  min="1"
                  max={form.type === 'percentage' ? 100 : undefined}
                  value={form.discount}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      discount: event.target.value,
                    }))
                  }
                  placeholder="10"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold"
                />
              </label>

              <label className="space-y-2">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Discount Type
                </span>
                <select
                  value={form.type}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      type: event.target.value as
                        | 'percentage'
                        | 'fixed',
                    }))
                  }
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 text-sm text-white outline-none focus:border-gold"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </label>

              <label className="space-y-2">
                <span className="block text-[10px] uppercase tracking-[0.2em] text-white/40">
                  Total Usage Limit
                </span>
                <input
                  type="number"
                  min="1"
                  value={form.usageLimit}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      usageLimit: event.target.value,
                    }))
                  }
                  placeholder="100"
                  className="min-h-11 w-full rounded-xl border border-white/10 bg-black px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-gold"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                className="min-h-12 rounded-xl border border-white/10 px-5 text-xs font-bold uppercase tracking-wider text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:min-h-11"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePromo}
                disabled={saving}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gold px-6 text-xs font-bold uppercase tracking-wider text-black transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-11"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving
                  ? 'Saving...'
                  : editingId
                    ? 'Update Promo Code'
                    : 'Create Promo Code'}
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="space-y-3">
        {promoCodes.map((promo) => {
          const isBusy = busyId === promo.id
          const limitReached = promo.usedCount >= promo.usageLimit

          return (
            <article
              key={promo.id}
              className={`rounded-2xl border bg-dark p-4 transition-opacity sm:p-5 ${
                promo.isActive
                  ? 'border-white/10'
                  : 'border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3">
                    <Tag size={15} className="shrink-0 text-gold" />
                    <span className="truncate font-mono text-base font-bold text-gold sm:text-lg">
                      {promo.code}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-white">
                        {promo.type === 'percentage'
                          ? `${promo.discount}% off`
                          : `₹${promo.discount} off`}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                          promo.isActive
                            ? 'bg-green-500/15 text-green-400'
                            : 'bg-red-500/15 text-red-400'
                        }`}
                      >
                        {promo.isActive ? 'Active' : 'Inactive'}
                      </span>

                      {limitReached && (
                        <span className="rounded-full bg-amber-500/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                          Limit reached
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-white/40">
                      <Users size={13} />
                      Used {promo.usedCount} of {promo.usageLimit} times
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
                  <button
                    type="button"
                    onClick={() => openEditForm(promo)}
                    disabled={isBusy}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-[10px] font-bold uppercase tracking-wider text-white/60 transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleActive(promo)}
                    disabled={isBusy}
                    className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-[10px] font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-40 ${
                      promo.isActive
                        ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                        : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                    }`}
                  >
                    {isBusy ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : promo.isActive ? (
                      <X size={12} />
                    ) : (
                      <Check size={12} />
                    )}
                    {promo.isActive ? 'Deactivate' : 'Activate'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeletePromo(promo)}
                    disabled={isBusy}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-[10px] font-bold uppercase tracking-wider text-white/50 transition-colors hover:border-red-500/50 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-40"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          )
        })}

        {promoCodes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <Tag className="mx-auto mb-4 text-white/15" size={32} />
            <p className="text-sm text-white/30">
              No promo codes yet. Create your first shared discount.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
