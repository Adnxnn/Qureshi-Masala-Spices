'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Search 
} from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { User as UserType } from '@/types'

const navLinks = [
  { href: '/shop', label: 'Shop', hasMega: true },
  { href: '/our-story', label: 'Our Story', hasMega: false },
  { href: '/our-heritage', label: 'Heritage', hasMega: false },
  { href: '/recipes', label: 'Recipes', hasMega: false },
  { href: '/stock-our-products', label: 'Stock Our Products', hasMega: false },
  { href: '/contact', label: 'Contact', hasMega: false },
]

const products = [
  { name: 'Chicken Kebab Masala', href: '/product/chicken-kebab-masala' },
  { name: 'Green Chicken Kebab Masala', href: '/product/green-chicken-kebab-masala' },
  { name: 'Pepper Masala (Chicken/Mutton)', href: '/product/pepper-masala-chicken-mutton' },
  { name: 'Mutton Masala', href: '/product/mutton-masala' },
  { name: 'Chicken Masala', href: '/product/chicken-masala' },
]

const recipeLinks = [
  { name: 'All Recipes', href: '/recipes' },
  { name: 'Chicken Recipes', href: '/recipes?category=chicken' },
  { name: 'Mutton Recipes', href: '/recipes?category=mutton' },
  { name: 'Vegetarian Recipes', href: '/recipes?category=vegetarian' },
  { name: 'Seafood Recipes', href: '/recipes?category=seafood' },
]

const featuredLinks = [
  { name: 'Best Sellers', href: '/shop?bestSeller=true' },
  { name: 'Family Packs', href: '/shop?size=family' },
  { name: 'Complete Collection', href: '/shop' },
]

