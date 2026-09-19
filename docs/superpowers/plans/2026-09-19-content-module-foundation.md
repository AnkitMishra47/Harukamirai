# Content Module Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all site copy into a typed `src/content/` module aligned to the September 2026 resume, fix the font and first-paint problems, and add the recruiter items, so both visual directions can branch from a fast, correct base.

**Architecture:** Content lives in `src/content/*.ts` as plain typed data with a vitest invariant suite. Pages become server components that import content; only effect components stay client-side. The Japanese display font is self-hosted as a glyph subset via `next/font/local`.

**Tech Stack:** Next.js 15.1 App Router, React 19, Tailwind 4, Motion 12, vitest, fonttools (Python, in a scratch venv), Lighthouse via npx.

**Spec:** `docs/superpowers/specs/2026-09-19-portfolio-refresh-design.md`

## Global Constraints

- Branch: `feature/Feature-ContentModule`. Push after each commit (Vercel preview). Never merge to `main`.
- Commit messages carry no `Co-Authored-By` or `Claude-Session` trailers.
- Never write "Employee of the Year" without "Runner-up" in the same string.
- No fabricated facts. Every content entry traces to `Ankit_Mishra_2026.pdf`, the existing site copy, or `Documentation/portfolio-content-brief.md`.
- No em dash in new copy or code comments; use "-" or "·".
- OneIT start date is Jul 2022. Current title is "Senior Software Engineer · AI & Automation".
- Fonts: at most Fraunces, Geist, JetBrains Mono and the Shippori subset. No Google-hosted JP font.
- `npm run build` must pass locally at the end of every task from Task 6 onward.

---

## File structure

| Path | Responsibility |
|---|---|
| `src/content/types.ts` | All content types |
| `src/content/profile.ts` | Identity, title, summary, links, PDF path |
| `src/content/timeline.ts` | Career and education entries, chronological |
| `src/content/skills.ts` | Eight resume skill groups |
| `src/content/awards.ts` | Two awards |
| `src/content/testimonials.ts` | Three peer quotes |
| `src/content/case-studies.ts` | Six case studies |
| `src/content/index.ts` | Re-exports |
| `src/content/__tests__/content.test.ts` | Invariants |
| `public/fonts/ShipporiMincho-subset.woff2` | Subset JP font |
| `src/components/HeroIntro.tsx` | Client hero (scroll transforms only) |
| `src/components/ResumeSheet.tsx` | Server-rendered HTML resume |
| `src/app/opengraph-image.tsx` | OG image |

---

### Task 1: Test harness

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces: `npm test` runs vitest once; `npm run typecheck` runs `tsc --noEmit`.

- [ ] **Step 1: Install vitest**

```bash
cd /home/dev/PersonalProjects/Portfolio && npm install -D vitest@^3
```

- [ ] **Step 2: Add scripts and config**

In `package.json` `scripts`, add:

```json
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: { include: ["src/**/*.test.ts"] },
});
```

- [ ] **Step 3: Write the first failing test**

Create `src/content/__tests__/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { profile } from "@/content";

describe("profile", () => {
  it("carries the current title and resume path", () => {
    expect(profile.title).toBe("Senior Software Engineer · AI & Automation");
    expect(profile.resumePdf).toBe("/docs/AnkitResume.pdf");
  });
});
```

- [ ] **Step 4: Run it, expect failure**

Run: `npm test`
Expected: FAIL, cannot resolve `@/content`.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/content/__tests__/content.test.ts
git commit -m "Test: add vitest harness for content invariants"
git push
```

---

### Task 2: Content types, profile, awards, testimonials

**Files:**
- Create: `src/content/types.ts`, `src/content/profile.ts`, `src/content/awards.ts`, `src/content/testimonials.ts`, `src/content/index.ts`
- Modify: `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces: the types below, and exports `profile`, `awards`, `testimonials` from `@/content`.

- [ ] **Step 1: Write types**

`src/content/types.ts`:

```ts
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
```

- [ ] **Step 2: Write profile**

`src/content/profile.ts`:

