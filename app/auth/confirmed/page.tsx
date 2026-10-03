'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, CircleAlert, LoaderCircle } from 'lucide-react'
import AuthBackdrop from '@/components/site/AuthBackdrop'
import { createClient } from '@/lib/supabaseClient'
import { completeOtpSignIn } from '@/lib/actions'

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
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [confirmationState, setConfirmationState] =
    useState<ConfirmationState>('checking')

  useEffect(() => {
    let active = true
    const query = new URLSearchParams(window.location.search)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const recoveryLink = query.get('type') === 'recovery' || hash.get('type') === 'recovery'
    const otpLink = query.get('flow') === 'otp' || hash.get('type') === 'magiclink'
    const adminLink = query.get('flow') === 'admin'
    const completeAdmin = () => {
      if (!active) return
      router.replace('/admin')
      router.refresh()
    }
    const completeOtp = async () => {
      const result = await completeOtpSignIn()
      if (!active) return
      if ('error' in result) { setConfirmationState('failed'); return }
      router.replace('/account')
      router.refresh()
    }
    const completeRecovery = () => {
      if (!active) return
      window.sessionStorage.setItem('qms-recovery-verified', '1')
      router.replace('/forgot-password')
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: unknown) => {
      if (session && (event === 'PASSWORD_RECOVERY' || (recoveryLink && event === 'SIGNED_IN'))) completeRecovery()
      else if (session && adminLink && event === 'SIGNED_IN') completeAdmin()
      else if (session && otpLink && event === 'SIGNED_IN') void completeOtp()
    })
    void supabase.auth.getSession().then(({ data }: { data: { session: unknown } }) => {
      if (!active) return
      if (recoveryLink && data.session) completeRecovery()
      else if (adminLink && data.session) completeAdmin()
      else if (otpLink && data.session) void completeOtp()
      else setConfirmationState(readConfirmationState())
    }).catch(() => { if (active) setConfirmationState('failed') })
    return () => { active = false; subscription.unsubscribe() }
  }, [router, supabase])

  const hasError =
    confirmationState === 'expired' || confirmationState === 'failed'
  const isChecking = confirmationState === 'checking'

  return (
    <div className="royal-auth-stage royal-grain flex items-center justify-center px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <AuthBackdrop />

      <section
        className="royal-auth-card relative z-10 w-full max-w-md p-6 text-center sm:p-9"
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

        <p className="royal-eyebrow">
          Account verification
        </p>
        <h1 className="royal-title mt-3 text-5xl sm:text-6xl">
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
            ? "Your QMS account is ready. Sign in to view your profile, saved address and order history."
            : 'This confirmation link may have expired or already been used. Try signing in first—if your email was already confirmed, your account will open normally.'}
        </p>

        {!isChecking ? (
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="royal-button w-full"
            >
              Continue to Sign In
            </Link>
            <Link
              href="/"
              className="royal-button-secondary w-full"
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
