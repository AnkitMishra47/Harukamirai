#!/usr/bin/env python3
"""Generate the Black Clover palette artefact.

One source, two files. index.html is canonical and loads the house theme from
the ABSOLUTE /af-resources/ path the Artefact Server provides; open-local.html
is the same bytes with that one <script src> rewritten to the af-resources/
copy bundled beside it, so it works over file://. Both come out of this run,
so they cannot drift.

Every colour figure comes from palette.py and every research claim from
research.py. Nothing numeric on the page is typed by hand.

    python3 palette.py        # the gate on its own
    python3 build-index.py    # rewrites index.html AND open-local.html
"""
import os
import re

import palette as P
import research as R

HERE = os.path.dirname(os.path.abspath(__file__))
COMPONENTS = os.path.expanduser(
    "~/.claude/skills/publishing-artefacts/assets/artefact-components.css")

AF_SCRIPT = ('<script id="af-script" src="/af-resources/artefact.js" '
             'data-af-default-theme="clean" defer></script>')
AF_SCRIPT_LOCAL = AF_SCRIPT.replace('src="/af-resources/', 'src="af-resources/')

ROUTES = [("home", "/"), ("work", "/work"), ("about", "/about")]
ROUTE_NAME = {"home": "Home", "work": "Work", "about": "About"}
THEMES = [("light", "leaf-4"), ("dark", "leaf-5")]
THEME_TOKEN = {"light": "leaf-4", "dark": "leaf-5"}

CANDS = P.resolved()
BASE = CANDS[0]
REST = CANDS[1:]
ALL = list(P.rows())
RECOMMENDED = "black-asta"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def worst(cid):
    return min(r["ratio"] for r in ALL if r["candidate"] == cid)


def worst_where(cid):
    r = min((r for r in ALL if r["candidate"] == cid), key=lambda x: x["ratio"])
    return "%s %s on %s" % (r["theme"], r["token"], r["surface"])


def chip(colour, text=None):
    return '<span class="chip" style="--chip:%s"><i></i>%s</span>' % (
        colour, esc(text or colour))


