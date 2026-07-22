import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import AdminSidebarClient from './_components/AdminSidebarClient'

type AdminIconName =
  | 'dashboard'
  | 'products'
  | 'recipes'
  | 'orders'
  | 'promos'

type AdminNavItem = {
  href: string
  label: string
  icon: AdminIconName
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.is_admin) {
    redirect('/')
  }

  const navItems: AdminNavItem[] = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: 'dashboard',
    },
    {
      href: '/admin/products',
      label: 'Products',
      icon: 'products',
    },
    {
      href: '/admin/recipes',
      label: 'Recipes',
      icon: 'recipes',
    },
    {
      href: '/admin/orders',
      label: 'Orders',
      icon: 'orders',
    },
    {
      href: '/admin/promo-codes',
      label: 'Promo Codes',
      icon: 'promos',
    },
  ]

  return (
    <div className="admin-panel flex min-h-screen bg-[#0d0d0d]">
      <AdminSidebarClient navItems={navItems} />

      <main
        id="admin-main-content"
        className="admin-mobile-content min-w-0 flex-1 overflow-x-hidden"
      >
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-8 pt-5 sm:px-6 sm:pb-10 sm:pt-7 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
