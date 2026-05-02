import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Lab — Ankit Mishra" };

export default function LabPage() {
  return <ComingSoon eyebrow="Lab" title="Weekend-sized experiments, soon." />;
}
