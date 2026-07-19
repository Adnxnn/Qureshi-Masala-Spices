'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  Gift
} from 'lucide-react'
import { useCart } from '@/lib/cart'
import { placeOrder, getCurrentUser, updateUserProfile, validateAndApplyPromoCode, incrementPromoCodeUsage } from '@/lib/actions'
import { calculateOrderTotal } from '@/lib/utils'
import type { User, PlaceOrderPayload, PromoCode } from '@/types'

const formatWeight = (grams: number) => {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }
  return `${grams}g`
}

const WHATSAPP_NUMBER = '918904951364'

const schema = z.object({
  customer_name:    z.string().min(2, 'Name is required'),
  customer_phone:   z.string().min(10, 'Valid phone required').max(13),
  customer_email:   z.string().email('Valid email required'),
  customer_address: z.string().min(10, 'Full address required'),
  customer_city:    z.string().min(2, 'City required'),
  customer_pincode: z.string().length(6, '6-digit pincode required'),
  notes:            z.string().optional(),
})
type FormData = z.infer<typeof schema>

const InputField = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder = '',
  register,
  errors
}: { 
  id: keyof FormData, 
  label: string, 
  type?: string, 
  placeholder?: string,
  register: any,
  errors: any
}) => (
  <div className="space-y-2">
    <label className="text-[10px] sm:text-xs font-medium text-[#E8E0D5]/40 uppercase tracking-[0.25em]">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(id)}
      className="w-full bg-[#151515] border border-[#252525] text-[#E8E0D5] px-4 sm:px-6 py-3.5 sm:py-4.5 rounded-2xl text-sm focus:outline-none focus:border-[#BFA068]/60 focus:shadow-[0_0_30px_rgba(191,160,104,0.15)] transition-all duration-300 placeholder:text-[#E8E0D5]/15"
    />
    {errors[id] && <p className="text-[#BFA068]/80 text-[10px] sm:text-xs mt-1.5">{errors[id]?.message}</p>}
  </div>
)