```ts
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
```

- [ ] **Step 3: Write awards and testimonials**

`src/content/awards.ts`:

```ts
import type { Award } from "./types";

export const awards: Award[] = [
  {
    year: "2025",
    title: "Runner-up - Employee of the Year",
    body: "Company-wide recognition at OneIT, across all engineering tiers. Signed by Managing Director David Barton.",
  },
  {
    year: "2024",
    title: "Mid Developer of the Year",
    body: "Recognised for contribution across the OneIT engineering team in 2024. Signed by Managing Director David Barton.",
  },
];
```

`src/content/testimonials.ts`: move the three objects from `src/app/about/page.tsx:22-38` unchanged, typed as `Testimonial[]`, replacing `&apos;` with a plain apostrophe (the file is data now, not JSX).

- [ ] **Step 4: Write index**

`src/content/index.ts`:

```ts
export * from "./types";
export { profile } from "./profile";
export { awards } from "./awards";
export { testimonials } from "./testimonials";
```

- [ ] **Step 5: Extend the test**

Append to `content.test.ts`:

```ts
import { awards, testimonials } from "@/content";

describe("awards", () => {
  it("never claims Employee of the Year outright", () => {
    for (const a of awards) {
      if (a.title.includes("Employee of the Year")) {
        expect(a.title).toMatch(/Runner-up/);
      }
    }
  });
});

describe("testimonials", () => {
  it("has three attributed quotes with no HTML entities", () => {
    expect(testimonials).toHaveLength(3);
    for (const t of testimonials) {
      expect(t.attribution).toMatch(/OneIT/);
      expect(t.quote).not.toMatch(/&[a-z]+;/);
    }
  });
});
```

- [ ] **Step 6: Run tests, expect pass**

Run: `npm test && npm run typecheck`
Expected: all PASS, tsc clean.

- [ ] **Step 7: Commit**

```bash
git add src/content
git commit -m "Content: add types, profile, awards, testimonials"
git push
```

---

### Task 3: Timeline and skills

**Files:**
- Create: `src/content/timeline.ts`, `src/content/skills.ts`
- Modify: `src/content/index.ts`, `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces: `timeline: TimelineEntry[]` (oldest first, ids below are referenced by the Grimoire in Task 7), `skills: SkillGroup[]`.

- [ ] **Step 1: Write the failing test**

Append:

```ts
import { timeline, skills } from "@/content";

describe("timeline", () => {
  it("starts at OneIT in Jul 2022 and has stable ids", () => {
    const join = timeline.find((t) => t.id === "oneit-intern");
    expect(join?.date).toBe("Jul 2022");
    const ids = timeline.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ["bca", "oneit-intern", "award-2024", "award-2025", "now"]) {
      expect(ids).toContain(id);
    }
  });
});

describe("skills", () => {
  it("uses the resume's eight groups", () => {
    expect(skills.map((g) => g.id)).toEqual([
      "languages", "ai", "backend", "frontend", "data", "integrations", "devops", "practices",
    ]);
  });
});
```

Run: `npm test` - expected FAIL (missing exports).

- [ ] **Step 2: Write timeline**

`src/content/timeline.ts`:

```ts
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
```

- [ ] **Step 3: Write skills**

`src/content/skills.ts` (verbatim from the resume's Technical Skills block):

```ts
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
```

- [ ] **Step 4: Export, test, commit**

Add `export { timeline } from "./timeline"; export { skills } from "./skills";` to `index.ts`.

Run: `npm test && npm run typecheck` - expected PASS.

```bash
git add src/content
git commit -m "Content: add timeline and resume skill groups"
git push
```

---

### Task 4: Case studies

**Files:**
- Create: `src/content/case-studies.ts`
- Modify: `src/content/index.ts`, `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces: `caseStudies: CaseStudy[]`, six entries, slugs: `rag-platform`, `mining-cms`, `rto-lms`, `integration-middleware`, `service-desk-automation`, `construction-takeoff`, plus `sprachkraft` as a seventh small entry with `links` and `featured: true`.

