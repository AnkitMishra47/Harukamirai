# Clover Toggle Spec — `harukamirai.engineer`

A theme toggle that swaps between two committed aesthetics:

- **`leaf-4`** (default) — clean manga-page light theme. Magic Knight green accent on cream paper.
- **`leaf-5`** — anti-magic dark theme. Bone-white text on near-black, anti-magic red accent.

The 5th leaf draws onto the clover icon with a slight overshoot when activated. Toggle persists per-visitor. Respects `prefers-reduced-motion` and `prefers-color-scheme`.

---

## 1. File structure

```
src/
  components/
    CloverToggle/
      CloverToggle.tsx           // or .ts for Angular
      clover.svg.ts              // SVG path constants
      clover-toggle.css          // scoped styles
  styles/
    theme.css                    // CSS variables for both themes
    theme-init.ts                // pre-paint script (inlined in <head>)
```

For Angular: `clover-toggle.component.ts` + `.html` + `.scss`. Same logic.

---

## 2. CSS variables — `theme.css`

```css
/* Default (leaf-4) — applied if no data-theme attr is set */
:root,
[data-theme="leaf-4"] {
  /* Surface */
  --bg:              #f4efe3;     /* manga paper */
  --bg-elevated:     #fbf8f0;
  --bg-inset:        #ebe5d4;

  /* Text */
  --text:            #14110d;     /* deep ink */
  --text-muted:      #6b6358;
  --text-subtle:     #948b7d;

  /* Accent — Magic Knight green */
  --accent:          #2c5840;
  --accent-hover:    #3a7152;
  --accent-glow:     rgba(44, 88, 64, 0.18);

  /* Structure */
  --border:          #d8d0bc;
  --border-strong:   #b8ad94;

  /* Clover icon */
  --clover-leaf:     #2c5840;
  --clover-stem:     #4a3d2a;
  --clover-fifth:    transparent;
  --fifth-opacity:   0;
  --fifth-scale:     0;
  --fifth-rotate:    -20deg;
}

/* Anti-magic (leaf-5) */
[data-theme="leaf-5"] {
  --bg:              #0a0907;     /* warm near-black, not OLED-pure */
  --bg-elevated:     #14110d;
  --bg-inset:        #050403;

  --text:            #f0ebde;     /* bone */
  --text-muted:      #8a8275;
  --text-subtle:     #5a544a;

  --accent:          #c8102e;     /* anti-magic red */
  --accent-hover:    #e02745;
  --accent-glow:     rgba(200, 16, 46, 0.40);

  --border:          #2a2520;
  --border-strong:   #4a4138;

  --clover-leaf:     #1a1814;     /* near-invisible against bg, deliberate */
  --clover-stem:     #1a1814;
  --clover-fifth:    #c8102e;
  --fifth-opacity:   1;
  --fifth-scale:     1;
  --fifth-rotate:    0deg;
}

/* Page-wide transition — only on theme-affected properties */
html { color-scheme: light; }
[data-theme="leaf-5"] { color-scheme: dark; }

body {
  background: var(--bg);
  color: var(--text);
  transition:
    background-color 280ms cubic-bezier(0.4, 0, 0.2, 1),
    color           280ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Reduced motion — instant swap, no theatrics */
@media (prefers-reduced-motion: reduce) {
  body,
  .clover-icon .leaf-fifth {
    transition: none !important;
  }
}
```

---

## 3. SVG — `clover.svg.ts`

Single inline SVG, rendered inside the `<button>`. ViewBox `0 0 100 100`, center at `50,50`. Four heart-leaves arranged at 0/90/180/270°. Fifth leaf is a separate jagged path, hidden in `leaf-4` state.