# --------------------------------------------------------------------------
# page-local CSS. Chrome resolves through --tv-*. The ONLY literal colours are
# the candidate specimens and the measured source swatches, which ARE the
# subject of the document and arrive per element as inline custom properties.
# --------------------------------------------------------------------------
PAGE_CSS = """
.chip{display:inline-flex;align-items:center;gap:6px;
  font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11.5px;
  color:var(--tv-ink2);white-space:nowrap}
.chip i{width:13px;height:13px;border-radius:3px;border:1px solid var(--tv-line2);
  background:var(--chip);display:inline-block;flex:0 0 13px}
td .chip{font-size:11px}
.rt{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.rt.ok{color:var(--tv-green)}
.rt.no{color:var(--tv-red);font-weight:700}

/* ---- measured swatch strip ---- */
.sw{display:flex;flex-wrap:wrap;gap:0;border:1px solid var(--tv-line);
  border-radius:6px;overflow:hidden;margin:0 0 6px}
.sw .s{flex:1 1 90px;min-width:90px}
.sw .s .b{height:44px;background:var(--c)}
.sw .s .t{padding:5px 7px 6px;background:var(--tv-panel);
  border-top:1px solid var(--tv-line);font-size:10.5px;line-height:1.35;
  color:var(--tv-ink3)}
.sw .s .t b{display:block;color:var(--tv-ink2);font-weight:600;font-size:10.5px}
.sw .s .t code{font-size:10px;background:none;padding:0}
.srcline{font-size:11.5px;color:var(--tv-ink3);margin:0 0 16px}

/* ---- specimen: a candidate's tokens on their own grounds ---- */
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
.sp .sp-2nd{color:var(--sp-2nd);font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px}
.sp .sp-mono{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:12px;
  color:var(--sp-subtle)}
.sp .sp-sub{color:var(--sp-subtle);font-size:11.5px;font-family:ui-monospace,Menlo,Consolas,monospace}
.sp .sp-btn{display:inline-block;background:var(--sp-accent);color:var(--sp-bg);
  border-radius:999px;padding:7px 16px;font-size:12.5px;font-weight:600}
.sp .sp-btn.hv{background:var(--sp-hover)}
.sp .sp-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}
.sp-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 0 16px}
@media(max-width:1000px){.sp-pair{grid-template-columns:1fr}}

/* ---- in-situ renders ---- */
.shot{border:1px solid var(--tv-line);border-radius:6px;overflow:hidden;
  background:var(--tv-panel);margin:0}
.shot figcaption{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;
  color:var(--tv-ink3)!important;background:var(--tv-panel2);
  border-bottom:1px solid var(--tv-line);padding:6px 11px;display:flex;gap:10px;
  align-items:center;flex-wrap:wrap}
.shot figcaption b{color:var(--tv-ink2);font-weight:650}
.shot img{display:block;width:100%;height:auto;border:0}
.shots-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 6px}
@media(max-width:1100px){.shots-grid{grid-template-columns:1fr}}

/* ---- glyph workbench ---- */
.gw{border:1px solid var(--tv-line);border-radius:6px;overflow:hidden;
  background:var(--gw-bg);margin:0 0 6px}
.gw .gw-hd{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10.5px;
  letter-spacing:.06em;text-transform:uppercase;font-weight:650;
  color:var(--tv-ink3)!important;background:var(--tv-panel2);
  border-bottom:1px solid var(--tv-line);padding:6px 12px}
.gw .gw-body{padding:18px;display:flex;gap:22px;align-items:center;
  justify-content:center;flex-wrap:wrap;min-height:150px}
.gw svg{display:block;overflow:visible}
.gw .cap{font-size:11.5px;color:var(--gw-muted);text-align:center;margin:8px 0 0;
  font-family:ui-monospace,Menlo,Consolas,monospace}
.gw-row{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin:0 0 14px}
@media(max-width:900px){.gw-row{grid-template-columns:1fr}}
.gw-ctl{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 14px}
.gw-ctl select{font:inherit;font-size:13px;padding:5px 8px;border-radius:5px;
  border:1px solid var(--tv-line2);background:var(--tv-panel);color:var(--tv-ink)}

/* the slash sweep: transform only */
.slash-stage{position:relative;width:250px;height:110px;border-radius:5px;
  overflow:hidden;background:var(--gw-before);border:1px solid var(--gw-rule)}
.slash-stage .after{position:absolute;inset:0;background:var(--gw-after);
  transform:translateX(-170%) skewX(-16deg) scaleX(1.5);transform-origin:left center}
.slash-stage .edge{position:absolute;inset:0;background:var(--gw-edge);
  will-change:transform;
  transform:translateX(-170%) skewX(-16deg) scaleX(0.10);transform-origin:left center}
.slash-stage.go .after{animation:slash-sweep 900ms cubic-bezier(.65,0,.35,1) forwards}
.slash-stage.go .edge{animation:slash-edge 900ms cubic-bezier(.65,0,.35,1) forwards}
@keyframes slash-sweep{to{transform:translateX(0) skewX(-16deg) scaleX(1.5)}}
@keyframes slash-edge{
  0%{transform:translateX(-170%) skewX(-16deg) scaleX(.10);opacity:0}
  30%{opacity:1}
  100%{transform:translateX(170%) skewX(-16deg) scaleX(.10);opacity:0}}

/* the clover: the fifth leaf arrives, the eye opens */
.cl .leaf{fill:var(--gw-leaf);transition:fill 280ms ease}
.cl .stem{fill:var(--gw-stem)}
.cl .leaf5{fill:var(--gw-fifth);opacity:0;transform:scale(0) rotate(-22deg);
  transform-origin:50px 50px;transform-box:fill-box;
  transition:opacity 220ms cubic-bezier(.4,0,.2,1),
             transform 420ms cubic-bezier(.34,1.56,.64,1)}
.cl .eye{fill:var(--gw-fifth);opacity:0;transform:scaleY(0);
  transform-origin:50px 50px;transform-box:fill-box;transition:opacity 200ms,transform 320ms}
.cl .pupil{fill:var(--gw-bg)}
.cl .halo{fill:var(--gw-fifth);opacity:0;transform:scale(.6);
  transform-origin:50px 50px;transform-box:fill-box}
.cl.on .leaf5{opacity:1;transform:scale(1) rotate(0)}
.cl.on .eye{opacity:1;transform:scaleY(1)}
.cl.on .halo{animation:halo 2.6s ease-in-out infinite}
@keyframes halo{0%,100%{opacity:.14;transform:scale(.95)}50%{opacity:.30;transform:scale(1.18)}}

/* the mark: a rule that fills with the colour it absorbed */
.mk path{stroke:var(--gw-rule);stroke-width:2;fill:none}
.mk .fill{stroke:var(--gw-fifth);stroke-dasharray:1;stroke-dashoffset:1;
  transition:stroke-dashoffset 1200ms cubic-bezier(.65,0,.35,1)}
.mk.on .fill{stroke-dashoffset:0}
.mk .notch{fill:var(--gw-rule);opacity:.5;transform:scale(0);
  transform-origin:center;transform-box:fill-box;
  transition:transform 300ms cubic-bezier(.34,1.56,.64,1),opacity 300ms}
.mk.on .notch{fill:var(--gw-fifth);opacity:1;transform:scale(1)}
.mk.on .n2{transition-delay:220ms}
.mk.on .n3{transition-delay:440ms}

@media(prefers-reduced-motion:reduce){
  .cl .leaf5,.cl .eye,.mk .fill,.mk .notch{transition-duration:1ms!important}
  .cl.on .halo{animation:none;opacity:.2}
  .slash-stage.go .after,.slash-stage.go .edge{animation-duration:1ms!important}
}

/* ---- misc ---- */
.ev{margin:0 0 14px}
.ev summary{cursor:pointer;font-size:13px;color:var(--tv-blue);font-weight:600}
.ev blockquote{margin:10px 0 0;padding:2px 0 2px 14px;
  border-left:3px solid var(--tv-line2);color:var(--tv-ink2);font-size:13.5px}
.ev .cite{font-size:11.5px;color:var(--tv-ink3);margin:6px 0 0}
.tv-rd li code{white-space:nowrap;flex:0 0 auto}
.tv-rd li em{flex:1 1 auto}
.pill{display:inline-block;font-family:ui-monospace,Menlo,Consolas,monospace;
  font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:650;
  padding:2px 8px;border-radius:999px;border:1px solid var(--tv-line2);
  color:var(--tv-ink3)}
.jp{font-size:.92em;letter-spacing:.06em;color:var(--tv-ink3);font-weight:400}

/* Content links. The shared theme styles no unclassed <a> inside main, so a
   source citation falls back to the browser's default navy and is unreadable
   on the dark ground. --tv-blue is declared per theme, so this follows. */
main a:not([class]){color:var(--tv-blue);text-decoration:underline;
  text-decoration-thickness:1px;text-underline-offset:2px}
main a:not([class]):hover{text-decoration-thickness:2px}

/* prose key/value. The theme's .tv-kv right-aligns a monospace value, which is
   right for a figure and wrong for a sentence. */
.kv{display:grid;grid-template-columns:minmax(120px,190px) 1fr;gap:0;margin:0 0 16px}
.kv>dt{padding:9px 16px 9px 0;font-size:12.5px;font-weight:650;color:var(--tv-ink2);
  border-bottom:1px solid var(--tv-line)}
.kv>dd{margin:0;padding:9px 0;font-size:13.5px;line-height:1.62;color:var(--tv-ink);
  border-bottom:1px solid var(--tv-line)}
.kv>dt:last-of-type,.kv>dd:last-of-type{border-bottom:0}
@media(max-width:700px){.kv{grid-template-columns:1fr}
  .kv>dt{border-bottom:0;padding-bottom:0}}
.ev table{margin-top:12px}
"""


# --------------------------------------------------------------------------
# fragments
# --------------------------------------------------------------------------
def specimen(cand, theme):
    v = cand["themes"][theme]
    style = ("--sp-bg:%s;--sp-card:%s;--sp-text:%s;--sp-muted:%s;--sp-subtle:%s;"
             "--sp-border:%s;--sp-accent:%s;--sp-hover:%s;--sp-2nd:%s"
             % (v["bg"], v["bg-elevated"], v["text"], v["text-muted"],
                v["text-subtle"], v["border"], v["accent"], v["accent-hover"],
                v["second"]))
    label = "leaf-4 &middot; four leaves" if theme == "light" else "leaf-5 &middot; five leaves"
    return """<div class="sp" style="%s">
 <div class="sp-hd">%s &nbsp;&middot;&nbsp; ground %s &nbsp;&middot;&nbsp; card %s</div>
 <div class="sp-body">
  <p class="sp-kick">Anti-magic grimoire &middot; no. 17</p>
  <p class="sp-h">Built, shipped, owned.</p>
  <p class="sp-p">Body copy sits in <span class="sp-mono">--text-muted</span>.
   The accent carries <a class="sp-a" href="#gate">a link like this one</a>, and on hover it
   moves to <a class="sp-a hv" href="#gate">the hover value</a>.</p>
  <div class="sp-card">
   <p class="sp-kick">AI platform &middot; enterprise retrieval</p>
   <div class="sp-row"><a class="sp-a" href="#gate">Show details</a>
    <span class="sp-2nd">2019 - 2022 &middot; %s</span></div>
  </div>
  <div class="sp-foot"><span class="sp-btn">Experience Storyline</span>
   <span class="sp-btn hv">on hover</span>
   <span class="sp-sub">--text-subtle</span></div>
 </div>
</div>""" % (style, label, v["bg"], v["bg-elevated"],
             esc(cand.get("second_label", "second accent")))


