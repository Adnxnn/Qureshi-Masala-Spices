'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MessageCircle, Send } from 'lucide-react'
import { SITE } from '@/lib/site-config'

const ENQUIRY_TYPES = ['Product Enquiry', 'Order Support', 'Retail Partnership', 'Recipe Question', 'General Enquiry'] as const

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Open WhatsApp with prefilled message
    const whatsappMessage = `Hello Qureshi's Masala & Spices,

I have a ${formData.enquiryType}.

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}

Subject: ${formData.subject}
Message: ${formData.message}

Please get back to me soon!`
    
    const whatsappUrl = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
    
    setTimeout(() => setIsSubmitting(false), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
            Get in Touch
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-6">
            Contact Us
          </h1>
          <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Have a question or want to get in touch? We&apos;d love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="space-y-6">
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Phone className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase mb-1">Phone</h3>
                    <a
                      href={`tel:${SITE.whatsappNumber}`}
                      className="text-white/60 hover:text-gold transition-colors duration-300"
                    >
                      +{SITE.whatsappNumber.slice(0, 2)} {SITE.whatsappNumber.slice(2)}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <MessageCircle className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase mb-1">WhatsApp</h3>
                    <a
                      href={`https://wa.me/${SITE.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-gold transition-colors duration-300"
                    >
                      Message us on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                    <Mail className="text-gold" size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase mb-1">Email</h3>
                    <a
                      href={`mailto:${SITE.email}`}
                      className="text-white/60 hover:text-gold transition-colors duration-300"
                    >
                      {SITE.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-display text-xl uppercase mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <a
                    href="/stock-our-products"
                    className="block text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    Stock Our Products
                  </a>
                  <a
                    href="/faq"
                    className="block text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    FAQ
                  </a>
                  <a
                    href="/shop"
                    className="block text-white/60 hover:text-gold transition-colors duration-300"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10">
              <h2 className="font-display text-2xl sm:text-3xl uppercase mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
                    placeholder="Your email address"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="enquiryType" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Enquiry Type
                  </label>
                  <select
                    id="enquiryType"
                    required
                    value={formData.enquiryType}
                    onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
                  >
                    <option value="">Select an enquiry type</option>
                    {ENQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300"
                    placeholder="Subject"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 text-white px-4 sm:px-6 py-3.5 sm:py-4 rounded-xl focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all duration-300 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gold hover:bg-gold-light text-black flex items-center justify-center gap-2 px-8 py-4 text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase transition-all duration-300 disabled:opacity-50 rounded-xl"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Opening WhatsApp...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
