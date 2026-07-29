'use client'
import { motion } from 'framer-motion'
import Slideshow from '@/components/site/Slideshow'
import { Award, Calendar, ChevronRight, FlaskConical, HeartHandshake, Leaf, ArrowRight, type LucideIcon } from 'lucide-react'
import KodaguPageHero from '@/components/site/KodaguPageHero'

const TIMELINE_ITEMS = [
  {
    year: '1998',
    title: 'The Beginning',
    description: 'Our journey started in a small kitchen in Kodagu, where we perfected our first masala blend using traditional recipes passed down through generations.'
  },
  {
    year: '2005',
    title: 'First Shop',
    description: 'We opened our first retail store, introducing our authentic blends to the local community.'
  },
  {
    year: '2012',
    title: 'Expanding Reach',
    description: 'Started shipping across India, bringing our flavors to kitchens nationwide.'
  },
  {
    year: '2020',
    title: 'Digital Presence',
    description: 'Launched our online store, making it easier for customers to get our products delivered to their doorstep.'
  },
  {
    year: '2026',
    title: 'Today',
    description: 'Continuing our legacy of delivering pure, authentic spices, while preserving the traditional methods that make us special.'
  }
]

const VALUES: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: Leaf, title: '100% Natural', description: 'No artificial colors, no preservatives, just pure spices sourced directly from farms.' },
  { icon: FlaskConical, title: 'Small Batch', description: 'Crafted in small quantities for consistency and quality, every blend is made with care.' },
  { icon: Award, title: 'Premium Grade', description: 'Handpicked ingredients sourced for freshness and aroma, ensuring the best flavor in every dish.' },
  { icon: HeartHandshake, title: 'Family Owned', description: 'A family business with values rooted in tradition and a passion for great food.' }
]

export default function OurHeritagePage() {
  return (
    <div className="qms-editorial-page qms-heritage-page royal-grain">
      {/* HERO */}
      <KodaguPageHero
        eyebrow="Our heritage"
        index="04"
        title={<>Kodagu in <strong>every batch.</strong></>}
        description="A family legacy shaped by traditional recipes, careful sourcing and the aroma of spices ground fresh—not mass-produced into sameness."
        meta={['Kodagu rooted', 'Traditional methods', 'Made for Indian kitchens']}
        image="/images/QMS.jpeg"
        imageAlt="Whole and ground Indian spices arranged on a dark textured surface"
        imageLabel="Heritage Ledger / Kodagu"
      >
        <a href="#story" className="royal-button px-7 py-4">
          Read Our Story <ChevronRight size={18} />
        </a>
      </KodaguPageHero>

      {/* STORY */}
      <section id="story" className="qms-heritage-story py-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Slideshow interval={5000} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
                Our Journey
              </div>
              <h2 className="royal-title mb-8 text-5xl md:text-6xl">
                Where it all <span className="text-gold">started.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                At Qureshi's Masala & Spices, every blend tells a story. Our journey began with a simple belief: authentic food deserves authentic spices.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                Inspired by generations of traditional recipes and time-honored spice blending techniques, we set out to create masalas that capture the true essence of home-cooked flavor.
              </p>
              <p className="text-white/60 leading-relaxed">
                What started as a passion for preserving rich culinary traditions has grown into a commitment to delivering premium-quality spice blends to kitchens everywhere.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h2 className="royal-title mb-8 text-5xl md:text-6xl">
                Our <span className="text-gold">mission.</span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-6">
                We believe that great food is more than a meal—it's a memory, a celebration, and a connection between generations.
              </p>
              <p className="text-white/60 leading-relaxed mb-6">
                That's why every Qureshi's blend is made in small batches, ensuring consistency, quality, and the authentic taste that families trust.
              </p>
              <p className="text-white/60 leading-relaxed">
                From fiery Fish Fry Masala and aromatic Biryani Masala to rich Korma and Garam Masala blends, our products are designed to bring restaurant-quality flavors into every home.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 md:order-2"
            >
              <Slideshow
                slides={[
                  '/images/Ourheritage1.jpg',
                  '/images/Ourheritage3.jpg',
                  '/images/Ourheritage5.jpg',
                  '/images/Ourheritage7.jpg',
                  '/images/Ourheritage9.jpg'
                ]}
                interval={5000}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="qms-heritage-timeline border-y border-gold/10 bg-oxblood-deep/10 px-8 py-24">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="text-[11px] tracking-[0.4em] uppercase text-gold mb-4">
              Our History
            </div>
            <h2 className="royal-title text-5xl md:text-7xl">
              The <span className="text-gold">timeline.</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold to-gold/50 hidden md:block" />

            <div className="space-y-16">
              {TIMELINE_ITEMS.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className="md:w-1/2 text-center md:text-right md:pr-12">
                    <span className="font-display text-4xl text-gold mb-4 block">
                      {item.year}
                    </span>
                    <h3 className="font-display text-2xl uppercase mb-3">
                      {item.title}
                    </h3>
                    <p className="text-white/60">{item.description}</p>
                  </div>

                  {/* Center Dot */}
                  <div className="relative z-10 hidden md:flex">
                    <div className="w-16 h-16 rounded-full bg-black border-4 border-gold flex items-center justify-center">
                      <Calendar size={24} className="text-gold" />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="md:w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="qms-heritage-quote py-24 px-8 bg-gradient-to-b from-dark to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 font-display text-[20vw] text-gold flex items-center justify-center pointer-events-none">
            SPICE
          </div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-6xl mb-8 text-gold">"</div>
            <p className="text-3xl md:text-5xl font-serif italic text-white mb-12 leading-relaxed">
              Because every great dish starts with the perfect blend.
            </p>
            <div className="text-lg text-white/40 tracking-widest uppercase">
              Qureshi's Masala & Spices
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="qms-heritage-values py-24 px-8">
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
            <h2 className="royal-title text-5xl md:text-7xl">
              What makes us <span className="text-gold">different.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => {
              const ValueIcon = value.icon
              return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="royal-panel rounded-[3px] p-8 text-center transition-colors hover:border-gold/30"
              >
                <ValueIcon aria-hidden="true" className="mx-auto mb-6 size-9 text-gold" strokeWidth={1.35} />
                <h3 className="mb-4 font-display text-3xl text-cream">{value.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="qms-heritage-cta border-y border-gold/20 bg-[linear-gradient(125deg,#290a0b,#5b1718_52%,#24100f)] px-8 py-24">
        <div className="mx-auto max-w-4xl text-center text-cream">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="royal-title mb-6 text-5xl md:text-7xl">
              Taste the tradition.
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-cream/65">
              Experience the authentic flavors of Qureshi's Masala & Spices in your kitchen today.
            </p>
            <a
              href="/shop"
              className="royal-button px-10 py-5"
            >
              Shop Now <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
