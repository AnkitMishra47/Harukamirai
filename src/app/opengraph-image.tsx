import { ImageResponse } from "next/og";
import { awards, profile } from "@/content";

export const runtime = "edge";
export const alt = `${profile.name} - ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const top = awards[0];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#f4efe3",
          color: "#14110d",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -120, top: -120, width: 520, height: 520, borderRadius: 999, border: "2px solid #2c5840", opacity: 0.25 }} />
        <div style={{ position: "absolute", right: -60, top: -60, width: 400, height: 400, borderRadius: 999, border: "1px solid #2c5840", opacity: 0.35 }} />
        <div style={{ fontSize: 26, letterSpacing: 8, color: "#2c5840", display: "flex" }}>
          遥か未来 · {profile.domain.toUpperCase()}
        </div>
        <div style={{ fontSize: 116, lineHeight: 1, marginTop: 28, display: "flex" }}>{profile.name}</div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#6b6358", display: "flex" }}>{profile.title}</div>
        <div style={{ fontSize: 26, marginTop: 56, color: "#6b6358", display: "flex" }}>
          {profile.employer.name} ({profile.employer.country}) · {top.title} {top.year}
        </div>
      </div>
    ),
    size,
  );
}
