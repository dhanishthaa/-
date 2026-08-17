import { describe, expect, it } from "vitest";
import { isSuperAdminRole, isValidSupabaseConfig } from "./supabase";

describe("isSuperAdminRole", () => {
  it("accepts only the explicitly elevated role", () => {
    expect(isSuperAdminRole("super_admin")).toBe(true);
    expect(isSuperAdminRole("admin")).toBe(false);
    expect(isSuperAdminRole("user")).toBe(false);
    expect(isSuperAdminRole(null)).toBe(false);
  });
});

describe("isValidSupabaseConfig", () => {
  it("accepts a valid browser-safe Supabase configuration", () => {
    expect(isValidSupabaseConfig("https://example.supabase.co", "public-anon-key")).toBe(true);
  });

  it("fails closed for missing, malformed, and unresolved GitHub placeholder values", () => {
    expect(isValidSupabaseConfig(undefined, undefined)).toBe(false);
    expect(isValidSupabaseConfig("%VITE_SUPABASE_URL%", "%VITE_SUPABASE_ANON_KEY%")).toBe(false);
    expect(isValidSupabaseConfig("not-a-url", "public-anon-key")).toBe(false);
  });
});
