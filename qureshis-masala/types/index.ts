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
  badge?: string              // e.g. "Bestseller", "New"
  image_url: string
  is_active: boolean
  created_at: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

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
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: { Row: Product; Insert: Omit<Product, 'id' | 'created_at'>; Update: Partial<Product> }
      orders: { Row: Omit<Order, 'items'>; Insert: Omit<Order, 'id' | 'created_at' | 'items'>; Update: Partial<Order> }
      order_items: { Row: OrderItem; Insert: Omit<OrderItem, 'id'>; Update: Partial<OrderItem> }
      users: { Row: User; Insert: Omit<User, 'id' | 'created_at'>; Update: Partial<User> }
    }
  }
}
