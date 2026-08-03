'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChefHat, Heart, Leaf, Shield, Sparkles } from 'lucide-react'

export default function OurStoryPage() {
  return (
    <div className="royal-page royal-grain min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/Authentic.jpeg"
            alt="Our Story Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center"
          >
            <div className="royal-eyebrow mb-6">
              Our Story
            </div>
            <h1 className="royal-title mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
              More than masala.<br />
              <span className="text-gradient-gold">A tradition shared.</span>
            </h1>
            <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-serif italic">
              Crafted with love, passed down through generations
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="aspect-[12/9] w-full">
                  <video
                    src="/images/Qureshi_s_Masala_Spices_Ou.mp4"
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls={false}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
                Who We Are
              </div>
              <h2 className="royal-title mb-6 text-4xl sm:text-5xl md:text-6xl">
                The story behind every blend.
              </h2>
              <p className="text-white/60 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                At Qureshi&apos;s Masala &amp; Spices, every blend is more than just a mix of spices—it&apos;s a celebration of tradition, family, and the rich culinary heritage that has been passed down through generations.
              </p>
              <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed mb-4">
                Our journey began with a simple belief: that great food deserves great spices, crafted with care, authenticity, and an unwavering commitment to quality.
              </p>
              <p className="text-white/50 text-sm sm:text-base md:text-lg leading-relaxed">
                Inspired by the kitchens of our ancestors and the vibrant flavors of traditional Indian cuisine, we set out to create masalas that bring the authentic taste of home to every meal.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-gold/10 bg-oxblood-deep/10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
              Our Values
            </div>
            <h2 className="royal-title text-4xl sm:text-5xl md:text-6xl">
              What drives us.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: <Sparkles className="text-gold" />,
                title: 'Authenticity',
                description: 'Traditional recipes passed down through generations'
              },
              {
                icon: <Leaf className="text-gold" />,
                title: 'Natural',
                description: 'Pure spices with no artificial additives or preservatives'
              },
              {
                icon: <Heart className="text-gold" />,
                title: 'Crafted with Love',
                description: 'Small-batch blending for unmatched quality and consistency'
              },
              {
                icon: <Shield className="text-gold" />,
                title: 'Quality',
                description: 'Rigorous quality checks to ensure only the finest spices'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="royal-panel rounded-[3px] p-6 text-center transition-colors duration-300 hover:border-gold/30 sm:p-8"
              >
                <div className="w-16 h-16 mx-auto mb-5 bg-black/50 border border-white/10 rounded-full flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="mb-3 font-display text-2xl text-cream sm:text-3xl">{item.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
              Our Process
            </div>
            <h2 className="royal-title text-4xl sm:text-5xl md:text-6xl">
              From farm to kitchen.
            </h2>
          </motion.div>
          <div className="space-y-8 sm:space-y-12">
            {[
              {
                step: '01',
                title: 'Sourcing',
                description: 'We partner with trusted farmers and suppliers to source only the freshest, highest quality spices from the best growing regions.'
              },
              {
                step: '02',
                title: 'Cleaning',
                description: 'Each spice is carefully cleaned, sorted, and inspected to ensure only the finest ingredients make it into our blends.'
              },
              {
                step: '03',
                title: 'Blending',
                description: 'Using traditional recipes and techniques, we blend our spices in small batches to maintain consistency and preserve authentic flavors.'
              },
              {
                step: '04',
                title: 'Packaging',
                description: 'Our blends are carefully packaged to lock in freshness and aroma, ensuring they reach your kitchen in perfect condition.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gold flex items-center justify-center bg-black/40">
                    <span className="font-display text-2xl sm:text-3xl text-gold">{item.step}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="mb-3 font-display text-3xl text-cream sm:text-4xl">{item.title}</h3>
                  <p className="text-white/50 text-sm sm:text-base leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-gold/20 bg-[linear-gradient(125deg,#290a0b,#5b1718_52%,#24100f)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center text-cream">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="royal-title mb-6 text-4xl sm:text-5xl md:text-6xl">
              Experience our tradition.
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-base text-cream/65 sm:text-lg md:text-xl">
              Bring the authentic taste of Qureshi&apos;s Masala &amp; Spices to your kitchen today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center">
              <Link href="/shop" className="royal-button px-8 py-4 sm:px-10 sm:py-5">
                Shop Now
              </Link>
              <Link href="/our-heritage" className="royal-button-secondary px-8 py-4 sm:px-10 sm:py-5">
                Our Heritage
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
