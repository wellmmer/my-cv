import { monthSet, type End, type YearMonth } from "@/lib/dates";

type Span = { start: YearMonth; end: End; uses: readonly string[] };

/** Months each skill was used, counting overlapping steps once. */
export function skillMonths(steps: readonly Span[], today: Date): Map<string, number> {
  const sets = new Map<string, Set<number>>();
  for (const s of steps) {
    const months = monthSet(s.start, s.end, today);
    for (const skill of s.uses) {
      const set = sets.get(skill) ?? new Set<number>();
      months.forEach((m) => set.add(m));
      sets.set(skill, set);
    }
  }
  return new Map([...sets].map(([k, v]) => [k, v.size]));
}

export function skillYears(months: number): number {
  return Math.max(1, Math.round(months / 12));
}

/** Per step (oldest first), the skills no earlier step used. */
export function newParts(steps: readonly { uses: readonly string[] }[]): string[][] {
  const seen = new Set<string>();
  return steps.map((s) => {
    const fresh = s.uses.filter((u) => !seen.has(u));
    s.uses.forEach((u) => seen.add(u));
    return fresh;
  });
}