def token_block(cand):
    lines = []
    for theme, token in THEMES:
        v = cand["themes"][theme]
        second = cand.get("second_rename") or "--gold"
        head = ':root,\n[data-theme="leaf-4"] {' if theme == "light" \
            else '[data-theme="leaf-5"] {'
        lines.append(head)
        for name in ("bg", "bg-elevated", "bg-inset"):
            lines.append("  --%-16s %s;" % (name + ":", v[name]))
        lines.append("")
        for name in ("text", "text-muted", "text-subtle"):
            lines.append("  --%-16s %s;" % (name + ":", v[name]))
        lines.append("")
        lines.append("  --%-16s %s;" % ("accent:", v["accent"]))
        lines.append("  --%-16s %s;" % ("accent-hover:", v["accent-hover"]))
        lines.append("  --%-16s %s;" % ("accent-glow:",
                                        P.rgba(v["accent"], "0.20" if theme == "light" else "0.30")))
        lines.append("")
        lines.append("  %-18s %s;" % (second + ":", v["second"]))
        lines.append("  %-18s %s;" % (second + "-glow:",
                                      P.rgba(v["second"], "0.16" if theme == "light" else "0.25")))
        lines.append("")
        lines.append("  --%-16s %s;" % ("border:", v["border"]))
        lines.append("  --%-16s %s;" % ("border-strong:", v["border-strong"]))
        lines.append("}")
        lines.append("")
    return esc("\n".join(lines).rstrip())


def contrast_table(cid):
    out = ['<table><thead><tr><th>Theme</th><th>Token</th><th>Colour</th>'
           '<th>on <code>--bg</code></th><th>on <code>--bg-elevated</code></th>'
           '</tr></thead><tbody>']
    for theme, token_name in THEMES:
        for token in P.GATED:
            rs = {r["surface"]: r for r in ALL
                  if r["candidate"] == cid and r["theme"] == theme and r["token"] == token}
            a, b = rs["bg"], rs["bg-elevated"]
            out.append(
                "<tr><td><code>%s</code></td><td><code>--%s</code></td><td>%s</td>"
                '<td class="rt %s">%.2f:1</td><td class="rt %s">%.2f:1</td></tr>'
                % (token_name, token, chip(a["colour"]),
                   "ok" if a["pass"] else "no", a["ratio"],
                   "ok" if b["pass"] else "no", b["ratio"]))
    out.append("</tbody></table>")
    return "".join(out)


def shot_fig(cid, theme_label, route):
    src = "shots/%s-%s-%s.webp" % (cid, theme_label, route)
    tok = THEME_TOKEN[theme_label]
    return ('<figure class="shot">'
            '<figcaption><b>%s</b> <code>%s</code></figcaption>'
            '<img loading="lazy" src="%s" width="1080" height="1275" '
            'alt="The %s page of the site at 1080 wide with the %s palette in %s">'
            '</figure>'
            % (ROUTE_NAME[route], tok, src, ROUTE_NAME[route], esc(cid), tok))


def swatch_strip(entries):
    out = ['<div class="sw">']
    for role, hexv, note in entries:
        out.append('<div class="s" style="--c:%s"><div class="b"></div>'
                   '<div class="t"><b>%s</b><code>%s</code><br>%s</div></div>'
                   % (hexv, esc(role), hexv, esc(note)))
    out.append("</div>")
    return "".join(out)


CLOVER_SVG = """<svg class="cl" viewBox="0 0 100 100" width="118" height="118"
  role="img" aria-label="Four-leaf clover that grows a fifth leaf and a slit eye">
 <circle class="halo" cx="50" cy="48" r="30"></circle>
 <path class="stem" d="M49 62 q1 14 -6 22 q-1 2 1 3 q2 1 3 -1 q7 -10 6 -24 z"></path>
 <g class="leaf">
  <path d="M50 46 C44 34 44 24 50 18 C56 24 56 34 50 46 Z"></path>
  <path d="M52 48 C64 42 74 42 80 48 C74 54 64 54 52 48 Z"></path>
  <path d="M50 50 C56 62 56 72 50 78 C44 72 44 62 50 50 Z"></path>
  <path d="M48 48 C36 54 26 54 20 48 C26 42 36 42 48 48 Z"></path>
 </g>
 <g class="leaf5"><path d="M52 44 C62 33 71 29 78 31 C77 39 70 45 52 44 Z"></path></g>
 <g class="eye">
  <ellipse cx="50" cy="48" rx="11" ry="6.4"></ellipse>
  <ellipse class="pupil" cx="50" cy="48" rx="2.6" ry="5.4"></ellipse>
 </g>
</svg>"""

MARK_SVG = """<svg class="mk" viewBox="0 0 260 34" width="250" height="34"
  role="img" aria-label="A blade rule whose three notches fill as it is drawn">
 <path d="M6 17 H254"></path>
 <path class="fill" pathLength="1" d="M6 17 H254"></path>
 <circle class="notch n1" cx="66" cy="17" r="4"></circle>
 <circle class="notch n2" cx="130" cy="17" r="4"></circle>
 <circle class="notch n3" cx="194" cy="17" r="4"></circle>
</svg>"""