export default function Header({ user }: { user: UserType | null }) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()
  
  const count = mounted ? totalItems() : 0

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setActiveMega(null)
  }, [pathname])

  useEffect(() => {
    if (!isMobileMenuOpen) return

    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed left-0 right-0 top-0 z-40 border-b transition-[background-color,border-color,padding] duration-300 ${
          isScrolled 
            ? 'border-gold/20 bg-[#080705]/94 py-2.5 backdrop-blur-xl'
            : 'border-gold/10 bg-gradient-to-b from-black/80 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="z-50 flex items-center" aria-label="Qureshi's home">
              <Image
                src="/images/qureshis-navbar-logo.png"
                alt="Qureshi's Masala & Spices"
                width={542}
                height={192}
                className="h-auto w-[122px] object-contain sm:w-[150px]"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden items-center gap-7 lg:flex xl:gap-9">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.hasMega && setActiveMega(link.href)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      pathname.startsWith(link.href) 
                        ? 'text-gold'
                        : 'text-white/70 hover:text-gold'
                    }`}
                  >
                    {link.label}
                    {link.hasMega && (
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-200 ${
                          activeMega === link.href ? 'rotate-180' : ''
                        }`} 
                      />
                    )}
                  </Link>

                  {/* Mega Menu for Shop */}
                  {link.hasMega && (
                    <AnimatePresence>
                      {activeMega === link.href && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-1/2 top-full mt-4 w-[900px] -translate-x-1/2 overflow-hidden rounded-[3px] border border-gold/20 bg-[#100d0a]/98 shadow-[0_30px_90px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                        >
                          <div className="grid grid-cols-12 gap-6 p-8">
                            {/* Shop by Product */}
                            <div className="col-span-4">
                              <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Shop by Product</h3>
                              <ul className="space-y-3">
                                {products.map((product) => (
                                  <li key={product.href}>
                                    <Link
                                      href={product.href}
                                      className="text-white/70 hover:text-gold transition-colors text-sm block"
                                    >
                                      {product.name}
                                    </Link>
                                  </li>
                                ))}
                                <li className="pt-2">
                                  <Link
                                    href="/shop"
                                    className="royal-button px-4 py-2"
                                  >
                                    Explore the Products
                                    <ChevronDown size={14} className="rotate-[-90deg]" />
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Recipes */}
                            <div className="col-span-4">
                              <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Recipes</h3>
                              <ul className="space-y-3">
                                {recipeLinks.map((recipe) => (
                                  <li key={recipe.href}>
                                    <Link
                                      href={recipe.href}
                                      className="text-white/70 hover:text-gold transition-colors text-sm block"
                                    >
                                      {recipe.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Featured & Image */}
                            <div className="col-span-4">
                              <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Featured</h3>
                              <ul className="space-y-3 mb-6">
                                {featuredLinks.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="text-white/70 hover:text-gold transition-colors text-sm block"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <div className="border-y border-gold/20 bg-gradient-to-r from-[#5b1718]/25 to-transparent p-4">
                                <p className="text-white/70 text-xs leading-relaxed">
                                  Discover our full range of authentic, freshly ground masalas crafted with care.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-3 lg:gap-5">
              <button
                aria-label="Search"
                className="hidden size-10 items-center justify-center text-white/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:flex"
              >
                <Search size={18} />
              </button>
              <Link
                href={user ? '/account' : '/login?next=/account'}
                aria-label={user ? 'Open my account' : 'Sign in'}
                className="flex size-10 items-center justify-center text-white/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <User size={20} />
              </Link>
              <Link
                href="/order"
                aria-label={`View cart with ${count} item${count === 1 ? '' : 's'}`}
                className="group relative flex min-h-10 min-w-10 items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:px-1"
              >
                <ShoppingBag size={18} className="text-white/70 group-hover:text-gold transition-colors" />
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
                <span className="text-xs tracking-[0.25em] uppercase text-white/60 group-hover:text-gold transition-colors hidden sm:block">
                  Cart
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex size-11 items-center justify-center rounded-[3px] border border-white/[0.09] bg-[#14110e] text-white shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[background-color,border-color,color,transform] duration-200 hover:border-gold/35 hover:bg-[#1b1612] hover:text-gold active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:hidden"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-site-menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default bg-black/[0.82]"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />

            <motion.aside
              initial={{ x: prefersReducedMotion ? 0 : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: prefersReducedMotion ? 0 : '100%' }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              id="mobile-site-menu"
              className="absolute inset-y-0 right-0 flex w-[min(92vw,26rem)] flex-col overflow-hidden border-l border-white/[0.08] bg-[#0b0908] shadow-[-32px_0_90px_rgba(0,0,0,0.64)]"
            >
              <div className="flex items-center justify-between border-b border-gold/20 px-6 py-5">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/images/qureshis-navbar-logo.png"
                    alt="Qureshi's Masala & Spices"
                    width={542}
                    height={192}
                    className="h-auto w-[132px] object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  autoFocus
                  className="flex size-11 items-center justify-center rounded-[2px] text-white/70 transition-colors hover:bg-white/5 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overscroll-contain overflow-y-auto px-6 py-8">
                <nav className="flex flex-col gap-3 border-y border-white/[0.07] py-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-display text-[2rem] font-semibold leading-none tracking-[-0.02em] transition-colors ${
                        pathname.startsWith(link.href) 
                          ? 'text-gold'
                          : 'text-white hover:text-gold'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-10 border-t border-white/[0.07] pt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-gold">
                    {user ? `Hello, ${user.full_name.split(' ')[0]}` : 'Your Account'}
                  </h3>
                  <div className="divide-y divide-white/[0.06] border-y border-white/[0.07] bg-white/[0.018]">
                    {user ? (
                      <>
                        <Link
                          href="/account#profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center gap-3 px-4 text-sm text-white/80 transition hover:bg-white/5 hover:text-gold"
                        >
                          <User size={18} aria-hidden="true" />
                          Profile &amp; saved address
                        </Link>
                        <Link
                          href="/account#orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center gap-3 px-4 text-sm text-white/80 transition hover:bg-white/5 hover:text-gold"
                        >
                          <ShoppingBag size={18} aria-hidden="true" />
                          Order history
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login?next=/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center gap-3 px-4 text-sm font-semibold text-white transition hover:bg-white/5 hover:text-gold"
                        >
                          <User size={18} aria-hidden="true" />
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center px-4 text-sm text-white/70 transition hover:bg-white/5 hover:text-gold"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-10 border-t border-white/[0.07] pt-8">
                  <h3 className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Products</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {products.slice(0, 6).map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white/70 hover:text-gold transition-colors text-sm block"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-white/[0.08] bg-[#0d0b09] p-6">
                <Link
                  href="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="royal-button w-full"
                >
                  <ShoppingBag size={18} />
                  View Cart ({count})
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className={`h-[72px] sm:h-[88px]`} />
    </>
  )
}
