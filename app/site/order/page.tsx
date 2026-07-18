'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle, 
  MapPin, 
  ShoppingBag,
  ChevronRight
} from 'lucide-react'
import { useCart } from '@/lib/cart'
import { placeOrder } from '@/lib/actions'
import type { PlaceOrderPayload } from '@/types'

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

const formatWeight = (grams: number) => {
  if (grams >= 1000) {
    return `${grams / 1000}kg`
  }
  return `${grams}g`
}

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
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      {...register(id)}
      className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600"
    />
    {errors[id] && <p className="text-red-400 text-xs">{errors[id]?.message}</p>}
  </div>
)

export default function OrderPage() {
  const { items, updateQty, removeItem, clearCart, totalAmount } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [orderId, setOrderId] = useState('')
  const total = totalAmount()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    try {
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
      const order = await placeOrder(payload)
      clearCart()
      setOrderId(order.id.slice(0, 8).toUpperCase())
      setSubmitted(true)
    } catch (e) {
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 bg-zinc-950">
        <div className="text-center max-w-md w-full">
          <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-gold" />
          </div>
          
          <h1 className="font-display text-3xl md:text-4xl uppercase text-white mb-3">Order Placed!</h1>
          <p className="text-zinc-500 text-lg mb-10">Your order <span className="text-gold font-mono">#{orderId}</span> has been received.</p>
          
          <a
            href="/"
            className="inline-block w-full bg-gold text-black px-6 py-3.5 text-sm font-bold tracking-wide uppercase hover:bg-white transition-colors rounded-lg"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl uppercase text-white mb-2">Checkout</h1>
          <p className="text-zinc-500">Complete your order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-800">
                  <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">Your Cart</h2>
                </div>
                
                {items.length === 0 ? (
                  <div className="p-10 text-center">
                    <ShoppingBag size={32} className="text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-600 text-sm mb-4">Your cart is empty.</p>
                    <a 
                      href="/" 
                      className="inline-flex items-center gap-2 text-gold hover:text-white transition-colors text-sm uppercase tracking-wide"
                    >
                      Browse products <ChevronRight size={14} />
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-800">
                    <AnimatePresence>
                      {items.map(({ product: p, variant: v, quantity: q }) => (
                        <motion.div
                          key={`${p.id}-${v.weight_grams}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="p-4 flex items-center gap-3"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
                            <Image 
                              src={p.image_url} 
                              alt={p.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{p.name}</div>
                            <div className="text-xs text-zinc-500">{formatWeight(v.weight_grams)}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-0.5">
                                <button 
                                  onClick={() => updateQty(p.id, v.weight_grams, q - 1)} 
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                >
                                  <Minus size={10} />
                                </button>
                                <span className="text-xs w-5 text-center text-white font-medium">{q}</span>
                                <button 
                                  onClick={() => updateQty(p.id, v.weight_grams, q + 1)} 
                                  className="w-6 h-6 rounded-md flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                                >
                                  <Plus size={10} />
                                </button>
                              </div>
                              <button 
                                onClick={() => removeItem(p.id, v.weight_grams)} 
                                className="text-zinc-600 hover:text-red-400 transition-colors ml-auto"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-white">₹{(v.price * q).toFixed(0)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <div className="p-5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-zinc-400 uppercase tracking-widest font-medium">Total</span>
                        <span className="font-display text-2xl text-gold">₹{total.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-zinc-800">
                <h2 className="text-xs font-bold tracking-widest uppercase text-zinc-500">Delivery Details</h2>
              </div>
              
              <div className="p-5 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField id="customer_name" label="Full Name" placeholder="Your name" register={register} errors={errors} />
                  <InputField id="customer_phone" label="Phone (WhatsApp)" type="tel" placeholder="+91 98765 43210" register={register} errors={errors} />
                </div>
                
                <InputField id="customer_email" label="Email" type="email" placeholder="you@email.com" register={register} errors={errors} />

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Delivery Address</label>
                  <textarea
                    {...register('customer_address')}
                    rows={3}
                    placeholder="House number, street, landmark..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600 resize-none"
                  />
                  {errors.customer_address && <p className="text-red-400 text-xs">{errors.customer_address?.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField id="customer_city" label="City" placeholder="City name" register={register} errors={errors} />
                  <InputField id="customer_pincode" label="Pincode" placeholder="571201" register={register} errors={errors} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">Notes (Optional)</label>
                  <textarea
                    {...register('notes')}
                    rows={2}
                    placeholder="Any delivery instructions..."
                    className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-600 resize-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || items.length === 0}
              className="w-full bg-gold text-black py-4 font-bold text-sm tracking-wide uppercase hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Placing Order...
                </span>
              ) : (
                `Place Order · ₹${total.toFixed(0)}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
