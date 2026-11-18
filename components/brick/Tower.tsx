import { BRICK, LIFT, project, towerBox } from "@/lib/iso";
import { BrickShape } from "@/components/brick/Brick";
import styles from "@/components/brick/Tower.module.css";

export interface TowerStep {
  n: number;
  color: string;
  label?: string;
}

interface TowerProps {
  /** Oldest first: steps[0] is the bottom brick. */
  steps: TowerStep[];
  U: number;
  /** Raise the newest brick and draw a dashed arrow to its place. */
  liftTop?: boolean;
  labels?: boolean;
  ariaLabel?: string;
  className?: string;
}

const ARROW_SPACE = 44;
const LABEL_SPACE = 240;

export function Tower({ steps, U, liftTop = false, labels = false, ariaLabel, className }: TowerProps) {
  const count = steps.length;
  const lift = liftTop ? LIFT : 0;
  const box = towerBox(count, U, lift);
  const left = liftTop ? ARROW_SPACE : 0;
  const ox = box.ox + left;
  const oy = box.oy;
  const width = box.width + left + (labels ? LABEL_SPACE : 0);
  const P = project(U);
  const { w, d, h } = BRICK;
  const lastK = count - 1;

  return (
    <svg
      viewBox={`0 0 ${width.toFixed(1)} ${box.height.toFixed(1)}`}
      className={[styles.tower, className].filter(Boolean).join(" ")}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      focusable="false"
    >
      {steps.map((s, k) => {
        const z0 = k * h + (liftTop && k === lastK ? lift : 0);
        const [lx, ly] = P(w, 0, z0 + h / 2, ox, oy);
        const isTop = k === lastK;
        return (
          <g key={s.n} data-step={s.n}>
            <BrickShape U={U} z0={z0} w={w} d={d} h={h} color={s.color} ox={ox} oy={oy} />
            {labels && s.label ? (
              <text x={lx + 22} y={ly + 6} className={isTop ? styles.labelNow : styles.label}>
                {s.n} {s.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {liftTop && count > 0 ? <Arrow P={P} ox={ox} oy={oy} k={lastK} lift={lift} /> : null}
    </svg>
  );
}

function Arrow({ P, ox, oy, k, lift }: { P: ReturnType<typeof project>; ox: number; oy: number; k: number; lift: number }) {
  const { d, h } = BRICK;
  const [ax] = P(0, d, 0, ox, oy);
  const [, from] = P(0, d, k * h + lift, ox, oy);
  const [, to] = P(0, d, k * h, ox, oy);
  const x = ax - 26;
  return (
    <g className={styles.arrow} aria-hidden="true">
      <path d={`M${x.toFixed(0)} ${(from + 8).toFixed(0)} V${(to - 14).toFixed(0)}`} strokeWidth={3} strokeDasharray="8 7" fill="none" />
      <path d={`M${x.toFixed(0)} ${(to - 2).toFixed(0)} l-10 -14 h20 Z`} stroke="none" />
    </g>
  );
}
