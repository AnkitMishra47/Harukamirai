#!/usr/bin/env python3
"""Generate index.html for the accent-options artefact.

Everything numeric in the page comes from palette.py's checker, so no contrast
figure in the artefact is hand-typed. Run from this directory:

    python3 build-index.py

The in-situ PNGs under shots/ are produced separately by the render pipeline
(see METHOD in the page); this script only references them.
"""
import os
import re

from palette import CANDIDATES, FLOOR, GROUND, rows, ratio

HERE = os.path.dirname(os.path.abspath(__file__))
COMPONENTS = os.path.expanduser(
    "~/.claude/skills/publishing-artefacts/assets/artefact-components.css")

# The shared shell, in the form the Artefact Server needs: an ABSOLUTE path,
# because the server provides /af-resources/ centrally. That exact string is
# also what the local-viewing copy rewrites, so the two cannot drift.
AF_SCRIPT = ('<script id="af-script" src="/af-resources/artefact.js" '
             'data-af-default-theme="clean" defer></script>')
AF_SCRIPT_LOCAL = AF_SCRIPT.replace('src="/af-resources/', 'src="af-resources/')

ROUTES = [("home", "/"), ("work", "/work"), ("about", "/about")]
THEMES = [("light", "leaf-4", "leaf-4 - the page"), ("dark", "leaf-5", "leaf-5 - the ink")]

# Fixed surface tokens, read straight out of src/app/globals.css. Not editable
# here: if globals.css moves, GROUND in palette.py moves with it.
SURFACE_TEXT = {
    "leaf-4": {"text": "#131a20", "muted": "#495460", "subtle": "#55606c",
               "border": "#b4bdc6"},
    "leaf-5": {"text": "#e9eef4", "muted": "#b2bdcb", "subtle": "#97a4b4",
               "border": "#303c4f"},
}

ALL = list(rows())


def worst(cid, theme):
    rs = [r["ratio"] for r in ALL if r["candidate"] == cid and r["theme"] == theme]
    return min(rs)


def worst_token(cid, theme):
    rs = [r for r in ALL if r["candidate"] == cid and r["theme"] == theme]
    r = min(rs, key=lambda x: x["ratio"])
    return "%s on %s" % (r["token"], r["surface"])


def gold_moves(cand):
    base = CANDIDATES[0]
    return any(cand[t]["gold"] != base[t]["gold"] for t in ("leaf-4", "leaf-5"))


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


