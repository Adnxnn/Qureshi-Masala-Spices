'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { loginUser } from '@/lib/actions'
import AuthBackdrop from '@/components/site/AuthBackdrop'

type LoginFormValues = {
  email: string
  password: string
}

function getSafeNextPath() {
  const requestedPath = new URLSearchParams(window.location.search).get('next')
  return requestedPath?.startsWith('/') && !requestedPath.startsWith('//')
    ? requestedPath
    : '/account'
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  async function onSubmit(data: LoginFormValues) {
    setFormError('')
    const result = await loginUser(data)

    if ('error' in result) {
      setFormError(result.error)
      return
    }

    router.replace(getSafeNextPath())
    router.refresh()
  }

  return (
    <div className="royal-auth-stage royal-grain px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-24">
      <AuthBackdrop />
      <div className="relative z-10 mx-auto w-full max-w-md">
        <div className="mb-7 text-center sm:mb-9">
          <p className="royal-eyebrow mb-3">
            Your Qureshi&apos;s account
          </p>
          <h1 className="royal-title text-5xl sm:text-6xl">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm text-white/55 sm:text-base">
            Sign in to view your profile, saved address and orders.
          </p>
        </div>

        <div className="royal-auth-card p-5 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {formError ? (
              <div
                role="alert"
                className="rounded-[2px] border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {formError}
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white">
                Email address
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
                className="royal-field px-4 text-base placeholder:text-white/30"
                placeholder="name@example.com"
              />
              {errors.email ? (
                <p id="email-error" role="alert" className="mt-2 text-sm text-red-300">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  {...register('password', { required: 'Password is required.' })}
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
              {errors.password ? (
                <p id="password-error" role="alert" className="mt-2 text-sm text-red-300">
                  {errors.password.message}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="royal-button w-full disabled:cursor-wait disabled:opacity-60"
            >
              <LogIn size={18} />
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/55">
              New to Qureshi&apos;s?{' '}
              <Link
                href="/register"
                className="font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
