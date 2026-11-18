import { describe, expect, it } from "vitest";
import { SECRETS, findLeaks, toSecret } from "../scripts/leak-patterns";

// Synthetic secrets only: the real ones are stored as salted hashes.
const word = toSecret("word", "acmecorp");
const digits = toSecret("digits", "12345678000199");
const money = toSecret("money", "r$99000");

describe("findLeaks", () => {
  it("flags a secret word in any case, inside joined words and domains", () => {
    expect(findLeaks("worked at AcmeCorp", [word])).toHaveLength(1);
    expect(findLeaks("ACMECORPLABS", [word])).toHaveLength(1);
    expect(findLeaks("me@acmecorp.com", [word])).toHaveLength(1);
  });

  it("flags a secret number written with or without punctuation", () => {
    expect(findLeaks("12.345.678/0001-99", [digits])).toHaveLength(1);
    expect(findLeaks("id 12345678000199", [digits])).toHaveLength(1);
  });

  it("flags a secret amount in its common spellings", () => {
    for (const s of ["R$99K", "R$ 99 k", "R$ 99.000", "r$99 mil"]) {
      expect(findLeaks(s, [money]), s).toHaveLength(1);
    }
  });

  it("flags age phrases without any secret list", () => {
    // Split literals keep this source file itself clean for the scanner.
    expect(findLeaks("he is 99 years" + " old", [])).toHaveLength(1);
    expect(findLeaks("99 anos de" + " idade", [])).toHaveLength(1);
  });

  it("passes clean CV text against the real list", () => {
    expect(findLeaks("Senior Fullstack Developer at CIAL Dun & Bradstreet since 2023")).toEqual([]);
  });

  it("keeps the real list populated", () => {
    expect(SECRETS.length).toBeGreaterThanOrEqual(4);
  });
});