# --------------------------------------------------------------------------
# page-local CSS. Chrome colours resolve through --tv-*; the ONLY literal
# colours are the candidate specimens, which are the subject of the document.
# --------------------------------------------------------------------------
PAGE_CSS = """
/* ---- specimen: a candidate's tokens shown on the site's real grounds.
   The literal colours arrive per-element through inline custom properties
   because they ARE the data this artefact is about. No chrome colour is
   hard-coded anywhere; everything else resolves through --tv-*. ---- */
.sp{border:1px solid var(--tv-line);border-radius:6px;overflow:hidden;background:var(--sp-bg)}
.sp .sp-hd{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10.5px;
  letter-spacing:.06em;text-transform:uppercase;font-weight:650;
  color:var(--tv-ink3)!important;background:var(--tv-panel2);
  border-bottom:1px solid var(--tv-line);padding:6px 12px}
.sp .sp-body{padding:15px 16px 16px;color:var(--sp-text)}
.sp .sp-kick{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--sp-accent);margin:0 0 7px}
.sp .sp-h{font-size:21px;font-weight:600;letter-spacing:-.02em;margin:0 0 6px;color:var(--sp-text)}
.sp .sp-p{font-size:13px;line-height:1.6;margin:0 0 13px;color:var(--sp-muted)}
.sp .sp-a{color:var(--sp-accent);text-decoration:underline;text-underline-offset:2px}
.sp .sp-a.hv{color:var(--sp-hover)}
.sp .sp-card{background:var(--sp-card);border:1px solid var(--sp-border);
  border-radius:6px;padding:11px 13px;margin:0 0 13px}
.sp .sp-card .sp-kick{font-size:12px;margin:0 0 5px}
.sp .sp-row{display:flex;gap:14px;align-items:baseline;flex-wrap:wrap;font-size:12.5px}
.sp .sp-gold{color:var(--sp-gold);font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.sp .sp-btn{display:inline-block;background:var(--sp-accent);color:var(--sp-bg);
  border-radius:999px;padding:7px 16px;font-size:12.5px;font-weight:600}
.sp .sp-btn.hv{background:var(--sp-hover)}
.sp .sp-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
/* ---- colour chips ---- */
.chip{display:inline-flex;align-items:center;gap:6px;font-family:ui-monospace,Menlo,Consolas,monospace;
  font-size:11.5px;color:var(--tv-ink2);white-space:nowrap}
.chip i{width:13px;height:13px;border-radius:3px;border:1px solid var(--tv-line2);
  background:var(--chip);display:inline-block;flex:0 0 13px}
td .chip{font-size:11px}
/* ---- ratio cell ---- */
.rt{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.rt.ok{color:var(--tv-green)}
.rt.no{color:var(--tv-red);font-weight:700}
/* ---- in-situ renders ---- */
.shot{border:1px solid var(--tv-line);border-radius:6px;overflow:hidden;background:var(--tv-panel);margin:0 0 14px}
.shot figcaption{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;
  color:var(--tv-ink3)!important;background:var(--tv-panel2);
  border-bottom:1px solid var(--tv-line);padding:6px 11px;display:flex;gap:10px;align-items:center}
.shot figcaption b{color:var(--tv-ink2);font-weight:650}
.shot figcaption .rt{margin-left:auto}
.shot img{display:block;width:100%;height:auto;border:0}
.shots-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media(max-width:1000px){.shots-grid{grid-template-columns:1fr}}
.cmp-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media(max-width:1000px){.cmp-grid{grid-template-columns:1fr}}
.cmp-grid figure[hidden]{display:none}
/* ---- two specimens side by side ---- */
.sp-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 0 14px}
@media(max-width:1000px){.sp-pair{grid-template-columns:1fr}}
/* ---- the strip on the comparison section ---- */
.strip{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 0 16px}
@media(max-width:1000px){.strip{grid-template-columns:1fr}}
.strip .nm{font-size:13px;font-weight:650;color:var(--tv-ink);margin:0 0 5px}
.strip .nm span{font-weight:400;color:var(--tv-ink3);font-size:11.5px}
/* ---- cross-links. The shared theme styles no content <a>, so an unclassed link
   falls back to the browser default and is unreadable on the dark ground.
   .tv-jump is the library's own cross-link; only its size is adjusted here. ---- */
td .tv-jump{font-size:13px;font-weight:650}
/* ---- readiness columns: a CSS custom property must never wrap mid-name ---- */
.tv-rd li code{white-space:nowrap;flex:0 0 auto}
.tv-rd li em{flex:1 1 auto}
"""


def specimen(cand, theme, label):
    v = cand[theme]
    g = GROUND[theme]
    s = SURFACE_TEXT[theme]
    style = (
        "--sp-bg:%s;--sp-card:%s;--sp-text:%s;--sp-muted:%s;--sp-border:%s;"
        "--sp-accent:%s;--sp-hover:%s;--sp-gold:%s"
        % (g["bg"], g["bg-elevated"], s["text"], s["muted"], s["border"],
           v["accent"], v["accent-hover"], v["gold"])
    )
    return """<div class="sp" style="%s">
 <div class="sp-hd">%s &nbsp;&middot;&nbsp; ground %s &nbsp;&middot;&nbsp; card %s</div>
 <div class="sp-body">
  <p class="sp-kick">Anti-magic grimoire &middot; no. 17</p>
  <p class="sp-h">Built, shipped, owned.</p>
  <p class="sp-p">Body copy stays in iron gall. The accent carries
   <a class="sp-a" href="#gate">a link like this one</a>, and on hover it moves to
   <a class="sp-a hv" href="#gate">the hover value</a>.</p>
  <div class="sp-card">
   <p class="sp-kick">AI platform &middot; enterprise retrieval</p>
   <div class="sp-row"><a class="sp-a" href="#gate">Show details</a>
    <span class="sp-gold">2019 - 2022 &middot; second accent</span></div>
  </div>
  <div class="sp-foot"><span class="sp-btn">Experience Storyline</span>
   <span class="sp-btn hv">on hover</span></div>
 </div>
</div>""" % (style, esc(label), g["bg"], g["bg-elevated"])


def chip(colour, text=None):
    return '<span class="chip" style="--chip:%s"><i></i>%s</span>' % (
        colour, text or colour)


ROUTE_NAME = {"home": "Home", "work": "Work", "about": "About"}


def shot_fig(cid, name, theme_label, route_label, route_path, theme_token, accent, extra=""):
    src = "shots/%s-%s-%s.png" % (cid, theme_label, route_label)
    return (
        '<figure class="shot"%s data-cand="%s" data-route="%s" data-theme="%s">'
        '<figcaption><b>%s</b> %s <code>%s</code> '
        '<span class="chip" style="--chip:%s"><i></i>%s</span>'
        '</figcaption>'
        '<img loading="lazy" src="%s" width="1080" height="1275" '
        'alt="The %s page at 1440 wide in %s, %s accent %s">'
        '</figure>'
        % (extra, cid, route_label, theme_label, esc(name), ROUTE_NAME[route_label],
           esc(route_path), accent, accent, src,
           ROUTE_NAME[route_label], esc(theme_token), esc(name), accent)
    )


