import type { Metadata } from 'next'
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/noto-sans/wght.css'
import './globals.css'
import ClientLayout from './client-layout'

export const metadata: Metadata = {
  title: "Qureshi's Masala & Spices — Pure Flavour. Endless Taste.",
  description: 'Small-batch masalas crafted in Kodagu. 100% natural, zero preservatives, bold flavours.',
  keywords: ['masala', 'spices', 'biryani masala', 'kebab masala', 'fish fry masala', 'Kodagu'],
  openGraph: {
    title: "Qureshi's Masala & Spices",
    description: 'Pure Flavour. Endless Taste.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="theme-color" content="#0b0402" />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
