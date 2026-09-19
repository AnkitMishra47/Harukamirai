#!/usr/bin/env python3
"""Accent candidates for the Portfolio grimoire palette + a WCAG 2.x checker.

Single source of truth: CANDIDATES below drives the contrast report, the
globals.css token swap for the in-situ builds, and the artefact JSON.

WCAG 2.x relative luminance, sRGB:
    C_lin = C/255 <= 0.03928 ? (C/255)/12.92 : (((C/255)+0.055)/1.055)^2.4
    L     = 0.2126 R + 0.7152 G + 0.0722 B
    ratio = (Lmax + 0.05) / (Lmin + 0.05)
"""
import json
import sys

FLOOR = 4.5

# Grounds are FIXED. Only the accent tokens move.
GROUND = {
    "leaf-4": {"bg": "#e1e6ea", "bg-elevated": "#f0f3f6"},
    "leaf-5": {"bg": "#0b1220", "bg-elevated": "#131c2c"},
}


def _lin(c):
    c = c / 255.0
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hexstr):
    h = hexstr.lstrip("#")
    if len(h) != 6:
        raise ValueError("expected #rrggbb, got %r" % hexstr)
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def ratio(a, b):
    la, lb = luminance(a), luminance(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def rgba(hexstr, alpha):
    h = hexstr.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return "rgba(%d, %d, %d, %s)" % (r, g, b, alpha)


# ---------------------------------------------------------------------------
# The candidates. id -> {name, kicker, why, leaf-4:{...}, leaf-5:{...}}
# Every candidate sets accent / accent-hover / gold for BOTH themes so the
# swap is total and nothing is inherited by accident.
# ---------------------------------------------------------------------------
CANDIDATES = [
    {
        "id": "baseline",
        "name": "Lapis and Vermilion",
        "kicker": "Current - the one being rejected",
        "why": "The scriptorium's own division: a lapis initial on the page, the rubric "
               "vermilion coming up out of the ink. Safe, legible, and - the owner's "
               "verdict - plainish and boorish.",
        "note": "Shown as the baseline. Its numbers are what every candidate has to beat on character, not on contrast.",
        "leaf-4": {"accent": "#1a4c80", "accent-hover": "#123a66", "gold": "#79591a"},
        "leaf-5": {"accent": "#ff7053", "accent-hover": "#ff9179", "gold": "#d8b45c"},
    },
    {
        "id": "verdigris",
        "name": "Verdigris and Brass",
        "kicker": "Oxidised copper",
        "why": "The copper clasp on the cover has gone green; the brass boss beside it "
               "has not. A cold mineral teal against warm metal, which is the one "
               "pairing a navy cannot give you.",
        "leaf-4": {"accent": "#0a5a5d", "accent-hover": "#064548", "gold": "#79591a"},
        "leaf-5": {"accent": "#3fc5ae", "accent-hover": "#6fd8c6", "gold": "#d8b45c"},
    },
    {
        "id": "murex",
        "name": "Murex and Silver",
        "kicker": "The purple codex",
        "why": "Parchment dyed with shellfish purple and written in silver, not gold - "
               "the most expensive book anyone ever made. Violet ink on linen, cold "
               "metal instead of warm.",
        "note": "This is the one candidate that moves --gold off gold: the second accent becomes struck silver, "
                "so the page reads as a silver-and-purple codex rather than purple-plus-the-usual-ochre.",
        "leaf-4": {"accent": "#5c2a86", "accent-hover": "#471f69", "gold": "#4d5a66"},
        "leaf-5": {"accent": "#b98ef0", "accent-hover": "#cfb0f7", "gold": "#b3c2d1"},
    },
    {
        "id": "smalt",
        "name": "Smalt and Orpiment",
        "kicker": "Cobalt glass, arsenic yellow",
        "why": "Ground cobalt glass on the page and orpiment on the ink - the loudest "
               "two pigments in the chest, used exactly as a rubricator used them. "
               "This is the voltage option.",
        "note": "--gold moves to pewter in the dark theme only: orpiment already owns the yellow there, "
                "and two yellows on one page cancel each other.",
        "leaf-4": {"accent": "#2439ae", "accent-hover": "#1a2b88", "gold": "#79591a"},
        "leaf-5": {"accent": "#f0b33c", "accent-hover": "#f7cc78", "gold": "#aebbcb"},
    },
    {
        "id": "madder",
        "name": "Madder and Carmine",
        "kicker": "Root and insect",
        "why": "Madder lake from the root for the page, carmine from the cochineal for "
               "the ink. Red on both leaves, but a dyer's red - deep and slightly blue, "
               "not the fire-alarm the site used to run.",
        "leaf-4": {"accent": "#9c1f3d", "accent-hover": "#7c1630", "gold": "#79591a"},
        "leaf-5": {"accent": "#ff7f9b", "accent-hover": "#ffa3b7", "gold": "#d8b45c"},
    },
    {
        "id": "malachite",
        "name": "Malachite and Gilt",
        "kicker": "The jewel green",
        "why": "Not the muted jade the site tried before: malachite ground coarse keeps "
               "its saturation, which is why it survived next to gold leaf for six "
               "hundred years.",
        "leaf-4": {"accent": "#0a6844", "accent-hover": "#075133", "gold": "#79591a"},
        "leaf-5": {"accent": "#3fcf93", "accent-hover": "#72e0b1", "gold": "#d8b45c"},
    },
    {
        "id": "lampblack",
        "name": "Lampblack and Hot Brass",
        "kicker": "The real departure",
        "why": "Colour leaves the accent entirely and moves into the metal. The link is "
               "written in the same soot-and-gum ink as the text, and the only warm thing "
               "on the page is struck brass.",
        "note": "The structural departure: on the light leaf a link reads by weight and underline rather than by hue, "
                "and the copper second accent carries all the warmth. Bold, and the riskiest of the six.",
        "leaf-4": {"accent": "#1b2736", "accent-hover": "#0d1522", "gold": "#8c4a15"},
        "leaf-5": {"accent": "#edc14e", "accent-hover": "#f4d68a", "gold": "#b9c6d4"},
    },
]


def rows():
    """Yield every measured pairing as a dict."""
    for cand in CANDIDATES:
        for theme, ground in GROUND.items():
            for token in ("accent", "accent-hover", "gold"):
                colour = cand[theme][token]
                for surface, sc in ground.items():
                    r = ratio(colour, sc)
                    yield {
                        "candidate": cand["id"],
                        "name": cand["name"],
                        "theme": theme,
                        "token": token,
                        "colour": colour,
                        "surface": surface,
                        "surface_colour": sc,
                        "ratio": round(r, 2),
                        "pass": r >= FLOOR,
                    }


def main():
    data = list(rows())
    fails = [r for r in data if not r["pass"]]

    if "--json" in sys.argv:
        out = {
            "floor": FLOOR,
            "ground": GROUND,
            "candidates": CANDIDATES,
            "rows": data,
            "fail_count": len(fails),
        }
        json.dump(out, sys.stdout, indent=1)
        return 0 if not fails else 1

    width = max(len(r["name"]) for r in data)
    last = None
    for r in data:
        if r["candidate"] != last:
            print()
            print("=" * 78)
            print("%-*s  [%s]" % (width, r["name"], r["candidate"]))
            print("=" * 78)
            last = r["candidate"]
        print("  %-7s %-13s %-8s on %-12s %-8s %6.2f:1  %s" % (
            r["theme"], r["token"], r["colour"], r["surface"],
            r["surface_colour"], r["ratio"], "PASS" if r["pass"] else "FAIL <<<<"))

    print()
    print("-" * 78)
    print("%d pairings measured, floor %.1f:1, %d FAIL" % (len(data), FLOOR, len(fails)))
    for r in fails:
        print("   FAIL %s %s %s %s on %s = %.2f:1" % (
            r["candidate"], r["theme"], r["token"], r["colour"],
            r["surface"], r["ratio"]))
    return 0 if not fails else 1


if __name__ == "__main__":
    sys.exit(main())
