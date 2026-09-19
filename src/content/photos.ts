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
  portrait: {
    src: "/photos/portrait.jpeg",
    alt: "Ankit Mishra",
    width: 965,
    height: 1600,
    blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAARAAoDASIAAhEBAxEB/8QAGgAAAQUBAAAAAAAAAAAAAAAAAAIDBAUGB//EACMQAAEEAQQBBQAAAAAAAAAAAAEAAgMEMQUGESESFDNxctH/xAAWAQEBAQAAAAAAAAAAAAAAAAADBAX/xAAcEQACAgIDAAAAAAAAAAAAAAAAAwECBAURITH/2gAMAwEAAhEDEQA/AOZS2NKNZrZbT22oMgY+E+2eFzQRxwewkM2lU1C5LIJns8n9dHCvW7IrBoHqpVJVs18kPJ1i38TevcEil7x+/wCrUjAQhEs1Wn//2Q==",
  },
  setup: {
    src: "/photos/setup.jpeg",
    alt: "Ankit's late-night engineering battlestation with dual monitors, terminal buffers, and anime stream",
    caption: "The Battlestation · 11:42 PM",
    width: 899,
    height: 682,
    blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAYH/8QAHRAAAgIDAAMAAAAAAAAAAAAAAQMAAgQFEhFBYf/EABUBAQEAAAAAAAAAAAAAAAAAAAID/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAECETH/2gAMAwEAAhEDEQA/AMf1KtDr0Wy8zMDW8nlFfZ+ydZtMQssQuoBJ8RElFXopKsP/2Q==",
  },
  awardTrophy: {
    src: "/photos/award-trophy.jpeg",
    alt: "Ankit Mishra holding the OneIT Runner-up Employee of the Year 2025 trophy",
    width: 1066,
    height: 1599,
    blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAPAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABwQG/8QAJxAAAgAEAwgDAAAAAAAAAAAAAQIAAwQFBxEiBhIUFSEjMTNhsfD/xAAVAQEBAAAAAAAAAAAAAAAAAAACBP/EABgRAAMBAQAAAAAAAAAAAAAAAAABAgMx/9oADAMBAAIRAxEAPwBgr3vQ24pJchyLUU7i5dCf2cZOtdBWT9Q9jfcSWXEur5C9yucpSCm+ipBDU4opMqJr8O+pyfPzFMaKeicM/9k=",
  },
  openRoad: {
    src: "/photos/open-road.jpeg",
    alt: "On an open road",
    width: 3024,
    height: 4032,
    blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAwf/xAAhEAABBAAGAwAAAAAAAAAAAAABAAIDBAUREiFBkRMUVP/EABUBAQEAAAAAAAAAAAAAAAAAAAME/8QAGhEAAQUBAAAAAAAAAAAAAAAAAQACAwQhEf/aAAwDAQACEQMRAD8ApU17DLLjKZho5I4Re9gn0jpTe1YdE1kDNmO2OSQU8wD5XdKgXZeYULq0YOr/2Q==",
  },
  offTheClock: [
    {
      src: "/photos/hills-walk.jpeg",
      alt: "Walking down a grassy Himalayan hillside, cedar forest behind",
      caption: "Hills",
      location: "Himachal",
      width: 1448,
      height: 1086,
      blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAHAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUG/8QAHBAAAgICAwAAAAAAAAAAAAAAAAEDBAIFERVU/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgX/xAAaEQACAgMAAAAAAAAAAAAAAAABAgAEAxFR/9oADAMBAAIRAxEAPwDP15tlu7LntTLlMrddN6MgCNZuZgRpo0ReT//Z",
    },
    {
      src: "/photos/river-portrait.jpeg",
      alt: "Standing by a mountain river after a swim",
      caption: "River",
      width: 1086,
      height: 1448,
      blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAANAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAABAUGB//EACEQAAICAQQCAwAAAAAAAAAAAAECAwQABQYRIQdhEjGh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAgP/xAAYEQEAAwEAAAAAAAAAAAAAAAABAAMRMf/aAAwDAQACEQMRAD8Aptz7p1zSrtavJLBFFZPxEvPSnDFn3UyhlvQFSOQefv8AczLzM7WYdMR2IBmA6PvHtSzOlWFBM/CooHfrJtyArEU7yf/Z",
    },
    {
      src: "/photos/hills-phone.jpeg",
      alt: "Standing on a grassy slope above a pine forest, distant ranges under cloud",
      caption: "Ridge",
      width: 1448,
      height: 1086,
      blurDataURL: "data:image/jpeg;base64,/9j/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAL/xAAcEAEBAAICAwAAAAAAAAAAAAABAgAxAxEEBRL/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABURAQEAAAAAAAAAAAAAAAAAAAAB/9oADAMBAAIRAxEAPwC787iqGZX6RB105R7DjAKilNvW8Yxaj//Z",
    },
    {
      src: "/photos/meadow-laugh.jpeg",
      alt: "Laughing barefoot in a meadow, shoes in hand",
      caption: "Meadow",
      width: 903,
      height: 1600,
      blurDataURL: "data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAASAAoDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAABQACBP/EACYQAAEDAgQGAwAAAAAAAAAAAAEAAgQDBRITQVIUFSExQoGRofD/xAAXAQADAQAAAAAAAAAAAAAAAAAAAwQG/8QAHBEAAgICAwAAAAAAAAAAAAAAAAECAwQyEjFB/9oADAMBAAIRAxEAPwDguxbAvEKEc7DW8jqnuTUt1X97Wnxo10utKrJDi6MMTHdgCkOKbq37WfvybK4Qkn2hy4PwEnktpnCSOuiKzH73fKlKevRAtUf/2Q==",
    },
    {
      src: "/photos/river-hands.jpeg",
      alt: "Hands wet at the edge of a fast river, bank behind",
      caption: "Riverbank",
      width: 1600,
      height: 1200,
      blurDataURL: "data:image/jpeg;base64,/9j/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAP/xAAbEAACAgMBAAAAAAAAAAAAAAABAgARAwQSMf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Att8Y8BYAKwNiWRUZFblRYvyIkH//2Q==",
    },
  ],
} satisfies Record<string, Photo | Photo[]>;
