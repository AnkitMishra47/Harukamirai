#!/usr/bin/env python3
"""Black Clover palette candidates for the Portfolio, plus a WCAG 2.x checker.

Single source of truth. Every colour on the artefact page is DERIVED here, not
typed: a candidate is declared as a ground hue, a text hue and three accent
intents with a target contrast ratio, and the generator binary-searches the
lightness that hits the target. That makes "it passes" a property of the
definition rather than something a human checked once.

WCAG 2.x relative luminance, sRGB:
    C_lin = C/255 <= 0.03928 ? (C/255)/12.92 : (((C/255)+0.055)/1.055)^2.4
    L     = 0.2126 R + 0.7152 G + 0.0722 B
    ratio = (Lmax + 0.05) / (Lmin + 0.05)

The checker is validated in validate_checker() against the sixteen ratios
already written into src/app/globals.css. If those do not reproduce, nothing
else on this page is trustworthy either.
"""
import colorsys
import json
import sys

FLOOR = 4.5

# --------------------------------------------------------------------------
# colour maths
# --------------------------------------------------------------------------


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


def hx(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l, s)
    return "#%02x%02x%02x" % (round(r * 255), round(g * 255), round(b * 255))


def rgba(hexstr, alpha):
    h = hexstr.lstrip("#")
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return "rgba(%d, %d, %d, %s)" % (r, g, b, alpha)


def tune(h, s, ground, target, lighter):
    """Lightness at hue/sat that first reaches `target` against `ground`."""
    lo, hi = 0.0, 1.0
    best = hx(h, s, 1.0 if lighter else 0.0)
    for _ in range(50):
        mid = (lo + hi) / 2
        c = hx(h, s, mid)
        r = ratio(c, ground)
        if lighter:
            if r < target:
                lo = mid
            else:
                hi = mid
                best = c
        else:
            if r < target:
                hi = mid
            else:
                lo = mid
                best = c
    return best


# --------------------------------------------------------------------------
# the fixed grimoire materials, retuned from the anime frame of Asta's book
#
# The old values were a medieval codex: tanned brown leather, gold stamp, cream
# parchment. Asta's grimoire is not that. The wiki calls it "tattered and
# filthy" with a black clover "largely unseen due to the dirt covering it"
# (blackclover.fandom.com/wiki/Asta), and the anime frame measures a mottled
# soot-brown cover (#130d0c to #352320) whose page edges glow crimson (#680609)
# rather than gold. So the leather goes sootier and darker, the stamp stops
# being the brightest thing on the cover, and a new fixed --ember carries the
# page-edge glow.
#
# These stay OUTSIDE both [data-theme] blocks: one object, two lights.
# --------------------------------------------------------------------------
MATERIALS = {
    "--leather-a":      "#1f1613",
    "--leather-b":      "#33251f",
    "--leather-edge":   "#100b09",
    "--foil":           "#d0b478",
    "--foil-hi":        "#ecd9a6",
    "--parchment":      "#ece1c7",
    "--parchment-b":    "#e0d2b0",
    "--parchment-edge": "#c6b489",
    "--gilt":           "#d4af37",
    "--gilt-ink":       "#6b4e08",
    "--page-ink":       "#241a10",
    "--page-ink-soft":  "#655742",
    "--ember":          "#7c0a12",
}

MATERIAL_CHECKS = [
    ("--foil on --leather-a", "--foil", "--leather-a", FLOOR),
    ("--foil-hi on --leather-a", "--foil-hi", "--leather-a", FLOOR),
    ("--gilt on --leather-a", "--gilt", "--leather-a", 3.0),
    ("--page-ink on --parchment", "--page-ink", "--parchment", FLOOR),
    ("--page-ink-soft on --parchment", "--page-ink-soft", "--parchment", FLOOR),
    ("--gilt-ink on --parchment", "--gilt-ink", "--parchment", FLOOR),
    ("--page-ink on --parchment-b", "--page-ink", "--parchment-b", FLOOR),
    ("--page-ink-soft on --parchment-b", "--page-ink-soft", "--parchment-b", FLOOR),
    ("--gilt-ink on --parchment-b", "--gilt-ink", "--parchment-b", FLOOR),
]