- [ ] **Step 1: Write the failing test**

```ts
import { caseStudies } from "@/content";

describe("case studies", () => {
  it("has unique slugs, complete fields and no TODO markers", () => {
    const slugs = caseStudies.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of caseStudies) {
      expect(c.approach.length).toBeGreaterThan(0);
      expect(c.stack.length).toBeGreaterThan(0);
      expect(JSON.stringify(c)).not.toMatch(/TODO|\{TODO\}|—/);
    }
  });
  it("features Sprachkraft with a live link", () => {
    const s = caseStudies.find((c) => c.slug === "sprachkraft");
    expect(s?.links?.[0].href).toBe("https://thesprachkraft.com/");
  });
});
```

Run: `npm test` - expected FAIL.

- [ ] **Step 2: Write the file**

Order in the array is the order on the Work page. Move `mining-cms`, `rto-lms`, `construction-takeoff` from `src/app/work/page.tsx:27-165` unchanged except: add `slug`, replace every em dash with "-", and keep `kicker`, `title`, `domain`, `problem`, `approach`, `result`, `metrics`, `stack`. The three new entries and Sprachkraft:

```ts
{
  slug: "rag-platform",
  kicker: "AI platform · Enterprise knowledge retrieval",
  title: "RAG over 25M+ embeddings on PostgreSQL",
  domain:
    "Enterprise document search across OneIT's product family: SharePoint libraries, equipment manuals, internal documentation and historical tickets, served behind product-specific assistants.",
  problem:
    "Make LLM features accurate and cheap enough to ship inside products customers pay for, over corpora that keep changing, without the vector store drifting out of sync with the source documents.",
  approach: [
    "Ingestion and sync of enterprise documents from SharePoint (Microsoft Graph API) into a PostgreSQL embeddings store with chunking, filtered vector search and HNSW indexing on pgvector.",
    "Store grew past 25 million rows; diagnosed and fixed index bloat, VACUUM stalls and orphaned-record drift.",
    "Reconciliation tooling that keeps file state and vector state consistent so deleted or replaced documents never resurface in answers.",
    "MCP-style tool layer giving the LLM controlled access to live product APIs instead of free-form generation.",
    "AI-assisted engineering workflow: plain-English requirements become structured specs, code scaffolds and generated tests, with validation loops before anything reaches review.",
  ],
  result:
    "RAG, tool access and AI-assisted code and test generation running against real product APIs in production, with a vector store that stays consistent with its sources at multi-million-row scale.",
  metrics: [
    { label: "Scale", value: "25M+ embedding rows" },
    { label: "Index", value: "pgvector · HNSW" },
    { label: "Stage", value: "In production" },
  ],
  stack: ["Python", "PostgreSQL", "pgvector", "SharePoint Graph API", "LLM APIs", "MCP tooling", "Java integration"],
},
{
  slug: "integration-middleware",
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
  slug: "service-desk-automation",
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
  kicker: "Client · Next.js · 2025",
  title: "The Sprachkraft",
  domain: "A language institute and study-abroad consultancy.",
  problem: "The client needed a public site with lead capture, live in a day.",
  approach: ["Seven-page Next.js site scoped, designed and shipped end-to-end in a single day.", "Lead-capture form and responsive layout."],
  result: "Live at thesprachkraft.com.",
  metrics: [{ label: "Pages", value: "7" }, { label: "Time", value: "1 day" }],
  stack: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  links: [{ label: "thesprachkraft.com", href: "https://thesprachkraft.com/", external: true }],
  featured: true,
},
```

Set `featured: true` on `rag-platform` as well (home shows the two featured entries).

- [ ] **Step 3: Export, test, commit**

Add `export { caseStudies } from "./case-studies";` to `index.ts`.

Run: `npm test && npm run typecheck` - expected PASS.

```bash
git add src/content
git commit -m "Content: case studies aligned to the 2026 resume"
git push
```

---

### Task 5: Resume PDF swap

**Files:**
- Modify: `public/docs/AnkitResume.pdf`
- Delete: `Documentation/AnkitResume.pdf`

