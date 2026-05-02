import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Now — Ankit Mishra" };

export default function NowPage() {
  return <ComingSoon eyebrow="Now" title="What I'm into this month." />;
}
