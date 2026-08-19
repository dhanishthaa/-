-- Cover the activity-log foreign key identified by the Supabase performance advisor.
create index if not exists admin_activity_log_admin_user_id_created_at_idx
on public.admin_activity_log (admin_user_id, created_at desc);
