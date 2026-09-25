"use client";

import { useState } from "react";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import { CaseStudyModal } from "@/components/CaseStudyModal";
import type { CaseStudy } from "@/content";

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  return (
    <>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {studies.map((study, i) => (
          <div
            key={study.slug}
            className={`flex flex-1 flex-col ${study.flagship ? "md:col-span-2" : ""}`}
          >
            <MagicReveal
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 0.08}
              className="flex flex-1 flex-col"
            >
              <CaseStudyCard
                study={study}
                index={i}
                onSelect={() => setSelectedStudy(study)}
              />
            </MagicReveal>
          </div>
        ))}
      </div>

      {/* Pop-up Case Study Dialog */}
      <CaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
      />
    </>
  );
}
