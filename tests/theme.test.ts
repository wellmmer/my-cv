import { describe, expect, it } from "vitest";
import { THEME_KEY, THEME_SCRIPT, parseTheme } from "@/lib/theme";

describe("theme", () => {
  it("accepts only light and dark", () => {
    expect(parseTheme("dark")).toBe("dark");
    expect(parseTheme("light")).toBe("light");
    expect(parseTheme("purple")).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
  });
  it("ships a boot script that reads the stored choice safely", () => {
    expect(THEME_KEY).toBe("theme");
    expect(THEME_SCRIPT).toContain("try");
    expect(THEME_SCRIPT).toContain(JSON.stringify(THEME_KEY));
  });
});
