import { describe, expect, it } from "vitest";
import { isSuperAdminRole } from "./supabase";

describe("isSuperAdminRole", () => {
  it("accepts only the explicitly elevated role", () => {
    expect(isSuperAdminRole("super_admin")).toBe(true);
    expect(isSuperAdminRole("admin")).toBe(false);
    expect(isSuperAdminRole("user")).toBe(false);
    expect(isSuperAdminRole(null)).toBe(false);
  });
});
