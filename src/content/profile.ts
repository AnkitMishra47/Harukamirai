import type { Profile } from "./types";

export const profile: Profile = {
  name: "Ankit Mishra",
  nameLines: ["ANKIT", "MISHRA"],
  title: "Senior Software Engineer · AI & Core Systems",
  location: "India",
  workingHours: { zone: "AWST", offset: "UTC+8" },
  employer: { name: "OneIT", href: "https://oneit.com.au", country: "Australia" },
  summary:
    "Senior software engineer building enterprise-grade Java and Angular systems, resilient middleware, and production AI workflows for international clients at OneIT (Australia). Owns features end-to-end across REST APIs, PostgreSQL data modeling, PrimeNG front-ends and XML/EDI middleware, and has shipped production RAG pipelines on pgvector at multi-million-row scale. Promoted from Intern to Senior Software Engineer and named Developer of the Year for consistent technical impact, production ownership and cross-team delivery.",
  heroLine:
    "From Bachelor's in Computer Applications to Senior Software Engineer in three years, with a Master's earned in the cracks between deploys. I architect high-scale backend platforms, enterprise integrations, and production AI workflows at",
  email: "ankitm17.2001@gmail.com",
  bio: [
    "I'm Ankit, a software engineer working remotely. I work full-time at **OneIT** - an Australian software firm - where I've moved from intern to **Senior Software Engineer** over three years, mostly on backend systems (Java, Spring Boot, Postgres), enterprise integrations (MYOB, CargoWise, Twilio, Xero) and AI in production (RAG on pgvector, MCP tooling, AI-assisted code and test generation). In 2024 I was named **Mid Developer of the Year**. In 2025, I placed **Runner-up for Employee of the Year** - company-wide, across all engineering tiers.",
    "I picked up a Master's degree (MCA) from Chandigarh University while doing this. The two years overlapped completely with my full-time work, which means I've debugged production at 11pm on a Tuesday before a 9am exam more times than I'd like to admit. I'm not sure I'd recommend it - but it taught me how to ship.",
    "Outside work, I like quiet things - chess, manga, long-format anime, the kind of coffee that takes ten minutes to make, and the occasional walk that ends in a river. I read more than I post. The five-leaf clover at the top of this page is not a logo; it's a switch. Click it.",
  ],
  motto: { en: "Push past my limit.", jp: "限界を超える" },
  links: [
    { label: "Email", value: "ankitm17.2001@gmail.com", href: "mailto:ankitm17.2001@gmail.com", note: "The fastest way. I read everything." },
    { label: "LinkedIn", value: "/in/ankitmishra47", href: "https://www.linkedin.com/in/ankitmishra47", external: true, note: "Career arc, recommendations, and a still-too-old About section." },
    { label: "GitHub", value: "github.com/AnkitMishra47", href: "https://github.com/AnkitMishra47", external: true, note: "Sandbox and learning repos. Production work lives in private OneIT repos." },
    { label: "Chess.com", value: "ankit_0047", href: "https://www.chess.com/member/ankit_0047", external: true, personal: true },
  ],
  resumePdf: "/docs/AnkitResume.pdf",
  domain: "harukamirai.engineer",
  siteUrl: "https://www.harukamirai.engineer",
};
