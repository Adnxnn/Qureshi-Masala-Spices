import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recipes & Cooking Inspiration',
  description: "Cook with Qureshi's Masala & Spices. Explore biryani, kebab, curry, seafood and vegetarian recipes with step-by-step instructions.",
  alternates: { canonical: '/recipes' },
}

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children
}
