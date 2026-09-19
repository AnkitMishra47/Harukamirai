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

import { photos, profile as prof } from "@/content";
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
    const all = [photos.portrait, photos.setup, photos.awardTrophy, photos.openRoad, ...photos.offTheClock];
    for (const p of all) {
      expect(existsSync(path.join(process.cwd(), "public", p.src))).toBe(true);
    }
    expect(prof.bio.join(" ")).toMatch(/Runner-up for Employee of the Year/);
  });
});

describe("grimoire chapter derivation", () => {
  it("gives every chapter-eligible entry a distinct leading year", () => {
    const ids = ["bca", "oneit-intern", "award-2024", "award-2025", "now"];
    const years = ids.map((id) => {
      const t = timeline.find((x) => x.id === id)!;
      return id === "now" ? "今" : (t.date.match(/\d{4}/)?.[0] ?? t.date);
    });
    expect(new Set(years).size).toBe(years.length);
  });
});

import { readFileSync } from "node:fs";

/**
 * Reads width/height straight out of a JPEG's SOF marker so the test needs no
 * image dependency. Returns null for anything that is not a JPEG.
 */
function jpegSize(file: string): { width: number; height: number } | null {
  const buf = readFileSync(file);
  if (buf.readUInt16BE(0) !== 0xffd8) return null;
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i++;
      continue;
    }
    const marker = buf[i + 1];
    // SOF0-SOF15 carry the frame size; C4/C8/CC are Huffman/arithmetic tables.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

describe("photo dimensions", () => {
  it("match the files on disk, so galleries can lay out by true aspect ratio", () => {
    const all = [photos.portrait, photos.setup, photos.awardTrophy, photos.openRoad, ...photos.offTheClock];
    for (const p of all) {
      const actual = jpegSize(path.join(process.cwd(), "public", p.src));
      expect(actual, `${p.src} is not a readable JPEG`).not.toBeNull();
      expect({ src: p.src, ...actual }).toEqual({
        src: p.src,
        width: p.width,
        height: p.height,
      });
    }
  });

  it("never asks a frame for more pixels than the file has", () => {
    // The Off-the-clock strip renders every print at the same height with its
    // natural width, inside a 1024px container. Worst case is 2x DPR desktop.
    const STRIP_HEIGHT_CSS = 357;
    const DPR = 2;
    for (const p of photos.offTheClock) {
      const neededHeight = STRIP_HEIGHT_CSS * DPR;
      expect(p.height, `${p.src} would be upscaled in the strip`).toBeGreaterThanOrEqual(
        neededHeight,
      );
    }
  });
});
