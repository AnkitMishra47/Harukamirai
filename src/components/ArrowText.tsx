/**
 * Renders a string with its "→" drawn as an inline SVG instead of a glyph.
 *
 * The mono and display faces on this site have no arrow, so the browser pulls
 * "→" from a fallback font at that font's size and baseline - it sat low and
 * thin next to the text. The SVG is sized in em and nudged onto the x-height,
 * so it tracks whatever text it sits in. Screen readers still get the arrow
 * from the visually hidden character.
 */
export function ArrowText({ text }: { text: string }) {
  const parts = text.split("→");
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && (
            <>
              <svg
                viewBox="0 0 16 16"
                width="1em"
                height="1em"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="inline-block align-[-0.15em] mx-[0.45em] opacity-70"
              >
                <path d="M2.5 8h11M9.5 4l4 4-4 4" />
              </svg>
              <span className="sr-only">→</span>
            </>
          )}
          {part.trim()}
        </span>
      ))}
    </>
  );
}
