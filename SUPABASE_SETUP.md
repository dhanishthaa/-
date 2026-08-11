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

Replace the example email in the policies with the same allowlist used in `VITE_ADMIN_EMAILS`. In Supabase Authentication, create the authorized admin account and disable open signups if only invited administrators should have access. The site includes Umami page tracking through the environment-provided analytics script; the admin traffic tile stays honest and shows a dash until a server-side analytics read endpoint is connected.
