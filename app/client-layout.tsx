'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { CartNotificationsProvider } from '@/lib/cart-notifications'
import PremiumCartNotification from '@/components/site/PremiumCartNotification'
import CinematicMotion from '@/components/site/CinematicMotion'
import { getCurrentUser } from '@/lib/actions'
import type { User as UserType } from '@/types'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [user, setUser] = useState<UserType | null>(null)

  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    if (!isAdmin) {
      loadUser()
    }
  }, [pathname, isAdmin])

  const loadUser = async () => {
    const userData = await getCurrentUser()
    setUser(userData)
  }

  if (isAdmin) {
    return (
      <>
        {children}
        <Toaster position="top-center" />
      </>
    )
  }

  return (
    <CartNotificationsProvider>
      <div className="qms-public-shell">
        <CinematicMotion />
        <Header user={user} />

        <main className="min-h-screen w-full overflow-x-hidden">
          {children}
        </main>

        <PremiumCartNotification />
        <Footer />
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'qms-toast',
            style: {
              background: 'rgb(var(--surface-rgb) / 0.96)',
              color: 'rgb(var(--cream-rgb))',
              border: '1px solid rgb(var(--gold-rgb) / 0.28)',
              borderRadius: '4px',
            },
            success: {
              iconTheme: {
                primary: 'rgb(var(--gold-rgb))',
                secondary: 'rgb(var(--black-rgb))',
              },
            },
          }}
        />
      </div>
    </CartNotificationsProvider>
  )
}
