import type { CartItem, PromoCode } from '@/types'
import { formatWeight } from './product-utils'
import { calculateOrderTotal } from './utils'
import { WHATSAPP_NUMBER } from './site-config'

export type CheckoutCustomerDetails = {
  customer_name: string
  customer_phone: string
  customer_email?: string
  customer_address: string
  customer_city: string
  customer_pincode: string
  notes?: string
}

export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: CheckoutCustomerDetails,
  promoCode: PromoCode | null = null,
  orderId?: string
): string {
  const subtotal = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
  const { discount, total } = calculateOrderTotal(subtotal, promoCode)

  const lines = items.map((item, index) => {
    const lineTotal = item.variant.price * item.quantity
    return `${index + 1}. ${item.product.name} — ${formatWeight(item.variant.weight_grams)} × ${item.quantity} — ₹${item.variant.price} each — ₹${lineTotal}`
  })

  const parts = [
    "Hello Qureshi's Masala & Spices,",
    '',
    'I would like to place an order.',
    '',
    ...(orderId ? [`Order Reference: ${orderId}`, ''] : []),
    'Customer Details:',
    `Name: ${customer.customer_name}`,
    `Phone: ${customer.customer_phone}`,
    ...(customer.customer_email ? [`Email: ${customer.customer_email}`] : []),
    `Address: ${customer.customer_address}`,
    `City: ${customer.customer_city}`,
    `Postal Code: ${customer.customer_pincode}`,
    '',
    'Order Details:',
    '',
    ...lines,
    '',
    ...(discount > 0 ? [`Discount: -₹${discount}`, ''] : []),
    `Total: ₹${total}`,
    '',
    ...(customer.notes?.trim() ? [`Order Notes:`, customer.notes.trim(), ''] : []),
    'Please confirm product availability, delivery charges and order details.',
  ]

  return parts.join('\n')
}

export function getWhatsAppOrderUrl(message: string, phone = WHATSAPP_NUMBER): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export async function openWhatsAppCheckout(message: string): Promise<boolean> {
  const url = getWhatsAppOrderUrl(message)

  try {
    window.location.href = url
    return true
  } catch {
    return false
  }
}

export async function copyOrderDetails(message: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(message)
    return true
  } catch {
    return false
  }
}
