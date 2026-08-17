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

  it("registers limited context-menu and common developer-shortcut deterrents", () => {
    const motionRoot = source("client/src/components/MotionRoot.tsx");

    expect(motionRoot).toContain('document.addEventListener("contextmenu"');
    expect(motionRoot).toContain('event.key === "F12"');
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
    expect(css).toContain('.password-visibility');
    expect(css).toContain('padding:34px 0 76px');
  });
});
