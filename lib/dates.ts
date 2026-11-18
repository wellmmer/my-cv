import type { Locale } from "@/content/types";

/** A month as `YYYY-MM`. */
export type YearMonth = `${number}-${string}`;
export type End = YearMonth | "now";

/** First month of Wellmmer's career; every year count starts here. */
export const CAREER_START: YearMonth = "2013-03";

function index(ym: YearMonth): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function endIndex(end: End, today: Date): number {
  return end === "now" ? today.getUTCFullYear() * 12 + today.getUTCMonth() : index(end);
}

/** Months from start to end, counting both end months. */
export function inclusiveMonths(start: YearMonth, end: End, today: Date): number {
  return endIndex(end, today) - index(start) + 1;
}

/** Month indexes (`year * 12 + month - 1`) covered by a range. */
export function monthSet(start: YearMonth, end: End, today: Date): Set<number> {
  const out = new Set<number>();
  for (let i = index(start); i <= endIndex(end, today); i++) out.add(i);
  return out;
}

/** Whole years elapsed since March 2013 (the current month is not yet complete). */
export function yearsOfExperience(today: Date): number {
  return Math.floor((inclusiveMonths(CAREER_START, "now", today) - 1) / 12);
}

const UNITS: Record<Locale, { y: [string, string]; m: [string, string] }> = {
  en: { y: ["yr", "yrs"], m: ["mo", "mos"] },
  pt: { y: ["ano", "anos"], m: ["mês", "meses"] },
  es: { y: ["año", "años"], m: ["mes", "meses"] },
};

export function formatDuration(months: number, locale: Locale): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const u = UNITS[locale];
  const parts: string[] = [];
  if (y) parts.push(`${y} ${u.y[y === 1 ? 0 : 1]}`);
  if (m || !y) parts.push(`${m} ${u.m[m === 1 ? 0 : 1]}`);
  return parts.join(" ");
}

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  pt: ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"],
  es: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
};

const NOW: Record<Locale, string> = { en: "now", pt: "atual", es: "actual" };

function formatMonth(ym: YearMonth, locale: Locale): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[locale][m - 1]} ${y}`;
}

export function formatRange(start: YearMonth, end: End, locale: Locale): string {
  const to = end === "now" ? NOW[locale] : formatMonth(end, locale);
  return `${formatMonth(start, locale)} – ${to}`;
}