```html
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
     class="clover-icon" aria-hidden="true" focusable="false">

  <!-- Stem -->
  <path class="stem"
        d="M 50 60 Q 48 72 50 82 Q 52 72 50 60 Z" />

  <!-- 4 leaves (heart shape pointing outward, rotated around center) -->
  <g class="leaves">
    <path class="leaf"
          d="M 50 50 C 36 38, 32 18, 50 22 C 68 18, 64 38, 50 50 Z" />
    <path class="leaf"
          d="M 50 50 C 62 36, 82 32, 78 50 C 82 68, 62 64, 50 50 Z" />
    <path class="leaf"
          d="M 50 50 C 64 62, 68 82, 50 78 C 32 82, 36 62, 50 50 Z" />
    <path class="leaf"
          d="M 50 50 C 38 64, 18 68, 22 50 C 18 32, 38 36, 50 50 Z" />
  </g>

  <!-- 5th leaf — jagged, top-left, demonic. Hidden by default. -->
  <path class="leaf-fifth"
        d="M 50 50 L 34 30 L 28 14 L 40 20 L 36 6 L 48 16 L 50 50 Z" />
</svg>
```

### SVG styling

```css
.clover-icon { width: 28px; height: 28px; display: block; }

.clover-icon .leaf  { fill: var(--clover-leaf); }
.clover-icon .stem  { fill: var(--clover-stem); }

.clover-icon .leaf-fifth {
  fill: var(--clover-fifth);
  opacity: var(--fifth-opacity);
  transform: scale(var(--fifth-scale)) rotate(var(--fifth-rotate));
  transform-origin: 50px 50px;
  transform-box: fill-box;
  transition:
    opacity 220ms cubic-bezier(0.4, 0, 0.2, 1),
    transform 380ms cubic-bezier(0.34, 1.56, 0.64, 1); /* slight overshoot */
}

/* Subtle red glow on the toggle button when in leaf-5 */
.clover-toggle[aria-pressed="true"] {
  box-shadow: 0 0 0 1px var(--accent-glow), 0 4px 18px var(--accent-glow);
}
```

The `cubic-bezier(0.34, 1.56, 0.64, 1)` is the key tactile detail — the 5th leaf "snaps" into place with a tiny overshoot, like it was always there waiting to manifest.

---

## 4. Toggle button — markup + behavior

```html
<button
  type="button"
  class="clover-toggle"
  aria-label="Toggle anti-magic theme"
  aria-pressed="false"
  data-clover-toggle>
  <!-- SVG from §3 -->
</button>
```

```css
.clover-toggle {
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: border-color 200ms, box-shadow 280ms, background 200ms;
}
.clover-toggle:hover { border-color: var(--accent); }
.clover-toggle:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

---

## 5. Theme logic — vanilla TypeScript

```ts
// theme-init.ts — INLINE THIS in <head> as a <script> to prevent FOUC
export const initTheme = `
(function() {
  try {
    var stored = localStorage.getItem('hm-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'leaf-5' : 'leaf-4');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'leaf-4');
  }
})();
`;
```

```ts
// clover-toggle.ts — toggle behavior
const STORAGE_KEY = 'hm-theme';
const THEMES = { four: 'leaf-4', five: 'leaf-5' } as const;
type Theme = typeof THEMES[keyof typeof THEMES];

export function getCurrentTheme(): Theme {
  const t = document.documentElement.getAttribute('data-theme');
  return t === THEMES.five ? THEMES.five : THEMES.four;
}

export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  // Sync aria-pressed on all toggle buttons
  document.querySelectorAll<HTMLButtonElement>('[data-clover-toggle]')
    .forEach(btn => btn.setAttribute('aria-pressed', String(theme === THEMES.five)));
}

export function toggleTheme(): void {
  const next = getCurrentTheme() === THEMES.four ? THEMES.five : THEMES.four;
  const apply = () => setTheme(next);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Use View Transitions API for native crossfade where supported
  if (!reduced && (document as any).startViewTransition) {
    (document as any).startViewTransition(apply);
  } else {
    apply();
  }
}

