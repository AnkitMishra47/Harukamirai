import type { DisciplinePillar, SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  { id: "languages", label: "Languages", items: ["Java", "TypeScript", "JavaScript", "Python", "SQL", "Bash"] },
  { id: "ai", label: "AI / LLM", items: ["LLM test automation (1iT-TestRobot)", "Multi-agent LLM pipelines", "RAG", "Vector embeddings", "pgvector (HNSW)", "LLM API integration", "Agentic code-gen and test-gen pipelines"] },
  { id: "backend", label: "Backend", items: ["Java enterprise framework", "Spring Boot", "REST API design", "XML/JSON processing", "Middleware", "Async and retry patterns"] },
  { id: "frontend", label: "Frontend", items: ["Angular", "PrimeNG", "HTML5/CSS3", "Paper.js canvas", "React", "Responsive UI"] },
  { id: "data", label: "Data", items: ["PostgreSQL", "MySQL", "Schema design", "Query and index tuning", "VACUUM and bloat management"] },
  { id: "integrations", label: "Integrations", items: ["MYOB", "CargoWise", "ERP and WMS", "XML/EDI", "SharePoint (Graph)", "Twilio", "HaloPSA"] },
  { id: "devops", label: "DevOps", items: ["Git/SmartGit", "Jenkins CI/CD", "Docker", "Linux", "Release management"] },
  { id: "practices", label: "Practices", items: ["Agile/Scrum", "Code review", "Root-cause analysis", "Production support", "Performance tuning"] },
];

export const disciplines: DisciplinePillar[] = [
  {
    id: "ai-retrieval",
    numeral: "I",
    title: "Applied AI & Test Automation",
    subtitle: "AI Systems",
    scaleBadge: "Test Automation · RAG",
    summary: "LLM-driven test automation, production RAG pipelines, source-consistent vector retrieval, and agentic LLM workflows.",
    technologies: ["Python", "Selenium", "PostgreSQL / pgvector", "FastMCP", "OpenAI / Claude APIs"],
    highlights: [
      "1iT-TestRobot: plain-English test plans turned into Selenium actions by LLM agents, with every failure triaged as design drift or a real defect.",
      "Filtered vector retrieval across 2.5M+ rows with automated vacuum & delta-sync reconciliation.",
      "Production RAG architectures with pgvector (HNSW) indexing and autonomous agentic workflows.",
    ],
  },
  {
    id: "enterprise-backend",
    numeral: "II",
    title: "Enterprise Backend & EDI Middleware",
    subtitle: "Backend & Systems",
    scaleBadge: "Java 21 · Zero-Loss EDI",
    summary: "Mission-critical transactional services, asynchronous pipelines, and ERP integrations.",
    technologies: ["Java 21 / Spring", "PostgreSQL", "XML / EDI X12", "Async Queues", "Docker"],
    highlights: [
      "Zero data-loss XML/EDI pipeline connecting MYOB accounting and CargoWise freight logistics.",
      "High-throughput transactional Java services with resilient retry policies and async event queues.",
    ],
  },
  {
    id: "frontend-canvas",
    numeral: "III",
    title: "Modern Frontend & Canvas Workflows",
    subtitle: "Frontend & Canvas",
    scaleBadge: "Angular 19 · Paper.js",
    summary: "High-density enterprise web apps, interactive vector canvas, and responsive UX.",
    technologies: ["Angular 19", "TypeScript", "Paper.js", "PrimeNG", "Next.js", "Tailwind CSS"],
    highlights: [
      "Interactive construction takeoff canvas inside Angular 19 generating live BOQ estimates.",
      "Pixel-precise SVG/vector rendering and stateful high-density enterprise UI suites.",
    ],
  },
  {
    id: "distributed-data",
    numeral: "IV",
    title: "Distributed Data & Telemetry",
    subtitle: "Data & Telemetry",
    scaleBadge: "TimescaleDB · Multi-Site",
    summary: "Hub-and-spoke multi-site replication, time-series telemetry, and database optimization.",
    technologies: ["PostgreSQL", "TimescaleDB", "SymmetricDS", "Grafana", "Linux / Shell"],
    highlights: [
      "Multi-node PostgreSQL optimization, query & index tuning, and automated health monitoring.",
    ],
  },
  {
    id: "integrations-compliance",
    numeral: "V",
    title: "Integrations & Regulatory Protocols",
    subtitle: "Integrations & APIs",
    scaleBadge: "National Compliance",
    summary: "Automated billing gateways, telephony workflows, and national government registries.",
    technologies: ["Xero API", "Eway Payments", "Australian USI Registry", "Twilio", "Chrome Extensions"],
    highlights: [
      "Two-way invoice reconciliation, recurring billing, and automated government identity validation.",
      "Webhooks orchestration, SMS dispatch pipelines, and browser automation tools.",
    ],
  },
];
