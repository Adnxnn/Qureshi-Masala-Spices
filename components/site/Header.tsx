'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* Desktop Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="z-50 flex items-center" aria-label="Qureshi's home">
              <Image
                src="/images/Qureshi's Nav.png"
                alt="Qureshi's Masala & Spices"
                width={160}
                height={40}
                className="h-auto w-[132px] object-contain sm:w-[160px]"
                priority
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.hasMega && setActiveMega(link.href)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase transition-colors ${
                      pathname.startsWith(link.href) 
                        ? 'text-[#C9A84C]' 
                        : 'text-white/70 hover:text-[#C9A84C]'
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
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[900px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                          <div className="grid grid-cols-12 gap-6 p-8">
                            {/* Shop by Product */}
                            <div className="col-span-4">
                              <h3 className="text-[#C9A84C] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Shop by Product</h3>
                              <ul className="space-y-3">
                                {products.map((product) => (
                                  <li key={product.href}>
                                    <Link
                                      href={product.href}
                                      className="text-white/70 hover:text-[#C9A84C] transition-colors text-sm block"
                                    >
                                      {product.name}
                                    </Link>
                                  </li>
                                ))}
                                <li className="pt-2">
                                  <Link
                                    href="/shop"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A84C] to-[#E8A020] text-black px-4 py-2 text-[10px] font-bold tracking-[0.3em] uppercase hover:from-[#E8A020] hover:to-[#C9A84C] transition-all duration-300 rounded-xl"
                                  >
                                    Explore the Products
                                    <ChevronDown size={14} className="rotate-[-90deg]" />
                                  </Link>
                                </li>
                              </ul>
                            </div>

                            {/* Recipes */}
                            <div className="col-span-4">
                              <h3 className="text-[#C9A84C] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Recipes</h3>
                              <ul className="space-y-3">
                                {recipeLinks.map((recipe) => (
                                  <li key={recipe.href}>
                                    <Link
                                      href={recipe.href}
                                      className="text-white/70 hover:text-[#C9A84C] transition-colors text-sm block"
                                    >
                                      {recipe.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Featured & Image */}
                            <div className="col-span-4">
                              <h3 className="text-[#C9A84C] text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Featured</h3>
                              <ul className="space-y-3 mb-6">
                                {featuredLinks.map((item) => (
                                  <li key={item.href}>
                                    <Link
                                      href={item.href}
                                      className="text-white/70 hover:text-[#C9A84C] transition-colors text-sm block"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <div className="bg-gradient-to-br from-[#6B1A1A]/30 to-[#C9A84C]/10 rounded-xl p-4 border border-white/5">
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
                className="hidden size-10 items-center justify-center text-white/70 transition-colors hover:text-[#C9A84C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] sm:flex"
              >
                <Search size={18} />
              </button>
              <Link
                href={user ? '/account' : '/login?next=/account'}
                aria-label={user ? 'Open my account' : 'Sign in'}
                className="flex size-10 items-center justify-center text-white/70 transition-colors hover:text-[#C9A84C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C]"
              >
                <User size={20} />
              </Link>
              <Link
                href="/order"
                aria-label={`View cart with ${count} item${count === 1 ? '' : 's'}`}
                className="group relative flex min-h-10 min-w-10 items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] sm:px-1"
              >
                <ShoppingBag size={18} className="text-white/70 group-hover:text-[#C9A84C] transition-colors" />
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-[#C9A84C] text-black text-[10px] font-bold flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
                <span className="text-xs tracking-[0.25em] uppercase text-white/60 group-hover:text-[#C9A84C] transition-colors hidden sm:block">
                  Cart
                </span>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="flex size-10 items-center justify-center text-white/70 transition-colors hover:text-[#C9A84C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A84C] lg:hidden"
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
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
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-[#0a0a0a] lg:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image
                    src="/images/Qureshi's Nav.png"
                    alt="Qureshi's Masala"
                    width={140}
                    height={32}
                    className="object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-[#C9A84C] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overscroll-contain overflow-y-auto px-6 py-8">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-lg font-bold tracking-[0.15em] uppercase transition-colors ${
                        pathname.startsWith(link.href) 
                          ? 'text-[#C9A84C]' 
                          : 'text-white hover:text-[#C9A84C]'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-10 border-t border-white/10 pt-8">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                    {user ? `Hello, ${user.full_name.split(' ')[0]}` : 'Your Account'}
                  </h3>
                  <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
                    {user ? (
                      <>
                        <Link
                          href="/account#profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center gap-3 px-4 text-sm text-white/80 transition hover:bg-white/5 hover:text-[#C9A84C]"
                        >
                          <User size={18} aria-hidden="true" />
                          Profile &amp; saved address
                        </Link>
                        <Link
                          href="/account#orders"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center gap-3 px-4 text-sm text-white/80 transition hover:bg-white/5 hover:text-[#C9A84C]"
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
                          className="flex min-h-12 items-center gap-3 px-4 text-sm font-semibold text-white transition hover:bg-white/5 hover:text-[#C9A84C]"
                        >
                          <User size={18} aria-hidden="true" />
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex min-h-12 items-center px-4 text-sm text-white/70 transition hover:bg-white/5 hover:text-[#C9A84C]"
                        >
                          Create account
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <h3 className="text-[#C9A84C] text-xs font-bold tracking-[0.3em] uppercase mb-4">Products</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {products.slice(0, 6).map((product) => (
                      <Link
                        key={product.href}
                        href={product.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white/70 hover:text-[#C9A84C] transition-colors text-sm block"
                      >
                        {product.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10">
                <Link
                  href="/order"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] text-black px-6 py-3.5 rounded-xl font-bold tracking-[0.2em] uppercase text-sm hover:bg-[#E8A020] transition-colors"
                >
                  <ShoppingBag size={18} />
                  View Cart ({count})
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className={`h-[72px] sm:h-[88px]`} />
    </>
  )
}
