# Project TODO

- [x] Add bottom breathing space to the Admin login card and a password visibility toggle.
- [ ] Verify the affected Supabase Auth record, matching admin_profiles row, and get_my_admin_role result while retaining generic public error copy.
- [x] Audit whether GitHub Pages builds receive valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.
- [x] Correct the client-side Forgot Password redirect flow for https://isth.in and report a rejected reset request honestly.
- [ ] Confirm the Supabase Dashboard allows https://isth.in/isth/frag/minda as a redirect URL and request a reset email with the intended account.
- [x] Correct the reversed password visibility icon/state in the Admin login form.
- [ ] Capture the intended account's private Supabase sign-in and get_my_admin_role failure result to identify the exact rejection condition.
- [x] Rebalance landing and Home hero composition for the 1366×768 desktop viewport without regressing tablet or mobile layouts.
- [ ] Deploy the missing get_my_admin_role RPC function in Supabase project nhdjqitrvyblhmbpgkax and verify it returns a super-admin role for the intended account.
- [x] Adjust the short-desktop Home hero image focal crop so both models' faces remain fully visible.
- [x] Visually verify at 1366×604 that both Home hero model faces remain fully inside the viewport.
