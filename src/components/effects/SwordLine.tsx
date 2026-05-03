/**
 * Decorative horizontal sword silhouette strip for the navbar.
 * Original SVG art — three swords laid flat across the line:
 *   broadsword (left, pointing right) → small katana (centre, pointing
 *   right) → ornate saber (right, pointing left).
 * Uses var(--accent) so it adopts the active theme.
 */
export function SwordLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 40"
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none w-full ${className}`}
      aria-hidden
    >
      {/* Centre baseline — runs the full width, broken where the swords sit */}
      <line
        x1="0"
        y1="20"
        x2="320"
        y2="20"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />
      <line
        x1="710"
        y1="20"
        x2="820"
        y2="20"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />
      <line
        x1="1130"
        y1="20"
        x2="1200"
        y2="20"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />

      {/* SWORD 1 — heavy broadsword, pointing right, occupying x ~330-690 */}
      <g
        fill="var(--accent)"
        stroke="var(--accent)"
        strokeWidth="0.6"
        strokeLinejoin="round"
        opacity="0.75"
      >
        {/* pommel */}
        <circle cx="340" cy="20" r="5" />
        {/* grip */}
        <rect x="345" y="17.5" width="20" height="5" />
        {/* cross-guard */}
        <rect x="362" y="11" width="6" height="18" rx="1" />
        {/* blade — long, slightly tapering with jagged underside notch */}
        <path d="M 368 16 L 660 17.5 L 685 20 L 660 22.5 L 368 24 Z" />
      </g>

      {/* SWORD 2 — slim katana, pointing right, x ~825-1115 */}
      <g
        fill="var(--accent)"
        stroke="var(--accent)"
        strokeWidth="0.5"
        strokeLinejoin="round"
        opacity="0.65"
      >
        {/* pommel cap */}
        <rect x="828" y="18" width="4" height="4" rx="0.5" />
        {/* grip — wrapped */}
        <rect x="833" y="18.5" width="32" height="3" />
        <line x1="838" y1="18.5" x2="838" y2="21.5" stroke="var(--bg)" strokeWidth="0.6" />
        <line x1="846" y1="18.5" x2="846" y2="21.5" stroke="var(--bg)" strokeWidth="0.6" />
        <line x1="854" y1="18.5" x2="854" y2="21.5" stroke="var(--bg)" strokeWidth="0.6" />
        <line x1="862" y1="18.5" x2="862" y2="21.5" stroke="var(--bg)" strokeWidth="0.6" />
        {/* tsuba (guard) */}
        <ellipse cx="868" cy="20" rx="2.5" ry="6" />
        {/* curved blade — slight upward curve, slim */}
        <path d="M 872 18.5 Q 990 16.5 1110 19 L 1115 20 L 1110 21 Q 990 21.5 872 21.5 Z" />
      </g>

      {/* CENTRE EMBLEM — a small four-leaf clover sigil between the first two swords */}
      <g transform="translate(700 20)" opacity="0.55">
        <g fill="var(--accent)">
          {/* abstracted clover — four small lobes */}
          <ellipse cx="0" cy="-5" rx="2.5" ry="3" />
          <ellipse cx="5" cy="0" rx="3" ry="2.5" />
          <ellipse cx="0" cy="5" rx="2.5" ry="3" />
          <ellipse cx="-5" cy="0" rx="3" ry="2.5" />
          <circle cx="0" cy="0" r="1.5" />
        </g>
      </g>
    </svg>
  );
}
