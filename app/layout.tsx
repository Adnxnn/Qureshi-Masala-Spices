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
    <html lang="en" className="bg-black">
      <body className="bg-black text-cream antialiased">
        <ClientLayout>{children}</ClientLayout>
        <Toaster
          position="top-center"
          toastOptions={{
            style: { background: '#17110e', color: '#f4ede0', border: '1px solid rgba(224,200,137,0.22)', borderRadius: '3px' },
            success: { iconTheme: { primary: '#c7a15a', secondary: '#080705' } },
          }}
        />
      </body>
    </html>
  )
}
