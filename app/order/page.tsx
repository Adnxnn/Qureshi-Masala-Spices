'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  MessageCircle,
  MapPin,
  ShoppingBag,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowRight,
  Gift,
} from 'lucide-react'
import { useCart } from '@/lib/cart'
import {
  placeOrder,
  getCurrentUser,
  updateUserProfile,
  validateAndApplyPromoCode,
  incrementPromoCodeUsage,
} from '@/lib/actions'
import { calculateOrderTotal } from '@/lib/utils'
import type { User, PlaceOrderPayload } from '@/types'

const WHATSAPP_NUMBER = '918904951364'

const schema = z.object({
  customer_name: z.string().min(2, 'Name is required'),
  customer_phone: z
    .string()
    .min(10, 'Valid phone required')
    .max(13),
  customer_email: z.string().email('Valid email required'),
  customer_address: z
    .string()
    .min(10, 'Full address required'),
  customer_city: z.string().min(2, 'City required'),
  customer_pincode: z
    .string()
    .length(6, '6-digit pincode required'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

function formatWeight(grams: number) {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }

  return `${grams}g`
}

function InputField({
  id,
  label,
  type = 'text',
  placeholder = '',
  register,
  errors,
}: {
  id: keyof FormData
  label: string
  type?: string
  placeholder?: string
  register: any
  errors: any
}) {
  return (
    <div className="min-w-0 space-y-2">
      <label
        htmlFor={id}
        className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8E0D5]/40 sm:text-xs"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...register(id)}
        className="min-h-11 w-full min-w-0 rounded-xl border border-[#252525] bg-[#151515] px-4 py-3 text-sm text-[#E8E0D5] transition-colors placeholder:text-[#E8E0D5]/15 focus:border-[#BFA068]/60 focus:outline-none sm:px-6"
      />

      {errors[id] && (
        <p className="mt-1 text-[10px] text-[#BFA068]/80 sm:text-xs">
          {errors[id]?.message}
        </p>
      )}
    </div>
  )
}

export default function OrderPage() {
  const {
    items,
    updateQty,
    removeItem,
    clearCart,
    totalAmount,
    appliedPromoCode,
    applyPromoCode,
  } = useCart()

  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] =
    useState<FormData | null>(null)
  const [lastOrderItems, setLastOrderItems] =
    useState<any[]>([])
  const [lastOrderTotals, setLastOrderTotals] =
    useState<any | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [checkoutStep, setCheckoutStep] =
    useState<'cart' | 'delivery'>('cart')

  const subtotal = totalAmount()

  const {
    subtotal: displaySubtotal,
    discount,
    total: grandTotal,
  } = calculateOrderTotal(subtotal, appliedPromoCode)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const watchedData = watch()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)

        if (userData) {
          reset({
            customer_name: userData.full_name,
            customer_email: userData.email,
            customer_phone: userData.phone,
            customer_address: userData.address || '',
            customer_city: userData.city || '',
            customer_pincode: userData.pincode || '',
            notes: '',
          })
        }
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [reset])

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return

    setApplyingPromo(true)
    setPromoError('')

    try {
      const customerData =
        watchedData.customer_email &&
        watchedData.customer_phone
          ? {
              email: watchedData.customer_email,
              phone: watchedData.customer_phone,
            }
          : undefined

      const promoCode = await validateAndApplyPromoCode(
        promoInput.trim(),
        user,
        customerData
      )

      if (!promoCode) {
        setPromoError('Invalid or expired promo code')
        return
      }

      applyPromoCode(promoCode)
      setPromoInput('')
      toast.success('Promo code applied successfully!')
    } catch {
      setPromoError('Failed to apply promo code')
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    applyPromoCode(null)
    toast.success('Promo code removed')
  }

  const generateWhatsAppMessage = (
    data: FormData,
    generatedOrderId: string
  ) => {
    const orderItems =
      lastOrderItems.length > 0 ? lastOrderItems : items

    const productsList = orderItems
      .map(
        (item: any) =>
          `• ${item.product.name} (${formatWeight(
            item.variant.weight_grams
          )}) × ${item.quantity} = ₹${
            item.variant.price * item.quantity
          }`
      )
      .join('\n')

    const totals =
      lastOrderTotals ||
      calculateOrderTotal(subtotal, appliedPromoCode)

    return encodeURIComponent(
`🛒 NEW ORDER

Order ID: ${generatedOrderId}

Customer Details:
Name: ${data.customer_name}
Phone: ${data.customer_phone}
Email: ${data.customer_email}

Delivery Address:
${data.customer_address}
${data.customer_city} - ${data.customer_pincode}

Products:
${productsList}

${totals.discount > 0 ? `Discount: -₹${totals.discount}\n` : ''}Total Amount: ₹${totals.total}

${data.notes ? `Notes: ${data.notes}` : ''}

Please confirm this order.`
    )
  }

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const currentItems = [...items]
      setLastOrderItems(currentItems)

      const currentSubtotal = currentItems.reduce(
        (sum, item) =>
          sum + item.variant.price * item.quantity,
        0
      )

      const totals = calculateOrderTotal(
        currentSubtotal,
        appliedPromoCode
      )

      setLastOrderTotals(totals)

      if (appliedPromoCode) {
        try {
          await incrementPromoCodeUsage(
            appliedPromoCode.code,
            user,
            {
              email: data.customer_email,
              phone: data.customer_phone,
            }
          )
        } catch (promoError) {
          console.warn(
            'Failed to increment promo usage:',
            promoError
          )
        }
      }

      if (user) {
        try {
          await updateUserProfile({
            full_name: data.customer_name,
            phone: data.customer_phone,
            address: data.customer_address,
            city: data.customer_city,
            pincode: data.customer_pincode,
          })
        } catch (profileError) {
          console.warn(
            'Failed to update user profile:',
            profileError
          )
        }
      }

      const payload: PlaceOrderPayload = {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        customer_address: data.customer_address,
        customer_city: data.customer_city,
        customer_pincode: data.customer_pincode,
        notes: data.notes,
        items: currentItems,
      }

      const result = await placeOrder(
        payload,
        appliedPromoCode
      )

      if (result.success === false) {
        toast.error(result.error)
        return
      }

      const generatedOrderId = String(result.order.id)

      setOrderData(data)
      setOrderId(generatedOrderId)
      setSubmitted(true)
      clearCart()

      window.setTimeout(() => {
        const message = generateWhatsAppMessage(
          data,
          generatedOrderId
        )

        window.location.href =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
      }, 500)
    } catch (error) {
      console.error('Order failed:', error)

      toast.error(
        'Something went wrong placing your order. Please try again.'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#111111] px-4 pt-20">
        <div className="space-y-6 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#282828] border-t-[#BFA068]" />

          <p className="text-sm uppercase tracking-[0.2em] text-[#E8E0D5]/30">
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (submitted && orderData) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#111111] pb-12 pt-16 sm:pb-16 sm:pt-20">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <div className="mb-8 text-center sm:mb-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#282828] bg-[#151515] sm:h-20 sm:w-20">
              <CheckCircle
                size={32}
                className="text-[#BFA068]"
              />
            </div>

            <h1 className="mb-3 break-words font-display text-xl uppercase tracking-[0.15em] text-[#E8E0D5] sm:mb-4 sm:text-3xl sm:tracking-[0.2em]">
              Order Placed
            </h1>

            <p className="break-words text-sm text-[#E8E0D5]/40">
              Your order{' '}
              <span className="font-mono tracking-wider text-[#BFA068]">
                #{orderId}
              </span>{' '}
              has been received.
            </p>
          </div>

          <div className="mb-8 overflow-hidden rounded-2xl border border-[#282828] bg-[#151515] sm:mb-10">
            <div className="border-b border-[#282828] p-4 sm:p-6">
              <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#BFA068] sm:text-xs">
                Order Summary
              </h2>
            </div>

            <div className="space-y-4 p-4 sm:p-6">
              {lastOrderItems.map(
                ({
                  product,
                  variant,
                  quantity,
                }: any) => (
                  <div
                    key={`${product.id}-${variant.weight_grams}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#1E1E1E] sm:h-16 sm:w-16">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#E8E0D5]">
                        {product.name}
                      </p>

                      <p className="text-xs text-[#E8E0D5]/40">
                        {formatWeight(
                          variant.weight_grams
                        )}{' '}
                        × {quantity}
                      </p>
                    </div>

                    <p className="shrink-0 font-display text-sm text-[#BFA068]">
                      ₹{variant.price * quantity}
                    </p>
                  </div>
                )
              )}

              <div className="border-t border-[#282828] pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8E0D5]/50">
                    Total
                  </span>

                  <span className="font-display text-2xl text-[#BFA068] sm:text-3xl">
                    ₹
                    {lastOrderTotals?.total.toFixed(0) ??
                      '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/"
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#BFA068] px-5 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#111111] transition-colors hover:bg-[#E8E0D5] sm:text-xs"
            >
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => {
                const message = generateWhatsAppMessage(
                  orderData,
                  orderId
                )

                window.location.href =
                  `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
              }}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2D8C4F] px-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#37A85E] sm:text-xs"
            >
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#111111] pb-12 pt-20 sm:pb-16 sm:pt-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <header className="mb-8 sm:mb-12">
          <div className="flex min-w-0 items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="break-words font-display text-xl uppercase tracking-[0.15em] text-[#E8E0D5] sm:text-2xl sm:tracking-[0.2em]">
                {checkoutStep === 'cart'
                  ? 'Your Cart'
                  : 'Delivery'}
              </h1>

              <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#BFA068] sm:text-xs sm:tracking-[0.2em]">
                {checkoutStep === 'cart'
                  ? 'Review your selection'
                  : 'Complete your details'}
              </p>
            </div>

            <div className="hidden shrink-0 items-center gap-3 sm:flex">
              {['cart', 'delivery'].map(
                (step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                        checkoutStep === step ||
                        (checkoutStep === 'delivery' &&
                          step === 'cart')
                          ? 'border-[#BFA068] bg-[#BFA068]/10'
                          : 'border-[#282828] bg-[#151515]'
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold ${
                          checkoutStep === step ||
                          (checkoutStep ===
                            'delivery' &&
                            step === 'cart')
                            ? 'text-[#BFA068]'
                            : 'text-[#E8E0D5]/30'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </div>

                    {index === 0 && (
                      <div
                        className={`h-px w-14 ${
                          checkoutStep === 'delivery'
                            ? 'bg-[#BFA068]'
                            : 'bg-[#282828]'
                        }`}
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </header>

        {checkoutStep === 'cart' && (
          <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8">
            <section className="min-w-0 lg:col-span-8">
              {!user && (
                <div className="mb-6 rounded-2xl border border-[#282828] bg-[#151515] p-4 sm:mb-8 sm:p-6">
                  <div className="flex min-w-0 flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="min-w-0">
                      <p className="mb-1 text-sm font-medium text-[#E8E0D5]">
                        Faster checkout, saved details
                      </p>

                      <p className="text-xs text-[#E8E0D5]/50">
                        Create an account for next time.
                      </p>
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                      <Link
                        href="/login"
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[#282828] px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E8E0D5] hover:border-[#BFA068] sm:flex-none"
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#BFA068] px-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#111111] hover:bg-[#E8E0D5] sm:flex-none"
                      >
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-[#282828] bg-[#151515] px-4 py-16 text-center sm:py-20">
                  <ShoppingBag
                    size={36}
                    className="mb-5 text-[#BFA068]/30"
                  />

                  <p className="mb-5 text-sm text-[#E8E0D5]/40">
                    Your cart is empty
                  </p>

                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#BFA068] hover:text-[#E8E0D5]"
                  >
                    Browse Products
                    <ChevronRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#282828] bg-[#151515]">
                  <div className="border-b border-[#282828] p-4 sm:p-5">
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#BFA068] sm:text-xs">
                      Your Cart
                    </h2>
                  </div>

                  <div className="w-full min-w-0 px-3 sm:px-4">
                    {items.map(
                      ({
                        product,
                        variant,
                        quantity,
                      }) => (
                        <article
                          key={`${product.id}-${variant.weight_grams}`}
                          className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)_auto] gap-x-3 gap-y-3 border-b border-[#282828]/60 py-4 last:border-b-0 sm:grid-cols-[48px_minmax(0,1fr)_auto_auto] sm:items-center"
                        >
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#1E1E1E] sm:h-12 sm:w-12">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-medium text-[#E8E0D5]">
                              {product.name}
                            </h3>

                            <p className="text-[10px] text-[#E8E0D5]/40">
                              {formatWeight(
                                variant.weight_grams
                              )}
                            </p>
                          </div>

                          <p className="shrink-0 text-right font-display text-sm text-[#BFA068] sm:order-4 sm:min-w-[70px]">
                            ₹{variant.price * quantity}
                          </p>

                          <div className="col-span-2 col-start-2 flex min-w-0 items-center justify-between gap-3 sm:col-span-1 sm:col-start-auto sm:order-3 sm:justify-start">
                            <div className="flex shrink-0 items-center rounded-md border border-[#282828] bg-[#1E1E1E] p-0.5">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                onClick={() =>
                                  updateQty(
                                    product.id,
                                    variant.weight_grams,
                                    quantity - 1
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center text-[#E8E0D5]/50 hover:text-[#BFA068]"
                              >
                                <Minus size={10} />
                              </button>

                              <span className="w-6 text-center text-xs font-semibold text-[#E8E0D5]">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                aria-label="Increase quantity"
                                onClick={() =>
                                  updateQty(
                                    product.id,
                                    variant.weight_grams,
                                    quantity + 1
                                  )
                                }
                                className="flex h-7 w-7 items-center justify-center text-[#E8E0D5]/50 hover:text-[#BFA068]"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            <button
                              type="button"
                              aria-label={`Remove ${product.name}`}
                              onClick={() =>
                                removeItem(
                                  product.id,
                                  variant.weight_grams
                                )
                              }
                              className="flex h-9 w-9 items-center justify-center text-[#E8E0D5]/30 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </article>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>

            {items.length > 0 && (
              <aside className="min-w-0 lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <div className="mb-4 w-full min-w-0 overflow-hidden rounded-xl border border-[#282828] bg-[#151515]">
                    <div className="border-b border-[#282828] p-4 sm:p-5">
                      <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#BFA068] sm:text-xs">
                        Summary
                      </h2>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">
                      {appliedPromoCode ? (
                        <div className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-[#282828] bg-[#1E1E1E] p-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <Gift
                              size={12}
                              className="shrink-0 text-[#BFA068]"
                            />

                            <div className="min-w-0">
                              <span className="block truncate font-mono text-[9px] font-semibold uppercase tracking-wider text-[#BFA068]">
                                {appliedPromoCode.code}
                              </span>

                              <span className="text-[9px] text-green-400/70">
                                {appliedPromoCode.type ===
                                'percentage'
                                  ? `${appliedPromoCode.discount}%`
                                  : `₹${appliedPromoCode.discount}`}{' '}
                                off
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label="Remove promo code"
                            onClick={handleRemovePromo}
                            className="flex h-9 w-9 shrink-0 items-center justify-center text-[#E8E0D5]/40 hover:text-white"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label
                            htmlFor="promo-code"
                            className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#E8E0D5]/40"
                          >
                            <Gift size={11} />
                            Promo Code
                          </label>

                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                            <input
                              id="promo-code"
                              type="text"
                              value={promoInput}
                              onChange={(event) => {
                                setPromoInput(
                                  event.target.value
                                )
                                setPromoError('')
                              }}
                              placeholder="ENTER CODE"
                              className="min-h-11 w-full min-w-0 flex-1 rounded-lg border border-[#282828] bg-[#1E1E1E] px-3 text-xs uppercase tracking-[0.1em] text-[#E8E0D5] placeholder:text-[#E8E0D5]/15 focus:border-[#BFA068]/60 focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              disabled={applyingPromo}
                              className="min-h-11 rounded-lg border border-[#282828] bg-[#1E1E1E] px-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#BFA068] hover:bg-[#252525] disabled:opacity-40"
                            >
                              {applyingPromo
                                ? 'Applying...'
                                : 'Apply'}
                            </button>
                          </div>

                          {promoError && (
                            <p className="text-[9px] text-[#BFA068]/80">
                              {promoError}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 border-t border-[#282828] pt-4">
                        {discount > 0 && (
                          <>
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[11px] text-[#E8E0D5]/40">
                                Subtotal
                              </span>

                              <span className="text-sm font-medium text-[#E8E0D5]/80">
                                ₹{displaySubtotal.toFixed(0)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                              <span className="text-[11px] text-green-400/70">
                                Discount
                              </span>

                              <span className="text-sm font-medium text-green-400/70">
                                -₹{discount.toFixed(0)}
                              </span>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-between gap-4 pt-3">
                          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#E8E0D5]/50">
                            Total
                          </span>

                          <span className="font-display text-2xl text-[#BFA068]">
                            ₹{grandTotal.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setCheckoutStep('delivery')
                        }
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#BFA068] px-4 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#111111] hover:bg-[#E8E0D5]"
                      >
                        Proceed to Checkout
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        )}

        {checkoutStep === 'delivery' && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-8"
          >
            <section className="min-w-0 lg:col-span-8">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="mb-6 inline-flex min-h-11 items-center gap-2 text-[#E8E0D5]/40 hover:text-[#BFA068]"
              >
                <ArrowLeft size={14} />

                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Back to Cart
                </span>
              </button>

              <div className="w-full min-w-0 overflow-hidden rounded-2xl border border-[#282828] bg-[#151515]">
                <div className="border-b border-[#282828] p-4 sm:p-6">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={14}
                      className="shrink-0 text-[#BFA068]"
                    />

                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#BFA068] sm:text-xs">
                      Delivery Details
                    </h2>
                  </div>
                </div>

                <div className="min-w-0 space-y-5 p-4 sm:p-6">
                  <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField
                      id="customer_name"
                      label="Full Name"
                      placeholder="Your full name"
                      register={register}
                      errors={errors}
                    />

                    <InputField
                      id="customer_phone"
                      label="Phone (WhatsApp)"
                      type="tel"
                      placeholder="+91 98765 43210"
                      register={register}
                      errors={errors}
                    />
                  </div>

                  <InputField
                    id="customer_email"
                    label="Email"
                    type="email"
                    placeholder="you@email.com"
                    register={register}
                    errors={errors}
                  />

                  <div className="min-w-0 space-y-2">
                    <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8E0D5]/40 sm:text-xs">
                      Delivery Address
                    </label>

                    <textarea
                      {...register('customer_address')}
                      rows={3}
                      placeholder="House number, street, landmark, area..."
                      className="w-full min-w-0 resize-none rounded-xl border border-[#252525] bg-[#151515] px-4 py-3 text-sm text-[#E8E0D5] placeholder:text-[#E8E0D5]/15 focus:border-[#BFA068]/60 focus:outline-none sm:px-6"
                    />

                    {errors.customer_address && (
                      <p className="text-[10px] text-[#BFA068]/80 sm:text-xs">
                        {errors.customer_address.message}
                      </p>
                    )}
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                    <InputField
                      id="customer_city"
                      label="City"
                      placeholder="City name"
                      register={register}
                      errors={errors}
                    />

                    <InputField
                      id="customer_pincode"
                      label="Pincode"
                      placeholder="571201"
                      register={register}
                      errors={errors}
                    />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label className="block text-[10px] font-medium uppercase tracking-[0.2em] text-[#E8E0D5]/40 sm:text-xs">
                      Notes (Optional)
                    </label>

                    <textarea
                      {...register('notes')}
                      rows={2}
                      placeholder="Any special delivery instructions..."
                      className="w-full min-w-0 resize-none rounded-xl border border-[#252525] bg-[#151515] px-4 py-3 text-sm text-[#E8E0D5] placeholder:text-[#E8E0D5]/15 focus:border-[#BFA068]/60 focus:outline-none sm:px-6"
                    />
                  </div>
                </div>
              </div>
            </section>

            <aside className="min-w-0 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="mb-4 w-full min-w-0 overflow-hidden rounded-xl border border-[#282828] bg-[#151515]">
                  <div className="border-b border-[#282828] p-4 sm:p-5">
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#BFA068] sm:text-xs">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-3 p-4 sm:p-5">
                    {items.map(
                      ({
                        product,
                        variant,
                        quantity,
                      }) => (
                        <div
                          key={`${product.id}-${variant.weight_grams}`}
                          className="flex min-w-0 items-center justify-between gap-3"
                        >
                          <p className="min-w-0 flex-1 truncate text-[11px] text-[#E8E0D5]/80">
                            {product.name} × {quantity}
                          </p>

                          <p className="shrink-0 text-sm font-semibold text-[#BFA068]">
                            ₹{variant.price * quantity}
                          </p>
                        </div>
                      )
                    )}

                    <div className="border-t border-[#282828] pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E8E0D5]/50">
                          Total
                        </span>

                        <span className="font-display text-2xl text-[#BFA068]">
                          ₹{grandTotal.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2D8C4F] px-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-white hover:bg-[#37A85E] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <MessageCircle size={14} />

                  {isSubmitting
                    ? 'Placing Order...'
                    : `Place Order · ₹${grandTotal.toFixed(
                        0
                      )}`}
                </button>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  )
}