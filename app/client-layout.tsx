'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import { CartNotificationsProvider } from '@/lib/cart-notifications'
import PremiumCartNotification from '@/components/site/PremiumCartNotification'
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
    document.documentElement.dataset.theme = 'dark'
    window.localStorage.removeItem('qms-theme-v1')
  }, [])

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
              background: '#1d1d1f',
              color: '#f5f5f7',
              border: '1px solid rgba(255,255,255,.12)',
              borderRadius: '14px',
              boxShadow: '0 18px 60px rgba(0,0,0,.4)',
            },
            success: {
              iconTheme: {
                primary: '#d63b32',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </CartNotificationsProvider>
  )
}