// Wire it up
document.querySelectorAll<HTMLButtonElement>('[data-clover-toggle]').forEach(btn => {
  btn.setAttribute('aria-pressed', String(getCurrentTheme() === THEMES.five));
  btn.addEventListener('click', toggleTheme);
});
```

---

## 6. Angular adapter

```ts
// clover-toggle.component.ts
import { Component, OnInit, HostBinding, signal } from '@angular/core';

type Theme = 'leaf-4' | 'leaf-5';
const STORAGE_KEY = 'hm-theme';

@Component({
  selector: 'app-clover-toggle',
  standalone: true,
  templateUrl: './clover-toggle.component.html',
  styleUrl: './clover-toggle.component.scss',
})
export class CloverToggleComponent implements OnInit {
  theme = signal<Theme>('leaf-4');

  ngOnInit() {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = stored ?? (prefersDark ? 'leaf-5' : 'leaf-4');
    this.applyTheme(initial);
  }

  toggle() {
    const next: Theme = this.theme() === 'leaf-4' ? 'leaf-5' : 'leaf-4';
    const apply = () => this.applyTheme(next);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const vt = (document as any).startViewTransition;
    if (!reduced && vt) vt.call(document, apply);
    else apply();
  }

  private applyTheme(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(STORAGE_KEY, t);
    this.theme.set(t);
  }
}
```

```html
<!-- clover-toggle.component.html -->
<button type="button"
        class="clover-toggle"
        [attr.aria-pressed]="theme() === 'leaf-5'"
        aria-label="Toggle anti-magic theme"
        (click)="toggle()">
  <!-- Inline SVG from §3 -->
</button>
```

For SSR (Angular Universal): guard `localStorage` and `matchMedia` with `isPlatformBrowser`. Run the inline pre-paint script (§5) via `index.html` `<head>` regardless of framework — it must execute before the framework hydrates.

---

## 7. Optional: View Transitions API polish

When supported, `document.startViewTransition` cross-fades the entire page automatically. Add this to make the crossfade snappier than the browser default:

```css
@supports (view-transition-name: none) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 320ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
}
```

---

## 8. Typography note (separate, but pairs with this toggle)

The skill brief warned against generic fonts. For this portfolio, suggested pairing:

- **Display**: `Cormorant Garamond` (elegant serif for hero) or `Fraunces` (variable serif with optical sizing) — both feel literary, manga-frontispiece-adjacent
- **Body**: `Manrope` or `Geist` for prose, or stick with `Söhne`/`General Sans` if licensed
- **Mono** (code blocks, terminal aesthetic): `JetBrains Mono` or `Berkeley Mono`

Avoid: Inter, Roboto, Space Grotesk (default AI-portfolio fonts).

For the manga aesthetic specifically: `Shippori Mincho` (Google Fonts) for any Japanese characters or stylized headings — it's a real Japanese serif with character.

---

## 9. Acceptance checklist

- [ ] No flash on initial load — theme attribute set before first paint
- [ ] Toggle persists across page reloads via `localStorage`
- [ ] First-visit default respects `prefers-color-scheme`
- [ ] `prefers-reduced-motion: reduce` → instant swap, no animation
- [ ] Button is a real `<button>` with `aria-label` and `aria-pressed`
- [ ] Focus ring visible (`:focus-visible`)
- [ ] Lighthouse contrast passes AA in both themes
- [ ] No layout shift between themes (identical type metrics, identical spacing)
- [ ] View Transitions API used where supported, falls back gracefully
- [ ] Works without JS in `leaf-4` state (default attribute, content readable)

---

## 10. Future hooks (not v1)

Reserve these CSS variables now so the rest of the site can theme freely:

```css
--shadow-sm, --shadow-md, --shadow-lg
--radius-sm, --radius-md, --radius-lg
--font-display, --font-body, --font-mono
--space-1 ... --space-12
```

Define them once per theme, reference everywhere. The toggle becomes the single source of aesthetic truth for the whole site.
