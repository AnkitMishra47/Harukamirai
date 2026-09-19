import type { Metadata } from "next";
import { ResumeSheet } from "@/components/ResumeSheet";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: `Resume - ${profile.name}`,
  description: `${profile.title}. Career chronology, skills, projects and the PDF.`,
};

/**
 * The page is a thin frame: ResumeSheet owns the whole record, including its
 * own masthead, so there is no second title above a titled sheet and no
 * duplicate <h1>.
 *
 * The blurred background magic circle that used to sit here has gone. It cost
 * a full-page `blur-sm` filter plus an 800x800 pulsing SVG on a page whose job
 * is to be read, and the layout already paints AmbientCircle behind every page.
 */
export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-page lg:px-12">
      <ResumeSheet />
    </div>
  );
}
