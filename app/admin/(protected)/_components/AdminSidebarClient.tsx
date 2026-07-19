'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  ChefHat,
  Menu,
  X,
} from 'lucide-react'

type AdminIconName =
  | 'dashboard'
  | 'products'
  | 'recipes'
  | 'orders'
  | 'promos'

interface AdminSidebarClientProps {
  navItems: {
    href: string
    label: string
    icon: AdminIconName
  }[]
}

const iconMap = {
  dashboard: LayoutDashboard,
  products: Package,
  recipes: ChefHat,
  orders: ShoppingBag,
  promos: Tag,
}

export default function AdminSidebarClient({
  navItems,
}: AdminSidebarClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Close the mobile sidebar whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#0d0d0d] transition-transform duration-300 ease-in-out md:static ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="border-b border-white/5 p-4 md:p-6">
          <div className="font-display text-lg tracking-widest text-white">
            QURESHI&apos;S
          </div>

          <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-gold">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3 md:p-4">
          {navItems.map(({ href, label, icon }) => {
            const Icon = iconMap[icon]
            const isActive =
              href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-normal transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-30 flex items-center border-b border-white/5 bg-[#0d0d0d] px-4 py-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen((open) => !open)}
          className="rounded p-2 text-white hover:bg-white/10"
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="ml-4 font-display text-lg tracking-widest text-white">
          QURESHI&apos;S
        </div>
      </div>
    </>
  )
}