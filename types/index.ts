export type ProductVariant = {
  weight_grams: number
  price: number
  original_price: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  variants: ProductVariant[]
  stock_qty: number
  category: 'chicken' | 'seafood' | 'vegetarian' | 'spice'
  accent_color: string        // hex — matches packaging
  tags: string[]              // e.g. ["smoky","bold","spicy"]
  badge?: string | null              // e.g. "Bestseller", "New"
  image_url: string
  is_active: boolean
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'

export type Order = {
  id: string
  created_at: string
  user_id?: string
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_city: string
  customer_pincode: string
  status: OrderStatus
  total_amount: number
  notes?: string
  items: OrderItem[]
}

export type OrderWithItems = Order & {
  order_items: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  variant_weight_grams: number
  quantity: number
  unit_price: number
  subtotal: number
}

export type PlaceOrderPayload = {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_address: string
  customer_city: string
  customer_pincode: string
  notes?: string
  items: CartItem[]
}

export type CartItem = {
  product: Product
  variant: ProductVariant
  quantity: number
}

export type User = {
  id: string
  email: string
  full_name: string
  phone: string
  address?: string
  city?: string
  pincode?: string
  is_admin: boolean
  created_at: string
}

export type PromoCode = {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  isActive: boolean
  usageLimit: number
  usedCount: number
  usedBy: Array<{
    userId?: string
    customerEmail?: string
    customerPhone?: string
    usedAt: string
  }>
  createdAt: string
}

export type RecipeIngredient = {
  text: string;
  order: number;
  section?: string;
};

export type RecipeStep = {
  text: string;
  order: number;
  stage?: string;
};

export type Recipe = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  ingredients: RecipeIngredient[];
  preparation_steps: RecipeStep[];
  cooking_time: number | null;
  preparation_time: number | null;
  total_time: number | null;
  servings: number | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine_or_category: string | null;
  is_vegetarian: boolean;
  is_featured: boolean;
  thumbnail_url: string | null;
  additional_images: string[];
  video_url: string | null;
  external_video_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type RecipeProduct = {
  id: string;
  recipe_id: string;
  product_id: string;
  recommended_quantity: string | null;
  created_at: string;
};

export type RecipeWithProducts = Recipe & {
  recipe_products: (RecipeProduct & {
    products: Product;
  })[];
};

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: {
          name: string;
          slug: string;
          description: string;
          short_description: string;
          variants: ProductVariant[];
          stock_qty: number;
          category: Product['category'];
          accent_color: string;
          tags: string[];
          badge?: string | null;
          image_url: string;
          is_active: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          short_description?: string;
          variants?: ProductVariant[];
          stock_qty?: number;
          category?: Product['category'];
          accent_color?: string;
          tags?: string[];
          badge?: string | null;
          image_url?: string;
          is_active?: boolean;
        }
      },
      recipes: {
        Row: Recipe;
        Insert: {
          name: string;
          slug: string;
          short_description: string;
          full_description: string;
          ingredients: RecipeIngredient[];
          preparation_steps: RecipeStep[];
          cooking_time?: number | null;
          preparation_time?: number | null;
          servings?: number | null;
          difficulty: Recipe['difficulty'];
          cuisine_or_category?: string | null;
          is_vegetarian?: boolean;
          is_featured?: boolean;
          thumbnail_url?: string | null;
          additional_images?: string[];
          video_url?: string | null;
          external_video_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          is_published?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          short_description?: string;
          full_description?: string;
          ingredients?: RecipeIngredient[];
          preparation_steps?: RecipeStep[];
          cooking_time?: number | null;
          preparation_time?: number | null;
          servings?: number | null;
          difficulty?: Recipe['difficulty'];
          cuisine_or_category?: string | null;
          is_vegetarian?: boolean;
          is_featured?: boolean;
          thumbnail_url?: string | null;
          additional_images?: string[];
          video_url?: string | null;
          external_video_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          is_published?: boolean;
        };
      },
      recipe_products: {
        Row: RecipeProduct;
        Insert: {
          recipe_id: string;
          product_id: string;
          recommended_quantity?: string | null;
        };
        Update: {
          recipe_id?: string;
          product_id?: string;
          recommended_quantity?: string | null;
        };
      },
      orders: { Row: Omit<Order, 'items'>; Insert: Omit<Order, 'id' | 'created_at' | 'items'>; Update: Partial<Order> },
      order_items: { Row: OrderItem; Insert: Omit<OrderItem, 'id'>; Update: Partial<OrderItem> },
      users: { Row: User; Insert: Omit<User, 'id' | 'created_at'>; Update: Partial<User> }
    }
  }
}
