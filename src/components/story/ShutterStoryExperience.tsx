"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content";

interface StoryScene {
  id: number;
  actLabel: string;
  themeClass: string;
  accentColor: string;
  title: string;
  subtitle: string;
  narrativeLead: string;
  narrativeBody: string;
  metricLabel?: string;
  metricValue?: string;
  imageSrc?: string;
  imageAlt?: string;
  quote?: string;
  chips?: string[];
}

const SCENES: StoryScene[] = [
  {
    id: 1,
    actLabel: "Act 01 · The First Spark",
    themeClass: "from-[#0a0d14] via-[#0d121d] to-[#080a0f]",
    accentColor: "#4f8cff",
    title: "The First Spark",
    subtitle: "July 2022 · From University to Production",
    narrativeLead: "Every senior engineer begins as someone willing to sit with the problem when everyone else has logged off.",
    narrativeBody:
      "In July 2022, I joined OneIT Australia as an intern right after graduating with 86% in computer applications. Working remote from Faridabad across Australian business hours meant debugging production deadlocks at 11 PM on a Tuesday, then sitting for 9 AM university exams the next morning. It taught me how to stay calm when alarms sound.",
    metricLabel: "Academic & Career Start",
    metricValue: "86% MCA · Intern to Jr SWE",
    chips: ["OneIT Australia", "BCA 86%", "Java & Angular"],
  },
  {
    id: 2,
    actLabel: "Act 02 · The Sanctuary",
    themeClass: "from-[#110e0c] via-[#1a1410] to-[#0d0a08]",
    accentColor: "#e69b5c",
    title: "The Midnight Battlestation",
    subtitle: "Where the Deploys Happen",
    narrativeLead: "High engineering rigor on the left; anime, coffee, and quiet hobbies on the right.",
    narrativeBody:
      "Two screens glowing in the dark: database migrations and asynchronous replication queues on the terminal. A tablet streaming Sword Art Online on the desk. Cold coffee and Belgian dark chocolate to keep momentum alive past midnight. Real engineering doesn't need to be loud; it requires quiet precision, zero ghost records, and craft.",
    imageSrc: "/photos/setup.jpeg",
    imageAlt: "Late-night engineering battlestation with dual screens and anime stream",
    chips: ["Dual Display", "Cold Brew & Chocolate", "Sword Art Online"],
  },
  {
    id: 3,
    actLabel: "Act 03 · The Crucible of Scale",
    themeClass: "from-[#080d1a] via-[#0b1426] to-[#060912]",
    accentColor: "#38bdf8",
    title: "Taming 25 Million Embeddings",
    subtitle: "PostgreSQL · pgvector · Enterprise Middleware",
    narrativeLead: "Scale is not a buzzword; it is a discipline of honest trade-offs.",
    narrativeBody:
      "Stepping into Senior Software Engineer responsibilities meant owning core infrastructure end-to-end. Engineered document retrieval over 25 million pgvector embeddings on PostgreSQL: tuned HNSW graph construction, resolved index bloat, and conquered VACUUM stalls to deliver filtered vector search in under 15 milliseconds. Concurrently built fault-tolerant XML/EDI middleware routing enterprise logistics between ERPs, CargoWise, and MYOB with zero data loss.",
    metricLabel: "Production Query Latency",
    metricValue: "Sub-15ms · 25M+ Vectors",
    chips: ["pgvector HNSW", "Zero Index Bloat", "XML/EDI Pipelines"],
  },
  {
    id: 4,
    actLabel: "Act 04 · Quiet Recognition",
    themeClass: "from-[#14100c] via-[#1c1610] to-[#0c0907]",
    accentColor: "#fbbf24",
    title: "Company-Wide Recognition",
    subtitle: "Honours Two Consecutive Years",
    narrativeLead: "The firm noticed the quiet work.",
    narrativeBody:
      "Named Mid Developer of the Year in 2024, followed by Runner-up Employee of the Year in 2025 across all engineering tiers at OneIT. Recognition is humbling, but the true reward was knowing our leadership and peers trusted me with the systems that could not afford to fail.",
    imageSrc: "/photos/award-trophy.jpeg",
    imageAlt: "Ankit holding the Runner-up Employee of the Year trophy",
    metricLabel: "Executive Recognition",
    metricValue: "Double Honoree · 2024 & 2025",
    chips: ["Mid Developer of the Year", "Runner-up Employee of the Year"],
  },
  {
    id: 5,
    actLabel: "Act 05 · Beyond the Screen",
    themeClass: "from-[#08120e] via-[#0d1c16] to-[#050c09]",
    accentColor: "#34d399",
    title: "Clarity Outside the Terminal",
    subtitle: "Hills, Rivers, and Quiet Walks",
    narrativeLead: "Faridabad is flat. The mountains are a night's drive away.",
    narrativeBody:
      "When builds are green, I head for the Himalayan ridges: barefoot walks through high meadows, swims in glacial rivers, a game of chess, and coffee that takes ten minutes to brew. Good engineering begins with a quiet, observant mind.",
    imageSrc: "/photos/hills-walk.jpeg",
    imageAlt: "Walking through Himalayan hills and cedar forest",
    chips: ["Himalayan Ridges", "Glacial Rivers", "Chess & Pour-Over"],
  },
  {
    id: 6,
    actLabel: "Act 06 · Executive Overview",
    themeClass: "from-[#140b0d] via-[#1c0f13] to-[#0a0507]",
    accentColor: "#f43f5e",
    title: "A Sense of Relief",
    subtitle: "Everything You Need to Know at a Glance",
    narrativeLead: "If you are searching for someone who can step in on day one, take ownership of complex AI and backend systems, and bring calm confidence to your team:",
    narrativeBody:
      "Three years. Three promotions. A Master's degree earned in the cracks between deploys. No fluff, no buzzword theatre—just clean systems, resilient code, and reliable partnership.",
    chips: ["3 Promotions in 3 Years", "25M+ Vector Scale", "Remote Australia & Global"],
  },
];

