-- ============================================
-- Atomic order placement — fixes stock never being
-- decremented, and prevents overselling under concurrent
-- checkouts by locking + checking stock in the same
-- transaction as the order insert.
-- Run this once in the Supabase SQL Editor.
-- ============================================

create or replace function public.place_order(
  p_user_id           uuid,
  p_customer_name     text,
  p_customer_phone    text,
  p_customer_email    text,
  p_customer_address  text,
  p_customer_city     text,
  p_customer_pincode  text,
  p_notes             text,
  p_total_amount      numeric,
  -- items: [{ "product_id": uuid, "product_name": text,
  --           "variant_weight_grams": int, "quantity": int, "unit_price": numeric }, ...]
  p_items             jsonb
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order   public.orders;
  v_item    jsonb;
  v_updated integer;
begin
  if jsonb_array_length(p_items) = 0 then
    raise exception 'EMPTY_ORDER: an order must contain at least one item';
  end if;

  insert into public.orders (
    user_id, customer_name, customer_phone, customer_email,
    customer_address, customer_city, customer_pincode, notes,
    total_amount, status
  ) values (
    p_user_id, p_customer_name, p_customer_phone, p_customer_email,
    p_customer_address, p_customer_city, p_customer_pincode, p_notes,
    p_total_amount, 'pending'
  )
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    -- Atomically decrement stock: the WHERE clause both takes the row lock
    -- and enforces the stock check in one statement, so two concurrent
    -- checkouts can't both succeed against the last unit.
    update public.products
    set stock_qty = stock_qty - (v_item->>'quantity')::integer
    where id = (v_item->>'product_id')::uuid
      and stock_qty >= (v_item->>'quantity')::integer;

    get diagnostics v_updated = row_count;

    if v_updated = 0 then
      raise exception 'INSUFFICIENT_STOCK: not enough stock for %', v_item->>'product_name';
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, variant_weight_grams, quantity, unit_price
    ) values (
      v_order.id,
      (v_item->>'product_id')::uuid,
      v_item->>'product_name',
      (v_item->>'variant_weight_grams')::integer,
      (v_item->>'quantity')::integer,
      (v_item->>'unit_price')::numeric
    );
  end loop;

  return v_order;
end;
$$;

-- Only the service-role checkout path (and signed-in flows if you ever
-- move checkout client-side) should call this directly.
revoke all on function public.place_order(
  uuid, text, text, text, text, text, text, text, numeric, jsonb
) from public;

grant execute on function public.place_order(
  uuid, text, text, text, text, text, text, text, numeric, jsonb
) to anon, authenticated, service_role;