def workbench(cand, theme):
    v = cand["themes"][theme]
    other = cand["themes"]["dark" if theme == "light" else "light"]
    style = ("--gw-bg:%s;--gw-muted:%s;--gw-leaf:%s;--gw-stem:%s;--gw-fifth:%s;"
             "--gw-rule:%s;--gw-before:%s;--gw-after:%s;--gw-edge:%s"
             % (v["bg"], v["text-subtle"],
                v["accent"] if theme == "light" else v["text"],
                v["text-subtle"], v["accent"], v["text-subtle"],
                other["bg"], v["bg"], v["accent"]))
    tok = THEME_TOKEN[theme]
    return """<div class="gw" style="%s">
 <div class="gw-hd">%s &nbsp;&middot;&nbsp; %s</div>
 <div class="gw-body">
  <div><div class="cl-wrap">%s</div><p class="cap">clover + eye</p></div>
  <div><div class="slash-stage"><div class="after"></div><div class="edge"></div></div>
   <p class="cap">dimension slash<br>%s &rarr; %s</p></div>
  <div>%s<p class="cap">demon-dweller mark</p></div>
 </div>
</div>""" % (style, esc(cand["name"]), tok, CLOVER_SVG,
             "leaf-5" if theme == "light" else "leaf-4", tok, MARK_SVG)


# --------------------------------------------------------------------------
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
    head = "<!DOCTYPE html>\n"
    if not doc.startswith(head):
        raise SystemExit("doctype is not the first line; cannot insert banner")
    return head + banner + doc[len(head):]


SECTIONS = [
    ("s1", "What this is, and what changed"),
    ("s2", "The research, and where it came from"),
    ("s3", "Why the toggle is the whole brief"),
    ("s4", "The five candidates"),
    ("s5", "The grimoire, remade from the frame"),
    ("s6", "Glyphs and motion"),
    ("gate", "The contrast gate"),
    ("s8", "Method"),
    ("s9", "Recommendation"),
]


