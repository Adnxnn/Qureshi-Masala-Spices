'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { User as UserType } from '@/types'

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/our-heritage', label: 'Heritage' },
  { href: '/recipes', label: 'Recipes' },
  { href: '/stock-our-products', label: 'For Retailers' },
  { href: '/contact', label: 'Contact' },
]

export default function Header({ user }: { user: UserType | null }) {
  const pathname = usePathname()
  const { totalItems } = useCart()
  const reduceMotion = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const count = mounted ? totalItems() : 0

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const overflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <>
      <header className="minimal-header" data-scrolled={scrolled}>
        <div className="minimal-header__inner">
          <Link href="/" className="minimal-header__logo" aria-label="Qureshi's home">
            <Image
              src="/images/qureshis-navbar-logo.png"
              alt="Qureshi's Masala & Spices"
              width={542}
              height={192}
              priority
            />
          </Link>

          <nav className="minimal-header__nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-active={pathname.startsWith(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="minimal-header__actions">
            <Link
              href={user ? '/account' : '/login?next=/account'}
              aria-label={user ? 'Open account' : 'Sign in'}
              className="minimal-icon-button"
            >
              <User size={18} strokeWidth={1.8} />
            </Link>
            <Link href="/order" className="minimal-cart" aria-label={`Cart with ${count} items`}>
              <ShoppingBag size={18} strokeWidth={1.8} />
              <span className="minimal-cart__label">Bag</span>
              {count > 0 ? <span className="minimal-cart__count">{count}</span> : null}
            </Link>
            <button
              type="button"
              className="minimal-menu-button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="minimal-mobile-menu"
            initial={reduceMotion ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="minimal-mobile-menu__top">
              <Image
                src="/images/qureshis-navbar-logo.png"
                alt="Qureshi's Masala & Spices"
                width={542}
                height={192}
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} />
              </button>
            </div>
            <nav aria-label="Mobile navigation">
              {navLinks.map((link, index) => (
                <Link key={link.href} href={link.href}>
                  <span>{link.label}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </Link>
              ))}
            </nav>
            <div className="minimal-mobile-menu__bottom">
              <Link href={user ? '/account' : '/login?next=/account'}>
                {user ? 'My account' : 'Sign in'}
              </Link>
              <Link href="/order">Shopping bag ({count})</Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
