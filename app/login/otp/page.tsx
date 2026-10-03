'use client'

import { FormEvent, Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Phone, ShieldCheck } from 'lucide-react'
import AuthBackdrop from '@/components/site/AuthBackdrop'
import { completeOtpSignIn } from '@/lib/actions'
import { toE164Phone } from '@/lib/phone'
import { createClient } from '@/lib/supabaseClient'

type Channel = 'email' | 'phone'

function OtpLoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const register = params.get('mode') === 'register'
  const next = params.get('next')
  const destination = next?.startsWith('/') && !next.startsWith('//') ? next : '/account'
  const [supabase] = useState(() => createClient())
  const [channel, setChannel] = useState<Channel>('email')
  const [name, setName] = useState('')
  const [identifier, setIdentifier] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resendAt, setResendAt] = useState(0)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (!resendAt) return
    const tick = () => setRemaining(Math.max(0, Math.ceil((resendAt - Date.now()) / 1000)))
    tick()
    const interval = window.setInterval(tick, 1000)
    return () => window.clearInterval(interval)
  }, [resendAt])

  function switchChannel(value: Channel) {
    setChannel(value)
    setIdentifier('')
    setSentTo('')
    setCode('')
    setError('')
    setResendAt(0)
  }

  async function sendCode(event?: FormEvent) {
    event?.preventDefault()
    if (busy || (sentTo && remaining > 0)) return
    setError('')
    const address = channel === 'email' ? identifier.trim().toLowerCase() : toE164Phone(identifier)
    if (!address || (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address))) {
      setError(channel === 'email' ? 'Enter a valid email address.' : 'Enter a valid phone number with country code (or a 10-digit Indian number).')
      return
    }
    if (register && !name.trim()) {
      setError('Enter your name to create an account.')
      return
    }

    setBusy(true)
    try {
      const options = { shouldCreateUser: register, data: register ? { full_name: name.trim() } : undefined }
      const { error: sendError } = channel === 'email'
        ? await supabase.auth.signInWithOtp({ email: address, options: { ...options, emailRedirectTo: `${window.location.origin}/auth/confirmed?flow=otp` } })
        : await supabase.auth.signInWithOtp({ phone: address, options })
      if (sendError) throw sendError
      setSentTo(address)
      setCode('')
      setResendAt(Date.now() + 60000)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not send a code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault()
    if (busy) return
    setError('')
    if (!/^\d{6,8}$/.test(code.trim())) {
      setError('Enter the code from your email or text message.')
      return
    }
    setBusy(true)
    try {
      const { error: verifyError } = channel === 'email'
        ? await supabase.auth.verifyOtp({ email: sentTo, token: code.trim(), type: 'email' })
        : await supabase.auth.verifyOtp({ phone: sentTo, token: code.trim(), type: 'sms' })
      if (verifyError) throw verifyError
      const result = await completeOtpSignIn()
      if ('error' in result) {
        await supabase.auth.signOut()
        throw new Error(result.error)
      }
      router.replace(destination)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not verify this code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="royal-auth-stage royal-grain px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
      <AuthBackdrop />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <Link href={register ? '/register' : '/login'} className="mb-8 inline-flex items-center gap-2 text-sm text-white/65 hover:text-gold"><ArrowLeft size={17} /> Back</Link>
        <div className="mb-8 text-center">
          <p className="royal-eyebrow mb-3">Your QMS account</p>
          <h1 className="royal-title text-5xl sm:text-6xl">{register ? 'Join with a code.' : 'Sign in with a code.'}</h1>
          <p className="mt-3 text-sm leading-6 text-white/65">Choose email or phone. We’ll send a one-time code to verify it.</p>
        </div>
        <div className="royal-auth-card p-5 sm:p-8">
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1" aria-label="Code delivery method">
            {(['email', 'phone'] as const).map((value) => (
              <button key={value} type="button" onClick={() => switchChannel(value)} aria-pressed={channel === value} className={`flex min-h-12 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition ${channel === value ? 'bg-gold text-black' : 'text-white/65 hover:text-white'}`}>
                {value === 'email' ? <Mail size={17} /> : <Phone size={17} />}{value === 'email' ? 'Email' : 'Phone'}
              </button>
            ))}
          </div>
          {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}
          {!sentTo ? (
            <form onSubmit={sendCode} className="space-y-5">
              {register && <div><label htmlFor="otp-name" className="mb-2 block text-sm font-medium text-white">Full name</label><input id="otp-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required className="royal-field px-4 text-base" placeholder="Your full name" /></div>}
              <div>
                <label htmlFor="otp-address" className="mb-2 block text-sm font-medium text-white">{channel === 'email' ? 'Email address' : 'Mobile number'}</label>
                <input id="otp-address" type={channel === 'email' ? 'email' : 'tel'} inputMode={channel === 'email' ? 'email' : 'tel'} autoComplete={channel === 'email' ? 'email' : 'tel'} value={identifier} onChange={(event) => setIdentifier(event.target.value)} required className="royal-field px-4 text-base" placeholder={channel === 'email' ? 'name@example.com' : '+91 98765 43210'} />
              </div>
              <button className="royal-button w-full disabled:opacity-60" type="submit" disabled={busy}><ShieldCheck size={18} />{busy ? 'Sending…' : 'Send code'}</button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <p className="text-sm leading-6 text-white/70">Enter the code sent to <strong className="break-all text-white">{sentTo}</strong>.</p>
              <div><label htmlFor="otp-code" className="mb-2 block text-sm font-medium text-white">Verification code</label><input id="otp-code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))} className="royal-field px-4 text-center text-2xl tracking-[.3em]" placeholder="000000" required /></div>
              <button className="royal-button w-full disabled:opacity-60" type="submit" disabled={busy}>{busy ? 'Verifying…' : register ? 'Verify & create account' : 'Verify & sign in'}</button>
              <div className="flex items-center justify-between gap-3 text-sm"><button type="button" onClick={() => { setSentTo(''); setError('') }} className="text-white/70 underline-offset-4 hover:text-gold hover:underline">Change {channel}</button><button type="button" onClick={() => void sendCode()} disabled={busy || remaining > 0} className="text-gold disabled:text-white/40">{remaining > 0 ? `Resend in ${remaining}s` : 'Resend code'}</button></div>
              {channel === 'email' && <p className="text-xs leading-5 text-white/50">If your email contains a sign-in link instead, opening it will sign you in too.</p>}
            </form>
          )}
          <div className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/65">{register ? 'Already have an account?' : 'New to QMS?'}{' '}<Link className="font-semibold text-gold hover:underline" href={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></div>
        </div>
      </div>
    </div>
  )
}

export default function OtpLoginPage() {
  return <Suspense fallback={<div className="royal-auth-stage min-h-[60vh]" />}><OtpLoginForm /></Suspense>
}
