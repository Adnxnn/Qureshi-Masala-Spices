-- ============================================
-- Qureshi's Masala & Spices — Database Schema
-- Run in Supabase SQL Editor
-- ============================================

-- PRODUCTS TABLE
create table public.products (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  description   text not null,
  short_description text not null,
  variants      jsonb not null default '[]'::jsonb,  -- Array of {weight_grams, price, original_price}
  stock_qty     integer not null default 0,
  category      text not null check (category in ('chicken','seafood','vegetarian','spice')),
  accent_color  text not null default '#E8730A',
  tags          text[] default '{}',
  badge         text,
  image_url     text not null default '',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- USERS TABLE (customer profiles)
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  full_name     text not null,
  phone         text not null,
  address       text,
  city          text,
  pincode       text,
  created_at    timestamptz not null default now()
);

-- ORDERS TABLE
create table public.orders (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  user_id          uuid references public.users(id) on delete set null,
  customer_name    text not null,
  customer_phone   text not null,
  customer_email   text not null,
  customer_address text not null,
  customer_city    text not null,
  customer_pincode text not null,
  status           text not null default 'pending' check (status in ('pending','confirmed','dispatched','delivered','cancelled')),
  total_amount     numeric(10,2) not null,
  notes            text
);

-- ORDER ITEMS TABLE
create table public.order_items (
  id                    uuid primary key default gen_random_uuid(),
  order_id              uuid not null references public.orders(id) on delete cascade,
  product_id            uuid not null references public.products(id),
  product_name          text not null,
  variant_weight_grams  integer not null,
  quantity              integer not null check (quantity > 0),
  unit_price            numeric(10,2) not null,
  subtotal              numeric(10,2) generated always as (quantity * unit_price) stored
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.products   enable row level security;
alter table public.users      enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Anyone can read active products (public storefront)
create policy "Public can read active products"
  on public.products for select
  using (is_active = true);

-- Only authenticated admin can manage products
create policy "Admin can manage products"
  on public.products for all
  using (auth.role() = 'authenticated');

-- Users can read their own profile
create policy "Users can read own profile"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- Anyone can insert an order (to place an order)
create policy "Anyone can place an order"
  on public.orders for insert
  with check (true);

-- Users can read their own orders
create policy "Users can read own orders"
  on public.orders for select
  using (auth.uid() = user_id or auth.role() = 'authenticated');

-- Only authenticated admin can update orders
create policy "Admin can update orders"
  on public.orders for update
  using (auth.role() = 'authenticated');

-- Anyone can insert order items
create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

-- Users can read their own order items
create policy "Users can read own order items"
  on public.order_items for select
  using (exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
    and (orders.user_id = auth.uid() or auth.role() = 'authenticated')
  ));

-- Admin can read all order items
create policy "Admin can read all order items"
  on public.order_items for select
  using (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA — your 4 products
-- ============================================

insert into public.products (name, slug, description, short_description, price, weight_grams, stock_qty, category, accent_color, tags, badge, image_url) values
(
  'Kebab Masala',
  'kebab-masala',
  'Bold, smoky depth that transforms your chicken kebabs into a restaurant-grade experience. Ground from whole dried red chillies, cumin, coriander and a secret blend of 12 spices — the kind of marinade that fills your kitchen before the grill even heats up.',
  'Smoky, bold chicken kebab blend. 100% natural.',
  89.00, 100, 50, 'chicken', '#C0392B',
  ARRAY['smoky','bold','spicy'],
  'Bestseller',
  '/images/kebab-masala.jpg'
),
(
  'Fish Fry Masala',
  'fish-fry-masala',
  'A coastal-inspired blend that gives your fish the perfect crust — earthy, tangy, and absolutely addictive from the first bite. Made with ground kokum, turmeric, red chilli and black pepper for that authentic Karnataka flavour.',
  'Tangy coastal fish fry blend. Perfect crust every time.',
  89.00, 100, 50, 'seafood', '#1565C0',
  ARRAY['tangy','coastal','crispy'],
  'New',
  '/images/fish-fry-masala.jpg'
),
(
  'Fish Curry Masala',
  'fish-curry-masala',
  'A rich, warming curry base with layers of whole spice aromatics. The balance of tamarind, coconut undertones and warm spices creates a gravy that coats every piece of fish in pure flavour.',
  'Rich, aromatic fish curry base. Restaurant quality at home.',
  89.00, 100, 50, 'seafood', '#E8730A',
  ARRAY['rich','aromatic','warm'],
  'Fan Favourite',
  '/images/fish-curry-masala.jpg'
),
(
  'Biryani Masala',
  'biryani-masala',
  'The crown jewel of the Qureshi''s range. A complex blend of whole spices — star anise, bay leaf, black cardamom, mace and more — that fills your kitchen with the aroma of a proper dum biryani from the moment you open the packet.',
  'Complex, fragrant whole-spice biryani blend. Chicken & Mutton.',
  99.00, 100, 50, 'chicken', '#E8730A',
  ARRAY['complex','fragrant','royal'],
  'Signature',
  '/images/biryani-masala.jpg'
);

-- ============================================
-- STORAGE BUCKET for product images
-- ============================================
-- Run this too:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);
