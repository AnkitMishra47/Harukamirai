"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import styles from "./adventure-quest.module.css";

interface Relic {
  id: string;
  icon: string;
  title: string;
  hint: string;
  lore: string;
}

const RELICS: Relic[] = [
  {
    id: "clover",
    icon: "🍀",
    title: "The 5-Leaf Grimoire Seal",
    hint: "Click the glowing 5-leaf clover emblem in the top navigation bar.",
    lore: "Within the 5th leaf dwells the power of Anti-Magic. The resolve to push past limits and cut through complexity.",
  },
  {
    id: "compass",
    icon: "🧭",
    title: "The AWST Synchronizer Compass",
    hint: "Click or inspect the 'Working AWST hours' timezone card under Ankit's portrait on the About page.",
    lore: "Synchronized across Perth, Australia (AWST, UTC+8) and India. 100% remote delivery with zero client friction.",
  },
  {
    id: "trophy",
    icon: "🏆",
    title: "Guild Honours Crest",
    hint: "Click the award trophy photo or hover over the honours cards in Chapter I (Recognition) on the About page.",
    lore: "Named Runner-up for Employee of the Year 2025 across all engineering tiers, following Developer of the Year 2024.",
  },
  {
    id: "chess",
    icon: "♟️",
    title: "The Sicilian Gambit",
    hint: "Interact with the Chessboard card in the Currents section on the Home page.",
    lore: "Rated ~2000 on Chess.com. The Sicilian teaches deep tactical calculation and finding calm under pressure.",
  },
  {
    id: "blueprint",
    icon: "📜",
    title: "Archived System Blueprint",
    hint: "Click on any project card on the Work page to reveal its case study blueprint modal.",
    lore: "Real architecture blueprints: PostgreSQL pgvector multi-million embeddings and mission-critical enterprise middleware.",
  },
];

const STORAGE_KEY = "harukamirai_discovered_relics";

export function AdventureQuest() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [activeToast, setActiveToast] = useState<Relic | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Load unlocked relics on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setUnlockedIds(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Listen for relic discovery events
  useEffect(() => {
    const handleDiscover = (e: Event) => {
      const custom = e as CustomEvent<{ relicId: string }>;
      const relicId = custom.detail?.relicId;
      if (!relicId) return;

      const relic = RELICS.find((r) => r.id === relicId);
      if (!relic) return;

      setUnlockedIds((prev) => {
        if (prev.includes(relicId)) return prev;
        const updated = [...prev, relicId];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore
        }
        // Show celebration toast
        setActiveToast(relic);
        setTimeout(() => setActiveToast(null), 5000);
        return updated;
      });
    };

    window.addEventListener("grimoire-relic-discover", handleDiscover);
    return () => window.removeEventListener("grimoire-relic-discover", handleDiscover);
  }, []);

  const total = RELICS.length;
  const count = unlockedIds.length;

  return (
    <>
      {/* Floating Expedition Map Trigger */}
      <button
        type="button"
        onClick={() => setIsMapOpen(true)}
        className={`${styles.floatingTrigger} print:hidden`}
        aria-label="Open Grimoire Expedition Map"
      >
        <span aria-hidden>🗺️</span>
        <span>
          Relics {count}/{total}
        </span>
      </button>

      {/* Celebration Toast ("Hurrah! You found this!") */}
      <AnimatePresence>
        {activeToast && (
          <motion.aside
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={styles.toast}
          >
            <span className={styles.toastIcon}>{activeToast.icon}</span>
            <div>
              <p className={styles.toastHurrah}>🎉 Hurrah! You found a Grimoire Relic!</p>
              <p className={styles.toastTitle}>{activeToast.title}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Expedition Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.modalBackdrop}
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMapOpen(false);
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quest-map-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className={styles.modalDialog}
            >
              <button
                type="button"
                onClick={() => setIsMapOpen(false)}
                className={styles.closeBtn}
                aria-label="Close Expedition Map"
              >
                ✕
              </button>

              <header>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                  Grimoire Expedition Map
                </p>
                <h2 id="quest-map-title" className="font-display text-2xl sm:text-3xl font-bold mt-1 text-[var(--text)]">
                  Secret Relics & Lore
                </h2>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
                  Hidden relics are scattered across the pages of this grimoire. Uncover them by
                  exploring spells, inspecting timezones, and solving chess openings.
                </p>
                <p className="mt-3 font-mono text-xs text-[var(--accent)] font-semibold">
                  Discovered: {count} / {total} Relics
                  {count === total ? " ✦ Master of the Five Leaves!" : ""}
                </p>
              </header>

              <div className={styles.relicGrid}>
                {RELICS.map((r) => {
                  const isUnlocked = unlockedIds.includes(r.id);
                  return (
                    <div
                      key={r.id}
                      className={`${styles.relicCard} ${isUnlocked ? styles.relicUnlocked : ""}`}
                    >
                      <div className={styles.relicHeader}>
                        <span className={styles.relicIcon}>{isUnlocked ? r.icon : "🔒"}</span>
                        <h3 className={styles.relicName}>{r.title}</h3>
                      </div>
                      {isUnlocked ? (
                        <p className={styles.relicLore}>{r.lore}</p>
                      ) : (
                        <p className={styles.relicHint}>Hint: {r.hint}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
