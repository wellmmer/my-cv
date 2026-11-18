import { BRICK_HEX } from "@/content/types";
import { brickShapes } from "@/lib/iso";

export interface BrickProps {
  U: number;
  z0: number;
  w: number;
  d: number;
  h: number;
  color: string;
  ox: number;
  oy: number;
}

/** One isometric brick as SVG shapes (no wrapper), with ink keylines. */
export function BrickShape({ U, z0, w, d, h, color, ox, oy }: BrickProps) {
  const { polygons, studs } = brickShapes(U, z0, w, d, h, color, ox, oy);
  return (
    <g data-brick={color === BRICK_HEX.black ? "black" : undefined}>
      {polygons.map((p, i) => (
        <polygon key={i} points={p.points} fill={p.fill} stroke="#111" strokeWidth={2.4} strokeLinejoin="round" />
      ))}
      {studs.map((s, i) => (
        <g key={`s${i}`}>
          <path d={s.body} fill={s.fill} stroke="#111" strokeWidth={2} />
          <ellipse cx={s.top.cx} cy={s.top.cy} rx={s.top.rx} ry={s.top.ry} fill={s.topFill} stroke="#111" strokeWidth={2} />
        </g>
      ))}
    </g>
  );
}

/** A standalone brick in its own SVG, sized to fit. */
export function Brick({ color, U = 14, w = 2, d = 1, h = 1.2 }: { color: string; U?: number; w?: number; d?: number; h?: number }) {
  const C = Math.cos(Math.PI / 6);
  const pad = 3;
  const ox = d * C * U + pad;
  const oy = h * U + pad;
  const width = (w + d) * C * U + 2 * pad;
  const height = oy + ((w + d) / 2) * U + pad;
  return (
    <svg viewBox={`0 0 ${width.toFixed(1)} ${height.toFixed(1)}`} width={width} height={height} aria-hidden="true" focusable="false">
      <BrickShape U={U} z0={0} w={w} d={d} h={h} color={color} ox={ox} oy={oy} />
    </svg>
  );
}
