#!/usr/bin/env bash
# Subsets Shippori Mincho Regular to the CJK glyphs used in src/, plus the
# ones listed in EXTRA. Re-run whenever Japanese copy is added.
set -euo pipefail
cd "$(dirname "$0")/.."
WORK="${TMPDIR:-/tmp}/shippori-subset"
mkdir -p "$WORK"
if [ ! -x "$WORK/venv/bin/pyftsubset" ]; then
  python3 -m venv "$WORK/venv"
  "$WORK/venv/bin/pip" -q install fonttools brotli
fi
if [ ! -f "$WORK/ShipporiMincho-Regular.ttf" ]; then
  curl -sL -o "$WORK/ShipporiMincho-Regular.ttf" \
    https://raw.githubusercontent.com/google/fonts/main/ofl/shipporimincho/ShipporiMincho-Regular.ttf
fi
USED=$(grep -rhoP '[\x{3000}-\x{30FF}\x{4E00}-\x{9FFF}]' src | sort -u | tr -d '\n')
EXTRA="遥か未来アスタ反魔法今読書珈琲将棋始まり入団表彰栄誉現在"
mkdir -p public/fonts
"$WORK/venv/bin/pyftsubset" "$WORK/ShipporiMincho-Regular.ttf" \
  --text="${USED}${EXTRA}" --flavor=woff2 --layout-features='*' \
  --output-file=public/fonts/ShipporiMincho-subset.woff2
ls -l public/fonts/ShipporiMincho-subset.woff2