const SCENE_DURATION_MS = 12000;

export function ShutterStoryExperience() {
  const [shutterState, setShutterState] = useState<"closed" | "opening" | "open">("closed");
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("haruka_shutter_seen");
    if (hasSeen === "true") {
      setShutterState("open");
    }

    const handleReopen = () => {
      setShutterState("closed");
      setCurrentSceneIdx(0);
      setProgress(0);
      setIsPaused(false);
    };

    window.addEventListener("open-shutter-story", handleReopen);
    return () => window.removeEventListener("open-shutter-story", handleReopen);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (shutterState !== "opening") return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        exitToPortfolio();
      } else if (e.key === "ArrowRight") {
        goNext();
      } else if (e.key === "ArrowLeft") {
        goPrev();
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shutterState, currentSceneIdx]);

  // Scene auto-advance timer
  useEffect(() => {
    if (shutterState !== "opening" || isPaused) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const interval = 80;
    const step = (interval / SCENE_DURATION_MS) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSceneIdx < SCENES.length - 1) {
            setCurrentSceneIdx((curr) => curr + 1);
            return 0;
          } else {
            setIsPaused(true);
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [shutterState, currentSceneIdx, isPaused]);

  const liftShutter = () => {
    setShutterState("opening");
    sessionStorage.setItem("haruka_shutter_seen", "true");
    setCurrentSceneIdx(0);
    setProgress(0);
    setIsPaused(false);
  };

  const exitToPortfolio = () => {
    setShutterState("open");
    sessionStorage.setItem("haruka_shutter_seen", "true");
  };

  const goNext = () => {
    setCurrentSceneIdx((c) => {
      if (c < SCENES.length - 1) {
        return c + 1;
      } else {
        exitToPortfolio();
        return c;
      }
    });
    setProgress(0);
  };

  const goPrev = () => {
    setCurrentSceneIdx((c) => Math.max(0, c - 1));
    setProgress(0);
  };

  if (shutterState === "open") {
    return null;
  }

  const activeScene = SCENES[currentSceneIdx];

  // Render Closed Shutter Gate Entrance
  if (shutterState === "closed") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090c] text-[var(--text)] select-none">
        {/* Subtle Ambient Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 40%, rgba(190, 24, 93, 0.15), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Top Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/70 font-medium">
              HARUKA MIRAI · 遥か未来
            </span>
          </div>
          <button
            type="button"
            onClick={exitToPortfolio}
            className="font-mono text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            Skip to index →
          </button>
        </header>

        {/* Center Sanctuary Callout */}
        <main className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <p className="font-jp text-sm uppercase tracking-[0.32em] text-[var(--accent)] mb-4">
            遥か未来 · 反魔法
          </p>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05]">
            Welcome to Haruka Mirai.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            A quiet journey through engineering, scale, and craft. Step inside to explore how high-stakes systems were built.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={liftShutter}
              className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--accent)] px-8 py-4 font-sans text-sm font-semibold text-[var(--bg)] shadow-[0_0_40px_var(--accent-glow)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Lift Shutter & Enter</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-y-0.5">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>

            <button
              type="button"
              onClick={exitToPortfolio}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 font-mono text-xs uppercase tracking-[0.16em] text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <span>Browse Portfolio Directly</span>
            </button>
          </div>
          <p className="mt-4 font-mono text-[11px] text-white/40">
            Press Space or Enter to lift
          </p>
        </main>

        {/* Footer Meta */}
        <footer className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-t border-white/10 text-xs font-mono text-white/50">
          <span>Ankit Mishra · Senior Software Engineer</span>
          <span>OneIT Australia · Remote AEDT</span>
        </footer>
      </div>
    );
  }

  // Render Cinematic Storyline Theater
  return (
    <div id="storyline-theater" className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-black text-[var(--text)]">
      {/* Background Atmosphere & Dynamic Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-1000 bg-gradient-to-b ${activeScene.themeClass}`}
      />

      {/* Atmospheric Image Backdrop (if scene has an image) */}
      {activeScene.imageSrc && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-35 transition-opacity duration-1000">
          <Image
            src={activeScene.imageSrc}
            alt={activeScene.imageAlt || ""}
            fill
            unoptimized
            priority
            className="object-cover object-center scale-105 filter blur-sm transition-transform duration-[12000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        </div>
      )}

      {/* Top Header HUD */}
      <header className="relative z-20 flex flex-col gap-4 px-6 pt-6 md:px-12">
        {/* Progress Bars for all 6 scenes */}
        <div className="grid grid-cols-6 gap-2 w-full max-w-4xl mx-auto">
          {SCENES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Jump to ${s.actLabel}`}
              onClick={() => {
                setCurrentSceneIdx(idx);
                setProgress(0);
              }}
              className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden cursor-pointer transition-all hover:h-2 focus:outline-none focus:ring-1 focus:ring-white/40"
            >
              <div
                className="h-full transition-all duration-100 ease-linear rounded-full"
                style={{
                  backgroundColor: activeScene.accentColor,
                  width:
                    idx < currentSceneIdx
                      ? "100%"
                      : idx === currentSceneIdx
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </button>
          ))}
        </div>

        {/* HUD Controls */}
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full pt-1">
          <div className="flex items-center gap-2.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: activeScene.accentColor }}
            />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">
              {activeScene.actLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPaused((p) => !p)}
              className="rounded border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              {isPaused ? "Play" : "Pause"}
            </button>
            <button
              type="button"
              onClick={exitToPortfolio}
              className="rounded border border-white/20 bg-black/40 px-3 py-1 font-mono text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Exit to Portfolio ✕
            </button>
          </div>
        </div>
      </header>

      {/* Center Narrative Content */}
      <main className="relative z-20 mx-auto max-w-3xl px-6 py-8 md:py-12 my-auto text-left">
        <div className="space-y-4">
          <p
            className="font-mono text-xs uppercase tracking-[0.24em] font-semibold"
            style={{ color: activeScene.accentColor }}
          >
            {activeScene.subtitle}
          </p>

          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-tight">
            {activeScene.title}
          </h2>

          <p className="font-sans text-lg sm:text-xl text-white/95 leading-snug font-medium pt-2">
            {activeScene.narrativeLead}
          </p>

          <p className="font-sans text-sm sm:text-base text-white/75 leading-relaxed pt-1">
            {activeScene.narrativeBody}
          </p>

          {/* Chips */}
          {activeScene.chips && (
            <div className="flex flex-wrap gap-2 pt-3">
              {activeScene.chips.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-white/80"
                >
                  {c}
                </span>
              ))}
            </div>
          )}

          {/* Special Act 6 Actions (The Recruiter Peace Sign) */}
          {activeScene.id === 6 && (
            <div className="pt-6 flex flex-wrap items-center gap-3">
              <a
                href={profile.resumePdf}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 font-sans text-sm font-semibold text-[var(--bg)] shadow-lg hover:bg-[var(--accent-hover)] transition-colors cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Resume PDF</span>
              </a>

              <a
                href={`mailto:${profile.links.find((l) => l.label === "Email")?.value || "ankitm17.2001@gmail.com"}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 font-sans text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>Email Ankit Mishra</span>
              </a>

              <button
                type="button"
                onClick={exitToPortfolio}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-transparent px-5 py-3 font-sans text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <span>Explore Full Portfolio →</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Footer & Navigation */}
      <footer className="relative z-20 flex items-center justify-between px-6 pb-6 md:px-12 border-t border-white/10 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentSceneIdx === 0}
            className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous scene"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Next scene"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <span className="font-mono text-xs text-white/50 pl-2">
            Scene {currentSceneIdx + 1} of {SCENES.length}
          </span>
        </div>

        <button
          type="button"
          onClick={exitToPortfolio}
          className="font-mono text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          Skip to Portfolio →
        </button>
      </footer>
    </div>
  );
}
