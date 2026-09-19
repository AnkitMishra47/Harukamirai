import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { themeInitScript } from "@/lib/theme-init";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { ThemeBurst } from "@/components/effects/ThemeBurst";
import { AmbientCircle } from "@/components/effects/AmbientCircle";
import { profile } from "@/content";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Self-hosted glyph subset (scripts/subset-jp-font.sh). The Google-hosted
// family shipped 125 preloaded slices totalling 4 MB.
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
      className={`${fraunces.variable} ${geist.variable} ${mono.variable} ${jp.variable}`}
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
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
