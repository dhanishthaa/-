-- Close default PUBLIC/anonymous EXECUTE grants on exposed functions.
-- Only authenticated callers can invoke the explicitly granted admin contracts.

begin;

revoke execute on all functions in schema public from public, anon;
alter default privileges in schema public revoke execute on functions from public;

grant execute on function public.get_my_admin_role() to authenticated;
grant execute on function public.admin_upsert_product(text, text, text, text, text, text, text, text, boolean) to authenticated;
grant execute on function public.admin_delete_product(text) to authenticated;
grant execute on function public.admin_set_site_setting(text, text) to authenticated;

commit;
