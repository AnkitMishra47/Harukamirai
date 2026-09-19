"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyCard } from "@/components/CaseStudyCard";
import type { CaseStudy } from "@/content";

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <LayoutGroup>
      <motion.div layout className={`mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 ${expandedSlug ? "" : "auto-rows-fr"}`}>
        {studies.map((c, i) => {
          const isExpanded = expandedSlug === c.slug;
          return (
            <motion.div
              key={c.slug}
              layout
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className={isExpanded ? "col-span-full" : ""}
            >
              <MagicReveal delay={i * 0.05}>
                <CaseStudyCard
                  study={c}
                  expanded={isExpanded}
                  onToggle={() => setExpandedSlug(isExpanded ? null : c.slug)}
                />
              </MagicReveal>
            </motion.div>
          );
        })}
      </motion.div>
    </LayoutGroup>
  );
}
