import { LayoutDashboard, Package, ShoppingBag, Tag, ChefHat } from 'lucide-react'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabaseServer'
import AdminSidebarClient from './_components/AdminSidebarClient'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/recipes', label: 'Recipes', icon: ChefHat },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/promo-codes', label: 'Promo Codes', icon: Tag },
  ]

  return (
    <div className="min-h-screen flex bg-[#0d0d0d]">
      <AdminSidebarClient navItems={navItems} />

      {/* CONTENT */}
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  )
}
