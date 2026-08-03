import Link from 'next/link'
import { SITE } from '@/lib/site-config'

const LAST_UPDATED = 'July 15, 2026'

export default function PrivacyPolicyPage() {
  return (
    <div className="royal-page royal-grain min-h-screen pb-20 pt-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="royal-eyebrow mb-3">Legal</p>
          <h1 className="royal-title mb-4 text-5xl sm:text-6xl md:text-7xl">
            Privacy policy.
          </h1>
          <p className="text-white/40 text-sm">Last Updated: {LAST_UPDATED}</p>
        </div>

        <div className="royal-prose space-y-8">
          <section>
            <p className="mb-4">
              This Privacy Policy describes how Qureshi&apos;s Masala &amp; Spices (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your information when you visit our website and use our services.
            </p>
            <p className="mb-4 text-sm italic text-gold/70">
              Please note that this Privacy Policy is a template and should be reviewed and updated by a legal professional before public launch.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Information We Collect</h2>
            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Personal Information</h3>
            <p className="mb-4">
              We may collect personal information that you provide to us, such as:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>Delivery address</li>
              <li>Order notes and messages</li>
            </ul>

            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Automatically Collected Information</h3>
            <p className="mb-4">
              When you visit our website, we may automatically collect certain information about your device, including your IP address, browser type, operating system, and browsing behavior.
            </p>

            <h3 className="font-display text-lg sm:text-xl uppercase mb-2 text-gold">Cart Information</h3>
            <p>
              We use local storage on your device to save your cart information so that your items are preserved when you refresh the page or return to our website later.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">How We Use Your Information</h2>
            <p className="mb-4">We may use the information we collect for purposes including:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your order</li>
              <li>To respond to your questions and inquiries</li>
              <li>To improve our website and services</li>
              <li>To send you updates about our products and offers (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">WhatsApp Communication</h2>
            <p>
              We use WhatsApp for order processing and customer communication. When you place an order, your order details and contact information will be shared via WhatsApp for order confirmation and fulfillment.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Data Sharing</h2>
            <p className="mb-4">
              We do not sell or rent your personal information to third parties. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Service providers who assist with order fulfillment and delivery</li>
              <li>Law enforcement or government authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Data Security</h2>
            <p>
              We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your information</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Cookies</h2>
            <p>
              Our website may use cookies and similar tracking technologies to enhance your browsing experience. You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services (including WhatsApp) that are not controlled by us. We are not responsible for the privacy practices of these third-party services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children. We do not knowingly collect personal information from children under the age of 13.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we make changes, we will update the &quot;Last Updated&quot; date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl sm:text-3xl uppercase mb-4 text-white">Contact Us</h2>
            <p className="mb-4">If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="space-y-2">
              <p>
                Email: <Link href={`mailto:${SITE.email}`} className="text-gold hover:underline">{SITE.email}</Link>
              </p>
              <p>
                Phone: <Link href="tel:+918762117816" className="text-gold hover:underline">+91 87621 17816</Link>
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
