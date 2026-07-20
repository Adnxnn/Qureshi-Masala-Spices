'use client';

import { useState } from 'react';
import Slideshow from '@/components/site/Slideshow';
import { motion } from 'framer-motion';

export default function DealershipPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shopType, setShopType] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopDetails, setShopDetails] = useState('');

  const handleWhatsAppClick = () => {
    const message = `Hello, I am interested in stocking Qureshi's Masala products.\n\nMy details are:\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nShop Type: ${shopType}\nShop Address: ${shopAddress}\nAdditional Details: ${shopDetails}\n\nPlease provide more information.`;
    const whatsappUrl = `https://wa.me/918762117816?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-28 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-tight mb-6">
            Stock <span className="text-gradient-gold">Our Products</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Are you interested in stocking Qureshi's Masala products in your shop, market, or supermarket? 
            We'd love to hear from you!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Side: Media Slideshow (Bigger) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative">
              <Slideshow 
                slides={[
                  '/images/Stock2.MP4',
                  '/images/Stock3.MP4',
                  '/images/Stock4.MP4'
                ]}
                aspectRatio="aspect-[12/9]"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold/10 rounded-full blur-2xl"></div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/95 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl">
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
                WhatsApp <span className="text-gold">Enquiry</span>
              </h3>
              <p className="mb-8 text-white/50 text-center text-sm">
                Fill out this quick form, and we'll prepare a WhatsApp message for you
              </p>

              <form className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Shop Type */}
                <div className="space-y-2">
                  <label htmlFor="shopType" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                    Select Business Type
                  </label>
                  <select
                    id="shopType"
                    name="shopType"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm"
                    value={shopType}
                    onChange={(e) => setShopType(e.target.value)}
                  >
                    <option value="">Select one</option>
                    <option value="Shop">Shop</option>
                    <option value="Super Market">Super Market</option>
                    <option value="Hyper Market">Hyper Market</option>
                    <option value="Retail Store">Retail Store</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                {/* Conditional Fields */}
                {shopType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5 overflow-hidden"
                  >
                    {/* Shop Address */}
                    <div className="space-y-2">
                      <label htmlFor="shopAddress" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                        Shop Address
                      </label>
                      <textarea
                        id="shopAddress"
                        name="shopAddress"
                        rows={3}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm resize-none"
                        placeholder="Enter your shop address"
                        value={shopAddress}
                        onChange={(e) => setShopAddress(e.target.value)}
                      />
                    </div>

                    {/* Additional Details */}
                    <div className="space-y-2">
                      <label htmlFor="shopDetails" className="text-xs tracking-[0.3em] uppercase text-white/50 font-semibold">
                        Additional Details
                      </label>
                      <textarea
                        id="shopDetails"
                        name="shopDetails"
                        rows={3}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all text-sm resize-none"
                        placeholder="Tell us more about your business"
                        value={shopDetails}
                        onChange={(e) => setShopDetails(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 mt-6 shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-.995-1.542-1.558-3.327-1.558-5.176 0-6.501 5.267-11.769 11.77-11.769 3.242 0 6.306 1.272 8.653 3.619s3.619 5.411 3.619 8.653c0 6.501-5.267 11.769-11.77 11.769-.875 0-1.748-.118-2.585-.342L.057 24zm6.597-3.807c.36-.184.72-.368 1.08-.552l1.687-.843c1.748.995 3.784 1.558 5.82 1.558 4.675 0 8.471-3.796 8.471-8.47s-3.796-8.47-8.47-8.47-8.47 3.796-8.47 8.47c0 1.968.663 3.844 1.84 5.378l-.843 1.687c-.184.36-.368.72-.552 1.08l-1.687.843zM12 5c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6zm-2 9h4c.552 0 1-.448 1-1s-.448-1-1-1h-4c-.552 0-1 .448-1 1s.448 1-1 1z"/>
                  </svg>
                  <span className="text-sm tracking-[0.2em] uppercase">WhatsApp Us</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
