import styles from "./case-study.module.css";

/**
 * The plate at the head of a case study card.
 *
 * WHY A DRAWN MARK AND NOT A PHOTOGRAPH. These case studies are anonymised
 * client work under NDA. Any picture that reads as a screen from the product
 * would be fabricated evidence, and a stock desk repeated six times says
 * nothing about the six different systems. So each card gets a mark that
 * diagrams what its system actually was - the neighbourhood query in a vector
 * store, the hub and its leaf sites, documents crossing a mapping gate - drawn
 * in the same thin-stroke seal vocabulary as MagicCircle and the grimoire.
 * It costs no network request, it is different on every card, and it cannot be
 * mistaken for a customer's screen.
 *
 *   +----------------------------------+
 *   |  .plate   (ground + rule grid)   |  <- CSS only, full bleed
 *   |         [ motif, meet ]          |  <- SVG, letterboxed, never cropped
 *   +----------------------------------+
 *   |  kicker                          |
 *   |  Title                           |
 *
 * GEOMETRY. One 400x89 viewBox for every card, rendered `meet` so the mark is
 * scaled to fit and centred rather than cropped: a card is 342px wide on a
 * phone and 580px on a wide screen, and `slice` would have eaten a different
 * part of every drawing. The CSS rule grid fills whatever margin `meet` leaves.
 *
 * CONTRAST. No text is ever set over this band, on any breakpoint. The marks
 * are decoration and are hidden from assistive tech; the card's own heading and
 * teaser stay on the audited --bg-elevated ground below it.
 *
 * MOTION. The only movement is a transform on hover, which the global
 * prefers-reduced-motion rule in globals.css flattens with everything else.
 */
export function CaseStudyMotif({ slug }: { slug: string }) {
  const mark = MARKS[slug];
  return (
    <div className={styles.plate} aria-hidden>
      {mark ? (
        <svg
          viewBox="0 0 400 89"
          preserveAspectRatio="xMidYMid meet"
          className={`${styles.mark} transition-transform duration-500 group-hover:scale-[1.04]`}
          focusable="false"
        >
          {mark}
        </svg>
      ) : null}
    </div>
  );
}

/* Shorthands for the two inks the marks are drawn in. `s.ink` is the theme
   accent, `s.gilt` the gold; both are stroke-only and carry their own opacity
   from the CSS module, so nothing here hard-codes a colour. */
const ink = styles.ink;
const gilt = styles.gilt;
const dot = styles.dot;
const dotGilt = styles.dotGilt;
const dash = styles.dash;

/**
 * One mark per case study slug, each drawing that study's actual architecture.
 * A slug with no entry renders the bare plate rather than someone else's
 * diagram: a wrong mark would claim the wrong system.
 */
