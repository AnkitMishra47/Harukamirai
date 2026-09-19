/**
 * Shared tech/skill pill, for consistent tag sizing and hover effects.
 *
 * Note on where these are allowed to appear: a pill is detail, not a headline.
 * A collapsed card shows a kicker, a title and a two-line teaser and stops
 * there, because at 390px a stack of 5-7 pills wraps to four rows and buries
 * the next card. Pills therefore belong in expanded detail (CaseStudyDetail)
 * or on a page whose whole subject is the list (the about page skills
 * section) - not on a summary card.
 */
export function TechPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-xs text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)] hover:shadow-[0_0_8px_var(--accent-glow)] transition-all cursor-default hover:scale-105 ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
