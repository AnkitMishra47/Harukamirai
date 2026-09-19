/**
 * Shared tech/skill pill used across the about page, home page featured cards,
 * and work page case study cards for consistent tag sizing and hover effects.
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
