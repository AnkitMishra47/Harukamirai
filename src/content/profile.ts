import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ankit Mishra",
  nameLines: ["ANKIT", "MISHRA"],
  title: "Senior Software Engineer · AI & Automation",
  location: "Faridabad, Haryana, India",
  employer: { name: "OneIT", href: "https://oneit.com.au", country: "Australia" },
  summary:
    "Software engineer building enterprise-grade Java and Angular systems and AI-assisted engineering workflows for international clients at OneIT (Australia). Owns features end-to-end across REST APIs, PostgreSQL data modeling, PrimeNG front-ends and XML/EDI middleware, and has shipped production RAG pipelines on pgvector at multi-million-row scale. Promoted from Intern to Senior Software Engineer and named Developer of the Year for consistent technical impact, production ownership and cross-team delivery.",
  heroLine:
    "From BCA to Senior Software Engineer in three years, with a Master's earned in the cracks between deploys. I ship AI features - RAG on pgvector, AI-assisted code and test generation, MCP tooling - into Java, Angular and Python platforms at",
  email: "ankitm17.2001@gmail.com",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/ankitmishra47", external: true },
    { label: "Email", href: "mailto:ankitm17.2001@gmail.com" },
  ],
  resumePdf: "/docs/AnkitResume.pdf",
  domain: "harukamirai.engineer",
};
