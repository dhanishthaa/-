import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("production server hardening", () => {
  it("uses Express 5-compatible SPA routing and emits defensive security headers", () => {
    const server = readFileSync("server/index.ts", "utf8");

    expect(server).toContain('app.get("/{*splat}"');
    expect(server).toContain('app.disable("x-powered-by")');
    expect(server).toContain('"Content-Security-Policy"');
    expect(server).toContain('"X-Content-Type-Options", "nosniff"');
    expect(server).toContain('"X-Frame-Options", "DENY"');
    expect(server).toContain('"Referrer-Policy", "strict-origin-when-cross-origin"');
  });
});
