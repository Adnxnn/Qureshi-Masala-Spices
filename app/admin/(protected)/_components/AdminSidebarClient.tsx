'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingBag, Tag, Menu, X } from 'lucide-react'

interface AdminSidebarClientProps {
  navItems: { href: string; label: string; icon: React.ElementType }[];
}

export default function AdminSidebarClient({ navItems }: AdminSidebarClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-white/5 flex flex-col bg-[#0d0d0d] transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4 md:p-6 border-b border-white/5">
          <div className="font-display text-lg tracking-widest text-white">QURESHI'S</div>
          <div className="text-[10px] tracking-[0.2em] uppercase text-gold mt-0.5">Admin Panel</div>
        </div>

        <nav className="flex-1 p-3 md:p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-normal text-white/50 hover:text-white hover:bg-white/5 transition-colors rounded"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile menu button in main content */}
      <div className="sticky top-0 z-30 bg-[#0d0d0d] border-b border-white/5 py-4 px-4 md:hidden flex items-center">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-white hover:bg-white/10 rounded"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="ml-4 font-display text-lg tracking-widest text-white">QURESHI'S</div>
      </div>
    </>
  )
}