-- ============================================
-- Live promo validation — Supabase only
-- Run this migration once in the Supabase SQL Editor.
-- ============================================

-- Remove the legacy seeded codes. From this point onward, the admin panel
-- is the only source of promo codes.
delete from public.promo_codes
where upper(code) in ('WELCOME10', 'SAVE50', 'SUMMER20');

-- Public checkout can validate one exact code without being able to list
-- promo codes or read customer usage history.
create or replace function public.validate_promo_code(p_code text)
returns table (
  id uuid,
  code text,
  discount numeric,
  type text,
  is_active boolean,
  usage_limit integer,
  used_count integer,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    pc.id,
    pc.code,
    pc.discount,
    pc.type,
    pc.is_active,
    pc.usage_limit,
    pc.used_count,
    pc.created_at
  from public.promo_codes pc
  where upper(pc.code) = upper(trim(p_code))
    and pc.is_active = true
    and pc.used_count < pc.usage_limit
  limit 1;
$$;

revoke all on function public.validate_promo_code(text) from public;

grant execute on function public.validate_promo_code(text)
  to anon, authenticated, service_role;

