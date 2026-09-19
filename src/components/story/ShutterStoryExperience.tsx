"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { profile } from "@/content";

interface StoryScene {
  id: number;
  actLabel: string;
  themeClass: string;
  accentColor: string;
  ambientGlow: string;
  title: string;
  subtitle: string;
  narrativeLead: string;
  narrativeBody: string;
  metricLabel?: string;
  metricValue?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageCaption?: string;
  imageMeta?: string;
  chips?: string[];
  type: "terminal" | "photo" | "vector" | "dossier";
}

const SCENES: StoryScene[] = [
  {
    id: 1,
    actLabel: "Act 01 · The First Spark",
    themeClass: "from-[#090d16] via-[#0e1320] to-[#07090f]",
    accentColor: "#4f8cff",
    ambientGlow: "rgba(79, 140, 255, 0.22)",
    title: "The First Spark",
    subtitle: "July 2022 · From University to Production",
    narrativeLead:
      "Every senior engineer begins as someone willing to sit with the problem when everyone else has logged off.",
    narrativeBody:
      "In July 2022, I joined OneIT Australia as an intern right after graduating with 86% in computer applications. Working remote from Faridabad across Australian business hours meant debugging production deadlocks at 11 PM on a Tuesday, then sitting for 9 AM university exams the next morning. It taught me how to stay calm when alarms sound.",
    metricLabel: "Academic & Career Start",
    metricValue: "86% MCA · Intern to Jr SWE",
    chips: ["OneIT Australia", "BCA 86%", "Java & Angular"],
    type: "terminal",
  },
  {
    id: 2,
    actLabel: "Act 02 · The Sanctuary",
    themeClass: "from-[#140e0b] via-[#1f1510] to-[#0d0907]",
    accentColor: "#f59e0b",
    ambientGlow: "rgba(245, 158, 11, 0.28)",
    title: "The Midnight Battlestation",
    subtitle: "Where the Deploys Happen",
    narrativeLead:
      "High engineering rigor on the left; anime, coffee, and quiet hobbies on the right.",
    narrativeBody:
      "Two screens glowing in the dark: database migrations and asynchronous replication queues on the terminal. A tablet streaming Sword Art Online on the desk. Cold brew and Belgian dark chocolate to keep momentum alive past midnight. Real engineering doesn't need to be loud; it requires quiet precision, zero ghost records, and craft.",
    imageSrc: "/photos/setup.jpeg",
    imageAlt:
      "Late-night engineering battlestation with dual screens, terminal buffers, and Sword Art Online stream",
    imageCaption: "The Battlestation · 01:42 AM",
    imageMeta: "DUAL DISPLAYS · CODE & SAO STREAM",
    chips: ["Dual Display", "Cold Brew & Chocolate", "Sword Art Online"],
    type: "photo",
  },
  {
    id: 3,
    actLabel: "Act 03 · The Crucible of Scale",
    themeClass: "from-[#07101e] via-[#0b172a] to-[#050b14]",
    accentColor: "#38bdf8",
    ambientGlow: "rgba(56, 189, 248, 0.25)",
    title: "Taming 25 Million Embeddings",
    subtitle: "PostgreSQL · pgvector · Enterprise Middleware",
    narrativeLead: "Scale is not a buzzword; it is a discipline of honest trade-offs.",
    narrativeBody:
      "Stepping into Senior Software Engineer responsibilities meant owning core infrastructure end-to-end. Engineered document retrieval over 25 million pgvector embeddings on PostgreSQL: tuned HNSW graph construction, resolved index bloat, and conquered VACUUM stalls to deliver filtered vector search in under 15 milliseconds. Concurrently built fault-tolerant XML/EDI middleware routing enterprise logistics between ERPs, CargoWise, and MYOB with zero data loss.",
    metricLabel: "Production Query Latency",
    metricValue: "Sub-15ms · 25M+ Vectors",
    chips: ["pgvector HNSW", "Zero Index Bloat", "XML/EDI Pipelines"],
    type: "vector",
  },
  {
    id: 4,
    actLabel: "Act 04 · Quiet Recognition",
    themeClass: "from-[#14100c] via-[#1c1610] to-[#0c0907]",
    accentColor: "#fbbf24",
    ambientGlow: "rgba(251, 191, 36, 0.25)",
    title: "Company-Wide Recognition",
    subtitle: "Honours Two Consecutive Years",
    narrativeLead: "The firm noticed the quiet work.",
    narrativeBody:
      "Named Mid Developer of the Year in 2024, followed by Runner-up Employee of the Year in 2025 across all engineering tiers at OneIT. Recognition is humbling, but the true reward was knowing our leadership and peers trusted me with the systems that could not afford to fail.",
    imageSrc: "/photos/award-trophy.jpeg",
    imageAlt: "Ankit holding the Runner-up Employee of the Year trophy",
    imageCaption: "OneIT Honours · 2024 & 2025",
    imageMeta: "DOUBLE HONOREE · EXECUTIVE LEADERSHIP",
    metricLabel: "Executive Recognition",
    metricValue: "Double Honoree · 2024 & 2025",
    chips: ["Mid Developer of the Year", "Runner-up Employee of the Year"],
    type: "photo",
  },
  {
    id: 5,
    actLabel: "Act 05 · Beyond the Screen",
    themeClass: "from-[#08130e] via-[#0d1e16] to-[#050d0a]",
    accentColor: "#34d399",
    ambientGlow: "rgba(52, 211, 153, 0.22)",
    title: "Clarity Outside the Terminal",
    subtitle: "Hills, Rivers, and Quiet Walks",
    narrativeLead: "Faridabad is flat. The mountains are a night's drive away.",
    narrativeBody:
      "When builds are green, I head for the Himalayan ridges: barefoot walks through high meadows, swims in glacial rivers, a game of chess, and coffee that takes ten minutes to brew. Good engineering begins with a quiet, observant mind.",
    imageSrc: "/photos/hills-walk.jpeg",
    imageAlt: "Walking through Himalayan hills and cedar forest",
    imageCaption: "Himalayan Ridges · 3,100M",
    imageMeta: "CLEAR HEAD · QUIET CRAFT",
    chips: ["Himalayan Ridges", "Glacial Rivers", "Chess & Pour-Over"],
    type: "photo",
  },
  {
    id: 6,
    actLabel: "Act 06 · Executive Overview",
    themeClass: "from-[#140b0e] via-[#1d0f14] to-[#0a0507]",
    accentColor: "#f43f5e",
    ambientGlow: "rgba(244, 63, 94, 0.25)",
    title: "A Sense of Relief",
    subtitle: "Everything You Need to Know at a Glance",
    narrativeLead:
      "If you are searching for someone who can step in on day one, take ownership of complex AI and backend systems, and bring calm confidence to your team:",
    narrativeBody:
      "Three years. Three promotions. A Master's degree earned in the cracks between deploys. No fluff, no buzzword theatre—just clean systems, resilient code, and reliable partnership.",
    chips: ["3 Promotions in 3 Years", "25M+ Vector Scale", "Remote Australia & Global"],
    type: "dossier",
  },
];

