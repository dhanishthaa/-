import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const indexDocument = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const routeBootstrap = readFileSync(new URL("../public/isth-route-bootstrap.js", import.meta.url), "utf8");

describe("static-host security policy", () => {
  it("declares a restrictive Content Security Policy compatible with Supabase and required assets", () => {
    expect(indexDocument).toContain('http-equiv="Content-Security-Policy"');
    expect(indexDocument).toContain("default-src 'self'");
    expect(indexDocument).toContain("script-src 'self'");
    expect(indexDocument).toContain("object-src 'none'");
    expect(indexDocument).toContain("base-uri 'self'");
    expect(indexDocument).toContain("connect-src 'self' https://nhdjqitrvyblhmbpgkax.supabase.co");
    expect(indexDocument).toContain("style-src 'self' 'unsafe-inline' https://fonts.cdnfonts.com");
    expect(indexDocument).not.toContain("script-src 'self' 'unsafe-inline'");
  });

  it("keeps the landing route bootstrap and its initial paint styles in same-origin assets", () => {
    expect(indexDocument).toContain('href="/isth-boot.css"');
    expect(indexDocument).toContain('src="/isth-route-bootstrap.js"');
    expect(indexDocument).not.toMatch(/<script>\s*\(function/);
    expect(routeBootstrap).toContain("window.history.replaceState");
    expect(routeBootstrap).toContain("isth-landing-boot");
  });

  it("uses the requested isth - Parfums browser-tab title", () => {
    expect(indexDocument).toContain("<title>isth - Parfums</title>");
    expect(indexDocument).not.toContain("<title>isth - Fragrances</title>");
  });
});