- [ ] **Step 1: Replace and verify**

```bash
cp /home/dev/Pictures/GoSwitch/Ankit_Mishra_2026.pdf public/docs/AnkitResume.pdf
git rm -q Documentation/AnkitResume.pdf
pdfinfo public/docs/AnkitResume.pdf | grep -E "Pages|ModDate"
```
Expected: `Pages: 1`, ModDate 19 Sep 2026.

- [ ] **Step 2: Commit**

```bash
git add public/docs/AnkitResume.pdf
git commit -m "Resume: replace PDF with September 2026 version"
git push
```

---

### Task 6: Fonts

**Files:**
- Create: `public/fonts/ShipporiMincho-subset.woff2`, `scripts/subset-jp-font.sh`
- Modify: `src/app/layout.tsx:1-35`, `src/app/globals.css` (`.font-jp` weight)

**Interfaces:**
- Produces: CSS variable `--font-jp` still set on `<html>`; `npm run build` passes.

- [ ] **Step 1: Write the subset script**

`scripts/subset-jp-font.sh`:

```bash
#!/usr/bin/env bash
# Subsets Shippori Mincho Regular to the CJK glyphs used in src/, plus the
# ones listed in EXTRA. Re-run whenever Japanese copy is added.
set -euo pipefail
cd "$(dirname "$0")/.."
WORK="${TMPDIR:-/tmp}/shippori-subset"
mkdir -p "$WORK"
if [ ! -x "$WORK/venv/bin/pyftsubset" ]; then
  python3 -m venv "$WORK/venv"
  "$WORK/venv/bin/pip" -q install fonttools brotli
fi
if [ ! -f "$WORK/ShipporiMincho-Regular.ttf" ]; then
  curl -sL -o "$WORK/ShipporiMincho-Regular.ttf" \
    https://raw.githubusercontent.com/google/fonts/main/ofl/shipporimincho/ShipporiMincho-Regular.ttf
fi
USED=$(grep -rhoP '[\x{3000}-\x{30FF}\x{4E00}-\x{9FFF}]' src | sort -u | tr -d '\n')
EXTRA="遥か未来アスタ反魔法今読書珈琲将棋始まり入団表彰栄誉現在"
mkdir -p public/fonts
"$WORK/venv/bin/pyftsubset" "$WORK/ShipporiMincho-Regular.ttf" \
  --text="${USED}${EXTRA}" --flavor=woff2 --layout-features='*' \
  --output-file=public/fonts/ShipporiMincho-subset.woff2
ls -l public/fonts/ShipporiMincho-subset.woff2
```

Run: `chmod +x scripts/subset-jp-font.sh && ./scripts/subset-jp-font.sh`
Expected: file under 30 KB.

- [ ] **Step 2: Switch layout to the local font**

In `src/app/layout.tsx` replace the `Shippori_Mincho` import and `jp` constant with:

```ts
import localFont from "next/font/local";

const jp = localFont({
  src: "../../public/fonts/ShipporiMincho-subset.woff2",
  weight: "400",
  variable: "--font-jp",
  display: "swap",
});
```

and change the Fraunces loader to `axes: ["opsz"]`. Remove `Shippori_Mincho` from the `next/font/google` import.

In `globals.css`, `.font-jp` gets `font-weight: 400;` (was 500, which would synthesise).

- [ ] **Step 3: Build**

Run: `rm -rf .next && npm run build 2>&1 | tail -25`
Expected: build succeeds; the route table prints. Note the "First Load JS" for `/`.

- [ ] **Step 4: Verify preload count**

```bash
npx next start -p 3100 & sleep 4; curl -s localhost:3100/ | grep -c 'as="font"'; kill %1
```
Expected: 5 or fewer.

- [ ] **Step 5: Commit**

```bash
git add scripts/subset-jp-font.sh public/fonts src/app/layout.tsx src/app/globals.css
git commit -m "Fonts: self-host a Shippori Mincho glyph subset; trim Fraunces axes"
git push
```

---