const SCENE_DURATION_MS = 12000;

export function ShutterStoryExperience() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isShutterLifted, setIsShutterLifted] = useState(false);
  const [isExitingTheater, setIsExitingTheater] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressTimerRef = useRef<number | null>(null);

  // Check session storage on mount
  useEffect(() => {
    const hasSeen = sessionStorage.getItem("haruka_shutter_seen");
    if (hasSeen === "true") {
      setIsDismissed(true);
      setIsShutterLifted(true);
    }

    const handleReopen = () => {
      setIsDismissed(false);
      setIsExitingTheater(false);
      setIsShutterLifted(true); // Open directly into story theater
      setCurrentSceneIdx(0);
      setDirection(1);
      setProgress(0);
      setIsPaused(false);
    };

    window.addEventListener("open-shutter-story", handleReopen);
    return () => window.removeEventListener("open-shutter-story", handleReopen);
  }, []);

  const liftShutter = () => {
    setIsShutterLifted(true);
    sessionStorage.setItem("haruka_shutter_seen", "true");
    setCurrentSceneIdx(0);
    setDirection(1);
    setProgress(0);
    setIsPaused(false);
  };

  const exitToPortfolio = () => {
    setIsExitingTheater(true);
    sessionStorage.setItem("haruka_shutter_seen", "true");
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  };

  const goNext = () => {
    if (currentSceneIdx < SCENES.length - 1) {
      setDirection(1);
      setCurrentSceneIdx((c) => c + 1);
      setProgress(0);
    } else {
      exitToPortfolio();
    }
  };

  const goPrev = () => {
    if (currentSceneIdx > 0) {
      setDirection(-1);
      setCurrentSceneIdx((c) => c - 1);
      setProgress(0);
    }
  };

  const jumpToScene = (idx: number) => {
    setDirection(idx > currentSceneIdx ? 1 : -1);
    setCurrentSceneIdx(idx);
    setProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    if (isDismissed) return;

    const onKey = (e: KeyboardEvent) => {
      if (!isShutterLifted) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          liftShutter();
        }
        return;
      }

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
  }, [isDismissed, isShutterLifted, currentSceneIdx]);

  // Scene auto-advance timer
  useEffect(() => {
    if (!isShutterLifted || isExitingTheater || isDismissed || isPaused) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const interval = 80;
    const step = (interval / SCENE_DURATION_MS) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSceneIdx < SCENES.length - 1) {
            setDirection(1);
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
  }, [isShutterLifted, isExitingTheater, isDismissed, currentSceneIdx, isPaused]);

  if (isDismissed) {
    return null;
  }

  const activeScene = SCENES[currentSceneIdx];

  return (
    <div className="fixed inset-0 z-50 select-none overflow-hidden font-sans">
      {/* 
        ========================================================================
        LAYER 1: CINEMATIC STORYLINE THEATER (Sits underneath at z-40)
        ========================================================================
      */}
      <motion.div
        id="storyline-theater"
        initial={{ y: 0, scale: 0.97, opacity: 0.8 }}
        animate={{
          y: isExitingTheater ? "-100%" : 0,
          scale: isShutterLifted ? 1 : 0.97,
          opacity: isExitingTheater ? 0 : 1,
        }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#06070a] text-[var(--text)]"
      >
        {/* Dynamic Scene Atmosphere Gradient */}
        <div
          className={`absolute inset-0 transition-all duration-1000 bg-gradient-to-b ${activeScene.themeClass}`}
        />

        {/* Ambient Halo behind Stage */}
        <div
          className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            backgroundImage: `radial-gradient(circle at 60% 45%, ${activeScene.ambientGlow} 0%, transparent 65%)`,
          }}
          aria-hidden
        />

        {/* Subtle Architectural Fine Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
          aria-hidden
        />

        {/* TOP HEADER HUD */}
        <header className="relative z-30 flex flex-col gap-3 px-6 pt-5 md:px-12">
          {/* Progress Segments */}
          <div className="grid grid-cols-6 gap-2 w-full max-w-5xl mx-auto">
            {SCENES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Jump to ${s.actLabel}`}
                onClick={() => jumpToScene(idx)}
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
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full pt-1">
            <div className="flex items-center gap-2.5">
              <span
                className="size-2 rounded-full animate-pulse"
                style={{ backgroundColor: activeScene.accentColor }}
              />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/85 font-semibold">
                {activeScene.actLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="font-mono text-xs text-white/60 hover:text-white px-2.5 py-1 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer"
              >
                {isPaused ? "Play" : "Pause"}
              </button>
              <button
                type="button"
                onClick={exitToPortfolio}
                className="font-mono text-xs text-white/60 hover:text-white px-2.5 py-1 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer"
              >
                Exit to Portfolio ✕
              </button>
            </div>
          </div>
        </header>

        {/* MAIN STAGE (2-COLUMN SPLIT SHOWCASE WITH SMOOTH TRANSITIONS) */}
        <main className="relative z-30 mx-auto max-w-5xl w-full px-6 py-4 md:py-6 my-auto flex-1 flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSceneIdx}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 35 : -35,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -35 : 35,
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              {/* LEFT COLUMN: NARRATIVE & CONTEXT */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <p
                  className="font-mono text-xs uppercase tracking-[0.22em] font-semibold"
                  style={{ color: activeScene.accentColor }}
                >
                  {activeScene.subtitle}
                </p>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                  {activeScene.title}
                </h2>

                <p className="font-sans text-base sm:text-lg text-white/95 leading-snug font-medium pt-1">
                  {activeScene.narrativeLead}
                </p>

                <p className="font-sans text-sm sm:text-base text-white/70 leading-relaxed">
                  {activeScene.narrativeBody}
                </p>

                {/* Tags / Chips */}
                {activeScene.chips && (
                  <div className="flex flex-wrap gap-2 pt-2">
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

                {/* Metric Pill */}
                {activeScene.metricValue && (
                  <div className="inline-flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-1.5 mt-2">
                    <span className="font-mono text-xs text-white/50">
                      {activeScene.metricLabel}:
                    </span>
                    <span
                      className="font-mono text-xs font-semibold"
                      style={{ color: activeScene.accentColor }}
                    >
                      {activeScene.metricValue}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: HIGH-DEFINITION VISUAL STAGE */}
              <div className="lg:col-span-6 flex items-center justify-center">
                {/* 1. Terminal Visualizer (Act 1) */}
                {activeScene.type === "terminal" && (
                  <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0f17]/90 shadow-2xl p-5 font-mono text-xs backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="size-2.5 rounded-full bg-red-500/80" />
                        <span className="size-2.5 rounded-full bg-yellow-500/80" />
                        <span className="size-2.5 rounded-full bg-green-500/80" />
                        <span className="text-[11px] text-white/70 pl-2">dual-timezone-relay.sh</span>
                      </div>
                      <span className="text-[10px] text-sky-400">ACTIVE</span>
                    </div>

                    <div className="space-y-2.5 text-white/80">
                      <div className="flex justify-between rounded bg-white/5 p-2 border border-white/5">
                        <span className="text-white/50">FARIDABAD IST:</span>
                        <span className="text-amber-400 font-semibold">23:14:02 · DEBUGGING</span>
                      </div>
                      <div className="flex justify-between rounded bg-white/5 p-2 border border-white/5">
                        <span className="text-white/50">MELBOURNE AEDT:</span>
                        <span className="text-sky-400 font-semibold">04:44:02 · PROD READY</span>
                      </div>
                      <div className="pt-2 text-[11px] text-white/60 space-y-1.5 border-t border-white/5">
                        <p className="text-emerald-400">&gt; [23:14:02] Resolved deadlock in replication queue.</p>
                        <p className="text-emerald-400">&gt; [23:19:40] Hotfix deployed with zero downtime.</p>
                        <p className="text-white/40">&gt; [09:00:00] Next: MCA Distributed Systems Exam.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Crisp Framed Photo Showcase (Acts 2, 4, 5) */}
                {activeScene.type === "photo" && activeScene.imageSrc && (
                  <div className="relative group w-full max-w-md">
                    {/* Backlit Diffused Glow */}
                    <div
                      className="absolute -inset-2 rounded-2xl opacity-75 blur-xl transition-all duration-700 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle, ${activeScene.ambientGlow} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Elevated Photo Card */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-[#0d0f14] shadow-[0_25px_60px_rgba(0,0,0,0.85)]">
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={activeScene.imageSrc}
                          alt={activeScene.imageAlt || ""}
                          fill
                          unoptimized
                          priority
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                      </div>

                      {/* Photo Metadata Footer */}
                      <div className="absolute bottom-0 inset-x-0 p-3.5 flex items-center justify-between text-[11px] font-mono border-t border-white/10 bg-black/60 backdrop-blur-md">
                        <span className="text-white/90 font-medium">
                          {activeScene.imageCaption}
                        </span>
                        <span
                          className="text-[10px] uppercase font-semibold"
                          style={{ color: activeScene.accentColor }}
                        >
                          {activeScene.imageMeta}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Scale pgvector HNSW Stage (Act 3) */}
                {activeScene.type === "vector" && (
                  <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#070e1c]/90 shadow-2xl p-5 font-mono text-xs backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-white/50">
                      <span className="text-sky-400 font-semibold">pgvector · HNSW Index</span>
                      <span className="text-emerald-400 text-[11px]">Sub-15ms Latency</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="text-[10px] text-white/50 block">INDEXED CORPUS</span>
                        <span className="text-xl font-bold text-white">25,000,000</span>
                        <span className="text-[10px] text-sky-400 block pt-0.5">Embeddings</span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <span className="text-[10px] text-white/50 block">P99 FILTERED LATENCY</span>
                        <span className="text-xl font-bold text-emerald-400">14.8ms</span>
                        <span className="text-[10px] text-white/50 block pt-0.5">PostgreSQL Engine</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-[11px] text-white/70 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/50">HNSW Parameters:</span>
                        <span className="text-sky-300">m=16, ef_construction=64</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Index Bloat:</span>
                        <span className="text-emerald-400">0.0% (Automated VACUUM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Enterprise Middleware:</span>
                        <span className="text-white/90">CargoWise, MYOB, ERP EDI</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Recruiter Dossier Stage (Act 6) */}
                {activeScene.type === "dossier" && (
                  <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#140a0e]/90 shadow-2xl p-6 backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <span className="font-mono text-xs text-rose-400 uppercase tracking-wider font-semibold">
                        Executive Summary
                      </span>
                      <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">TRAJECTORY</span>
                        <span className="font-semibold text-white">3 Promotions in 3 Yrs</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">SCALE</span>
                        <span className="font-semibold text-white">25M+ Vectors</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">HONOURS</span>
                        <span className="font-semibold text-white">Double Honoree</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">LOCATION</span>
                        <span className="font-semibold text-white">Remote AEDT</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2.5">
                      <Link
                        href={profile.resumePdf}
                        download
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 font-sans text-xs font-semibold text-[var(--bg)] shadow-[0_0_25px_var(--accent-glow)] transition-all hover:scale-[1.02]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Resume PDF</span>
                      </Link>

                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 font-sans text-xs font-medium text-white hover:bg-white/10 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                          <polyline points="22,6 12,13 2,6" />
                        </svg>
                        <span>Email Ankit Mishra</span>
                      </a>

                      <button
                        type="button"
                        onClick={exitToPortfolio}
                        className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-white pt-1 transition-colors cursor-pointer"
                      >
                        <span>Explore Full Portfolio →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* BOTTOM FOOTER NAVIGATION */}
        <footer className="relative z-30 flex items-center justify-between px-6 pb-5 md:px-12 border-t border-white/10 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentSceneIdx === 0}
              className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
      </motion.div>

      {/* 
        ========================================================================
        LAYER 2: PHYSICAL ARCHITECTURAL SHUTTER GATE (Sits on top at z-50)
        ========================================================================
      */}
      <motion.div
        initial={false}
        animate={{ y: isShutterLifted ? "-100%" : "0%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090c] text-[var(--text)] select-none pointer-events-auto"
        style={{
          // Physical architectural shutter louvers / slats texture
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "100% 32px",
        }}
      >
        {/* Subtle Ambient Radial Backlight */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 40%, rgba(190, 24, 93, 0.18), transparent 70%)",
          }}
          aria-hidden
        />

        {/* Top Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-white/75 font-medium">
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
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="transition-transform group-hover:-translate-y-0.5"
              >
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

          <p className="mt-4 font-mono text-xs text-white/35">
            Press Space or Enter to lift
          </p>
        </main>

        {/* Shutter Bottom Architectural Grip Lip */}
        <footer className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 border-t border-white/10 bg-black/40 font-mono text-xs text-white/40">
          <span>Ankit Mishra · Senior Software Engineer</span>
          <span className="hidden sm:inline">▲ ARCHITECTURAL SHUTTER · PULL UP TO ENTER</span>
          <span>OneIT Australia · Remote AEDT</span>
        </footer>
      </motion.div>
    </div>
  );
}
