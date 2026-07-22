import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

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

    // Interactive Confirm/Reject processing will be added after the
    // WhatsApp message template and order-status workflow are configured.
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json(
      { error: 'Invalid webhook payload' },
      { status: 400 },
    )
  }
}
