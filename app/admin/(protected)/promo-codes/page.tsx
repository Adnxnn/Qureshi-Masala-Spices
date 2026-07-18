'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus, Trash2, Check, X } from 'lucide-react'
import { getPromoCodes, addPromoCode, updatePromoCode, deletePromoCode } from '@/lib/admin-actions'
import type { PromoCode } from '@/types'

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [newCode, setNewCode] = useState('')
  const [newDiscount, setNewDiscount] = useState('')
  const [newType, setNewType] = useState<'percentage' | 'fixed'>('percentage')
  const [newUsageLimit, setNewUsageLimit] = useState('100')

  useEffect(() => {
    const loadPromoCodes = async () => {
      setLoading(true)
      const codes = await getPromoCodes()
      setPromoCodes(codes)
      setLoading(false)
    }
    loadPromoCodes()
  }, [])

  const handleAddPromo = async () => {
    if (!newCode || !newDiscount) return

    setSaving(true)
    try {
      const newPromoData = {
        code: newCode.toUpperCase(),
        discount: parseInt(newDiscount),
        type: newType,
        usageLimit: parseInt(newUsageLimit),
      }
      await addPromoCode(newPromoData)
      const updatedPromoCodes = await getPromoCodes()
      setPromoCodes(updatedPromoCodes)

      setNewCode('')
      setNewDiscount('')
      setShowAddForm(false)
    } catch (e) {
      console.error('Failed to add promo code:', e)
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePromo = async (id: string) => {
    try {
      await deletePromoCode(id)
      const updatedPromoCodes = await getPromoCodes()
      setPromoCodes(updatedPromoCodes)
    } catch (e) {
      console.error('Failed to delete promo code:', e)
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const promo = promoCodes.find(p => p.id === id)
      if (promo) {
        await updatePromoCode(id, { isActive: !promo.isActive })
        const updatedPromoCodes = await getPromoCodes()
        setPromoCodes(updatedPromoCodes)
      }
    } catch (e) {
      console.error('Failed to update promo code:', e)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-white/50">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl uppercase text-white tracking-wider">Promo Codes</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-gold text-black px-5 py-2.5 text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          {showAddForm ? 'Cancel' : 'Add Promo Code'}
        </button>
      </div>

      {/* Add Promo Form */}
      {showAddForm && (
        <div className="bg-dark border border-white/10 p-6 rounded mb-8">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wider">Create New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Code</label>
              <input 
                type="text" 
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="WELCOME10"
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none uppercase"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Discount</label>
              <input 
                type="number" 
                value={newDiscount}
                onChange={(e) => setNewDiscount(e.target.value)}
                placeholder="10"
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Type</label>
              <select 
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'percentage' | 'fixed')}
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-white/40 mb-1">Usage Limit</label>
              <input 
                type="number" 
                value={newUsageLimit}
                onChange={(e) => setNewUsageLimit(e.target.value)}
                placeholder="100"
                className="w-full bg-black border border-white/10 text-white px-3 py-2 text-xs focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <button 
            onClick={handleAddPromo}
            disabled={saving}
            className="bg-gold text-black px-6 py-2 text-xs font-bold tracking-wider uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create Promo Code'}
          </button>
        </div>
      )}

      {/* Promo Codes List */}
      <div className="space-y-3">
        {promoCodes.map((promo) => (
          <div key={promo.id} className={`bg-dark border border-white/10 p-5 flex items-center justify-between ${!promo.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-6">
              <div className="bg-gold/10 border border-gold/30 px-4 py-2 rounded">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-gold" />
                  <span className="font-mono text-lg font-bold text-gold">{promo.code}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-white font-medium">
                    {promo.type === 'percentage' 
                      ? `${promo.discount}% Off` 
                      : `₹${promo.discount} Off`}
                  </span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded ${promo.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="text-xs text-white/40">
                  Usage: {promo.usedCount}/{promo.usageLimit}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleActive(promo.id)}
                className={`px-3 py-1.5 border text-[10px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 ${promo.isActive ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-green-500/30 text-green-400 hover:bg-green-500/10'}`}
              >
                {promo.isActive ? <X size={10} /> : <Check size={10} />}
                {promo.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button 
                onClick={() => handleDeletePromo(promo.id)}
                className="px-3 py-1.5 border border-white/15 text-[10px] font-bold tracking-wider uppercase text-white/50 hover:border-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={10} />
                Delete
              </button>
            </div>
          </div>
        ))}

        {promoCodes.length === 0 && (
          <div className="text-center py-12 text-white/25 text-sm">
            No promo codes yet. Create your first one!
          </div>
        )}
      </div>
    </div>
  )
}
