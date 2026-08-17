begin;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
      and role = 'super_admin'
      and is_active is true
  );
$$;

revoke all on function public.is_super_admin() from public;
grant execute on function public.is_super_admin() to authenticated;

create or replace function public.get_my_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select case when public.is_super_admin() then 'super_admin' else null end;
$$;

revoke all on function public.get_my_admin_role() from public;
grant execute on function public.get_my_admin_role() to authenticated;

alter table public.admin_profiles enable row level security;

do $$
declare policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'admin_profiles'
  loop
    execute format('drop policy if exists %I on public.admin_profiles', policy_record.policyname);
  end loop;
end;
$$;

create policy "super admins manage admin profiles"
on public.admin_profiles
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

alter table public.products enable row level security;

do $$
declare policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'products'
  loop
    execute format('drop policy if exists %I on public.products', policy_record.policyname);
  end loop;
end;
$$;

create policy "public can read products"
on public.products
for select
to anon, authenticated
using (true);

create policy "super admins manage products"
on public.products
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

alter table public.site_settings enable row level security;

do $$
declare policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'site_settings'
  loop
    execute format('drop policy if exists %I on public.site_settings', policy_record.policyname);
  end loop;
end;
$$;

create policy "public can read public site settings"
on public.site_settings
for select
to anon, authenticated
using (is_public is true);

create policy "super admins manage site settings"
on public.site_settings
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

commit;
