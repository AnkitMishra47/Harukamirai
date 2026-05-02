type Props = {
  size?: number;
  className?: string;
};

/**
 * 4-leaf clover with optional 5th anti-magic leaf (driven by CSS vars).
 * Designed for legibility down to ~20px — uses bold rounded leaves with
 * white stroke separation, not overlapping fills.
 */
export function CloverIcon({ size = 32, className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`clover-icon ${className ?? ""}`}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {/* Stem */}
      <path
        className="stem"
        d="M 50 56 Q 47 68 49 84 Q 50 86 51 84 Q 53 68 50 56 Z"
      />

      {/* 4 leaves — bold rounded "spade-with-notch" shapes pointing outward */}
      <g className="leaves">
        {/* Top */}
        <path
          className="leaf"
          d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z"
        />
        {/* Right */}
        <path
          className="leaf"
          d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z"
        />
        {/* Bottom */}
        <path
          className="leaf"
          d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z"
        />
        {/* Left */}
        <path
          className="leaf"
          d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z"
        />
        {/* Center highlight to tie leaves together */}
        <circle cx="50" cy="50" r="4" className="leaf" />
      </g>

      {/* 5th leaf — jagged, demonic, top-left, hidden in leaf-4 state */}
      <path
        className="leaf-fifth"
        d="M 50 50 L 32 32 L 22 16 L 36 22 L 30 6 L 44 18 L 38 4 L 50 14 Z"
      />
    </svg>
  );
}
