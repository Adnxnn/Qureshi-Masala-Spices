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
  ExternalLink,
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
  const [isDesktop, setIsDesktop] = useState(false)
  const pathname = usePathname()

  // Close the mobile sidebar whenever the route changes.
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    const syncViewport = () => setIsDesktop(mediaQuery.matches)

    syncViewport()
    mediaQuery.addEventListener('change', syncViewport)

    return () => mediaQuery.removeEventListener('change', syncViewport)
  }, [])

  useEffect(() => {
    if (!sidebarOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [sidebarOpen])

  const activeItem =
    navItems.find(({ href }) =>
      href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
    ) ?? navItems[0]
  const mobileNavigationHidden = !isDesktop && !sidebarOpen

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 cursor-default bg-black/75 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin navigation"
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-mobile-navigation"
        aria-label="Admin navigation"
        aria-hidden={mobileNavigationHidden}
        className={`admin-mobile-drawer fixed inset-y-0 left-0 z-50 flex w-[calc(100vw-3rem)] max-w-xs flex-shrink-0 flex-col border-r border-white/10 bg-[#0d0d0d] shadow-2xl transition-transform duration-300 ease-out md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 md:shadow-none ${
          sidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-4 md:min-h-0 md:p-6">
          <div>
            <div className="font-display text-xl tracking-widest text-white">
              QURESHI&apos;S
            </div>

            <div className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-gold">
              Admin Panel
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            tabIndex={mobileNavigationHidden ? -1 : undefined}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
            aria-label="Close admin menu"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3 md:p-4">
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
                tabIndex={mobileNavigationHidden ? -1 : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isActive
                    ? 'bg-gold text-black'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-3 md:p-4">
          <Link
            href="/"
            tabIndex={mobileNavigationHidden ? -1 : undefined}
            className="flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ExternalLink size={18} aria-hidden="true" />
            View website
          </Link>
        </div>
      </aside>

      {/* Mobile app bar */}
      <header className="admin-mobile-header fixed inset-x-0 top-0 z-30 flex min-h-16 items-center border-b border-white/10 bg-[#0d0d0d]/95 px-3 backdrop-blur-xl md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Open admin menu"
          aria-expanded={sidebarOpen}
          aria-controls="admin-mobile-navigation"
        >
          <Menu size={22} aria-hidden="true" />
        </button>

        <div className="ml-3 min-w-0">
          <div className="truncate text-[9px] font-semibold uppercase tracking-[0.22em] text-gold">
            Qureshi&apos;s Admin
          </div>
          <div className="truncate text-sm font-semibold text-white">
            {activeItem.label}
          </div>
        </div>
      </header>
    </>
  )
}
