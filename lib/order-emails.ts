import 'server-only'

import type { Database, PlaceOrderPayload } from '@/types'
import { formatWeight } from './product-utils'

type OrderEmailInput = {
  order: Database['public']['Tables']['orders']['Row']
  formData: PlaceOrderPayload
}

type ResendEmail = {
  from: string
  to: string[]
  reply_to: string
  subject: string
  html: string
  text: string
}

const RESEND_EMAILS_URL = 'https://api.resend.com/emails'

function escapeHtml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function formatCurrency(value: number | string) {
  const amount = Number(value)

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0)
}

function shortOrderId(orderId: string) {
  return orderId.slice(0, 8).toUpperCase()
}

function deliveryAddress(formData: PlaceOrderPayload) {
  return [
    formData.customer_address,
    formData.customer_city,
    formData.customer_pincode,
  ]
    .filter(Boolean)
    .join(', ')
}

function itemRows(formData: PlaceOrderPayload) {
  return formData.items
    .map((item) => {
      const lineTotal = item.variant.price * item.quantity

      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #eee5d8;color:#2b2118;">
          <strong>${escapeHtml(item.product.name)}</strong><br>
          <span style="color:#76695d;font-size:13px;">${escapeHtml(formatWeight(item.variant.weight_grams))} × ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #eee5d8;text-align:right;color:#2b2118;white-space:nowrap;">${escapeHtml(formatCurrency(lineTotal))}</td>
      </tr>`
    })
    .join('')
}

function itemText(formData: PlaceOrderPayload) {
  return formData.items
    .map((item) => {
      const lineTotal = item.variant.price * item.quantity
      return `- ${item.product.name} (${formatWeight(item.variant.weight_grams)}) × ${item.quantity}: ${formatCurrency(lineTotal)}`
    })
    .join('\n')
}

function emailShell(content: string) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f5f0e8;font-family:Arial,Helvetica,sans-serif;color:#2b2118;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Qureshi's Masala &amp; Spices order update</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f0e8;padding:28px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border:1px solid #e7dccb;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#6b1a1a;padding:24px 28px;text-align:center;">
            <div style="color:#c9a84c;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Authentic • Freshly Ground • Premium Quality</div>
            <div style="color:#ffffff;font-family:Georgia,'Times New Roman',serif;font-size:25px;margin-top:8px;">Qureshi's Masala &amp; Spices</div>
          </td></tr>
          <tr><td style="padding:30px 28px;">${content}</td></tr>
          <tr><td style="background:#faf7f2;border-top:1px solid #eee5d8;padding:20px 28px;text-align:center;color:#76695d;font-size:12px;line-height:1.6;">
            Qureshi's Masala &amp; Spices<br>
            Kodagu, Karnataka • connect@qureshismasalaspices.com
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

function customerEmail({ order, formData }: OrderEmailInput, siteUrl: string) {
  const orderLabel = shortOrderId(order.id)
  const address = deliveryAddress(formData)
  const content = `
    <div style="color:#c9a84c;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">Order received</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;margin:8px 0 12px;color:#6b1a1a;">Thank you, ${escapeHtml(formData.customer_name)}.</h1>
    <p style="margin:0 0 22px;color:#5d5146;line-height:1.7;">We have received your order <strong>#${escapeHtml(orderLabel)}</strong>. We will contact you to confirm it and arrange delivery.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #eee5d8;margin-bottom:18px;">${itemRows(formData)}</table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf7f2;border:1px solid #eee5d8;border-radius:10px;margin:18px 0 24px;">
      <tr>
        <td style="padding:16px;color:#6b1a1a;font-weight:bold;">Order total</td>
        <td style="padding:16px;text-align:right;color:#6b1a1a;font-size:20px;font-weight:bold;">${escapeHtml(formatCurrency(order.total_amount))}</td>
      </tr>
    </table>
    <h2 style="font-size:16px;margin:0 0 8px;color:#2b2118;">Delivery details</h2>
    <p style="margin:0 0 22px;color:#5d5146;line-height:1.7;">${escapeHtml(address)}<br>${escapeHtml(formData.customer_phone)}</p>
    <a href="${escapeHtml(siteUrl)}" style="display:inline-block;background:#6b1a1a;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 18px;font-weight:bold;">Visit our website</a>`

  return {
    subject: `We received your Qureshi's order #${orderLabel}`,
    html: emailShell(content),
    text: `Qureshi's Masala & Spices\n\nThank you, ${formData.customer_name}.\n\nWe received order #${orderLabel}. We will contact you to confirm it and arrange delivery.\n\n${itemText(formData)}\n\nOrder total: ${formatCurrency(order.total_amount)}\nDelivery: ${address}\nPhone: ${formData.customer_phone}\n\n${siteUrl}`,
  }
}

function adminEmail({ order, formData }: OrderEmailInput, siteUrl: string) {
  const orderLabel = shortOrderId(order.id)
  const address = deliveryAddress(formData)
  const notes = formData.notes?.trim() || 'None'
  const adminUrl = `${siteUrl.replace(/\/$/, '')}/admin/orders`
  const content = `
    <div style="color:#c9a84c;font-size:12px;font-weight:bold;letter-spacing:1.4px;text-transform:uppercase;">New website order</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;margin:8px 0 12px;color:#6b1a1a;">Order #${escapeHtml(orderLabel)}</h1>
    <p style="margin:0 0 22px;color:#5d5146;line-height:1.7;">A new order has been stored successfully and is awaiting confirmation.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #eee5d8;margin-bottom:18px;">${itemRows(formData)}</table>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf7f2;border:1px solid #eee5d8;border-radius:10px;margin:18px 0 24px;">
      <tr>
        <td style="padding:16px;color:#6b1a1a;font-weight:bold;">Order total</td>
        <td style="padding:16px;text-align:right;color:#6b1a1a;font-size:20px;font-weight:bold;">${escapeHtml(formatCurrency(order.total_amount))}</td>
      </tr>
    </table>
    <h2 style="font-size:16px;margin:0 0 8px;color:#2b2118;">Customer</h2>
    <p style="margin:0 0 18px;color:#5d5146;line-height:1.7;">
      ${escapeHtml(formData.customer_name)}<br>
      ${escapeHtml(formData.customer_phone)}<br>
      ${escapeHtml(formData.customer_email)}
    </p>
    <h2 style="font-size:16px;margin:0 0 8px;color:#2b2118;">Delivery address</h2>
    <p style="margin:0 0 18px;color:#5d5146;line-height:1.7;">${escapeHtml(address)}</p>
    <h2 style="font-size:16px;margin:0 0 8px;color:#2b2118;">Customer notes</h2>
    <p style="margin:0 0 24px;color:#5d5146;line-height:1.7;">${escapeHtml(notes)}</p>
    <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#6b1a1a;color:#ffffff;text-decoration:none;border-radius:8px;padding:12px 18px;font-weight:bold;">Open admin orders</a>`

  return {
    subject: `New order #${orderLabel} — ${formData.customer_name}`,
    html: emailShell(content),
    text: `New Qureshi's Masala & Spices order\n\nOrder #${orderLabel}\nCustomer: ${formData.customer_name}\nPhone: ${formData.customer_phone}\nEmail: ${formData.customer_email}\nDelivery: ${address}\nNotes: ${notes}\n\n${itemText(formData)}\n\nOrder total: ${formatCurrency(order.total_amount)}\n\n${adminUrl}`,
  }
}

async function sendWithResend(apiKey: string, email: ResendEmail, orderId: string) {
  try {
    const response = await fetch(RESEND_EMAILS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(email),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const responseBody = await response.text()
      console.error(
        `[Order email] Resend rejected order ${orderId}: ${response.status} ${responseBody.slice(0, 500)}`,
      )
      return false
    }

    return true
  } catch (error) {
    console.error(`[Order email] Failed for order ${orderId}:`, error)
    return false
  }
}

export async function sendOrderEmails(input: OrderEmailInput): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.ORDER_FROM_EMAIL?.trim()
  const replyTo = process.env.ORDER_REPLY_TO_EMAIL?.trim()
  const adminEmailAddress = process.env.ADMIN_ORDER_EMAIL?.trim()
  const customerEmailAddress = input.formData.customer_email?.trim()
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://www.qureshismasalaspices.com'

  if (
    !apiKey ||
    !from ||
    !replyTo ||
    !adminEmailAddress ||
    !customerEmailAddress
  ) {
    console.error(
      '[Order email] RESEND_API_KEY, ORDER_FROM_EMAIL, ORDER_REPLY_TO_EMAIL, ADMIN_ORDER_EMAIL and customer email must be configured',
    )
    return false
  }

  const customer = customerEmail(input, siteUrl)
  const admin = adminEmail(input, siteUrl)
  const [customerSent, adminSent] = await Promise.all([
    sendWithResend(
      apiKey,
      {
        from,
        to: [customerEmailAddress],
        reply_to: replyTo,
        ...customer,
      },
      input.order.id,
    ),
    sendWithResend(
      apiKey,
      {
        from,
        to: [adminEmailAddress],
        reply_to: replyTo,
        ...admin,
      },
      input.order.id,
    ),
  ])

  return customerSent && adminSent
}
