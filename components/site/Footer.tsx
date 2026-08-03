import Link from 'next/link'
import Image from 'next/image'
import { SITE } from '@/lib/site-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="royal-grain relative overflow-hidden border-t border-gold/20 bg-[#080705]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/qureshis-navbar-logo.png"
                alt="Qureshi's Masala & Spices"
                width={542}
                height={192}
                className="h-auto w-[190px] object-contain"
              />
            </Link>
            <p className="mb-6 max-w-md text-sm leading-7 text-cream/55 sm:text-base">
              A Legacy of Flavour, Crafted with Passion. Small-batch masalas made with authentic recipes and premium ingredients.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/qureshis_masala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://wa.me/918762117816"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors"
              >
                WhatsApp
              </a>
              <a 
                href={`mailto:${SITE.email}`}
                className="text-white/50 hover:text-gold transition-colors"
              >
                Email
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Shop</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/shop" className="text-white/50 hover:text-white transition-colors text-sm">Shop All</Link>
              </li>
              <li>
                <Link href="/shop?bestSeller=true" className="text-white/50 hover:text-white transition-colors text-sm">Best Sellers</Link>
              </li>
              <li>
                <Link href="/shop" className="text-white/50 hover:text-white transition-colors text-sm">Collections</Link>
              </li>
              <li>
                <Link href="/shop?size=family" className="text-white/50 hover:text-white transition-colors text-sm">Family Packs</Link>
              </li>
            </ul>
          </div>

          {/* Learn Column */}
          <div>
            <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Learn</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/our-story" className="text-white/50 hover:text-white transition-colors text-sm">Our Story</Link>
              </li>
              <li>
                <Link href="/our-heritage" className="text-white/50 hover:text-white transition-colors text-sm">Our Heritage</Link>
              </li>
              <li>
                <Link href="/recipes" className="text-white/50 hover:text-white transition-colors text-sm">Recipes</Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/50 hover:text-white transition-colors text-sm">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Business & Support Column */}
          <div>
            <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Business</h3>
            <ul className="space-y-2.5 mb-6">
              <li>
                <Link href="/stock-our-products" className="text-white/50 hover:text-white transition-colors text-sm">Stock Our Products</Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/50 hover:text-white transition-colors text-sm">Contact</Link>
              </li>
            </ul>
            
            <h3 className="text-gold text-[11px] font-bold tracking-[0.3em] uppercase mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/order" className="text-white/50 hover:text-white transition-colors text-sm">Ordering Info</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-white/50 hover:text-white transition-colors text-sm">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms-and-conditions" className="text-white/50 hover:text-white transition-colors text-sm">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gold/15 pt-8 sm:flex-row">
          <p className="text-white/30 text-xs sm:text-sm">
            © {currentYear} Qureshi's Masala & Spices. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-white/30 text-xs uppercase tracking-wider border border-white/10 px-3 py-1 rounded">100% Natural</span>
            <span className="text-white/30 text-xs uppercase tracking-wider border border-white/10 px-3 py-1 rounded">No Preservatives</span>
            <span className="text-white/30 text-xs uppercase tracking-wider border border-white/10 px-3 py-1 rounded">Made in India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
