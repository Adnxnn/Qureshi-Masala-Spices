'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { getProducts } from '@/lib/actions'
import HeroSection from '@/components/site/HeroSection'
import Slideshow from '@/components/site/Slideshow'
import InfiniteProductCarousel from '@/components/site/InfiniteProductCarousel'
import type { Product } from '@/types'

// Customer reviews data - 20 unique reviews from all over India!
const reviews = [
  { 
    name: 'Rahul Mehta', 
    location: 'Madikeri', 
    rating: 5,
    comment: 'Qureshi\'s Masala is a game changer! Best chicken masala I have ever used, authentic Coorgi taste!'
  },
  { 
    name: 'Priya Sharma', 
    location: 'Suntikoppa', 
    rating: 5,
    comment: 'Finally, no preservatives! Pure, fresh spices that make every dish special!'
  },
  { 
    name: 'Arjun Patel', 
    location: 'Kushalnagar', 
    rating: 5,
    comment: 'Qureshi\'s Fish Curry Masala is absolutely incredible! 10/10 would recommend!'
  },
  { 
    name: 'Anita Desai', 
    location: 'Mysore', 
    rating: 5,
    comment: 'The aroma is unmatched! Fresh, premium quality spices!'
  },
  { 
    name: 'Vikram Singh', 
    location: 'Murnad', 
    rating: 5,
    comment: 'Qureshi\'s Biryani Masala is perfection! Every biryani becomes a masterpiece!'
  },
  { 
    name: 'Neha Kapoor', 
    location: 'Virajpet', 
    rating: 5,
    comment: 'Qureshi\'s Garam Masala adds perfect warmth! Our new favorite brand!'
  },
  { 
    name: 'Rajesh Kumar', 
    location: 'Bombay', 
    rating: 5,
    comment: 'From Coorg to Bombay, Qureshi\'s spices bring authentic taste home!'
  },
  { 
    name: 'Ayesha Begum', 
    location: 'Hyderabad', 
    rating: 5,
    comment: 'Hyderabadi biryani just got better with Qureshi\'s masalas!'
  },
  { 
    name: 'Suresh Nair', 
    location: 'Chennai', 
    rating: 5,
    comment: 'Qureshi\'s Masala makes South Indian dishes taste like home!'
  },
  { 
    name: 'Manoj Tiwari', 
    location: 'Patna', 
    rating: 5,
    comment: 'Best spices in Bihar! Qureshi\'s is now our go-to brand!'
  },
  { 
    name: 'Anjali Menon', 
    location: 'Kerala', 
    rating: 5,
    comment: 'Qureshi\'s fish masala complements Kerala cuisine perfectly!'
  },
  { 
    name: 'Prakash Shetty', 
    location: 'Mangalore', 
    rating: 5,
    comment: 'Mangalorean dishes never tasted better with Qureshi\'s spices!'
  },
  { 
    name: 'Divya Rao', 
    location: 'Bangalore', 
    rating: 5,
    comment: 'Living in Bangalore, Qureshi\'s spices remind me of Coorg!'
  },
  { 
    name: 'Mohammed Iqbal', 
    location: 'Delhi', 
    rating: 5,
    comment: 'North Indian dishes get an upgrade with Qureshi\'s amazing spices!'
  },
  { 
    name: 'Sunita Joshi', 
    location: 'Pune', 
    rating: 5,
    comment: 'My whole family loves Qureshi\'s Masala, pure taste and quality!'
  },
  { 
    name: 'Ganesh Hegde', 
    location: 'Goa', 
    rating: 5,
    comment: 'Goan fish curry with Qureshi\'s masala is absolutely divine!'
  },
  { 
    name: 'Harleen Kaur', 
    location: 'Chandigarh', 
    rating: 5,
    comment: 'From Punjab with love, Qureshi\'s masala makes every dish special!'
  },
  { 
    name: 'Ritesh Deshmukh', 
    location: 'Nagpur', 
    rating: 5,
    comment: 'Qureshi\'s is the best masala brand I have tried in Nagpur!'
  },
  { 
    name: 'Sneha Reddy', 
    location: 'Visakhapatnam', 
    rating: 5,
    comment: 'Andhra cuisine tastes incredible with Qureshi\'s spices!'
  },
  { 
    name: 'Deepak Sinha', 
    location: 'Jaipur', 
    rating: 5,
    comment: 'Rajasthani dishes never tasted more authentic with Qureshi\'s!'
  },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  return (
    <>
      <HeroSection />

      {/* STATS BAR */}
      <div className="bg-gold py-1 sm:py-2 mt-2 sm:mt-4 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[...Array(2)].map((_, di) =>
            [
              { num: '100%', label: 'Natural' },
              { num: '0', label: 'Preservatives' },
              { num: '12+', label: 'Signature Blends' },
              { num: 'Small Batch', label: 'Crafted Fresh' },
              { num: '★ 4.9', label: 'Customer Rating' },
            ].map((s, i) => (
              <div key={`${di}-${s.label}`} className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8">
                <div className="font-display text-lg sm:text-xl md:text-2xl text-black leading-none">{s.num}</div>
                <div className="text-[7px] sm:text-[9px] md:text-[10px] tracking-[0.15em] sm:tracking-[0.2em] uppercase text-black/60">{s.label}</div>
                <span className="text-black/20 text-sm sm:text-lg">·</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MARQUEE */}
      <div className="bg-charcoal overflow-hidden py-2 sm:py-3 border-y border-gold/10">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, di) =>
            ['Kebab Masala','Fish Fry Masala','Fish Curry Masala','Biryani Masala','Chicken Masala','Garam Masala'].map(item => (
              <span key={`${di}-${item}`} className="font-display text-base sm:text-xl tracking-widest uppercase text-white/30 px-4 sm:px-8">
                {item} <span className="text-gold/40">·</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* PRODUCTS CAROUSEL SECTION */}
      <section id="products" className="bg-black py-12 sm:py-24 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto mb-8 sm:mb-14 text-center">
          <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Masalas</div>
          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-none mb-2 sm:mb-4">
            Pure Flavour,<br /><span className="text-gradient-gold">Endless Taste</span>
          </h2>
          <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0 mx-auto mt-3 sm:mt-6"></div>
        </div>

        {/* INFINITE SCROLLING CAROUSEL - with auto & manual scroll */}
        {!loading && <InfiniteProductCarousel products={products} />}

        {/* EXPLORE BUTTON */}
        <div className="text-center mt-12 sm:mt-24">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gold text-black px-6 sm:px-8 py-2 sm:py-3 text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(245,197,24,0.4)]"
          >
            Explore Our Collections
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* WHY QURESHI'S SECTION */}
      <section className="bg-charcoal px-4 sm:px-8 py-12 sm:py-24 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gold/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16 md:mb-20">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">The Qureshi Difference</div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-3 sm:mb-6 text-white">
              Crafted<br /><span className="text-gradient-gold">Different</span>
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mb-3 sm:mb-6"></div>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-lg">
              Every blend is a testament to our commitment to quality and authenticity
            </p>
          </div>
          
          {/* Desktop View - Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { 
                image: '/images/herbs.png', 
                title: '100% Natural', 
                stat: 'No Preservatives',
                description: 'Pure, unadulterated spices without any additives'
              },
              { 
                image: '/images/freshly grounded.png', 
                title: 'Freshly Ground', 
                stat: 'Small Batches',
                description: 'Blended in small batches for maximum freshness'
              },
              { 
                image: '/images/handpicked.png', 
                title: 'Premium Quality', 
                stat: 'Hand-Picked',
                description: 'Sourcing only the finest ingredients available'
              },
              { 
                image: '/images/heritage crafted.jpeg', 
                title: 'Heritage Crafted', 
                stat: '15+ Years',
                description: 'Generations of traditional blending expertise'
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark to-black border border-white/5 group-hover:border-gold/20 transition-all duration-500 h-full">
                  {/* Image container */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    
                    {/* Gold accent line */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="text-gold text-2xl sm:text-3xl font-display font-bold mb-2">{item.stat}</div>
                    <h3 className="font-display text-xl sm:text-2xl uppercase text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile View - Infinite Carousel */}
          <div className="sm:hidden overflow-hidden">
            <div className="flex gap-4 animate-scroll">
              {[...Array(2)].map((_, loopIndex) => 
                [
                  { 
                    image: '/images/herbs.png', 
                    title: '100% Natural', 
                    stat: 'No Preservatives',
                    description: 'Pure, unadulterated spices without any additives'
                  },
                  { 
                    image: '/images/freshly grounded.png', 
                    title: 'Freshly Ground', 
                    stat: 'Small Batches',
                    description: 'Blended in small batches for maximum freshness'
                  },
                  { 
                    image: '/images/handpicked.png', 
                    title: 'Premium Quality', 
                    stat: 'Hand-Picked',
                    description: 'Sourcing only the finest ingredients available'
                  },
                  { 
                    image: '/images/heritage crafted.jpeg', 
                    title: 'Heritage Crafted', 
                    stat: '15+ Years',
                    description: 'Generations of traditional blending expertise'
                  }
                ].map((item, index) => (
                  <div key={`${loopIndex}-${index}`} className="w-[160px] group flex-shrink-0">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark to-black border border-white/10 h-full">
                      {/* Image container */}
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        
                        {/* Gold accent line */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3">
                        <div className="text-gold text-sm font-display font-bold mb-1">{item.stat}</div>
                        <h3 className="font-display text-sm uppercase text-white mb-2">{item.title}</h3>
                        <p className="text-white/50 text-[10px] leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* OUR HERITAGE SECTION */}
      <section id="heritage" className="bg-black px-4 sm:px-8 py-12 sm:py-24 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute top-1/4 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Story</div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-white">
              A Legacy of <span className="text-gradient-gold">Flavour</span>,<br />
              Crafted with Passion
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>

          {/* First carousel and paragraph */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center mb-12 sm:mb-24">
            <div className="order-1">
              <Slideshow />
            </div>
            <div className="order-2">
              <div className="inline-block bg-gold/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <span className="text-gold text-xs sm:text-sm font-semibold tracking-wide">Our Roots</span>
              </div>
              <p className="text-sm md:text-lg text-white/80 leading-relaxed mb-4 sm:mb-6 font-serif">
                At Qureshi's Masala & Spices, every blend tells a story.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4 sm:mb-6">
                Our journey began with a simple belief: authentic food deserves authentic spices. Inspired by generations of traditional recipes and time-honored spice blending techniques, we set out to create masalas that capture the true essence of home-cooked flavour.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                What started as a passion for preserving rich culinary traditions has grown into a commitment to delivering premium-quality spice blends to kitchens everywhere.
              </p>
            </div>
          </div>

          {/* Second carousel and paragraph */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center mb-12 sm:mb-24">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-gold/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <span className="text-gold text-xs sm:text-sm font-semibold tracking-wide">Our Journey</span>
              </div>
              <p className="text-sm md:text-lg text-white/80 leading-relaxed mb-4 sm:mb-6 font-serif">
                From Humble Beginnings to Trusted Brand.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4 sm:mb-6">
                What began in a small kitchen with a few carefully selected spices has evolved into a beloved brand known for quality and consistency. Our spice masters continue to hand-select the finest ingredients, ensuring every batch meets our exacting standards.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                We source our spices directly from trusted farms across India, bringing you the authentic taste and aroma of traditional Indian cuisine, right to your table.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <Slideshow slides={[
                '/images/Ourheritage5.jpg',
                '/images/Ourheritage6.jpg',
                '/images/Ourheritage7.jpg',
                '/images/Ourheritage8.jpg',
                '/images/Ourheritage9.jpg'
              ]} />
            </div>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <div className="relative py-6 sm:py-12">
              <div className="absolute inset-0 bg-gold/5 rounded-2xl"></div>
              <div className="relative z-10 px-4 sm:px-8">
                <p className="text-base md:text-xl md:text-2xl text-gold/90 font-serif italic">
                  "Because every great dish starts with the perfect blend."
                </p>
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Today, Qureshi's Masala & Spices proudly continues its mission of delivering Pure Flavour, Endless Taste while honoring the traditions that inspired us from the very beginning.
            </p>
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENES */}
      <section className="bg-black py-12 sm:py-24 px-4 sm:px-8 overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute top-1/3 left-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Factory</div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-tight text-white">
              Behind the Scenes<br /><span className="text-gradient-gold">at Qureshi's</span>
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-10 md:gap-12 items-center">
            <Slideshow 
              slides={[
                '/images/Stock2.MP4',
                '/images/Stock3.MP4',
                '/images/Stock4.MP4'
              ]}
              aspectRatio="aspect-[4/3]"
              className="shadow-2xl"
            />
            <div>
              <p className="text-sm md:text-lg text-white/80 leading-relaxed mb-4 sm:mb-6 font-serif">
                Watch how we craft every batch of Qureshi's Masala.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-4 sm:mb-6">
                From sourcing the finest raw spices to carefully blending and packaging each product, our factory ensures that every gram of masala meets our uncompromising quality standards.
              </p>
              <p className="text-white/60 text-sm leading-relaxed mb-6 sm:mb-8">
                We take pride in our clean, hygienic facilities and the skilled hands that bring our signature blends to life.
              </p>
              <Link
                href="/stock-our-products"
                className="inline-flex items-center gap-2 sm:gap-3 bg-gold text-black px-6 sm:px-8 py-2 sm:py-3 text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(245,197,24,0.4)]"
              >
                Stock Our Products
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="bg-charcoal py-12 sm:py-24 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-5 sm:top-10 left-5 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 sm:bottom-10 right-5 sm:right-10 w-40 sm:w-80 h-40 sm:h-80 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-10 sm:mb-16 relative z-10">
          <div className="text-center">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Reviews</div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase leading-none mb-2 sm:mb-4 text-white">
              What Our Customers<br /><span className="text-gradient-gold">Are Saying</span>
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>
        </div>
        
        <div className="overflow-hidden relative z-10">
          <div className="flex gap-3 md:gap-5 md:gap-6 animate-scroll">
            {/* Two copies for perfect seamless infinite loop with translateX(-50%) */}
            {[...reviews, ...reviews].map((review, idx) => (
              <div key={`review-${idx}`} className="w-[200px] sm:w-[260px] sm:w-[300px] md:w-[340px] lg:w-[370px] bg-gradient-to-br from-black to-dark border border-white/5 p-3 sm:p-5 sm:p-6 md:p-7 rounded-2xl flex-shrink-0 flex flex-col justify-between hover:border-gold/20 transition-all duration-500 hover:shadow-[0_0_50px_rgba(245,197,24,0.1)]">
                <div>
                  <div className="flex items-center gap-0.5 mb-3 sm:mb-5">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-gold text-sm sm:text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-white/80 text-xs sm:text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-7 h-7 md:w-10 md:h-10 md:w-12 md:h-12 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full flex items-center justify-center font-display text-gold text-sm sm:text-lg border border-gold/20">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-xs sm:text-sm sm:text-base">{review.name}</div>
                    <div className="text-white/50 text-[10px] sm:text-xs">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold py-16 sm:py-32 px-4 sm:px-8 text-center relative overflow-hidden">
        {/* Faded background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-display text-[80px] sm:text-[150px] sm:text-[200px] md:text-[300px] text-black/5 uppercase tracking-[0.15em] sm:tracking-[0.2em] select-none">
            SPICE
          </span>
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-4xl md:text-6xl lg:text-8xl text-black uppercase leading-tight mb-6 sm:mb-10">
            Bring the flavour<br />home today
          </h2>
          <Link href="/shop" className="inline-flex items-center gap-2 sm:gap-3 bg-black text-gold px-6 sm:px-10 py-2.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase transition-all duration-500 hover:bg-charcoal hover:shadow-[0_0_50px_rgba(0,0,0,0.4)]">
            Shop the Full Range
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
