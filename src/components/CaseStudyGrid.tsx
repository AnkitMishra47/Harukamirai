"use client";

import { Fragment, useState } from "react";
import { MagicReveal } from "@/components/effects/MagicReveal";
import { CaseStudyCard, CaseStudyDetail, cardTitleId, detailPanelId } from "@/components/CaseStudyCard";
import type { CaseStudy } from "@/content";
import styles from "./case-study.module.css";

/** Columns from 768px up. Mirrors `md:grid-cols-2` and the media query in the CSS module. */
const MD_COLUMNS = 2;

/**
 * Spacing between consecutive cards in `order`, so a detail panel can be slotted
 * halfway between two cards without disturbing anything else. Grid auto-placement
 * walks items in order-modified document order, which is what lets a panel land on
 * its own full-width row after its card's row instead of punching a hole in it.
 */
const ORDER_STEP = 10;

export function CaseStudyGrid({ studies }: { studies: CaseStudy[] }) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className={`${styles.grid} mt-10 grid grid-cols-1 gap-x-6 md:grid-cols-2`}>
      {studies.map((study, i) => {
        const isExpanded = expandedSlug === study.slug;
        const cardOrder = i * ORDER_STEP;
        // Single column: the panel follows its own card. Two columns: it follows
        // whichever card ends that row, so the row itself is never broken up.
        const lastOfRowMd = Math.floor(i / MD_COLUMNS) * MD_COLUMNS + (MD_COLUMNS - 1);

        return (
          <Fragment key={study.slug}>
            <div className={styles.cell} style={{ order: cardOrder }}>
              <MagicReveal delay={i * 0.05} className="flex flex-1 flex-col">
                <CaseStudyCard
                  study={study}
                  expanded={isExpanded}
                  onToggle={() => setExpandedSlug(isExpanded ? null : study.slug)}
                />
              </MagicReveal>
            </div>

            <div
              id={detailPanelId(study.slug)}
              role="group"
              aria-labelledby={cardTitleId(study.slug)}
              className={`${styles.panel} ${isExpanded ? styles.panelOpen : ""}`}
              style={
                {
                  "--cs-order-sm": String(cardOrder + ORDER_STEP / 2),
                  "--cs-order-md": String(lastOfRowMd * ORDER_STEP + ORDER_STEP / 2),
                } as React.CSSProperties
              }
            >
              <div className={styles.panelInner}>
                <CaseStudyDetail study={study} />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
