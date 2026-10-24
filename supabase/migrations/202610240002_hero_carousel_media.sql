begin;

-- Public hero carousel configuration. The value is JSON containing desktop/mobile
-- slide arrays and an autoplay interval in milliseconds.
create or replace function public.admin_set_site_setting(setting_key text, setting_value text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_super_admin();
  if setting_key not in ('logo_url', 'motion_video_url', 'hero_carousel')
     or length(setting_value) > 200000
     or (setting_key <> 'hero_carousel' and setting_value <> '' and setting_value !~ '^(https://|/assets/|/manus-storage/)')
     or (setting_key = 'hero_carousel' and setting_value !~ '^\{') then
    raise exception 'invalid setting payload' using errcode = '22023';
  end if;
  insert into public.site_settings (key, value, is_public, updated_at)
  values (setting_key, jsonb_build_object('value', setting_value), true, now())
  on conflict (key) do update set value = excluded.value, is_public = true, updated_at = now();
  insert into public.admin_activity_log (admin_user_id, action, entity_type, entity_id, old_value, new_value)
  values (auth.uid(), 'SETTING_UPDATE', 'site_setting', setting_key, null, jsonb_build_object('value', setting_value));
end;
$$;

revoke all on function public.admin_set_site_setting(text, text) from public;
grant execute on function public.admin_set_site_setting(text, text) to authenticated;

drop policy if exists "Super admins can upload controlled media" on storage.objects;
create policy "Super admins can upload controlled media"
on storage.objects for insert to authenticated
with check (
  bucket_id in ('product-images', 'site-media')
  and public.get_my_admin_role() = 'super_admin'
  and name ~ '^(brand|motion|hero-desktop|hero-mobile)/[0-9a-f-]+\.(jpg|jpeg|png|webp|avif|mp4|webm)$'
);

commit;