const MARKS: Record<string, React.ReactElement> = {
  /* RAG over pgvector: a neighbourhood in the graph, with the query's search
     radius drawn over it. approach[0]-[1] - filtered vector search, HNSW. */
  "rag-platform": (
    <g>
      <path className={ink} d="M34 26 74 62 118 20 158 56 196 24" />
      <path className={ink} d="M158 56 202 80 246 50 288 22 332 44 366 68" />
      <path className={ink} d="M196 24 246 50 288 76 332 44" />
      <circle className={gilt} cx="222" cy="46" r="15" />
      <circle className={`${gilt} ${dash}`} cx="222" cy="46" r="26" />
      <path className={gilt} d="M222 46 196 24M222 46 246 50M222 46 202 80" />
      {[
        [34, 26], [74, 62], [118, 20], [158, 56], [196, 24], [202, 80],
        [246, 50], [288, 22], [288, 76], [332, 44], [366, 68],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} className={dot} cx={x} cy={y} r="2.6" />
      ))}
      <circle className={dotGilt} cx="222" cy="46" r="4" />
    </g>
  ),

  /* TestRobot: a plain-English plan, the agent gate that turns it into actions,
     the browser it drives, and the triage fork into drift or defect.
     approach[0]-[3]. */
  "test-robot": (
    <g>
      <rect className={ink} x="26" y="18" width="78" height="54" rx="5" />
      {[30, 42, 54].map((y) => (
        <g key={y}>
          <circle className={dotGilt} cx="36" cy={y} r="2.4" />
          <path className={ink} d={`M44 ${y}h${y === 42 ? 40 : 50}`} />
        </g>
      ))}
      <path className={gilt} d="M110 45h22M124 40l8 5-8 5" />
      <path className={gilt} d="M162 20 186 32 186 58 162 70 138 58 138 32Z" />
      <circle className={`${gilt} ${dash}`} cx="162" cy="45" r="11" />
      <circle className={dotGilt} cx="162" cy="45" r="3" />
      <path className={gilt} d="M192 45h20M204 40l8 5-8 5" />
      <rect className={ink} x="220" y="16" width="92" height="58" rx="5" />
      <path className={`${ink} ${styles.faint}`} d="M220 28h92" />
      <path className={dot} d="M226 20h4v4h-4zM234 20h4v4h-4z" />
      <path className={ink} d="M232 40h40M232 52h56M232 64h28" />
      <path className={`${ink} ${dash}`} d="M316 45C330 45 334 28 346 28M316 45C330 45 334 62 346 62" />
      <path className={gilt} d="M352 23l5 5 9-10" />
      <path className={ink} d="M353 57l10 10m0-10-10 10" />
    </g>
  ),

  /* SWI generation: the field recording cut into segments, a manual page with
     its figure cropped out, both feeding a numbered instruction.
     approach[0]-[2]. */
  "swi-generation": (
    <g>
      <path
        className={ink}
        d="M30 40v10M40 34v22M50 28v34M60 37v16M78 30v30M88 24v42M98 34v22M116 36v18M126 26v38M136 32v26"
      />
      <path className={`${gilt} ${dash}`} d="M69 18v54M107 18v54" />
      <rect className={ink} x="164" y="14" width="52" height="62" rx="4" />
      <path className={`${ink} ${styles.faint}`} d="M172 24h36M172 32h28" />
      <path className={gilt} d="M172 42v-4h4M204 38h4v4M208 64v4h-4M176 68h-4v-4" />
      <path className={ink} d="M178 60 188 48 196 56 202 50" />
      <path className={gilt} d="M146 45h10M226 45h26M244 40l8 5-8 5" />
      <rect className={ink} x="266" y="12" width="104" height="66" rx="6" />
      {[28, 45, 62].map((y) => (
        <g key={y}>
          <circle className={dotGilt} cx="282" cy={y} r="3" />
          <path className={ink} d={`M294 ${y}h${y === 45 ? 52 : 64}`} />
        </g>
      ))}
    </g>
  ),

  /* XML/EDI middleware: documents from two systems through a mapping gate to
     two more, with the retry path looping back. approach[0]-[2]. */
  "integration-middleware": (
    <g>
      <Doc x={38} y={12} />
      <Doc x={38} y={44} />
      <Doc x={334} y={12} />
      <Doc x={334} y={44} />
      <path className={ink} d="M68 32H170M162 27l8 5-8 5M68 56H170M162 51l8 5-8 5" />
      <path className={ink} d="M230 32H330M322 27l8 5-8 5M230 56H330M322 51l8 5-8 5" />
      <path className={gilt} d="M200 18 226 31 226 57 200 70 174 57 174 31Z" />
      <path className={gilt} d="M186 34h6M186 44h6M186 54h6M208 34h6M208 44h6M208 54h6" />
      <path className={gilt} d="M192 34 208 54M192 44h16M192 54 208 34" />
      <path className={`${ink} ${dash}`} d="M198 70C172 84 112 84 78 72" />
      <path className={ink} d="M84 68 76 71.6 83 76" />
    </g>
  ),

  /* Delivery logistics: a docket envelope, the optimised route out of the
     depot through its stops, and the roster it lands on with one allocation
     spanning two days. approach[0], [1], [3]. */
  "delivery-logistics": (
    <g>
      <rect className={ink} x="30" y="28" width="52" height="34" rx="4" />
      <path className={ink} d="M30 32 56 50 82 32" />
      <path className={gilt} d="M92 45h26M110 40l8 5-8 5" />
      <path className={ink} d="M140 64 170 28 204 52 232 20 258 60" />
      {[[170, 28], [204, 52], [232, 20], [258, 60]].map(([x, y]) => (
        <circle key={x} className={dot} cx={x} cy={y} r="3" />
      ))}
      <circle className={gilt} cx="140" cy="64" r="7" />
      <circle className={dotGilt} cx="140" cy="64" r="2.6" />
      <rect className={ink} x="282" y="16" width="92" height="58" rx="5" />
      <path className={`${ink} ${styles.faint}`} d="M282 30h92M305 30v44M328 30v44M351 30v44M282 52h92" />
      <rect className={gilt} x="309" y="36" width="38" height="11" rx="2.5" />
    </g>
  ),

  /* RTO LMS: the learner journey running left to right into a
     regulator-recognised credential. approach[0], approach[4]. */
  "rto-lms": (
    <g>
      <path className={gilt} d="M310 54 306 80 320 72 334 80 330 54" />
      <path className={ink} d="M44 74 108 62 172 50 236 40" />
      {[[44, 74], [108, 62], [172, 50], [236, 40]].map(([x, y]) => (
        <circle key={x} className={dot} cx={x} cy={y} r="3.4" />
      ))}
      <path className={ink} d="M244 40H288M280 35l8 5-8 5" />
      <circle className={gilt} cx="320" cy="36" r="22" />
      <circle className={gilt} cx="320" cy="36" r="13" />
      <path
        className={gilt}
        d="M336 36h5M333.9 44l4.3 2.5M328 49.9l2.5 4.3M320 52v5M312 49.9l-2.5 4.3M306.1 44l-4.3 2.5M304 36h-5M306.1 28l-4.3-2.5M312 22.1l-2.5-4.3M320 20v-5M328 22.1l2.5-4.3M333.9 28l4.3-2.5"
      />
    </g>
  ),

  /* Paper.js takeoff: a plan under a rule grid, one measured area, a linear
     run, count markers and a dimension line. approach[0]-[1]. */
  "construction-takeoff": (
    <g>
      <defs>
        <clipPath id="cs-takeoff-area">
          <path d="M118 22 214 16 240 60 140 72Z" />
        </clipPath>
      </defs>
      <path className={`${gilt} ${styles.faint}`} d="M40 0v89M76 0v89M112 0v89M148 0v89M184 0v89M220 0v89M256 0v89M292 0v89M328 0v89M364 0v89M0 17h400M0 44h400M0 71h400" />
      <g clipPath="url(#cs-takeoff-area)">
        <path className={`${gilt} ${styles.faint}`} d="M100 0 140 89M130 0 170 89M160 0 200 89M190 0 230 89M220 0 260 89" />
      </g>
      <path className={ink} d="M118 22 214 16 240 60 140 72Z" />
      <path className={ink} d="M44 62 76 34 108 50" />
      {[[44, 62], [76, 34], [108, 50]].map(([x, y]) => (
        <circle key={x} className={dot} cx={x} cy={y} r="2.8" />
      ))}
      <path className={gilt} d="M272 22l8 8m0-8l-8 8M296 36l8 8m0-8l-8 8M282 48l8 8m0-8l-8 8" />
      <path className={ink} d="M62 82H338M62 76v12M338 76v12M200 78v8" />
    </g>
  ),

  /* Service desk: a Twilio call feeding the fields the extension used to make
     someone type. approach[0]-[1]. */
  "service-desk-automation": (
    <g>
      <path
        className={ink}
        d="M40 37v10M52 31v22M64 25v34M76 33v18M88 22v40M100 28v28M112 20v44M124 32v20M136 27v30M148 36v12"
      />
      <path className={gilt} d="M162 42h30M184 37l8 5-8 5" />
      <rect className={ink} x="206" y="14" width="156" height="60" rx="7" />
      <path className={`${ink} ${styles.faint}`} d="M206 30h156" />
      <path className={gilt} d="M220 44h64M220 56h96" />
      <path className={`${ink} ${dash}`} d="M220 66h44" />
      <path className={dotGilt} d="M218 20h4v4h-4z" />
    </g>
  ),

  /* Sprachkraft: the seven pages that shipped, as the site map they were
     scoped as. approach[0]. */
  sprachkraft: (
    <g>
      <rect className={gilt} x="176" y="12" width="48" height="22" rx="4" />
      <path className={gilt} d="M200 34v12" />
      <path className={ink} d="M50 46H340M50 46v12M108 46v12M166 46v12M224 46v12M282 46v12M340 46v12" />
      {[30, 88, 146, 204, 262, 320].map((x) => (
        <g key={x}>
          <rect className={ink} x={x} y="58" width="40" height="20" rx="3.5" />
          <path className={`${ink} ${styles.faint}`} d={`M${x + 8} 70h24`} />
        </g>
      ))}
      <path className={dotGilt} d="M196 19h8v8h-8z" />
    </g>
  ),
};

/** A document with a folded corner, used by the EDI mark. */
function Doc({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className={ink} d="M0 0h19l7 7v25H0Z" />
      <path className={ink} d="M19 0v7h7" />
      <path className={`${ink} ${styles.faint}`} d="M6 14h13M6 20h13M6 26h8" />
    </g>
  );
}
