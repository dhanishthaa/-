create extension if not exists pgcrypto;

create table if not exists public.owner_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.owner_access enable row level security;
create policy "Owner can read own access row" on public.owner_access
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_invoice_owner()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (select 1 from public.owner_access where user_id = auth.uid());
$$;
revoke all on function public.is_invoice_owner() from public;
grant execute on function public.is_invoice_owner() to authenticated;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 180),
  mrp_paise bigint check (mrp_paise is null or mrp_paise >= 0),
  b2b_price_paise bigint check (b2b_price_paise is null or b2b_price_paise >= 0),
  d2c_price_paise bigint check (d2c_price_paise is null or d2c_price_paise >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists products_name_unique_idx on public.products (lower(name));

create table if not exists public.business_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Isth Fragrances',
  upi_id text not null,
  payee_name text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  customer_type text not null check (customer_type in ('B2B','D2C')),
  customer_name text not null check (length(trim(customer_name)) > 0),
  customer_phone text,
  invoice_date date not null,
  status text not null default 'finalized' check (status in ('draft','finalized')),
  grand_total_paise bigint not null check (grand_total_paise >= 0),
  created_at timestamptz not null default now(),
  finalized_at timestamptz not null default now()
);

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name_snapshot text not null,
  mrp_snapshot_paise bigint check (mrp_snapshot_paise is null or mrp_snapshot_paise >= 0),
  unit_price_snapshot_paise bigint not null check (unit_price_snapshot_paise >= 0),
  quantity integer not null check (quantity > 0),
  subtotal_paise bigint not null check (subtotal_paise >= 0),
  display_order integer not null check (display_order > 0)
);

create index if not exists invoices_created_at_idx on public.invoices (created_at desc);
create index if not exists invoice_lines_invoice_order_idx on public.invoice_lines (invoice_id, display_order);

alter table public.products enable row level security;
alter table public.business_settings enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;

create policy "Owner manages products" on public.products
  for all to authenticated using (public.is_invoice_owner()) with check (public.is_invoice_owner());
create policy "Owner manages business settings" on public.business_settings
  for all to authenticated using (public.is_invoice_owner()) with check (public.is_invoice_owner());
create policy "Owner manages invoices" on public.invoices
  for all to authenticated using (public.is_invoice_owner()) with check (public.is_invoice_owner());
create policy "Owner manages invoice lines" on public.invoice_lines
  for all to authenticated using (public.is_invoice_owner()) with check (
    public.is_invoice_owner() and exists (
      select 1 from public.invoices i where i.id = invoice_id
    )
  );


grant select, insert, update, delete on public.products to authenticated;
grant select, insert, update, delete on public.business_settings to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.invoice_lines to authenticated;

-- Keep the owner's signature in private Storage. Only the owner identity may read/write it.
insert into storage.buckets (id, name, public)
values ('invoice-private-assets', 'invoice-private-assets', false)
on conflict (id) do update set public = false;
create policy "Owner reads private invoice assets" on storage.objects
  for select to authenticated using (bucket_id = 'invoice-private-assets' and public.is_invoice_owner());
create policy "Owner uploads private invoice assets" on storage.objects
  for insert to authenticated with check (bucket_id = 'invoice-private-assets' and public.is_invoice_owner());
create policy "Owner updates private invoice assets" on storage.objects
  for update to authenticated using (bucket_id = 'invoice-private-assets' and public.is_invoice_owner())
  with check (bucket_id = 'invoice-private-assets' and public.is_invoice_owner());
create policy "Owner deletes private invoice assets" on storage.objects
  for delete to authenticated using (bucket_id = 'invoice-private-assets' and public.is_invoice_owner());

insert into public.business_settings (id, business_name, upi_id, payee_name)
values (true, 'Isth Fragrances', 'param.dave.1111@okaxis', 'Param Rajesh Dave')
on conflict (id) do nothing;

insert into public.products (name, mrp_paise, b2b_price_paise, d2c_price_paise) values
  ('Kawaii Marshmallow', 169900, 119900, null),
  ('Fiery Soul', 179900, 129900, null),
  ('First Love', 129900, 79900, null),
  ('Cashmere Oud', 169900, 119900, null),
  ('Orion', 129900, 79900, null),
  ('The Ocean', 149900, 99900, null),
  ('Velvet Night', 139900, 89900, null),
  ('Imperial', 129900, 79900, null),
  ('Northern Star', 129900, 79900, null),
  ('Complimentary Fragrance Set of 9 Fragrances 36 ml Each', null, 0, null)
on conflict do nothing;

-- After the owner creates an account through the authorized Supabase administrative process,
-- authorize only that exact auth.users UUID with a privileged SQL editor session, e.g.:
-- insert into public.owner_access(user_id) values ('OWNER_AUTH_USER_UUID');
-- Disable public sign-ups in Supabase Auth settings. Never add the service-role key to the website.
