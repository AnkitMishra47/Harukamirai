"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { profile, photos, type Photo } from "@/content";
import { trackDownload } from "@/lib/track-download";
import { successionEngine } from "@/lib/audio-synthesizer";
import styles from "./story-scene.module.css";

/**
 * Every photograph the story can show, keyed by its own src.
 *
 * A scene names a file and nothing else. Its real pixel size, and therefore the
 * shape of the frame it is shown in, is read from `src/content/photos.ts`, which
 * `content.test.ts` checks against the JPEG headers on disk. Scenes used to
 * carry hand-written `imageAspectRatio` strings beside the src, which is exactly
 * how a frame comes to disagree with its file.
 */
const PHOTO_INDEX: Record<string, Photo> = Object.fromEntries(
  [
    photos.portrait,
    photos.setup,
    photos.awardTrophy,
    photos.openRoad,
    ...photos.offTheClock,
  ].map((p) => [p.src, p])
);

/**
 * One readout of a scene's instrument panel.
 *
 * The same two rows are the scene's compact headline figure and, once the
 * detail is open, the top of its full panel. Declared once so the two renderings
 * cannot drift apart.
 */
interface FigureRow {
  label: string;
  value: string;
  note: string;
  valueColor: string;
}

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
  chips?: string[];
  /** The two readouts that carry this scene's figure. Terminal and vector only. */
  figureRows?: [FigureRow, FigureRow];
  /**
   * One external profile belonging to this scene, shown with the chips once the
   * detail is open. Supplied by the site owner, never inferred.
   */
  link?: { label: string; href: string };
  type: "terminal" | "photo" | "vector" | "dossier";
}

/**
 * Act 05's chess profile, read from `profile.links` instead of written here.
 *
 * The handle is Ankit's own and belongs with Email, LinkedIn and GitHub; a copy
 * living in a scene is how it drifts, or gets mistaken for something invented.
 * `content.test.ts` pins the entry, so a missing chip is a failing test rather
 * than a page that throws.
 */
const CHESS_PROFILE = profile.links.find((l) => l.label === "Chess.com");

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
      "In July 2022, I joined OneIT Australia as an intern right after completing my Bachelor's in Computer Applications with 86% distinction. Working remotely across Australian business hours meant diagnosing production deadlocks at 11 PM on a Tuesday, then sitting for university exams the next morning. It built my habit of staying calm and methodical under pressure.",
    metricLabel: "Academic & Career Start",
    metricValue: "86% Distinction · Intern to Jr SWE",
    chips: ["OneIT Australia", "Bachelor's 86% Distinction", "Java & Angular Platforms"],
    figureRows: [
      { label: "IST", value: "23:14:02", note: "DEEP WORK", valueColor: "#fbbf24" },
      { label: "AWST", value: "01:44:02", note: "CLIENT SYNC", valueColor: "#38bdf8" },
    ],
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
    imageMeta: "REMOTE ENGINEERING",
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
    figureRows: [
      { label: "INDEXED CORPUS", value: "25,000,000", note: "Embeddings", valueColor: "#ffffff" },
      {
        label: "P99 FILTERED LATENCY",
        value: "14.8ms",
        note: "PostgreSQL Engine",
        valueColor: "#34d399",
      },
    ],
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
    imageCaption: "Himalayan Ridges",
    imageMeta: "BALANCE & PERSPECTIVE",
    chips: ["Himalayan Ridges", "Mental Clarity", "Patience & Focus"],
    link: CHESS_PROFILE && {
      label: `${CHESS_PROFILE.label} · ${CHESS_PROFILE.value}`,
      href: CHESS_PROFILE.href,
    },
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
      "Three years. Three major milestones. A Master's degree earned alongside full-time production delivery. Fast ramp-up, clean code, and reliable communication across global timezones. Ready to step in and solve high-stakes challenges from day one.",
    chips: ["Rapid Career Progression", "25M+ Vector Infrastructure", "Full-Time Remote (AWST)"],
    type: "dossier",
  },
];

const SCENE_DURATION_MS = 8500;

/**
 * Swipe navigation tuning.
 *
 * A swipe commits when EITHER it travelled far enough OR it was a deliberate
 * flick, so a slow deliberate drag and a quick flick both advance while a small
 * nudge settles back. Distance alone would punish flicks; velocity alone would
 * punish slow, careful drags.
 */
