import Link from 'next/link'
import Image from 'next/image'
import { getProducts } from '@/lib/actions'
import HeroSection from '@/components/site/HeroSection'
import Slideshow from '@/components/site/Slideshow'
import InfiniteProductCarousel from '@/components/site/InfiniteProductCarousel'
import CinematicShopCTA from '@/components/site/CinematicShopCTA'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

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

export default async function HomePage() {
  const products = await getProducts()

  return (
    <>
      <HeroSection />

      {/* STATS BAR */}
      <div className="overflow-hidden border-y border-gold-light/35 bg-gold py-2">
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
      <div className="overflow-hidden border-b border-gold/15 bg-charcoal py-2.5 sm:py-3">
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
      <section id="products" className="royal-page overflow-hidden px-4 py-16 sm:px-8 sm:py-28">
        <div className="max-w-6xl mx-auto mb-8 sm:mb-14 text-center">
          <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Masalas</div>
          <h2 className="royal-title text-4xl sm:text-6xl lg:text-7xl">
            Pure flavour.<br /><span className="text-gradient-gold">Endless taste.</span>
          </h2>
          <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0 mx-auto mt-3 sm:mt-6"></div>
        </div>

        {/* INFINITE SCROLLING CAROUSEL - with auto & manual scroll */}
        <InfiniteProductCarousel products={products} />

        {/* EXPLORE BUTTON */}
        <div className="text-center mt-12 sm:mt-24">
          <Link
            href="/shop"
            className="royal-button group"
          >
            Explore Our Collections
            <svg className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* WHY QURESHI'S SECTION */}
      <section className="relative overflow-hidden border-y border-gold/15 bg-charcoal px-4 py-16 sm:px-8 sm:py-28">
        <div className="pointer-events-none absolute inset-y-0 left-[7%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-[7%] w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent" aria-hidden="true" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16 md:mb-20">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">The Qureshi Difference</div>
            <h2 className="royal-title text-4xl sm:text-6xl lg:text-7xl">
              Crafted with<br /><span className="text-gradient-gold">a point of view.</span>
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
                <div className="relative h-full overflow-hidden rounded-[3px] border border-gold/15 bg-gradient-to-b from-dark to-black transition-[border-color,transform] duration-300 group-hover:-translate-y-1 group-hover:border-gold/40">
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
                    <div className="absolute bottom-0 left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 sm:p-8">
                    <div className="text-gold text-2xl sm:text-3xl font-display font-bold mb-2">{item.stat}</div>
                    <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">{item.title}</h3>
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
                    <div className="relative h-full overflow-hidden rounded-[3px] border border-gold/15 bg-gradient-to-b from-dark to-black">
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
                        <h3 className="mb-2 font-display text-lg font-semibold text-white">{item.title}</h3>
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
      <section id="heritage" className="royal-page relative overflow-hidden px-4 py-16 sm:px-8 sm:py-28">

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Story</div>
            <h2 className="royal-title text-4xl sm:text-6xl lg:text-7xl">
              A legacy of <span className="text-gradient-gold">flavour,</span><br />
              held with care.
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>

          {/* First carousel and paragraph */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 items-center mb-12 sm:mb-24">
            <div className="order-1">
              <Slideshow />
            </div>
            <div className="order-2">
              <div className="mb-4 inline-block border-b border-gold/30 pb-2 sm:mb-6">
                <span className="royal-eyebrow">Our Roots</span>
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
              <div className="mb-4 inline-block border-b border-gold/30 pb-2 sm:mb-6">
                <span className="royal-eyebrow">Our Journey</span>
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
              <div className="absolute inset-0 border-y border-gold/20 bg-gold/[0.035]"></div>
              <div className="relative z-10 px-4 sm:px-8">
                <p className="text-base font-serif italic text-gold/90 md:text-2xl">
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
      <section className="relative overflow-hidden border-y border-gold/15 bg-[#0b0806] px-4 py-16 sm:px-8 sm:py-28">

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-10 sm:mb-16">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Our Factory</div>
            <h2 className="royal-title text-4xl sm:text-6xl lg:text-7xl">
              Behind the scenes<br /><span className="text-gradient-gold">at Qureshi&apos;s.</span>
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>

          <div className="grid items-center gap-6 md:gap-12 lg:grid-cols-2">
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
                className="royal-button group"
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
      <section className="relative overflow-hidden bg-charcoal py-16 sm:py-28">

        <div className="max-w-6xl mx-auto px-4 sm:px-8 mb-10 sm:mb-16 relative z-10">
          <div className="text-center">
            <div className="text-[9px] sm:text-[11px] tracking-[0.35em] sm:tracking-[0.4em] uppercase text-gold mb-2 sm:mb-4">Reviews</div>
            <h2 className="royal-title text-4xl sm:text-6xl lg:text-7xl">
              What our customers<br /><span className="text-gradient-gold">are saying.</span>
            </h2>
            <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-4 sm:mt-8"></div>
          </div>
        </div>
        
        <div className="overflow-hidden relative z-10">
          <div className="flex animate-scroll gap-3 md:gap-6">
            {/* Two copies for perfect seamless infinite loop with translateX(-50%) */}
            {[...reviews, ...reviews].map((review, idx) => (
              <div key={`review-${idx}`} className="flex w-[220px] flex-shrink-0 flex-col justify-between rounded-[3px] border border-gold/15 bg-gradient-to-b from-dark to-black p-4 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-gold/35 sm:w-[300px] sm:p-6 md:w-[340px] md:p-7 lg:w-[370px]">
                <div>
                  <div className="flex items-center gap-0.5 mb-3 sm:mb-5">
                    {[...Array(review.rating)].map((_, i) => (
                      <span key={i} className="text-gold text-sm sm:text-lg">★</span>
                    ))}
                  </div>
                  <p className="mb-4 text-xs italic leading-relaxed text-white/80 sm:mb-6 sm:text-base">
                    "{review.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/20 bg-gradient-to-br from-gold/30 to-gold/10 font-display text-sm text-gold sm:text-lg md:h-12 md:w-12">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white sm:text-base">{review.name}</div>
                    <div className="text-white/50 text-[10px] sm:text-xs">{review.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CinematicShopCTA products={products.slice(0, 3)} />
    </>
  )
}
