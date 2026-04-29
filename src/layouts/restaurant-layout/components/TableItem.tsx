import type { TableShape } from '../store/useLayoutStore';

// ─── Design tokens ────────────────────────────────────────────────────────────
const TABLE_FILL   = '#c2ccd8';
const TABLE_STROKE = '#8a9bb0';
const CHAIR_FILL   = '#d8e0e8';
const CHAIR_STROKE = '#9aaabb';

// Ghost (drag overlay) colours
const GHOST_TABLE  = 'rgba(249,115,22,0.35)';
const GHOST_STROKE = '#f97316';
const GHOST_CHAIR  = 'rgba(249,115,22,0.2)';

interface TableSVGProps {
  seats: number;
  shape: TableShape;
  scale?: number;
  /** Orange ghost style used in DragOverlay */
  ghost?: boolean;
}

/**
 * Pure SVG top-down table renderer.
 * Used for both palette preview items and placed tables on the canvas.
 */
const TableSVG = ({ seats, shape, scale = 1, ghost = false }: TableSVGProps) => {
  const tf = ghost ? GHOST_TABLE  : TABLE_FILL;
  const ts = ghost ? GHOST_STROKE : TABLE_STROKE;
  const cf = ghost ? GHOST_CHAIR  : CHAIR_FILL;
  const cs = ghost ? GHOST_STROKE : CHAIR_STROKE;

  // ── Text / label placeholder ────────────────────────────────────────────────
  if (shape === 'Label') {
    const px = Math.round(44 * scale);
    return (
      <svg width={px} height={px} viewBox="0 0 44 44" style={{ display: 'block' }}>
        <rect x={2} y={2} width={40} height={40} rx={5} fill={tf} stroke={ts} strokeWidth={2} />
        <text
          x={22} y={30}
          textAnchor="middle"
          fill={ts}
          fontSize={24}
          fontWeight="bold"
          fontFamily="sans-serif"
        >
          T
        </text>
      </svg>
    );
  }

  // ── Round table ─────────────────────────────────────────────────────────────
  if (shape === 'Round') {
    const numChairs = Math.max(seats, 2);
    const tableR    = 20;
    const chairR    = 7;
    const dist      = tableR + chairR + 4;
    const half      = dist + chairR + 3;
    const viewSize  = half * 2;
    const cx = half;
    const cy = half;

    const chairEls = Array.from({ length: numChairs }, (_, i) => {
      const angle = (i / numChairs) * 2 * Math.PI - Math.PI / 2;
      return (
        <ellipse
          key={i}
          cx={cx + Math.cos(angle) * dist}
          cy={cy + Math.sin(angle) * dist}
          rx={chairR}
          ry={chairR - 1}
          fill={cf}
          stroke={cs}
          strokeWidth={1.5}
        />
      );
    });

    const d = Math.round(viewSize * scale);
    return (
      <svg width={d} height={d} viewBox={`0 0 ${viewSize} ${viewSize}`} style={{ display: 'block' }}>
        {chairEls}
        <circle cx={cx} cy={cy} r={tableR} fill={tf} stroke={ts} strokeWidth={2} />
      </svg>
    );
  }

  // ── Curved booth / banquette ────────────────────────────────────────────────
  if (shape === 'Curved') {
    const s      = 78;
    const ds     = Math.round(s * scale);
    const outerR = s - 6;
    const innerR = s - 22;
    const notches = [0.22, 0.45, 0.68, 0.88];

    return (
      <svg width={ds} height={ds} viewBox={`0 0 ${s} ${s}`} style={{ display: 'block' }}>
        <path
          d={[
            `M ${s - outerR} ${s}`,
            `A ${outerR} ${outerR} 0 0 1 ${s} ${s - outerR}`,
            `L ${s} ${s - innerR}`,
            `A ${innerR} ${innerR} 0 0 0 ${s - innerR} ${s}`,
            'Z',
          ].join(' ')}
          fill={tf}
          stroke={ts}
          strokeWidth={2}
        />
        {notches.map((t, i) => {
          const angle = t * (Math.PI / 2);
          return (
            <line
              key={i}
              x1={s - Math.cos(angle) * innerR}
              y1={s - Math.sin(angle) * innerR}
              x2={s - Math.cos(angle) * outerR}
              y2={s - Math.sin(angle) * outerR}
              stroke={cs}
              strokeWidth={1.2}
              opacity={0.7}
            />
          );
        })}
      </svg>
    );
  }

  // ── Rectangle / Square (default) ────────────────────────────────────────────
  const perSide  = seats <= 2 ? 1 : seats <= 4 ? 2 : seats <= 6 ? 3 : 4;
  const chairW   = 18;
  const chairH   = 11;
  const chairGap = 5;
  const tableW   = Math.max(perSide * (chairW + 5) + 6, 52);
  const tableH   = 30;
  const svgW     = tableW;
  const svgH     = tableH + 2 * (chairH + chairGap);
  const spacing  = tableW / perSide;

  const tops = Array.from({ length: perSide }, (_, i) => (
    <rect
      key={i}
      x={(i + 0.5) * spacing - chairW / 2}
      y={0}
      width={chairW}
      height={chairH}
      rx={3}
      fill={cf}
      stroke={cs}
      strokeWidth={1.5}
    />
  ));

  const bots = Array.from({ length: perSide }, (_, i) => (
    <rect
      key={i}
      x={(i + 0.5) * spacing - chairW / 2}
      y={tableH + chairH + chairGap * 2}
      width={chairW}
      height={chairH}
      rx={3}
      fill={cf}
      stroke={cs}
      strokeWidth={1.5}
    />
  ));

  const dW = Math.round(svgW * scale);
  const dH = Math.round(svgH * scale);
  return (
    <svg width={dW} height={dH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: 'block' }}>
      {tops}
      <rect
        x={0}
        y={chairH + chairGap}
        width={tableW}
        height={tableH}
        rx={5}
        fill={tf}
        stroke={ts}
        strokeWidth={2}
      />
      {bots}
    </svg>
  );
};

export default TableSVG;
