export type Link = { label: string; href: string; external?: boolean };

export type Profile = {
  name: string;
  nameLines: [string, string];
  title: string;
  location: string;
  employer: { name: string; href: string; country: string };
  summary: string;
  heroLine: string;
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
