#!/usr/bin/env bash
# Self-hosts every web font as a glyph subset in public/fonts/.
#  - Shippori Mincho: only the CJK glyphs used in src/ (plus EXTRA).
#  - Fraunces, Geist: Latin + punctuation + arrows, variable
#    weight kept; Fraunces pinned to SOFT=50 WONK=0 (what globals.css asks for).
# Re-run whenever copy adds a new glyph. Needs python3 + network on first run.
set -euo pipefail
cd "$(dirname "$0")/.."
WORK="${TMPDIR:-/tmp}/font-subset"
mkdir -p "$WORK" public/fonts
if [ ! -x "$WORK/venv/bin/pyftsubset" ]; then
  python3 -m venv "$WORK/venv"
  "$WORK/venv/bin/pip" -q install fonttools brotli
fi
PY="$WORK/venv/bin"
GF="https://raw.githubusercontent.com/google/fonts/main/ofl"
fetch() { [ -f "$WORK/$2" ] || curl -sL -o "$WORK/$2" "$GF/$1"; }
fetch "shipporimincho/ShipporiMincho-Regular.ttf" ShipporiMincho-Regular.ttf
fetch "fraunces/Fraunces%5BSOFT,WONK,opsz,wght%5D.ttf" Fraunces-VF.ttf
fetch "geist/Geist%5Bwght%5D.ttf" Geist-VF.ttf

LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2190-21FF,U+2212,U+2215,U+25A0-25FF,U+FEFF,U+FFFD"
subset_latin() { # src dst
  "$PY/pyftsubset" "$1" --unicodes="$LATIN" --flavor=woff2 --layout-features='*' \
    --output-file="public/fonts/$2"
}

# Fraunces: pin the two decorative axes, keep opsz + wght variable.
"$PY/fonttools" varLib.instancer -q "$WORK/Fraunces-VF.ttf" SOFT=50 WONK=0 -o "$WORK/Fraunces-opsz-wght.ttf"
subset_latin "$WORK/Fraunces-opsz-wght.ttf" Fraunces-subset.woff2
subset_latin "$WORK/Geist-VF.ttf" Geist-subset.woff2

USED=$(grep -rhoP '[\x{3000}-\x{30FF}\x{4E00}-\x{9FFF}]' src | sort -u | tr -d '\n')
EXTRA="遥か未来アスタ反魔法今読書珈琲将棋始まり入団表彰栄誉現在"
"$PY/pyftsubset" "$WORK/ShipporiMincho-Regular.ttf" --text="${USED}${EXTRA}" --flavor=woff2 \
  --layout-features='*' --output-file=public/fonts/ShipporiMincho-subset.woff2

ls -l public/fonts/
