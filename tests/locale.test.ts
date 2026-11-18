import { describe, expect, it } from "vitest";
import { isLocale, pickLocale } from "@/lib/locale";

describe("pickLocale", () => {
  it("matches by primary language tag", () => {
    expect(pickLocale("pt-BR,pt;q=0.9,en;q=0.8")).toBe("pt");
    expect(pickLocale("es-AR")).toBe("es");
  });
  it("skips unsupported languages and honours q-values", () => {
    expect(pickLocale("de-DE,es;q=0.5,en;q=0.4")).toBe("es");
    expect(pickLocale("en;q=0.1,pt;q=0.9")).toBe("pt");
  });
  it("keeps header order on equal q-values", () => {
    expect(pickLocale("es,pt")).toBe("es");
  });
  it("falls back to English for anything else", () => {
    expect(pickLocale("fr")).toBe("en");
    expect(pickLocale("*")).toBe("en");
    expect(pickLocale("")).toBe("en");
    expect(pickLocale(null)).toBe("en");
    expect(pickLocale(";;q=,,garbage")).toBe("en");
    expect(pickLocale("pt;q=0")).toBe("en");
  });
});

describe("isLocale", () => {
  it("accepts only the three locales", () => {
    expect(isLocale("pt")).toBe(true);
    expect(isLocale("PT")).toBe(false);
    expect(isLocale("fr")).toBe(false);
  });
});
