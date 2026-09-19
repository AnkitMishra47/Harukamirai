import type { TimelineEntry } from "./types";

export const timeline: TimelineEntry[] = [
  { id: "bca", date: "2019 - 2022", title: "BCA, GGSIPU (USMS)", note: "Graduated with 86%. First portfolio shipped in 2022.", kind: "education" },
  { id: "oneit-intern", date: "Jul 2022", title: "Junior SWE Intern, OneIT", note: "Joined right after graduation. Java and Angular on the Cougar platform.", kind: "role" },
  { id: "mca-start", date: "Sep 2022", title: "MCA begins, Chandigarh University", note: "Two-year Master's, started while working full-time.", kind: "education" },
  { id: "oneit-junior", date: "Jan 2023", title: "Junior Software Engineer", note: "First promotion.", kind: "role" },
  { id: "oneit-se", date: "Oct 2023", title: "Software Engineer", note: "Owned Cougar infrastructure work, APIs, JSON/XML, Postgres.", kind: "role" },
  { id: "mca-done", date: "Sep 2024", title: "MCA completed", note: "While shipping production code.", kind: "education" },
  { id: "award-2024", date: "Oct 2024", title: "Associate Senior SWE · Mid Developer of the Year 2024", note: "Signed by MD David Barton. Stack expanded into Python, Flask, Twilio and Ionic.", kind: "award" },
  { id: "award-2025", date: "2025", title: "Senior Software Engineer · Runner-up, Employee of the Year 2025", note: "Company-wide recognition across all engineering tiers. Owns AI/RAG platform work end-to-end: ingestion, pgvector search, LLM orchestration, developer tooling.", kind: "award" },
  { id: "now", date: "Now", title: "harukamirai.engineer", note: "Building this. Java, Angular, Python, and whatever the next ticket needs.", kind: "milestone" },
];
