'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, LoaderCircle, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabaseClient'
import AuthBackdrop from '@/components/site/AuthBackdrop'

type Step = 'request' | 'verify' | 'new-password' | 'complete'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const successMessage = 'If an account exists for that email, we’ve sent recovery instructions. Check your inbox and spam folder.'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [working, setWorking] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // The recovery link lands on /auth/confirmed, which marks the verified
    // session before forwarding here. The marker is only for UI routing:
    // Supabase still checks the recovery session on updateUser.
    if (window.sessionStorage.getItem('qms-recovery-verified') !== '1') return
    window.sessionStorage.removeItem('qms-recovery-verified')
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? '')
        setStep('new-password')
      }
    })
  }, [supabase])

  async function sendRecovery(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    const address = email.trim().toLowerCase()
    if (!emailPattern.test(address)) { setError('Enter a valid email address.'); return }
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError('Password recovery is unavailable right now. Please contact QMS support.'); return
    }
    setWorking(true)
    try {
      const redirectTo = `${window.location.origin}/auth/confirmed`
      const { error: sendError } = await supabase.auth.resetPasswordForEmail(address, { redirectTo })
      if (sendError && /rate limit|too many|seconds|email rate/i.test(sendError.message)) {
        setError('Please wait a minute before requesting another email.')
        return
      }
      if (sendError) {
        setError('We could not send a recovery email right now. Please try again shortly.')
        return
      }
      setEmail(address)
      setCode('')
      setMessage(successMessage)
      setStep('verify')
    } catch {
      setError('We could not send a recovery email right now. Please try again shortly.')
    } finally { setWorking(false) }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!emailPattern.test(email.trim()) || !/^\d{6,8}$/.test(code.trim())) {
      setError('Enter the email address and the code from your recovery email.')
      return
    }
    setWorking(true)
    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'recovery' })
      if (verifyError || !data.session) {
        setError('That code is invalid or has expired. Check the latest email or request a new one.')
        return
      }
      setCode('')
      setMessage('Email verified. Choose your new password below.')
      setStep('new-password')
    } catch { setError('We could not verify the code. Please try again.') }
    finally { setWorking(false) }
  }

  async function changePassword(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (password.length < 8) { setError('Use at least 8 characters for your new password.'); return }
    if (password !== confirmPassword) { setError('The passwords do not match.'); return }
    setWorking(true)
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user || (email && user.email?.toLowerCase() !== email.toLowerCase())) {
        setError('Your verification has expired. Please request a new recovery email.')
        setStep('request')
        return
      }
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) { setError(updateError.message || 'Could not update your password. Please try again.'); return }
      setPassword('')
      setConfirmPassword('')
      await supabase.auth.signOut()
      setStep('complete')
      router.refresh()
    } catch { setError('Could not update your password. Please try again.') }
    finally { setWorking(false) }
  }

  const title = step === 'request' ? 'Find your way back.' : step === 'verify' ? 'Check your inbox.' : step === 'new-password' ? 'A fresh start.' : 'You’re all set.'
  return <div className="royal-auth-stage royal-grain px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
    <AuthBackdrop />
    <div className="relative z-10 mx-auto w-full max-w-md">
      <Link href="/login" className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-white/70 transition hover:text-gold"><ArrowLeft size={17} /> Back to sign in</Link>
      <div className="mb-7 text-center">
        <p className="royal-eyebrow mb-3">QMS account recovery</p>
        <h1 className="royal-title text-5xl sm:text-6xl">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/65">{step === 'request' ? 'Enter the email linked to your QMS account. We’ll send a secure way to reset your password.' : step === 'verify' ? 'Use the verification code if your email includes one, or open the reset link in that email.' : step === 'new-password' ? 'Your email is verified. Set a new password for your account.' : 'Your password has been changed. Sign in with your new password.'}</p>
      </div>
      <section className="royal-auth-card p-5 sm:p-8" aria-live="polite">
        {message && step !== 'request' && <p role="status" className="mb-5 flex items-start gap-2 rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm leading-6 text-emerald-100"><CheckCircle2 size={19} className="mt-0.5 shrink-0" />{message}</p>}
        {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">{error}</p>}
        {step === 'request' && <form onSubmit={sendRecovery} className="space-y-5">
          <div><label htmlFor="recovery-email" className="mb-2 block text-sm font-medium text-white">Email address</label><input id="recovery-email" className="royal-field px-4 text-base" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required value={email} onChange={event => setEmail(event.target.value)} placeholder="name@example.com" /></div>
          <button className="royal-button w-full disabled:opacity-60" disabled={working} type="submit">{working ? <LoaderCircle size={18} className="animate-spin" /> : <Mail size={18} />}{working ? 'Sending…' : 'Send recovery email'}<ArrowRight size={17} /></button>
        </form>}
        {step === 'verify' && <form onSubmit={verifyCode} className="space-y-5">
          <div><label htmlFor="verify-email" className="mb-2 block text-sm font-medium text-white">Email address</label><input id="verify-email" className="royal-field px-4 text-base" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></div>
          <div><label htmlFor="recovery-code" className="mb-2 block text-sm font-medium text-white">Verification code <span className="font-normal text-white/50">(if shown in the email)</span></label><input id="recovery-code" className="royal-field px-4 text-center text-xl tracking-[.3em]" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6,8}" maxLength={8} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ''))} placeholder="••••••" /></div>
          <button className="royal-button w-full disabled:opacity-60" disabled={working || code.length < 6} type="submit">{working ? <LoaderCircle size={18} className="animate-spin" /> : <KeyRound size={18} />}{working ? 'Verifying…' : 'Verify code'}</button>
          <div className="border-t border-white/10 pt-4 text-center"><p className="text-xs leading-5 text-white/55">No code in the email? Open its reset link to continue here automatically.</p><button type="button" className="mt-3 min-h-11 text-sm font-semibold text-gold underline-offset-4 hover:underline" onClick={() => { setError(''); setMessage(''); setStep('request') }}>Send another email</button></div>
        </form>}
        {step === 'new-password' && <form onSubmit={changePassword} className="space-y-5">
          <div><label htmlFor="reset-new-password" className="mb-2 block text-sm font-medium text-white">New password</label><div className="relative"><input id="reset-new-password" className="royal-field px-4 pr-12 text-base" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" /><button type="button" className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/65 hover:text-gold" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></div>
          <div><label htmlFor="reset-confirm-password" className="mb-2 block text-sm font-medium text-white">Confirm new password</label><input id="reset-confirm-password" className="royal-field px-4 text-base" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Enter it again" /></div>
          <button className="royal-button w-full disabled:opacity-60" disabled={working} type="submit">{working ? <LoaderCircle size={18} className="animate-spin" /> : <KeyRound size={18} />}{working ? 'Updating…' : 'Set new password'}<ArrowRight size={17} /></button>
        </form>}
        {step === 'complete' && <Link href="/login" className="royal-button w-full">Sign in with new password <ArrowRight size={17} /></Link>}
      </section>
    </div>
  </div>
}
