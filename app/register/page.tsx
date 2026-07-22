'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CheckCircle2, Eye, EyeOff, UserPlus } from 'lucide-react'
import { registerUser } from '@/lib/actions'

type RegisterFormValues = {
  full_name: string
  email: string
  phone: string
  password: string
  confirm_password: string
  address?: string
  city?: string
  pincode?: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>()

  async function onSubmit(data: RegisterFormValues) {
    setFormError('')
    const result = await registerUser(data)

    if ('error' in result) {
      setFormError(result.error)
      return
    }

    if (result.requiresEmailConfirmation) {
      setConfirmationEmail(data.email.trim())
      return
    }

    router.replace('/account')
    router.refresh()
  }

  if (confirmationEmail) {
    return (
      <div className="min-h-screen bg-dark px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-md rounded-2xl border border-gold/25 bg-white/[0.04] p-6 text-center sm:p-9">
          <CheckCircle2 className="mx-auto mb-5 text-gold" size={42} aria-hidden="true" />
          <h1 className="font-display text-4xl tracking-wide text-white">Check Your Email</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">
            We created your account and sent a confirmation link to{' '}
            <span className="font-semibold text-white">{confirmationEmail}</span>.
          </p>
          <p className="mt-3 text-sm leading-6 text-white/45">
            Open the link once, then return here to sign in.
          </p>
          <Link
            href="/login"
            className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-gold px-5 font-bold text-black transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark"
          >
            Continue to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-24">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-7 text-center sm:mb-9">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
            Join Qureshi&apos;s
          </p>
          <h1 className="font-display text-4xl tracking-wide text-white sm:text-5xl">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-white/55 sm:text-base">
            Save your delivery details and keep every order in one place.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {formError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
              >
                {formError}
              </div>
            ) : null}

            <div>
              <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-white">
                Full name
              </label>
              <input
                id="full_name"
                type="text"
                autoComplete="name"
                aria-invalid={errors.full_name ? 'true' : 'false'}
                {...register('full_name', { required: 'Full name is required.' })}
                className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                placeholder="Your full name"
              />
              {errors.full_name ? (
                <p role="alert" className="mt-2 text-sm text-red-300">
                  {errors.full_name.message}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="register_email" className="mb-2 block text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  id="register_email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email', {
                    required: 'Email is required.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address.',
                    },
                  })}
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                  placeholder="name@example.com"
                />
                {errors.email ? (
                  <p role="alert" className="mt-2 text-sm text-red-300">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-white">
                  Phone number
                </label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  {...register('phone', {
                    required: 'Phone number is required.',
                    minLength: { value: 10, message: 'Enter a valid phone number.' },
                  })}
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                  placeholder="+91 98765 43210"
                />
                {errors.phone ? (
                  <p role="alert" className="mt-2 text-sm text-red-300">
                    {errors.phone.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="new_password" className="mb-2 block text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    {...register('password', {
                      required: 'Password is required.',
                      minLength: {
                        value: 6,
                        message: 'Use at least 6 characters.',
                      },
                    })}
                    className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 pr-12 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/50 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
                    aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password ? (
                  <p role="alert" className="mt-2 text-sm text-red-300">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label htmlFor="confirm_password" className="mb-2 block text-sm font-medium text-white">
                  Confirm password
                </label>
                <input
                  id="confirm_password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  aria-invalid={errors.confirm_password ? 'true' : 'false'}
                  {...register('confirm_password', {
                    required: 'Confirm your password.',
                    validate: (value) => value === getValues('password') || 'Passwords do not match.',
                  })}
                  className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                  placeholder="Enter it again"
                />
                {errors.confirm_password ? (
                  <p role="alert" className="mt-2 text-sm text-red-300">
                    {errors.confirm_password.message}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <h2 className="mb-4 text-sm font-semibold text-white">Saved delivery address <span className="font-normal text-white/40">(optional)</span></h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="address" className="mb-2 block text-sm text-white/70">
                    Complete address
                  </label>
                  <textarea
                    id="address"
                    rows={3}
                    autoComplete="street-address"
                    {...register('address')}
                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                    placeholder="House, street and area"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="city" className="mb-2 block text-sm text-white/70">City</label>
                    <input
                      id="city"
                      type="text"
                      autoComplete="address-level2"
                      {...register('city')}
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="mb-2 block text-sm text-white/70">Pincode</label>
                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      {...register('pincode')}
                      className="min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-base text-white outline-none transition placeholder:text-white/30 focus-visible:border-gold focus-visible:ring-2 focus-visible:ring-gold/20"
                      placeholder="571201"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 font-bold text-black transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-dark disabled:cursor-wait disabled:opacity-60"
            >
              <UserPlus size={18} />
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-7 border-t border-white/10 pt-6 text-center">
            <p className="text-sm text-white/55">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-gold underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