# --------------------------------------------------------------------------
# the candidates
#
# ground = (hue, sat, L(bg), L(bg-elevated), L(bg-inset))
# text   = (hue, sat)                 -> three ranks tuned to 13.5 / 6.1 / 5.1
# accent = (hue, sat, target ratio)   -> tuned against the BINDING ground
# second = (hue, sat, target ratio)   -> the token currently called --gold
#
# Binding ground: on a light theme the ink is dark, so the DARKER of the two
# surfaces (--bg) is the harder one. On a dark theme the ink is light, so the
# LIGHTER of the two (--bg-elevated) is. Tuning against the binding surface
# means the other one is free.
# --------------------------------------------------------------------------
CANDIDATES = [
    {
        "id": "five-leaf",
        "name": "Five-Leaf",
        "jp": "五つ葉",
        "kicker": "Asta's grimoire, the object",
        "second_label": "leaf gold",
        "second_rename": "--leaf-gold",
        "drawn_from": (
            "The anime frame of Asta's grimoire. The cover is not black: it measures "
            "a mottled soot-brown (#130d0c to #352320) and it is floating in crimson "
            "smoke that peaks around #9b182c, with the page edges glowing #680609. "
            "The five-leaf stamp is darker than the cover it sits on."
        ),
        "why": (
            "leaf-4 is the book before it was corrupted - a four-leaf grimoire, and a "
            "four-leaf grimoire is luck, so the light theme is Clover green. leaf-5 is "
            "the book after: the soot-brown cover with the crimson coming up through it "
            "and the squad's leaf gold still on the trim."
        ),
        "risk": (
            "This is the candidate closest to the near-black-plus-one-hot-colour default. "
            "What keeps it off that line is that the ground is a warm soot-BROWN rather "
            "than a neutral near-black, and that the leaf gold is a full second accent "
            "carrying kickers and rules, not a decorative flourish."
        ),
        "light": dict(ground=(146, 0.13, 0.895, 0.955, 0.822), text=(150, 0.20),
                      accent=(148, 0.38, 6.4), hover=9.0, second=(38, 0.66, 5.1)),
        "dark":  dict(ground=(14, 0.24, 0.072, 0.112, 0.048), text=(26, 0.16),
                      accent=(352, 0.86, 5.7), hover=8.2, second=(41, 0.72, 5.3)),
    },
    {
        "id": "yamimatoi",
        "name": "Dark Cloaked",
        "jp": "闇纏",
        "kicker": "Yami Sukehiro",
        "second_label": "cigarette ember",
        "second_rename": "--ember-accent",
        "drawn_from": (
            "Yami's own colouring. The wiki gives him grey eyes, black hair, a white "
            "shirt and trousers with 'an extra layer of tan leather'; his character art "
            "measures that tan at #b6a997 / #947f5f. His katana measures a cold teal "
            "steel (#4c5957, #687776, #dbe5e2), and Volume 1's character profile lists "
            "cigarettes first among his favourite things."
        ),
        "why": (
            "Dark Magic is described as having 'a minor gravitational effect, drawing in "
            "and absorbing other magic'. A palette that pulls everything in wants a cold "
            "accent, not a hot one - so the link colour is the katana's steel and the "
            "only warm thing anywhere is the ember. This is the one candidate whose "
            "primary accent is cold in both themes."
        ),
        "risk": (
            "A teal link is the most 'product' of the five accents. It earns its place "
            "here only because the ember second accent is doing real work next to it."
        ),
        "light": dict(ground=(268, 0.07, 0.900, 0.958, 0.828), text=(262, 0.14),
                      accent=(191, 0.62, 6.3), hover=8.8, second=(19, 0.74, 5.0)),
        "dark":  dict(ground=(271, 0.24, 0.082, 0.124, 0.054), text=(268, 0.14),
                      accent=(178, 0.44, 6.1), hover=8.6, second=(21, 0.86, 5.4)),
    },
    {
        "id": "black-asta",
        "name": "Black Asta",
        "jp": "ブラックアスタ",
        "kicker": "The sky he stands in",
        "second_label": "amber ember",
        "second_rename": "--amber",
        "drawn_from": (
            "One anime frame of Black Asta, sampled top to bottom: sky #14152e (indigo) "
            "-> #462b54 (violet) -> #600913 (crimson) -> #8b3457 (rose) -> ground "
            "#87161f, with a warm #d1905d flare in the upper sky. Five stops, no black "
            "anywhere in the frame except the cloak."
        ),
        "why": (
            "This is the direct answer to 'the Black Bulls invite near-black plus one hot "
            "colour'. The source frame does not do that, so neither does this. The dark "
            "ground is a true indigo, the accent is the rose of the horizon and the "
            "second accent is the amber flare. Both themes have a chromatic ground."
        ),
        "risk": (
            "The most opinionated of the five. A mauve light theme is a commitment, and "
            "the body copy inherits a violet cast that you either want or do not."
        ),
        "light": dict(ground=(311, 0.11, 0.905, 0.960, 0.836), text=(300, 0.12),
                      accent=(338, 0.63, 6.2), hover=8.8, second=(28, 0.70, 5.0)),
        "dark":  dict(ground=(238, 0.46, 0.128, 0.172, 0.094), text=(232, 0.22),
                      accent=(342, 0.82, 5.7), hover=8.0, second=(27, 0.80, 5.2)),
    },
    {
        "id": "black-bull",
        "name": "Black Bull",
        "jp": "黒の暴牛",
        "kicker": "The squad",
        "second_label": "terracotta",
        "second_rename": "--terracotta",
        "drawn_from": (
            "The squad robe: 'a black mantle with gold trimming and hood... a "
            "gold-colored button'. The insignia art measures black plus a pale warm gold "
            "(#d2bd90, #efd9a6, #8b7556); the robe black measures #191617, which is a "
            "warm near-black with a faint magenta cast rather than a neutral one. The "
            "squad's forest headquarters measures olive (#6e7e30, #585615) with dusty "
            "terracotta roof tiles."
        ),
        "why": (
            "The only candidate where GOLD is the primary accent rather than the "
            "afterthought. That is what the robe actually is: black with gold trim, and "
            "the trim is the only thing on it that reads at distance. The light theme is "
            "the clearing the headquarters sits in, and terracotta comes off the roof."
        ),
        "risk": (
            "Gold as a link colour is unusual and reads slightly ceremonial. If the site "
            "wants to feel scrappy rather than decorated, this is the wrong one."
        ),
        "light": dict(ground=(68, 0.15, 0.893, 0.953, 0.820), text=(60, 0.22),
                      accent=(8, 0.64, 6.1), hover=8.6, second=(40, 0.70, 5.0)),
        "dark":  dict(ground=(340, 0.09, 0.082, 0.124, 0.052), text=(8, 0.10),
                      accent=(42, 0.64, 6.5), hover=9.2, second=(8, 0.82, 5.2)),
    },
    {
        "id": "hage",
        "name": "Hage",
        "jp": "ハージ",
        "kicker": "The kingdom, noon and midnight",
        "second_label": "terracotta",
        "second_rename": "--terracotta",
        "drawn_from": (
            "The grimoire tower at Hage, where Asta and Yuno are given their books. The "
            "frame measures sunlit sandstone #a78b6e, ochre earth #bd904b, foliage "
            "#515f1c to #6e7e30, sunlit grass #eee762, a terracotta turret roof #6b1d17 "
            "and a hazy near-white sky #e4e3de. The Black Bull base in flight at night "
            "measures ultramarine: #181a37, #1d1e6b, #0e0f35."
        ),
        "why": (
            "The quietest candidate, and the only one that is about the Clover Kingdom "
            "rather than about a person. leaf-4 is the tower at noon; leaf-5 is the same "
            "country at night, which the show renders as ultramarine and not as black. "
            "The community wiki codes the kingdom #506956 on #cf9c3d - sage and antique "
            "gold - which is the same reading arrived at independently."
        ),
        "risk": (
            "Measured weakness. Every light ground sits at roughly 1.03-1.05:1 against "
            "the fixed parchment, so the book never separates by luminance - it has to "
            "separate by hue. This ground is 3.6 degrees of hue from the parchment, "
            "against 164.5 for the current palette, so it is the one candidate where "
            "the grimoire genuinely reads as cream on cream. Black Bull is second "
            "worst at 25.3 degrees; the other three are 90 degrees or more."
        ),
        "light": dict(ground=(37, 0.20, 0.855, 0.930, 0.780), text=(30, 0.24),
                      accent=(78, 0.58, 6.2), hover=8.6, second=(6, 0.64, 5.2)),
        "dark":  dict(ground=(238, 0.56, 0.132, 0.178, 0.098), text=(218, 0.24),
                      accent=(58, 0.62, 6.6), hover=9.4, second=(12, 0.80, 5.2)),
    },
]