### Task 7: Wire pages to the content module

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/work/page.tsx`, `src/app/contact/page.tsx`, `src/components/Footer.tsx`, `src/components/effects/Grimoire.tsx:13-70`, `src/app/layout.tsx` (metadata)
- Create: `src/components/HeroIntro.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: everything exported from `@/content`.
- Produces: no string literal copy in page files other than section labels and UI chrome.

- [ ] **Step 1: About**

Delete the `arc`, `testimonials`, `awards`, `skills` constants. Import `{ timeline, testimonials, awards, skills }` from `@/content`. Render `timeline` where `arc` was (fields: `date` for `year`, `title`, `note`). Render `skills` as a loop over groups (`label` heading, `items` chips) replacing the three hardcoded `daily/recent/growing` blocks.

- [ ] **Step 2: Work**

Remove `"use client"`, `oneIT` and `cases`. Import `{ caseStudies, timeline }`. The OneIT sidebar renders `timeline.filter(t => t.kind === "role" || t.kind === "award")`. Wrap the one `motion.span` at `work/page.tsx:261` in `MagicReveal` or replace with a plain `span`; the page must contain no `motion.` usage. Render `links` under each case study's stack when present:

```tsx
{c.links?.map((l) => (
  <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
     className="text-sm text-[var(--accent)] underline underline-offset-4">
    {l.label} ↗
  </a>
))}
```

The separate hardcoded Sprachkraft block (`work/page.tsx:166-190`) is removed; Sprachkraft now renders from `caseStudies` like the rest.

- [ ] **Step 3: Contact and Footer**

Contact's `channels` array becomes `profile.links` plus email; Footer's LinkedIn href becomes `profile.links[0].href`. Layout `metadata.description` becomes `profile.summary.slice(0, 155)`; `openGraph.description` becomes `profile.heroLine` up to the first "." plus ".".

- [ ] **Step 4: Grimoire chapters**

Replace `CHAPTERS` with a decoration map keyed by timeline id and a derived array:

```ts
import { timeline } from "@/content";

const DECOR: Record<string, Pick<Chapter, "ribbon" | "romaji" | "kanji" | "sigil">> = {
  bca:          { ribbon: "var(--text-muted)",  romaji: "Hajimari", kanji: "始まり", sigil: "dawn" },
  "oneit-intern": { ribbon: "var(--accent)",   romaji: "Nyuudan",  kanji: "入団",   sigil: "asta" },
  "award-2024": { ribbon: "#d4a017",           romaji: "Hyoushou", kanji: "表彰",   sigil: "trophy" },
  "award-2025": { ribbon: "#c8102e",           romaji: "Eiyo",     kanji: "栄誉",   sigil: "crown" },
  now:          { ribbon: "var(--accent-hover)", romaji: "Ima",    kanji: "現在",   sigil: "spade" },
};

const CHAPTERS: Chapter[] = timeline
  .filter((t) => t.id in DECOR)
  .map((t) => ({
    year: t.id === "now" ? "今" : t.date.slice(-4),
    title: t.title,
    body: t.note,
    ...DECOR[t.id],
  }));
```

- [ ] **Step 5: Home**

`src/app/page.tsx` loses `"use client"`. The hero section (lines 39-250) moves into `src/components/HeroIntro.tsx` (`"use client"`), which imports `profile` and renders `profile.nameLines`, `profile.heroLine` and the employer link. The featured tiles render `caseStudies.filter(c => c.featured)` with `kicker`, `title`, `domain`, `stack.slice(0,5)`. The credibility strip renders `awards` plus the fixed "3 in 3" stat.

- [ ] **Step 6: Verify**

Run: `npm run typecheck && npm test && npm run build`
Expected: clean. Then `grep -rn "David Barton\|Sprachkraft\|Employee of the Year" src/app src/components` returns only `src/content` (no hits outside content).

- [ ] **Step 7: Commit**

```bash
git add src
git commit -m "Pages: render all copy from the content module"
git push
```

---

### Task 8: Hero visible on first paint

**Files:**
- Modify: `src/components/HeroIntro.tsx`, `src/app/globals.css`

