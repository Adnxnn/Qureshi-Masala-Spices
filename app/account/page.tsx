'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { LogOut, MapPin, PackageCheck, UserRound } from 'lucide-react'
import {
  getCurrentUser,
  getUserOrders,
  logoutUser,
  updateUserProfile,
} from '@/lib/actions'
import type { OrderWithItems, User } from '@/types'

type AccountTab = 'profile' | 'orders'

type ProfileFormValues = {
  full_name: string
  phone: string
  address?: string
  city?: string
  pincode?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'border-yellow-400/20 bg-yellow-400/10 text-yellow-300',
    confirmed: 'border-blue-400/20 bg-blue-400/10 text-blue-300',
    dispatched: 'border-orange-400/20 bg-orange-400/10 text-orange-300',
    delivered: 'border-green-400/20 bg-green-400/10 text-green-300',
    cancelled: 'border-red-400/20 bg-red-400/10 text-red-300',
  }
  return colors[status] || 'border-white/10 bg-white/5 text-white/60'
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const [activeTab, setActiveTab] = useState<AccountTab>('profile')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>()

  useEffect(() => {
    const syncTabFromHash = () => {
      setActiveTab(window.location.hash === '#orders' ? 'orders' : 'profile')
    }

    syncTabFromHash()
    window.addEventListener('hashchange', syncTabFromHash)
    return () => window.removeEventListener('hashchange', syncTabFromHash)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const userData = await getCurrentUser()
        if (cancelled) return

        setUser(userData)
        if (!userData) return

        reset({
          full_name: userData.full_name,
          phone: userData.phone,
          address: userData.address ?? '',
          city: userData.city ?? '',
          pincode: userData.pincode ?? '',
        })

        const userOrders = await getUserOrders()
        if (!cancelled) setOrders(userOrders)
      } catch (error) {
        console.error('[AccountPage] load failed', error)
        if (!cancelled) toast.error('We could not load all account details.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadData()
    return () => {
      cancelled = true
    }
  }, [reset])

  function selectTab(tab: AccountTab) {
    setActiveTab(tab)
    window.history.replaceState(null, '', tab === 'orders' ? '#orders' : '#profile')
  }

  async function onSubmitProfile(data: ProfileFormValues) {
    const result = await updateUserProfile(data)

    if ('error' in result) {
      toast.error(result.error)
      return
    }

    const userData = await getCurrentUser()
    setUser(userData)
    toast.success('Profile and delivery address saved.')
  }

  async function handleLogout() {
    setLoggingOut(true)
    await logoutUser()
  }

  if (loading) {
    return (
      <div className="royal-page px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl animate-pulse" aria-label="Loading account">
          <div className="h-10 w-52 rounded bg-white/10" />
          <div className="mt-3 h-5 w-72 max-w-full rounded bg-white/5" />
          <div className="mt-8 h-14 rounded-xl bg-white/5" />
          <div className="mt-6 h-80 rounded-2xl bg-white/5" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="royal-page royal-grain px-4 pb-20 pt-16 sm:pt-24">
        <div className="mx-auto max-w-lg text-center">
          <UserRound className="mx-auto mb-5 text-gold" size={40} aria-hidden="true" />
          <h1 className="royal-title text-5xl sm:text-6xl">
            Your spice cabinet, remembered.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55 sm:text-base">
            Your profile, saved delivery address and order history are kept securely in your account.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login?next=/account"
              className="royal-button"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="royal-button-secondary"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="royal-page royal-grain px-4 pb-20 pt-14 sm:px-6 sm:pt-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-7 sm:mb-9">
          <p className="royal-eyebrow mb-2">
            Your Qureshi&apos;s account
          </p>
          <h1 className="royal-title text-5xl sm:text-6xl">My account.</h1>
          <p className="mt-2 text-sm text-white/55 sm:text-base">Welcome back, {user.full_name}.</p>
        </div>

        <div
          role="tablist"
          aria-label="Account sections"
          className="mb-6 grid grid-cols-2 gap-1 rounded-[3px] border border-gold/15 bg-black/30 p-1 sm:mb-8"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'profile'}
            onClick={() => selectTab('profile')}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-6 ${
              activeTab === 'profile'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <UserRound size={18} aria-hidden="true" />
            <span className="sm:hidden">Profile</span>
            <span className="hidden sm:inline">Profile &amp; Address</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'orders'}
            onClick={() => selectTab('orders')}
            className={`flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-6 ${
              activeTab === 'orders'
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <PackageCheck size={18} aria-hidden="true" />
            <span className="sm:hidden">Orders</span>
            <span className="hidden sm:inline">Order History</span>
          </button>
        </div>

        {activeTab === 'profile' ? (
          <section
            id="profile"
            role="tabpanel"
            className="royal-panel p-5 sm:p-8"
          >
            <div className="mb-7 flex items-start gap-3 border-b border-white/10 pb-6">
              <MapPin className="mt-0.5 shrink-0 text-gold" size={21} aria-hidden="true" />
              <div>
                <h2 className="font-display text-3xl text-cream sm:text-4xl">
                  Profile &amp; Saved Address
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/50">
                  These details automatically fill your next order.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="account_name" className="mb-2 block text-sm font-medium text-white">
                    Full name
                  </label>
                  <input
                    id="account_name"
                    type="text"
                    autoComplete="name"
                    aria-invalid={errors.full_name ? 'true' : 'false'}
                    {...register('full_name', { required: 'Name is required.' })}
                    className="royal-field px-4 text-base"
                  />
                  {errors.full_name ? (
                    <p role="alert" className="mt-2 text-sm text-red-300">{errors.full_name.message}</p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="account_phone" className="mb-2 block text-sm font-medium text-white">
                    Phone number
                  </label>
                  <input
                    id="account_phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    {...register('phone', { required: 'Phone number is required.' })}
                    className="royal-field px-4 text-base"
                  />
                  {errors.phone ? (
                    <p role="alert" className="mt-2 text-sm text-red-300">{errors.phone.message}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="account_email" className="mb-2 block text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  id="account_email"
                  type="email"
                  value={user.email}
                  disabled
                  className="royal-field cursor-not-allowed px-4 text-base text-white/45"
                />
              </div>

              <div>
                <label htmlFor="account_address" className="mb-2 block text-sm font-medium text-white">
                  Complete delivery address
                </label>
                <textarea
                  id="account_address"
                  rows={3}
                  autoComplete="street-address"
                  {...register('address')}
                  className="royal-field px-4 py-3 text-base"
                  placeholder="House, street and area"
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="account_city" className="mb-2 block text-sm font-medium text-white">City</label>
                  <input
                    id="account_city"
                    type="text"
                    autoComplete="address-level2"
                    {...register('city')}
                    className="royal-field px-4 text-base"
                  />
                </div>
                <div>
                  <label htmlFor="account_pincode" className="mb-2 block text-sm font-medium text-white">Pincode</label>
                  <input
                    id="account_pincode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    {...register('pincode')}
                    className="royal-field px-4 text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="royal-button disabled:cursor-wait disabled:opacity-60"
                >
                  {isSubmitting ? 'Saving…' : 'Save Details'}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="royal-button-secondary flex gap-2 hover:border-red-400/35 hover:text-red-300 disabled:cursor-wait disabled:opacity-60"
                >
                  <LogOut size={18} aria-hidden="true" />
                  {loggingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section id="orders" role="tabpanel">
            {orders.length === 0 ? (
              <div className="royal-panel p-8 text-center sm:p-12">
                <PackageCheck className="mx-auto mb-4 text-gold" size={36} aria-hidden="true" />
                <h2 className="royal-title text-4xl">No orders yet.</h2>
                <p className="mt-2 text-sm text-white/50">Your confirmed website orders will appear here.</p>
                <Link
                  href="/shop"
                  className="royal-button mt-7"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <article key={order.id} className="royal-panel p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5 sm:grid-cols-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/40">Order ID</p>
                        <p className="mt-1 font-mono text-sm text-white">{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-white/40">Total</p>
                        <p className="mt-1 font-semibold text-gold">{formatCurrency(Number(order.total_amount))}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <p className="text-xs uppercase tracking-wider text-white/40">Placed</p>
                        <p className="mt-1 text-sm text-white/75">{formatDate(order.created_at)}</p>
                      </div>
                      <div className="col-span-2 flex items-start sm:col-span-1 sm:justify-end">
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="pt-5">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Items</p>
                      <div className="divide-y divide-white/10">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex gap-4 py-3 text-sm first:pt-0 last:pb-0">
                            <span className="min-w-0 flex-1 text-white/75">
                              {item.product_name} ({item.variant_weight_grams}g) × {item.quantity}
                            </span>
                            <span className="shrink-0 font-medium text-white">
                              {formatCurrency(Number(item.subtotal))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
