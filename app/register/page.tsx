'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { registerUser } from '@/lib/actions'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm()
  const [error, setErrorMessage] = useState('')

  async function onSubmit(data: any) {
    try {
      await registerUser(data)
    } catch (err: any) {
      setError('root', { message: err.message })
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-white mb-4">Create Account</h1>
          <p className="text-white/60">Sign up to start shopping</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <input
                {...register('full_name', { required: 'Name is required' })}
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="John Doe"
              />
              {errors.full_name && <p className="text-red-400 text-sm mt-2">{errors.full_name.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Phone Number</label>
              <input
                {...register('phone', { required: 'Phone is required' })}
                type="tel"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="+91 98765 43210"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-2">{errors.phone.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Address (Optional)</label>
              <textarea
                {...register('address')}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                placeholder="Your delivery address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">City (Optional)</label>
                <input
                  {...register('city')}
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Pincode (Optional)</label>
                <input
                  {...register('pincode')}
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                  placeholder="000000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/60">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
