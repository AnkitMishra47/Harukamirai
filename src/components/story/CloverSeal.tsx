import styles from "./story-scene.module.css";

/**
 * The seal on the shutter: a ringed five-leaf clover, drawn to be cut in half.
 *
 * This is deliberately NOT `CloverIcon`. That one is the site's mark - a small,
 * theme-switching badge that has to stay legible at 20px in the nav, so it is
 * built from bold separated leaves with no enclosing ring. This one is a seal
 * pressed into a door at 116px and never smaller, so it can carry a ring, a
 * stem and overlapping leaves that the small mark cannot afford.
 *
 * It is rendered twice, once inside each panel, and each copy is clipped to the
 * half its panel owns (see `.emblemHalf` in story-scene.module.css). Two clips
 * of one drawing rather than two drawings: the halves cannot drift out of
 * register, and the tear falls exactly where the panels meet.
 *
 * The fifth leaf is the jagged one at the top left, carried at lower opacity
 * than the other four - present, but not yet the thing it becomes in leaf-5.
 */
export function CloverSeal() {
  return (
    <svg
      viewBox="0 0 116 116"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle className={styles.emblemRing} cx="58" cy="58" r="48" />
      <circle className={styles.emblemRing} cx="58" cy="58" r="31" opacity="0.55" />
      <path className={styles.emblemStem} d="M58 62 C55 75 56 88 58 95 C61 86 62 75 58 62 Z" />
      <path
        className={styles.emblemMark}
        d="M58 55 C42 50 35 39 39 28 C45 16 57 28 58 41 C59 28 71 16 77 28 C81 39 74 50 58 55 Z"
      />
      <path
        className={styles.emblemMark}
        d="M61 58 C66 42 77 35 88 39 C100 45 88 57 75 58 C88 59 100 71 88 77 C77 81 66 74 61 58 Z"
      />
      <path
        className={styles.emblemMark}
        d="M58 61 C74 66 81 77 77 88 C71 100 59 88 58 75 C57 88 45 100 39 88 C35 77 42 66 58 61 Z"
      />
      <path
        className={styles.emblemMark}
        d="M55 58 C50 74 39 81 28 77 C16 71 28 59 41 58 C28 57 16 45 28 39 C39 35 50 42 55 58 Z"
      />
      <path
        className={styles.emblemMark}
        d="M57 56 L43 43 L34 27 L48 35 L45 19 L57 34 L62 20 L63 42 Z"
        opacity="0.74"
      />
    </svg>
  );
}
