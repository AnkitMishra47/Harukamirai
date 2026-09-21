import type { CaseStudy } from "./types";

/**
 * Order here is the order on the Work page. `featured` entries also appear on
 * the home page. Every fact traces to the September 2026 resume, the content
 * brief, or a prior statement by Ankit. Metrics stay NDA-safe.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "rag-platform",
    org: "oneit",
    kicker: "AI platform · Enterprise knowledge retrieval",
    title: "RAG over 2.5M+ embeddings on PostgreSQL",
    domain:
      "Enterprise document search across OneIT's product family: SharePoint libraries, equipment manuals, internal documentation and historical tickets, served behind product-specific assistants.",
    problem:
      "Make LLM features accurate and cheap enough to ship inside products customers pay for, over corpora that keep changing, without the vector store drifting out of sync with the source documents.",
    approach: [
      "Ingestion and sync of enterprise documents from SharePoint (Microsoft Graph API) into a PostgreSQL embeddings store with chunking, filtered vector search and HNSW indexing on pgvector.",
      "Store grew past 2.5 million rows; diagnosed and fixed index bloat, VACUUM stalls and orphaned-record drift.",
      "Reconciliation tooling that keeps file state and vector state consistent so deleted or replaced documents never resurface in answers.",
      "MCP-style tool layer giving the LLM controlled access to live product APIs instead of free-form generation.",
      "AI-assisted engineering workflow: plain-English requirements become structured specs, code scaffolds and generated tests, with validation loops before anything reaches review.",
    ],
    result:
      "RAG, tool access and AI-assisted code and test generation running against real product APIs in production, with a vector store that stays consistent with its sources at multi-million-row scale.",
    metrics: [
      { label: "Scale", value: "2.5M+ embedding rows" },
      { label: "Index", value: "pgvector · HNSW" },
      { label: "Stage", value: "In production" },
    ],
    stack: ["Python", "PostgreSQL", "pgvector", "SharePoint Graph API", "LLM APIs", "MCP tooling", "Java integration"],
    featured: true,
  },
  {
    slug: "mining-cms",
    org: "oneit",
    kicker: "Multi-site platform · Industrial operations",
    title: "Hub-and-spoke CMS for a national mining-services operator",
    domain:
      "An Australian mining-services operator running independent site instances of the same Java platform across geographically distributed locations.",
    problem:
      "Each site needed to run autonomously - collecting equipment telemetry, alerts, and operational events into its own database - while feeding a central server for cross-site analytics, executive dashboards, and disaster-recovery backup.",
    approach: [
      "Java + Angular application deployed as independent site instances, each with a local PostgreSQL/TimescaleDB store for time-series equipment data.",
      "SymmetricDS hub-and-spoke replication: sites act as leaf nodes, replicating writes to a master server asynchronously with conflict resolution and staged onboarding for new sites.",
      "Ingestion pipeline for device-generated JSON payloads - alerts, telemetry samples, event history - with unit conversions, custom alert-threshold evaluation, and email notifications.",
      "Grafana dashboards over the central database for cross-site fleet analytics; periodic sync from a secondary MS SQL Server for machine metadata.",
      "RAG conversational agent on top of live metrics + a PDF manuals knowledge base (embeddings) so on-site staff can ask natural-language questions over equipment history.",
    ],
    result:
      "Sites run autonomously and survive WAN drops; replicated state catches up to the central server when connectivity returns. New-site onboarding became a staged checklist, not a one-off engineering project.",
    metrics: [
      { label: "Pattern", value: "Hub-and-spoke" },
      { label: "Data model", value: "Time-series + replication" },
      { label: "My role", value: "Backend + integrations" },
    ],
    stack: ["Java", "Angular", "PostgreSQL · TimescaleDB", "SymmetricDS", "Grafana", "Docker", "RAG · Embeddings", "Python"],
    featured: true,
  },
  {
    slug: "integration-middleware",
    org: "oneit",
    kicker: "Enterprise integration · Accounting and logistics",
    title: "MYOB and CargoWise middleware over XML/EDI",
    domain:
      "Integration workflows connecting ERP and warehouse-management systems with MYOB accounting and CargoWise logistics platforms for Australian clients.",
    problem:
      "Financial and shipment data was re-keyed between systems by hand. The platforms speak different schemas, fail independently and cannot be assumed to be up at the same time.",
    approach: [
      "Schema-validated XML/EDI exchange with transformation modules serving multiple downstream consumers.",
      "Configurable mapping layer so a new client's field mapping is configuration, not code.",
      "Fault-tolerant asynchronous middleware: retries, dead-lettering and structured error handling between platforms.",
      "File-based and REST exchange paths for partners that cannot expose an API.",
    ],
    result:
      "End-to-end sync of financial and shipment data with no manual entry or reconciliation, and failures that queue and recover instead of silently dropping records.",
    metrics: [
      { label: "Systems", value: "MYOB · CargoWise · ERP · WMS" },
      { label: "Transport", value: "XML/EDI · REST · files" },
      { label: "Failure mode", value: "Retry + dead-letter" },
    ],
    stack: ["Java", "XML/EDI", "JSON", "REST", "Async messaging", "PostgreSQL"],
  },
  {
    slug: "rto-lms",
    org: "oneit",
    kicker: "Compliance LMS · Australian RTO sector",
    title: "End-to-end LMS for a national Registered Training Organisation",
    domain:
      "A national Australian RTO needing a single platform to author courses, deliver them online, issue regulator-recognised certificates, run their billing, and stay compliant with national identifier rules.",
    problem:
      "Replace a fragmented stack (separate course, finance, and certificate tools) with one Angular + Java platform that owned the full learner journey - from enrolment and payment through to government-issued credentialing.",
    approach: [
      "Course authoring + delivery surface: lessons, assessments, learner progress, certificate generation on completion.",
      "Mailouts / lifecycle email: enrolment confirmation, due-date reminders, expiry warnings, certificate dispatch.",
      "Finance module - invoice generation, reconciliation, refunds - with two-way Xero accounting integration so finance staff never re-key a transaction.",
      "Eway payment gateway integration for card-on-file enrolments and recurring training subscriptions.",
      "USI (Unique Student Identifier) integration with the Australian government registry for compliant credential issuance - a hard regulatory requirement for any RTO.",
    ],
    result:
      "One platform owns the full learner journey - enrolment, payment, delivery, credentialing - so finance never re-keys a transaction and USIs are verified inline at enrolment.",
    metrics: [
      { label: "Compliance", value: "USI · regulator-recognised" },
      { label: "Integrations", value: "Xero · Eway · USI" },
      { label: "Surface", value: "Author → enrol → certify" },
    ],
    stack: ["Angular (modern)", "Java · Spring", "PostgreSQL", "Xero API", "Eway", "USI Registry API", "PrimeNG", "PDF generation"],
  },
  {
    slug: "construction-takeoff",
    org: "oneit",
    kicker: "Interactive canvas · Construction takeoff",
    title: "Drawing-based takeoff, measure sheets & BOQ on Paper.js",
    domain:
      "An estimating surface for construction / quantity-surveying workflows - estimators mark up plan drawings to extract quantities into measure sheets, SOR (Schedule of Rates), and BOQ (Bill of Quantities) outputs.",
    problem:
      "Takeoffs were being done by hand on PDFs and re-keyed into spreadsheets, with no audit trail back to the drawing. The team needed a canvas where lines, areas, and count markers trace directly on the plan and flow into a typed measure sheet that rolls up into SOR / BOQ totals.",
    approach: [
      "Paper.js canvas embedded in an Angular 19 component, with linear-measure, polygon-area, and count-marker tools each tied to a rate-coded item in the catalogue.",
      "Drawing-scale calibration and multi-page plan support so measurements come out in real-world units, not pixels.",
      "Live measure sheet: every shape on the canvas writes back to a typed measurement row that rolls into SOR and BOQ totals - no re-keying into Excel.",
      "Serialisable canvas state so a takeoff can be reopened, audited, and revised; state-bridged into the wider Angular form/data model without DOM leaks.",
    ],
    result:
      "Replaced the manual drawing → spreadsheet handoff with a single auditable surface. Included here as a clean example of bringing a non-React, non-DOM rendering library into a modern Angular app and modelling a real quantitative workflow on top of it.",
    metrics: [
      { label: "Surface", value: "Paper.js · Angular 19" },
      { label: "Domain", value: "Takeoff · SOR · BOQ" },
      { label: "Output", value: "Measure sheets" },
    ],
    stack: ["Angular 19", "Paper.js", "TypeScript", "PrimeNG", "PDF rendering"],
  },
  {
    slug: "service-desk-automation",
    org: "oneit",
    kicker: "Internal tooling · Service desk",
    title: "Twilio call workflows and a HaloPSA Chrome extension",
    domain: "Automation for OneIT's support teams working in HaloPSA.",
    problem:
      "Support staff were typing the same ticket data from spreadsheets into HaloPSA forms and handling calls with no link back to the ticket.",
    approach: [
      "Twilio-driven call workflows tied to the ticketing system.",
      "Chrome extension (JavaScript) that reads an Excel sheet and auto-fills HaloPSA forms, field by field, with validation before submit.",
    ],
    result: "Repetitive data entry removed from the support workflow.",
    metrics: [
      { label: "Surface", value: "Chrome extension" },
      { label: "Telephony", value: "Twilio" },
      { label: "Target", value: "HaloPSA" },
    ],
    stack: ["JavaScript", "Chrome Extensions API", "Twilio", "HaloPSA API", "Excel"],
  },
  {
    slug: "sprachkraft",
    org: "independent",
    kicker: "Client · Next.js · 2025",
    title: "The Sprachkraft",
    domain:
      "Full-stack bilingual educational portal with custom lead-capture pipelines, automated WhatsApp dispatch, and sub-second global edge delivery for an international consultancy.",
    problem: "The client needed a public site with lead capture, live in a day.",
    approach: [
      "7-page Next.js production site, App Router + TypeScript, scoped and shipped end-to-end in a single day.",
      "Bilingual content scaffolding for English / German routes.",
      "Contact + lead-capture flow with WhatsApp deep-link CTA.",
      "Deployed to Vercel; custom domain on day one.",
      "Wrote the README and handed off the keys.",
    ],
    result: "Live at thesprachkraft.com, handed over with documentation the client can maintain.",
    metrics: [
      { label: "Pages", value: "7" },
      { label: "Time", value: "1 day" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
    links: [{ label: "thesprachkraft.com", href: "https://thesprachkraft.com/", external: true }],
  },
];
