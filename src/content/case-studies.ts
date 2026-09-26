import type { CaseStudy } from "./types";

/**
 * Order here is the order on the Work page, most important first. `featured` entries also appear on
 * the home page. Every fact traces to the September 2026 resume, the content
 * brief, or a prior statement by Ankit. Metrics stay NDA-safe.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "test-robot",
    org: "oneit",
    kicker: "AI test automation · Developer tooling",
    title: "An LLM-driven test runner for enterprise web apps",
    domain:
      "Test automation across OneIT's enterprise client platforms: test plans written as plain-English steps, run in a real browser, and reported with evidence.",
    problem:
      "Hand-written browser scripts are slow to author and break whenever a screen changes. The runner had to turn plain-English steps into reliable browser actions, and tell a real product defect apart from a screen that was simply redesigned.",
    approach: [
      "Test plans generated from each screen's prototype, as plain-English steps a person can read rather than code.",
      "A multi-agent LLM pipeline - orchestrator, selector picker, action executor, HTML validator, disambiguation - turns each step into a Selenium action, with response caching so repeat runs skip the model.",
      "Locators prefer pt-* semantic classes, then test attributes, names and labels; visible text and position are the last resort, so selectors survive re-renders.",
      "Every failure is triaged by an LLM into design drift (a soft fail) or a real product defect (a fail), so a redesign doesn't read as a broken build.",
      "Parallel suites with an isolated browser per test, and reports carrying screenshots, HTML snapshots and a run history.",
    ],
    result:
      "Plans come from the prototype, suites run in parallel, and every failure arrives already sorted into 'the screen changed' or 'the product broke', with the screenshot and HTML to prove it. The committed suites cover 400 test cases and 4,783 steps across nine client applications (counted September 2026).",
    metrics: [
      { label: "Repeat runs", value: "Cold run once, then cached" },
      { label: "Engine", value: "LLM agents + Selenium" },
      { label: "My role", value: "Primary engineer" },
    ],
    stack: ["Python", "Selenium", "GPT-4o agents", "pt-* semantic locators", "SQLite run history", "CLI"],
    featured: true,
    flagship: true,
  },
  {
    slug: "swi-generation",
    org: "oneit",
    kicker: "Applied AI · Safety documentation",
    title: "Safe Work Instructions generated from field audio",
    domain:
      "Maintenance and safety teams at a mining contractor, who document how a task is done as a Safe Work Instruction: ordered steps, with the right figure from the OEM manual beside them.",
    problem:
      "Get from an audio recording of a task being performed, plus the OEM manual and reference photos, to a Safe Work Instruction that is structured and complete - without the model quietly dropping or reshuffling steps along the way.",
    approach: [
      "A transcript segmenter that splits the recording into task segments, with spoken formatting cues normalised before anything is classified.",
      "Rule-driven classification into steps: step grouping and edit directives, then a coverage validator that has to pass before the instruction is saved.",
      "OEM manuals ingested as PDFs, OCR'd to Markdown with a vision model, and a GPT-4o vision tool that finds and crops the relevant figures out of manual pages.",
      "Runs as queued jobs on the Java platform: the instruction is saved as a CMS record and rendered to a client PDF with Apache PDFBox.",
      "Hands-on in the code and leading the team around it: built core pieces myself, split the rest across the team, reviewed every change and fixed what came back.",
    ],
    result:
      "A recording goes in and a validated Safe Work Instruction comes out, stored in the platform and rendered as a PDF, with the manual's own figures cropped into place.",
    metrics: [
      { label: "Input", value: "Field audio + manuals" },
      { label: "Output", value: "Validated SWI · PDF" },
      { label: "My role", value: "Built and led" },
    ],
    stack: ["Java", "OpenAI GPT-4o (vision)", "Python (OCR)", "Apache PDFBox", "Message queues"],
    featured: true,
  },
  {
    slug: "rag-platform",
    org: "oneit",
    kicker: "AI platform · Enterprise knowledge retrieval",
    title: "Enterprise RAG that stays in sync with its sources",
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
      { label: "Stage", value: "In production" },
      { label: "Sync", value: "Source-reconciled" },
      { label: "Scale", value: "Multi-million rows" },
    ],
    stack: ["Python", "PostgreSQL", "pgvector", "SharePoint Graph API", "LLM APIs", "MCP tooling", "Java integration"],
    featured: true,
  },
  {
    slug: "delivery-logistics",
    org: "oneit",
    kicker: "Operations automation · Delivery & labour scheduling",
    title: "From emailed dockets to optimised routes and a drag-and-drop roster",
    domain:
      "A multi-branch delivery operation: transport tasks raised from customer PDF dockets, routed between depots and branches, with labour scheduled alongside.",
    problem:
      "Customer dockets arrive as PDF attachments. They needed to become transport tasks without being retyped, and the day's routes and crews needed planning on screens a dispatcher can drag around, not forms.",
    approach: [
      "An IMAP fetch batch that filters inbound mail by subject, pulls customer, shipping, branch and depot details and item weights out of the docket PDF with template extraction on PDFBox, matches or creates the customer, and raises the transport task with its return leg planned.",
      "Route optimisation on the Google Directions API with waypoint optimisation, plus a non-optimising recompute for when a dispatcher reorders stops by hand.",
      "Google Places autocomplete on task addresses, so the stops being routed are real places.",
      "Labour allocation and transport scheduling on a reusable FullCalendar v6 harness: drag-and-drop, calendar drops and multi-day allocation.",
      "Hands-on in the code and leading the team around it: built core pieces myself, split the rest across the team, reviewed every change and fixed what came back.",
    ],
    result:
      "Dockets turn into tasks straight from the inbox, routes come back in an optimised order, and labour is allocated by dragging on a calendar.",
    metrics: [
      { label: "Intake", value: "Email PDF → task" },
      { label: "Routing", value: "Google Directions · optimised" },
      { label: "My role", value: "Built and led" },
    ],
    stack: ["Java", "Angular 19", "Apache PDFBox", "IMAP", "Google Maps Platform", "FullCalendar v6"],
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
