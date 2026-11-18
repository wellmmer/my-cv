import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BrickButton } from "@/components/brick/BrickButton";
import { BrickCard } from "@/components/brick/BrickCard";
import { Flag } from "@/components/Flag";
import { ICON_NAMES, Icon } from "@/components/icons";

describe("primitives", () => {
  it("renders every icon as a hidden svg", () => {
    expect(ICON_NAMES.length).toBe(16);
    for (const name of ICON_NAMES) {
      const html = renderToStaticMarkup(<Icon name={name} />);
      expect(html, name).toMatch(/^<svg[^>]*aria-hidden="true"/);
      expect(html, name).toMatch(/<(path|rect|circle|polyline|line|ellipse)/);
    }
  });

  it("renders the three flags", () => {
    for (const code of ["br", "us", "es"] as const) {
      expect(renderToStaticMarkup(<Flag code={code} />)).toMatch(/^<svg[^>]*aria-hidden="true"/);
    }
  });

  it("renders a brick card with its colour and children", () => {
    const html = renderToStaticMarkup(
      <BrickCard color="blue" as="li">
        <p>hi</p>
      </BrickCard>,
    );
    expect(html).toMatch(/^<li[^>]*data-color="blue"/);
    expect(html).toContain("<p>hi</p>");
  });

  it("puts the icon before the label on a brand button", () => {
    const html = renderToStaticMarkup(
      <BrickButton href="https://wa.me/1" variant="whatsapp" icon="whatsapp" external>
        WhatsApp
      </BrickButton>,
    );
    expect(html).toContain('data-variant="whatsapp"');
    expect(html.indexOf("<svg", html.indexOf("<span"))).toBeLessThan(html.indexOf("WhatsApp"));
  });
});
