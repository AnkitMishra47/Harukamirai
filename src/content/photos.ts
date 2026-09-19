import type { Photo } from "./types";

/** Files live in public/photos. Alt text describes the image for screen readers. */
export const photos = {
  portrait: { src: "/photos/portrait.jpeg", alt: "Ankit Mishra" },
  awardTrophy: {
    src: "/photos/award-trophy.jpeg",
    alt: "Ankit Mishra holding the OneIT Runner-up Employee of the Year 2025 trophy",
  },
  openRoad: { src: "/photos/open-road.jpeg", alt: "On an open road" },
  offTheClock: [
    { src: "/photos/hills-walk.jpeg", alt: "Walking down a grassy Himalayan hillside, cedar forest behind", caption: "Hills" },
    { src: "/photos/river-portrait.jpeg", alt: "Standing by a mountain river after a swim", caption: "River" },
    { src: "/photos/meadow-laugh.jpeg", alt: "Laughing barefoot in a meadow, shoes in hand", caption: "Meadow" },
  ],
} satisfies Record<string, Photo | Photo[]>;
