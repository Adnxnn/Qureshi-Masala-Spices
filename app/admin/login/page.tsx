'use client'

import { FormEvent, useEffect, useState } from 'react'
import BrandMark from '@/components/site/BrandMark'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LockKeyhole, Mail } from 'lucide-react'
import { requestAdminLoginCode, verifyAdminLoginCode } from '@/lib/actions'
import AuthBackdrop from '@/components/site/AuthBackdrop'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
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

  async function sendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    if (loading || (sent && remaining > 0)) return
    setLoading(true)
    setError('')
    try {
      const result = await requestAdminLoginCode(email)
      if ('error' in result) { setError(result.error); return }
      setSent(true)
      setCode('')
      setResendAt(Date.now() + 60000)
    } catch {
      setError('Could not request a code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const result = await verifyAdminLoginCode({ email, code })
      if ('error' in result) { setError(result.error); return }
      router.replace('/admin')
      router.refresh()
    } catch {
      setError('Could not verify this code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="royal-auth-stage royal-grain flex min-h-[100svh] items-center justify-center px-4 py-8 sm:px-6">
      <AuthBackdrop />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-7 text-center sm:mb-9">
          <BrandMark className="mx-auto" />
          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold"><LockKeyhole size={15} aria-hidden="true" />Admin access</div>
          <h1 className="royal-title mt-3 text-5xl">Private access.</h1>
          <p className="mt-2 text-sm leading-6 text-white/50">Enter the one-time code sent to your approved admin email. No password needed.</p>
        </div>

        <div className="royal-auth-card p-5 sm:p-7">
          {error && <p role="alert" className="mb-5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">{error}</p>}
          {!sent ? (
            <form onSubmit={sendCode} className="space-y-5">
              <div><label htmlFor="admin_email" className="mb-2 block text-sm font-medium text-white">Admin email</label><input id="admin_email" name="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} value={email} onChange={(event) => setEmail(event.target.value)} required className="royal-field px-4 text-base" placeholder="admin@example.com" /></div>
              <button type="submit" disabled={loading} className="royal-button w-full disabled:cursor-wait disabled:opacity-60"><Mail size={18} />{loading ? 'Sending…' : 'Send admin code'}</button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="space-y-5">
              <p className="text-sm leading-6 text-white/70">If <strong className="break-all text-white">{email.trim()}</strong> is an approved admin account, a code has been sent.</p>
              <div><label htmlFor="admin_code" className="mb-2 block text-sm font-medium text-white">One-time admin code</label><input id="admin_code" name="code" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]*" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 8))} required className="royal-field px-4 text-center text-2xl tracking-[.3em]" placeholder="000000" /></div>
              <button type="submit" disabled={loading} className="royal-button w-full disabled:cursor-wait disabled:opacity-60">{loading ? 'Verifying…' : 'Open Admin Panel'}</button>
              <div className="flex items-center justify-between gap-3 text-sm"><button type="button" onClick={() => { setSent(false); setError(''); setCode('') }} className="text-white/65 hover:text-gold">Change email</button><button type="button" disabled={loading || remaining > 0} onClick={() => void sendCode()} className="text-gold disabled:text-white/40">{remaining ? `New code in ${remaining}s` : 'Reset / send new code'}</button></div>
              <p className="text-xs leading-5 text-white/45">Codes expire and work once. If your email contains a sign-in link, you can use it too.</p>
            </form>
          )}
        </div>

        <div className="mt-6 text-center"><Link href="/" className="inline-flex min-h-11 items-center px-3 text-sm text-white/50 transition hover:text-gold">Back to the website</Link></div>
      </div>
    </div>
  )
}
