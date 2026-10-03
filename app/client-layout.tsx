'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CartNotificationsProvider } from '@/lib/cart-notifications'
import PremiumCartNotification from '@/components/site/PremiumCartNotification'
import MinimumOrderUnlock from '@/components/site/MinimumOrderUnlock'
import { FavoritesFeedbackProvider } from '@/lib/favorites-feedback'
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
    return <>{children}</>
  }

  return (
    <CartNotificationsProvider>
      <FavoritesFeedbackProvider>
      <Header user={user} />

      <main id="main-content" tabIndex={-1} className="customer-site min-h-screen w-full">
        {children}
      </main>

      <PremiumCartNotification />
      <MinimumOrderUnlock />
      <Footer />
      </FavoritesFeedbackProvider>
    </CartNotificationsProvider>
  )
}
