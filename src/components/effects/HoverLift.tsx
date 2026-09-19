/** Lift on hover via a CSS transition. Server-safe: no client JS needed. */
export function HoverLift({ children, y = -4 }: { children: React.ReactNode; y?: number }) {
  return (
    <div
      className="h-full transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:[transform:translateY(var(--lift))]"
      style={{ "--lift": `${y}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
