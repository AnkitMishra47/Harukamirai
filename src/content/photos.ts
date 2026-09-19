import type { Photo } from "./types";

/**
 * Files live in public/photos. Alt text describes the image for screen readers.
 *
 * `width`/`height` are the file's real pixel size. Galleries lay photos out at
 * their own aspect ratio rather than cropping them into a shared frame, so a
 * landscape photo never gets squeezed into a portrait slot and upscaled.
 * `content.test.ts` reads the JPEG headers and fails if these drift.
 */
export const photos = {
  portrait: { src: "/photos/portrait.jpeg", alt: "Ankit Mishra", width: 965, height: 1600 },
  setup: {
    src: "/photos/setup.jpeg",
    alt: "Ankit's late-night engineering battlestation with dual monitors, terminal buffers, and anime stream",
    caption: "The Battlestation · 11:42 PM",
    width: 899,
    height: 682,
  },
  awardTrophy: {
    src: "/photos/award-trophy.jpeg",
    alt: "Ankit Mishra holding the OneIT Runner-up Employee of the Year 2025 trophy",
    width: 1066,
    height: 1599,
  },
  openRoad: { src: "/photos/open-road.jpeg", alt: "On an open road", width: 3024, height: 4032 },
  offTheClock: [
    {
      src: "/photos/hills-walk.jpeg",
      alt: "Walking down a grassy Himalayan hillside, cedar forest behind",
      caption: "Hills",
      width: 1448,
      height: 1086,
    },
    {
      src: "/photos/river-portrait.jpeg",
      alt: "Standing by a mountain river after a swim",
      caption: "River",
      width: 1086,
      height: 1448,
    },
    {
      src: "/photos/meadow-laugh.jpeg",
      alt: "Laughing barefoot in a meadow, shoes in hand",
      caption: "Meadow",
      width: 903,
      height: 1600,
    },
  ],
} satisfies Record<string, Photo | Photo[]>;
