import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Frequently Asked Questions', description: "Answers about QMS spices, pack sizes, ordering, delivery and WhatsApp checkout.", alternates: { canonical: '/faq' } }
export default function FAQLayout({ children }: { children: React.ReactNode }) { return children }
