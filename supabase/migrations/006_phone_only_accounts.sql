-- Allow verified phone-only Supabase Auth accounts to have customer profiles.
-- Existing email accounts and the unique constraint on non-null emails remain intact.
alter table public.users alter column email drop not null;
