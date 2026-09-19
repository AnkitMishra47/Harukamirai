import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  { id: "languages", label: "Languages", items: ["Java", "TypeScript", "JavaScript", "Python", "SQL", "Bash"] },
  { id: "ai", label: "AI / LLM", items: ["RAG", "Vector embeddings", "pgvector (HNSW)", "Prompt engineering", "LLM API integration", "Agentic code-gen and test-gen pipelines"] },
  { id: "backend", label: "Backend", items: ["Java enterprise framework", "Spring Boot", "REST API design", "XML/JSON processing", "Middleware", "Async and retry patterns"] },
  { id: "frontend", label: "Frontend", items: ["Angular", "PrimeNG", "HTML5/CSS3", "Paper.js canvas", "React", "Responsive UI"] },
  { id: "data", label: "Data", items: ["PostgreSQL", "MySQL", "Schema design", "Query and index tuning", "VACUUM and bloat management"] },
  { id: "integrations", label: "Integrations", items: ["MYOB", "CargoWise", "ERP and WMS", "XML/EDI", "SharePoint (Graph)", "Twilio", "HaloPSA"] },
  { id: "devops", label: "DevOps", items: ["Git/SmartGit", "Jenkins CI/CD", "Docker", "Linux", "Release management"] },
  { id: "practices", label: "Practices", items: ["Agile/Scrum", "Code review", "Root-cause analysis", "Production support", "Performance tuning"] },
];
