import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Writing — Ankit Mishra" };

export default function WritingPage() {
  return (
    <ComingSoon
      eyebrow="Writing"
      title="One post is better than zero."
      body={
        <>
          Aim for three by year-end. First post likely:{" "}
          <em>How I shipped a multi-page client site in a day with Next.js.</em>
        </>
      }
    />
  );
}
