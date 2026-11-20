import { describe, expect, it } from "vitest";
import { tap, type Taps } from "@/lib/private/taps";

function run(times: number[]): { fired: number[]; last: Taps } {
  let s: Taps = { count: 0, last: 0 };
  const fired: number[] = [];
  times.forEach((t, i) => {
    const r = tap(s, t);
    s = r.next;
    if (r.fire) fired.push(i + 1);
  });
  return { fired, last: s };
}

describe("tap counter", () => {
  it("fires on the 20th quick tap, not before", () => {
    expect(run(Array.from({ length: 19 }, (_, i) => 1000 + i * 100)).fired).toEqual([]);
    const r = run(Array.from({ length: 20 }, (_, i) => 1000 + i * 100));
    expect(r.fired).toEqual([20]);
    expect(r.last.count).toBe(0);
  });

  it("restarts the count after a pause longer than 2 s", () => {
    const first = Array.from({ length: 10 }, (_, i) => 1000 + i * 100);
    const after = Array.from({ length: 19 }, (_, i) => 1900 + 2001 + i * 100);
    expect(run([...first, ...after]).fired).toEqual([]);
  });
});
