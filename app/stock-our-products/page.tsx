import EnquiryPage from '@/components/site/EnquiryPage'
import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Stock Our Products', description: "Interested in stocking Qureshi's masalas? Tell us about your store or food business and speak with our team.", alternates: { canonical: '/stock-our-products' } }
export default function RetailPage() { return <EnquiryPage retail /> }
