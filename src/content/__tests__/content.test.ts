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
