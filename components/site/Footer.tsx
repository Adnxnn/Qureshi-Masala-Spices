import Image from 'next/image'
import Link from 'next/link'
import { SITE } from '@/lib/site-config'

const groups = [
  {
    title: 'Explore',
    links: [
      ['/shop', 'Shop'],
      ['/recipes', 'Recipes'],
      ['/our-story', 'Our Story'],
      ['/our-heritage', 'Heritage'],
    ],
  },
  {
    title: 'Help',
    links: [
      ['/contact', 'Contact'],
      ['/faq', 'FAQ'],
      ['/order', 'Your Bag'],
      ['/stock-our-products', 'For Retailers'],
    ],
  },
  {
    title: 'Legal',
    links: [
      ['/privacy-policy', 'Privacy'],
      ['/terms', 'Terms'],
    ],
  },
] as const

export default function Footer() {
  return (
    <footer className="minimal-footer">
      <div className="minimal-footer__top">
        <div className="minimal-footer__brand">
          <Image
            src="/images/qureshis-navbar-logo.png"
            alt="Qureshi's Masala & Spices"
            width={542}
            height={192}
          />
          <p>Small-batch masalas, grounded in Kodagu and made for the everyday kitchen.</p>
        </div>

        <div className="minimal-footer__links">
          {groups.map((group) => (
            <div key={group.title}>
              <h2>{group.title}</h2>
              {group.links.map(([href, label]) => (
                <Link key={href} href={href}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="minimal-footer__bottom">
        <p>© {new Date().getFullYear()} Qureshi&apos;s Masala &amp; Spices</p>
        <div>
          <a href="https://www.instagram.com/qureshis_masala" target="_blank" rel="noreferrer">Instagram</a>
          <a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`mailto:${SITE.email}`}>Email</a>
        </div>
      </div>
    </footer>
  )
}
