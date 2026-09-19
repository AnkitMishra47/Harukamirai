export type Link = {
  label: string;
  href: string;
  external?: boolean;
  /** Display value, e.g. the handle, when it differs from the label. */
  value?: string;
  /** One-line note shown under the link on the Contact page. */
  note?: string;
  /**
   * A personal profile rather than a way to reach Ankit. Anything that asks for
   * it by label still gets it; the Contact page's list of channels leaves it
   * out, because a chess profile is not a hiring channel.
   */
  personal?: boolean;
};

export type Profile = {
  name: string;
  nameLines: [string, string];
  title: string;
  location: string;
  /**
   * The timezone Ankit keeps working hours to, as the single source of truth
   * for every page that mentions it. Label by zone only - no city.
   */
  workingHours: { zone: string; offset: string };
  employer: { name: string; href: string; country: string };
  summary: string;
  heroLine: string;
  /** About-page paragraphs. `**text**` renders bold. */
  bio: string[];
  motto: { en: string; jp: string };
  email: string;
  links: Link[];
  resumePdf: string;
  domain: string;
};

export type TimelineKind = "education" | "role" | "award" | "milestone";

export type TimelineEntry = {
  id: string;
  date: string;
  title: string;
  note: string;
  kind: TimelineKind;
};

export type SkillGroup = { id: string; label: string; items: string[] };

export type Award = { year: string; title: string; body: string };

export type Testimonial = { quote: string; attribution: string };

export type Metric = { label: string; value: string };

export type CaseStudy = {
  slug: string;
  org: "oneit" | "independent";
  kicker: string;
  title: string;
  domain: string;
  problem: string;
  approach: string[];
  result: string;
  metrics: Metric[];
  stack: string[];
  links?: Link[];
  featured?: boolean;
};

export type Photo = {
  src: string;
  alt: string;
  caption?: string;
  /**
   * Where the interesting band of a tall photograph sits, 0-100, as the
   * `object-position` Y percentage. Only consulted where a layout has to crop -
   * the story scene caps a portrait at 4:5 - and ignored everywhere a photo is
   * shown at its own shape, which is everywhere else.
   *
   * 0 keeps the top of the file, 100 keeps the bottom, 50 (the default) takes
   * the surplus evenly off both ends. Set it when a photograph has something
   * that must survive at BOTH ends, which is the only case the default gets
   * wrong.
   */
  cropAnchor?: number;
  /**
   * Where the photograph was taken, in the wording Ankit confirmed. Optional,
   * and deliberately so: most of the set has no confirmed location, and a
   * location is never inferred from what the picture looks like.
   */
  location?: string;
  /**
   * Intrinsic pixel size of the file on disk. Layouts size frames from the
   * real aspect ratio instead of cropping to a fixed one, and next/image gets
   * intrinsic dimensions. `content.test.ts` checks these against the files.
   */
  width: number;
  height: number;
  blurDataURL?: string;
};
