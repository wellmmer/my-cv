import { describe, expect, it } from "vitest";
import { ui } from "@/content/ui";
import { LOCALES } from "@/content/types";
import { cvPdfPath } from "@/lib/contact";
import { findLeaks } from "../scripts/leak-patterns";
import { pdfText } from "../scripts/pdf-text";

describe("public PDFs", () => {
  for (const locale of LOCALES) {
    for (const kind of ["designed", "ats"] as const) {
      const file = `public${cvPdfPath(locale, kind)}`;
      it(`${file} is a clean CV of at most 2 pages`, async () => {
        const { text, pages } = await pdfText(file);
        expect(pages).toBeLessThanOrEqual(2);
        expect(text).toContain("Wellmmer Lucas");
        expect(text.toLowerCase()).toContain(ui[locale].atsSections.experience.toLowerCase());
        expect(text).toContain("wellmmer@gmail.com");
        expect(findLeaks(text)).toEqual([]);
      });
    }
  }
});
