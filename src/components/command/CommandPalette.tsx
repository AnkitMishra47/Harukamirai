"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCareerIndex, SUGGESTED_QUERIES, SearchResultItem } from "./search-index";

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

    if (item.actionId === "open-interactive-story") {
      window.dispatchEvent(new CustomEvent("open-interactive-story"));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
        aria-hidden
      />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="Spotlight Command Search"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3.5 bg-[var(--bg)]">
          <span className="flex size-7 items-center justify-center rounded-lg bg-[var(--accent)]/15 text-[var(--accent)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
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
            placeholder="Search projects, career arc, skills, or quick actions..."
            className="w-full bg-transparent text-sm sm:text-base text-[var(--text)] placeholder-[var(--text-subtle)] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-md p-1 text-xs text-[var(--text-subtle)] hover:text-[var(--text)]"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:inline rounded border border-[var(--border)] bg-[var(--bg-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-subtle)]">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--bg)_85%,transparent)] px-4 py-2 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)] whitespace-nowrap font-semibold">
            Try:
          </span>
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setQuery(q)}
              className="whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--text-muted)]">
              No matching items found for &ldquo;{query}&rdquo;. Try &ldquo;recruiter&rdquo;, &ldquo;RAG&rdquo;, or &ldquo;resume&rdquo;.
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => selectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? "bg-[color-mix(in_oklab,var(--accent-glow)_30%,var(--bg))] border border-[var(--accent)]/50"
                      : "hover:bg-[var(--bg)] border border-transparent"
                  }`}
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)] font-semibold">
                        {item.subtitle}
                      </span>
                    </div>
                    <h4 className="font-display text-sm sm:text-base font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {item.badge && (
                    <div className="text-right shrink-0">
                      <span className="inline-block rounded-full border border-[var(--border)] bg-[var(--bg)] px-2.5 py-0.5 font-mono text-[10px] text-[var(--text-subtle)] group-hover:border-[var(--accent)]/40 group-hover:text-[var(--text)] transition-colors">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcuts */}
        <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-2 font-mono text-[11px] text-[var(--text-subtle)] bg-[var(--bg)]">
          <div className="flex items-center gap-3">
            <span><kbd className="rounded bg-[var(--bg-elevated)] px-1 border border-[var(--border)]">↑↓</kbd> Navigate</span>
            <span><kbd className="rounded bg-[var(--bg-elevated)] px-1 border border-[var(--border)]">↵</kbd> Open</span>
          </div>
          <span className="text-[10px] text-[var(--text-subtle)]">Press Esc to exit</span>
        </div>
      </div>
    </div>
  );
}