export default function OrderPage() {
  const { items, updateQty, removeItem, clearCart, totalAmount, appliedPromoCode, applyPromoCode } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<FormData | null>(null)
  const [lastOrderItems, setLastOrderItems] = useState<any[]>([])
  const [lastOrderTotals, setLastOrderTotals] = useState<{ subtotal: number; deliveryCharge: number; discount: number; total: number } | null>(null)
  const [promoInput, setPromoInput] = useState('')
  const [applyingPromo, setApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'delivery'>('cart')
  const subtotal = totalAmount()
  const { subtotal: displaySubtotal, discount, total: grandTotal } = calculateOrderTotal(subtotal, appliedPromoCode)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const watchedData = watch()

  useEffect(() => {
    async function loadUser() {
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
      setLoading(false)
    }
    loadUser()
  }, [reset])

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return
    
    setApplyingPromo(true)
    setPromoError('')
    
    try {
      const customerData = watchedData.customer_email && watchedData.customer_phone 
        ? { email: watchedData.customer_email, phone: watchedData.customer_phone }
        : undefined
        
      const promoCode = await validateAndApplyPromoCode(promoInput.trim(), user, customerData)
      if (promoCode) {
        applyPromoCode(promoCode)
        setPromoInput('')
        toast.success('Promo code applied successfully!')
      } else {
        setPromoError('Invalid or expired promo code')
      }
    } catch (e) {
      setPromoError('Failed to apply promo code')
    } finally {
      setApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    applyPromoCode(null)
    toast.success('Promo code removed')
  }

  const generateWhatsAppMessage = (data: FormData, orderId: string) => {
    const productsList = lastOrderItems.length > 0 ? lastOrderItems.map(item => 
      `• ${item.product.name} (${formatWeight(item.variant.weight_grams)}) × ${item.quantity} = ₹${item.variant.price * item.quantity}`
    ).join('\n') : items.map(item => 
      `• ${item.product.name} (${formatWeight(item.variant.weight_grams)}) × ${item.quantity} = ₹${item.variant.price * item.quantity}`
    ).join('\n')

    const orderTotals = lastOrderTotals || calculateOrderTotal(subtotal, appliedPromoCode)

    return encodeURIComponent(
`🛒 NEW ORDER

Order ID: ${orderId}

Customer Details:
Name: ${data.customer_name}
Phone: ${data.customer_phone}
Email: ${data.customer_email}

Delivery Address:
${data.customer_address}
${data.customer_city} - ${data.customer_pincode}

Products:
${productsList}

${orderTotals.discount > 0 ? `Discount: -₹${orderTotals.discount}\n` : ''}
Total Amount: ₹${orderTotals.total}

${data.notes ? `Notes: ${data.notes}` : ''}

Please confirm this order.`
    )
  }

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    try {
      setLastOrderItems([...items])
      const currentSubtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
      const orderTotals = calculateOrderTotal(currentSubtotal, appliedPromoCode)
      setLastOrderTotals(orderTotals)

      if (appliedPromoCode) {
        try {
          await incrementPromoCodeUsage(appliedPromoCode.code, user, {
            email: data.customer_email,
            phone: data.customer_phone
          })
        } catch (promoError) {
          console.warn('Failed to increment promo code usage:', promoError)
          // Don't block order if promo code usage fails
        }
      }

      if (user) {
        try {
          await updateUserProfile({
            full_name: data.customer_name,
            phone: data.customer_phone,
            address: data.customer_address,
            city: data.customer_city,
            pincode: data.customer_pincode
          })
        } catch (profileError) {
          console.warn('Failed to update user profile:', profileError)
          // Don't block order if updating profile fails
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
        items: items,
      }
      console.log('Placing order with payload:', payload)
      const result = await placeOrder(payload, appliedPromoCode)

      if (result.success === false) {
        console.error('Order failed:', result.error)
        toast.error(result.error)
        return
      }

      const order = result.order
      console.log('Order placed successfully:', order)
      const shortOrderId = String(order.id)
      setOrderData(data)
      setOrderId(shortOrderId)
      setSubmitted(true)
      clearCart()

      setTimeout(() => {
        const message = generateWhatsAppMessage(data, shortOrderId)
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
        window.location.href = whatsappUrl
      }, 500)
    } catch (e) {
      // Covers failures elsewhere in this block (promo/profile updates
      // are already caught individually above and won't reach here).
      console.error('Order failed with error:', e)
      toast.error('Something went wrong placing your order. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-[#111111]">
        <div className="text-center space-y-6">
          <div className="w-10 h-10 border-2 border-[#282828] border-t-[#BFA068] rounded-full animate-spin mx-auto" />
          <p className="text-[#E8E0D5]/30 text-sm tracking-[0.2em] uppercase">Loading...</p>
        </div>
      </div>
    )
  }

  if (submitted && orderData) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 pb-12 sm:pb-16 bg-[#111111]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border border-[#282828] rounded-full flex items-center justify-center mx-auto mb-6 bg-[#151515]">
              <CheckCircle size={32} className="text-[#BFA068] sm:w-12 sm:h-12" />
            </div>
            
            <h1 className="font-display text-xl sm:text-3xl uppercase text-[#E8E0D5] mb-3 sm:mb-4 tracking-[0.2em]">Order Placed</h1>
            <p className="text-[#E8E0D5]/40 text-sm">Your order <span className="text-[#BFA068] font-mono tracking-wider">#{orderId}</span> has been received.</p>
          </div>

          <div className="border border-[#282828] rounded-2xl overflow-hidden mb-8 sm:mb-10 bg-[#151515]">
            <div className="p-4 sm:p-6 border-b border-[#282828]">
              <h2 className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#BFA068]">Order Summary</h2>
            </div>
            
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="space-y-3 sm:space-y-4">
                {lastOrderItems.map(({ product: p, variant: v, quantity: q }, index) => (
                  <div 
                    key={`${p.id}-${v.weight_grams}`}
                    className="flex items-center gap-3 sm:gap-4"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                      <Image 
                        src={p.image_url} 
                        alt={p.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#E8E0D5] truncate mb-1">{p.name}</p>
                      <p className="text-xs text-[#E8E0D5]/40">{formatWeight(v.weight_grams)} × {q}</p>
                    </div>
                    <p className="text-sm font-display text-[#BFA068]">₹{(v.price * q).toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 sm:pt-6 border-t border-[#282828]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-[#E8E0D5]/50 uppercase tracking-[0.3em] font-semibold">Total</span>
                  <span className="font-display text-2xl sm:text-3xl text-[#BFA068]">₹{lastOrderTotals?.total.toFixed(0) ?? '0'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <a 
              href="/" 
              className="block w-full bg-[#BFA068] hover:bg-[#E8E0D5] text-[#111111] px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 text-center rounded-xl sm:rounded-2xl"
            >
              Back to Home
            </a>
            <button
              onClick={() => {
                const message = generateWhatsAppMessage(orderData, orderId)
                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
                window.location.href = whatsappUrl
              }}
              className="block w-full bg-[#2D8C4F] hover:bg-[#37A85E] text-white px-6 sm:px-8 py-3.5 sm:py-4 text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase transition-all duration-300 rounded-xl sm:rounded-2xl"
            >
              Share on WhatsApp
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12 sm:pb-16 bg-[#111111]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h1 className="font-display text-xl sm:text-2xl uppercase text-[#E8E0D5] tracking-[0.2em] mb-1">
                {checkoutStep === 'cart' ? 'Your Cart' : 'Delivery'}
              </h1>
              <p className="text-[#BFA068] text-xs tracking-[0.2em] uppercase">
                {checkoutStep === 'cart' ? 'Review your selection' : 'Complete your details'}
              </p>
            </div>
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-3">
              {['cart', 'delivery'].map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${(checkoutStep === step || (checkoutStep === 'delivery' && step === 'cart')) ? 'border-[#BFA068] bg-[#BFA068]/10' : 'border-[#282828] bg-[#151515]'}`}>
                    <span className={`text-xs font-semibold ${(checkoutStep === step || (checkoutStep === 'delivery' && step === 'cart')) ? 'text-[#BFA068]' : 'text-[#E8E0D5]/30'}`}>
                      {index + 1}
                    </span>
                  </div>
                  {index < 1 && (
                    <div className={`w-14 h-px transition-all duration-300 ${checkoutStep === 'delivery' ? 'bg-[#BFA068]' : 'bg-[#282828]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {checkoutStep === 'cart' && (
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              {!user && (
                <div className="mb-6 sm:mb-8 border border-[#282828] rounded-2xl p-4 sm:p-6 bg-[#151515]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                    <div>
                      <p className="text-[#E8E0D5] font-medium mb-1 text-sm">Faster checkout, saved details</p>
                      <p className="text-[#E8E0D5]/50 text-xs">Create an account for next time.</p>
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <a href="/login" className="border border-[#282828] hover:border-[#BFA068] text-[#E8E0D5] px-4 sm:px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] rounded-xl transition-all duration-300 hover:bg-[#1E1E1E]">
                        Login
                      </a>
                      <a href="/register" className="bg-[#BFA068] hover:bg-[#E8E0D5] text-[#111111] px-4 sm:px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] rounded-xl transition-all duration-300">
                        Sign Up
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 border border-[#282828] rounded-2xl bg-[#151515]">
                  <ShoppingBag size={36} className="text-[#BFA068]/30 mb-5" />
                  <p className="text-[#E8E0D5]/40 text-sm mb-5">Your cart is empty</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center gap-2.5 text-[#BFA068] hover:text-[#E8E0D5] text-[10px] uppercase tracking-[0.25em] font-semibold transition-all duration-300"
                  >
                    Browse Products
                    <ChevronRight size={12} strokeWidth={2} />
                  </a>
                </div>
              ) : (
                <div className="border border-[#282828] rounded-2xl overflow-hidden bg-[#151515]">
                  <div className="p-3 sm:p-5 border-b border-[#282828]">
                    <h2 className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#BFA068]">Your Cart</h2>
                  </div>
                  
                  <div className="p-2.5 sm:p-3.5">
                    {items.map(({ product: p, variant: v, quantity: q }, index) => (
                      <div
                        key={`${p.id}-${v.weight_grams}`}
                        className={`flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 ${index !== items.length - 1 ? 'border-b border-[#282828]/60' : ''}`}
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                          <Image 
                            src={p.image_url} 
                            alt={p.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-[#E8E0D5] truncate">{p.name}</h3>
                          <p className="text-[#E8E0D5]/40 text-[10px]">{formatWeight(v.weight_grams)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1 bg-[#1E1E1E] border border-[#282828] rounded-md p-0.5">
                            <button 
                              onClick={() => updateQty(p.id, v.weight_grams, q - 1)} 
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#E8E0D5]/50 hover:text-[#BFA068] transition-all duration-300 rounded-sm"
                            >
                              <Minus size={8} strokeWidth={2} />
                            </button>
                            <span className="text-[11px] sm:text-xs w-4 sm:w-5 text-center text-[#E8E0D5] font-semibold">{q}</span>
                            <button 
                              onClick={() => updateQty(p.id, v.weight_grams, q + 1)} 
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-[#E8E0D5]/50 hover:text-[#BFA068] transition-all duration-300 rounded-sm"
                            >
                              <Plus size={8} strokeWidth={2} />
                            </button>
                          </div>

                          <button 
                            onClick={() => removeItem(p.id, v.weight_grams)} 
                            className="text-[#E8E0D5]/30 hover:text-[#BFA068] transition-all duration-300"
                          >
                            <Trash2 size={12} strokeWidth={1.75} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right min-w-[60px] sm:min-w-[80px]">
                          <p className="text-sm font-display text-[#BFA068]">₹{(v.price * q).toFixed(0)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {items.length > 0 && (
              <div className="lg:col-span-4">
                <div className="sticky top-20 sm:top-24">
                  <div className="border border-[#282828] rounded-xl overflow-hidden bg-[#151515] mb-4 sm:mb-5">
                    <div className="p-3 sm:p-5 border-b border-[#282828]">
                      <h2 className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#BFA068]">Summary</h2>
                    </div>

                    <div className="p-3 sm:p-5 space-y-4 sm:space-y-5">
                      {/* Promo Code */}
                      {appliedPromoCode ? (
                        <div className="flex items-center justify-between bg-[#1E1E1E] border border-[#282828] rounded-lg p-2.5 sm:p-3.5">
                          <div className="flex items-center gap-2">
                            <Gift size={10} className="text-[#BFA068]" />
                            <div>
                              <span className="text-[#BFA068] font-mono text-[9px] font-semibold uppercase tracking-wider block">{appliedPromoCode.code}</span>
                              <span className="text-green-400/70 text-[9px]">
                                ({appliedPromoCode.type === 'percentage' ? `${appliedPromoCode.discount}%` : `₹${appliedPromoCode.discount}`} off)
                              </span>
                            </div>
                          </div>
                          <button onClick={handleRemovePromo} className="text-[#E8E0D5]/40 hover:text-[#E8E0D5] transition-all duration-300">
                            <X size={10} strokeWidth={2} />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[9px] font-medium text-[#E8E0D5]/40 uppercase tracking-[0.25em] flex items-center gap-2">
                            <Gift size={10} />
                            Promo Code
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={promoInput}
                              onChange={(e) => { setPromoInput(e.target.value); setPromoError('') }}
                              placeholder="ENTER CODE"
                              className="flex-1 bg-[#1E1E1E] border border-[#282828] text-[#E8E0D5] px-3 py-2.5 text-xs rounded-lg focus:outline-none focus:border-[#BFA068]/60 transition-all duration-300 placeholder:text-[#E8E0D5]/15 uppercase tracking-[0.15em]"
                              onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                            />
                            <button
                              onClick={handleApplyPromo}
                              disabled={applyingPromo}
                              className="bg-[#1E1E1E] border border-[#282828] text-[#BFA068] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.2em] hover:bg-[#252525] transition-all duration-300 disabled:opacity-40 rounded-lg"
                            >
                              {applyingPromo ? '...' : 'Apply'}
                            </button>
                          </div>
                          {promoError && <p className="text-[#BFA068]/80 text-[9px]">{promoError}</p>}
                        </div>
                      )}

                      {/* Totals */}
                      <div className="space-y-2 pt-1">
                        {discount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] text-[#E8E0D5]/40">Subtotal</span>
                            <span className="text-[#E8E0D5]/80 font-medium text-sm">₹{displaySubtotal.toFixed(0)}</span>
                          </div>
                        )}
                        {discount > 0 && (
                          <div className="flex justify-between items-center pb-2 border-b border-[#282828]">
                            <span className="text-[11px] text-green-400/70">Discount</span>
                            <span className="text-green-400/70 font-medium text-sm">-₹{discount.toFixed(0)}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-3">
                          <span className="text-[9px] text-[#E8E0D5]/50 uppercase tracking-[0.3em] font-semibold">Total</span>
                          <span className="font-display text-xl sm:text-2xl text-[#BFA068]">₹{grandTotal.toFixed(0)}</span>
                        </div>
                      </div>

                      {/* Proceed Button */}
                      <button
                        onClick={() => setCheckoutStep('delivery')}
                        className="w-full bg-[#BFA068] hover:bg-[#E8E0D5] text-[#111111] px-5 sm:px-6 py-3 text-[9px] font-semibold tracking-[0.3em] uppercase transition-all duration-300 rounded-lg flex items-center justify-center gap-2.5"
                      >
                        Proceed to Checkout
                        <ArrowRight size={10} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {checkoutStep === 'delivery' && (
          <div className="grid lg:grid-cols-12 gap-5 lg:gap-8">
            {/* Delivery Form */}
            <div className="lg:col-span-8">
              <button
                onClick={() => setCheckoutStep('cart')}
                className="inline-flex items-center gap-2.5 text-[#E8E0D5]/40 hover:text-[#BFA068] mb-6 sm:mb-8 transition-all duration-300"
              >
                <ArrowLeft size={14} strokeWidth={2} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">Back to Cart</span>
              </button>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
                <div className="border border-[#282828] rounded-2xl overflow-hidden bg-[#151515]">
                  <div className="p-4 sm:p-6 border-b border-[#282828]">
                    <div className="flex items-center gap-2.5">
                      <MapPin size={12} className="text-[#BFA068]" />
                      <h2 className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#BFA068]">Delivery Details</h2>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <InputField id="customer_name" label="Full Name" placeholder="Your full name" register={register} errors={errors} />
                      <InputField id="customer_phone" label="Phone (WhatsApp)" type="tel" placeholder="+91 98765 43210" register={register} errors={errors} />
                    </div>
                    
                    <InputField id="customer_email" label="Email" type="email" placeholder="you@email.com" register={register} errors={errors} />

                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-medium text-[#E8E0D5]/40 uppercase tracking-[0.25em]">Delivery Address</label>
                      <textarea
                        {...register('customer_address')}
                        rows={3}
                        placeholder="House number, street, landmark, area..."
                        className="w-full bg-[#151515] border border-[#252525] text-[#E8E0D5] px-4 sm:px-6 py-3 rounded-xl text-sm focus:outline-none focus:border-[#BFA068]/60 transition-all duration-300 placeholder:text-[#E8E0D5]/15 resize-none"
                      />
                      {errors.customer_address && <p className="text-[#BFA068]/80 text-[10px] sm:text-xs mt-1">{errors.customer_address?.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      <InputField id="customer_city" label="City" placeholder="City name" register={register} errors={errors} />
                      <InputField id="customer_pincode" label="Pincode" placeholder="571201" register={register} errors={errors} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-medium text-[#E8E0D5]/40 uppercase tracking-[0.25em]">Notes (Optional)</label>
                      <textarea
                        {...register('notes')}
                        rows={2}
                        placeholder="Any special delivery instructions..."
                        className="w-full bg-[#151515] border border-[#252525] text-[#E8E0D5] px-4 sm:px-6 py-3 rounded-xl text-sm focus:outline-none focus:border-[#BFA068]/60 transition-all duration-300 placeholder:text-[#E8E0D5]/15 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-20 sm:top-24">
                <div className="border border-[#282828] rounded-xl overflow-hidden bg-[#151515] mb-4 sm:mb-5">
                  <div className="p-3 sm:p-5 border-b border-[#282828]">
                    <h2 className="text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#BFA068]">Order Summary</h2>
                  </div>

                  <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-4">
                    <div className="space-y-2">
                      {items.map(({ product: p, variant: v, quantity: q }, index) => (
                        <div 
                          key={`${p.id}-${v.weight_grams}`}
                          className="flex items-center justify-between gap-2.5"
                        >
                          <p className="text-[11px] text-[#E8E0D5]/80 truncate flex-1">{p.name} × {q}</p>
                          <p className="text-sm font-semibold text-[#BFA068]">₹{(v.price * q).toFixed(0)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2.5 sm:pt-4 border-t border-[#282828]">
                      <div className="flex justify-between items-center py-2.5 sm:py-3">
                        <span className="text-[10px] text-[#E8E0D5]/50 uppercase tracking-[0.3em] font-semibold">Total</span>
                        <span className="font-display text-xl sm:text-2xl text-[#BFA068]">₹{grandTotal.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="w-full bg-[#2D8C4F] hover:bg-[#37A85E] text-white px-5 sm:px-6 py-3.5 sm:py-4.5 text-[10px] font-semibold tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 rounded-xl"
                >
                  <MessageCircle size={14} strokeWidth={2} />
                  {isSubmitting ? (
                    <span className="flex items-center gap-2.5">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </span>
                  ) : (
                    `Place Order · ₹${grandTotal.toFixed(0)}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}