'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { adminLoginUser } from '@/lib/actions'
import AuthBackdrop from '@/components/site/AuthBackdrop'

export const dynamic = 'force-dynamic'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const result = await adminLoginUser({ email, password })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="royal-auth-stage royal-grain flex min-h-[100svh] items-center justify-center px-4 py-8 sm:px-6">
      <AuthBackdrop />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-7 text-center sm:mb-9">
          <Image
            src="/images/Qureshi's Nav.png"
            alt="Qureshi's Masala & Spices"
            width={190}
            height={48}
            priority
            className="mx-auto h-auto w-[170px] object-contain sm:w-[190px]"
          />
          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            <LockKeyhole size={15} aria-hidden="true" />
            Admin access
          </div>
          <h1 className="royal-title mt-3 text-5xl">Private access.</h1>
          <p className="mt-2 text-sm leading-6 text-white/50">
            Use the email and password of your approved admin account.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="royal-auth-card space-y-5 p-5 sm:p-7"
          noValidate
        >
          {error ? (
            <div
              role="alert"
              className="rounded-[2px] border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
            >
              {error}
            </div>
          ) : null}

          <div>
            <label htmlFor="admin_email" className="mb-2 block text-sm font-medium text-white">
              Admin email
            </label>
            <input
              id="admin_email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="royal-field px-4 text-base placeholder:text-white/30"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="admin_password" className="mb-2 block text-sm font-medium text-white">
              Password
            </label>
            <div className="relative">
              <input
                id="admin_password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="royal-field px-4 pr-12 text-base placeholder:text-white/30"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="royal-button w-full disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Open Admin Panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center px-3 text-sm text-white/50 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Back to the website
          </Link>
        </div>
      </div>
    </div>
  )
}
