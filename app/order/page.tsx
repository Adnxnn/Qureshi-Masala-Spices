'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  useForm,
  type FieldErrors,
  type UseFormRegister,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Gift,
  Leaf,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { useCart } from '@/lib/cart'
import {
  getCurrentUser,
  incrementPromoCodeUsage,
  placeOrder,
  updateUserProfile,
  validateAndApplyPromoCode,
} from '@/lib/actions'
import { calculateOrderTotal } from '@/lib/utils'
import type {
  CartItem,
  PlaceOrderPayload,
  User,
} from '@/types'

const WHATSAPP_NUMBER = '918904951364'

const checkoutSchema = z.object({
  customer_name: z
    .string()
    .trim()
    .min(2, 'Please enter your name'),

  customer_phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(13, 'Enter a valid phone number'),

  customer_email: z
    .string()
    .trim()
    .email('Enter a valid email address'),

  customer_address: z
    .string()
    .trim()
    .min(10, 'Enter your complete delivery address'),

  customer_city: z
    .string()
    .trim()
    .min(2, 'Enter your city'),

  customer_pincode: z
    .string()
    .trim()
    .length(6, 'Enter a valid 6-digit pincode'),

  notes: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

type OrderTotals = {
  subtotal: number
  deliveryCharge: number
  discount: number
  total: number
}

function formatWeight(grams: number) {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }

  return `${grams}g`
}

function CheckoutInput({
  id,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  register,
  errors,
}: {
  id: keyof CheckoutFormData
  label: string
  placeholder: string
  type?: string
  autoComplete?: string
  register: UseFormRegister<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
}) {
  const error = errors[id]

  return (
    <div className="min-w-0 space-y-2">
      <label
        htmlFor={id}
        className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7c8b3]/55"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        {...register(id)}
        className={`min-h-12 w-full min-w-0 rounded-xl border bg-[#11100f] px-4 text-sm text-[#f5efe6] outline-none transition-colors placeholder:text-[#f5efe6]/20 ${
          error
            ? 'border-red-400/50 focus:border-red-400'
            : 'border-white/10 focus:border-[#c9a45f]/70'
        }`}
      />

      {error && (
        <p className="text-[11px] text-red-300">
          {error.message}
        </p>
      )}
    </div>
  )
}

