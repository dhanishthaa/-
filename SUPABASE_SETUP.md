# ISTH Supabase setup

The frontend is already wired to use Supabase Auth and a `products` table when the following Vite variables are present:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAILS=authorized@example.com,second-authorized@example.com
```

The current static preview falls back to browser storage when these variables are absent. That keeps the showcase usable on GitHub Pages while making the production integration explicit rather than hiding a fake backend behind the UI.

## Products table

Run this SQL in Supabase SQL Editor:

```sql
create table if not exists public.products (
  id text primary key,
  name text not null,
  notes text not null default '',
  description text not null default '',
  collection text not null default 'Signature',
  image_url text,
  color text not null default '#5B0D18',
  size text not null default '10ml tower' check (size in ('10ml tower', '30ml cosmos')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "Authorized admin can insert products"
  on public.products for insert to authenticated
  with check (auth.email() in ('authorized@example.com'));

create policy "Authorized admin can update products"
  on public.products for update to authenticated
  using (auth.email() in ('authorized@example.com'))
  with check (auth.email() in ('authorized@example.com'));

create policy "Authorized admin can delete products"
  on public.products for delete to authenticated
  using (auth.email() in ('authorized@example.com'));
```

## Role verification and public settings

Do not treat every authenticated Supabase user as an administrator. Create a role table owned by the authenticated user id, and let PostgreSQL policies—not the frontend—decide who can write.

```sql
create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'super_admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_profiles enable row level security;

create or replace function public.is_isth_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_profiles
    where user_id = auth.uid() and is_active = true and role in ('admin', 'super_admin')
  );
$$;

drop policy if exists "Authorized admin can insert products" on public.products;
drop policy if exists "Authorized admin can update products" on public.products;
drop policy if exists "Authorized admin can delete products" on public.products;

create policy "Authorized admin can insert products"
  on public.products for insert to authenticated with check (public.is_isth_admin());
create policy "Authorized admin can update products"
  on public.products for update to authenticated using (public.is_isth_admin()) with check (public.is_isth_admin());
create policy "Authorized admin can delete products"
  on public.products for delete to authenticated using (public.is_isth_admin());

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "Public can read public settings" on public.site_settings for select using (is_public = true);
create policy "Admins can manage settings" on public.site_settings for all to authenticated using (public.is_isth_admin()) with check (public.is_isth_admin());

create table if not exists public.admin_activity_log (
  id bigint generated always as identity primary key,
  admin_user_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id text,
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_activity_log enable row level security;
create policy "Admins can read activity logs" on public.admin_activity_log for select to authenticated using (public.is_isth_admin());
create policy "Admins can write activity logs" on public.admin_activity_log for insert to authenticated with check (public.is_isth_admin() and admin_user_id = auth.uid());
```

## Storage bucket and safe uploads

Create a public `product-images` bucket for public reads, then protect writes and deletes using the same function. The frontend rejects executable, HTML, script, archive, unknown, and oversized files before upload; production Storage policies remain the final enforcement layer.

```sql
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
on conflict (id) do nothing;

create policy "Public can read product images"
  on storage.objects for select using (bucket_id = 'product-images');
create policy "Admins can upload product images"
  on storage.objects for insert to authenticated with check (bucket_id = 'product-images' and public.is_isth_admin());
create policy "Admins can replace product images"
  on storage.objects for update to authenticated using (bucket_id = 'product-images' and public.is_isth_admin()) with check (bucket_id = 'product-images' and public.is_isth_admin());
create policy "Admins can delete product images"
  on storage.objects for delete to authenticated using (bucket_id = 'product-images' and public.is_isth_admin());

create policy "Public can read site media"
  on storage.objects for select using (bucket_id = 'site-media');
create policy "Admins can upload site media"
  on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_isth_admin());
create policy "Admins can replace site media"
  on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_isth_admin()) with check (bucket_id = 'site-media' and public.is_isth_admin());
create policy "Admins can delete site media"
  on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_isth_admin());
```

In Supabase Authentication, enable email verification, disable open signups after inviting administrators, set a strong password policy, and enable Supabase MFA for the primary administrator. The frontend uses generic login errors and provides a password-reset path without revealing whether an email exists. Never add a service-role key, database password, or private secret to the GitHub Pages build.

For backup and recovery, schedule Supabase database backups and separately retain product image exports from Storage. GitHub source history is not a database or Storage backup. The public site reads only public products/settings; role data, admin activity logs, and private settings must never be selected by storefront queries.

Replace the example email in the policies with the same allowlist used in `VITE_ADMIN_EMAILS`. In Supabase Authentication, create the authorized admin account and disable open signups if only invited administrators should have access. The site includes Umami page tracking through the environment-provided analytics script; the admin traffic tile stays honest and shows a dash until a server-side analytics read endpoint is connected.
