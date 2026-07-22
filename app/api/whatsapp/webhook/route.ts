import { createHmac, timingSafeEqual } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import type { Database, OrderStatus } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  )
}

function hasValidMetaSignature(
  rawBody: Buffer,
  signatureHeader: string | null,
  appSecret: string,
) {
  const prefix = 'sha256='

  if (!signatureHeader?.startsWith(prefix)) {
    return false
  }

  const signature = signatureHeader.slice(prefix.length)

  if (!/^[a-f\d]{64}$/i.test(signature)) {
    return false
  }

  const expectedSignature = createHmac('sha256', appSecret)
    .update(rawBody)
    .digest()

  const receivedSignature = Buffer.from(signature, 'hex')

  return (
    receivedSignature.length === expectedSignature.length &&
    timingSafeEqual(receivedSignature, expectedSignature)
  )
}

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

type OrderAction = {
  orderId: string
  status: Extract<OrderStatus, 'confirmed' | 'cancelled'>
}

function getOrderAction(message: any): OrderAction | null {
  const payload =
    message?.button?.payload ??
    message?.interactive?.button_reply?.id ??
    ''

  const match = /^order:(confirm|reject):([0-9a-f-]{36})$/i.exec(payload)

  if (!match) {
    return null
  }

  return {
    orderId: match[2],
    status: match[1].toLowerCase() === 'confirm' ? 'confirmed' : 'cancelled',
  }
}

async function applyOrderAction(orderAction: OrderAction) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase server credentials are not configured')
  }

  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const { data, error } = await (supabase as any)
    .from('orders')
    .update({ status: orderAction.status })
    .eq('id', orderAction.orderId)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    console.warn(
      `[WhatsApp webhook] Order ${orderAction.orderId} was not pending or was not found`,
    )
  }
}

export async function GET(request: NextRequest) {
  const mode = request.nextUrl.searchParams.get('hub.mode')
  const token = request.nextUrl.searchParams.get('hub.verify_token')
  const challenge = request.nextUrl.searchParams.get('hub.challenge')
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (!verifyToken) {
    console.error(
      '[WhatsApp webhook] WHATSAPP_VERIFY_TOKEN is not configured',
    )

    return NextResponse.json(
      { error: 'Webhook verification is not configured' },
      { status: 500 },
    )
  }

  if (
    mode === 'subscribe' &&
    token &&
    challenge !== null &&
    safeEqual(token, verifyToken)
  ) {
    return new NextResponse(challenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  return NextResponse.json(
    { error: 'Webhook verification failed' },
    { status: 403 },
  )
}

export async function POST(request: NextRequest) {
  const appSecret = process.env.META_APP_SECRET

  if (!appSecret) {
    console.error('[WhatsApp webhook] META_APP_SECRET is not configured')

    return NextResponse.json(
      { error: 'Webhook signature verification is not configured' },
      { status: 500 },
    )
  }

  const rawBody = Buffer.from(await request.arrayBuffer())
  const signatureHeader = request.headers.get('x-hub-signature-256')

  if (!hasValidMetaSignature(rawBody, signatureHeader, appSecret)) {
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 401 },
    )
  }

  try {
    const payload = JSON.parse(rawBody.toString('utf8'))

    if (payload?.object !== 'whatsapp_business_account') {
      return NextResponse.json({ received: true })
    }

    const adminNumber = digitsOnly(process.env.WHATSAPP_ADMIN_NUMBER ?? '')
    const messages =
      payload?.entry?.flatMap((entry: any) =>
        entry?.changes?.flatMap((change: any) => change?.value?.messages ?? []),
      ) ?? []

    const orderActions = messages
      .filter(
        (message: any) =>
          adminNumber && digitsOnly(message?.from ?? '') === adminNumber,
      )
      .map(getOrderAction)
      .filter((action: OrderAction | null): action is OrderAction =>
        Boolean(action),
      )

    await Promise.all(orderActions.map(applyOrderAction))

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[WhatsApp webhook] Processing failed:', error)

    return NextResponse.json(
      { error: 'Webhook payload could not be processed' },
      { status: 500 },
    )
  }
}
