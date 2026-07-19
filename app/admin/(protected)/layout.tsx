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
    redirect('/login')
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
    <div className="min-h-screen flex bg-[#0d0d0d]">
      <AdminSidebarClient navItems={navItems} />

      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}