import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// Zotero's Extension.sys.mjs rejects the XPI as "incompatible" unless
// applications.zotero has id, update_url and strict_max_version.
describe("addon/manifest.json", () => {
  const manifest = JSON.parse(readFileSync("addon/manifest.json", "utf-8"));
  const zotero = manifest.applications?.zotero ?? {};

  it("declares the fields Zotero requires", () => {
    expect(zotero.id).toBeTruthy();
    expect(zotero.update_url).toBeTruthy();
    expect(zotero.strict_min_version).toBeTruthy();
    expect(zotero.strict_max_version).toBeTruthy();
  });
});
