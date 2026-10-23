begin;

-- Keep edits to legacy catalogue rows working even when their description was
-- historically empty. A name or notes change must not be rejected because of
-- an unrelated optional field.
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
declare
  normalized_description text := coalesce(nullif(btrim(description), ''), 'A considered composition from the isth scent library.');
begin
  perform public.require_super_admin();
  if id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(id) > 96
     or length(name) not between 1 and 80
     or length(notes) not between 1 and 160
     or length(normalized_description) not between 1 and 500
     or length(collection) not between 1 and 40
     or length(size) not between 1 and 32
     or color !~ '^#[0-9A-Fa-f]{6}$'
     or (image_url is not null and image_url !~ '^(https://|/assets/|/manus-storage/)') then
    raise exception 'invalid product payload' using errcode = '22023';
  end if;

  insert into public.products (id, name, notes, description, collection, image_url, color, size, featured)
  values (id, name, notes, normalized_description, collection, image_url, color, size, featured)
  on conflict (id) do update set
    name = excluded.name, notes = excluded.notes, description = excluded.description,
    collection = excluded.collection, image_url = excluded.image_url, color = excluded.color,
    size = excluded.size, featured = excluded.featured;

  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'PRODUCT_UPSERT', 'product', id, null, jsonb_build_object('id', id));
end;
$$;

revoke all on function public.admin_upsert_product(text, text, text, text, text, text, text, text, boolean) from public;
grant execute on function public.admin_upsert_product(text, text, text, text, text, text, text, text, boolean) to authenticated;

commit;
