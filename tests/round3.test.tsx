import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ContractNote } from "@/components/ContractNote";
import { cv } from "@/content/cv";
import { LOCALES } from "@/content/types";
import { ui } from "@/content/ui";
import { CONTACT } from "@/lib/contact";
import { contractText } from "@/lib/contract";
import { mainParts } from "@/lib/parts";

describe("main parts of all steps", () => {
  it("lists 8 parts, each counted by the steps that used it", () => {
    const parts = mainParts();
    expect(parts.map((p) => p.id)).toEqual([
      "javascript", "typescript", "react", "nodejs", "aws", "nextjs", "postgresql", "react-native",
    ]);
    for (const p of parts) expect(p.count).toBe(cv.steps.filter((s) => s.uses.includes(p.id)).length);
    expect(parts[0].count).toBe(10);
  });
});

describe("contract note", () => {
  it("bolds the lead and links Deel, but never links ChimpCode", () => {
    for (const l of LOCALES) {
      const html = renderToStaticMarkup(<ContractNote locale={l} />);
      expect(html).toContain(`<b>${ui[l].contract.lead}</b>`);
      expect(html).toContain(`href="${CONTACT.deel}"`);
      expect(html).toContain(">Deel</a>");
      expect(html).not.toContain("cnpja");
      expect(html.match(/<a /g)?.length).toBe(1);
    }
  });

  it("says other platforms are welcome too", () => {
    expect(contractText("en")).toMatch(/any other platform/);
    expect(contractText("en").startsWith("Contract-ready: ")).toBe(true);
    for (const l of LOCALES) expect(contractText(l)).not.toContain("{deel}");
  });
});

describe("copy fixes", () => {
  it("names IPT by its short name only", () => {
    expect(cv.steps[0].company).toBe("IPT");
  });

  it("keeps the youth group generic", () => {
    const all = JSON.stringify(cv);
    expect(all).not.toMatch(/Por[ãa]o/i);
  });

  it("tells Tippou reached almost 1,000 users in under a year", () => {
    const p = cv.projects.find((x) => x.id === "tippou")!;
    expect(p.what.en).toContain("almost 1,000 users");
    expect(p.what.pt).toContain("quase mil");
    expect(p.what.es).toContain("casi mil");
  });
});
