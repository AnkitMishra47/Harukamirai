import type { Metadata } from "next";
import localFont from "next/font/local";
import { themeInitScript } from "@/lib/theme-init";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollRunes } from "@/components/ScrollRunes";
import { PageTransition } from "@/components/PageTransition";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { ThemeBurst } from "@/components/effects/ThemeBurst";
import { AmbientCircle } from "@/components/effects/AmbientCircle";
import { CommandPalette } from "@/components/command/CommandPalette";
import { ShutterStoryExperience } from "@/components/story/ShutterStoryExperience";
import { RecruiterBriefModal } from "@/components/story/RecruiterBriefModal";
import { AdventureQuest } from "@/components/adventure/AdventureQuest";
import { profile } from "@/content";
import "./globals.css";

// Every font is a self-hosted glyph subset produced by scripts/subset-fonts.sh.
// The Google-hosted set shipped 125 preloaded files (4 MB) and made local
// builds depend on fonts.gstatic.com. Total now: ~115 KB across three files.
const fraunces = localFont({
  src: "../../public/fonts/Fraunces-subset.woff2",
  weight: "100 900",
  variable: "--font-fraunces",
  display: "swap",
});

const geist = localFont({
  src: "../../public/fonts/Geist-subset.woff2",
  weight: "100 900",
  variable: "--font-geist-sans",
  display: "swap",
});

const jp = localFont({
  src: "../../public/fonts/ShipporiMincho-subset.woff2",
  weight: "400",
  variable: "--font-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} - Software Engineer`,
  description: `${profile.title} at ${profile.employer.name} (${profile.employer.country}). ${profile.summary.split(". ")[1]}.`,
  metadataBase: new URL(`https://${profile.domain}`),
  openGraph: {
    title: `${profile.name} - ${profile.domain}`,
    description: profile.heroLine.split(". ")[0] + ".",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geist.variable} ${jp.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh flex flex-col relative overflow-x-hidden">
        <AmbientCircle />
        <CursorTrail />
        <ThemeBurst />
        <Nav />
        <CommandPalette />
        <ShutterStoryExperience />
        <RecruiterBriefModal />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        <AdventureQuest />
        <ScrollRunes />
        <Footer />
      </body>
    </html>
  );
}
