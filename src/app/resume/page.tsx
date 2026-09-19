import type { Metadata } from "next";
import { ResumeHub } from "@/components/ResumeHub";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: `Resume - ${profile.name}`,
  description: `${profile.title}. Download the resume as a PDF, or go straight to the work, the background or the contact details.`,
};

/**
 * A thin frame. ResumeHub owns the masthead, so there is no second title above
 * a titled block and exactly one <h1> on the route.
 *
 * What used to be here - the chronology, the systems grid, the craft chips -
 * was the site restated. Each of those has a page of its own that says it
 * better, so the page now hands off instead. The PDF is the only copy of the
 * record that leaves with the reader, which is why it sits directly under the
 * name rather than at the bottom.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-page lg:px-12">
      <ResumeHub />
    </div>
  );
}
