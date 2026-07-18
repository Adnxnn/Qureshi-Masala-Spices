import Link from 'next/link'
import { SITE } from '@/lib/site-config'

const LAST_UPDATED = 'July 15, 2026'

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase mb-4">
            Terms and Conditions
          </h1>
          <p className="text-white/40 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-white/70">
          <section>
            <p className="mb-4">
              Welcome to Qureshi&apos;s Masala &amp; Spices. Please read these Terms and Conditions carefully before using our website or services.
            </p>
            <p className="text-yellow-400/80 text-sm italic mb-4">
              Please note that these Terms and Conditions are a template and should be reviewed and updated by a legal professional before public launch.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Acceptance of Terms</h2>
            <p>
              By accessing and using our website, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Products and Services</h2>
            <p className="mb-4">
              We offer a range of spice blends and masalas for purchase. While we strive to provide accurate product information, we do not warrant that product descriptions or other content is complete, accurate, or error-free.
            </p>
            <p>
              We reserve the right to modify or discontinue products at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Orders and Payment</h2>
            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Order Process</h3>
            <p className="mb-4">
              When you place an order through our website, you will be redirected to WhatsApp to complete your order. Order confirmation will be provided via WhatsApp.
            </p>

            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Pricing</h3>
            <p className="mb-4">
              Prices for our products are displayed on our website and are subject to change without notice. Prices do not include delivery charges, which will be confirmed during order processing.
            </p>

            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Order Confirmation</h3>
            <p>
              Submission of an order request via our website or WhatsApp does not guarantee acceptance of your order. We reserve the right to accept or decline any order for any reason. Your order is confirmed only when we explicitly confirm it via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Delivery</h2>
            <p className="mb-4">
              Delivery times and charges will be confirmed when we process your order via WhatsApp. We are not responsible for delays caused by third-party delivery services or factors beyond our control.
            </p>
            <p>
              You are responsible for providing an accurate and complete delivery address. We are not responsible for failed or delayed deliveries due to incorrect address information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Returns and Refunds</h2>
            <p className="mb-4">
              Please inspect your order upon delivery. If you receive a damaged or incorrect product, please contact us immediately via WhatsApp to discuss a possible return or replacement.
            </p>
            <p>
              Return and refund policies will be confirmed on a case-by-case basis via WhatsApp.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Intellectual Property</h2>
            <p>
              All content on our website, including text, images, logos, and product designs, is the property of Qureshi&apos;s Masala &amp; Spices and is protected by copyright and other intellectual property laws. You may not use our content without our explicit written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">User Conduct</h2>
            <p className="mb-4">When using our website, you agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Use our website for any unlawful purpose</li>
              <li>Violate the rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the functioning of our website</li>
              <li>Reproduce, distribute, or modify our content without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Qureshi&apos;s Masala &amp; Spices shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Qureshi&apos;s Masala &amp; Spices from any claims, damages, or expenses arising from your use of our website or violation of these Terms and Conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites (including WhatsApp) that are not controlled by us. We are not responsible for the content or practices of these third-party websites.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any time. When we make changes, we will update the &quot;Last Updated&quot; date at the top of this page. Your continued use of our website after changes are posted constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by the laws of India, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Contact Us</h2>
            <p className="mb-4">If you have any questions about these Terms and Conditions, please contact us:</p>
            <div className="space-y-2">
              <p>
                Email: <Link href={`mailto:${SITE.email}`} className="text-gold hover:underline">{SITE.email}</Link>
              </p>
              <p>
                Phone: <Link href="tel:+918904951364" className="text-gold hover:underline">+91 89049 51364</Link>
              </p>
              <p>
                Or visit our <Link href="/contact" className="text-gold hover:underline">Contact page</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
