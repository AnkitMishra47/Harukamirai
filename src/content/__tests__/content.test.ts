import { describe, expect, it } from "vitest";
import { profile } from "@/content";

describe("profile", () => {
  it("carries the current title and resume path", () => {
    expect(profile.title).toBe("Senior Software Engineer · AI & Automation");
    expect(profile.resumePdf).toBe("/docs/AnkitResume.pdf");
  });
});
