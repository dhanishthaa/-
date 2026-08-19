-- Applied through the Supabase management connection on 2026-08-19.
-- Supabase RLS/RPC is the enforced authorization boundary for all Admin mutations.

begin;

alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_activity_log enable row level security;

-- Preserve public reads but remove direct browser table writes. All admin writes use validated RPC below.
drop policy if exists "Authorized admin can delete products" on public.products;
drop policy if exists "Authorized admin can insert products" on public.products;
drop policy if exists "Authorized admin can update products" on public.products;
drop policy if exists "Admins can manage settings" on public.site_settings;
drop policy if exists "Admins can write activity logs" on public.admin_activity_log;
drop policy if exists "Admins can read activity logs" on public.admin_activity_log;

revoke insert, update, delete on public.products from anon, authenticated;
revoke insert, update, delete on public.site_settings from anon, authenticated;
revoke insert, update, delete on public.admin_activity_log from anon, authenticated;
grant select on public.products, public.site_settings to anon, authenticated;

create policy "Super admins can read activity logs"
on public.admin_activity_log for select to authenticated
using (public.get_my_admin_role() = 'super_admin');

create or replace function public.require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or public.get_my_admin_role() <> 'super_admin' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.admin_upsert_product(
  id text,
  name text,
  notes text,
  description text,
  collection text,
  image_url text,
  color text,
  size text,
  featured boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();
  if id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(id) > 96
     or length(name) not between 1 and 80
     or length(notes) not between 1 and 160
     or length(description) not between 1 and 500
     or length(collection) not between 1 and 40
     or length(size) not between 1 and 32
     or color !~ '^#[0-9A-Fa-f]{6}$'
     or (image_url is not null and image_url !~ '^(https://|/assets/|/manus-storage/)') then
    raise exception 'invalid product payload' using errcode = '22023';
  end if;

  insert into public.products (id, name, notes, description, collection, image_url, color, size, featured)
  values (id, name, notes, description, collection, image_url, color, size, featured)
  on conflict (id) do update set
    name = excluded.name, notes = excluded.notes, description = excluded.description,
    collection = excluded.collection, image_url = excluded.image_url, color = excluded.color,
    size = excluded.size, featured = excluded.featured;

  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'PRODUCT_UPSERT', 'product', id, null, jsonb_build_object('id', id));
end;
$$;

create or replace function public.admin_delete_product(product_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();
  if product_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(product_id) > 96 then
    raise exception 'invalid product identifier' using errcode = '22023';
  end if;
  delete from public.products where id = product_id;
  if not found then raise exception 'product not found' using errcode = 'P0002'; end if;
  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'PRODUCT_DELETE', 'product', product_id, null, null);
end;
$$;

create or replace function public.admin_set_site_setting(setting_key text, setting_value text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();
  if setting_key not in ('logo_url', 'motion_video_url')
     or length(setting_value) > 2048
     or (setting_value <> '' and setting_value !~ '^(https://|/assets/|/manus-storage/)') then
    raise exception 'invalid setting payload' using errcode = '22023';
  end if;
  insert into public.site_settings (key, value, is_public, updated_at)
  values (setting_key, jsonb_build_object('value', setting_value), true, now())
  on conflict (key) do update set value = excluded.value, is_public = true, updated_at = now();
  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'SETTING_UPDATE', 'site_setting', setting_key, null, jsonb_build_object('value', setting_value));
end;
$$;

revoke all on function public.require_super_admin() from public;
revoke all on function public.admin_upsert_product(text, text, text, text, text, text, text, text, boolean) from public;
revoke all on function public.admin_delete_product(text) from public;
revoke all on function public.admin_set_site_setting(text, text) from public;
grant execute on function public.admin_upsert_product(text, text, text, text, text, text, text, text, boolean) to authenticated;
grant execute on function public.admin_delete_product(text) to authenticated;
grant execute on function public.admin_set_site_setting(text, text) to authenticated;

-- Existing storage policies allowed all admins. Replace them with super-admin-only media management.
drop policy if exists "Admins can delete product images" on storage.objects;
drop policy if exists "Admins can delete site media" on storage.objects;
drop policy if exists "Admins can replace product images" on storage.objects;
drop policy if exists "Admins can replace site media" on storage.objects;
drop policy if exists "Admins can upload product images" on storage.objects;
drop policy if exists "Admins can upload site media" on storage.objects;

create policy "Super admins can upload controlled media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('product-images', 'site-media')
  and public.get_my_admin_role() = 'super_admin'
  and name ~ '^(brand|motion)/[0-9a-f-]+\.(jpg|jpeg|png|webp|avif|mp4|webm)$'
);
create policy "Super admins can replace controlled media"
on storage.objects for update to authenticated
using (bucket_id in ('product-images', 'site-media') and public.get_my_admin_role() = 'super_admin')
with check (bucket_id in ('product-images', 'site-media') and public.get_my_admin_role() = 'super_admin');
create policy "Super admins can delete controlled media"
on storage.objects for delete to authenticated
using (bucket_id in ('product-images', 'site-media') and public.get_my_admin_role() = 'super_admin');

commit;