BASELINE = {
    "id": "baseline",
    "name": "Woad and Rubric",
    "jp": "",
    "kicker": "What is in globals.css today",
    "second_label": "ochre gold",
    "second_rename": None,
    "drawn_from": "A European scriptorium: iron gall, lapis, vermilion, gold leaf.",
    "why": "Shown for comparison only. It is grimoire-adjacent and it is not Black Clover.",
    "risk": "",
    "fixed": {
        "light": {
            "bg": "#e1e6ea", "bg-elevated": "#f0f3f6", "bg-inset": "#ccd5dd",
            "text": "#131a20", "text-muted": "#495460", "text-subtle": "#55606c",
            "accent": "#1a4c80", "accent-hover": "#123a66", "second": "#79591a",
            "border": "#b4bdc6", "border-strong": "#97a4b0",
        },
        "dark": {
            "bg": "#0b1220", "bg-elevated": "#131c2c", "bg-inset": "#060b15",
            "text": "#e9eef4", "text-muted": "#b2bdcb", "text-subtle": "#97a4b4",
            "accent": "#ff7053", "accent-hover": "#ff9179", "second": "#d8b45c",
            "border": "#303c4f", "border-strong": "#485a70",
        },
    },
}

TOKENS = ("bg", "bg-elevated", "bg-inset", "text", "text-muted", "text-subtle",
          "accent", "accent-hover", "second", "border", "border-strong")