- [ ] **Step 1: CSS entrance**

Add to `globals.css`:

```css
@keyframes hero-in {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-in { animation: hero-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.hero-in-1 { animation-delay: 60ms; }
.hero-in-2 { animation-delay: 140ms; }
.hero-in-3 { animation-delay: 220ms; }
.hero-in-4 { animation-delay: 300ms; }
.hero-in-5 { animation-delay: 380ms; }
```

- [ ] **Step 2: Replace motion text**

In `HeroIntro.tsx`, every `motion.p`, `motion.span` (per-letter) and `motion.div` that only fades or slides text becomes a plain element with `hero-in hero-in-N`. The title renders as two plain `<span class="block">` lines with the A and I still accent-coloured. `useScroll`/`useTransform` stay for the circle and Grimoire parallax.

- [ ] **Step 3: Verify first paint has text**

```bash
npm run build && (npx next start -p 3100 &) && sleep 4 && curl -s localhost:3100/ | grep -o "ANKIT\|MISHRA\|opacity:0" | sort | uniq -c; pkill -f "next start"
```
Expected: `ANKIT` and `MISHRA` present, no `opacity:0` inline on the hero.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroIntro.tsx src/app/globals.css
git commit -m "Hero: render text in HTML with CSS entrance instead of JS-gated opacity"
git push
```

---

### Task 9: Sleep the canvas loops

**Files:**
- Modify: `src/components/effects/CursorTrail.tsx:57-83`, `src/components/effects/ParticleField.tsx:69-105`

- [ ] **Step 1: CursorTrail idles**

Replace the unconditional loop with:

```ts
let running = false;
function frame() {
  ctx!.clearRect(0, 0, W, H);
  // ...existing dot drawing...
  if (dots.length === 0) { running = false; return; }
  raf = requestAnimationFrame(frame);
}
function onMove(e: MouseEvent) {
  // ...existing spawn...
  if (!running) { running = true; raf = requestAnimationFrame(frame); }
}
```
Remove the initial `raf = requestAnimationFrame(frame)` call.

- [ ] **Step 2: ParticleField pauses off-screen and when hidden**

```ts
let active = true;
const io = new IntersectionObserver(([e]) => {
  active = e.isIntersecting;
  if (active) raf = requestAnimationFrame(frame);
});
io.observe(canvas);
const onVis = () => { active = !document.hidden; if (active) raf = requestAnimationFrame(frame); };
document.addEventListener("visibilitychange", onVis);
function frame() {
  if (!active) return;
  // ...existing...
  raf = requestAnimationFrame(frame);
}
```
Add `io.disconnect()` and the listener removal to the cleanup.

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run build`. Manually: open `/about`, run in DevTools console `let n=0; requestAnimationFrame(function f(){n++; if(n<120) requestAnimationFrame(f)})` and confirm the Performance panel shows no continuous script while the mouse is still. Record the observation in the commit body.

- [ ] **Step 4: Commit**

```bash
git add src/components/effects/CursorTrail.tsx src/components/effects/ParticleField.tsx
git commit -m "Effects: canvas loops sleep when idle or off-screen"
git push
```

---

### Task 10: Recruiter pass

**Files:**
- Create: `src/components/ResumeSheet.tsx`, `src/app/opengraph-image.tsx`
- Modify: `src/app/resume/page.tsx`, `src/components/Nav.tsx:9-16`, `src/app/sitemap.ts`

- [ ] **Step 1: ResumeSheet**

Server component rendering, in order: name + title + location, summary, skills grid (8 groups, 2 columns), experience (timeline `role` and `award` entries), projects (`caseStudies` titles + one-line `result`), education (`education` entries), awards. Plain semantic HTML, `font-display` headings, `max-w-3xl`, print-friendly (`@media print` hides nav, footer and effects).

- [ ] **Step 2: Resume page**

`src/app/resume/page.tsx` drops `"use client"`; the Grimoire block stays inside a client wrapper (`Grimoire` is already client). Below the book: `<ResumeSheet />`, then the download button reading `profile.resumePdf`. Add `export const metadata = { title: "Resume - Ankit Mishra" }`.

