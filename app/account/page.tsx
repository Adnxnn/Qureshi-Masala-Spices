'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getCurrentUser, getUserOrders, updateUserProfile, logoutUser } from '@/lib/actions'
import type { User, Order } from '@/types'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    processing: 'bg-purple-500/20 text-purple-400',
    shipped: 'bg-orange-500/20 text-orange-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  }
  return colors[status] || 'bg-gray-500/20 text-gray-400'
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm()

  useEffect(() => {
    async function loadData() {
      const userData = await getCurrentUser()
      setUser(userData)
      if (userData) {
        const userOrders = await getUserOrders()
        setOrders(userOrders)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  async function onSubmitProfile(data: any) {
    await updateUserProfile(data)
    const userData = await getCurrentUser()
    setUser(userData)
  }

  async function handleLogout() {
    await logoutUser()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="font-display text-4xl text-white mb-4">Please Login</h1>
            <p className="text-white/60 mb-8">You need to be logged in to view this page</p>
            <a href="/login" className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
              Go to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-white mb-2">My Account</h1>
          <p className="text-white/60">Welcome back, {user.full_name}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'profile' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
            }`}
          >
            Orders
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-display text-white mb-8">Profile Information</h2>
            
            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input
                    {...register('full_name', { required: 'Name is required' })}
                    type="text"
                    defaultValue={user.full_name}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  />
                  {errors.full_name && <p className="text-red-400 text-sm mt-2">{errors.full_name.message as string}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone.message as string}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Address</label>
                <textarea
                  {...register('address')}
                  rows={3}
                  defaultValue={user.address || ''}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">City</label>
                  <input
                    {...register('city')}
                    type="text"
                    defaultValue={user.city || ''}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Pincode</label>
                  <input
                    {...register('pincode')}
                    type="text"
                    defaultValue={user.pincode || ''}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                <h3 className="text-xl text-white mb-4">No Orders Yet</h3>
                <p className="text-white/60 mb-8">You haven't placed any orders yet</p>
                <a href="/" className="inline-block bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                  Start Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                      <div>
                        <p className="text-sm text-white/50 mb-1">Order ID</p>
                        <p className="font-mono text-white">{order.id.slice(0, 8)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/50 mb-1">Total</p>
                        <p className="font-display text-2xl text-primary">₹{order.total_amount}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/50 mb-1">Date</p>
                        <p className="text-white">{formatDate(order.created_at)}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-white/50 mb-3">Items</p>
                      <div className="space-y-2">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-white/80">
                            <span>
                              {item.product_name} ({item.variant_weight_grams}g) x {item.quantity}
                            </span>
                            <span>₹{item.subtotal}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
