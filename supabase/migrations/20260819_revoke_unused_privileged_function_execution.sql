-- The storefront uses get_my_admin_role plus the validated Admin mutation RPCs.
-- These legacy helpers do not need direct execution through the exposed API.

begin;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.is_isth_admin() from public, anon, authenticated;
revoke all on function public.next_invoice_number() from public, anon, authenticated;
revoke all on function public.require_super_admin() from public, anon, authenticated;

commit;
