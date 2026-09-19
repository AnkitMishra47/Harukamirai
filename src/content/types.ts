export type Link = {
  label: string;
  href: string;
  external?: boolean;
  /** Display value, e.g. the handle, when it differs from the label. */
  value?: string;
  /** One-line note shown under the link on the Contact page. */
  note?: string;
};

export type Profile = {
  name: string;
  nameLines: [string, string];
  title: string;
  location: string;
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
   * Intrinsic pixel size of the file on disk. Layouts size frames from the
   * real aspect ratio instead of cropping to a fixed one, and next/image gets
   * intrinsic dimensions. `content.test.ts` checks these against the files.
   */
  width: number;
  height: number;
  blurDataURL?: string;
};
