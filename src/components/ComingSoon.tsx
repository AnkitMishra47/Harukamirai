export function ComingSoon({
  eyebrow,
  title,
  body,
  jp,
}: {
  eyebrow: string;
  title: string;
  body?: React.ReactNode;
  jp?: string;
}) {
  return (
    <article className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-subtle)]">
        {eyebrow}
      </p>
      <h1 className="font-display text-5xl md:text-6xl mt-4 text-[var(--text)]">
        {title}
      </h1>
      {body && <div className="mt-8 text-[var(--text-muted)]">{body}</div>}
      <p className="mt-12 font-jp text-2xl text-[var(--text-subtle)]">
        {jp ?? "近日公開"}
      </p>
    </article>
  );
}
