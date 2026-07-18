import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black:    '#0a0a0a',
        charcoal: '#141414',
        dark:     '#1a1a1a',
        gold:     '#F5C518',
        cream:    '#F5F0E8',
        'red-brand':    '#C0392B',
        'blue-brand':   '#1565C0',
        'orange-brand': '#E8730A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        serif:   ['Playfair Display', 'serif'],
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee:     'marquee 22s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slow-r':'spin-slow 15s linear infinite reverse',
      },
      keyframes: {
        marquee:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow':{ to: { transform: 'rotate(360deg)' } },
      },
    },
  },
  plugins: [],
}
export default config
