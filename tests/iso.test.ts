import { describe, expect, it } from "vitest";
import { BRICK, LIFT, brickShapes, project, shade, towerBox } from "@/lib/iso";

function points(shape: ReturnType<typeof brickShapes>): [number, number][] {
  const pts: [number, number][] = [];
  for (const p of shape.polygons) {
    for (const pair of p.points.split(" ")) {
      const [x, y] = pair.split(",").map(Number);
      pts.push([x, y]);
    }
  }
  for (const s of shape.studs) {
    pts.push([s.top.cx - s.top.rx, s.top.cy - s.top.ry], [s.top.cx + s.top.rx, s.top.cy + s.top.ry]);
  }
  return pts;
}

describe("iso", () => {
  it("projects like the Python prototype", () => {
    const [x, y] = project(33)(4, 0, 1.2, 770, 700);
    expect(x).toBeCloseTo(884.3, 1);
    expect(y).toBeCloseTo(726.4, 1);
  });

  it("shades like the Python prototype", () => {
    expect(shade("#D0021B", 0.84)).toBe("#ae0116");
    expect(shade("#F7D117", 0.68)).toBe("#a78e0f");
  });

  it("draws three faces and one stud per top cell", () => {
    const b = brickShapes(33, 0, 4, 2, 1.2, "#0057B8", 770, 700);
    expect(b.polygons).toHaveLength(3);
    expect(b.studs).toHaveLength(8);
  });

  it("fits a lifted 10-brick tower inside its box", () => {
    const U = 33;
    const box = towerBox(10, U, LIFT);
    for (let k = 0; k < 10; k++) {
      const z0 = k * BRICK.h + (k === 9 ? LIFT : 0);
      const shape = brickShapes(U, z0, BRICK.w, BRICK.d, BRICK.h, "#D0021B", box.ox, box.oy);
      for (const [x, y] of points(shape)) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(box.width);
        expect(y).toBeLessThanOrEqual(box.height);
      }
    }
  });
});