const SWIPE_DISTANCE_RATIO = 0.22; // fraction of the stage width
const SWIPE_DISTANCE_MIN_PX = 56; // floor, so narrow phones stay easy to swipe
const SWIPE_DISTANCE_MAX_PX = 120; // ceiling, so wide screens do not need a marathon drag
const SWIPE_VELOCITY_PX_PER_S = 450; // what separates a flick from a slide
const SWIPE_FLICK_MIN_PX = 24; // a flick still has to actually travel
const SWIPE_FOLLOW_ELASTIC = 0.85; // close to 1:1 tracking of the finger
const SWIPE_EDGE_ELASTIC = 0.12; // near-solid wall where there is nowhere to go
/**
 * How far an outgoing scene slides before it is gone. It has to clear a typical
 * release point, otherwise a committed swipe would visually snap backwards as the
 * exit animation pulled the card in from beyond its own target.
 */
const SCENE_EXIT_OFFSET_PX = 110;

/**
 * How far the pointer may travel between press and release and still count as a
 * tap on the scene. Anything further was a swipe, and a swipe must never also
 * open the detail: the browser fires `click` at the release point after a drag,
 * so the two gestures are told apart by distance rather than trusted to be
 * mutually exclusive.
 */
const TAP_SLOP_PX = 10;

/** Live clock for IST and AWST timezones */
function useLiveTimezones() {
  const [times, setTimes] = useState<{ IST: string; AWST: string }>({
    IST: "00:00:00",
    AWST: "00:00:00",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes({
        IST: now.toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }),
        AWST: now.toLocaleTimeString("en-GB", { timeZone: "Australia/Perth", hour12: false }),
      });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return times;
}

/**
 * The compact form of a scene's instrument panel: two readouts, set large.
 *
 * It exists so that Acts 01 and 03, whose subject is a panel rather than a
 * photograph, still have something occupying their column in the headline state.
 * Every string here is already the scene's own; this is a smaller selection of
 * it, not a summary of it. The card takes the same height budget as a photograph
 * (`--frame-h`, set on the column) so the six scenes fill a comparable envelope.
 */
