"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { profile, photos } from "@/content";
import { trackDownload } from "@/lib/track-download";

/** Map scene imageSrc → blurDataURL from the photos module. */
const BLUR_MAP: Record<string, string | undefined> = {
  [photos.setup.src]: photos.setup.blurDataURL,
  [photos.awardTrophy.src]: photos.awardTrophy.blurDataURL,
};

interface StoryScene {
  id: number;
  actShort: string;
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
  imageOrientation?: "portrait" | "landscape";
  imageAspectRatio?: string;
  chips?: string[];
  type: "terminal" | "photo" | "vector" | "dossier";
}

const SCENES: StoryScene[] = [
  {
    id: 1,
    actShort: "Act 01",
    actLabel: "Act 01 · The First Spark",
    themeClass: "from-[#080c14] via-[#0d1322] to-[#06080e]",
    accentColor: "#4f8cff",
    ambientGlow: "rgba(79, 140, 255, 0.22)",
    title: "The First Spark",
    subtitle: "2022 · Starting in Production",
    narrativeLead:
      "Every senior engineer begins as someone willing to sit with the problem when everyone else has logged off.",
    narrativeBody:
      "In July 2022, I joined OneIT Australia as an intern right after completing my BCA with 86%. Working remotely across Australian business hours meant diagnosing production deadlocks at 11 PM on a Tuesday, then sitting for university exams the next morning. It built my habit of staying calm and methodical under pressure.",
    metricLabel: "Academic & Career Start",
    metricValue: "86% BCA · Intern to Jr SWE",
    chips: ["OneIT Australia", "BCA 86% Distinction", "Java & Angular Platforms"],
    type: "terminal",
  },
  {
    id: 2,
    actShort: "Act 02",
    actLabel: "Act 02 · Focus & Craft",
    themeClass: "from-[#130d0a] via-[#1c130d] to-[#0a0705]",
    accentColor: "#f59e0b",
    ambientGlow: "rgba(245, 158, 11, 0.28)",
    title: "The Workstation",
    subtitle: "Late-Night Engineering Focus",
    narrativeLead:
      "Quiet hours when production alarms are quiet and deep engineering takes place.",
    narrativeBody:
      "Real progress rarely happens with noise. It happens late at night: refining database migrations, eliminating ghost records, and building clean service layers that perform reliably under load. A dedicated workstation built for quiet momentum, sustained focus, and rigorous craft.",
    imageSrc: "/photos/setup.jpeg",
    imageAlt: "Ankit's remote engineering workstation with terminal buffers and desk lamp",
    imageCaption: "Workstation · Late-Night Focus",
    imageMeta: "REMOTE ENGINEERING · FARIDABAD",
    imageOrientation: "landscape",
    imageAspectRatio: "899 / 682",
    chips: ["Production Ownership", "Clean Architecture", "Late-Night Focus"],
    type: "photo",
  },
  {
    id: 3,
    actShort: "Act 03",
    actLabel: "Act 03 · Engineering at Scale",
    themeClass: "from-[#060e1a] via-[#091526] to-[#040911]",
    accentColor: "#38bdf8",
    ambientGlow: "rgba(56, 189, 248, 0.25)",
    title: "Engineering at Scale",
    subtitle: "PostgreSQL · pgvector · Enterprise Integration",
    narrativeLead: "Scale is not a buzzword; it is a discipline of honest trade-offs.",
    narrativeBody:
      "Stepping into Senior Software Engineer responsibilities meant owning core infrastructure end-to-end: tuning PostgreSQL HNSW vector indexes over 25 million embeddings to achieve filtered search in under 15 milliseconds, while maintaining fault-tolerant XML/EDI middleware routing enterprise logistics between CargoWise and MYOB with zero data loss.",
    metricLabel: "Production Query Latency",
    metricValue: "Sub-15ms · 25M+ Vectors",
    chips: ["PostgreSQL & pgvector", "Sub-15ms Latency", "Enterprise Middleware"],
    type: "vector",
  },
  {
    id: 4,
    actShort: "Act 04",
    actLabel: "Act 04 · Executive Honours",
    themeClass: "from-[#130f0a] via-[#1a140d] to-[#0a0805]",
    accentColor: "#fbbf24",
    ambientGlow: "rgba(251, 191, 36, 0.25)",
    title: "Company-Wide Recognition",
    subtitle: "Honours Two Consecutive Years",
    narrativeLead: "Recognized two years in a row across OneIT engineering.",
    narrativeBody:
      "Named Mid Developer of the Year in 2024, followed by Runner-up Employee of the Year in 2025 across all engineering tiers at OneIT. While the recognition was humbling, the real reward was knowing our leadership and peers trusted me with the systems that could not afford to fail.",
    imageSrc: "/photos/award-trophy.jpeg",
    imageAlt: "Ankit holding the Runner-up Employee of the Year trophy at OneIT annual honours",
    imageCaption: "OneIT Annual Honours · 2024 & 2025",
    imageMeta: "DOUBLE HONOREE · EXECUTIVE LEADERSHIP",
    imageOrientation: "portrait",
    imageAspectRatio: "1066 / 1599",
    metricLabel: "Executive Recognition",
    metricValue: "Double Honoree · 2024 & 2025",
    chips: ["Mid Developer of the Year (2024)", "Runner-up Employee of the Year (2025)"],
    type: "photo",
  },
  {
    id: 5,
    actShort: "Act 05",
    actLabel: "Act 05 · Beyond the Screen",
    themeClass: "from-[#07110c] via-[#0b1a13] to-[#040b08]",
    accentColor: "#34d399",
    ambientGlow: "rgba(52, 211, 153, 0.22)",
    title: "Clarity Outside the Screen",
    subtitle: "Balance, Perspective, and Quiet Walks",
    narrativeLead: "Stepping away from the screen to reset and maintain clear thinking.",
    narrativeBody:
      "When builds are green and projects ship, I head into the hills: quiet walks in the Himalayas, fresh air, a game of chess, and coffee that takes time to brew. Complex systems require an observant, unhurried mind, and time outside the terminal is what keeps my engineering sharp and patient.",
    imageSrc: "/photos/hills-walk.jpeg",
    imageAlt: "Walking through grassy Himalayan hills with cedar forest in the background",
    imageCaption: "Himalayan Ridges · Himachal",
    imageMeta: "BALANCE & PERSPECTIVE",
    imageOrientation: "landscape",
    imageAspectRatio: "1448 / 1086",
    chips: ["Himalayan Ridges", "Mental Clarity", "Patience & Focus"],
    type: "photo",
  },
  {
    id: 6,
    actShort: "Act 06",
    actLabel: "Act 06 · Executive Overview",
    themeClass: "from-[#130a0d] via-[#1a0e12] to-[#090406]",
    accentColor: "#f43f5e",
    ambientGlow: "rgba(244, 63, 94, 0.25)",
    title: "A Sense of Relief",
    subtitle: "Executive Summary at a Glance",
    narrativeLead:
      "A proven track record of shipping production AI and backend systems with calm ownership.",
    narrativeBody:
      "Three years. Three promotions. A Master's degree earned alongside full-time production delivery. Fast ramp-up, clean code, and reliable communication across global timezones. Ready to step in and solve high-stakes challenges from day one.",
    chips: ["3 Promotions in 3 Years", "25M+ Vector Infrastructure", "Full-Time Remote (AEDT)"],
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

  useEffect(() => {
    const handleReopen = () => {
      setIsDismissed(false);
      setIsExitingTheater(false);
      setIsShutterLifted(true);
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
    <div className="fixed inset-0 z-50 select-none overflow-hidden font-sans h-[100dvh]">
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
        className="fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#06070a] text-[var(--text)] h-[100dvh]"
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
            backgroundSize: "32px 32px",
          }}
          aria-hidden
        />

        {/* TOP HEADER HUD */}
        <header className="relative z-30 flex flex-col gap-2.5 px-4 pt-3.5 sm:px-8 sm:pt-5 md:px-12 max-w-5xl mx-auto w-full">
          {/* Progress Segments */}
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2 w-full">
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

          {/* HUD Controls with Mobile Collision Protection */}
          <div className="flex items-center justify-between w-full pt-0.5">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-2 rounded-full shrink-0 animate-pulse"
                style={{ backgroundColor: activeScene.accentColor }}
              />
              <span className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-white/90 font-semibold truncate">
                <span className="sm:hidden">{activeScene.actShort}</span>
                <span className="hidden sm:inline">{activeScene.actLabel}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                aria-label={isPaused ? "Play" : "Pause"}
                className="font-mono text-xs text-white/70 hover:text-white px-2 sm:px-2.5 py-1 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {isPaused ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    <span className="hidden sm:inline">Play</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <span className="hidden sm:inline">Pause</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={exitToPortfolio}
                aria-label="Exit to Portfolio"
                className="font-mono text-xs text-white/70 hover:text-white px-2 sm:px-2.5 py-1 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span className="hidden sm:inline">Exit to Portfolio</span>
                <span className="sm:hidden">Exit</span>
                <span>✕</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN STAGE (RESPONSIVE 2-COLUMN SPLIT SHOWCASE WITH SMOOTH TRANSITIONS & SAFE SCROLL) */}
        <main className="relative z-30 mx-auto max-w-5xl w-full px-4 sm:px-8 md:px-12 py-3 sm:py-6 flex-1 min-h-0 overflow-y-auto flex items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSceneIdx}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 30 : -30,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  },
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -30 : 30,
                  opacity: 0,
                  transition: {
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center py-2"
            >
              {/* LEFT COLUMN: NARRATIVE & CONTEXT */}
              <div className="lg:col-span-6 space-y-3.5 text-left">
                <p
                  className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold"
                  style={{ color: activeScene.accentColor }}
                >
                  {activeScene.subtitle}
                </p>

                <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
                  {activeScene.title}
                </h2>

                <p className="font-sans text-sm sm:text-base md:text-lg text-white/95 leading-snug font-medium pt-0.5">
                  {activeScene.narrativeLead}
                </p>

                <p className="font-sans text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                  {activeScene.narrativeBody}
                </p>

                {/* Tags / Chips */}
                {activeScene.chips && (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                    {activeScene.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/80"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {/* Metric Pill */}
                {activeScene.metricValue && (
                  <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 mt-1 text-xs">
                    <span className="font-mono text-white/50">
                      {activeScene.metricLabel}:
                    </span>
                    <span
                      className="font-mono font-semibold"
                      style={{ color: activeScene.accentColor }}
                    >
                      {activeScene.metricValue}
                    </span>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: HIGH-DEFINITION VISUAL STAGE (NO CROPPING) */}
              <div className="lg:col-span-6 flex items-center justify-center w-full">
                {/* 1. Terminal Visualizer (Act 1) */}
                {activeScene.type === "terminal" && (
                  <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b0f17]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 text-white/50">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-red-500/80" />
                        <span className="size-2 rounded-full bg-yellow-500/80" />
                        <span className="size-2 rounded-full bg-green-500/80" />
                        <span className="text-[11px] text-white/70 pl-1.5">production-sync.sh</span>
                      </div>
                      <span className="text-[10px] text-sky-400">ACTIVE</span>
                    </div>

                    <div className="space-y-2 text-white/85">
                      <div className="flex justify-between items-center rounded bg-white/5 px-2.5 py-1.5 border border-white/5 text-[11px] sm:text-xs">
                        <span className="text-white/50">FARIDABAD IST:</span>
                        <span className="text-amber-400 font-semibold">23:14:02 · DEEP WORK</span>
                      </div>
                      <div className="flex justify-between items-center rounded bg-white/5 px-2.5 py-1.5 border border-white/5 text-[11px] sm:text-xs">
                        <span className="text-white/50">MELBOURNE AEDT:</span>
                        <span className="text-sky-400 font-semibold">04:44:02 · CLIENT SYNC</span>
                      </div>
                      <div className="pt-2 text-[11px] text-white/60 space-y-1 border-t border-white/5">
                        <p className="text-emerald-400">&gt; [23:14] Resolved connection pool starvation.</p>
                        <p className="text-emerald-400">&gt; [23:19] Zero downtime hotfix verified.</p>
                        <p className="text-white/40">&gt; [09:00] Next: MCA Distributed Systems Exam.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Crisp Photo Showcase (Acts 2, 4, 5) - Full Aspect Ratio Preservation */}
                {activeScene.type === "photo" && activeScene.imageSrc && (
                  <div className="relative group w-full flex justify-center">
                    {/* Backlit Diffused Ambient Glow */}
                    <div
                      className="absolute -inset-2 rounded-2xl opacity-70 blur-xl transition-all duration-700 group-hover:opacity-95"
                      style={{
                        background: `radial-gradient(circle, ${activeScene.ambientGlow} 0%, transparent 70%)`,
                      }}
                    />

                    {/* Elevated Photo Card Respecting Natural Aspect Ratio */}
                    <div
                      className={`relative rounded-2xl overflow-hidden border border-white/20 bg-[#0d0f14] shadow-[0_20px_50px_rgba(0,0,0,0.85)] w-full ${
                        activeScene.imageOrientation === "portrait"
                          ? "max-w-[260px] sm:max-w-[300px] md:max-w-[320px]"
                          : "max-w-md"
                      }`}
                    >
                      <div
                        className="relative w-full overflow-hidden bg-black/40 flex items-center justify-center"
                        style={{
                          aspectRatio: activeScene.imageAspectRatio || "4 / 3",
                          maxHeight: activeScene.imageOrientation === "portrait" ? "360px" : "280px",
                        }}
                      >
                        <Image
                          src={activeScene.imageSrc}
                          alt={activeScene.imageAlt || ""}
                          fill
                          unoptimized
                          priority
                          className="object-contain sm:object-cover sm:object-top transition-transform duration-700 group-hover:scale-[1.02]"
                          {...(activeScene.imageSrc && BLUR_MAP[activeScene.imageSrc] ? { placeholder: "blur" as const, blurDataURL: BLUR_MAP[activeScene.imageSrc] } : {})}
                        />
                      </div>

                      {/* Photo Metadata Footer */}
                      <div className="p-2.5 sm:p-3 flex items-center justify-between text-[11px] font-mono border-t border-white/10 bg-black/75 backdrop-blur-md">
                        <span className="text-white/90 font-medium truncate pr-2">
                          {activeScene.imageCaption}
                        </span>
                        <span
                          className="text-[10px] uppercase font-semibold shrink-0"
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
                  <div className="w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#070e1c]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-white/50">
                      <span className="text-sky-400 font-semibold text-xs">pgvector · HNSW Telemetry</span>
                      <span className="text-emerald-400 text-[11px]">Sub-15ms Latency</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-left">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
                        <span className="text-[10px] text-white/50 block">INDEXED CORPUS</span>
                        <span className="text-lg sm:text-xl font-bold text-white">25,000,000</span>
                        <span className="text-[10px] text-sky-400 block pt-0.5">Embeddings</span>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3">
                        <span className="text-[10px] text-white/50 block">P99 FILTERED LATENCY</span>
                        <span className="text-lg sm:text-xl font-bold text-emerald-400">14.8ms</span>
                        <span className="text-[10px] text-white/50 block pt-0.5">PostgreSQL Engine</span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-black/40 p-2.5 sm:p-3 text-[11px] text-white/75 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-white/50">HNSW Parameters:</span>
                        <span className="text-sky-300 font-medium">m=16, ef_construction=64</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Index Bloat:</span>
                        <span className="text-emerald-400 font-medium">0.0% (Automated VACUUM)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/50">Enterprise Middleware:</span>
                        <span className="text-white/90 font-medium">CargoWise, MYOB, ERP EDI</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Recruiter Dossier Stage (Act 6) */}
                {activeScene.type === "dossier" && (
                  <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#140a0e]/95 shadow-2xl p-4 sm:p-5 backdrop-blur-md space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="font-mono text-xs text-rose-400 uppercase tracking-wider font-semibold">
                        Executive Summary
                      </span>
                      <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-left text-xs">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">TRAJECTORY</span>
                        <span className="font-semibold text-white">3 Promotions in 3 Yrs</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">SCALE</span>
                        <span className="font-semibold text-white">25M+ Vectors</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">HONOURS</span>
                        <span className="font-semibold text-white">Double Honoree</span>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">LOCATION</span>
                        <span className="font-semibold text-white">Remote AEDT</span>
                      </div>
                    </div>

                    <div className="pt-1 flex flex-col gap-2">
                      <a
                        href={profile.resumePdf}
                        download
                        onClick={() => trackDownload(profile.resumePdf)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 font-sans text-xs font-semibold text-[var(--bg)] shadow-[0_0_20px_var(--accent-glow)] transition-all hover:scale-[1.02]"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        <span>Download Resume PDF</span>
                      </a>

                      <a
                        href={`mailto:${profile.email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 font-sans text-xs font-medium text-white hover:bg-white/10 transition-colors"
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
                        className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-white pt-0.5 transition-colors cursor-pointer"
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
        <footer className="relative z-30 flex items-center justify-between px-6 py-3.5 sm:px-8 sm:py-4 md:px-12 border-t border-white/10 max-w-5xl mx-auto w-full bg-[#06070a]/90 backdrop-blur-sm" style={{ paddingBottom: 'calc(0.875rem + env(safe-area-inset-bottom, 0px))' }}>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentSceneIdx === 0}
              className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous scene"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label="Next scene"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="font-mono text-xs text-white/50 pl-1.5">
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
        className="fixed inset-0 z-50 flex flex-col justify-between bg-[#08090c] text-[var(--text)] select-none pointer-events-auto h-[100dvh]"
        style={{
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
        <header className="relative z-10 flex items-center justify-between px-4 py-4 sm:px-8 sm:py-6 md:px-12 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/75 font-medium">
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
        <main className="relative z-10 mx-auto max-w-2xl px-4 text-center my-auto">
          <p className="font-jp text-xs sm:text-sm uppercase tracking-[0.28em] text-[var(--accent)] mb-3">
            遥か未来 · 反魔法
          </p>
          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
            Welcome to Haruka Mirai.
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
            A quiet journey through engineering, scale, and craft. Step inside to explore how high-stakes systems were built.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={liftShutter}
              className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--accent)] px-7 py-3.5 font-sans text-xs sm:text-sm font-semibold text-[var(--bg)] shadow-[0_0_35px_var(--accent-glow)] transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Lift Shutter & Enter</span>
              <svg
                width="15"
                height="15"
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
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <span>Browse Portfolio Directly</span>
            </button>
          </div>

          <p className="mt-4 font-mono text-[11px] text-white/35">
            Press Space or Enter to lift
          </p>
        </main>

        {/* Shutter Bottom Architectural Grip Lip */}
        <footer className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-8 sm:py-4 md:px-12 border-t border-white/10 bg-black/40 font-mono text-[11px] text-white/40 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <span>Ankit Mishra · Senior SWE</span>
          <span className="hidden sm:inline">▲ ARCHITECTURAL SHUTTER · PULL UP TO ENTER</span>
          <span>OneIT Australia</span>
        </footer>
      </motion.div>
    </div>
  );
}