function CheckoutProgress({
  currentStep,
}: {
  currentStep: 'cart' | 'delivery'
}) {
  const deliveryActive = currentStep === 'delivery'

  return (
    <div className="flex w-full items-center rounded-2xl border border-white/10 bg-white/[0.025] p-1.5 sm:w-auto">
      <div
        className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors sm:flex-none sm:px-5 ${
          !deliveryActive
            ? 'bg-[#c9a45f] text-[#130d08]'
            : 'text-[#f5efe6]/45'
        }`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
            deliveryActive
              ? 'bg-green-500/20 text-green-300'
              : 'bg-black/15'
          }`}
        >
          {deliveryActive ? <Check size={11} /> : '1'}
        </span>

        Cart
      </div>

      <div
        className={`flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors sm:flex-none sm:px-5 ${
          deliveryActive
            ? 'bg-[#c9a45f] text-[#130d08]'
            : 'text-[#f5efe6]/45'
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 text-[10px]">
          2
        </span>

        Delivery
      </div>
    </div>
  )
}

function TrustStrip() {
  const items = [
    {
      icon: MessageCircle,
      title: 'WhatsApp confirmation',
      description: 'Confirm directly with us',
    },
    {
      icon: ShieldCheck,
      title: 'No online payment',
      description: 'Pay only after confirmation',
    },
    {
      icon: Leaf,
      title: 'Freshly packed',
      description: 'Prepared with care',
    },
  ]

  return (
    <div className="grid grid-cols-1 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.025] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {items.map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.title}
            className="flex items-center gap-3 px-4 py-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#c9a45f]/10 text-[#c9a45f]">
              <Icon size={17} />
            </span>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#f5efe6]">
                {item.title}
              </p>

              <p className="mt-0.5 text-[10px] text-[#f5efe6]/35">
                {item.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CartProductRow({
  item,
  updateQuantity,
  removeProduct,
}: {
  item: CartItem
  updateQuantity: (
    productId: string,
    weight: number,
    quantity: number
  ) => void
  removeProduct: (
    productId: string,
    weight: number
  ) => void
}) {
  const { product, variant, quantity } = item

  return (
    <article className="grid min-w-0 grid-cols-[64px_minmax(0,1fr)_auto] gap-x-3 gap-y-3 border-b border-white/[0.07] py-4 last:border-b-0 sm:grid-cols-[72px_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-x-4">
      <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#211611] to-[#0d0c0b] sm:h-[72px] sm:w-[72px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,164,95,0.12),transparent_70%)]" />

        <Image
          src={product.image_url}
          alt={product.name}
          width={72}
          height={72}
          className="relative h-full w-full object-contain p-1.5"
        />
      </div>

      <div className="min-w-0">
        <h3 className="truncate text-sm font-semibold text-[#f5efe6] sm:text-base">
          {product.name}
        </h3>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#f5efe6]/45">
            {formatWeight(variant.weight_grams)}
          </span>

          <span className="text-[10px] text-[#f5efe6]/30">
            ₹{variant.price} each
          </span>
        </div>
      </div>

      <p className="shrink-0 text-right font-display text-lg text-[#d9b56f] sm:order-4 sm:min-w-[75px]">
        ₹{variant.price * quantity}
      </p>

      <div className="col-span-2 col-start-2 flex items-center justify-between gap-3 sm:col-span-1 sm:col-start-auto sm:order-3 sm:justify-start">
        <div className="flex shrink-0 items-center rounded-lg border border-white/10 bg-black/30 p-1">
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() =>
              updateQuantity(
                product.id,
                variant.weight_grams,
                quantity - 1
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#f5efe6]/45 transition-colors hover:bg-white/5 hover:text-[#d9b56f]"
          >
            <Minus size={12} />
          </button>

          <span className="w-7 text-center text-xs font-bold text-[#f5efe6]">
            {quantity}
          </span>

          <button
            type="button"
            aria-label={`Increase ${product.name} quantity`}
            onClick={() =>
              updateQuantity(
                product.id,
                variant.weight_grams,
                quantity + 1
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#f5efe6]/45 transition-colors hover:bg-white/5 hover:text-[#d9b56f]"
          >
            <Plus size={12} />
          </button>
        </div>

        <button
          type="button"
          aria-label={`Remove ${product.name}`}
          onClick={() =>
            removeProduct(
              product.id,
              variant.weight_grams
            )
          }
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[#f5efe6]/25 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  )
}

function OrderSuccess({
  orderId,
  orderData,
  orderItems,
  orderTotals,
  openWhatsApp,
}: {
  orderId: string
  orderData: CheckoutFormData
  orderItems: CartItem[]
  orderTotals: OrderTotals | null
  openWhatsApp: () => void
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0b0a09] pb-16 pt-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-[#6b1a1a]/15 blur-[100px]" />
        <div className="absolute -left-32 top-72 h-80 w-80 rounded-full bg-[#c9a45f]/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6">
        <div className="rounded-3xl border border-white/10 bg-[#11100f]/95 p-5 shadow-2xl shadow-black/40 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-400/20 bg-green-400/10 text-green-300">
              <CheckCircle2 size={36} />
            </div>

            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c9a45f]">
              Order request received
            </p>

            <h1 className="font-display text-3xl uppercase text-[#f5efe6] sm:text-5xl">
              Thank You
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#f5efe6]/45">
              Your order has been saved. Continue to WhatsApp
              so we can confirm availability and delivery.
            </p>

            <div className="mx-auto mt-5 inline-flex rounded-full border border-[#c9a45f]/20 bg-[#c9a45f]/10 px-4 py-2 font-mono text-xs tracking-wider text-[#d9b56f]">
              Order #{orderId}
            </div>
          </div>

          <div className="my-8 border-t border-white/10" />

          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={`${item.product.id}-${item.variant.weight_grams}`}
                className="flex min-w-0 items-center gap-3"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-contain p-1"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[#f5efe6]">
                    {item.product.name}
                  </p>

                  <p className="text-[10px] text-[#f5efe6]/35">
                    {formatWeight(
                      item.variant.weight_grams
                    )}{' '}
                    × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-[#d9b56f]">
                  ₹
                  {item.variant.price *
                    item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="my-6 border-t border-white/10" />

          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#f5efe6]/40">
              Order total
            </span>

            <span className="font-display text-3xl text-[#d9b56f]">
              ₹{orderTotals?.total.toFixed(0) || '0'}
            </span>
          </div>

          <button
            type="button"
            onClick={openWhatsApp}
            className="mt-8 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#278c4d] px-5 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#31a75c]"
          >
            <MessageCircle size={18} />
            Confirm on WhatsApp
          </button>

          <Link
            href="/shop"
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 text-xs font-bold uppercase tracking-[0.16em] text-[#f5efe6]/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
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

  const [checkoutStep, setCheckoutStep] =
    useState<'cart' | 'delivery'>('cart')

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [orderData, setOrderData] =
    useState<CheckoutFormData | null>(null)
  const [lastOrderItems, setLastOrderItems] =
    useState<CartItem[]>([])
  const [lastOrderTotals, setLastOrderTotals] =
    useState<OrderTotals | null>(null)
  const [whatsappMessage, setWhatsappMessage] =
    useState('')
  const [promoInput, setPromoInput] = useState('')
  const [promoError, setPromoError] = useState('')
  const [applyingPromo, setApplyingPromo] =
    useState(false)

  const subtotal = totalAmount()

  const currentTotals = calculateOrderTotal(
    subtotal,
    appliedPromoCode
  ) as OrderTotals

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      customer_address: '',
      customer_city: '',
      customer_pincode: '',
      notes: '',
    },
  })

  const watchedData = watch()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)

        if (userData) {
          reset({
            customer_name: userData.full_name || '',
            customer_email: userData.email || '',
            customer_phone: userData.phone || '',
            customer_address: userData.address || '',
            customer_city: userData.city || '',
            customer_pincode: userData.pincode || '',
            notes: '',
          })
        }
      } catch (error) {
        console.error(
          'Unable to load customer details:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    void loadUser()
  }, [reset])

  const createWhatsAppMessage = (
    customer: CheckoutFormData,
    generatedOrderId: string,
    orderItems: CartItem[],
    totals: OrderTotals
  ) => {
    const products = orderItems
      .map(
        (item) =>
          `• ${item.product.name} (${formatWeight(
            item.variant.weight_grams
          )}) × ${item.quantity} = ₹${
            item.variant.price * item.quantity
          }`
      )
      .join('\n')

    return encodeURIComponent(
`🛒 NEW ORDER

Order ID: ${generatedOrderId}

Customer Details:
Name: ${customer.customer_name}
Phone: ${customer.customer_phone}
Email: ${customer.customer_email}

Delivery Address:
${customer.customer_address}
${customer.customer_city} - ${customer.customer_pincode}

Products:
${products}

${totals.discount > 0 ? `Discount: -₹${totals.discount}\n` : ''}Total Amount: ₹${totals.total}

${customer.notes ? `Notes: ${customer.notes}` : ''}

Please confirm this order.`
    )
  }

  const openWhatsApp = () => {
    if (!whatsappMessage) return

    window.location.href =
      `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`
  }

  const handleApplyPromo = async () => {
    const code = promoInput.trim()

    if (!code) return

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

      const promoCode =
        await validateAndApplyPromoCode(
          code,
          user,
          customerData
        )

      if (!promoCode) {
        setPromoError('Invalid or expired promo code')
        return
      }

      applyPromoCode(promoCode)
      setPromoInput('')
      toast.success('Promo code applied')
    } catch (error) {
      console.error('Promo code error:', error)
      setPromoError('Unable to apply this promo code')
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    applyPromoCode(null)
    toast.success('Promo code removed')
  }

  const onSubmit = async (
    customer: CheckoutFormData
  ) => {
    if (items.length === 0) {
      toast.error('Your cart is empty')
      setCheckoutStep('cart')
      return
    }

    const currentItems = [...items]

    const currentSubtotal = currentItems.reduce(
      (total, item) =>
        total +
        item.variant.price * item.quantity,
      0
    )

    const totals = calculateOrderTotal(
      currentSubtotal,
      appliedPromoCode
    ) as OrderTotals

    try {
      if (appliedPromoCode) {
        try {
          await incrementPromoCodeUsage(
            appliedPromoCode.code,
            user,
            {
              email: customer.customer_email,
              phone: customer.customer_phone,
            }
          )
        } catch (error) {
          console.warn(
            'Unable to update promo usage:',
            error
          )
        }
      }

      if (user) {
        try {
          await updateUserProfile({
            full_name: customer.customer_name,
            phone: customer.customer_phone,
            address: customer.customer_address,
            city: customer.customer_city,
            pincode: customer.customer_pincode,
          })
        } catch (error) {
          console.warn(
            'Unable to update profile:',
            error
          )
        }
      }

      const payload: PlaceOrderPayload = {
        customer_name: customer.customer_name,
        customer_phone: customer.customer_phone,
        customer_email: customer.customer_email,
        customer_address:
          customer.customer_address,
        customer_city: customer.customer_city,
        customer_pincode:
          customer.customer_pincode,
        notes: customer.notes,
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

      const generatedOrderId = String(
        result.order.id
      )

      const message = createWhatsAppMessage(
        customer,
        generatedOrderId,
        currentItems,
        totals
      )

      setOrderId(generatedOrderId)
      setOrderData(customer)
      setLastOrderItems(currentItems)
      setLastOrderTotals(totals)
      setWhatsappMessage(message)
      setSubmitted(true)
      clearCart()

      window.setTimeout(() => {
        window.location.href =
          `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
      }, 700)
    } catch (error) {
      console.error('Order failed:', error)

      toast.error(
        'We could not place your order. Please try again.'
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#0b0a09] px-4">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#c9a45f]" />

          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
            Preparing your cart
          </p>
        </div>
      </div>
    )
  }

  if (submitted && orderData) {
    return (
      <OrderSuccess
        orderId={orderId}
        orderData={orderData}
        orderItems={lastOrderItems}
        orderTotals={lastOrderTotals}
        openWhatsApp={openWhatsApp}
      />
    )
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#0b0a09] pb-20 pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-[#6b1a1a]/15 blur-[120px]" />

        <div className="absolute -left-40 top-[520px] h-[380px] w-[380px] rounded-full bg-[#c9a45f]/10 blur-[120px]" />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a45f]/30 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 sm:mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2 text-[#c9a45f]">
                <Sparkles size={14} />

                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Qureshi&apos;s Order Desk
                </span>
              </div>

              <h1 className="break-words font-display text-4xl uppercase leading-none text-[#f5efe6] sm:text-5xl md:text-6xl">
                {checkoutStep === 'cart'
                  ? 'Your Cart'
                  : 'Place Your Order'}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#f5efe6]/40 sm:text-base">
                {checkoutStep === 'cart'
                  ? 'Review your masalas, adjust quantities and continue when everything looks right.'
                  : 'Add your delivery details. We will save the order and confirm everything with you on WhatsApp.'}
              </p>
            </div>

            <CheckoutProgress
              currentStep={checkoutStep}
            />
          </div>
        </header>

        <TrustStrip />

        {checkoutStep === 'cart' ? (
          <div className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            <section className="min-w-0 lg:col-span-8">
              {!user && (
                <div className="mb-5 overflow-hidden rounded-2xl border border-[#c9a45f]/15 bg-gradient-to-r from-[#6b1a1a]/15 to-[#c9a45f]/5 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#f5efe6]">
                        Returning customer?
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[#f5efe6]/40">
                        Sign in to automatically fill your
                        saved delivery details.
                      </p>
                    </div>

                    <div className="flex w-full gap-2 sm:w-auto">
                      <Link
                        href="/login"
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl border border-white/10 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f5efe6]/65 transition-colors hover:bg-white/5 hover:text-white sm:flex-none"
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#c9a45f] px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#130d08] transition-colors hover:bg-[#e0bd77] sm:flex-none"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#11100f]/90 px-5 text-center shadow-xl shadow-black/20">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#c9a45f]/20 bg-[#c9a45f]/10 text-[#c9a45f]">
                    <ShoppingBag size={32} />
                  </div>

                  <h2 className="font-display text-3xl uppercase text-[#f5efe6]">
                    Your cart is empty
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#f5efe6]/40">
                    Explore our handcrafted masalas and add
                    your favourites to begin an order.
                  </p>

                  <Link
                    href="/shop"
                    className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c9a45f] px-7 text-[10px] font-bold uppercase tracking-[0.18em] text-[#130d08] transition-colors hover:bg-[#e0bd77]"
                  >
                    Explore Products
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[#11100f]/90 shadow-xl shadow-black/20">
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a45f]">
                        Selected products
                      </p>

                      <p className="mt-1 text-xs text-[#f5efe6]/35">
                        {items.length}{' '}
                        {items.length === 1
                          ? 'product'
                          : 'products'}{' '}
                        in your cart
                      </p>
                    </div>

                    <ShoppingBag
                      size={20}
                      className="text-[#c9a45f]/60"
                    />
                  </div>

                  <div className="min-w-0 px-4 sm:px-6">
                    {items.map((item) => (
                      <CartProductRow
                        key={`${item.product.id}-${item.variant.weight_grams}`}
                        item={item}
                        updateQuantity={updateQty}
                        removeProduct={removeItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>

            {items.length > 0 && (
              <aside className="min-w-0 lg:col-span-4">
                <div className="lg:sticky lg:top-24">
                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11100f]/95 shadow-2xl shadow-black/30">
                    <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-[#6b1a1a]/30 to-[#c9a45f]/10 px-5 py-6">
                      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[#c9a45f]/10" />

                      <p className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a45f]">
                        Order total
                      </p>

                      <div className="relative mt-2 flex items-end justify-between gap-4">
                        <span className="text-xs text-[#f5efe6]/40">
                          Estimated amount
                        </span>

                        <span className="font-display text-4xl leading-none text-[#e0bd77]">
                          ₹{currentTotals.total.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-5 p-5">
                      {appliedPromoCode ? (
                        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-green-400/15 bg-green-400/[0.06] p-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-400/10 text-green-300">
                              <Gift size={15} />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate font-mono text-xs font-bold text-green-300">
                                {appliedPromoCode.code}
                              </p>

                              <p className="mt-0.5 text-[10px] text-green-200/45">
                                Promo code applied
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            aria-label="Remove promo code"
                            onClick={handleRemovePromo}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white/30 hover:bg-white/5 hover:text-white"
                          >
                            <X size={13} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label
                            htmlFor="promo-code"
                            className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5efe6]/40"
                          >
                            <Gift size={13} />
                            Have a promo code?
                          </label>

                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
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
                              className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 text-xs uppercase tracking-[0.12em] text-[#f5efe6] outline-none placeholder:text-white/15 focus:border-[#c9a45f]/60"
                            />

                            <button
                              type="button"
                              onClick={handleApplyPromo}
                              disabled={applyingPromo}
                              className="min-h-11 shrink-0 rounded-xl border border-[#c9a45f]/20 bg-[#c9a45f]/10 px-5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9b56f] transition-colors hover:bg-[#c9a45f]/15 disabled:opacity-40"
                            >
                              {applyingPromo
                                ? 'Checking...'
                                : 'Apply'}
                            </button>
                          </div>

                          {promoError && (
                            <p className="text-[10px] text-red-300">
                              {promoError}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="space-y-3 border-t border-white/10 pt-5">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-[#f5efe6]/40">
                            Subtotal
                          </span>

                          <span className="text-sm font-semibold text-[#f5efe6]/75">
                            ₹
                            {currentTotals.subtotal.toFixed(
                              0
                            )}
                          </span>
                        </div>

                        {currentTotals.discount > 0 && (
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-green-300/60">
                              Discount
                            </span>

                            <span className="text-sm font-semibold text-green-300/70">
                              -₹
                              {currentTotals.discount.toFixed(
                                0
                              )}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5efe6]/50">
                            Total
                          </span>

                          <span className="font-display text-2xl text-[#e0bd77]">
                            ₹{currentTotals.total.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setCheckoutStep('delivery')
                          window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                          })
                        }}
                        className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#c9a45f] px-5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#130d08] transition-colors hover:bg-[#e0bd77]"
                      >
                        Continue to Delivery
                        <ArrowRight size={15} />
                      </button>

                      <div className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                        <MessageCircle
                          size={15}
                          className="mt-0.5 shrink-0 text-[#278c4d]"
                        />

                        <p className="text-[10px] leading-5 text-[#f5efe6]/35">
                          No payment is collected here. Your
                          order will be confirmed directly on
                          WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8"
          >
            <section className="min-w-0 lg:col-span-8">
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart')
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
                className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f5efe6]/50 transition-colors hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft size={14} />
                Back to Cart
              </button>

              <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11100f]/95 shadow-xl shadow-black/20">
                <div className="border-b border-white/10 bg-gradient-to-r from-[#6b1a1a]/15 to-transparent px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c9a45f]/10 text-[#c9a45f]">
                      <MapPin size={17} />
                    </span>

                    <div>
                      <h2 className="font-display text-xl uppercase text-[#f5efe6] sm:text-2xl">
                        Delivery Details
                      </h2>

                      <p className="mt-1 text-[10px] text-[#f5efe6]/35">
                        Where should we deliver your order?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="min-w-0 space-y-5 p-5 sm:p-7">
                  <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                    <CheckoutInput
                      id="customer_name"
                      label="Full name"
                      placeholder="Your full name"
                      autoComplete="name"
                      register={register}
                      errors={errors}
                    />

                    <CheckoutInput
                      id="customer_phone"
                      label="Phone / WhatsApp"
                      type="tel"
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      register={register}
                      errors={errors}
                    />
                  </div>

                  <CheckoutInput
                    id="customer_email"
                    label="Email address"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    register={register}
                    errors={errors}
                  />

                  <div className="min-w-0 space-y-2">
                    <label
                      htmlFor="customer_address"
                      className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7c8b3]/55"
                    >
                      Complete delivery address
                    </label>

                    <textarea
                      id="customer_address"
                      rows={4}
                      autoComplete="street-address"
                      placeholder="House number, street, landmark and area"
                      {...register('customer_address')}
                      className={`w-full min-w-0 resize-none rounded-xl border bg-[#11100f] px-4 py-3 text-sm leading-6 text-[#f5efe6] outline-none placeholder:text-[#f5efe6]/20 ${
                        errors.customer_address
                          ? 'border-red-400/50 focus:border-red-400'
                          : 'border-white/10 focus:border-[#c9a45f]/70'
                      }`}
                    />

                    {errors.customer_address && (
                      <p className="text-[11px] text-red-300">
                        {
                          errors.customer_address
                            .message
                        }
                      </p>
                    )}
                  </div>

                  <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2">
                    <CheckoutInput
                      id="customer_city"
                      label="City"
                      placeholder="Your city"
                      autoComplete="address-level2"
                      register={register}
                      errors={errors}
                    />

                    <CheckoutInput
                      id="customer_pincode"
                      label="Pincode"
                      placeholder="571201"
                      autoComplete="postal-code"
                      register={register}
                      errors={errors}
                    />
                  </div>

                  <div className="min-w-0 space-y-2">
                    <label
                      htmlFor="notes"
                      className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d7c8b3]/55"
                    >
                      Order notes{' '}
                      <span className="normal-case tracking-normal text-white/20">
                        (optional)
                      </span>
                    </label>

                    <textarea
                      id="notes"
                      rows={3}
                      placeholder="Delivery instructions or anything we should know"
                      {...register('notes')}
                      className="w-full min-w-0 resize-none rounded-xl border border-white/10 bg-[#11100f] px-4 py-3 text-sm leading-6 text-[#f5efe6] outline-none placeholder:text-[#f5efe6]/20 focus:border-[#c9a45f]/70"
                    />
                  </div>
                </div>
              </div>
            </section>

            <aside className="min-w-0 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#11100f]/95 shadow-2xl shadow-black/30">
                  <div className="border-b border-white/10 px-5 py-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a45f]">
                      Final Summary
                    </p>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="max-h-60 space-y-3 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div
                          key={`${item.product.id}-${item.variant.weight_grams}`}
                          className="flex min-w-0 items-center gap-3"
                        >
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                            <Image
                              src={
                                item.product.image_url
                              }
                              alt={item.product.name}
                              width={44}
                              height={44}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-[#f5efe6]/80">
                              {item.product.name}
                            </p>

                            <p className="mt-0.5 text-[9px] text-[#f5efe6]/30">
                              {formatWeight(
                                item.variant
                                  .weight_grams
                              )}{' '}
                              × {item.quantity}
                            </p>
                          </div>

                          <span className="shrink-0 text-xs font-semibold text-[#d9b56f]">
                            ₹
                            {item.variant.price *
                              item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-4">
                      {currentTotals.discount > 0 && (
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-xs text-green-300/60">
                            Discount
                          </span>

                          <span className="text-xs font-semibold text-green-300/70">
                            -₹
                            {currentTotals.discount.toFixed(
                              0
                            )}
                          </span>
                        </div>
                      )}

                      <div className="flex items-end justify-between gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f5efe6]/45">
                          Total
                        </span>

                        <span className="font-display text-3xl leading-none text-[#e0bd77]">
                          ₹{currentTotals.total.toFixed(0)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#278c4d] px-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#31a75c] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MessageCircle size={17} />

                      {isSubmitting
                        ? 'Placing Order...'
                        : 'Place Order on WhatsApp'}
                    </button>

                    <div className="space-y-3 border-t border-white/10 pt-4">
                      <div className="flex items-center gap-3">
                        <Truck
                          size={15}
                          className="shrink-0 text-[#c9a45f]"
                        />

                        <p className="text-[10px] leading-5 text-[#f5efe6]/35">
                          Delivery details are confirmed
                          directly with our team.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <ShieldCheck
                          size={15}
                          className="shrink-0 text-[#c9a45f]"
                        />

                        <p className="text-[10px] leading-5 text-[#f5efe6]/35">
                          No payment information is collected
                          on this website.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  )
}