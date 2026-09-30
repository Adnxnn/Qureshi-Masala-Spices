import Link from 'next/link'
import BrandMark from './BrandMark'
import { SITE } from '@/lib/site-config'

export default function Footer() {
  return <footer className="site-footer"><div className="footer-inner">
    <div className="footer-signoff"><p>A little spice.<br /><em>Endless possibilities.</em></p><span>Make something worth sharing.</span></div>
    <div className="footer-intro"><div><Link href="/" aria-label="QMS home"><BrandMark /></Link><p>For the meals you grew up with.<br />And the ones you&apos;ll make your own.</p></div><Link href="/shop" className="royal-button">Find your next favourite ↗</Link></div>
    <nav aria-label="Footer navigation" className="footer-links">
      <div><h2>Explore</h2><Link href="/shop">All spices</Link><Link href="/recipes">Recipes</Link><Link href="/our-story">Our story</Link><Link href="/our-heritage">Our heritage</Link></div>
      <div><h2>Here to help</h2><Link href="/account">My account</Link><Link href="/order">Your cart</Link><Link href="/faq">Common questions</Link><Link href="/terms#delivery">Delivery &amp; returns</Link><Link href="/contact">Contact us</Link></div>
      <div><h2>Let&apos;s connect</h2><Link href="/stock-our-products">Stock our products</Link><a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp ↗</a><a href={`mailto:${SITE.email}`}>Email our team</a><a href="https://www.instagram.com/qureshis_masala" target="_blank" rel="noopener noreferrer">Instagram ↗</a></div>
    </nav>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} QMS</p><div className="flex gap-5"><Link href="/privacy-policy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
  </div></footer>
}
