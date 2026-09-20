#!/usr/bin/env bash
# Build the soundtrack bed.
#
# story_sound.mp3 is 39.027s and carries its own outro fade. Measured with
# volumedetect: the level holds near -8.5 dB through t=36, then drops to
# -11.4 dB at t=37 and -18.2 dB at t=38. So the musical body is [0, 37.0] and
# looping the raw file would dip to near-silence every 39s - audible at 0:39
# and 1:18 of a 92s video.
#
# Trim to the body, then join copies with a 2s crossfade. src/lib/audio-synthesizer.ts
# already names trimming the tail as "the honest fix"; this does it offline so
# the site itself keeps its dependency-free one-Audio-element player.
set -euo pipefail
SRC="${1:?source mp3}"
OUT="${2:?output wav}"
TARGET="${3:?target seconds}"

BODY=37.0
XF=2.0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

ffmpeg -y -hide_banner -loglevel error -i "$SRC" -t "$BODY" -c:a pcm_s16le "$TMP/body.wav"

# Each crossfaded join costs XF seconds, so n copies run n*BODY - (n-1)*XF.
n=1
while (( $(echo "$n * $BODY - ($n - 1) * $XF < $TARGET" | bc -l) )); do n=$((n+1)); done
echo "  bed: ${n} copies of ${BODY}s with ${XF}s crossfades -> $(echo "$n * $BODY - ($n-1) * $XF" | bc -l)s, trimmed to ${TARGET}s"

cp "$TMP/body.wav" "$TMP/acc.wav"
for ((i=2; i<=n; i++)); do
  ffmpeg -y -hide_banner -loglevel error -i "$TMP/acc.wav" -i "$TMP/body.wav" \
    -filter_complex "[0][1]acrossfade=d=${XF}:c1=tri:c2=tri[a]" -map "[a]" -c:a pcm_s16le "$TMP/next.wav"
  mv "$TMP/next.wav" "$TMP/acc.wav"
done

FADEOUT_AT=$(echo "$TARGET - 4.0" | bc -l)
ffmpeg -y -hide_banner -loglevel error -i "$TMP/acc.wav" \
  -af "atrim=0:${TARGET},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=1.0,afade=t=out:st=${FADEOUT_AT}:d=4.0,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -c:a pcm_s16le "$OUT"
echo "  bed written: $OUT ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s)"
