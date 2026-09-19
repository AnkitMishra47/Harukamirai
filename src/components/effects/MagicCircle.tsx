type Props = {
  size?: number;
  className?: string;
  intensity?: "subtle" | "full";
};

/**
 * Rotating magic circle. Every loop is a CSS animation on a transform layer
 * (`.spin-cw`, `.spin-ccw`, `.ring-pulse`), so it renders server-side and
 * costs nothing on the main thread.
 */
export function MagicCircle({ size = 720, className = "", intensity = "full" }: Props) {
  const opacity = intensity === "subtle" ? 0.15 : 0.7;
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
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      <circle cx="400" cy="400" r="380" fill="url(#mc-glow)" />

      {/* Outer rotating ring */}
      <g className="spin-cw" style={{ "--spin": "60s" } as React.CSSProperties}>
        <circle cx="400" cy="400" r="360" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.9" />
        <circle cx="400" cy="400" r="345" fill="none" stroke="var(--accent)" strokeWidth="0.8" strokeOpacity="0.55" strokeDasharray="3 6" />
      </g>

      {/* Mid counter-rotating ring */}
      <g className="spin-ccw" style={{ "--spin": "80s" } as React.CSSProperties}>
        <circle cx="400" cy="400" r="300" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.7" />
        <circle cx="400" cy="400" r="290" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="1 4" />
      </g>

      {/* Inner pentagram + clover star */}
      <g className="spin-cw" style={{ "--spin": "40s" } as React.CSSProperties}>
        <circle cx="400" cy="400" r="260" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeOpacity="0.85" />
        {/* 5-point star - anti-magic. Outer R=240, inner R=91.7, centred (400,400). */}
        <path
          d="M 400 160 L 454 326 L 628 326 L 487 428 L 541 594 L 400 492 L 259 594 L 313 428 L 172 326 L 346 326 Z"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeOpacity="0.7"
        />
      </g>

      {/* Crosshair lines */}
      <g stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="0.5">
        <line x1="40" y1="400" x2="760" y2="400" />
        <line x1="400" y1="40" x2="400" y2="760" />
      </g>

      {/* Pulsing inner circle */}
      <circle
        className="ring-pulse"
        cx="400"
        cy="400"
        r="128"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