# Tokens that must clear FLOOR on both --bg and --bg-elevated.
GATED = ("text", "text-muted", "text-subtle", "accent", "accent-hover", "second")


def build_theme(theme, s):
    """Derive one theme's eleven tokens from its spec."""
    h, sat, l_bg, l_el, l_in = s["ground"]
    bg, el, ins = hx(h, sat, l_bg), hx(h, sat, l_el), hx(h, sat, l_in)
    light = theme == "light"
    bind = bg if light else el
    up = not light  # accents move away from the ground in this direction
    th, ts = s["text"]
    ah, asat, at = s["accent"]
    sh, ss, st = s["second"]
    hover_sat = asat - 0.06 if light else asat * 0.70
    return {
        "bg": bg, "bg-elevated": el, "bg-inset": ins,
        "text":         tune(th, ts, bind, 13.5, up),
        "text-muted":   tune(th, ts, bind, 6.1, up),
        "text-subtle":  tune(th, ts, bind, 5.1, up),
        "accent":       tune(ah, asat, bind, at, up),
        "accent-hover": tune(ah, hover_sat, bind, s["hover"], up),
        "second":       tune(sh, ss, bind, st, up),
        "border":       tune(h, min(sat * 0.85, 0.30), bg, 1.52, up),
        "border-strong": tune(h, min(sat, 0.34), bg, 2.05, up),
    }


def resolved():
    """Every candidate with its tokens filled in. Baseline first."""
    out = []
    b = dict(BASELINE)
    b["themes"] = {t: dict(BASELINE["fixed"][t]) for t in ("light", "dark")}
    out.append(b)
    for c in CANDIDATES:
        d = {k: v for k, v in c.items() if k not in ("light", "dark")}
        d["themes"] = {t: build_theme(t, c[t]) for t in ("light", "dark")}
        out.append(d)
    return out


def rows():
    for c in resolved():
        for theme in ("light", "dark"):
            v = c["themes"][theme]
            for token in GATED:
                for surface in ("bg", "bg-elevated"):
                    r = ratio(v[token], v[surface])
                    yield {
                        "candidate": c["id"], "name": c["name"], "theme": theme,
                        "token": token, "colour": v[token], "surface": surface,
                        "surface_colour": v[surface], "ratio": round(r, 2),
                        "pass": r >= FLOOR,
                    }


