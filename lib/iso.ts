// Isometric brick geometry, ported from cv-design/tools/brick_gen.py.

const C = Math.cos(Math.PI / 6);
const S = Math.sin(Math.PI / 6);

/** A career brick is 4 studs long, 2 deep, 1.2 units tall. */
export const BRICK = { w: 4, d: 2, h: 1.2 } as const;
/** How far the newest brick hovers above the tower on the first screen. */
export const LIFT = 2.6;
/** Room for keylines around the drawing. */
const PAD = 4;

type Projector = (x: number, y: number, z: number, ox: number, oy: number) => [number, number];

export function project(U: number): Projector {
  return (x, y, z, ox, oy) => [ox + (x - y) * C * U, oy + (x + y) * S * U - z * U];
}

/** Darkens (f < 1) a #RRGGBB colour, truncating like the prototype. */
export function shade(hex: string, f: number): string {
  const h = hex.replace("#", "");
  const ch = [0, 2, 4].map((i) => Math.max(0, Math.min(255, Math.trunc(parseInt(h.slice(i, i + 2), 16) * f))));
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

export interface BrickShapes {
  polygons: { points: string; fill: string }[];
  studs: { body: string; top: { cx: number; cy: number; rx: number; ry: number }; fill: string; topFill: string }[];
}

const fmt = (p: [number, number]) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

export function brickShapes(
  U: number, z0: number, w: number, d: number, h: number, hex: string, ox: number, oy: number,
): BrickShapes {
  const P = project(U);
  const zt = z0 + h;
  const top = [P(0, 0, zt, ox, oy), P(w, 0, zt, ox, oy), P(w, d, zt, ox, oy), P(0, d, zt, ox, oy)];
  const left = [P(0, d, z0, ox, oy), P(w, d, z0, ox, oy), P(w, d, zt, ox, oy), P(0, d, zt, ox, oy)];
  const right = [P(w, 0, z0, ox, oy), P(w, d, z0, ox, oy), P(w, d, zt, ox, oy), P(w, 0, zt, ox, oy)];
  const polygons = [
    { points: left.map(fmt).join(" "), fill: shade(hex, 0.84) },
    { points: right.map(fmt).join(" "), fill: shade(hex, 0.68) },
    { points: top.map(fmt).join(" "), fill: hex.toLowerCase() },
  ];
  const rx = U * 0.34;
  const ry = U * 0.2;
  const sh = U * 0.2;
  const studs: BrickShapes["studs"] = [];
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < d; j++) {
      const [cx, cy] = P(i + 0.5, j + 0.5, zt, ox, oy);
      const f = (n: number) => n.toFixed(1);
      studs.push({
        body: `M${f(cx - rx)} ${f(cy - sh)} L${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(cy)} L${f(cx + rx)} ${f(cy - sh)} Z`,
        top: { cx, cy: cy - sh, rx, ry },
        fill: shade(hex, 0.8),
        topFill: hex.toLowerCase(),
      });
    }
  }
  return { polygons, studs };
}

/** The viewBox (and origin) that holds `count` stacked bricks, the top one lifted by `lift`. */
export function towerBox(count: number, U: number, lift = 0): { width: number; height: number; ox: number; oy: number } {
  const { w, d, h } = BRICK;
  const ztop = count * h + lift;
  const ox = d * C * U + PAD;
  const oy = ztop * U + PAD;
  const width = (w + d) * C * U + 2 * PAD;
  const height = oy + (w + d) * S * U + PAD;
  return { width, height, ox, oy };
}
