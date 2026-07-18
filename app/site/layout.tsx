'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { CartNotificationsProvider } from '@/lib/cart-notifications'
import PremiumCartNotification from '@/components/site/PremiumCartNotification'
import { SITE } from '@/lib/site-config'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const count = totalItems()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    ['/', 'Home'],
    ['/shop', 'Shop'],
    ['/our-heritage', 'Heritage'],
    ['/stock-our-products', 'Stock Our Products'],
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <CartNotificationsProvider>
      {/* NAV */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4 transition-all duration-300"
        style={{
          background: isScrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(24px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(245,197,24,0.15)' : 'none'
        }}
      >
        <Link href="/" className="flex items-center">
          <Image
            src="/images/Qureshi's Nav.png"
            alt="Qureshi's Masala"
            width={160}
            height={40}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-10 items-center">
          {navLinks.map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[11px] tracking-[0.25em] uppercase transition-all duration-300 animated-underline ${
                  pathname === href ? 'text-gold' : 'text-white/50 hover:text-white'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/order" className="relative flex items-center gap-2 group">
            <ShoppingBag size={22} className="text-white/60 group-hover:text-gold transition-colors duration-300" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
            <span className="hidden lg:block text-[11px] tracking-[0.2em] uppercase text-white/50 group-hover:text-gold transition-colors">
              Cart
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/70 hover:text-gold transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-28 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={`text-3xl font-display tracking-widest uppercase transition-colors ${
                    pathname === href ? 'text-gold' : 'text-white/70 hover:text-white'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-8 pt-8 border-t border-white/10">
                <Link
                  href="/order"
                  className="inline-block bg-gold text-black px-8 py-4 text-xs font-bold tracking-[0.3em] uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>
      <PremiumCartNotification />

      {/* FOOTER */}
      <footer className="bg-gradient-to-b from-zinc-950 to-black border-t border-gold/10 px-4 sm:px-8 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="font-display text-3xl tracking-widest mb-2">QURESHI'S <span className="text-gradient-gold">MASALA</span></div>
              <div className="font-serif italic text-white/40 text-sm mb-4">Pure Flavour. Endless Taste.</div>
              <p className="text-white/35 text-sm leading-relaxed max-w-sm mb-6">
                Small-batch masalas crafted with passion, shipped all over India. 100% natural, zero preservatives.
              </p>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all">
                  <span className="text-sm font-display">IG</span>
                </a>
                <a href="https://wa.me/91XXXXXXXXXX" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all">
                  <span className="text-sm font-display">WA</span>
                </a>
                <a href={`mailto:${SITE.email}`} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:border-gold hover:text-gold transition-all">
                  <span className="text-sm font-display">EM</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5 font-semibold">Quick Links</div>
              <ul className="space-y-3">
                {navLinks.map(([href, label]) => (
                  <li key={href}><Link href={href} className="text-white/40 text-sm hover:text-white transition-colors">{label}</Link></li>
                ))}
                <li><Link href="/order" className="text-white/40 text-sm hover:text-white transition-colors">Your Cart</Link></li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <div className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5 font-semibold">Get in Touch</div>
              <ul className="space-y-3 text-sm text-white/40">
                <li><a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">{SITE.email}</a></li>
                <li><a href="https://wa.me/91XXXXXXXXXX" className="hover:text-white transition-colors">+91 XXXXX XXXXX</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-white/25 text-[11px] tracking-wider">© 2026 Qureshi's Masala & Spices. All rights reserved.</span>
            <div className="flex gap-3">
              {['100% Natural', 'No Preservatives', 'Made in India', 'Small Batch'].map((b, i) => (
                <span key={i} className="px-3 py-1.5 border border-gold/20 text-[10px] tracking-[0.2em] uppercase text-gold/50">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </CartNotificationsProvider>
  )
}