# --------------------------------------------------------------------------
# checker validation - reproduce the figures already written in globals.css
# --------------------------------------------------------------------------
GLOBALS_CLAIMS = [
    ("--text on --bg (leaf-4)", "#131a20", "#e1e6ea", 13.97),
    ("--text-muted on --bg", "#495460", "#e1e6ea", 6.14),
    ("--text-subtle on --bg", "#55606c", "#e1e6ea", 5.10),
    ("--accent on --bg", "#1a4c80", "#e1e6ea", 6.99),
    ("--accent on --bg-elevated", "#1a4c80", "#f0f3f6", 7.89),
    ("--gold on --bg", "#79591a", "#e1e6ea", 5.13),
    ("--text on --bg (leaf-5)", "#e9eef4", "#0b1220", 16.05),
    ("--text-muted on --bg", "#b2bdcb", "#0b1220", 9.84),
    ("--text-subtle on --bg", "#97a4b4", "#0b1220", 7.39),
    ("--accent on --bg-elevated", "#ff7053", "#131c2c", 6.25),
    ("--border on --bg", "#303c4f", "#0b1220", 1.68),
    ("--border on --bg-elevated", "#303c4f", "#131c2c", 1.53),
    ("--border on --bg (leaf-4)", "#b4bdc6", "#e1e6ea", 1.51),
    ("--foil on --leather-a", "#c9a227", "#241a15", 7.0),
    ("--page-ink on --parchment", "#2a2015", "#f0e4c8", 12.6),
    ("--gilt-ink on --parchment", "#7a5c14", "#f0e4c8", 4.9),
]


def validate_checker():
    out = []
    for name, a, b, claimed in GLOBALS_CLAIMS:
        got = ratio(a, b)
        out.append({"name": name, "a": a, "b": b, "claimed": claimed,
                    "measured": round(got, 2), "ok": abs(got - claimed) <= 0.105})
    return out


def material_rows():
    out = []
    for name, ak, bk, floor in MATERIAL_CHECKS:
        a, b = MATERIALS[ak], MATERIALS[bk]
        r = ratio(a, b)
        out.append({"name": name, "a": a, "b": b, "floor": floor,
                    "ratio": round(r, 2), "pass": r >= floor})
    return out


def main():
    data = list(rows())
    fails = [r for r in data if not r["pass"]]
    mats = material_rows()
    matfails = [m for m in mats if not m["pass"]]
    val = validate_checker()
    valfails = [v for v in val if not v["ok"]]

    if "--json" in sys.argv:
        json.dump({"floor": FLOOR, "candidates": resolved(), "rows": data,
                   "materials": MATERIALS, "material_rows": mats,
                   "validation": val, "fail_count": len(fails) + len(matfails) + len(valfails)},
                  sys.stdout, indent=1)
        return 0 if not (fails or matfails or valfails) else 1

    print("CHECKER VALIDATION against the figures written in src/app/globals.css")
    for v in val:
        print("  %-30s %s on %s  claimed %6.2f  measured %6.2f  %s" % (
            v["name"], v["a"], v["b"], v["claimed"], v["measured"],
            "OK" if v["ok"] else "MISMATCH <<<<"))
    print("  %d of %d reproduce\n" % (len(val) - len(valfails), len(val)))

    last = None
    for r in data:
        if r["candidate"] != last:
            print("=" * 74)
            print("%s  [%s]" % (r["name"], r["candidate"]))
            print("=" * 74)
            last = r["candidate"]
        print("  %-5s %-13s %-8s on %-13s %-8s %6.2f:1  %s" % (
            r["theme"], r["token"], r["colour"], r["surface"],
            r["surface_colour"], r["ratio"], "PASS" if r["pass"] else "FAIL <<<<"))

    print()
    print("=" * 74)
    print("FIXED GRIMOIRE MATERIALS (theme-independent)")
    print("=" * 74)
    for m in mats:
        print("  %-36s %s on %s %6.2f:1  %s" % (
            m["name"], m["a"], m["b"], m["ratio"], "PASS" if m["pass"] else "FAIL <<<<"))

    print()
    print("-" * 74)
    print("%d accent/text pairings + %d material pairings, floor %.1f:1, %d FAIL"
          % (len(data), len(mats), FLOOR, len(fails) + len(matfails)))
    for r in fails:
        print("   FAIL %s %s %s %s on %s = %.2f:1" % (
            r["candidate"], r["theme"], r["token"], r["colour"], r["surface"], r["ratio"]))
    for m in matfails:
        print("   FAIL material %s = %.2f:1" % (m["name"], m["ratio"]))
    return 0 if not (fails or matfails or valfails) else 1


if __name__ == "__main__":
    sys.exit(main())
