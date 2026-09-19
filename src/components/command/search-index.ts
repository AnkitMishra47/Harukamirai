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

export const SUGGESTED_QUERIES = [
  "Executive Brief",
  "Storyline",
  "RAG & pgvector",
  "3 Promotions",
  "Resume PDF",
  "Sprachkraft",
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
        subtitle: "Executive Summary · 3 Promotions · OneIT",
        description: "Fast high-level overview of Ankit's career arc, 25M+ vector scale, awards, and direct download links.",
        badge: "Executive Summary",
        actionId: "open-recruiter-brief",
      },
      {
        id: "action-shutter-story",
        type: "action",
        title: "Experience Cinematic Storyline",
        subtitle: "The Sanctuary of Haruka Mirai · 6 Acts",
        description: "Atmospheric narrative through early ambition, the battlestation, production scale, and firm honours.",
        badge: "Storyline",
        actionId: "open-shutter-story",
      },
      {
        id: "action-resume-pdf",
        type: "action",
        title: "Download Official Resume PDF",
        subtitle: "Verified Credentials · Latest Version",
        description: "Official PDF resume matching all production engineering roles, metrics, and academic honours.",
        badge: "PDF Document",
        url: profile.resumePdf,
      },
      {
        id: "cs-rag",
        type: "case-study",
        title: "RAG over 25M+ Embeddings on PostgreSQL",
        subtitle: "Enterprise Knowledge Retrieval · OneIT",
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
      subtitle: "Executive Overview · 3 Promotions · OneIT",
      description: "Quick scannable summary designed for hiring managers and recruiters.",
      badge: "Executive Summary",
      actionId: "open-recruiter-brief",
    });
  }

  if (query.includes("story") || query.includes("tour") || query.includes("play") || query.includes("journey") || query.includes("shutter")) {
    items.push({
      id: "action-shutter-story",
      type: "action",
      title: "Experience Cinematic Storyline",
      subtitle: "The Sanctuary of Haruka Mirai · 6 Acts",
      description: "Atmospheric narrative through early ambition, the battlestation, production scale, and firm honours.",
      badge: "Storyline",
      actionId: "open-shutter-story",
    });
  }

  if (query.includes("resume") || query.includes("cv") || query.includes("pdf") || query.includes("download")) {
    items.push({
      id: "action-resume-pdf",
      type: "action",
      title: "Download Official Resume PDF",
      subtitle: "Verified Credentials Document",
      description: "Direct download of Ankit Mishra's verified resume PDF.",
      badge: "PDF Document",
      url: profile.resumePdf,
    });
  }

  if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("message")) {
    items.push({
      id: "action-contact",
      type: "action",
      title: "Email Ankit Mishra",
      subtitle: "ankitm17.2001@gmail.com",
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
        badge: cs.metrics[0]?.value || "Project",
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
          subtitle: `Technical Stack · ${g.label}`,
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