def contrast_table(cid):
    out = ['<table><thead><tr><th>Theme</th><th>Token</th><th>Colour</th>'
           '<th>on --bg</th><th>on --bg-elevated</th></tr></thead><tbody>']
    for theme in ("leaf-4", "leaf-5"):
        for token in ("accent", "accent-hover", "gold"):
            rs = {r["surface"]: r for r in ALL
                  if r["candidate"] == cid and r["theme"] == theme and r["token"] == token}
            a, b = rs["bg"], rs["bg-elevated"]
            out.append(
                "<tr><td>%s</td><td><code>--%s</code></td><td>%s</td>"
                '<td class="rt %s">%.2f:1</td><td class="rt %s">%.2f:1</td></tr>'
                % (theme, token, chip(a["colour"]),
                   "ok" if a["pass"] else "no", a["ratio"],
                   "ok" if b["pass"] else "no", b["ratio"]))
    out.append("</tbody></table>")
    return "".join(out)


def token_block(cand):
    """The exact CSS the owner would paste, generated from the same source."""
    lines = []
    for theme, sel in (("leaf-4", ':root,\n[data-theme="leaf-4"] {'),
                       ("leaf-5", '[data-theme="leaf-5"] {')):
        v = cand[theme]
        h = v["accent"].lstrip("#")
        r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
        alpha = "0.20" if theme == "leaf-4" else "0.30"
        hg = v["gold"].lstrip("#")
        gr, gg, gb = (int(hg[i:i + 2], 16) for i in (0, 2, 4))
        galpha = "0.16" if theme == "leaf-4" else "0.25"
        lines.append(sel)
        lines.append("  --accent:          %s;" % v["accent"])
        lines.append("  --accent-hover:    %s;" % v["accent-hover"])
        lines.append("  --accent-glow:     rgba(%d, %d, %d, %s);" % (r, g, b, alpha))
        lines.append("  --gold:            %s;" % v["gold"])
        lines.append("  --gold-glow:       rgba(%d, %d, %d, %s);" % (gr, gg, gb, galpha))
        if theme == "leaf-5":
            lines.append("  --clover-fifth:    %s;   /* the fifth leaf and the demon eye */"
                         % v["accent"])
        lines.append("}")
        lines.append("")
    return "\n".join(lines).rstrip()


CANON_BANNER = """<!--
  CANONICAL ARTEFACT. This is the file to PUBLISH.

  It loads the shared house theme from the ABSOLUTE path /af-resources/, which
  the 1iT Artefact Server provides centrally. That is correct on the server and
  dead over file:// - opened straight off disk, this page renders as unstyled
  browser defaults with no theme, no table of contents and no annotation
  toolbar. To read it on this machine, open open-local.html instead.

  Generated by build-index.py. Do not hand-edit.
-->
"""

LOCAL_BANNER = """<!--
  LOCAL VIEWING COPY. Do NOT publish this file.

  Byte-for-byte index.html except that the af-script tag points at the
  af-resources/ copy bundled in this directory instead of the server's
  absolute /af-resources/, so the house theme, the table of contents and the
  annotation toolbar all load over file://. Open this one to read the artefact
  off disk; publish index.html.

  One local-only difference: the checkout of af-resources carries no
  fontawesome/ directory, so the small icons the theme puts on the warning and
  danger callouts are absent here. The server supplies them. Nothing else
  differs.

  Generated by build-index.py from index.html. Do not hand-edit.
-->
"""


def _banner(doc, banner):
    """Insert an identifying comment directly after the doctype."""
    head = "<!DOCTYPE html>\n"
    if not doc.startswith(head):
        raise SystemExit("doctype is not the first line; cannot insert banner")
    return head + banner + doc[len(head):]


