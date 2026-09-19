"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { searchCareerIndex, SUGGESTED_QUERIES, SearchResultItem } from "./search-index";
import styles from "./command-palette.module.css";

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = searchCareerIndex(query);

  // Keyboard shortcut (Cmd+K / Ctrl+K / slash) & custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((v) => !v);
      } else if (e.key === "/" && !isOpen) {
        const active = document.activeElement;
        const isInput = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
        if (!isInput) {
          e.preventDefault();
          setIsOpen(true);
        }
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      selectItem(results[selectedIndex]);
    }
  };

  const selectItem = (item: SearchResultItem) => {
    setIsOpen(false);

    if (item.actionId === "open-recruiter-brief") {
      window.dispatchEvent(new CustomEvent("open-recruiter-brief"));
      return;
    }

    if (item.actionId === "open-shutter-story" || item.actionId === "open-interactive-story") {
      window.dispatchEvent(new CustomEvent("open-shutter-story"));
      return;
    }

    if (item.url) {
      if (item.url.startsWith("mailto:") || item.url.endsWith(".pdf") || item.url.startsWith("http")) {
        window.location.href = item.url;
      } else {
        router.push(item.url);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={styles.backdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Grimoire Scroll Search"
        >
          <div className={styles.scrollWrapper}>
            {/* Top Scroll Roller */}
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.scrollTopRoller}
            >
              <span className={styles.rollerKnobLeft} aria-hidden />
              <span className={styles.rollerText}>✦ Grimoire Scroll · Haruka Mirai ✦</span>
              <span className={styles.rollerKnobRight} aria-hidden />
            </motion.div>

            {/* Scroll Body */}
            <motion.div
              initial={{ scaleY: 0.2, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              exit={{ scaleY: 0.2, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top center" }}
              className={styles.scrollBody}
            >
              {/* Search Inscription Header */}
              <div className={styles.searchHeader}>
                <span className={styles.quillBadge} title="Spell Inscription">
                  ✦
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Inscribe search, career arc, skills, or spells..."
                  className={styles.searchInput}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className={styles.clearBtn}
                  >
                    Clear
                  </button>
                )}
                <kbd className={styles.escBadge}>ESC</kbd>
              </div>

              {/* Tilted Spell Charms */}
              <div className={styles.tiltedCharmsBar}>
                <span className={styles.charmsLabel}>Suggestions:</span>
                {SUGGESTED_QUERIES.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuery(q.query)}
                    className={styles.tiltedCharm}
                  >
                    <span aria-hidden>{q.icon}</span> <span>{q.label}</span>
                  </button>
                ))}
              </div>

              {/* Results Inscription List */}
              <div className={styles.resultsList}>
                {results.length === 0 ? (
                  <div className="p-8 text-center text-sm font-sans text-[var(--text-muted)]">
                    No matching spells or records for &ldquo;{query}&rdquo;. Try seeking &ldquo;recruiter&rdquo;, &ldquo;RAG&rdquo;, or &ldquo;resume&rdquo;.
                  </div>
                ) : (
                  results.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={() => selectItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`${styles.spellRow} ${isSelected ? styles.spellRowSelected : ""}`}
                      >
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <p className={styles.rubricKicker}>
                            {item.subtitle}
                          </p>
                          <h4 className={styles.spellTitle}>
                            {item.title}
                          </h4>
                          <p className={`${styles.spellDescription} line-clamp-1`}>
                            {item.description}
                          </p>
                        </div>

                        {item.badge && (
                          <div className="text-right shrink-0">
                            <span className={styles.tiltedBadge}>
                              {item.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Scroll Colophon Footer */}
              <div className={styles.scrollFooter}>
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className={styles.kbd}>↑↓</kbd> Turn Scroll
                  </span>
                  <span>
                    <kbd className={styles.kbd}>↵</kbd> Cast / Open
                  </span>
                </div>
                <span>
                  Press <kbd className={styles.kbd}>Esc</kbd> to roll up
                </span>
              </div>
            </motion.div>

            {/* Bottom Scroll Roller */}
            <motion.div
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={styles.scrollBottomRoller}
            >
              <span className={styles.rollerKnobLeft} aria-hidden />
              <span className={styles.rollerText}>✦ 遥か未来 · Tome of Arcana ✦</span>
              <span className={styles.rollerKnobRight} aria-hidden />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
