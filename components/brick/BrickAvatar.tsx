/**
 * Wellmmer as a little brick build: black turtleneck brick, a block head with short
 * curly hair, rectangular tortoise glasses and light stubble. Our own drawing, built
 * from plain blocks; not a minifigure.
 */
export function BrickAvatar({ size = 160 }: { size?: number }) {
  const k = "#111";
  const skin = "#a8724f";
  const skinSide = "#8c5c3e";
  const hair = "#1f1a17";
  const shirt = "#2b2b2b";
  return (
    <svg viewBox="0 0 160 160" width={size} height={size} aria-hidden="true" focusable="false">
      {/* torso: a 2x4 brick, studs on the shoulders */}
      {[34, 54, 106, 126].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} 116 V120 A7 3 0 0 0 ${x + 7} 120 V116 Z`} fill="#1a1a1a" stroke={k} strokeWidth={2} />
          <ellipse cx={x} cy={116} rx={7} ry={3} fill={shirt} stroke={k} strokeWidth={2} />
        </g>
      ))}
      <rect x={20} y={120} width={120} height={46} rx={6} fill={shirt} stroke={k} strokeWidth={3} />
      <rect x={20} y={150} width={120} height={16} fill="#1a1a1a" />
      <rect x={20} y={120} width={120} height={46} rx={6} fill="none" stroke={k} strokeWidth={3} />
      {/* turtleneck */}
      <rect x={58} y={100} width={44} height={24} rx={4} fill={shirt} stroke={k} strokeWidth={3} />
      <path d="M62 108 H98 M62 115 H98" stroke="#1a1a1a" strokeWidth={2} />
      {/* ears */}
      <rect x={36} y={60} width={10} height={18} rx={3} fill={skinSide} stroke={k} strokeWidth={2.5} />
      <rect x={114} y={60} width={10} height={18} rx={3} fill={skinSide} stroke={k} strokeWidth={2.5} />
      {/* head block */}
      <rect x={44} y={30} width={72} height={74} rx={10} fill={skin} stroke={k} strokeWidth={3} />
      <rect x={104} y={33} width={9} height={68} rx={4} fill={skinSide} opacity={0.55} />
      {/* stubble */}
      <path d="M50 78 Q50 100 80 101 Q110 100 110 78 Q104 92 80 93 Q56 92 50 78Z" fill="#5a3a26" opacity={0.42} />
      <path d="M70 84 Q80 80 90 84" stroke="#4a2f1f" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
      {/* mouth */}
      <path d="M72 90 H88" stroke="#4a2a1b" strokeWidth={3} strokeLinecap="round" />
      {/* hair: a dark plate with curls on top */}
      <rect x={41} y={22} width={78} height={20} rx={7} fill={hair} stroke={k} strokeWidth={3} />
      {[50, 62, 74, 86, 98, 110].map((x, i) => (
        <circle key={x} cx={x} cy={i % 2 ? 19 : 21} r={7} fill={hair} stroke={k} strokeWidth={2.5} />
      ))}
      <rect x={43} y={28} width={74} height={12} fill={hair} />
      {/* eyes and glasses */}
      <circle cx={65} cy={64} r={3.4} fill={k} />
      <circle cx={95} cy={64} r={3.4} fill={k} />
      <rect x={51} y={54} width={27} height={20} rx={4} fill="#ffffff" fillOpacity={0.18} stroke="#7a5230" strokeWidth={3.5} />
      <rect x={82} y={54} width={27} height={20} rx={4} fill="#ffffff" fillOpacity={0.18} stroke="#7a5230" strokeWidth={3.5} />
      <path d="M78 61 H82 M44 60 H51 M109 60 H116" stroke="#7a5230" strokeWidth={3} />
      {/* brows */}
      <path d="M55 50 H74 M86 50 H105" stroke={hair} strokeWidth={3.5} strokeLinecap="round" />
    </svg>
  );
}