def build():
    with open(COMPONENTS) as fh:
        comp = fh.read()
    # The shipped library escapes the search glyph for a shell heredoc; left
    # as-is it renders the literal text \2315 on the page.
    comp = comp.replace('content:"\\\\2315"', 'content:"\\2315"')
    # The vendored library's own comments contain em dashes; this repo forbids
    # them anywhere, including in code.
    comp = comp.replace("\u2014", "-")

    out = []
    A = out.append

    A('<!DOCTYPE html>')
    A('<html lang="en">')
    A('<head>')
    A('<meta charset="UTF-8">')
    A('<meta name="viewport" content="width=device-width, initial-scale=1">')
    A('<title>Accent Options - harukamirai.engineer</title>')
    A(AF_SCRIPT)
    A('<style>')
    A(comp)
    A(PAGE_CSS)
    A('</style>')
    A('</head>')
    A('<body class="nohighlight">')
    A('<div class="layout">')

    # ---------------- TOC ----------------
    A('<aside class="toc">')
    A('<h2>Accent options</h2>')
    A('<div class="subtitle">Six candidates and the current pair, measured and '
      'photographed on the real site</div>')
    A('<ul>')
    A('<li><a href="#choose">1. How to choose</a></li>')
    A('<li><a href="#compare">2. All seven, side by side</a></li>')
    A('<li><a href="#situ">3. The same page, seven ways</a></li>')
    A('<li><a href="#gate">4. The contrast gate</a></li>')
    for i, c in enumerate(CANDIDATES):
        A('<li><a href="#c-%s">%d. %s</a></li>' % (c["id"], i + 5, esc(c["name"])))
    A('<li><a href="#apply">%d. If you pick one</a></li>' % (len(CANDIDATES) + 5))
    A('<li><a href="#method">%d. Method</a></li>' % (len(CANDIDATES) + 6))
    A('</ul>')
    A('</aside>')

    # ---------------- MAIN ----------------
    A('<main>')
    A('<h1>Accent options for harukamirai.engineer</h1>')
    A('<p class="lede">Six accent pairs for the grimoire, plus the pair now in the '
      'file, each measured against the WCAG floor and photographed on the real site '
      'in both leaves. Choose by looking.</p>')

    # 1. How to choose
    A('<h2 id="choose">1. How to choose</h2>')
    A('<div class="cue" data-af-block-id="choose-cue"><strong>The verdict this answers.</strong> '
      'The current accent was called <em>too plainish and boorish</em>. A deep navy is the '
      'safest accent there is, which is exactly why it reads flat. Everything below has more '
      'character than that and still clears the same legibility floor.</div>')
    A('<p>Only three tokens move. The grounds, the text inks and the whole grimoire material '
      'set are fixed, so a candidate is a small, total swap:</p>')
    A('<pre><code>'
      '  [data-theme="leaf-4"]  the page          [data-theme="leaf-5"]  the ink\n'
      '  ---------------------------------        ---------------------------------\n'
      '  --bg            #e1e6ea    FIXED         --bg            #0b1220    FIXED\n'
      '  --bg-elevated   #f0f3f6    FIXED         --bg-elevated   #131c2c    FIXED\n'
      '  --text          #131a20    FIXED         --text          #e9eef4    FIXED\n'
      '  --accent        ........   MOVES         --accent        ........   MOVES\n'
      '  --accent-hover  ........   MOVES         --accent-hover  ........   MOVES\n'
      '  --gold          ........   MAY MOVE      --gold          ........   MAY MOVE\n'
      '        |                                        |\n'
      '        +--- derived, not chosen ----------------+\n'
      '             --accent-glow   = accent at 20% / 30% alpha\n'
      '             --clover-fifth  = accent   (leaf-5 only: fifth leaf, demon eye)\n\n'
      '  :root  --leather-*  --foil  --parchment*  --gilt*  --page-ink*   NEVER MOVE\n'
      '         the book is one physical object in both themes\n'
      '</code></pre>')
    A('<div class="note" data-af-block-id="choose-note"><strong>Two looks deliberately avoided.</strong> '
      'A single muted accent on a warm cream ground, and a single bright acid accent on a '
      'near-black ground. Neither ground exists here any more - leaf-4 is cool linen-grey and '
      'leaf-5 is chromatic woad indigo - and every dark-leaf accent below is held off the top '
      'of its gamut so it reads as pigment rather than as an alert.</div>')
    A('<p>Three things are worth doing in order: read the strip in section 2 to find the two or '
      'three that feel right, put those against each other on one page in section 3, then open '
      'the candidate\'s own section for its six full renders.</p>')

    # 2. side by side
    A('<h2 id="compare">2. All seven, side by side</h2>')
    A('<p>Each row is one candidate on the real grounds, at the real sizes: a 12px kicker, a '
      'link, a card, a filled button and the second accent. Specimen colours here are literal '
      'because they are the subject; every other colour on this page follows your theme.</p>')

    A('<table data-af-block-id="compare-table"><thead><tr>'
      '<th>Candidate</th><th>Character</th><th>leaf-4 accent</th><th>leaf-5 accent</th>'
      '<th>--gold</th><th>Worst, leaf-4</th><th>Worst, leaf-5</th></tr></thead><tbody>')
    for c in CANDIDATES:
        wl, wd = worst(c["id"], "leaf-4"), worst(c["id"], "leaf-5")
        A('<tr><td><a class="tv-jump" href="#c-%s">%s</a></td><td>%s</td><td>%s</td><td>%s</td>'
          '<td>%s</td>'
          '<td class="rt ok">%.2f:1<br><span class="tv-mut">%s</span></td>'
          '<td class="rt ok">%.2f:1<br><span class="tv-mut">%s</span></td></tr>'
          % (c["id"], esc(c["name"]), esc(c["kicker"]),
             chip(c["leaf-4"]["accent"]), chip(c["leaf-5"]["accent"]),
             "moves" if gold_moves(c) else "unchanged",
             wl, esc(worst_token(c["id"], "leaf-4")),
             wd, esc(worst_token(c["id"], "leaf-5"))))
    A('</tbody></table>')

    for c in CANDIDATES:
        A('<div class="strip">')
        for theme, label in (("leaf-4", "leaf-4"), ("leaf-5", "leaf-5")):
            A('<div>')
            A('<p class="nm">%s <span>&middot; %s</span></p>' % (esc(c["name"]), esc(c["kicker"])))
            A(specimen(c, theme, label))
            A('</div>')
        A('</div>')

    # 3. the comparator
    A('<h2 id="situ">3. The same page, seven ways</h2>')
    A('<p>One route, one leaf, all seven candidates. Every image is the real site built from '
      'that candidate\'s tokens and photographed at 1440 wide.</p>')
    A('<div class="tv-fbar" id="cmp-bar">')
    A('<span class="tv-mut">Route</span>')
    for i, (rl, rp) in enumerate(ROUTES):
        A('<button type="button" data-route="%s"%s>%s</button>'
          % (rl, ' class="on"' if i == 0 else "", ROUTE_NAME[rl]))
    A('<span class="tv-mut" style="margin-left:14px">Leaf</span>')
    for i, (tl, tt, td) in enumerate(THEMES):
        A('<button type="button" data-theme="%s"%s>%s, the %s</button>'
          % (tl, ' class="on"' if i == 0 else "", esc(tt),
             "page" if tl == "light" else "ink"))
    A('<span class="cnt" id="cmp-count">7 shown</span>')
    A('</div>')
    A('<div class="cmp-grid" id="cmp-grid">')
    for c in CANDIDATES:
        for tl, tt, td in THEMES:
            for rl, rp in ROUTES:
                hidden = "" if (tl == "light" and rl == "home") else " hidden"
                A(shot_fig(c["id"], c["name"], tl, rl, rp, tt,
                           c["leaf-4" if tl == "light" else "leaf-5"]["accent"],
                           extra=hidden))
    A('</div>')

    # 4. the gate
    A('<h2 id="gate">4. The contrast gate</h2>')
    A('<p>The accent carries link text and 12px kickers, so it is body copy, not decoration. '
      'Every accent token is measured on both surfaces of its own theme, and the floor is '
      '%.1f:1. A candidate that failed would not be in this document.</p>' % FLOOR)
    fails = [r for r in ALL if not r["pass"]]
    A('<div class="tv-stats" data-af-block-id="gate-stats">')
    A('<div class="st"><div class="lb">Pairings measured</div><div class="vl">%d</div>'
      '<div class="nt">7 candidates &times; 2 themes &times; 3 tokens &times; 2 surfaces</div></div>'
      % len(ALL))
    A('<div class="st"><div class="lb">Floor</div><div class="vl">%.1f:1</div>'
      '<div class="nt">WCAG 2.x AA, normal text</div></div>' % FLOOR)
    A('<div class="st"><div class="lb">Failures</div><div class="vl %s">%d</div>'
      '<div class="nt">%s</div></div>'
      % ("g" if not fails else "r", len(fails),
         "nothing dropped" if not fails else "candidates dropped"))
    A('<div class="st"><div class="lb">Lowest measured</div><div class="vl">%.2f:1</div>'
      '<div class="nt">%s</div></div>'
      % (min(r["ratio"] for r in ALL),
         esc(min(ALL, key=lambda r: r["ratio"])["name"])))
    A('</div>')
    A('<div class="note" data-af-block-id="gate-regression"><strong>The regression this guards.</strong> '
      'Before the repalette in commit <code>691d1eb</code> the light-theme hover was '
      '%s on a ground of %s, which the same checker measures at <b>%.2f:1</b> - under the floor, '
      'on the state a reader is looking at while they decide whether to click. Every hover value '
      'in this document is measured on both surfaces rather than assumed safe because the resting '
      'value passed.</div>'
      % (chip("#1c8462"), chip("#ece3cf"), ratio("#1c8462", "#ece3cf")))
    A('<section data-af-collapsible data-af-title="Every measured pairing (%d rows)" '
      'data-af-collapsed data-af-collapse-id="gate-all">' % len(ALL))
    A('<table><thead><tr><th>Candidate</th><th>Theme</th><th>Token</th><th>Colour</th>'
      '<th>Surface</th><th>Ratio</th></tr></thead><tbody>')
    for r in ALL:
        A('<tr><td>%s</td><td>%s</td><td><code>--%s</code></td><td>%s</td>'
          '<td>%s <span class="tv-mut">%s</span></td><td class="rt %s">%.2f:1</td></tr>'
          % (esc(r["name"]), r["theme"], r["token"], chip(r["colour"]),
             r["surface"], r["surface_colour"],
             "ok" if r["pass"] else "no", r["ratio"]))
    A('</tbody></table>')
    A('</section>')

    # 5..n candidates
    for i, c in enumerate(CANDIDATES):
        A('<h2 id="c-%s">%d. %s</h2>' % (c["id"], i + 5, esc(c["name"])))
        if c["id"] == "baseline":
            A('<div class="warning" data-af-block-id="baseline-flag"><strong>Baseline, not a candidate.</strong> '
              'This is what is in <code>src/app/globals.css</code> today, shown so the rejection has '
              'something to sit next to.</div>')
        A('<p class="lede">%s</p>' % esc(c["why"]))
        if c.get("note"):
            A('<div class="note" data-af-block-id="note-%s"><strong>Worth knowing.</strong> %s</div>'
              % (c["id"], esc(c["note"])))

        A('<div class="tv-cols tv-1-1">')
        for theme, label in (("leaf-4", "leaf-4 - the page"), ("leaf-5", "leaf-5 - the ink")):
            v = c[theme]
            A('<div class="tv-panel"><h4>%s</h4><div class="tv-bd"><dl class="tv-kv">' % esc(label))
            A('<dt>--accent</dt><dd>%s</dd>' % chip(v["accent"]))
            A('<dt>--accent-hover</dt><dd>%s</dd>' % chip(v["accent-hover"]))
            A('<dt>--gold</dt><dd>%s</dd>' % chip(v["gold"]))
            A('</dl></div></div>')
        A('</div>')

        A('<div class="sp-pair">')
        A(specimen(c, "leaf-4", "leaf-4 - the page"))
        A(specimen(c, "leaf-5", "leaf-5 - the ink"))
        A('</div>')

        A('<h3>Measured</h3>')
        A(contrast_table(c["id"]))

        A('<section data-af-collapsible data-af-title="In situ - six renders at 1440 wide" '
          'data-af-collapsed data-af-collapse-id="situ-%s">' % c["id"])
        A('<div class="shots-grid">')
        for tl, tt, td in THEMES:
            for rl, rp in ROUTES:
                A(shot_fig(c["id"], c["name"], tl, rl, rp, tt,
                           c["leaf-4" if tl == "light" else "leaf-5"]["accent"]))
        A('</div>')
        A('</section>')

        A('<section data-af-collapsible data-af-title="The exact token change" '
          'data-af-collapsed data-af-collapse-id="tok-%s">' % c["id"])
        A('<pre><code>%s</code></pre>' % esc(token_block(c)))
        A('</section>')

    # apply
    A('<h2 id="apply">%d. If you pick one</h2>' % (len(CANDIDATES) + 5))
    A('<p>Replacing the values in the two <code>[data-theme]</code> blocks of '
      '<code>src/app/globals.css</code> is the whole change. Nothing else in the file reads a '
      'literal accent colour, and no component does either - '
      '<code>--accent</code> is referenced through <code>var()</code> throughout.</p>')
    A('<div class="tv-rd" data-af-block-id="apply-cols">')
    A('<div class="col g"><h4>Changes by hand</h4><ul>'
      '<li><code>--accent</code><em>links, kickers, filled buttons, selection</em></li>'
      '<li><code>--accent-hover</code><em>every hover state on the above</em></li>'
      '<li><code>--gold</code><em>only where the candidate says it moves</em></li>'
      '</ul></div>')
    A('<div class="col a"><h4>Changes with it</h4><ul>'
      '<li><code>--accent-glow</code><em>the accent at 20% (leaf-4) / 30% (leaf-5) alpha</em></li>'
      '<li><code>--gold-glow</code><em>the gold at 16% / 25% alpha</em></li>'
      '<li><code>--clover-fifth</code><em>leaf-5 only: the fifth leaf and the demon eye are '
      'literally the accent</em></li>'
      '</ul></div>')
    A('<div class="col n"><h4>Does not move</h4><ul>'
      '<li><code>--bg</code><em>both grounds are fixed, with --bg-elevated and --bg-inset</em></li>'
      '<li><code>--text</code><em>the inks are fixed, with --text-muted and --text-subtle</em></li>'
      '<li><code>--leather-*</code><em>and --foil, --parchment*, --gilt*, --page-ink*: the book is '
      'one physical object in both themes</em></li>'
      '</ul></div>')
    A('</div>')
    A('<div class="warning" data-af-block-id="apply-warn"><strong>The comment block goes stale.</strong> '
      'The palette doctrine at the top of <code>globals.css</code> names the current colours and '
      'quotes their measured ratios, and it lists alternates B and C. Whichever candidate wins, '
      'that prose has to be rewritten in the same commit or the file starts lying about itself.</div>')

    # method
    A('<h2 id="method">%d. Method</h2>' % (len(CANDIDATES) + 6))
    A('<p>Nothing on this page is estimated. The contrast figures come from a checker; the '
      'renders come from real production builds of an isolated copy of the site.</p>')
    A('<section data-af-collapsible data-af-title="How the numbers were made" data-af-collapsed '
      'data-af-collapse-id="m-numbers">')
    A('<p>WCAG 2.x relative luminance over sRGB, implemented in <code>palette.py</code> beside '
      'this file. The implementation was validated first by reproducing thirteen ratios already '
      'recorded in <code>globals.css</code> - text, muted, subtle, accent, gold, foil on leather, '
      'page-ink on parchment and gilt-ink on parchment - all of which matched to two decimals '
      'before any candidate was measured.</p>')
    A('<pre><code>C_lin = C/255 &lt;= 0.03928 ? (C/255)/12.92 : (((C/255)+0.055)/1.055)^2.4\n'
      'L     = 0.2126*R_lin + 0.7152*G_lin + 0.0722*B_lin\n'
      'ratio = (L_max + 0.05) / (L_min + 0.05)</code></pre>')
    A('<p>The same file is the single source for this page, so no figure here is typed by hand. '
      'Regenerate with <code>python3 build-index.py</code>.</p>')
    A('</section>')
    A('<section data-af-collapsible data-af-title="How the renders were made" data-af-collapsed '
      'data-af-collapse-id="m-shots">')
    A('<ol>')
    A('<li>The repository was copied to a scratch directory, excluding '
      '<code>node_modules</code>, <code>.next</code> and <code>.git</code>. The working '
      'repository was never modified; its <code>globals.css</code> checksum was recorded before '
      'and after the run and did not change.</li>')
    A('<li>For each candidate, only the accent tokens inside the two '
      '<code>[data-theme]</code> blocks of the copy were rewritten, then '
      '<code>next build</code> ran from clean and <code>next start</code> served it.</li>')
    A('<li>Before any screenshot, every <code>&lt;link rel=stylesheet&gt;</code> was fetched and '
      'asserted to return 200, and the served CSS was searched for that candidate\'s own hex '
      'values. A 404, or the wrong variant being served, aborts the run rather than producing a '
      'plausible-looking wrong picture.</li>')
    A('<li>The full-screen story overlay was dismissed by clicking the button matching '
      '<code>/browse portfolio directly/i</code>, the theme was set through the site\'s own '
      '<code>hm-theme</code> storage key, and the page was scrolled to the bottom and back so '
      'the <code>IntersectionObserver</code> reveals had fired.</li>')
    A('<li>Captured at a 1440 &times; 900 viewport, clipped to 1440 &times; 1700 beyond the '
      'viewport and written at 0.75 scale.</li>')
    A('</ol>')
    A('<div class="warning" data-af-block-id="m-basis"><strong>What the renders were built from.</strong> '
      'The snapshot was taken from the working tree at <code>b87a565</code> plus the uncommitted '
      'edits present at that moment. While the renders were being produced, separate work landed in '
      'the same working tree touching <code>src/app/work/page.tsx</code> and '
      '<code>src/components/HeroIntro.tsx</code>, so the Work page and the hero have moved on in '
      '<em>layout</em> since these pictures were taken. The two <code>[data-theme]</code> token '
      'blocks are byte-identical between the snapshot and the live file, so every colour and every '
      'ratio on this page describes the current <code>globals.css</code> exactly. Judge the colour, '
      'not the furniture.</div>')
    A('<div class="note" data-af-block-id="m-runes"><strong>One thing is hidden in the renders.</strong> '
      'The two scroll-rune seals are <code>position:fixed</code>, so in a capture taller than the '
      'viewport they photograph stranded in the middle of the page. They are hidden immediately '
      'before each shot so the same pixels compare across candidates. Nothing else was changed.</div>')
    A('</section>')
    A('<div class="warning" data-af-block-id="m-limits"><strong>What this page does not tell you.</strong> '
      'Contrast is measured, and the renders are real. Everything about character - whether a '
      'colour reads as pigment or as a warning, whether purple and gold reads as a codex or as a '
      'luxury template - is judgement, and it is yours. The names and the one-line rationales are '
      'colour argument, not history.</div>')

    A('</main>')
    A('</div>')

    # ---------------- JS ----------------
    A('''<script>
(function () {
  var bar = document.getElementById("cmp-bar");
  var grid = document.getElementById("cmp-grid");
  var count = document.getElementById("cmp-count");
  if (!bar || !grid || !count) return;
  var route = "home", theme = "light";
  function apply() {
    var shown = 0;
    var figs = grid.querySelectorAll("figure[data-cand]");
    for (var i = 0; i < figs.length; i++) {
      var f = figs[i];
      var on = f.getAttribute("data-route") === route &&
               f.getAttribute("data-theme") === theme;
      if (on) { f.removeAttribute("hidden"); shown++; }
      else { f.setAttribute("hidden", ""); }
    }
    count.textContent = shown + " shown";
  }
  bar.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var group = b.hasAttribute("data-route") ? "data-route" : "data-theme";
    var sibs = bar.querySelectorAll("button[" + group + "]");
    for (var i = 0; i < sibs.length; i++) sibs[i].classList.remove("on");
    b.classList.add("on");
    if (group === "data-route") route = b.getAttribute("data-route");
    else theme = b.getAttribute("data-theme");
    apply();
  });
  apply();

  // Cross-links must land visibly, not silently.
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var t = document.getElementById(a.getAttribute("href").slice(1));
    if (!t) return;
    t.style.transition = "background 120ms ease";
    var prev = t.style.background;
    t.style.background = "var(--tv-amber-t)";
    setTimeout(function () { t.style.background = prev; }, 1100);
  });
})();
</script>''')
    A('</body>')
    A('</html>')

    html = "\n".join(out)

    canonical = _banner(html, CANON_BANNER)
    with open(os.path.join(HERE, "index.html"), "w") as fh:
        fh.write(canonical)
    print("index.html written: %d bytes, %d candidates, %d measured rows"
          % (len(canonical), len(CANDIDATES), len(ALL)))

    # The local-viewing copy. index.html loads the house theme from an absolute
    # path, which is right on the server and dead over file://, so opened off
    # disk it renders as unstyled browser defaults. This copy points at the
    # af-resources/ bundled beside it instead. Only the <script> tag changes;
    # the absolute path inside the inlined CSS comment is left alone because it
    # documents the canonical form.
    if AF_SCRIPT not in html:
        raise SystemExit("af-script tag not found; cannot build the local copy")
    local = _banner(html.replace(AF_SCRIPT, AF_SCRIPT_LOCAL), LOCAL_BANNER)
    with open(os.path.join(HERE, "open-local.html"), "w") as fh:
        fh.write(local)
    print("open-local.html written: %d bytes" % len(local))

    for rel in ("af-resources/artefact.js", "af-resources/artefact-common.css",
                "af-resources/clean/theme.css", "af-resources/original/theme.css",
                "af-resources/dark/theme.css"):
        if not os.path.exists(os.path.join(HERE, rel)):
            raise SystemExit(
                "open-local.html needs the bundled theme, but %s is missing. "
                "Restore it with: cp -r ~/Projects/1iT-Artefacts/cmsWebApp/"
                "webroot/af-resources ." % rel)
    print("bundled af-resources: present")

    missing = []
    for c in CANDIDATES:
        for tl, _, _ in THEMES:
            for rl, _ in ROUTES:
                p = os.path.join(HERE, "shots", "%s-%s-%s.png" % (c["id"], tl, rl))
                if not os.path.exists(p):
                    missing.append(os.path.basename(p))
    if missing:
        print("MISSING %d render(s): %s" % (len(missing), ", ".join(missing)))
    else:
        print("all %d renders present" % (len(CANDIDATES) * 6))
    # U+2014 is banned on this repo. Written as an escape so this file does
    # not itself contain the character it rejects.
    for name, doc in (("index.html", canonical), ("open-local.html", local)):
        if re.search("\u2014", doc):
            raise SystemExit("em dash found in %s" % name)
    print("no em dash: ok")


if __name__ == "__main__":
    build()
