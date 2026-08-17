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
});
