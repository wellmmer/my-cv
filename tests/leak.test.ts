import { describe, expect, it } from "vitest";
import { findLeaks, loadTerms, type LeakTerms } from "../scripts/leak-patterns";

// Synthetic terms only. The real terms live outside git (a gitignored local file
// or the LEAK_TERMS CI secret) and are never written into a tracked file.
const terms: LeakTerms = { words: ["acmecorp"], digits: ["12345678000199"], money: ["99000"] };

describe("findLeaks", () => {
  it("flags a secret word in any case, inside joined words and domains", () => {
    expect(findLeaks("worked at AcmeCorp", terms)).toHaveLength(1);
    expect(findLeaks("ACMECORPLABS", terms)).toHaveLength(1);
    expect(findLeaks("me@acmecorp.com", terms)).toHaveLength(1);
  });

  it("flags a secret word split by a space or hyphen", () => {
    expect(findLeaks("Acme Corp", terms)).toHaveLength(1);
    expect(findLeaks("acme-corp", terms)).toHaveLength(1);
  });

  it("flags a secret number with or without punctuation", () => {
    expect(findLeaks("12.345.678/0001-99", terms)).toHaveLength(1);
    expect(findLeaks("id 12345678000199", terms)).toHaveLength(1);
  });

  it("flags a secret number glued to another number", () => {
    expect(findLeaks("2026 12.345.678/0001-99", terms)).toHaveLength(1);
    expect(findLeaks("+55 11 9999-0000 12345678000199", terms)).toHaveLength(1);
  });

  it("flags a secret amount in its common spellings", () => {
    for (const s of ["R$99K", "R$ 99 k", "R$ 99.000", "r$99 mil", "R$99.000,00", "99k BRL", "BRL 99k", "BRL 99.000"]) {
      expect(findLeaks(s, terms), s).toHaveLength(1);
    }
  });

  it("does not flag other amounts", () => {
    expect(findLeaks("R$ 9.900", terms)).toEqual([]);
    expect(findLeaks("R$990k", terms)).toEqual([]);
  });

  it("flags age phrases without any terms", () => {
    // Split literals keep this source file itself clean for the scanner.
    expect(findLeaks("he is 99 years" + " old", { words: [], digits: [], money: [] })).toHaveLength(1);
    expect(findLeaks("99 anos de" + " idade", { words: [], digits: [], money: [] })).toHaveLength(1);
  });

  it("passes clean CV text", () => {
    expect(findLeaks("Senior Fullstack Developer at CIAL Dun & Bradstreet since 2023", terms)).toEqual([]);
  });
});

describe("loadTerms", () => {
  it("reads terms from the LEAK_TERMS environment variable", () => {
    expect(loadTerms({ LEAK_TERMS: JSON.stringify(terms) }, "nope.json")).toEqual(terms);
  });

  it("fails closed when no terms are available", () => {
    expect(() => loadTerms({}, "nope.json")).toThrow(/no leak terms/);
  });

  it("allows an explicit empty run", () => {
    expect(loadTerms({ LEAK_ALLOW_EMPTY: "1" }, "nope.json")).toEqual({ words: [], digits: [], money: [] });
  });

  it("rejects malformed terms", () => {
    expect(() => loadTerms({ LEAK_TERMS: '{"words":"x"}' }, "nope.json")).toThrow(/invalid/);
  });
});
