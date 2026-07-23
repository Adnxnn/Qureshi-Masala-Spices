'use client';

import { useState } from 'react';
import Slideshow from '@/components/site/Slideshow';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

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
    <div className="royal-page royal-grain min-h-screen pb-20 pt-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="royal-eyebrow mb-4">Retail partnerships</p>
          <h1 className="royal-title mb-6 text-5xl sm:text-6xl md:text-7xl">
            Stock <span className="text-gradient-gold">our products.</span>
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
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5"
          >
            <div className="royal-panel p-6 sm:p-8">
              <h3 className="mb-2 text-center font-display text-4xl font-bold text-cream sm:text-5xl">
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
                    className="royal-field px-4 py-3.5 text-sm placeholder-white/30"
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
                    className="royal-field px-4 py-3.5 text-sm placeholder-white/30"
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
                    className="royal-field px-4 py-3.5 text-sm placeholder-white/30"
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
                    className="royal-field px-4 py-3.5 text-sm"
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
                        className="royal-field resize-none px-4 py-3.5 text-sm placeholder-white/30"
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
                        className="royal-field resize-none px-4 py-3.5 text-sm placeholder-white/30"
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
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-3 rounded-[2px] border border-green-500/35 bg-green-700 px-6 py-4 font-bold text-white transition-colors duration-300 hover:bg-green-600"
                >
                  <MessageCircle aria-hidden="true" className="size-5" />
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
