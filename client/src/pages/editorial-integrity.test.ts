import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readProjectFile = (path: string) => readFileSync(path, "utf8");

describe("isth editorial page integrity", () => {
  it("keeps the Home page editorial scope and protected product section copy", () => {
    const home = readProjectFile("client/src/pages/Home.tsx");

    expect(home).toContain('className="site-shell editorial-home"');
    expect(home).toContain("Find your");
    expect(home).toContain("Not a perfume");
    expect(home).toContain("Coming soon");
    expect(home).toContain("Between the");
  });

  it("keeps the standalone About page routeable with its original editorial copy", () => {
    const about = readProjectFile("client/src/pages/About.tsx");

    expect(about).toContain('className="site-shell about-editorial');
    expect(about).toContain("Between the familiar");
    expect(about).toContain("Philosophy of the Scent");
    expect(about).toContain("Craft &amp; Composition");
    expect(about).toContain('href="/home#collection"');
  });
});
