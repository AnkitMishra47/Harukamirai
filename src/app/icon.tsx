import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
        >
          {/* Stem */}
          <path
            fill="#14634a"
            d="M 50 56 Q 47 68 49 84 Q 50 86 51 84 Q 53 68 50 56 Z"
          />

          {/* 4 leaves */}
          <g>
            {/* Top */}
            <path
              fill="#14634a"
              d="M 50 48 Q 30 44 26 26 Q 28 12 42 16 Q 50 18 50 28 Q 50 18 58 16 Q 72 12 74 26 Q 70 44 50 48 Z"
            />
            {/* Right */}
            <path
              fill="#14634a"
              d="M 52 50 Q 56 30 74 26 Q 88 28 84 42 Q 82 50 72 50 Q 82 50 84 58 Q 88 72 74 74 Q 56 70 52 50 Z"
            />
            {/* Bottom */}
            <path
              fill="#14634a"
              d="M 50 52 Q 70 56 74 74 Q 72 88 58 84 Q 50 82 50 72 Q 50 82 42 84 Q 28 88 26 74 Q 30 56 50 52 Z"
            />
            {/* Left */}
            <path
              fill="#14634a"
              d="M 48 50 Q 44 70 26 74 Q 12 72 16 58 Q 18 50 28 50 Q 18 50 16 42 Q 12 28 26 26 Q 44 30 48 50 Z"
            />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
