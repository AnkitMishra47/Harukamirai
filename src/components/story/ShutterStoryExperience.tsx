"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { profile, photos, type Photo } from "@/content";
import { trackDownload } from "@/lib/track-download";
import { successionEngine } from "@/lib/audio-synthesizer";
import styles from "./story-scene.module.css";
import { CloverSeal } from "./CloverSeal";

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

/* Act 03's detail panel: one line per system built and led. Each traces to a case study,
   the skills review, or the repo's own history - nothing here is a guess. */
const LED_SYSTEMS: [string, string][] = [
  ["Applied AI", "Field audio -> Safe Work Instructions"],
  ["Logistics", "Emailed dockets -> optimised routes"],
  ["Accounting", "Xero two-way sync, reconciled"],
  ["Retrieval", "SharePoint RAG, source-reconciled"],
  ["Test automation", "1iT-TestRobot, primary engineer"],
];

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
      "In July 2022, I joined OneIT Australia as an intern right after completing my Bachelor's in Computer Applications. Working remotely across Australian business hours meant diagnosing production deadlocks at 11 PM on a Tuesday, then sitting for university exams the next morning. It built my habit of staying calm and methodical under pressure.",
    metricLabel: "Academic & Career Start",
    metricValue: "Intern to Junior SWE",
    chips: ["OneIT Australia", "BCA Graduate", "Java & Angular Platforms"],
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
    actLabel: "Act 03 · Build It, Lead It",
    themeClass: "from-[#060e1a] via-[#091526] to-[#040911]",
    accentColor: "#38bdf8",
    ambientGlow: "rgba(56, 189, 248, 0.25)",
    title: "Build It, Lead It",
    subtitle: "Applied AI · Logistics · Accounting · Test Automation",
    narrativeLead: "I still write the hard parts myself - and lead the engineers building the rest.",
    narrativeBody:
      "Across twelve client platforms - mining, logistics, construction, training - I'm in the code every day, and I lead the engineers building alongside me: splitting the work, reviewing every change, fixing what comes back. The systems I've built and led: field audio turned into validated Safe Work Instructions; customer dockets read straight from the inbox into optimised delivery routes; two-way Xero sync with payment reconciliation; a multi-million-row vector store kept honest against a SharePoint that never stops renaming files; and 1iT-TestRobot, the test runner I became the primary engineer on.",
    metricLabel: "Developer & Lead",
    metricValue: "12 Platforms Built On · 4 Engineers Led",
    chips: ["Hands-On Engineering", "Technical Leadership", "Applied AI"],
    figureRows: [
      { label: "CLIENT PLATFORMS BUILT ON", value: "12", note: "Hands-on in the code", valueColor: "#ffffff" },
      {
        label: "AND LEADING",
        value: "4",
        note: "Engineers: delegated, reviewed, fixed",
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
    chips: ["Rapid Career Progression", "12 Client Platforms", "Full-Time Remote (AWST)"],
    type: "dossier",
  },
];

/**
 * How long a scene holds before the story walks itself on.
 *
 * Six seconds, down from 8.5. A scene in its headline state is an eyebrow, a
 * title and one line - it is read well before 8.5s is up, and the wait after
 * reading it is the part that felt slow. Anyone who wants longer has the pause
 * control, and opening a scene's detail suspends this timer outright.
 */
const SCENE_DURATION_MS = 6000;

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

/*
 * Scene change: the two halves arrive from opposite edges.
 *
 * Measured off the title card Ankit asked this to feel like, frame by frame at
 * 24fps. Three of its properties are the ones that matter, and all three are the
 * opposite of what a tasteful default would have picked:
 *
 * 1. The travel is LINEAR and stops dead. Fitting the measured curve: linear
 *    scored an RMSE of 0.004, `cubic.out` 0.267, `expo.out` 0.389. The leading
 *    edge advances 175, 176, 176, 175, 176, 176, 175px on seven consecutive
 *    frames and then simply stops inside one frame. There is no overshoot and no
 *    settle, and an eased version does not read as the same animation.
 * 2. Nothing fades. The words are fully opaque for the whole slide. Opacity is
 *    what a UI reaches for to soften an entrance; this entrance is not softened.
 * 3. The elements start fully outside their own edge, not nudged in from 40px.
 *    Measured travel was 85-88% of the viewport for the left-movers.
 *
 * What is deliberately NOT reproduced is the directional motion blur, which on
 * film is a 126-degree shutter and in a browser is a filter re-rasterised every
 * frame - the exact cost this pass took out of the photo glow.
 */
const SCENE_SLIDE_EASE = [0, 0, 1, 1] as const;
const SCENE_SLIDE_IN_S = 0.45;
const SCENE_SLIDE_OUT_S = 0.3;
/** Its own width plus a hair, so a half-width column still clears the stage edge. */
const SCENE_SLIDE_OFFSET_PCT = 105;

