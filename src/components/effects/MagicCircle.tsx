type Props = {
  size?: number;
  className?: string;
  intensity?: "subtle" | "full";
};

/**
 * The casting seal behind the hero.
 *
 * Five bands turning at different rates and directions: an outer rim with a
 * 90-tooth tick ring, a counter-turning gold rune band, a spoke ring, the
 * anti-magic pentagram, and a core star. Depth comes from the bands
 * disagreeing about speed, not from stacked opacity.
 *
 * Every loop is one of the three CSS keyframes already in globals.css
 * (`.spin-cw`, `.spin-ccw`, `.ring-pulse`), which animate `transform` only.
 * No filters, no blur, no JavaScript, no per-frame work: it renders
 * server-side and the compositor owns it from then on. `prefers-reduced-motion`
 * is honoured globally, which parks every band where it starts.
 */

/** 90 teeth on a circle of r=364: circumference 2287.1 / 90 = 25.412 per tooth. */
const TICK_DASH = "2.5 22.912";

/** 24 spokes, r=292 out to r=308. */
const SPOKES =
  "M400 108L400 92M475.6 117.9L479.7 102.5M546 147.1L554 133.3M606.5 193.5L617.8 182.2M652.9 254L666.7 246M682.1 324.4L697.5 320.3M692 400L708 400M682.1 475.6L697.5 479.7M652.9 546L666.7 554M606.5 606.5L617.8 617.8M546 652.9L554 666.7M475.6 682.1L479.7 697.5M400 692L400 708M324.4 682.1L320.3 697.5M254 652.9L246 666.7M193.5 606.5L182.2 617.8M147.1 546L133.3 554M117.9 475.6L102.5 479.7M108 400L92 400M117.9 324.4L102.5 320.3M147.1 254L133.3 246M193.5 193.5L182.2 182.2M254 147.1L246 133.3M324.4 117.9L320.3 102.5";

/** Anti-magic pentagram inscribed in r=262 (inner vertices land on r=100.1). */
const PENTAGRAM =
  "M 400 138 L 458.8 319 L 649.2 319 L 495.2 430.9 L 554 612 L 400 500.1 L 246 612 L 304.8 430.9 L 150.8 319 L 341.2 319 Z";

/** Four-point star at the core, echoing the clover's cross. */
const CORE_STAR =
  "M 400 250 L 438.2 361.8 L 550 400 L 438.2 438.2 L 400 550 L 361.8 438.2 L 250 400 L 361.8 361.8 Z";

/**
 * Six angular glyphs, cycled around the rune band. Drawn as paths rather than
 * typeset, so the seal carries no dependency on the Japanese font subset (which
 * only ships the glyphs the copy actually uses - new kanji would render tofu).
 */
const GLYPHS = [
  "M-5-8L-5 8M-5-8L5 0L-5 4",
  "M-5-8L-5 8M5-8L5 8M-5-2L5 2",
  "M0-8L0 8M-5-4L0 0L5-4",
  "M-5 8L0-8L5 8M-3 2L3 2",
  "M-5-8L5-8M0-8L0 8M-4 8L4 8",
  "M-5-8L5 8M5-8L-5 8M0-8L0 8",
];

/** 16 rune seats on r=330, each turned to face outward. */
const RUNES = [
  { x: 400, y: 70, r: 0 },
  { x: 526.3, y: 95.1, r: 22.5 },
  { x: 633.3, y: 166.7, r: 45 },
  { x: 704.9, y: 273.7, r: 67.5 },
  { x: 730, y: 400, r: 90 },
  { x: 704.9, y: 526.3, r: 112.5 },
  { x: 633.3, y: 633.3, r: 135 },
  { x: 526.3, y: 704.9, r: 157.5 },
  { x: 400, y: 730, r: 180 },
  { x: 273.7, y: 704.9, r: 202.5 },
  { x: 166.7, y: 633.3, r: 225 },
  { x: 95.1, y: 526.3, r: 247.5 },
  { x: 70, y: 400, r: 270 },
  { x: 95.1, y: 273.7, r: 292.5 },
  { x: 166.7, y: 166.7, r: 315 },
  { x: 273.7, y: 95.1, r: 337.5 },
];

const spin = (s: string) => ({ "--spin": s }) as React.CSSProperties;

export function MagicCircle({ size = 720, className = "", intensity = "full" }: Props) {
  const subtle = intensity === "subtle";
  const opacity = subtle ? 0.15 : 0.82;
  // The rune band is the loudest layer, so it steps back when the seal is used
  // as wallpaper behind a whole page rather than as the hero piece.
  const runeOpacity = subtle ? 0.3 : 1;

  return (
    <svg
      viewBox="0 0 800 800"
      width={size}
      height={size}
      className={`circle-in pointer-events-none select-none will-change-transform ${className}`}
      style={{ opacity, backfaceVisibility: "hidden", transform: "translateZ(0)" }}
      aria-hidden
    >
      <defs>
        <radialGradient id="mc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="45%" stopColor="var(--accent)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mc-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.14" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="400" cy="400" r="392" fill="url(#mc-glow)" />

      {/* Outer rim: hairline, 90-tooth tick ring, hairline */}
      <g className="spin-cw" style={spin("90s")}>
        <circle cx="400" cy="400" r="376" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.5" />
        <circle
          cx="400"
          cy="400"
          r="364"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="14"
          strokeOpacity="0.3"
          strokeDasharray={TICK_DASH}
        />
        <circle cx="400" cy="400" r="352" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.35" />
      </g>

      {/* Rune band, turning the other way, in gold */}
      <g className="spin-ccw" style={spin("150s")} opacity={runeOpacity}>
        <circle cx="400" cy="400" r="344" fill="none" stroke="var(--gold)" strokeWidth="1" strokeOpacity="0.5" />
        <circle cx="400" cy="400" r="330" fill="none" stroke="var(--gold)" strokeWidth="26" strokeOpacity="0.07" />
        <circle cx="400" cy="400" r="316" fill="none" stroke="var(--gold)" strokeWidth="1" strokeOpacity="0.5" />
        <g stroke="var(--gold)" strokeWidth="1.7" strokeOpacity="0.72" fill="none" strokeLinecap="round">
          {RUNES.map((seat, i) => (
            <path
              key={i}
              d={GLYPHS[i % GLYPHS.length]}
              transform={`translate(${seat.x} ${seat.y}) rotate(${seat.r}) scale(0.85)`}
            />
          ))}
        </g>
      </g>

      {/* Spoke ring */}
      <g className="spin-cw" style={spin("200s")}>
        <path d={SPOKES} stroke="var(--accent)" strokeWidth="2" strokeOpacity="0.45" strokeLinecap="round" fill="none" />
      </g>

      {/* Anti-magic pentagram */}
      <g className="spin-ccw" style={spin("70s")}>
        <circle cx="400" cy="400" r="284" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.6" />
        <path
          d={PENTAGRAM}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
          strokeOpacity="0.55"
          strokeLinejoin="round"
        />
        <circle cx="400" cy="400" r="100" fill="none" stroke="var(--gold)" strokeWidth="0.9" strokeOpacity="0.45" />
      </g>

      {/* Core */}
      <g className="spin-cw" style={spin("45s")}>
        <path
          d={CORE_STAR}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          strokeLinejoin="round"
        />
      </g>
      <circle className="ring-pulse" cx="400" cy="400" r="128" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="400" cy="400" r="150" fill="url(#mc-core)" />
    </svg>
  );
}
