import type { Metadata } from "next";
import { ResumeSheet } from "@/components/ResumeSheet";
import { profile } from "@/content";

export const metadata: Metadata = {
  title: `Resume - ${profile.name}`,
  description: `${profile.title}. Full web resume, engineering disciplines, career chronology, and verified PDF download.`,
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-page lg:px-12">
      <ResumeSheet />
    </div>
  );
}
