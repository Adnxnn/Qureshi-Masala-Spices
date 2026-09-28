'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Mail, MessageCircle, Phone, CheckCircle2 } from 'lucide-react'
import { SITE } from '@/lib/site-config'
import styles from './Enquiry.module.css'

export default function EnquiryPage({ retail = false }: { retail?: boolean }) {
  const [readyMessage, setReadyMessage] = useState('')
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = 'Hello Qureshi’s Masala & Spices,\n\n' + Array.from(data.entries()).map(([key, value]) => key + ': ' + value).join('\n')
    const url = 'https://wa.me/' + SITE.whatsappNumber + '?text=' + encodeURIComponent(message)
    setReadyMessage(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  return <div className={styles.page}>
    <div className={styles.container}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Home</Link><span>/</span><span>{retail ? 'Retail partnerships' : 'Contact'}</span></nav>
      <header className={styles.intro}><p className={styles.eyebrow}>{retail ? 'Good flavour. Great partnerships.' : 'A real conversation, always.'}</p><h1>{retail ? <>A place on your shelf.<br /><em>A flavour they’ll remember.</em></> : <>A little help.<br /><em>A lot of heart.</em></>}</h1><p>{retail ? 'Bring Qureshi’s to your customers. Tell us about your business and let’s explore the right collection for your shelves.' : 'Choosing a masala, planning a meal, or checking an order? We’re here to help you take the next step.'}</p></header>
      <div className={styles.grid}>
        <aside className={styles.aside}>
          <div className={styles.photo}><Image src="/images/Ourheritage1.jpg" alt="Colourful spices in wooden bowls" fill sizes="(max-width: 760px) 100vw, 40vw" /><div><p>{retail ? 'Let’s grow together.' : 'From our kitchen to yours.'}</p><span>Qureshi’s Masala & Spices</span></div></div>
          <div className={styles.channels}><a href={'https://wa.me/' + SITE.whatsappNumber} target="_blank" rel="noopener noreferrer"><MessageCircle /><div><strong>Chat on WhatsApp</strong><span>Products, orders & delivery</span></div><ArrowUpRight /></a><a href={'mailto:' + SITE.email}><Mail /><div><strong>Email our team</strong><span>{SITE.email}</span></div><ArrowUpRight /></a><a href={'tel:+' + SITE.whatsappNumber}><Phone /><div><strong>Give us a call</strong><span>+91 {SITE.whatsappNumber.slice(2)}</span></div><ArrowUpRight /></a></div>
          <Link href={retail ? '/shop' : '/faq'} className={styles.help}>{retail ? 'Explore the spice collection' : 'Looking for a quick answer? Read our FAQs'}<ArrowUpRight size={18} /></Link>
        </aside>
        <section className={styles.formPanel} aria-labelledby="enquiry-title"><p className={styles.eyebrow}>{retail ? 'Your next chapter' : 'How can we help?'}</p><h2 id="enquiry-title">{retail ? 'Tell us about your business.' : 'Let’s talk spice.'}</h2><p className={styles.note}>This form prepares a WhatsApp message. You review and send it in WhatsApp—nothing is sent automatically.</p>
          <form onSubmit={submit} onChange={() => setReadyMessage('')}>
            <div className={styles.fields}><label>Your name<input name="Name" autoComplete="name" required minLength={2} placeholder="Full name" /></label><label>Phone number<input name="Phone" type="tel" autoComplete="tel" required minLength={10} maxLength={16} placeholder="+91" /></label></div>
            <label><span>Email <small>(optional)</small></span><input name="Email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
            <label>{retail ? 'Business type' : 'I need help with'}<select name={retail ? 'Business type' : 'Topic'} required defaultValue=""><option value="" disabled>Choose an option</option>{(retail ? ['Grocery store', 'Supermarket', 'Restaurant or caterer', 'Distributor', 'Other business'] : ['Choosing a product', 'An existing order', 'Delivery or payment', 'A recipe', 'Something else']).map(option => <option key={option}>{option}</option>)}</select></label>
            {retail && <label>Business name & location<input name="Business" autoComplete="organization" required placeholder="Store name, city and pincode" /></label>}
            <label>{retail ? 'What would you like to stock?' : 'Your message'}<textarea name="Message" rows={4} required minLength={10} placeholder={retail ? 'Tell us about your customers and the products you’re interested in.' : 'Tell us a little more. For order support, include your order reference.'} /></label>
            <button type="submit" className={styles.submit}>Continue on WhatsApp <ArrowUpRight size={18} /></button>
            {readyMessage && <div role="status" className={styles.status}><CheckCircle2 size={20} /><p>Your message is ready—not sent yet. <a href={readyMessage} target="_blank" rel="noopener noreferrer">Open WhatsApp</a> to review and send.</p></div>}
            <p className={styles.privacy}>Your details are included only in your enquiry. <Link href="/privacy-policy">Privacy policy</Link></p>
          </form>
        </section>
      </div>
      <section className={styles.next}><div><p className={styles.eyebrow}>While you’re here</p><h2>{retail ? 'See what’s cooking.' : 'Something delicious awaits.'}</h2></div><Link href={retail ? '/our-story' : '/recipes'}>{retail ? 'Get to know Qureshi’s' : 'Explore our recipes'}<ArrowUpRight size={20} /></Link></section>
    </div>
  </div>
}
