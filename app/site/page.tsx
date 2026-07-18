'use client'
import { getProducts } from '@/lib/actions'
import HeroSection from '@/components/site/HeroSection'
import ProductGrid from '@/components/site/ProductGrid'
import Carousel from '@/components/site/Carousel'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { Product } from '@/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts()
        setProducts(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <HeroSection />

      {/* STATS BAR */}
      <div className="bg-gradient-to-r from-gold via-yellow-500 to-gold py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-12">
          {[
            { num: '100%', label: 'Natural' },
            { num: '0',    label: 'Preservatives' },
            { num: '15+',  label: 'Blends' },
            { num: 'Small', label: 'Batch' },
            { num: '★ 4.9', label: 'Rating' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="font-display text-4xl sm:text-5xl text-black leading-none">{s.num}</div>
              <div className="text-[10px] tracking-[0.3em] uppercase text-black/60 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="bg-zinc-950 overflow-hidden py-4 border-y border-white/5">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, di) =>
            ['Kebab Masala', 'Fish Fry Masala', 'Fish Curry Masala', 'Biryani Masala', 'Chicken Masala', 'Garam Masala', 'Coriander Powder', 'Chaat Masala'].map((item, idx) => (
              <span key={`${di}-${idx}`} className="font-display text-xl sm:text-2xl tracking-widest uppercase text-white/20 px-6 sm:px-10">
                {item} <span className="text-gold/30 mx-4">•</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* PRODUCTS SECTION */}
      <section className="bg-black py-20 sm:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-6"
            >
              <span className="text-[11px] tracking-[0.4em] uppercase text-gold border border-gold/30 px-6 py-2 rounded-full">
                Our Signature Range
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl uppercase leading-none mb-4"
            >
              Crafted for <span className="text-gradient-gold">Perfection</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 font-serif italic max-w-2xl mx-auto"
            >
              Every blend is a celebration of authentic spices, sourced and ground with care.
            </motion.p>
          </div>
          <ProductGrid products={products} loading={loading} />
          <div className="text-center mt-12">
            <Link href="/shop" className="inline-block border-2 border-gold/40 text-gold px-10 sm:px-14 py-4 text-xs font-bold tracking-[0.3em] uppercase hover:bg-gold hover:text-black transition-all duration-300">
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="bg-zinc-950 py-20 sm:py-28 px-4 sm:px-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-[11px] tracking-[0.4em] uppercase text-gold mb-6"
            >
              Why Choose Us
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl uppercase leading-none"
            >
              The <span className="text-gradient-gold">Qureshi's Difference</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: '🌿', title: '100% Natural', desc: 'No artificial colours, flavours or fillers. Just pure spices.' },
              { icon: '⚗️', title: 'Small Batch',  desc: 'Ground in small quantities to lock in maximum aroma and flavour.' },
              { icon: '🏅', title: 'Premium Grade', desc: 'Whole spices sourced directly from origin farms across India.' },
              { icon: '🚫', title: 'No Preservatives', desc: 'Clean label. What you see is exactly what you get.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="p-8 bg-black/40 border border-white/5 hover:border-gold/30 transition-all duration-300 rounded-2xl group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                <div className="text-sm font-bold tracking-[0.2em] uppercase text-white mb-3">{feature.title}</div>
                <div className="text-sm text-white/40 leading-relaxed">{feature.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section id="heritage" className="bg-gradient-to-b from-black to-zinc-950 py-20 sm:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">Our Heritage</div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase leading-none mb-6">
              Spice is our <span className="text-gradient-gold">Heritage</span>
            </h2>
            <p className="text-white/45 leading-relaxed mb-8">
              At Qureshi's, we believe a great masala isn't made in a factory — it's crafted with intent and generations of knowledge. Each blend in our range is small-batch ground to preserve the volatile oils that mass production destroys. What you smell when you open a packet is real, authentic aroma.
            </p>
            <Link href="/our-heritage" className="inline-flex items-center gap-3 text-gold text-xs font-bold tracking-[0.3em] uppercase group">
              Read Our Story
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-64 sm:w-72 h-64 sm:h-72 flex items-center justify-center">
              <div className="absolute w-56 sm:w-64 h-56 sm:h-64 rounded-full border border-gold/20 animate-spin-slow" />
              <div className="absolute w-44 sm:w-48 h-44 sm:h-48 rounded-full border border-gold/10 animate-spin-slow-r" />
              <div className="w-32 sm:w-36 h-32 sm:h-36 rounded-full border-2 border-gold bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-center gap-1 z-10">
                <span className="font-display text-4xl sm:text-5xl text-gold leading-none">Q</span>
                <span className="text-[8px] sm:text-[9px] tracking-widest uppercase text-white/50 leading-tight">Pure Flavour<br />Endless Taste</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-gold via-yellow-500 to-gold py-16 sm:py-24 px-4 sm:px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 font-display text-[8rem] sm:text-[12rem] text-black/5 flex items-center justify-center pointer-events-none tracking-widest">
          PURE FLAVOUR
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl text-black uppercase leading-none mb-4">
            Bring the Flavour<br />Home Today
          </h2>
          <p className="text-black/60 font-serif italic mb-10 max-w-xl mx-auto">
            Experience the authentic taste of Qureshi's Masala in your kitchen.
          </p>
          <Link href="/shop" className="inline-block bg-black text-gold px-10 sm:px-16 py-4 sm:py-5 text-xs font-bold tracking-[0.3em] uppercase hover:bg-zinc-900 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.2)]">
            Shop Now
          </Link>
        </motion.div>
      </section>
    </>
  )
}