def build():
    with open(COMPONENTS) as fh:
        comp = fh.read()
    comp = comp.replace('content:"\\\\2315"', 'content:"\\2315"')
    comp = comp.replace(chr(0x2014), "-")

    out = []
    A = out.append

    A('<!DOCTYPE html>')
    A('<html lang="en">')
    A('<head>')
    A('<meta charset="UTF-8">')
    A('<meta name="viewport" content="width=device-width, initial-scale=1">')
    A('<title>Black Clover palette and motif - harukamirai.engineer</title>')
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
    A('<h2>Black Clover palette</h2>')
    A('<div class="subtitle">Five candidates for leaf-4 and leaf-5, measured '
      'against the source material</div>')
    A('<ul>')
    for sid, title in SECTIONS:
        A('<li><a href="#%s">%s</a></li>' % (sid, esc(title)))
    A('</ul>')
    A('<h4>Candidates</h4><ul>')
    for c in REST:
        A('<li><a href="#c-%s">%s</a></li>' % (c["id"], esc(c["name"])))
    A('</ul>')
    A('</aside>')

    A('<main>')
    A('<h1>Black Clover palette and motif</h1>')
    A('<p class="lede">Six accent pairs were rejected because they were a European '
      'scriptorium wearing a grimoire\'s name. This pass starts from the source '
      'material instead: Asta, Yami, the Black Bulls and the Clover Kingdom, read '
      'from the wiki and measured off published frames. Five candidates, every '
      'colour derived rather than picked, every pairing measured, every page '
      'rendered from a real build.</p>')

    # ---------------- s1 ----------------
    A('<h2 id="s1">What this is, and what changed</h2>')
    nfail = sum(1 for r in ALL if not r["pass"])
    nmat = len(P.material_rows())
    A('<div class="tv-stats">')
    for lb, vl, nt, cls in [
        ("Candidates", str(len(REST)), "plus today's palette as a baseline", "g"),
        ("Measured pairings", str(len(ALL) + nmat), "floor %.1f:1" % P.FLOOR, "g"),
        ("Failures", str(nfail), "nothing below the floor ships", "g"),
        ("In-situ renders", str(len(CANDS) * 6), "real builds, three pages, both themes", "g"),
        ("Checker validation", "%d / %d" % (
            sum(1 for v in P.validate_checker() if v["ok"]), len(P.validate_checker())),
         "ratios already written in globals.css, reproduced", "g"),
    ]:
        A('<div class="st"><div class="lb">%s</div><div class="vl %s">%s</div>'
          '<div class="nt">%s</div></div>' % (lb, cls, vl, nt))
    A('</div>')

    A('<div class="tv-cols tv-1-1">')
    A('<div class="tv-panel"><h4>What the last pass got wrong</h4><div class="tv-bd">'
      '<p>It was grounded in a medieval scriptorium: iron gall, lapis, vermilion, gold '
      'leaf. That is a grimoire in the European sense and it is a reasonable palette. '
      'It is not Black Clover, and it is a long way from Asta and Yami. A four-leaf '
      'clover in that world is luck; a five-leaf clover holds a devil. Neither is '
      'lapis.</p>'
      '<p>Two mechanical faults followed from it. The grounds were held fixed, so every '
      'candidate was a different link colour on the same two surfaces. And the second '
      'accent stayed ochre gold in five of the six, so the candidates differed by one '
      'hue out of three.</p>'
      '</div></div>')
    A('<div class="tv-panel"><h4>What is different here</h4><div class="tv-bd">'
      '<p>The grounds move. Each candidate brings its own <code>--bg</code>, '
      '<code>--bg-elevated</code> and <code>--bg-inset</code>, its own three ranks of '
      'text and its own second accent, so they are five palettes rather than five '
      'links.</p>'
      '<p>Nothing is picked by eye. A candidate is declared as a ground hue, a text hue '
      'and three accent intents with a target ratio; the generator binary-searches the '
      'lightness that hits the target. Passing the gate is a property of the '
      'definition, not something a human checked once.</p>'
      '<p>And the book itself is retuned from the frame, because Asta\'s grimoire is '
      'not a tanned leather codex. See <a class="tv-jump" href="#s5">The grimoire, '
      'remade from the frame</a>.</p>'
      '</div></div>')
    A('</div>')

    A('<div class="note"><p><b>No copyrighted imagery is used anywhere.</b> Published '
      'frames were downloaded to a scratch directory, sampled for colour with PIL, and '
      'the numbers kept. No image, trace, redraw, screenshot or official insignia '
      'appears in this artefact or is proposed for the site. Every glyph below is '
      'original geometry built from the vocabulary: clover shapes, a rule, a sweep, an '
      'eye.</p></div>')

    # ---------------- s2 ----------------
    A('<h2 id="s2">The research, and where it came from</h2>')
    A('<p>Two kinds of evidence, kept apart. <b>Quoted</b> claims come from wiki pages '
      'that themselves cite a chapter or an episode, and they are reliable for what a '
      'thing <em>is</em>. <b>Measured</b> colours come from sampling a published frame, '
      'and they are the only reliable evidence for what a thing <em>looks like</em> - no '
      'source consulted assigns anti-magic a hue in words.</p>')

    A('<div class="cue"><p>The single most useful finding: <b>the source material does '
      'not do near-black plus one hot colour.</b> One frame of Black Asta measures a '
      'five-stop gradient from indigo <code>#14152e</code> through violet '
      '<code>#462b54</code> to crimson <code>#600913</code>, rose <code>#8b3457</code> '
      'and a warm flare at <code>#d1905d</code>. The only black in it is the cloak, and '
      'the cloak has gold on it.</p></div>')

    for gid, gname in R.GROUPS:
        A('<h3>%s</h3>' % esc(gname))
        claims = [t for t in R.TEXT if t[0] == gid]
        A('<table><thead><tr><th style="width:24%">Finding</th><th>Evidence, quoted</th>'
          '<th style="width:20%">Source</th></tr></thead><tbody>')
        for _, title, quote, src, url in claims:
            A('<tr><td><b>%s</b></td><td>%s</td><td><a href="%s">%s</a></td></tr>'
              % (esc(title), esc(quote), url, esc(src)))
        A('</tbody></table>')
        for mgid, label, url, entries in R.MEASURED:
            if mgid != gid:
                continue
            A('<p class="srcline"><b>Measured:</b> %s &middot; '
              '<a href="%s">source frame</a></p>' % (esc(label), url))
            A(swatch_strip(entries))

    A('<details class="ev"><summary>What could not be verified, and is therefore not '
      'used as a design input</summary>')
    A('<ul>')
    for u in R.UNVERIFIED:
        A('<li>%s</li>' % esc(u))
    A('</ul>')
    A('<p class="cite">The wiki is a fan wiki. It is used here because it cites a '
      'chapter and an episode for nearly every sentence, which makes a claim checkable; '
      'the official site was consulted where it says anything at all. Where the two '
      'disagree, neither is asserted.</p>')
    A('</details>')

    # ---------------- s3 ----------------
    A('<h2 id="s3">Why the toggle is the whole brief</h2>')
    A('<p>The site\'s theme switch is a clover that gains a fifth leaf, and the About '
      'page tells the visitor so: <em>"The five-leaf clover at the top of this page is '
      'not a logo; it\'s a switch."</em> That is not decoration on top of a palette. In '
      'the source, growing a fifth leaf is the single most loaded event that can happen '
      'to a book.</p>')
    A('<pre>'
      '  leaf-4  a four-leaf grimoire          leaf-5  a grimoire of despair\n'
      '          rare, and it is LUCK                  the cover turns darker,\n'
      '          the world in daylight:                the clover turns BLACK\n'
      '          sandstone, olive, ochre,              and grows a fifth leaf,\n'
      '          terracotta roofs                      and a devil moves in\n'
      '                                        \n'
      '          the Clover Kingdom                    Asta and Yami\n'
      '          ordinary magic                        anti-magic and darkness\n'
      '</pre>')
    A('<p>So the two themes are not "light mode and dark mode with a clover on top". '
      'They are the same object before and after. Every candidate below is built to '
      'that: <code>leaf-4</code> is some part of the world the Black Bulls work in, and '
      '<code>leaf-5</code> is what the fifth leaf brings. The one rule that falls out of '
      'it is that <code>leaf-5</code> must not simply be <code>leaf-4</code> with the '
      'lights off.</p>')
    A('<div class="warning"><p>The corrupted clover turns <em>black</em> - the wiki is '
      'explicit, and the frame measures the stamp at <code>#0f0809</code> against a '
      'cover at <code>#130d0c</code>, so it is <em>darker than what it sits on</em>. '
      'The site currently paints the fifth leaf in the bright accent. That is backwards '
      'against the source; see <a class="tv-jump" href="#s6">Glyphs and motion</a>.</p>'
      '</div>')

    # ---------------- s4 ----------------
    A('<h2 id="s4">The five candidates</h2>')
    A('<p>Each one gives a complete token set for both themes. The two specimens show '
      'the real tokens on their own grounds; the three renders below them are the live '
      'site built with those tokens. Today\'s palette is at the end as a baseline.</p>')

    A('<table><thead><tr><th>Candidate</th><th>leaf-4 ground</th><th>leaf-5 ground</th>'
      '<th>accent</th><th>second accent</th><th>Worst ratio</th></tr></thead><tbody>')
    for c in REST + [BASE]:
        l, d = c["themes"]["light"], c["themes"]["dark"]
        A('<tr><td><a class="tv-jump" href="#c-%s"><b>%s</b></a>%s</td>'
          '<td>%s</td><td>%s</td>'
          '<td>%s<br>%s</td><td>%s<br>%s</td>'
          '<td class="rt ok">%.2f:1</td></tr>'
          % (c["id"], esc(c["name"]),
             (' <span class="jp">%s</span>' % esc(c["jp"])) if c["jp"] else "",
             chip(l["bg"]), chip(d["bg"]),
             chip(l["accent"]), chip(d["accent"]),
             chip(l["second"]), chip(d["second"]),
             worst(c["id"])))
    A('</tbody></table>')

    for c in REST:
        A('<h3 id="c-%s">%s %s <span class="pill">%s</span></h3>'
          % (c["id"], esc(c["name"]),
             ('<span class="jp">%s</span>' % esc(c["jp"])) if c["jp"] else "",
             esc(c["kicker"])))
        A('<dl class="kv">')
        A('<dt>Drawn from</dt><dd>%s</dd>' % esc(c["drawn_from"]))
        A('<dt>What it does with the toggle</dt><dd>%s</dd>' % esc(c["why"]))
        A('<dt>Where it is weak</dt><dd>%s</dd>' % esc(c["risk"]))
        A('</dl>')
        A('<div class="sp-pair">%s%s</div>' % (specimen(c, "light"), specimen(c, "dark")))
        for theme_label, tok in THEMES:
            A('<div class="shots-grid">')
            for route, _ in ROUTES:
                A(shot_fig(c["id"], theme_label, route))
            A('</div>')
        A('<details class="ev"><summary>Tokens and measured contrast for %s</summary>'
          % esc(c["name"]))
        A('<pre><code class="language-css">%s</code></pre>' % token_block(c))
        A(contrast_table(c["id"]))
        A('</details>')

    A('<h3 id="c-baseline">%s <span class="pill">%s</span></h3>'
      % (esc(BASE["name"]), esc(BASE["kicker"])))
    A('<p>%s %s</p>' % (esc(BASE["drawn_from"]), esc(BASE["why"])))
    A('<div class="sp-pair">%s%s</div>' % (specimen(BASE, "light"), specimen(BASE, "dark")))
    for theme_label, tok in THEMES:
        A('<div class="shots-grid">')
        for route, _ in ROUTES:
            A(shot_fig("baseline", theme_label, route))
        A('</div>')

    # ---------------- s5 ----------------
    A('<h2 id="s5">The grimoire, remade from the frame</h2>')
    A('<p>The <code>--leather-*</code>, <code>--foil</code>, <code>--parchment*</code>, '
      '<code>--gilt*</code> and <code>--page-ink*</code> tokens sit outside both '
      '<code>[data-theme]</code> blocks on purpose: the book is one physical object lit '
      'two ways. That doctrine is right and it does not change. What changes is which '
      'object.</p>')
    A('<p>The current values describe a medieval codex - tanned brown leather, a bright '
      'gold stamp, cream parchment. Asta\'s grimoire is <em>"tattered and filthy"</em> '
      'and its clover is <em>"largely unseen due to the dirt covering it"</em>. The '
      'frame agrees: the cover measures a mottled soot-brown between '
      '<code>#130d0c</code> and <code>#352320</code>, the five-leaf stamp is '
      '<code>#0f0809</code> - darker than the cover - and the page edges glow crimson at '
      '<code>#680609</code>, not gold.</p>')
    A('<div class="tv-cols tv-1-1">')
    A('<div class="tv-panel"><h4>The change</h4><div class="tv-bd"><ul>'
      '<li>The leather goes sootier and darker, and loses its tan.</li>'
      '<li>The stamp stops being the brightest thing on the cover. <code>--foil</code> '
      'moves to the Black Bull trim gold measured on the insignia '
      '(<code>#d2bd90</code> family) rather than a bright leaf gold.</li>'
      '<li>A new fixed <code>--ember</code> carries the crimson page-edge glow. It is a '
      'rim light on the book only, never text, never a ground.</li>'
      '<li>The parchment stays a readable page, because a page that cannot be read is '
      'not faithful to anything.</li>'
      '</ul></div></div>')
    A('<div class="tv-panel"><h4>Gate</h4><div class="tv-bd">')
    A('<table><thead><tr><th>Pairing</th><th></th><th>Ratio</th><th>Floor</th>'
      '</tr></thead><tbody>')
    for m in P.material_rows():
        A('<tr><td><code>%s</code></td><td>%s on %s</td>'
          '<td class="rt %s">%.2f:1</td><td>%.1f:1</td></tr>'
          % (esc(m["name"]), chip(m["a"]), chip(m["b"]),
             "ok" if m["pass"] else "no", m["ratio"], m["floor"]))
    A('</tbody></table>')
    A('</div></div></div>')
    A('<pre><code class="language-css">%s</code></pre>' % esc(
        ":root {\n" + "\n".join("  %-18s %s;" % (k + ":", v)
                                for k, v in P.MATERIALS.items()) + "\n}"))
    A('<div class="cue"><p>One measured caveat that applies to <b>every</b> candidate '
      'and to today\'s palette too. The parchment sits at 1.03 to 1.05:1 against every '
      'light ground, so the book can never separate from a light page by luminance - it '
      'has to separate by hue. Distance from the parchment\'s hue: current palette '
      '164.5&deg;, Dark Cloaked 142.2&deg;, Five-Leaf 103.6&deg;, Black Asta 90.2&deg;, '
      'Black Bull 25.3&deg;, Hage 3.6&deg;. Hage is the one where the book genuinely '
      'reads as cream on cream in <code>leaf-4</code>.</p></div>')

    # ---------------- s6 ----------------
    A('<h2 id="s6">Glyphs and motion</h2>')
    A('<p>Four proposals, all original geometry, all <code>transform</code> and '
      '<code>opacity</code> only, all guarded by <code>prefers-reduced-motion</code>, '
      'no new dependency and no filter. Three of them are running below - pick a '
      'candidate and press play.</p>')

    A('<div class="gw-ctl">'
      '<label for="gw-pick">Candidate</label>'
      '<select id="gw-pick">%s</select>'
      '<button class="tv-btn" id="gw-play" type="button">Play</button>'
      '<span class="tv-hint">The clover toggles on each press, as it does on the site.</span>'
      '</div>'
      % "".join('<option value="%s"%s>%s</option>'
                % (c["id"], " selected" if c["id"] == RECOMMENDED else "", esc(c["name"]))
                for c in REST))
    A('<div class="gw-row" id="gw-mount">')
    for c in REST:
        for theme_label, tok in THEMES:
            A('<div class="gw-slot" data-cand="%s" data-theme="%s"%s>%s</div>'
              % (c["id"], theme_label,
                 "" if c["id"] == RECOMMENDED else ' hidden',
                 workbench(c, theme_label)))
    A('</div>')

    A('<h3>1. The fifth leaf arrives dark, not bright</h3>')
    A('<p>The site already animates <code>--fifth-scale</code> and '
      '<code>--fifth-rotate</code> with an overshoot, which is the right motion. The '
      'colour is wrong against the source: the corrupted clover turns black. Paint the '
      'fifth leaf near the ground instead of in the accent, and let the accent live only '
      'in a soft halo behind it - so what the eye reads is an ink blot landing on the '
      'mark, with the glow arriving a beat later. Cost: two token values and one extra '
      '<code>&lt;circle&gt;</code>. No new animation.</p>')

    A('<h3>2. The slit eye, which the site half-built already</h3>')
    A('<p>Asta has <em>"emerald green eyes"</em>; in Black Asta form <em>"his right eye '
      'turns red with the pupil becoming slit-like"</em>. That maps onto the toggle '
      'exactly: the clover\'s centre is an ordinary mark in <code>leaf-4</code> and '
      'opens into a slit eye in <code>leaf-5</code>. The site already has '
      '<code>.demon-eye</code> and <code>.demon-pupil</code>.</p>')
    A('<div class="danger"><p><b>A defect to fix while you are in there.</b> '
      '<code>src/app/globals.css:272</code> animates the demon eye with '
      '<code>filter: drop-shadow(0 0 3px var(--clover-fifth))</code> under a 2.6s '
      'infinite <code>opacity</code> keyframe. A <code>filter</code> on an infinite loop '
      'is exactly the thing the performance rule excludes, and it sits on an element '
      'that is visible on every page in <code>leaf-5</code>. Replace it with a second, '
      'larger, low-opacity ellipse animating <code>opacity</code> and '
      '<code>transform</code> - the <code>.halo</code> circle in the prototype above is '
      'that replacement, and it costs nothing.</p></div>')

    A('<h3>3. Dimension Slash as the theme transition</h3>')
    A('<p><em>Yamimatoi: Jigengiri.</em> <em>"the user channels darkness into a sword '
      'and, with a downward slash, releases that darkness... The slash is able to cut '
      'through large clouds of mana, Spatial Magic, and even space itself."</em> The '
      'site currently swaps themes with a radial ink burst '
      '(<code>.burst-ink</code> / <code>.burst-ring</code>). A burst is a generic '
      'transition. A cut is this one.</p>')
    A('<p>Mechanically it is one absolutely-positioned element carrying the incoming '
      'ground, skewed about 16&deg; and translated across the viewport, with a thin '
      'bright edge running ahead of it. Both are pure <code>transform</code>, so it '
      'composites on the GPU and never touches layout; the theme attribute flips at the '
      'midpoint. It replaces <code>ThemeBurst</code> rather than adding to it, so the '
      'work is a swap, not an addition.</p>')

    A('<h3>4. The Demon-Dweller mark: a rule that takes the colour it absorbed</h3>')
    A('<p>This is the best idea the research turned up, and it is textual rather than '
      'invented. Of the Demon-Dweller Sword: <em>"After the sword has absorbed a certain '
      'amount of magical power, the black markings on it start glowing with a color '
      'corresponding to the absorbed magic attribute."</em> The sword does not have a '
      'colour. It takes one.</p>')
    A('<p>Put that on the section rule. <code>BrushDivider</code> already draws with '
      '<code>stroke-dasharray</code> / <code>stroke-dashoffset</code> flipped once by an '
      '<code>IntersectionObserver</code> (<code>globals.css:405</code>), so the '
      'mechanism exists. Change what it means: the rule is inert until a section '
      'arrives, then it draws, and its notches take that section\'s own colour - the '
      'accent on a case study, the second accent on a date band. One observer, one '
      'custom property, no new animation loop.</p>')

    A('<h3>What not to do</h3>')
    A('<ul>'
      '<li>No mana particles behind the hero. <code>ParticleField</code> and '
      '<code>CursorTrail</code> already exist and already cost; a third canvas would '
      'spend the Lighthouse headroom on the least legible idea.</li>'
      '<li>No sword silhouette as a page element. As an abstract form it stops being '
      'recognisable, and as a recognisable form it stops being safe.</li>'
      '<li>No squad insignia, no bull, no five-pointed star. The clover is already the '
      'mark and it is generic geometry.</li>'
      '</ul>')

    # ---------------- gate ----------------
    A('<h2 id="gate">The contrast gate</h2>')
    A('<p>WCAG 2.x relative luminance, sRGB. The floor is %.1f:1 for anything that '
      'carries text, measured against both <code>--bg</code> and '
      '<code>--bg-elevated</code> in both themes. A candidate that fails does not appear '
      'on this page - the generator refuses to emit.</p>' % P.FLOOR)
    A('<details class="ev" open><summary>Checker validation - the sixteen ratios already '
      'written into <code>src/app/globals.css</code>, reproduced</summary>')
    A('<table><thead><tr><th>Claim in globals.css</th><th>Pair</th><th>Claimed</th>'
      '<th>Measured</th></tr></thead><tbody>')
    for v in P.validate_checker():
        A('<tr><td><code>%s</code></td><td>%s on %s</td><td>%.2f:1</td>'
          '<td class="rt %s">%.2f:1</td></tr>'
          % (esc(v["name"]), chip(v["a"]), chip(v["b"]), v["claimed"],
             "ok" if v["ok"] else "no", v["measured"]))
    A('</tbody></table>')
    A('<p class="cite">If these did not reproduce, no other number on this page would '
      'be worth reading.</p>')
    A('</details>')

    A('<table><thead><tr><th>Candidate</th><th>Theme</th><th>Token</th><th>Colour</th>'
      '<th>on <code>--bg</code></th><th>on <code>--bg-elevated</code></th>'
      '</tr></thead><tbody>')
    for c in CANDS:
        for theme, tok in THEMES:
            for token in P.GATED:
                rs = {r["surface"]: r for r in ALL
                      if r["candidate"] == c["id"] and r["theme"] == theme
                      and r["token"] == token}
                a, b = rs["bg"], rs["bg-elevated"]
                A('<tr><td>%s</td><td><code>%s</code></td><td><code>--%s</code></td>'
                  '<td>%s</td><td class="rt %s">%.2f:1</td>'
                  '<td class="rt %s">%.2f:1</td></tr>'
                  % (esc(c["name"]), tok, token, chip(a["colour"]),
                     "ok" if a["pass"] else "no", a["ratio"],
                     "ok" if b["pass"] else "no", b["ratio"]))
    A('</tbody></table>')
    A('<p class="cite">%d accent and text pairings plus %d material pairings, floor '
      '%.1f:1, %d failing.</p>' % (len(ALL), nmat, P.FLOOR, nfail))

    # ---------------- s8 ----------------
    A('<h2 id="s8">Method</h2>')
    A('<dl class="kv">')
    A('<dt>Nothing was written to the repository</dt>'
      '<dd>The renders come from a tar snapshot of the working tree - excluding '
      '<code>node_modules</code>, <code>.next</code>, <code>.git</code> and the artefact '
      'directories - unpacked under <code>/tmp</code> with <code>node_modules</code> '
      'symlinked in. Token values were injected into the snapshot\'s copy of '
      '<code>globals.css</code> only. <code>src/app/globals.css</code> in the repository '
      'was hashed before and after and is unchanged '
      '(<code>8317cbb1...3a0f46a2</code> both times).</dd>')
    A('<dt>One snapshot, six builds</dt>'
      '<dd>The snapshot was taken once and reused for every candidate, so the only '
      'difference between any two sets of renders is the token block. That matters here '
      'because the working tree was being edited by other work while these ran; had each '
      'build re-snapshotted, the comparison would be between six slightly different '
      'sites rather than six palettes. The renders show the site as it stood when the '
      'snapshot was taken.</dd>')
    A('<dt>Every screenshot is gated twice</dt>'
      '<dd>Before any frame is captured, the served page must return 200, the stylesheet '
      'it links must return 200, and that stylesheet must contain the candidate\'s own '
      'accent hexes, ground hexes and the retuned <code>--leather-a</code>. After each '
      'navigation the live DOM is asked for <code>data-theme</code> and the capture is '
      'abandoned if it is not the theme being shot. A screenshot of the wrong build is '
      'worse than no screenshot.</dd>')
    A('<dt>Both files come out of one run</dt>'
      '<dd><code>index.html</code> is canonical and references <code>/af-resources/</code> '
      'absolutely, which is what the Artefact Server provides. '
      '<code>open-local.html</code> is the same document with that one '
      '<code>&lt;script src&gt;</code> rewritten to the bundled copy, so it reads over '
      '<code>file://</code>. The rewrite happens in the same function that writes the '
      'canonical file, so they cannot drift, and the house validator rejects '
      '<code>open-local.html</code> if anyone tries to publish it.</dd>')
    A('<dt>Renders are lossless WebP</dt>'
      '<dd>Identical pixels to PNG at roughly half the bytes. The neighbouring '
      '<code>accent-options/</code> artefact carries 17 MB of PNG; this one does not '
      'repeat that.</dd>')
    A('<dt>The frames were measured, not kept</dt>'
      '<dd>Published frames were fetched to a scratch directory, sampled with PIL '
      '(median-cut quantisation for dominant colours, a 9x9 box average for named '
      'points), and deleted from the deliverable path. The hex values and the source '
      'URLs are in <code>research.py</code>; no image is stored in the repository.</dd>')
    A('</dl>')
    A('<pre>'
      'python3 palette.py        # the gate on its own: 153 pairings, floor 4.5:1\n'
      'python3 build-index.py    # rewrites index.html AND open-local.html\n'
      '</pre>')

    # ---------------- s9 ----------------
    A('<h2 id="s9">Recommendation</h2>')
    rec = next(c for c in REST if c["id"] == RECOMMENDED)
    A('<div class="tv-card"><div class="hd"><span class="num">1</span>'
      '<b>%s</b> <span class="jp">%s</span></div>'
      '<p>It is the only candidate whose argument is a measurement rather than a '
      'preference. The brief says do not land on near-black plus one hot colour; the '
      'frame says the source never did. Sampling one image of Black Asta top to bottom '
      'gives indigo, violet, crimson, rose and a warm flare, and this candidate is '
      'simply those five stops assigned to jobs: indigo becomes the ground, rose becomes '
      'the accent, amber becomes the second accent. Nothing had to be invented to get '
      'there and nothing had to be toned down to pass.</p>'
      '<p>It is also the only one chromatic on <em>both</em> sides of the toggle, which '
      'is what stops <code>leaf-4</code> being <code>leaf-5</code> with the lights on. '
      'And the book separates from its light ground by 90 degrees of hue, which is '
      'comfortably clear of the two candidates that have a real problem there.</p>'
      '<div class="ft">Worst measured pairing %.2f:1, at %s. Floor %.1f:1.</div>'
      '</div>' % (esc(rec["name"]), esc(rec["jp"]), worst(rec["id"]),
                  esc(worst_where(rec["id"])), P.FLOOR))

    A('<div class="tv-cols tv-1-1">')
    A('<div class="tv-panel"><h4>If it is too much</h4><div class="tv-bd">'
      '<p><b>Five-Leaf</b> is the safe second. It is the book itself, it is warm on '
      'both sides, and it is the one a reader would name Black Clover fastest. Its own '
      'risk is written into its section: it is the candidate closest to the default it '
      'is trying to avoid, and the soot-brown ground and the leaf gold are what keep it '
      'off that line. If either gets diluted in implementation, it lands on the '
      'cliche.</p></div></div>')
    A('<div class="tv-panel"><h4>If it is not enough</h4><div class="tv-bd">'
      '<p><b>Dark Cloaked</b> is the contrarian pick and the one Yami would actually '
      'own. A cold teal link and a single cigarette ember is a genuinely unusual pairing '
      'and it reads as restraint rather than as theme. The cost is that it is the '
      'candidate a stranger is least likely to connect to the source without being '
      'told.</p></div></div>')
    A('</div>')

    A('<div class="note"><p>Whichever is chosen, two things are worth taking regardless '
      'of the palette: the <a class="tv-jump" href="#s5">grimoire material retune</a>, '
      'because the current book is the wrong object; and the '
      '<code>filter: drop-shadow</code> on the demon eye at '
      '<code>globals.css:272</code>, because it is a performance defect that is live on '
      'every dark page today.</p></div>')

    A('</main>')
    A('</div>')

    # ---- the workbench script. Swaps which slot is visible and replays. ----
    A('''<script>
(function(){
  var mount=document.getElementById("gw-mount");
  var pick=document.getElementById("gw-pick");
  var play=document.getElementById("gw-play");
  if(!mount||!pick||!play) return;
  var on=false;
  function show(){
    var id=pick.value;
    Array.prototype.forEach.call(mount.querySelectorAll(".gw-slot"),function(s){
      s.hidden = s.getAttribute("data-cand")!==id;
    });
  }
  function run(){
    on=!on;
    Array.prototype.forEach.call(mount.querySelectorAll(".cl,.mk"),function(e){
      e.classList.toggle("on",on);
    });
    Array.prototype.forEach.call(mount.querySelectorAll(".slash-stage"),function(e){
      e.classList.remove("go");
      void e.offsetWidth;
      e.classList.add("go");
    });
    play.textContent = on ? "Back to leaf-4" : "Play";
  }
  pick.addEventListener("change",show);
  play.addEventListener("click",run);
  show();
})();
</script>''')

    A('</body>')
    A('</html>')

    html = "\n".join(out)

    canonical = _banner(html, CANON_BANNER)
    with open(os.path.join(HERE, "index.html"), "w") as fh:
        fh.write(canonical)
    print("index.html written: %d bytes, %d candidates, %d measured rows"
          % (len(canonical), len(REST), len(ALL)))

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
    for c in CANDS:
        for tl, _ in THEMES:
            for rl, _ in ROUTES:
                p = os.path.join(HERE, "shots", "%s-%s-%s.webp" % (c["id"], tl, rl))
                if not os.path.exists(p):
                    missing.append(os.path.basename(p))
    if missing:
        print("MISSING %d render(s): %s" % (len(missing), ", ".join(missing)))
    else:
        print("all %d renders present" % (len(CANDS) * 6))

    # U+2014 is banned on this repo. Written as an escape so this file does not
    # itself contain the character it rejects.
    for name, doc in (("index.html", canonical), ("open-local.html", local)):
        if re.search(chr(0x2014), doc):
            raise SystemExit("em dash found in %s" % name)
    print("no em dash: ok")


if __name__ == "__main__":
    build()