function CompactFigure({ rows }: { rows: readonly FigureRow[] }) {
  const liveTimes = useLiveTimezones();

  return (
    <div
      className={`max-w-md mx-auto rounded-2xl border border-white/12 bg-white/[0.03] font-mono backdrop-blur-md ${styles.compactFigure}`}
    >
      {rows.map((row, i) => {
        const displayValue =
          row.label === "IST" || row.label === "AWST"
            ? liveTimes[row.label as "IST" | "AWST"] || row.value
            : row.value;

        return (
          <div key={row.label} className={styles.figureRow}>
            {i > 0 && <span className={styles.figureRule} aria-hidden />}
            <span className={`uppercase text-white/45 ${styles.figureLabel}`}>{row.label}</span>
            <span
              className={`font-semibold tabular-nums ${styles.figureValue}`}
              style={{ color: row.valueColor }}
            >
              {displayValue}
            </span>
            <span className={`uppercase tracking-[0.14em] text-white/55 ${styles.figureNote}`}>
              {row.note}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ShutterStoryExperience() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isShutterLifted, setIsShutterLifted] = useState(false);
  const [isExitingTheater, setIsExitingTheater] = useState(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  /**
   * Separate from `isPaused` on purpose: a drag suspends the auto-advance timer
   * without flipping the visible Play/Pause control under the visitor's thumb.
   */
  const [isDragging, setIsDragging] = useState(false);
  /**
   * A scene shows its headline by default. Everything longer than a headline -
   * the narrative body, the chips, the metric, the instrument panels - waits
   * behind this, and the story clock waits with it.
   */
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const progressTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** Press position of the live pointer gesture, for telling a tap from a swipe. */
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleReopen = () => {
      setIsDismissed(false);
      setIsExitingTheater(false);
      setIsShutterLifted(true);
      setCurrentSceneIdx(0);
      setDirection(1);
      setProgress(0);
      setIsPaused(false);
      successionEngine.play();
    };

    window.addEventListener("open-shutter-story", handleReopen);
    return () => {
      window.removeEventListener("open-shutter-story", handleReopen);
      successionEngine.stop();
    };
  }, []);

  // The gate is shown on every visit by design - Ankit's call. There is
  // deliberately no seen-flag: a returning visitor gets the story again.
  const liftShutter = () => {
    setIsShutterLifted(true);
    setCurrentSceneIdx(0);
    setDirection(1);
    setProgress(0);
    setIsPaused(false);
    successionEngine.play();
  };

  const toggleSoundtrack = () => {
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    successionEngine.setMute(next);
  };

  const exitToPortfolio = () => {
    successionEngine.stop();
    setIsExitingTheater(true);
    setTimeout(() => {
      setIsDismissed(true);
    }, 700);
  };

  const shutterPointerDownY = useRef<number | null>(null);

  const handleShutterPointerDown = (e: React.PointerEvent) => {
    shutterPointerDownY.current = e.clientY;
  };

  const handleShutterPointerUp = (e: React.PointerEvent) => {
    if (shutterPointerDownY.current !== null) {
      const deltaY = e.clientY - shutterPointerDownY.current;
      if (deltaY < -35) {
        liftShutter();
      }
      shutterPointerDownY.current = null;
    }
  };

  const handleShutterWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 25) {
      liftShutter();
    }
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

  /**
   * Swipe / drag navigation.
   *
   * The stage follows the pointer horizontally while the gesture is live. Motion
   * owns that transform directly, so the offset is never mirrored into React
   * state and the drag costs no re-renders per frame. On release the gesture
   * either settles back or hands off to the very same goNext / goPrev that the
   * arrow keys and the on-screen buttons use, so every route through the story
   * produces the same transition.
   */
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);
    // A drag that travelled is not a tap, whatever click the browser sends next.
    if (Math.abs(info.offset.x) > TAP_SLOP_PX) pointerDownRef.current = null;

    const stageWidth = stageRef.current?.offsetWidth ?? 0;
    const distanceThreshold = Math.min(
      SWIPE_DISTANCE_MAX_PX,
      Math.max(SWIPE_DISTANCE_MIN_PX, stageWidth * SWIPE_DISTANCE_RATIO)
    );

    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const travelled = Math.abs(offsetX);

    const draggedFarEnough = travelled >= distanceThreshold;
    const flickedHardEnough =
      travelled >= SWIPE_FLICK_MIN_PX &&
      Math.abs(velocityX) >= SWIPE_VELOCITY_PX_PER_S &&
      // A flick that reverses direction at the last moment is not a commit.
      Math.sign(velocityX) === Math.sign(offsetX);

    // Too small to mean anything: motion settles the stage back to rest.
    if (!draggedFarEnough && !flickedHardEnough) return;

    if (offsetX < 0) {
      // Dragged left: forward. On the final scene goNext exits to the portfolio,
      // which is exactly what ArrowRight and the Next button already do.
      goNext();
    } else {
      // Dragged right: back. goPrev is a no-op on the first scene, so the stage
      // simply settles, on top of the heavier edge resistance it already met.
      goPrev();
    }
  };

  /**
   * Tap-to-reveal, living on the same surface as the swipe.
   *
   * The press position is remembered and compared against the release position
   * of the click the browser reports. A swipe moves the pointer well past
   * `TAP_SLOP_PX`, so the click it drags behind it is discarded here; `onDragEnd`
   * clears the press outright as a second guard. A tap that lands on a control -
   * the toggle itself, a resume link, a nav button - is left to that control.
   *
   * It only opens. Closing stays on the button, so that reading the detail and
   * then tapping the text does not snatch it away again.
   */
  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const down = pointerDownRef.current;
    pointerDownRef.current = null;
    if (isDetailOpen || !down) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > TAP_SLOP_PX) return;
    if ((e.target as HTMLElement).closest("a, button, [role='button']")) return;
    setIsDetailOpen(true);
  };

  // A new scene always opens on its headline, and restarts the clock.
  useEffect(() => {
    setIsDetailOpen(false);
  }, [currentSceneIdx]);

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
    // A live drag or an open detail suspends the timer: the visitor is driving,
    // not the clock. Neither flips the visible Play/Pause control.
    if (
      !isShutterLifted ||
      isExitingTheater ||
      isDismissed ||
      isPaused ||
      isDragging ||
      isDetailOpen
    ) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const interval = 40;
    const step = (interval / SCENE_DURATION_MS) * 100;

    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setDirection(1);
          setCurrentSceneIdx((curr) => (curr + 1) % SCENES.length);
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [
    isShutterLifted,
    isExitingTheater,
    isDismissed,
    currentSceneIdx,
    isPaused,
    isDragging,
    isDetailOpen,
  ]);

  if (isDismissed) {
    return null;
  }

  const activeScene = SCENES[currentSceneIdx];
  const activePhoto = activeScene.imageSrc ? PHOTO_INDEX[activeScene.imageSrc] : undefined;
  const detailTextId = `scene-${activeScene.id}-detail`;
  /**
   * The right-hand column only earns its place when it has something in it. A
   * photograph is the point of its scene so it stays in the headline state; the
   * instrument panels are the gibberish, so they wait. Act 06 keeps its two
   * recruiter actions out in the open, which is what that scene is for.
   */
  /*
   * Every scene now carries a figure in its right-hand column - a photograph, a
   * clock, a pair of numbers, four summary tiles - so the split is unconditional
   * and no scene is ever text alone on an empty screen. Nothing in that column
   * waits on the toggle: Acts 01 and 03 swap their compact figure for the full
   * panel, which is a replacement rather than a disclosure, so the toggle owns
   * exactly one region and `aria-controls` names exactly that one.
   */

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
        <header
          className={`relative z-30 flex flex-col gap-2.5 max-w-5xl xl:max-w-6xl mx-auto w-full ${styles.gutter} ${styles.topInset}`}
        >
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
              {/* Succession Soundwave Equalizer Toggle */}
              <button
                type="button"
                onClick={toggleSoundtrack}
                aria-label={isMusicMuted ? "Unmute Succession Theme" : "Mute Succession Theme"}
                title={isMusicMuted ? "Unmute Succession Soundtrack" : "Mute Succession Soundtrack"}
                className={`font-mono text-xs px-2.5 py-1 rounded border transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isMusicMuted
                    ? "text-white/40 border-white/10 bg-white/5 hover:text-white"
                    : "text-amber-400 border-amber-400/40 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                }`}
              >
                <span className="inline-flex items-end gap-[2px] h-[11px]" aria-hidden>
                  <span
                    className={`w-[2px] rounded-full bg-current ${!isMusicMuted ? "animate-pulse" : ""}`}
                    style={{ height: isMusicMuted ? "2px" : "8px" }}
                  />
                  <span
                    className={`w-[2px] rounded-full bg-current ${!isMusicMuted ? "animate-pulse" : ""}`}
                    style={{ height: isMusicMuted ? "4px" : "11px", animationDelay: "150ms" }}
                  />
                  <span
                    className={`w-[2px] rounded-full bg-current ${!isMusicMuted ? "animate-pulse" : ""}`}
                    style={{ height: isMusicMuted ? "2px" : "6px", animationDelay: "300ms" }}
                  />
                </span>
                <span className="hidden sm:inline text-[11px]">
                  {isMusicMuted ? "Audio Muted" : "Succession Theme"}
                </span>
              </button>

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
              {/*
                No aria-label: the accessible name is the visible text, which is
                what `label-content-name-mismatch` asks for. The glyph is hidden
                from the name so it does not read as "Exit to Portfolio times".
              */}
              <button
                type="button"
                onClick={exitToPortfolio}
                className="font-mono text-xs text-white/70 hover:text-white px-2 sm:px-2.5 py-1 rounded border border-white/10 bg-white/5 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span className="hidden sm:inline">Exit to Portfolio</span>
                <span className="sm:hidden">Exit</span>
                <span aria-hidden>✕</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN STAGE (RESPONSIVE 2-COLUMN SPLIT SHOWCASE WITH SMOOTH TRANSITIONS & SAFE SCROLL) */}
        <main
          className={`relative z-30 mx-auto max-w-5xl xl:max-w-6xl w-full py-3 sm:py-6 flex-1 min-h-0 ${styles.gutter} ${styles.stageScroller}`}
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSceneIdx}
              ref={stageRef}
              custom={direction}
              drag={isShutterLifted && !isExitingTheater ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{
                top: 0,
                bottom: 0,
                // `left` governs dragging leftwards, which walks the story forward.
                left: SWIPE_FOLLOW_ELASTIC,
                // `right` governs dragging rightwards, which walks it back. The
                // first scene has nowhere to go, so it resists instead.
                right: currentSceneIdx === 0 ? SWIPE_EDGE_ELASTIC : SWIPE_FOLLOW_ELASTIC,
              }}
              dragMomentum={false}
              dragTransition={
                // Reduced motion keeps the drag (it answers the visitor's own hand)
                // but drops the springy settle: these are motion's own overdamped
                // values, which land the stage back at rest immediately.
                shouldReduceMotion
                  ? { bounceStiffness: 1000000, bounceDamping: 10000000 }
                  : undefined
              }
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onPointerDownCapture={handleStagePointerDown}
              onClick={handleStageClick}
              // Motion sets this itself for drag="x"; stated here so the intent
              // survives a refactor. The browser keeps vertical gestures, so the
              // stage can still be scrolled when it overflows a short screen.
              style={{ touchAction: "pan-y" }}
              variants={{
                enter: (dir: number) => ({
                  x: shouldReduceMotion ? 0 : dir > 0 ? 40 : -40,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: shouldReduceMotion ? 0.2 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  },
                },
                exit: (dir: number) => ({
                  x: shouldReduceMotion ? 0 : dir > 0 ? -40 : 40,
                  opacity: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0.2 : 0.4,
                    ease: [0.4, 0, 0.2, 1],
                  },
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              className={`w-full grid grid-cols-1 items-center lg:grid-cols-12 ${styles.stageItem} ${styles.split}`}
            >
              {/* LEFT COLUMN: Narrative & Headline */}
              <div className={`text-left lg:col-span-6 ${styles.headlineStack}`}>
                <p
                  className={`font-mono uppercase tracking-[0.2em] font-semibold ${styles.sceneEyebrow}`}
                  style={{ color: activeScene.accentColor }}
                >
                  {activeScene.subtitle}
                </p>

                <h2 className={`font-display font-semibold text-white ${styles.sceneTitle}`}>
                  {activeScene.title}
                </h2>

                <p className={`font-sans text-white/95 font-medium ${styles.sceneLead}`}>
                  {activeScene.narrativeLead}
                </p>

                <button
                  type="button"
                  data-detail-toggle
                  aria-expanded={isDetailOpen}
                  aria-controls={detailTextId}
                  onClick={() => setIsDetailOpen((open) => !open)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-[11px] sm:text-xs text-white/85 hover:bg-white/10 hover:text-white transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <span>{isDetailOpen ? "Hide the detail" : "Read the detail"}</span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden
                  >
                    <polyline points={isDetailOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
                  </svg>
                </button>

                <div id={detailTextId} hidden={!isDetailOpen}>
                  {isDetailOpen && (
                    <div className={`${styles.headlineStack} ${styles.detail}`}>
                      <p className="font-sans text-xs sm:text-sm md:text-base text-white/70 leading-relaxed">
                        {activeScene.narrativeBody}
                      </p>

                      {/* Tags / Chips */}
                      {activeScene.chips && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {activeScene.chips.map((c) => (
                            <span
                              key={c}
                              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-white/80"
                            >
                              {c}
                            </span>
                          ))}
                          {activeScene.link && (
                            <a
                              href={activeScene.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors hover:bg-white/10"
                              style={{
                                borderColor: `${activeScene.accentColor}66`,
                                color: activeScene.accentColor,
                              }}
                            >
                              {activeScene.link.label}
                            </a>
                          )}
                        </div>
                      )}

                      {/* Metric Pill */}
                      {activeScene.metricValue && (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs">
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
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: The Figure (Photo, Vector, Dossier, Terminal) */}
              <div className={`flex items-center justify-center w-full lg:col-span-6 ${styles.figureCol}`}>
                {/*
                  1. Act 01. The headline shows the two clocks alone, large: the
                  scene's idea is two timezones, and that is a figure rather than
                  something to read. The full terminal replaces it on demand.
                */}
                {activeScene.type === "terminal" && activeScene.figureRows && (
                  <div className="w-full">
                    {!isDetailOpen && (
                      <CompactFigure rows={activeScene.figureRows} />
                    )}
                    {isDetailOpen && (
                      <div className={`w-full max-w-md mx-auto rounded-2xl border border-white/15 bg-[#0b0f17]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md ${styles.detail}`}>
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
                          {activeScene.figureRows.map((row) => (
                            <div
                              key={row.label}
                              className="flex justify-between items-center gap-2 rounded bg-white/5 px-2.5 py-1.5 border border-white/5 text-[11px] sm:text-xs"
                            >
                              <span className="text-white/50">{row.label}:</span>
                              <span className="font-semibold" style={{ color: row.valueColor }}>
                                {row.value} · {row.note}
                              </span>
                            </div>
                          ))}
                          <div className="pt-2 text-[11px] text-white/60 space-y-1 border-t border-white/5">
                            <p className="text-emerald-400">&gt; [23:14] Resolved connection pool starvation.</p>
                            <p className="text-emerald-400">&gt; [23:19] Zero downtime hotfix verified.</p>
                            <p className="text-white/40">&gt; [09:00] Next: MCA Distributed Systems Exam.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/*
                  2. Photo Showcase (Acts 2, 4, 5).

                  The card is sized from the file's real pixels, so the frame is
                  the photograph's own shape at every viewport and `object-cover`
                  has nothing to crop. See story-scene.module.css.
                */}
                {activeScene.type === "photo" && activePhoto && (
                  <figure
                    className={`relative group ${styles.photoFigure}`}
                    style={
                      {
                        "--ar": `${activePhoto.width} / ${activePhoto.height}`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Backlit Diffused Ambient Glow */}
                    <div
                      className="absolute -inset-2 rounded-2xl opacity-70 blur-xl transition-all duration-700 group-hover:opacity-95"
                      style={{
                        background: `radial-gradient(circle, ${activeScene.ambientGlow} 0%, transparent 70%)`,
                      }}
                      aria-hidden
                    />

                    {/*
                      The bordered box IS the photograph. Nothing is drawn around
                      it and nothing sits inside it, so a tall picture cannot end
                      up with dark bands down either side.
                    */}
                    <div
                      className={`overflow-hidden rounded-2xl border border-white/20 bg-[#0d0f14] shadow-[0_20px_50px_rgba(0,0,0,0.85)] ${styles.photoFrame}`}
                    >
                      <Image
                        src={activePhoto.src}
                        alt={activeScene.imageAlt || activePhoto.alt}
                        fill
                        unoptimized
                        priority
                        sizes="(min-width: 1024px) 460px, (min-width: 640px) 460px, 90vw"
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                        {...(activePhoto.blurDataURL
                          ? { placeholder: "blur" as const, blurDataURL: activePhoto.blurDataURL }
                          : {})}
                      />
                    </div>

                    {/* The caption uses the column, not the picture's width. */}
                    <figcaption className={`relative font-mono ${styles.photoCaption}`}>
                      {/* Where it was taken is the photo's fact, not the
                          scene's, so it is read from `photos.ts`. Most of the
                          set has no location; those captions are unchanged. */}
                      <span className="text-[11px] text-white/90 font-medium">
                        {[activeScene.imageCaption, activePhoto.location]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                      <span
                        className="text-[10px] uppercase font-semibold"
                        style={{ color: activeScene.accentColor }}
                      >
                        {activeScene.imageMeta}
                      </span>
                    </figcaption>
                  </figure>
                )}

                {/*
                  3. Act 03. Two numbers carry the headline; the rest of the
                  telemetry waits behind the toggle.
                */}
                {activeScene.type === "vector" && activeScene.figureRows && (
                  <div className="w-full">
                    {!isDetailOpen && (
                      <CompactFigure rows={activeScene.figureRows} />
                    )}
                    {isDetailOpen && (
                      <div className={`w-full max-w-md mx-auto rounded-2xl border border-sky-500/30 bg-[#070e1c]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md space-y-3 ${styles.detail}`}>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-white/50">
                          <span className="text-sky-400 font-semibold text-xs">pgvector · HNSW Telemetry</span>
                          <span className="text-emerald-400 text-[11px]">Sub-15ms Latency</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5 text-left">
                          {activeScene.figureRows.map((row) => (
                            <div
                              key={row.label}
                              className="rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3"
                            >
                              <span className="text-[10px] text-white/50 block">{row.label}</span>
                              <span
                                className="text-lg sm:text-xl font-bold block"
                                style={{ color: row.valueColor }}
                              >
                                {row.value}
                              </span>
                              <span className="text-[10px] text-white/50 block pt-0.5">{row.note}</span>
                            </div>
                          ))}
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
                  </div>
                )}

                {/*
                  4. Recruiter Dossier Stage (Act 6).

                  The two actions stay out in the open: this scene exists so a
                  recruiter can take the resume away. Only the stat grid waits.
                */}
                {activeScene.type === "dossier" && (
                  <div
                    className={`w-full max-w-md mx-auto rounded-2xl border border-rose-500/30 bg-[#140a0e]/95 shadow-2xl backdrop-blur-md ${styles.dossierCard}`}
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                      <span className="font-mono text-xs text-rose-400 uppercase tracking-wider font-semibold">
                        Executive Summary
                      </span>
                      <span className="size-2 rounded-full bg-rose-500 animate-pulse" />
                    </div>

                    {/*
                      The four tiles are this scene's figure, not its detail: an
                      executive summary at a glance is what Act 06 is for, and
                      four two-word readouts are something to scan rather than
                      something to read.
                    */}
                    <div className={`grid grid-cols-2 gap-2 text-left text-xs ${styles.dossierTiles}`}>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-2 sm:p-2.5">
                        <span className="text-[10px] text-white/50 block font-mono">TRAJECTORY</span>
                        <span className="font-semibold text-white">Rapid Progression</span>
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
                        <span className="font-semibold text-white">Remote AWST</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
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
                        className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-white pt-0.5 transition-colors cursor-pointer group"
                      >
                        <span>Explore Full Portfolio</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/* BOTTOM FOOTER NAVIGATION */}
        <footer
          className={`relative z-30 flex items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t border-white/10 max-w-5xl xl:max-w-6xl mx-auto w-full bg-[#06070a]/90 backdrop-blur-sm ${styles.gutter} ${styles.bottomInset}`}
        >
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
            className="font-mono text-xs text-white/60 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 group"
          >
            <span>Skip to Portfolio</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </footer>
      </motion.div>
      {/* 
        ========================================================================
        LAYER 2: PHYSICAL ARCHITECTURAL SHUTTER GATE (Sits on top at z-50)
        ========================================================================
      */}
      <div
        onPointerDown={handleShutterPointerDown}
        onPointerUp={handleShutterPointerUp}
        onWheel={handleShutterWheel}
        className={`fixed inset-0 z-50 flex flex-col justify-between bg-[#08090c] text-[var(--text)] select-none pointer-events-auto h-[100dvh] border-b-2 border-amber-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.95)] ${
          styles.shutterGate
        } ${isShutterLifted ? styles.shutterLifted : styles.shutterTeaser}`}
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "100% 32px",
          touchAction: "pan-x",
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
        <header
          className={`relative z-10 flex items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-white/10 ${styles.gutter} ${styles.topInset}`}
        >
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/75 font-medium">
              HARUKA MIRAI · 遥か未来
            </span>
          </div>
          <button
            type="button"
            onClick={exitToPortfolio}
            className="font-mono text-xs text-white/50 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 group"
          >
            <span>Skip to index</span>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </header>

        {/* Center Sanctuary Callout */}
        <main
          className={`relative z-10 mx-auto max-w-2xl w-full text-center flex-1 min-h-0 py-4 ${styles.gutter} ${styles.stageScroller}`}
        >
          <div className={styles.stageItem}>
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
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform group-hover:-translate-y-0.5"
                aria-hidden
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
          </div>
        </main>

        {/* Shutter Bottom Architectural Grip Lip (Draggable & Clickable) */}
        <footer
          onClick={liftShutter}
          className={`relative z-10 flex items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t border-white/15 bg-black/80 hover:bg-black/90 font-mono text-[11px] text-white/70 hover:text-white transition-colors cursor-pointer ${styles.gutter} ${styles.bottomInset} group shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]`}
        >
          <span>Ankit Mishra · Senior SWE</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-300 tracking-wider group-hover:text-amber-200 transition-colors">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
              aria-hidden
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <span>SLIDE UP OR CLICK TO ENTER</span>
          </span>
          <span className="hidden sm:inline">OneIT Australia</span>
        </footer>
      </div>
    </div>
  );
}
