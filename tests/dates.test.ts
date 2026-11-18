import { describe, expect, it } from "vitest";
import {
  formatDuration,
  formatRange,
  inclusiveMonths,
  monthSet,
  yearsOfExperience,
} from "@/lib/dates";

const d = (s: string) => new Date(`${s}T12:00:00Z`);

describe("inclusiveMonths", () => {
  it("counts both end months", () => {
    expect(inclusiveMonths("2021-03", "2022-08", d("2026-11-18"))).toBe(18);
  });
  it("counts 'now' up to the current month", () => {
    expect(inclusiveMonths("2023-03", "now", d("2026-11-18"))).toBe(45);
  });
});

describe("monthSet", () => {
  it("lists every month index in the range", () => {
    expect(monthSet("2020-11", "2021-02", d("2026-11-18")).size).toBe(4);
  });
});

describe("yearsOfExperience", () => {
  it("counts whole years from March 2013", () => {
    expect(yearsOfExperience(d("2026-11-18"))).toBe(13);
  });
  it("does not round up in February", () => {
    expect(yearsOfExperience(d("2027-02-28"))).toBe(13);
  });
  it("adds a year in March", () => {
    expect(yearsOfExperience(d("2027-03-01"))).toBe(14);
  });
});

describe("formatDuration", () => {
  it("formats years and months per locale", () => {
    expect(formatDuration(18, "en")).toBe("1 yr 6 mos");
    expect(formatDuration(18, "pt")).toBe("1 ano 6 meses");
    expect(formatDuration(13, "es")).toBe("1 año 1 mes");
    expect(formatDuration(4, "en")).toBe("4 mos");
    expect(formatDuration(24, "en")).toBe("2 yrs");
    expect(formatDuration(1, "pt")).toBe("1 mês");
  });
});

describe("formatRange", () => {
  it("formats month ranges per locale", () => {
    expect(formatRange("2021-03", "2022-08", "en")).toBe("Mar 2021 – Aug 2022");
    expect(formatRange("2021-03", "2022-08", "pt")).toBe("mar 2021 – ago 2022");
    expect(formatRange("2019-07", "2020-04", "es")).toBe("jul 2019 – abr 2020");
  });
  it("names the open end", () => {
    expect(formatRange("2023-03", "now", "en")).toBe("Mar 2023 – now");
    expect(formatRange("2023-03", "now", "pt")).toBe("mar 2023 – atual");
    expect(formatRange("2023-03", "now", "es")).toBe("mar 2023 – actual");
  });
});
