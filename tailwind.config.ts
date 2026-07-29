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
        black:    'rgb(var(--black-rgb) / <alpha-value>)',
        charcoal: 'rgb(var(--charcoal-rgb) / <alpha-value>)',
        dark:     'rgb(var(--dark-rgb) / <alpha-value>)',
        surface:  'rgb(var(--surface-rgb) / <alpha-value>)',
        gold:     'rgb(var(--gold-rgb) / <alpha-value>)',
        'gold-light': 'rgb(var(--gold-light-rgb) / <alpha-value>)',
        'gold-dark': 'rgb(var(--gold-dark-rgb) / <alpha-value>)',
        cream:    'rgb(var(--cream-rgb) / <alpha-value>)',
        muted:    'rgb(var(--muted-rgb) / <alpha-value>)',
        'red-brand':    '#5b1718',
        'blue-brand':   '#1565C0',
        'orange-brand': '#E8730A',
      },
      fontFamily: {
        display: ['Fraunces Variable', 'Fraunces', 'Georgia', 'serif'],
        serif:   ['Fraunces Variable', 'Fraunces', 'Georgia', 'serif'],
        sans:    ['Noto Sans Variable', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee:     'marquee 22s linear infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slow-r':'spin-slow 15s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
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
          '0%': { opacity: '0.72' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(112deg, #9a7336 0%, #e3ca8a 48%, #b48844 100%)',
        'gradient-radial': 'radial-gradient(circle at center, rgba(199, 161, 90, 0.09) 0%, transparent 70%)',
        'gradient-texture': 'radial-gradient(circle at 30% 20%, rgba(91, 23, 24, 0.12) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(199, 161, 90, 0.04) 0%, transparent 50%)',
      },
      boxShadow: {
        'gold': '0 18px 45px rgba(0, 0, 0, 0.34)',
        'gold-lg': '0 28px 70px rgba(0, 0, 0, 0.48)',
        'card': '0 24px 70px rgba(0, 0, 0, 0.46)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
export default config
