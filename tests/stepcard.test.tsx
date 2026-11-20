import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StepCard } from "@/components/StepCard";
import { cv } from "@/content/cv";
import { BRICK_HEX } from "@/content/types";

describe("StepCard", () => {
  it("renders one step with its id, company and role", () => {
    const tower = cv.steps.map((s) => ({ n: s.n, color: BRICK_HEX[s.brick] }));
    const html = renderToStaticMarkup(<StepCard step={cv.steps[0]} locale="en" today={new Date("2026-11-20")} tower={tower} />);
    expect(html).toContain('id="step-1"');
    expect(html).toContain("IPT");
    expect(html).toContain("Trainee Researcher");
  });
});
