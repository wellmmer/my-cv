import { createServer } from "node:net";
import { describe, expect, it } from "vitest";
import { portInUse, publicPdfProblems } from "../scripts/pdf-guard";

const terms = { words: ["acmecorp"], digits: [], money: [] };

describe("portInUse", () => {
  it("sees a listening port as taken and a closed one as free", async () => {
    const server = createServer();
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    const port = (server.address() as { port: number }).port;
    expect(await portInUse(port)).toBe(true);
    await new Promise<void>((r) => server.close(() => r()));
    expect(await portInUse(port)).toBe(false);
  });
});

describe("publicPdfProblems", () => {
  it("passes clean public text", () => {
    expect(publicPdfProblems("Wellmmer Lucas, CIAL Dun & Bradstreet", ["Example Co"], terms)).toEqual([]);
  });
  it("flags a private step's company", () => {
    expect(publicPdfProblems("Senior Engineer, Example Co", ["Example Co"], terms)).toEqual(["private step: Example Co"]);
  });
  it("flags secret terms", () => {
    expect(publicPdfProblems("worked at AcmeCorp", [], terms)).toEqual(["term 1"]);
  });
});
