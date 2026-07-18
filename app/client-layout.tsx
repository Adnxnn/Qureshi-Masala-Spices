'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { CartNotificationsProvider } from '@/lib/cart-notifications'
import PremiumCartNotification from '@/components/site/PremiumCartNotification'
import { getCurrentUser } from '@/lib/actions'
import type { User as UserType } from '@/types'
import Header from '@/components/site/Header'
import Footer from '@/components/site/Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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
      <Header />
      <main className="min-h-screen">{children}</main>
      <PremiumCartNotification />
      <Footer />
    </CartNotificationsProvider>
  )
}
