import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono, Shippori_Mincho } from "next/font/google";
import { themeInitScript } from "@/lib/theme-init";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CursorTrail } from "@/components/effects/CursorTrail";
import { ThemeBurst } from "@/components/effects/ThemeBurst";
import { MagicCircle } from "@/components/effects/MagicCircle";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
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

const jp = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jp",
});

export const metadata: Metadata = {
  title: "Ankit Mishra — Software Engineer",
  description:
    "Senior Software Engineer at OneIT (AU). Java, Angular, Python — and whatever the next ticket needs. Employee of the Year 2025.",
  metadataBase: new URL("https://harukamirai.engineer"),
  openGraph: {
    title: "Ankit Mishra — harukamirai.engineer",
    description:
      "From BCA to Senior L3 in three years, with a Master's earned in the cracks between deploys.",
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
        {/* Global Persistent Magic Circle Background */}
        <div className="fixed inset-0 -z-50 pointer-events-none flex items-center justify-center overflow-hidden opacity-[0.03] dark:opacity-[0.07]">
          <MagicCircle size={1400} intensity="full" />
        </div>
        
        <CursorTrail />
        <ThemeBurst />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
