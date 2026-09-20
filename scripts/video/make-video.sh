#!/usr/bin/env bash
# End-to-end: capture both viewports, render the frames, build the bed, assemble.
#
# Needs the site served at $SITE_URL (default http://localhost:3000) from a
# PRODUCTION build - `next start`, not `next dev`. A dev server ships the React
# refresh runtime and unminified chunks, which changes what the animation does
# under load and therefore what the capture looks like.
set -euo pipefail
cd "$(dirname "$0")/../.."

WORK="${WORK:-/tmp/harukamirai-video}"
OUTDIR="${OUTDIR:-Documentation/video}"
OUT="$OUTDIR/harukamirai-walkthrough-1080x1350.mp4"
SITE_URL="${SITE_URL:-http://localhost:3000}"
export SITE_URL

mkdir -p "$WORK" "$OUTDIR"

if ! curl -sf -o /dev/null --max-time 5 "$SITE_URL/"; then
  echo "error: no site at $SITE_URL - run 'npm run build && npx next start -p 3000' first" >&2
  exit 1
fi

echo "==> capture: desktop"
node --experimental-websocket scripts/video/capture.mjs desktop "$WORK"
echo "==> capture: phone"
node --experimental-websocket scripts/video/capture.mjs phone "$WORK"
echo "==> render frames"
node --experimental-websocket scripts/video/render-frames.mjs "$WORK"
echo "==> audio bed"
DUR=$(node scripts/video/assemble.mjs "$WORK" --duration-only)
scripts/video/build-audio.sh public/photos/story_sound.mp3 "$WORK/bed.wav" "$DUR"
echo "==> assemble"
node scripts/video/assemble.mjs "$WORK" "$OUT"

echo
echo "done: $OUT"
ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate \
  -of default=noprint_wrappers=1 "$OUT"
