'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover bg-black"
      >
        <source src="/images/Background01.MP4" type="video/mp4" />
      </video>
      
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/60" />

      {/* Content */}
      <div className="relative z-20 text-center max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-block mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-3 px-8 py-3 rounded-full border border-gold/30 bg-black/40 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[9px] sm:text-[10px] tracking-[0.5em] uppercase text-gold font-semibold">
              Pure Flavour · Endless Taste
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 sm:mb-10"
        >
          <Image
            src="/images/Qureshi's Nav.png"
            alt="Qureshi's Masala"
            width={450}
            height={120}
            className="mx-auto object-contain max-w-[260px] sm:max-w-[450px]"
            priority
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-display text-gold text-2xl sm:text-4xl md:text-6xl uppercase tracking-[0.2em] mb-4 sm:mb-6"
        >
          Masala & Spices
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-serif italic text-white/65 text-sm sm:text-lg md:text-xl mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed"
        >
          Crafted in Coorg with a passion for authentic spices and shipped all over India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12 sm:mb-16"
        >
          <Link
            href="/shop"
            className="bg-gold text-black px-10 sm:px-14 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase rounded-sm hover:bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,197,24,0.3)]"
          >
            Explore Products
          </Link>

          <Link
            href="/#heritage"
            className="px-10 sm:px-14 py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.3em] uppercase border-2 border-gold/40 text-gold hover:bg-gold hover:text-black transition-all duration-300 rounded-sm"
          >
            Our Story
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-3 gap-6 sm:gap-10 max-w-3xl mx-auto"
        >
          {[
            { num: '100%', label: 'Natural' },
            { num: 'Zero', label: 'Preservatives' },
            { num: '15+', label: 'Years' }
          ].map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-4xl sm:text-5xl text-gold mb-1">{stat.num}</div>
              <div className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-white/40">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      >
        <div className="w-px h-14 sm:h-20 bg-gradient-to-b from-gold via-gold/40 to-transparent" />
      </motion.div>
    </section>
  )
}