/*
 * How long the first scene waits before it walks on, so that it is walking on
 * where somebody can see it.
 *
 * The theater renders UNDER the gate, mounted from the first paint. Act 01's
 * entrance therefore used to run behind a closed shutter and be over before the
 * gate had finished moving: lift it and the act was already sitting there,
 * settled, having performed to nobody.
 *
 * The rule: start when the gate is about 95% out of the way, so the act is
 * arriving as the last of it leaves. That reads as one motion; waiting for the
 * gate to finish entirely reads as two.
 *
 * WHERE 700 COMES FROM. This number is a function of the gate's animation and
 * has to be re-read whenever that changes - it was 300ms for the old single
 * panel that lifted on a 550ms ease-out, and when the gate became two panels
 * parting on `transform 880ms cubic-bezier(0.45, 0.05, 0.2, 1)` nobody moved
 * it, so the entrance played out behind a shut door. Measured per frame on the
 * running page, the panels are 24% open at 300ms and 95% open at 700ms:
 *
 *     300ms  24%      600ms  88%
 *     400ms  54%      700ms  95%   <- here
 *     500ms  76%      900ms  100%
 *
 * The scene slide takes SCENE_SLIDE_IN_S, so the act finishes arriving at about
 * 1150ms, against a shell that has finished handing over at 1060ms.
 */
const STAGE_REVEAL_DELAY_MS = 700;
/**
 * How long the theatre takes to leave once the story hands over - the gate's own
 * 550ms transition, read the same way STAGE_REVEAL_DELAY_MS reads it. The
 * soundtrack fades across exactly this window, so the music reaches silence on
 * the frame the theatre finishes clearing rather than stopping dead under it.
 */
const EXIT_TRANSITION_MS = 550;
/**
 * Reopening from the hero has no gate to wait for - it renders already lifted.
 * One tick, purely so the scene reset lands before the entrance is asked for.
 */
const STAGE_REOPEN_DELAY_MS = 60;

/*
 * The tallest shape a scene will show a photograph at, as width/height. 0.8 is 4:5.
 *
 * Everywhere else in this codebase a photograph is drawn at its own shape and is
 * never cropped, and the comment block in story-scene.module.css says at length
 * why. This is the one deliberate exception: a portrait taller than 4:5 left the
 * scene so tall on a phone that the copy above it was pushed off the screen.
 *
 * WHICH END the surplus comes off is the photograph's own business, declared as
 * `cropAnchor` on the `Photo` type and defaulting to centred. That indirection
 * is not ceremony - it is the whole difference between a crop and a loss. The
 * trophy photograph has the face near its top and the award's engraved nameplate
 * running to its very bottom edge, so neither "crop the top" nor "crop the
 * bottom" is a rule that survives contact with it, and centring cuts into both.
 */
const SCENE_MIN_ASPECT = 0.8;
/** Centred, which is right for any photograph that has not said otherwise. */
const DEFAULT_CROP_ANCHOR = 50;

/*
 * Shutter gate tuning.
 *
 * Same principle as the swipe above: a gate commits when EITHER it was pulled
 * far enough OR it was flicked, so a slow deliberate haul and a quick snap both
 * open it, and a small nudge settles back. The distance is a share of the
 * gate's own height with a ceiling, so a tall phone does not ask for a longer
 * pull than a short one.
 */
const SHUTTER_LIFT_RATIO = 0.25; // share of the gate height that commits it

/*
 * Share of a panel's travel over which the light comes up to full. Below the
 * commit threshold on purpose: the gate should look like it is about to give
 * before it has been pushed far enough to actually open.
 */
const GATE_LIGHT_FULL_AT = 0.55;
const SHUTTER_LIFT_MIN_PX = 90; // ceiling, so a tall screen is no harder to open
/**
 * Upward speed that commits the gate on its own, in px/s so it reads against
 * `SWIPE_VELOCITY_PX_PER_S` above. It is the same number deliberately: a flick
 * is a flick, and one hand should not have to learn two speeds to drive one
 * component.
 */
const SHUTTER_FLICK_VELOCITY_PX_PER_S = SWIPE_VELOCITY_PX_PER_S;
const SHUTTER_FLICK_MIN_PX = 28; // a flick still has to actually travel
const SHUTTER_DRAG_SLOP_PX = 6; // travel before a press stops being a possible tap

/**
 * Velocity is measured over a window, not between two consecutive moves.
 *
 * Pointer moves arrive coalesced and irregularly spaced, so a single-sample
 * `dy/dt` can read a 5px nudge delivered 1ms after the last one as 5 px/ms -
 * ten times the flick threshold. Sampling across at least this long makes the
 * number mean what it says.
 */
