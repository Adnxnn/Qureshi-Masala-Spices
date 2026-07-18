import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: "Qureshi's Masala & Spices — Pure Flavour. Endless Taste.",
  description: 'Small-batch masalas crafted in Bangalore. 100% natural, zero preservatives, bold flavours.',
  keywords: ['masala', 'spices', 'biryani masala', 'kebab masala', 'fish fry masala', 'Bangalore'],
  openGraph: {
    title: "Qureshi's Masala & Spices",
    description: 'Pure Flavour. Endless Taste.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#141414', color: '#fff', border: '1px solid rgba(245,197,24,0.2)' },
            success: { iconTheme: { primary: '#F5C518', secondary: '#000' } },
          }}
        />
      </body>
    </html>
  )
}
