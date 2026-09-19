import { caseStudies, timeline, skills, profile } from "@/content";

export interface SearchResultItem {
  id: string;
  type: "case-study" | "milestone" | "skill" | "action";
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  url?: string;
  actionId?: "open-recruiter-brief" | "open-shutter-story";
}

export interface SuggestionChip {
  id: string;
  label: string;
  query: string;
  icon: string;
}

/*
 * Order is the packing order, not a ranking - with one exception.
 *
 * The recruiter brief stays first because it is the one a recruiter is here for.
 * The rest are sequenced by how well their widths tile a phone: measured greedily
 * against 360/390/412/430px, this order fits the six charms in four rows at
 * 412px where the previous one needed five. The widest charm ("Storyline") goes
 * last, where a part-used row costs least.
 */
export const SUGGESTED_QUERIES: SuggestionChip[] = [
  { id: "sug-exec", label: "Executive Recruiter Brief", query: "Executive Brief", icon: "✦" },
  { id: "sug-sprach", label: "1-Day Client Delivery", query: "Sprachkraft", icon: "🚀" },
  { id: "sug-resume", label: "Official Resume PDF", query: "Resume PDF", icon: "📄" },
  { id: "sug-email", label: "Send Direct Email", query: "Email Ankit", icon: "✉" },
  { id: "sug-rag", label: "PostgreSQL 25M+ Vectors", query: "RAG Systems", icon: "⚡" },
  { id: "sug-story", label: "Storyline (6 Cinematic Acts)", query: "Storyline", icon: "📖" },
];

export function searchCareerIndex(rawQuery: string): SearchResultItem[] {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    // Curated high-signal quick actions when search is empty
    return [
      {
        id: "action-recruiter-brief",
        type: "action",
        title: "Executive Recruiter Brief",
        subtitle: "Executive Summary · 3 Career Milestones · OneIT",
        description: "High-level overview of Ankit's career arc, 25M+ vector scale, awards, and direct download links.",
        badge: "Executive Brief",
        actionId: "open-recruiter-brief",
      },
      {
        id: "action-shutter-story",
        type: "action",
        title: "The Sanctuary of Haruka Mirai",
        subtitle: "Cinematic Storyline · 6 Acts",
        description: "Atmospheric narrative through early ambition, the battlestation, production scale, and firm honours.",
        badge: "Storyline",
        actionId: "open-shutter-story",
      },
      {
        id: "action-resume-pdf",
        type: "action",
        title: "Official Resume PDF",
        subtitle: "Verified Credentials · Latest Version",
        description: "Official PDF resume matching all production engineering roles, metrics, and academic honours.",
        badge: "Resume PDF",
        url: profile.resumePdf,
      },
      {
        id: "cs-rag",
        type: "case-study",
        title: "RAG over 25M+ Embeddings on PostgreSQL",
        subtitle: "Knowledge Retrieval · OneIT",
        description: "HNSW index tuning, sub-15ms filtered cosine search, bloat and VACUUM stall mitigation in production.",
        badge: "25M+ Vectors",
        url: "/work#rag-platform",
      },
      {
        id: "cs-sprachkraft",
        type: "case-study",
        title: "The Sprachkraft 1-Day Client Platform",
        subtitle: "Rapid Delivery · Next.js · Full Production",
        description: "Scoped, engineered, and deployed a 7-page bilingual study-abroad consultancy platform in 24 hours.",
        badge: "1-Day Delivery",
        url: "/work#sprachkraft",
      },
      {
        id: "action-contact",
        type: "action",
        title: "Email Ankit Mishra",
        subtitle: "Direct Contact · ankitm17.2001@gmail.com",
        description: "Fastest response via email. Open to senior engineering and staff opportunities.",
        badge: "Direct Email",
        url: `mailto:${profile.links.find((l) => l.label === "Email")?.value || "ankitm17.2001@gmail.com"}`,
      },
    ];
  }

  const terms = query.split(/\s+/).filter(Boolean);
  const items: SearchResultItem[] = [];

  // Special matchers for recruiter / story / resume / contact
  if (query.includes("recruit") || query.includes("brief") || query.includes("summary") || query.includes("exec")) {
    items.push({
      id: "action-recruiter-brief",
      type: "action",
      title: "Executive Recruiter Brief",
      subtitle: "Executive Overview · 3 Career Milestones · OneIT",
      description: "Quick scannable summary designed for hiring managers and recruiters.",
      badge: "Executive Brief",
      actionId: "open-recruiter-brief",
    });
  }

  if (query.includes("story") || query.includes("lore") || query.includes("tour") || query.includes("play") || query.includes("journey") || query.includes("shutter")) {
    items.push({
      id: "action-shutter-story",
      type: "action",
      title: "The Sanctuary of Haruka Mirai",
      subtitle: "Cinematic Storyline · 6 Acts",
      description: "Atmospheric narrative through early ambition, the battlestation, production scale, and firm honours.",
      badge: "Storyline",
      actionId: "open-shutter-story",
    });
  }

  if (query.includes("resume") || query.includes("cv") || query.includes("pdf") || query.includes("download") || query.includes("scroll")) {
    items.push({
      id: "action-resume-pdf",
      type: "action",
      title: "Official Resume PDF",
      subtitle: "Verified Credentials · Latest Version",
      description: "Direct download of Ankit Mishra's verified resume PDF.",
      badge: "Resume PDF",
      url: profile.resumePdf,
    });
  }

  if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("message")) {
    items.push({
      id: "action-contact",
      type: "action",
      title: "Email Ankit Mishra",
      subtitle: "Direct Contact · ankitm17.2001@gmail.com",
      description: "Send an email directly to Ankit.",
      badge: "Direct Email",
      url: `mailto:${profile.links.find((l) => l.label === "Email")?.value || "ankitm17.2001@gmail.com"}`,
    });
  }

  // Search case studies
  for (const cs of caseStudies) {
    const textCorpus = `${cs.title} ${cs.domain} ${cs.problem} ${cs.approach.join(" ")} ${cs.result} ${cs.stack.join(" ")} ${cs.kicker}`.toLowerCase();
    const matches = terms.some((t) => textCorpus.includes(t));

    if (matches) {
      items.push({
        id: `cs-${cs.slug}`,
        type: "case-study",
        title: cs.title,
        subtitle: `${cs.kicker} · ${cs.org.toUpperCase()}`,
        description: cs.problem,
        badge: cs.metrics[0]?.value || "Case Study",
        url: `/work#${cs.slug}`,
      });
    }
  }

  // Search timeline / career milestones
  for (const t of timeline) {
    const corpus = `${t.title} ${t.note} ${t.date} ${t.kind}`.toLowerCase();
    const matches = terms.some((t) => corpus.includes(t));

    if (matches) {
      items.push({
        id: `time-${t.id}`,
        type: "milestone",
        title: t.title,
        subtitle: `${t.date} · ${t.kind.toUpperCase()}`,
        description: t.note,
        badge: t.date,
        url: "/about",
      });
    }
  }

  // Search skills
  for (const g of skills) {
    for (const skill of g.items) {
      if (terms.some((t) => skill.toLowerCase().includes(t) || g.label.toLowerCase().includes(t))) {
        items.push({
          id: `skill-${skill.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
          type: "skill",
          title: skill,
          subtitle: `Technical Discipline · ${g.label}`,
          description: `Part of verified technical stack at OneIT and production systems.`,
          badge: g.label,
          url: "/about",
        });
      }
    }
  }

  // Deduplicate by ID
  const seen = new Set<string>();
  const unique = items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return unique.slice(0, 7);
}
