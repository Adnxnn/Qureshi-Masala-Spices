'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, Search, ShoppingBag, User, X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { User as UserType } from '@/types'
import styles from './Navigation.module.css'

const links = [['/shop', 'Shop spices'], ['/recipes', 'Recipes'], ['/our-story', 'Our story'], ['/our-heritage', 'Our heritage'], ['/stock-our-products', 'For retailers'], ['/contact', 'Contact']]
export default function Header({ user }: { user: UserType | null }) {
  const pathname = usePathname()
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const [panel, setPanel] = useState<'menu' | 'search' | 'cart'>('menu')
  const [mounted, setMounted] = useState(false)
  const { items, updateQty, removeItem } = useCart()
  const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.variant.price, 0)
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
      <Link href="/" aria-label="Qureshi's home" className={styles.logo}><Image src="/images/qureshis-navbar-logo.png" alt="Qureshi’s Masala & Spices" width={542} height={192} priority /></Link>
      <nav aria-label="Main navigation" className={styles.desktop}>{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className={styles.actions}>
        <button aria-label="Search spices" onClick={e => openPanel('search', e.currentTarget)}><Search size={21} /></button>
        <Link className={styles.account} href={user ? '/account' : '/login'} aria-label={user ? 'Your account' : 'Sign in'}><User size={21} /></Link>
        <button aria-label={'Open shopping bag, ' + count + ' items'} onClick={e => openPanel('cart', e.currentTarget)}><ShoppingBag size={21} />{count > 0 && <span className={styles.count}>{count}</span>}</button>
        <button className={styles.menuButton} aria-label="Open menu" onClick={e => openPanel('menu', e.currentTarget)}><Menu size={23} /></button>
      </div>
    </div></header>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="navigation-panel-title" onClick={e => { if (e.target === e.currentTarget) close() }}>
      <div className={styles.panel}>
        <div className={styles.panelHeader}><h2 id="navigation-panel-title">{panel === 'cart' ? 'Your bag (' + count + ')' : panel === 'search' ? 'Find your flavour' : 'Explore Qureshi’s'}</h2><button onClick={close} aria-label="Close panel"><X /></button></div>
        {panel === 'menu' && <><nav className={styles.mobile} aria-label="Mobile navigation">{links.map(([href, label], i) => <Link onClick={close} href={href} key={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}><span>0{i + 1}</span>{label}<ArrowUpRight size={20} /></Link>)}</nav><div className={styles.menuFoot}><Link onClick={close} href={user ? '/account' : '/login'}><User size={19} />{user ? 'Your account & orders' : 'Sign in / create account'}</Link><Link onClick={close} href="/faq">Questions? Visit our help centre</Link></div></>}
        {panel === 'search' && <div className={styles.search}><p>Search for a spice or the dish you want to cook.</p><form action="/shop" onSubmit={close}><label htmlFor="global-search">Spice or dish name</label><div><input id="global-search" name="q" type="search" placeholder="Try biryani, kebab or turmeric" required /><button type="submit" aria-label="Search"><Search size={20} /></button></div></form><h3>A good place to start</h3><div className={styles.suggestions}>{['Biryani', 'Kebab', 'Chicken', 'Garam'].map(q => <Link onClick={close} key={q} href={'/shop?q=' + q}>{q}<ArrowUpRight size={16} /></Link>)}</div><Link onClick={close} href="/shop" className={styles.primary}>Explore all spices <ArrowUpRight size={18} /></Link></div>}
        {panel === 'cart' && <><div className={styles.cartItems}>{!count ? <div className={styles.empty}><ShoppingBag size={44} /><h3>Good meals start here.</h3><p>Your bag is ready for its first flavour.</p><Link onClick={close} href="/shop" className={styles.primary}>Discover the collection</Link></div> : items.map(item => {
          const totalForProduct = items.filter(row => row.product.id === item.product.id).reduce((sum, row) => sum + row.quantity, 0)
          return <article className={styles.cartItem} key={item.product.id + '-' + item.variant.weight_grams}><Image src={item.product.image_url} alt="" width={80} height={100} /><div><h3>{item.product.name}</h3><p>{item.variant.weight_grams >= 1000 ? item.variant.weight_grams / 1000 + 'kg' : item.variant.weight_grams + 'g'} · ₹{item.variant.price}</p><div className={styles.quantity}><button aria-label={'Decrease ' + item.product.name} onClick={() => updateQty(item.product.id, item.variant.weight_grams, item.quantity - 1)}><Minus size={15} /></button><span>{item.quantity}</span><button aria-label={'Increase ' + item.product.name} disabled={totalForProduct >= item.product.stock_qty} onClick={() => updateQty(item.product.id, item.variant.weight_grams, item.quantity + 1)}><Plus size={15} /></button><button aria-label={'Remove ' + item.product.name} onClick={() => removeItem(item.product.id, item.variant.weight_grams)}><Trash2 size={15} /></button></div></div><strong>₹{item.variant.price * item.quantity}</strong></article>
        })}</div>{count > 0 && <div className={styles.cartFoot}><div><span>Items subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><p>Discounts reviewed in cart. Delivery and payment confirmed with our team on WhatsApp.</p><Link onClick={close} href="/order" className={styles.primary}>Review cart & continue <ArrowUpRight size={18} /></Link><button onClick={close}>Continue exploring</button></div>}</>}
      </div>
    </dialog>
  </>
}
