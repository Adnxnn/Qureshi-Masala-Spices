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
        'gold-light': '#FFD700',
        'gold-dark': '#D4A815',
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
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        marquee:    { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        'spin-slow':{ to: { transform: 'rotate(360deg)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(245, 197, 24, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(245, 197, 24, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #F5C518 0%, #FFD700 50%, #D4A815 100%)',
        'gradient-radial': 'radial-gradient(circle at center, rgba(245, 197, 24, 0.1) 0%, transparent 70%)',
        'gradient-texture': 'radial-gradient(circle at 30% 20%, rgba(245, 197, 24, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(245, 197, 24, 0.05) 0%, transparent 50%)',
      },
      boxShadow: {
        'gold': '0 0 20px rgba(245, 197, 24, 0.3)',
        'gold-lg': '0 0 40px rgba(245, 197, 24, 0.5)',
        'card': '0 10px 40px rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
