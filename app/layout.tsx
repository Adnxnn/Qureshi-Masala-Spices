import type { Metadata } from 'next'
import '@fontsource-variable/fraunces/wght.css'
import '@fontsource-variable/noto-sans/wght.css'
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
  const themeScript = `
    (function () {
      try {
        var stored = localStorage.getItem('qms-theme-v1');
        var theme = stored === 'light' || stored === 'dark'
          ? stored
          : (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        document.documentElement.dataset.theme = theme;
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.content = theme === 'dark' ? '#07070b' : '#fff7e4';
      } catch (_) {
        document.documentElement.dataset.theme = 'dark';
      }
    })();
  `

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#07070b" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
