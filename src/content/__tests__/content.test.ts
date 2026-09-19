import { describe, expect, it } from "vitest";
import { profile } from "@/content";

describe("profile", () => {
  it("carries the current title and resume path", () => {
    expect(profile.title).toBe("Senior Software Engineer · AI & Automation");
    expect(profile.resumePdf).toBe("/docs/AnkitResume.pdf");
  });
});

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

import { caseStudies } from "@/content";

describe("case studies", () => {
  it("has unique slugs, complete fields and no TODO markers or em dashes", () => {
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

import { sideProjects, photos, profile as prof } from "@/content";
import { existsSync } from "node:fs";
import path from "node:path";

describe("case study org", () => {
  it("marks Sprachkraft as independent and the rest as OneIT", () => {
    for (const c of caseStudies) {
      expect(c.org).toBe(c.slug === "sprachkraft" ? "independent" : "oneit");
    }
  });
});

describe("photos and side projects", () => {
  it("point at files that exist under public/", () => {
    const all = [photos.portrait, photos.awardTrophy, photos.openRoad, ...photos.offTheClock];
    for (const p of all) {
      expect(existsSync(path.join(process.cwd(), "public", p.src))).toBe(true);
    }
    expect(sideProjects.length).toBeGreaterThan(0);
    expect(prof.bio.join(" ")).toMatch(/Runner-up for Employee of the Year/);
  });
});