const SHUTTER_VELOCITY_WINDOW_MS = 50;
/** Past this, the last sample is too old to describe the hand that is releasing. */
const SHUTTER_VELOCITY_STALE_MS = 120;

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
      className={`max-w-md mx-auto rounded-2xl border border-white/12 bg-white/[0.03] font-mono backdrop-blur-md ${styles.compactFigure} ${styles.touchFlat}`}
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
  /**
   * Whether the stage has been handed over to the visitor yet.
   *
   * The scene stays in the DOM the whole time - it is only held at its entry
   * position - so the act copy is still in the server-rendered HTML for anything
   * that reads the page without running it.
   */
  const [isStageRevealed, setIsStageRevealed] = useState(false);
  const revealTimerRef = useRef<number | null>(null);

  /*
   * Parks the scene at its entry position and releases it after `delayMs`.
   *
   * Always false first, even when it is already false: that is what makes a
   * reopen replay the entrance. Reopening resets the scene index to 0, and if it
   * was already 0 the key does not change, so `AnimatePresence` has no reason to
   * remount anything - this toggle is the only thing that asks for the animation
   * again.
   */
  const scheduleStageReveal = useCallback((delayMs: number) => {
    if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    setIsStageRevealed(false);
    revealTimerRef.current = window.setTimeout(() => {
      revealTimerRef.current = null;
      setIsStageRevealed(true);
    }, delayMs);
  }, []);

  useEffect(() => {
    return () => {
      if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    };
  }, []);
  const progressTimerRef = useRef<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** Press position of the live pointer gesture, for telling a tap from a swipe. */
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);
  const shouldReduceMotion = useReducedMotion();

  /*
   * One variant set per half, mirrored by the direction of travel: going
   * forward the headline comes from the left and the figure from the right,
   * going back they swap, so the two halves always part and meet along the axis
   * the story is moving on.
   *
   * Under reduced motion neither half travels and the scene simply cuts.
   */
  const [headlineVariants, figureVariants] = useMemo(() => {
    const half = (side: 1 | -1) => {
      const off = (dir: number) =>
        shouldReduceMotion ? 0 : `${side * (dir > 0 ? 1 : -1) * SCENE_SLIDE_OFFSET_PCT}%`;
      return {
        enter: (dir: number) => ({ x: off(dir), opacity: shouldReduceMotion ? 0 : 1 }),
        center: {
          x: 0,
          opacity: 1,
          transition: {
            duration: shouldReduceMotion ? 0.2 : SCENE_SLIDE_IN_S,
            ease: SCENE_SLIDE_EASE,
          },
        },
        exit: (dir: number) => ({
          x: off(dir),
          opacity: shouldReduceMotion ? 0 : 1,
          transition: {
            duration: shouldReduceMotion ? 0.15 : SCENE_SLIDE_OUT_S,
            ease: SCENE_SLIDE_EASE,
          },
        }),
      };
    };
    return [half(-1), half(1)];
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleReopen = () => {
      setIsDismissed(false);
      setIsExitingTheater(false);
      setIsShutterCharged(false);
      setIsShutterLifted(true);
      setCurrentSceneIdx(0);
      setDirection(1);
      setProgress(0);
      setIsPaused(false);
      scheduleStageReveal(STAGE_REOPEN_DELAY_MS);
      successionEngine.play();
    };

    window.addEventListener("open-shutter-story", handleReopen);
    return () => {
      window.removeEventListener("open-shutter-story", handleReopen);
      successionEngine.stop();
    };
  }, [scheduleStageReveal]);

  // The gate is shown on every visit by design - Ankit's call. There is
  // deliberately no seen-flag: a returning visitor gets the story again.
  const liftShutter = () => {
    scheduleStageReveal(STAGE_REVEAL_DELAY_MS);
    setCurrentSceneIdx(0);
    setDirection(1);
    setProgress(0);
    setIsPaused(false);
    successionEngine.play();

    /*
     * Open on the press, in the same tick.
     *
     * There used to be a beat here to let the seam flare first. It flares on
     * hover and on pointer-down already, so by the time anyone commits, the
     * light has answered - and a pause in front of a 1.4s ease does not read as
     * anticipation, it reads as the gate hesitating. The panels carry an
     * explicit `translate3d(0,0,0)`, so the transition has a value to start
     * from without being given a frame to find one.
     */
    setIsShutterCharged(true);
    setIsShutterLifted(true);
  };

  const toggleSoundtrack = () => {
    const next = !isMusicMuted;
    setIsMusicMuted(next);
    successionEngine.setMute(next);
  };

  const exitToPortfolio = () => {
    successionEngine.fadeOut(EXIT_TRANSITION_MS);
    if (revealTimerRef.current) window.clearTimeout(revealTimerRef.current);
    revealTimerRef.current = null;
    setIsStageRevealed(false);
    setIsShutterLifted(true);
    setIsExitingTheater(true);
    window.dispatchEvent(new CustomEvent("portfolio-revealed"));
    setTimeout(() => {
      setIsDismissed(true);
    }, EXIT_TRANSITION_MS);
  };

  /*
   * The shutter is pulled apart, not clicked at.
   *
   * One pointer cannot do what two hands would, so any horizontal travel parts
   * the panels symmetrically: drag distance is read as an absolute, the left
   * panel takes it one way and the right panel the other. Dragging left and
   * dragging right therefore do the same thing, which is the only mapping that
   * does not leave half of all attempts doing nothing.
   *
   * The live offset is written straight to each panel's `transform`, not held
   * in React state: a gesture is sixty writes a second and not one of them
   * needs a re-render. The two things that DO need React are the class that
   * stands the transition down while a finger is on the gate, and the charged
   * class that brightens the seam.
   *
   * Listeners go on `window` rather than through `setPointerCapture`, because
   * capturing on the gate retargets the click the browser synthesises at
   * release, and the buttons inside the gate need that click intact.
   */
  const shutterRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const shutterDragRef = useRef<{
    startX: number;
    startT: number;
    currentX: number;
    sampleX: number;
    sampleT: number;
    velocity: number;
    active: boolean;
  } | null>(null);
  /** Set by a gesture that actually travelled, read by the click it drags behind it. */
  const shutterDraggedRef = useRef(false);
  const [isShutterDragging, setIsShutterDragging] = useState(false);
  /**
   * A hand is on the gate, or hovering it. Purely a lighting state: the seam
   * widens and the haze swells so the gate answers before it has moved.
   */
  const [isShutterCharged, setIsShutterCharged] = useState(false);

  /** Both panels back to shut, and the stylesheet back in charge of getting there. */
  const releaseShutterPanels = () => {
    requestAnimationFrame(() => {
      if (panelLeftRef.current) panelLeftRef.current.style.transform = "";
      if (panelRightRef.current) panelRightRef.current.style.transform = "";
      shutterRef.current?.style.removeProperty("--gate-open");
    });
  };

  const partPanels = (distance: number) => {
    if (panelLeftRef.current) {
      panelLeftRef.current.style.transform = `translate3d(${-distance}px, 0, 0)`;
    }
    if (panelRightRef.current) {
      panelRightRef.current.style.transform = `translate3d(${distance}px, 0, 0)`;
    }
    /*
     * How far open the gate is, 0..1, published for the stylesheet.
     *
     * The panels moved continuously under a drag and the light did not: it had
     * a state for a hand resting on the gate and a state for open, and nothing
     * in between. So the halves could stand a third of the way apart with the
     * seam lit exactly as it was before they moved - a widening gap with no
     * more light coming through it, which reads as a picture of a door instead
     * of a door.
     *
     * Full light lands at GATE_LIGHT_FULL_AT of a panel's travel rather than at
     * the end of it, so a drag far enough to commit is already at full and the
     * open transition has nothing left to jump.
     */
    const shutter = shutterRef.current;
    if (shutter) {
      const travel = shutter.offsetWidth / 2;
      const open = travel > 0 ? Math.min(1, distance / (travel * GATE_LIGHT_FULL_AT)) : 0;
      shutter.style.setProperty("--gate-open", open.toFixed(3));
    }
  };

  const handleShutterPointerDown = (e: React.PointerEvent) => {
    if (isShutterLifted) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = shutterRef.current;
    if (!el) return;

    shutterDraggedRef.current = false;
    setIsShutterCharged(true);
    /*
     * Every time below is `performance.now()`, read at the moment the handler
     * runs. Not `e.timeStamp`: this one is React's synthetic event and the ones
     * in the listeners below are native, and the two are not guaranteed to be
     * ticking from the same origin. Mixing them makes `elapsed` meaningless, and
     * a meaningless `elapsed` silently reports every flick as motionless.
     */
    const now = performance.now();
    const drag = {
      startX: e.clientX,
      startT: now,
      currentX: e.clientX,
      sampleX: e.clientX,
      sampleT: now,
      velocity: 0,
      active: false,
    };
    shutterDragRef.current = drag;

    const onMove = (ev: PointerEvent) => {
      const d = shutterDragRef.current;
      if (!d) return;

      const t = performance.now();
      const dt = t - d.sampleT;
      if (dt >= SHUTTER_VELOCITY_WINDOW_MS) {
        // Speed of the parting, so direction is not part of the reading.
        d.velocity = Math.abs(ev.clientX - d.sampleX) / dt;
        d.sampleX = ev.clientX;
        d.sampleT = t;
      }

      d.currentX = ev.clientX;
      const travelled = Math.abs(ev.clientX - d.startX);
      // Inside the slop the gesture is still allowed to turn out to be a tap.
      if (!d.active) {
        if (travelled < SHUTTER_DRAG_SLOP_PX) return;
        d.active = true;
        shutterDraggedRef.current = true;
        setIsShutterDragging(true);
      }
      // Each panel only has its own half to travel before it is fully gone.
      partPanels(Math.min(travelled, el.offsetWidth / 2));
    };

    const detach = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };

    const onUp = () => {
      detach();
      const releasedAt = performance.now();
      const d = shutterDragRef.current;
      shutterDragRef.current = null;
      if (!d || !d.active) {
        setIsShutterDragging(false);
        setIsShutterCharged(false);
        return;
      }

      // `d.currentX`, not `ev.clientX`: the tracked position is the one the
      // panels are actually sitting at, and it cannot be contradicted by
      // whatever coordinates the release event happens to carry.
      const travelled = Math.abs(d.currentX - d.startX);
      const threshold = Math.min(
        SHUTTER_LIFT_MIN_PX,
        (el.offsetWidth / 2) * SHUTTER_LIFT_RATIO,
      );
      /*
       * Two readings of the same hand, and the faster one wins.
       *
       * The windowed sample describes a gesture long enough to have been
       * sampled, and is thrown away if the hand came to rest before letting go -
       * a hold-then-release is not a flick whatever the last sample said. But a
       * genuinely fast flick can be over in less than one window, and would
       * leave that sample at zero, so the whole-gesture average stands behind
       * it. The average cannot be fooled by a pause, because a pause is in the
       * elapsed time it divides by.
       */
      const windowed =
        releasedAt - d.sampleT <= SHUTTER_VELOCITY_STALE_MS ? d.velocity : 0;
      const elapsed = releasedAt - d.startT;
      const overall = elapsed > 0 ? travelled / elapsed : 0;
      // Both readings are px/ms, so the threshold comes down to the same units.
      const flicked =
        travelled >= SHUTTER_FLICK_MIN_PX &&
        Math.max(windowed, overall) >= SHUTTER_FLICK_VELOCITY_PX_PER_S / 1000;

      setIsShutterDragging(false);
      if (travelled >= threshold || flicked) {
        /*
         * The inline transforms STAY on a commit. They are where the hand left
         * the panels, and they are the values the opening transition has to
         * travel from - clearing them here would snap the gate shut for the two
         * frames before `.shutterOpen` lands. That class carries `!important`,
         * so it overrides the inline values the moment it applies and the
         * leftover declarations are inert from then on.
         */
        liftShutter();
      } else {
        // A refusal has nowhere to be but shut, so the panels' own transition
        // settles them back.
        setIsShutterCharged(false);
        releaseShutterPanels();
      }
    };

    /*
     * A cancelled pointer is not a released one, and it must never open the gate.
     *
     * The browser cancels when it takes the gesture over - a scroll handoff, the
     * touch leaving the surface, an interruption - and the event it sends has no
     * meaningful coordinates: Chrome reports `clientX: 0`. Routed through the
     * release path, that reads as a pull the full width of the screen and the
     * shutter flies open on a gesture the visitor never finished. Cancelling
     * puts it back where it started, every time.
     */
    const onCancel = () => {
      detach();
      shutterDragRef.current = null;
      setIsShutterDragging(false);
      setIsShutterCharged(false);
      releaseShutterPanels();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  };

  /*
   * A gesture that travelled is not a tap, whatever click the browser sends
   * after it. Without this, letting go halfway through a pull would spring the
   * gate shut and then immediately open it anyway.
   */
  const handleShutterClickCapture = (e: React.MouseEvent) => {
    if (!shutterDraggedRef.current) return;
    shutterDraggedRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  };

  /*
   * A wheel is the desktop equivalent of shoving the gate. Either axis counts:
   * a trackpad swipe sideways is the gesture the panels are asking for, and a
   * mouse only has the vertical one to offer.
   */
  const handleShutterWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 25 || e.deltaY > 25) {
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
      !isStageRevealed ||
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

    /*
     * This updater reports the new progress and does nothing else.
     *
     * It used to advance the scene from in here, calling `setCurrentSceneIdx`
     * inside the `setProgress` updater. A state updater has to be a pure
     * function of the previous state, and React proves it is not by running it
     * twice under StrictMode - so the nested advance ran twice and the story
     * moved two acts at a time. Measured: the clock walked Scene 1 -> 3 -> 5 ->
     * 1, while the same `goNext` driven by the arrows was correct, because that
     * path never went through an updater.
     *
     * Reaching the end is a fact about progress; acting on it is a separate
     * effect, below.
     */
    progressTimerRef.current = window.setInterval(() => {
      setProgress((prev) => Math.min(100, prev + step));
    }, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [
    isShutterLifted,
    isStageRevealed,
    isExitingTheater,
    isDismissed,
    currentSceneIdx,
    isPaused,
    isDragging,
    isDetailOpen,
  ]);

  /*
   * The auto-advance itself: one scene per time the clock reaches the end.
   *
   * It repeats the timer's own guards rather than trusting them. Progress can
   * sit at 100 while the visitor has the story paused, is mid-drag, or has a
   * detail open - the timer stops in all three cases but does not rewind - and
   * the story must not jump the moment any of them clears.
   */
  useEffect(() => {
    if (progress < 100) return;
    if (
      !isShutterLifted ||
      !isStageRevealed ||
      isExitingTheater ||
      isDismissed ||
      isPaused ||
      isDragging ||
      isDetailOpen
    ) {
      return;
    }
    if (currentSceneIdx >= SCENES.length - 1) {
      exitToPortfolio();
      return;
    }
    setDirection(1);
    setCurrentSceneIdx((curr) => curr + 1);
    setProgress(0);
  }, [
    progress,
    currentSceneIdx,
    isShutterLifted,
    isStageRevealed,
    isExitingTheater,
    isDismissed,
    isPaused,
    isDragging,
    isDetailOpen,
  ]);

  if (isDismissed) {
    return null;
  }

  const activeScene = SCENES[currentSceneIdx];
  const activePhoto = activeScene.imageSrc ? PHOTO_INDEX[activeScene.imageSrc] : undefined;
  /*
   * The file's own shape, unless it is taller than the story shows a photograph,
   * in which case it is drawn at that limit and `object-top` takes the surplus
   * off the bottom. Everything else keeps its exact shape and stays centred.
   */
  const activePhotoNaturalAspect = activePhoto ? activePhoto.width / activePhoto.height : 1;
  const activePhotoAspect = Math.max(activePhotoNaturalAspect, SCENE_MIN_ASPECT);
  const isActivePhotoCropped = activePhotoAspect > activePhotoNaturalAspect;
  const activePhotoAnchor = activePhoto?.cropAnchor ?? DEFAULT_CROP_ANCHOR;
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
    /* `data-scroll-lock` stops the portfolio scrolling underneath the
       takeover - see the scroll-lock block in globals.css. It is an attribute
       in the server-rendered markup rather than an effect precisely so that it
       is in force at the first paint, which is when this overlay first covers
       the page. */
    <div
      data-scroll-lock
      className="fixed inset-0 z-50 select-none overflow-hidden font-sans h-[100dvh]"
    >
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
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
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
          {/*
            `popLayout`, not `wait`.

            `wait` holds the incoming scene until the outgoing one has finished
            leaving. That was invisible while a scene change was a 40px nudge,
            and became a hole the moment the halves started travelling their own
            full width: measured at 412x748, the stage was completely empty of
            copy and photograph for about 90ms in the middle of every swap.
            `popLayout` takes the leaving scene out of layout flow so the
            arriving one can occupy the same space at the same time, which is
            what makes the two read as one exchange rather than a gap.
          */}
          <AnimatePresence mode="popLayout" custom={direction}>
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
              /*
                The stage itself no longer moves on a scene change. It is the
                drag surface - `x` here belongs to the visitor's thumb - so the
                scene change was handed down to the two halves, which have their
                own axis to travel on and do not fight it.
              */
              variants={{ enter: {}, center: {}, exit: {} }}
              initial="enter"
              animate={isStageRevealed ? "center" : "enter"}
              exit="exit"
              className={`w-full grid grid-cols-1 items-center lg:grid-cols-12 ${styles.stageItem} ${styles.split}`}
            >
              {/* LEFT COLUMN: Narrative & Headline - arrives from the left */}
              <motion.div
                variants={headlineVariants}
                custom={direction}
                className={`text-left lg:col-span-6 ${styles.headlineStack}`}
              >
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
              </motion.div>

              {/* RIGHT COLUMN: The Figure - arrives from the right, against it */}
              <motion.div
                variants={figureVariants}
                custom={direction}
                className={`flex items-center justify-center w-full lg:col-span-6 ${styles.figureCol}`}
              >
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
                      <div className={`w-full max-w-md mx-auto rounded-2xl border border-white/15 bg-[#0b0f17]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md ${styles.touchFlat} ${styles.detail}`}>
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
                        // The shape the frame is drawn at: the file's own, or the
                        // cap if the file is taller than the cap.
                        "--ar": activePhotoAspect.toFixed(6),
                      } as React.CSSProperties
                    }
                  >
                    {/*
                      Backlit diffused ambient glow.

                      The diffusion is in the gradient's own stops, not in a
                      `blur-xl` filter over the top of it. A filter has to be
                      re-rasterised every frame the element moves, and this
                      element moves on every scene change and under every finger
                      that swipes the stage - which is exactly where the stutter
                      on a phone was coming from. It is the same trade already
                      made for the hero letters in b0f3207. A radial gradient
                      with soft stops is drawn by the compositor for free and,
                      at 70% opacity behind a photograph, looks the same.
                    */}
                    <div
                      className="absolute -inset-3 rounded-[1.75rem] opacity-70 transition-opacity duration-700 group-hover:opacity-95"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${activeScene.ambientGlow} 0%, color-mix(in oklab, ${activeScene.ambientGlow} 45%, transparent) 38%, transparent 72%)`,
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
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        style={
                          isActivePhotoCropped
                            ? { objectPosition: `50% ${activePhotoAnchor}%` }
                            : undefined
                        }
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
                      <div className={`w-full max-w-md mx-auto rounded-2xl border border-sky-500/30 bg-[#070e1c]/95 shadow-2xl p-4 sm:p-5 font-mono text-xs backdrop-blur-md space-y-3 ${styles.touchFlat} ${styles.detail}`}>
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-white/50">
                          <span className="text-sky-400 font-semibold text-xs">Built &amp; led</span>
                          <span className="text-emerald-400 text-[11px]">Hands-on · reviewed</span>
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
                          {LED_SYSTEMS.map(([area, what]) => (
                            <div key={area} className="flex justify-between gap-3">
                              <span className="text-white/50">{area}</span>
                              <span className="text-white/90 font-medium text-right">{what}</span>
                            </div>
                          ))}
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
                    className={`w-full max-w-md mx-auto rounded-2xl border border-rose-500/30 bg-[#140a0e]/95 shadow-2xl backdrop-blur-md ${styles.touchFlat} ${styles.dossierCard}`}
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
                        <span className="text-[10px] text-white/50 block font-mono">PLATFORMS</span>
                        <span className="font-semibold text-white">12 Built &amp; Led</span>
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
                        className="inline-flex items-center justify-center gap-1.5 font-mono text-[11px] text-white/60 hover:text-white pt-0.5 transition-colors cursor-pointer group leading-none"
                      >
                        <span className="cap-align">Explore Full Portfolio</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
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
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </main>

        {/*
          DESKTOP EDGE NAVIGATION

          From `lg` up the arrows leave the footer and sit against the left and
          right edges at the vertical centre, where the gesture they stand in for
          actually points. They are not duplicated controls: below `lg` these are
          gone and the footer's pair is the only one, because on a phone an edge
          arrow would sit on top of the scene it is meant to move.
        */}
        <button
          type="button"
          onClick={goPrev}
          disabled={currentSceneIdx === 0}
          aria-label="Previous scene"
          className="absolute left-5 top-1/2 z-40 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60 hover:text-white disabled:pointer-events-none disabled:opacity-0 lg:flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next scene"
          className="absolute right-5 top-1/2 z-40 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-black/60 hover:text-white lg:flex cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* BOTTOM FOOTER NAVIGATION */}
        <footer
          className={`relative z-30 flex items-center justify-between gap-3 pt-3.5 sm:pt-4 border-t border-white/10 max-w-5xl xl:max-w-6xl mx-auto w-full bg-[#06070a]/90 backdrop-blur-sm ${styles.gutter} ${styles.bottomInset}`}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={currentSceneIdx === 0}
              className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer lg:hidden"
              aria-label="Previous scene"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-lg border border-white/20 p-2 text-white/70 hover:text-white transition-colors cursor-pointer lg:hidden"
              aria-label="Next scene"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <span className="font-mono text-xs text-white/50 pl-1.5 lg:pl-0">
              Scene {currentSceneIdx + 1} of {SCENES.length}
            </span>
          </div>

          <button
            type="button"
            onClick={exitToPortfolio}
            className="font-mono text-xs text-white/60 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 group leading-none"
          >
            <span className="cap-align">Skip to Portfolio</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
        ref={shutterRef}
        onPointerDown={handleShutterPointerDown}
        onPointerEnter={() => !isShutterLifted && setIsShutterCharged(true)}
        onPointerLeave={() => !isShutterDragging && setIsShutterCharged(false)}
        onClickCapture={handleShutterClickCapture}
        onWheel={handleShutterWheel}
        className={`fixed inset-0 z-50 select-none pointer-events-auto h-[100dvh] ${
          styles.shutterShell
        } ${isShutterCharged ? styles.shutterCharged : ""} ${
          isShutterDragging ? styles.shutterDragging : ""
        } ${isShutterLifted ? styles.shutterOpen : ""}`}
        style={{
          // `none`, not `pan-y`: the gesture this surface exists for is
          // horizontal, and the browser must not claim it for a back-swipe.
          touchAction: "none",
        }}
      >
        {/* The room on the other side, and the haze standing in the doorway. */}
        <div className={styles.hiddenLight} aria-hidden />
        <div className={styles.lightAtmosphere} aria-hidden />
        <div className={styles.floorSpill} aria-hidden />

        {/*
          The two halves of the gate. The seal is one drawing clipped down the
          middle, so the panels carry a half each and parting them tears it.
        */}
        <div ref={panelLeftRef} className={`${styles.panel} ${styles.panelLeft}`} aria-hidden>
          {/* Joinery. First child so the seam light (.panel::after) still falls
              over the carving, and so the seal sits proud of it. */}
          <div className={styles.carve} />
          <div className={styles.emblemHalf}>
            <CloverSeal />
          </div>
        </div>
        <div ref={panelRightRef} className={`${styles.panel} ${styles.panelRight}`} aria-hidden>
          <div className={styles.carve} />
          <div className={styles.emblemHalf}>
            <CloverSeal />
          </div>
        </div>

        <div className={styles.dust} aria-hidden>
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className={styles.centerLight} aria-hidden />
        <div className={styles.seamShine} aria-hidden />
        <div className={styles.lightFlood} aria-hidden />

        {/* Everything written on the gate, which leaves when the gate does. */}
        <div className={styles.shutterContent}>
          <header
            className={`absolute inset-x-0 top-0 flex items-center justify-between gap-3 ${styles.gutter} ${styles.topInset}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="size-2 rounded-full bg-[#42a9a6] animate-pulse" />
              <span className="font-mono text-[0.7rem] sm:text-[0.8rem] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#e6e3ea]/80 font-medium whitespace-nowrap">
                HARUKA MIRAI
                <span className="hidden sm:inline"> · 遥か未来</span>
              </span>
            </div>
            <button
              type="button"
              onClick={exitToPortfolio}
              className="font-mono text-[0.7rem] sm:text-[0.8rem] text-[#e6e3ea]/75 hover:text-[#e6e3ea] transition-colors cursor-pointer inline-flex items-center gap-1.5 group leading-none shrink-0"
            >
              <span className="cap-align whitespace-nowrap">
                Skip<span className="hidden sm:inline"> to index</span>
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </header>

          <div className={styles.gateCenter}>
            <div className={styles.copyScrim} aria-hidden />
            <div className={styles.brandLockup}>
              <h1 className={`${styles.jpTitle} font-jp text-[#e6e3ea]/92`}>遥か未来</h1>
              <p className={`${styles.enTitle} font-display uppercase text-[#e6e3ea]`}>
                Haruka Mirai
              </p>
              <div className={styles.quietLine} aria-hidden />
              <p className={`${styles.tagline} font-display uppercase text-[#e6e3ea]/90`}>
                Engineer a brighter tomorrow
              </p>
            </div>

            <div className={styles.gateLower}>
              <div className={styles.gateActions}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={liftShutter}
                    className={`${styles.gateAction} w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-4 font-display font-bold uppercase text-[#15101a] border border-[#8bc2c0]/60 bg-[linear-gradient(180deg,#8bc2c0,#42a9a6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_38px_rgba(66,169,166,0.22)] transition-transform hover:-translate-y-0.5 cursor-pointer`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 transition-transform group-hover:-translate-x-1"
                      aria-hidden
                    >
                      <polyline points="11 17 6 12 11 7" />
                    </svg>
                    <span className="cap-align">See what&apos;s behind</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    >
                      <polyline points="13 7 18 12 13 17" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={exitToPortfolio}
                    className={`${styles.gateAction} w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 font-display font-semibold uppercase text-[#e6e3ea]/90 border border-[#8bc2c0]/40 bg-black/25 hover:text-[#e6e3ea] hover:bg-[#42a9a6]/10 transition-colors cursor-pointer`}
                  >
                    <span className="cap-align">Skip to the work</span>
                  </button>
                </div>

              </div>
            {/*
              The grip. Two handles either side of the seam with the arrows
              pointing the way out, so the gate shows the gesture instead of
              spelling it out. The words underneath are a label now, not an
              instruction, and the button above remains the path for anyone who
              would rather not touch the gate at all.
            */}
            <footer className={`${styles.gateHint} ${styles.bottomInset}`}>
              <span className={styles.gripRow} aria-hidden>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8bc2c0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${styles.gripArrow} ${styles.gripArrowLeft}`}
                  style={{ ["--nudge" as string]: "-4px" }}
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span className={`${styles.grip} ${styles.gripLeft}`} />
                <span className={`${styles.grip} ${styles.gripRight}`} />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8bc2c0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${styles.gripArrow} ${styles.gripArrowRight}`}
                  style={{ ["--nudge" as string]: "4px" }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
              <span className={`${styles.gateLabel} font-mono uppercase font-semibold text-[#8bc2c0]`}>
                Push the gate
              </span>
            </footer>
            </div>
          </div>

          <span
            className={`${styles.wordStack} font-mono text-[0.9rem] uppercase tracking-[0.2em] font-bold text-[#e6e3ea]`}
            aria-hidden
          >
            <span>Code</span>
            <span>Learn</span>
            <span>Build</span>
            <span>Repeat</span>
          </span>

          <span
            className={`${styles.sideRail} font-jp text-[0.8rem] text-[#e6e3ea]/60`}
            aria-hidden
          >
            まだ終わりじゃない
          </span>

        </div>
      </div>
    </div>
  );
}
