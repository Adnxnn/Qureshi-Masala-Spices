import EnquiryPage from '@/components/site/EnquiryPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Contact Us', description: "Questions about Qureshi's products, orders or delivery? Contact our team by WhatsApp, email or phone.", alternates: { canonical: '/contact' } }
export default function ContactPage() { return <EnquiryPage /> }
