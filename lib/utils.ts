import type { PromoCode } from '@/types'

// Helper function to calculate discount amount from promo code
export const calculateDiscount = (subtotal: number, promoCode: PromoCode | null): number => {
  if (!promoCode) return 0
  
  if (promoCode.type === 'percentage') {
    return (subtotal * promoCode.discount) / 100
  } else {
    return Math.min(promoCode.discount, subtotal) // Can't discount more than subtotal
  }
}

// Helper function to calculate order totals
export const calculateOrderTotal = (subtotal: number, promoCode: PromoCode | null = null) => {
  const deliveryCharge = 0
  const discount = calculateDiscount(subtotal, promoCode)
  const total = subtotal + deliveryCharge - discount
  
  return {
    subtotal,
    deliveryCharge,
    discount,
    total: Math.max(total, 0) // Ensure total doesn't go below 0
  }
}
