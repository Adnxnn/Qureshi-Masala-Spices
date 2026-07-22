import 'server-only'

import type { Database, PlaceOrderPayload } from '@/types'
import { formatWeight } from './product-utils'

type NewOrderAlertInput = {
  order: Database['public']['Tables']['orders']['Row']
  formData: PlaceOrderPayload
}

const DEFAULT_GRAPH_API_VERSION = 'v23.0'
const DEFAULT_TEMPLATE_NAME = 'new_order_alert'
const DEFAULT_TEMPLATE_LANGUAGE = 'en_US'

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

function templateText(value: unknown, maxLength: number) {
  const cleaned = String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()

  if (!cleaned) return 'None'
  if (cleaned.length <= maxLength) return cleaned

  return `${cleaned.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`
}

function buildProductSummary(formData: PlaceOrderPayload) {
  return formData.items
    .map((item) => {
      const lineTotal = item.variant.price * item.quantity

      return `${item.product.name} (${formatWeight(item.variant.weight_grams)}) x ${item.quantity} = ₹${lineTotal}`
    })
    .join('; ')
}

export async function sendNewOrderWhatsAppAlert({
  order,
  formData,
}: NewOrderAlertInput): Promise<boolean> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim()
  const phoneNumberId = digitsOnly(
    process.env.WHATSAPP_PHONE_NUMBER_ID ?? '',
  )
  const adminNumber = digitsOnly(process.env.WHATSAPP_ADMIN_NUMBER ?? '')

  if (!accessToken || !phoneNumberId || !adminNumber) {
    console.error(
      '[WhatsApp alert] WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ADMIN_NUMBER must be configured',
    )
    return false
  }

  const graphApiVersion =
    process.env.WHATSAPP_GRAPH_API_VERSION?.trim() ||
    DEFAULT_GRAPH_API_VERSION
  const templateName =
    process.env.WHATSAPP_ORDER_TEMPLATE_NAME?.trim() ||
    DEFAULT_TEMPLATE_NAME
  const templateLanguage =
    process.env.WHATSAPP_ORDER_TEMPLATE_LANGUAGE?.trim() ||
    DEFAULT_TEMPLATE_LANGUAGE

  const deliveryAddress = [
    formData.customer_address,
    formData.customer_city,
    formData.customer_pincode,
  ]
    .filter(Boolean)
    .join(', ')

  const bodyParameters = [
    templateText(order.id, 64),
    templateText(formData.customer_name, 80),
    templateText(formData.customer_phone, 32),
    templateText(deliveryAddress, 220),
    templateText(buildProductSummary(formData), 420),
    templateText(order.total_amount, 32),
    templateText(formData.notes, 140),
  ].map((text) => ({ type: 'text', text }))

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: adminNumber,
    type: 'template',
    template: {
      name: templateName,
      language: { code: templateLanguage },
      components: [
        {
          type: 'body',
          parameters: bodyParameters,
        },
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: '0',
          parameters: [
            { type: 'payload', payload: `order:confirm:${order.id}` },
          ],
        },
        {
          type: 'button',
          sub_type: 'quick_reply',
          index: '1',
          parameters: [
            { type: 'payload', payload: `order:reject:${order.id}` },
          ],
        },
      ],
    },
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        cache: 'no-store',
        signal: AbortSignal.timeout(8000),
      },
    )

    if (!response.ok) {
      const responseBody = await response.text()
      console.error(
        `[WhatsApp alert] Meta rejected order ${order.id}: ${response.status} ${responseBody.slice(0, 500)}`,
      )
      return false
    }

    return true
  } catch (error) {
    console.error(`[WhatsApp alert] Failed for order ${order.id}:`, error)
    return false
  }
}
