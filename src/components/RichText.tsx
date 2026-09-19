import { Fragment } from "react";

/**
 * Renders a content string where `**text**` becomes <strong>. Content files
 * stay plain data; this is the only markup convention they use.
 */
export function RichText({ text, strongClassName = "text-[var(--text)]" }: { text: string; strongClassName?: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className={strongClassName}>
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
