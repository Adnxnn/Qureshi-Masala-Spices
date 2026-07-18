export interface Recipe {
  id: string
  title: string
  slug: string
  description: string
  image: string
  prepTime: string
  cookTime: string
  servings: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  relatedMasalaId?: string
  ingredients: string[]
  instructions: string[]
  tips?: string[]
}

export const RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Chicken Kabab',
    slug: 'chicken-kabab',
    description: 'Juicy, flavorful chicken kababs with authentic spices',
    image: '/images/Kebab Masala.png',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: '4',
    difficulty: 'Easy',
    category: 'Chicken',
    relatedMasalaId: '1',
    ingredients: [
      '500g chicken, cut into cubes',
      '2 tbsp Qureshi\'s Chicken Kabab Masala',
      '1 cup yogurt',
      '2 onions, sliced',
      '3 green chilies, chopped',
      '1 tbsp ginger-garlic paste',
      '1 lemon juice',
      'Salt to taste',
      'Oil for grilling'
    ],
    instructions: [
      'In a large bowl, mix yogurt, ginger-garlic paste, lemon juice, and Qureshi\'s Chicken Kabab Masala.',
      'Add chicken cubes and mix well. Marinate for at least 2 hours or overnight.',
      'Preheat grill or pan to medium-high heat.',
      'Grill chicken pieces until cooked through and slightly charred, turning occasionally.',
      'Serve hot with onion rings and mint chutney.'
    ],
    tips: [
      'For extra flavor, marinate overnight in the refrigerator.',
      'You can also cook these in a pan if you don\'t have a grill.',
      'Serve with lemon wedges for a fresh touch.'
    ]
  },
  {
    id: '2',
    title: 'Hyderabadi Chicken Biryani',
    slug: 'hyderabadi-chicken-biryani',
    description: 'Authentic Hyderabadi-style biryani with aromatic spices',
    image: '/images/Biryani Masala.png',
    prepTime: '30 mins',
    cookTime: '45 mins',
    servings: '6',
    difficulty: 'Medium',
    category: 'Biryani',
    relatedMasalaId: '7',
    ingredients: [
      '1 kg chicken, cut into pieces',
      '3 tbsp Qureshi\'s Biryani Masala',
      '2 cups basmati rice, soaked',
      '3 onions, thinly sliced',
      '4 green chilies, slit',
      '2 tbsp ginger-garlic paste',
      '1 cup yogurt',
      'Fresh mint and coriander leaves',
      'Saffron strands soaked in warm milk',
      'Ghee',
      'Salt to taste'
    ],
    instructions: [
      'Cook basmati rice until 70% done. Drain and set aside.',
      'Fry onions until golden brown. Reserve some for garnish.',
      'Marinate chicken with yogurt, ginger-garlic paste, Qureshi\'s Biryani Masala, fried onions, mint, and coriander for 1 hour.',
      'Heat ghee in a heavy-bottomed pot. Add marinated chicken and cook for 10 minutes.',
      'Layer with partially cooked rice. Drizzle saffron milk, add remaining fried onions.',
      'Cover and cook on low heat (dum) for 20-25 minutes.',
      'Gently mix and serve hot.'
    ],
    tips: [
      'Use aged basmati rice for the best texture.',
      'Don\'t overcook the rice in the first step.',
      'The dum cooking is crucial for authentic flavor.'
    ]
  },
  {
    id: '3',
    title: 'Fish Fry',
    slug: 'fish-fry',
    description: 'Crispy, spicy fish fry with traditional masala',
    image: '/images/Fish Fry Masala.png',
    prepTime: '10 mins',
    cookTime: '15 mins',
    servings: '4',
    difficulty: 'Easy',
    category: 'Seafood',
    relatedMasalaId: '8',
    ingredients: [
      '500g fish fillets',
      '2 tbsp Qureshi\'s Fish Fry Masala',
      '1 tbsp ginger-garlic paste',
      '2 tbsp lemon juice',
      '2 tbsp rice flour',
      '2 tbsp corn flour',
      'Salt to taste',
      'Oil for frying'
    ],
    instructions: [
      'Clean and pat dry fish fillets.',
      'In a bowl, mix Qureshi\'s Fish Fry Masala, ginger-garlic paste, and lemon juice.',
      'Coat fish pieces with the marinade. Let it rest for 15 minutes.',
      'Mix rice flour and corn flour. Coat each fish piece with this mixture.',
      'Heat oil in a pan and fry fish until golden and crispy on both sides.',
      'Serve hot with lemon wedges and onion rings.'
    ],
    tips: [
      'Patting fish dry helps in getting a crispy coating.',
      'Don\'t overcrowd the pan while frying.',
      'You can also grill or air fry for a healthier option.'
    ]
  },
  {
    id: '4',
    title: 'Mutton Curry',
    slug: 'mutton-curry',
    description: 'Rich, flavorful mutton curry with traditional spices',
    image: '/images/Mutton Masala.png',
    prepTime: '20 mins',
    cookTime: '60 mins',
    servings: '6',
    difficulty: 'Medium',
    category: 'Mutton',
    relatedMasalaId: '4',
    ingredients: [
      '1 kg mutton, cut into pieces',
      '3 tbsp Qureshi\'s Mutton Masala',
      '2 onions, finely chopped',
      '3 tomatoes, pureed',
      '2 tbsp ginger-garlic paste',
      '1 cup yogurt',
      'Fresh coriander leaves',
      'Oil',
      'Salt to taste'
    ],
    instructions: [
      'Heat oil in a pressure cooker. Fry onions until golden brown.',
      'Add ginger-garlic paste and sauté for 2 minutes.',
      'Add mutton pieces and brown them well.',
      'Add tomato puree and cook until oil separates.',
      'Add Qureshi\'s Mutton Masala and yogurt. Mix well.',
      'Add salt and 2 cups of water. Pressure cook for 20-25 minutes.',
      'Garnish with fresh coriander and serve hot with rice or roti.'
    ],
    tips: [
      'Browning the mutton well adds depth of flavor.',
      'You can cook in a heavy-bottomed pot instead of a pressure cooker for a richer taste.',
      'Let it rest for 10 minutes before serving.'
    ]
  }
]

export function getRecipesByCategory(category?: string): Recipe[] {
  if (!category || category === 'All') return RECIPES
  return RECIPES.filter(recipe => recipe.category.toLowerCase() === category.toLowerCase())
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find(recipe => recipe.slug === slug)
}

export const CATEGORIES = ['All', 'Chicken', 'Mutton', 'Seafood', 'Biryani', 'Vegetarian']
