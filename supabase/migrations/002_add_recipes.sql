-- ============================================
-- Qureshi's Masala & Spices — Recipes Schema
-- ============================================

-- Create recipes table
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { text: string, order: number }
  preparation_steps JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of { text: string, order: number }
  cooking_time INTEGER, -- in minutes
  preparation_time INTEGER, -- in minutes
  total_time INTEGER GENERATED ALWAYS AS (COALESCE(cooking_time, 0) + COALESCE(preparation_time, 0)) STORED,
  servings INTEGER,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  cuisine_or_category TEXT,
  is_vegetarian BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  thumbnail_url TEXT,
  additional_images TEXT[] DEFAULT '{}'::text[],
  video_url TEXT,
  external_video_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create recipe_products junction table (many-to-many)
CREATE TABLE public.recipe_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  recommended_quantity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(recipe_id, product_id)
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipe_products ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can read published recipes
CREATE POLICY "Public can read published recipes"
  ON public.recipes
  FOR SELECT
  USING (is_published = true);

-- Admin can manage all recipes
CREATE POLICY "Admin can manage recipes"
  ON public.recipes
  FOR ALL
  USING (public.is_admin_user());

-- Public can read recipe_products for published recipes
CREATE POLICY "Public can read recipe products"
  ON public.recipe_products
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.recipes
    WHERE recipes.id = recipe_products.recipe_id
    AND recipes.is_published = true
  ));

-- Admin can manage recipe_products
CREATE POLICY "Admin can manage recipe products"
  ON public.recipe_products
  FOR ALL
  USING (public.is_admin_user());

-- Create updated_at trigger for recipes
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

