import { describe, expect, it } from "vitest";
import { cvPdfPath, mailtoUrl, whatsappUrl } from "@/lib/contact";

describe("contact links", () => {
  it("pre-fills WhatsApp in the page language", () => {
    expect(whatsappUrl("en")).toBe(
      "https://wa.me/5511987420114?text=" +
        encodeURIComponent("Hi Wellmmer, I saw your CV and would like to talk about a role."),
    );
  });
  it("sets the email subject in the page language", () => {
    expect(mailtoUrl("pt")).toBe("mailto:wellmmer@gmail.com?subject=" + encodeURIComponent("Vaga para Wellmmer Lucas"));
  });
  it("names the PDF files by kind and locale", () => {
    expect(cvPdfPath("es", "ats")).toBe("/cv/Wellmmer-Lucas-CV-ATS-ES.pdf");
    expect(cvPdfPath("en", "designed")).toBe("/cv/Wellmmer-Lucas-CV-EN.pdf");
  });
});
