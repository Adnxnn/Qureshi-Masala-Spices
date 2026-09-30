'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import BrandMark from './BrandMark'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useFavorites } from '@/lib/favorites'
import type { User as UserType } from '@/types'
import styles from './Navigation.module.css'

const links = [['/shop', 'Shop spices'], ['/recipes', 'Recipes'], ['/our-story', 'Our story'], ['/our-heritage', 'Our heritage'], ['/stock-our-products', 'For retailers'], ['/contact', 'Contact']]
export default function Header({ user }: { user: UserType | null }) {
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [panel, setPanel] = useState<'menu' | 'search'>('menu')
  const [mounted, setMounted] = useState(false)
  const { items } = useCart()
  const favoritesCount = useFavorites(state => state.productIds.length)
  const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { dialog.current?.close() }, [pathname])
  useEffect(() => {
    const element = dialog.current
    const restore = () => { document.body.style.overflow = ''; trigger.current?.focus() }
    element?.addEventListener('close', restore)
    return () => { element?.removeEventListener('close', restore); document.body.style.overflow = '' }
  }, [])
  function openPanel(next: typeof panel, button: HTMLButtonElement) {
    trigger.current = button
    setPanel(next)
    dialog.current?.showModal()
    document.body.style.overflow = 'hidden'
  }
  function close() { dialog.current?.close() }
  return <>
    <a className={styles.skip} href="#main-content">Skip to content</a>
    <header className={styles.header}><div className={styles.bar}>
      <Link href="/" aria-label="QMS home" className={styles.logo}><BrandMark /></Link>
      <nav aria-label="Main navigation" className={styles.desktop}>{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className={styles.actions}>
        <button aria-label="Search spices" onClick={e => openPanel('search', e.currentTarget)}><Search size={21} /></button>
        <Link className={styles.account} href={user ? '/account' : '/login'} aria-label={user ? 'Your account' : 'Sign in'}><User size={21} /></Link>
        <Link href="/favorites" aria-label={'View favorites, ' + (mounted ? favoritesCount : 0) + ' items'} aria-current={pathname === '/favorites' ? 'page' : undefined}><Heart size={21} fill={pathname === '/favorites' ? 'currentColor' : 'none'} />{mounted && favoritesCount > 0 && <span className={styles.count}>{favoritesCount}</span>}</Link>
        <Link href="/order" aria-label={'View cart, ' + count + ' items'} aria-current={pathname === '/order' ? 'page' : undefined}><ShoppingBag size={21} />{count > 0 && <span className={styles.count}>{count}</span>}</Link>
        <button className={styles.menuButton} aria-label="Open menu" onClick={e => openPanel('menu', e.currentTarget)}><Menu size={23} /></button>
      </div>
    </div></header>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="navigation-panel-title" onClick={e => { if (e.target === e.currentTarget) close() }}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}><h2 id="navigation-panel-title">{panel === 'search' ? 'Find your flavour' : 'Explore QMS'}</h2><button onClick={close} aria-label="Close panel"><X /></button></div>
        {panel === 'menu' && <><nav className={styles.mobile} aria-label="Mobile navigation">{links.map(([href, label], i) => <Link onClick={close} href={href} key={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}><span>0{i + 1}</span>{label}<ArrowUpRight size={20} /></Link>)}</nav><div className={styles.menuFoot}><Link onClick={close} href="/favorites"><Heart size={19} />Your favorites{mounted && favoritesCount > 0 ? ` (${favoritesCount})` : ''}</Link><Link onClick={close} href={user ? '/account' : '/login'}><User size={19} />{user ? 'Your account & orders' : 'Sign in / create account'}</Link><Link onClick={close} href="/faq">Questions? Visit our help centre</Link></div></>}
        {panel === 'search' && <div className={styles.search}><p>Search for a spice or the dish you want to cook.</p><form action="/shop" onSubmit={close}><label htmlFor="global-search">Spice or dish name</label><div><input id="global-search" name="q" type="search" placeholder="Try biryani, kebab or turmeric" required /><button type="submit" aria-label="Search"><Search size={20} /></button></div></form><h3>A good place to start</h3><div className={styles.suggestions}>{['Biryani', 'Kebab', 'Chicken', 'Garam'].map(q => <Link onClick={close} key={q} href={'/shop?q=' + q}>{q}<ArrowUpRight size={16} /></Link>)}</div><Link onClick={close} href="/shop" className={styles.primary}>Explore all spices <ArrowUpRight size={18} /></Link></div>}
      </div>
    </dialog>
  </>
}
