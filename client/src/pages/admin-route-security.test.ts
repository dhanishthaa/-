import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = (path: string) => readFileSync(path, "utf8");

describe("private Admin route", () => {
  it("uses the requested private path and removes the former public Admin route", () => {
    const app = source("client/src/App.tsx");
    const admin = source("client/src/pages/Admin.tsx");

    expect(app).toContain('path="/isth/frag/minda"');
    expect(app).not.toContain('path="/admin"');
    expect(admin).toContain("/isth/frag/minda");
  });

  it("does not rely on client-side DevTools or context-menu blocking as a security control", () => {
    const motionRoot = source("client/src/components/MotionRoot.tsx");

    expect(motionRoot).not.toContain('document.addEventListener("contextmenu"');
    expect(motionRoot).not.toContain('event.key === "F12"');
  });

  it("builds root-absolute assets so the private nested route can load on isth.in", () => {
    const viteConfig = source("vite.config.ts");

    expect(viteConfig).toContain('base: "/"');
  });

  it("does not disclose infrastructure details from the Admin sign-in screen", () => {
    const admin = source("client/src/pages/Admin.tsx");

    expect(admin).toContain("Invalid username or password.");
    expect(admin).not.toContain("Admin access is unavailable until Supabase is configured");
    expect(admin).not.toContain("Admin access is locked until Supabase build variables are configured");
    expect(admin).not.toContain("This account is not authorised for the isth admin panel.");
    expect(admin).toContain('if (!session?.user.email || !session.user.email_confirmed_at) {');
    expect(admin).toContain('setMessage("Invalid username or password.")');
  });

  it("keeps the password private by default while exposing an accessible visibility toggle", () => {
    const admin = source("client/src/pages/Admin.tsx");
    const css = source("client/src/index.css");

    expect(admin).toContain('const [showPassword, setShowPassword] = useState(false)');
    expect(admin).toContain('aria-label={showPassword ? "Hide password" : "Show password"}');
    expect(admin).toContain('{showPassword ? <Eye size={17} /> : <EyeOff size={17} />}');
    expect(css).toContain('.password-visibility');
    expect(css).toContain('padding:34px 0 76px');
  });

  it("uses the live private Admin route for reset emails and does not falsely report an API failure as a sent email", () => {
    const admin = source("client/src/pages/Admin.tsx");

    expect(admin).toContain('new URL("/isth/frag/minda", window.location.origin).toString()');
    expect(admin).toContain('const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });');
    expect(admin).toContain('if (error) return setMessage("Unable to send a reset email. Please try again.");');
    expect(admin).toContain('minLength={6}');
  });

  it("wires every visible Admin workspace action to a functional navigation or storefront action", () => {
    const admin = source("client/src/pages/Admin.tsx");

    expect(admin).toContain('const [workspaceView, setWorkspaceView] = useState<WorkspaceView>("overview")');
    expect(admin).toContain('activateWorkspace("overview")');
    expect(admin).toContain('activateWorkspace("products")');
    expect(admin).toContain('activateWorkspace("media")');
    expect(admin).toContain('target?.scrollIntoView({ behavior: "smooth", block: "start" })');
    expect(admin).toContain('window.open("/home", "_blank", "noopener,noreferrer")');
    expect(admin).toContain('ref={productsRef}');
    expect(admin).toContain('ref={mediaRef}');
  });

  it("uses the secured Supabase RPC publishing path and never treats browser storage as product authority", () => {
    const admin = source("client/src/pages/Admin.tsx");
    const supabase = source("client/src/lib/supabase.ts");

    expect(admin).not.toContain("writeLocalProducts");
    expect(admin).not.toContain("readLocalProducts");
    expect(admin).not.toContain("Saved locally");
    expect(supabase).toContain('persistSession: false');
    expect(supabase).toContain('supabase.rpc("admin_upsert_product", payload)');
    expect(supabase).toContain('supabase.rpc("admin_delete_product", { product_id: id })');
    expect(supabase).toContain('supabase.rpc("admin_set_site_setting"');
  });
});
