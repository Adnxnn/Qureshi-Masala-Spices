'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'Products',
    question: 'Are your spices 100% natural?',
    answer: 'Yes! All Qureshi\'s Masala & Spices products are made with 100% natural ingredients with no artificial colors, preservatives, or additives.'
  },
  {
    category: 'Products',
    question: 'What is the shelf life of your products?',
    answer: 'Our masalas have a shelf life of 12 months from the date of manufacturing when stored in a cool, dry place.'
  },
  {
    category: 'Products',
    question: 'Do you have vegetarian options?',
    answer: 'Yes! All our products are vegetarian unless specified otherwise. We offer a wide range of vegetarian masalas for all your cooking needs.'
  },
  {
    category: 'Pack Sizes',
    question: 'What pack sizes are available?',
    answer: 'Our products are available in multiple sizes including 200g, 500g, and 1kg packs to suit different needs, from home cooking to bulk orders.'
  },
  {
    category: 'Ordering',
    question: 'How do I place an order?',
    answer: 'You can browse our products, add them to cart, and proceed to checkout. We use WhatsApp for order confirmation and processing.'
  },
  {
    category: 'WhatsApp Checkout',
    question: 'How does WhatsApp checkout work?',
    answer: 'Once you place your order on our website, you\'ll be redirected to WhatsApp with your order details prefilled. You can confirm your order and get updates directly on WhatsApp.'
  },
  {
    category: 'Delivery',
    question: 'What are your delivery charges?',
    answer: 'Delivery charges vary based on your location and order size. Our team will confirm the delivery charges when you place your order via WhatsApp.'
  },
  {
    category: 'Delivery',
    question: 'How long does delivery take?',
    answer: 'Delivery times depend on your location, but typically orders are delivered within 2-7 business days after order confirmation.'
  },
  {
    category: 'Storage',
    question: 'How should I store the spices?',
    answer: 'Store our masalas in a cool, dry place away from direct sunlight. Keep the lid tightly sealed when not in use to preserve freshness and aroma.'
  },
  {
    category: 'Retail Partnerships',
    question: 'How can I stock your products in my store?',
    answer: 'We\'d love to partner with you! Please visit our Stock Our Products page or contact us for more information about retail partnerships.'
  },
  {
    category: 'Recipes',
    question: 'Do you provide recipes with your products?',
    answer: 'Yes! We have a dedicated Recipes section on our website where you can find authentic recipes using Qureshi\'s Masala & Spices.'
  },
  {
    category: 'General Questions',
    question: 'How can I contact customer support?',
    answer: 'You can reach us via phone, WhatsApp, or email. Visit our Contact page for more details.'
  }
]

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_DATA.map(item => item.category)))]

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openId, setOpenId] = useState<number | null>(null)

  const filteredFAQs = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter(item => item.category === selectedCategory)

  return (
    <div className="royal-page royal-grain min-h-screen pb-20 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="royal-eyebrow mb-4">
            FAQ
          </div>
          <h1 className="royal-title mb-6 text-5xl sm:text-6xl md:text-7xl">
            Questions, answered.
          </h1>
          <p className="text-white/60 text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setOpenId(null)
                }}
                className={`min-h-11 rounded-[2px] border px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-colors duration-300 sm:text-xs ${
                  selectedCategory === category
                    ? 'border-gold text-gold bg-gold/10'
                    : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-4"
        >
          {filteredFAQs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openId === index}
              onToggle={() => setOpenId(openId === index ? null : index)}
            />
          ))}
        </motion.div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-20">
            <div className="text-white/30 text-lg">No FAQs found in this category</div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="royal-panel p-8 sm:p-12">
            <h2 className="royal-title mb-4 text-4xl sm:text-5xl">
              Still have questions?
            </h2>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              If you couldn&apos;t find the answer you were looking for, feel free to contact us!
            </p>
            <a
              href="/contact"
              className="royal-button px-8 py-4"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="royal-panel overflow-hidden rounded-[3px] transition-colors duration-300 hover:border-gold/25"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 sm:px-8 py-6 text-left flex items-center justify-between gap-4"
      >
        <span className="font-medium text-white flex-1">{faq.question}</span>
        <span className="text-gold">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 sm:px-8 pb-6 text-white/60 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