- [ ] **Step 3: OG image**

`src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: 80, background: "#f4efe3", color: "#14110d",
        fontFamily: "serif" }}>
        <div style={{ fontSize: 28, letterSpacing: 6, color: "#2c5840" }}>遥か未来 · HARUKAMIRAI.ENGINEER</div>
        <div style={{ fontSize: 112, lineHeight: 1, marginTop: 24 }}>{profile.name}</div>
        <div style={{ fontSize: 40, marginTop: 24, color: "#6b6358" }}>{profile.title}</div>
        <div style={{ fontSize: 28, marginTop: 48, color: "#6b6358" }}>OneIT (Australia) · Runner-up, Employee of the Year 2025</div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 4: Nav and sitemap**

In `Nav.tsx` `links`, remove `/writing` and `/now`. In `sitemap.ts`, remove `/writing`, `/now`, `/lab` entries if present.

- [ ] **Step 5: Verify**

```bash
npm run build && (npx next start -p 3100 &) && sleep 4
curl -s -o /tmp/og.png -w "og %{http_code} %{content_type}\n" localhost:3100/opengraph-image
curl -s localhost:3100/resume | grep -c "Enterprise Knowledge\|RAG over 25M"
pkill -f "next start"
```
Expected: `og 200 image/png`; resume count 1 or more.

- [ ] **Step 6: Commit**

```bash
git add src/components/ResumeSheet.tsx src/app/opengraph-image.tsx src/app/resume/page.tsx src/components/Nav.tsx src/app/sitemap.ts
git commit -m "Recruiter pass: HTML resume, OG image, nav trimmed to live pages"
git push
```

---

### Task 11: Measure

**Files:**
- Create: `docs/superpowers/plans/2026-09-19-foundation-lighthouse.md`

- [ ] **Step 1: Run Lighthouse against the local production server**

```bash
npm run build && (npx next start -p 3100 &) && sleep 4
npx --yes lighthouse http://localhost:3100/ --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --output=json --output-path=/tmp/lh-foundation.json --quiet
node -e 'const a=require("/tmp/lh-foundation.json");const x=a.audits;console.log("score",Math.round(a.categories.performance.score*100));for(const k of ["first-contentful-paint","largest-contentful-paint","total-blocking-time","speed-index","total-byte-weight"])console.log(k,x[k].displayValue)'
pkill -f "next start"
```

- [ ] **Step 2: Record**

Write the before (live, 2026-09-19: score 54, LCP 23.7 s, 4.26 MB fonts) and after numbers into the markdown file as a two-column table. Commit and push:

```bash
git add docs/superpowers/plans/2026-09-19-foundation-lighthouse.md
git commit -m "Docs: Lighthouse before/after for the content-module foundation"
git push
```

Target from the spec: LCP under 1.5 s, score 95+. If not met, the gap is reported, not hidden, and the cause listed in the same file.

---

## Self-review

- Spec 3.1 content module: Tasks 2-4, 7. Spec 3.2 resume alignment: Tasks 2-5. Spec 3.3 fonts: Task 6; hero first paint: Task 8; canvas loops: Task 9; server components: Tasks 7, 10. Spec 3.4 recruiter: Task 10. Spec 6 verification: Task 11 plus per-task builds. Spec 3.3 mentions `feTurbulence` and `AmbientCircle` costs; those belong to Direction 1's plan, not the foundation, by design.
- Spec 3.1 said Grimoire chapters derive from timeline "filtered to kind !== education"; the plan uses an explicit decoration map instead so the 2019 BCA chapter survives. The spec is corrected to match.
- Ids referenced across tasks: `bca`, `oneit-intern`, `award-2024`, `award-2025`, `now` (Tasks 3, 7). Slugs: `rag-platform`, `sprachkraft` featured (Tasks 4, 7). `profile.resumePdf`, `profile.heroLine`, `profile.nameLines` (Tasks 2, 7, 8, 10).
