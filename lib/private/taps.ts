export interface Taps {
  count: number;
  /** Time of the last tap, epoch ms. */
  last: number;
}

/** Counts quick taps; fires on the `need`-th one when no gap exceeds `gap` ms, then starts over. */
export function tap(prev: Taps, now: number, need = 20, gap = 2000): { next: Taps; fire: boolean } {
  const count = prev.count > 0 && now - prev.last <= gap ? prev.count + 1 : 1;
  if (count >= need) return { next: { count: 0, last: now }, fire: true };
  return { next: { count, last: now }, fire: false };
}
