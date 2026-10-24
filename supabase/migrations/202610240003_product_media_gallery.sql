begin;

alter table public.products
  add column if not exists media jsonb not null default '[]'::jsonb;

create or replace function public.admin_set_product_media(
  product_id text,
  product_media jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
begin
  perform public.require_super_admin();
  if product_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(product_id) > 96
     or jsonb_typeof(product_media) <> 'array'
     or jsonb_array_length(product_media) > 12 then
    raise exception 'invalid product media payload' using errcode = '22023';
  end if;

  for item in select value from jsonb_array_elements(product_media)
  loop
    if item->>'kind' not in ('image', 'video')
       or length(coalesce(item->>'url', '')) = 0
       or length(item->>'url') > 2048
       or (item->>'url') !~ '^(https://|/assets/|/manus-storage/)' then
      raise exception 'invalid product media item' using errcode = '22023';
    end if;
  end loop;

  update public.products
  set media = product_media
  where id = product_id;

  if not found then
    raise exception 'product not found' using errcode = 'P0002';
  end if;

  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'PRODUCT_MEDIA_UPDATE', 'product', product_id, null, jsonb_build_object('media_count', jsonb_array_length(product_media)));
end;
$$;

revoke all on function public.admin_set_product_media(text, jsonb) from public;
grant execute on function public.admin_set_product_media(text, jsonb) to authenticated;

-- Product media lives in the existing public product-images bucket. Keep upload
-- and deletion behind the same super-admin boundary as the other site media.
drop policy if exists "Super admins can upload controlled media" on storage.objects;
create policy "Super admins can upload controlled media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('product-images', 'site-media')
  and public.get_my_admin_role() = 'super_admin'
  and name ~ '^(brand|motion|hero-desktop|hero-mobile|product-images|product-videos)/[0-9a-f-]+\.(jpg|jpeg|png|webp|avif|mp4|webm)$'
);

commit;
