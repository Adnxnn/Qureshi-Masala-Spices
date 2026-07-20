-- ============================================
-- Qureshi's Masala & Spices — Shared Promo Codes
-- Run this migration once in the Supabase SQL Editor.
-- ============================================

create extension if not exists pgcrypto;

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  discount numeric(10, 2) not null check (discount > 0),
  type text not null check (type in ('percentage', 'fixed')),
  is_active boolean not null default true,
  usage_limit integer not null default 1 check (usage_limit > 0),
  used_count integer not null default 0 check (used_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promo_percentage_maximum
    check (type <> 'percentage' or discount <= 100),
  constraint promo_usage_limit_not_below_count
    check (usage_limit >= used_count)
);

create unique index if not exists promo_codes_upper_code_unique
  on public.promo_codes (upper(code));

create table if not exists public.promo_code_usages (
  id uuid primary key default gen_random_uuid(),
  promo_code_id uuid not null
    references public.promo_codes(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  customer_email text,
  customer_phone text,
  used_at timestamptz not null default now()
);

create index if not exists promo_code_usages_promo_id_idx
  on public.promo_code_usages (promo_code_id);

create index if not exists promo_code_usages_user_id_idx
  on public.promo_code_usages (user_id);

create index if not exists promo_code_usages_email_idx
  on public.promo_code_usages (customer_email);

create index if not exists promo_code_usages_phone_idx
  on public.promo_code_usages (customer_phone);

alter table public.promo_codes enable row level security;
alter table public.promo_code_usages enable row level security;

drop policy if exists "Admins can manage promo codes"
  on public.promo_codes;

create policy "Admins can manage promo codes"
  on public.promo_codes
  for all
  using (public.is_admin_user())
  with check (public.is_admin_user());

drop policy if exists "Admins can read promo usages"
  on public.promo_code_usages;

create policy "Admins can read promo usages"
  on public.promo_code_usages
  for select
  using (public.is_admin_user());

drop policy if exists "Admins can delete promo usages"
  on public.promo_code_usages;

create policy "Admins can delete promo usages"
  on public.promo_code_usages
  for delete
  using (public.is_admin_user());

create or replace function public.handle_promo_code_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_promo_codes_updated_at
  on public.promo_codes;

create trigger set_promo_codes_updated_at
  before update on public.promo_codes
  for each row
  execute function public.handle_promo_code_updated_at();

-- Atomically checks availability, enforces one use per customer,
-- records the use and increments the shared counter.
create or replace function public.redeem_promo_code(
  p_code text,
  p_user_id uuid,
  p_customer_email text,
  p_customer_phone text
)
returns table (
  usage_id uuid,
  id uuid,
  code text,
  discount numeric,
  type text,
  is_active boolean,
  usage_limit integer,
  used_count integer,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_promo public.promo_codes%rowtype;
  v_usage_id uuid;
  v_email text := lower(trim(coalesce(p_customer_email, '')));
  v_phone text := regexp_replace(coalesce(p_customer_phone, ''), '\D', '', 'g');
begin
  select pc.*
  into v_promo
  from public.promo_codes pc
  where upper(pc.code) = upper(trim(p_code))
  for update;

  if not found
    or not v_promo.is_active
    or v_promo.used_count >= v_promo.usage_limit then
    return;
  end if;

  if exists (
    select 1
    from public.promo_code_usages usage
    where usage.promo_code_id = v_promo.id
      and (
        (p_user_id is not null and usage.user_id = p_user_id)
        or (v_email <> '' and usage.customer_email = v_email)
        or (v_phone <> '' and usage.customer_phone = v_phone)
      )
  ) then
    return;
  end if;

  insert into public.promo_code_usages (
    promo_code_id,
    user_id,
    customer_email,
    customer_phone
  )
  values (
    v_promo.id,
    p_user_id,
    nullif(v_email, ''),
    nullif(v_phone, '')
  )
  returning public.promo_code_usages.id into v_usage_id;

  update public.promo_codes pc
  set used_count = pc.used_count + 1
  where pc.id = v_promo.id;

  return query
  select
    v_usage_id,
    v_promo.id,
    v_promo.code,
    v_promo.discount,
    v_promo.type,
    v_promo.is_active,
    v_promo.usage_limit,
    v_promo.used_count + 1,
    v_promo.created_at;
end;
$$;

-- Used only when order creation fails after a code was reserved.
create or replace function public.release_promo_code_redemption(
  p_usage_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_promo_id uuid;
begin
  delete from public.promo_code_usages usage
  where usage.id = p_usage_id
  returning usage.promo_code_id into v_promo_id;

  if v_promo_id is not null then
    update public.promo_codes pc
    set used_count = greatest(pc.used_count - 1, 0)
    where pc.id = v_promo_id;
  end if;
end;
$$;

revoke all on function public.redeem_promo_code(
  text,
  uuid,
  text,
  text
) from public;

revoke all on function public.release_promo_code_redemption(uuid)
  from public;

grant execute on function public.redeem_promo_code(
  text,
  uuid,
  text,
  text
) to service_role;

grant execute on function public.release_promo_code_redemption(uuid)
  to service_role;

-- Preserve the codes that previously shipped in data/promo-codes.json.
-- They start with a clean shared usage count in Supabase.
insert into public.promo_codes (
  code,
  discount,
  type,
  is_active,
  usage_limit,
  used_count
)
values
  ('WELCOME10', 10, 'percentage', true, 100, 0),
  ('SAVE50', 50, 'fixed', true, 50, 0),
  ('SUMMER20', 20, 'percentage', false, 200, 0)
on conflict (upper(code)) do nothing;

