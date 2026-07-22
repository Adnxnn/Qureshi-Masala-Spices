'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'

type ConfirmationState = 'checking' | 'confirmed' | 'expired' | 'failed'

function readConfirmationState(): ConfirmationState {
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const errorCode = query.get('error_code') || hash.get('error_code') || ''
  const error = query.get('error') || hash.get('error') || ''
  const description =
    query.get('error_description') || hash.get('error_description') || ''

  if (!errorCode && !error && !description) {
    return 'confirmed'
  }

  const errorDetails = `${errorCode} ${error} ${description}`.toLowerCase()
  return errorDetails.includes('expired') || errorDetails.includes('otp_expired')
    ? 'expired'
    : 'failed'
}

export default function EmailConfirmedPage() {
  const [confirmationState, setConfirmationState] =
    useState<ConfirmationState>('checking')

  useEffect(() => {
    setConfirmationState(readConfirmationState())

    if (window.location.search || window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const hasError =
    confirmationState === 'expired' || confirmationState === 'failed'
  const isChecking = confirmationState === 'checking'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,197,24,0.10),transparent_34%)]"
        aria-hidden="true"
      />

      <section
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111]/95 p-6 text-center shadow-2xl shadow-black/40 sm:p-9"
        aria-live="polite"
      >
        <div
          className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-full border ${
            hasError
              ? 'border-red-400/25 bg-red-500/10 text-red-300'
              : 'border-gold/30 bg-gold/10 text-gold'
          }`}
        >
          {isChecking ? (
            <LoaderCircle
              className="animate-spin"
              size={32}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : hasError ? (
            <CircleAlert size={32} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={34} strokeWidth={1.8} aria-hidden="true" />
          )}
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
          Account verification
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-wide text-white sm:text-5xl">
          {isChecking
            ? 'Confirming Your Email'
            : confirmationState === 'confirmed'
            ? 'Email Confirmed'
            : confirmationState === 'expired'
              ? 'Link Expired'
              : 'Confirmation Unsuccessful'}
        </h1>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
          {isChecking
            ? 'Please wait while we securely complete your account verification.'
            : confirmationState === 'confirmed'
            ? "Your Qureshi's account is ready. Sign in to view your profile, saved address and order history."
            : 'This confirmation link may have expired or already been used. Try signing in first—if your email was already confirmed, your account will open normally.'}
        </p>

        {!isChecking ? (
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gold px-5 font-bold text-black transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
            >
              Continue to Sign In
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 px-5 font-semibold text-white/70 transition hover:border-gold/35 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              Return to Home
            </Link>
          </div>
        ) : null}

        {hasError ? (
          <p className="mt-6 text-xs leading-5 text-white/40">
            Still unable to sign in? Contact connect@qureshismasalaspices.com.
          </p>
        ) : null}
      </section>
    </div>
  )
}
