# Colour system v2 — two concepts, one contract

| | |
| --- | --- |
| Status | **Accepted 2026-09-05 as ADR-013.** Stage 1 landed in the design-system step 2 commit; R8 and R9 are in `tokens.test.ts`. Two values moved under measurement: light `--destructive` `0.505 0.2 27` to `0.46 0.185 27` (the soft hover fill at `/20`, which §4 never measured, was 4.07:1; now 4.77), and light `--sidebar` `0.946` to `0.943` (its Oklab distance from the page sat exactly on R8's 0.015 floor). Stage 2 pending a decision on editing generated components (`badge.tsx`, `dialog.tsx`). |
| Date | 2026-09-05 |
| Scope | `packages/design/src/styles/globals.css`, `packages/design/tests/tokens.test.ts`, the components named in §6 |
| Method | Every number below was measured with the same oklch → sRGB → WCAG code as `tokens.test.ts`, plus a gamut check that test does not have. 86 pairs, 0 failures, 0 out-of-gamut declarations. |

---

## 1. What exists today, measured

The palette is **17 achromatic tokens and one red**. Every token in both themes is `oklch(L 0 0)` except `--destructive`. Dark is not a second design; it is the light lightness ladder reflected — `--primary` 0.205 → 0.922, `--background` 1.0 → 0.145, same (absent) hue.

Six findings, each with the line of code that shows it.

**1.1 — Three tokens, one value.** `--secondary`, `--muted` and `--accent` are all `oklch(0.97 0 0)` in light and `oklch(0.269 0 0)` in dark. Perceptual distance between any two: **ΔEok 0.000**.

Consequence, live: `components/app-shell/sidebar-nav.tsx:28-30` draws the current page as `bg-accent` and hover as `hover:bg-muted`. **They are the same colour.** While the pointer rests on any nav item, the screen cannot say which page you are on. R1 cannot see this — contrast checks measure ink against fill, never fill against fill.

**1.2 — No elevation ladder.** In light, `--background`, `--card` and `--popover` are all `oklch(1 0 0)` — ΔEok 0.000, three names for white. In dark, `--card`, `--popover` and `--sidebar` are all `oklch(0.205 0 0)`. Depth is carried entirely by `--border` and `ring-foreground/10`; a dialog floating above a card is separated only by its outline.

**1.3 — No status vocabulary.** `features/members/components/members-table.tsx:68-79` encodes **role** as badge `default|secondary` and **status** as badge `outline|secondary`. The screen is borrowing *shape* variants to mean *state*, because the palette has no state to name. For an operations product — approvals, postings, reconciliations, dunning, stock — this is the load-bearing gap.

**1.4 — `--destructive` has no `-foreground`.** An opaque `bg-destructive` fill has no measured ink, so the components avoid it: `badge.tsx` writes `bg-destructive/10 text-destructive`. The one role that must be unmistakable is the one that cannot be drawn solid.

**1.5 — `--sidebar` has no pair.** R1's auto-rule measures `x-foreground` on `x`; `--sidebar` has no `-foreground`, so **the sidebar is the one surface in the product whose text is never measured**. It reads at 4.5:1 today by inheritance, not by contract.

**1.6 — Both `--destructive` values are outside sRGB.**

| | declared | max chroma at that L, h | per-channel clamp | CSS Color 4 chroma-map |
| --- | --- | --- | --- | --- |
| light | `oklch(0.52 0.245 27.325)` | 0.213 | `#d20000` | `#c60011` |
| dark | `oklch(0.704 0.191 22.216)` | 0.187 | `#ff6467` | `#ff6668` |

`tokens.test.ts` clamps each channel to `[0,1]`; a CSS Color 4 browser gamut-maps by reducing chroma at constant L and h. For light `--destructive` those are **different colours**, and the ink-on-its-own-10%-fill pair measures 4.68 under clamping and 5.10 under mapping. The assertion passes either way, but it is measuring a colour that is not on screen. Inherited from shadcn's default; not previously noticed because nothing looks.

Also present: `dialog.tsx:32` writes `bg-black/10` for the overlay — a raw colour literal, legal only because R3 scans `apps/web` and not `packages/design`.

---

## 2. The proposal, in one sentence

Light and dark stop being one ladder seen from two ends and become **two designs with different physics** — *Ledger*, warm paper where colour is pigment, and *Console*, cool chassis where colour is emission — expressed through the same token names, so no component changes shape and every pair is still measured.

---

## 3. The two concepts

### Ledger — light

An operations register on paper. Reading, checking, reconciling, printing. Neutrals are **warm (hue 85)**; paper is never white, so a card can lift off it. Colour is **pigment**: status tones sit at L 0.48–0.51 with chroma 0.10–0.20 — dark enough to be *text*, not decoration. `--primary` is iron-gall navy, `oklch(0.24 0.075 264)`: authority at arm's length, blue on inspection.

Surfaces ascend toward a white ceiling; recessed regions go **below** the ground.

```
secondary 0.905 ── muted 0.934 ── sidebar 0.946 ── background 0.960 ── card 0.984 ── popover 1.000
    (control)       (recessed)      (margin)          GROUND            (panel)      (floating)
```

### Console — dark

A monitoring surface at night. Watching, triaging, reacting. Neutrals are **cool (hue 264)**, and surfaces gain chroma as they rise — M3's elevation tint, expressed in the token rather than as an overlay. Colour is **emission**: status tones sit at L 0.70–0.81 with chroma held at 0.11–0.18, so a state survives peripheral vision on a wall display. `--primary` is `oklch(0.82 0.09 245)` — a light, not an ink.

Surfaces ascend from a bezel; recessed regions go **above** the ground.

```
sidebar 0.115 ── background 0.155 ── card 0.205 ── popover 0.245 ── muted 0.270 ── secondary 0.300
   (bezel)          GROUND            (panel)      (floating)      (recessed)      (control)
```

### The asymmetries, and why each is load-bearing

| | Ledger (light) | Console (dark) | Why they differ |
| --- | --- | --- | --- |
| neutral hue | 85, warm | 264, cool | Paper is warm; a screen at night should not be. Reflected vs emitted light. |
| recessed strip | **darker** than ground | **lighter** than ground | Ink sinks into paper; on a dark chassis a region is read by gaining light, not by becoming void. |
| sidebar | **lighter** than ground — a margin | **darker** than ground — a bezel | The margin of a page is part of the page; the chassis around a console is not part of the display. |
| `--primary` | L 0.24, reads as ink | L 0.82, reads as emission | On paper authority is weight; on a console it is brightness. |
| elevation | ΔEok 0.016–0.024, ceiling-bound; border and shadow carry it | ΔEok 0.040–0.050; tone carries it | White is a hard ceiling. Darkness is not. |
| status | pigment, L 0.48–0.51 | signal, L 0.70–0.81 | A status must be text on paper and a light on glass. |

These are not two skins. A component that assumed "dark is light inverted" would be wrong in dark about which of `muted` and `background` is lighter — and nothing in the codebase assumes that, because every component names a role.

---

## 4. The role map

Measured against `--background`, `--card`, `--popover` (and `--sidebar` where relevant) in both themes. **Floors: 4.5:1 text, 3:1 boundary.** Full run: 86 pairs, 0 failures.

### Ledger (`:root`)

| token | value | hex | job | tightest measured |
| --- | --- | --- | --- | --- |
| `--background` | `oklch(0.96 0.006 85)` | `#f4f1ed` | the page | — |
| `--foreground` | `oklch(0.175 0.012 85)` | `#13100a` | ink | 16.20 on sidebar |
| `--card` | `oklch(0.984 0.003 85)` | `#fbfaf7` | panel, table container | — |
| `--popover` | `oklch(1 0 0)` | `#ffffff` | menu, dialog, toast | — |
| `--primary` | `oklch(0.24 0.075 264)` | `#0c1c42` | primary action, focus ring | 15.89 pair |
| `--primary-foreground` | `oklch(0.985 0.004 85)` | `#fbfaf7` | ink on primary | — |
| `--secondary` | `oklch(0.905 0.009 85)` | `#e2dfd9` | resting fill of a secondary control | 12.50 pair |
| `--secondary-foreground` | `oklch(0.24 0.075 264)` | `#0c1c42` | ink on secondary | — |
| `--muted` | `oklch(0.934 0.008 85)` | `#ece9e3` | recessed strip: table head, dialog footer | — |
| `--muted-foreground` | `oklch(0.5 0.014 85)` | `#67635a` | secondary copy | **4.94** on muted |
| `--accent` | `oklch(0.925 0.032 264)` | `#dbe7fc` | **selected / transient interaction tint** — cool, so it is never the recessed strip | — |
| `--accent-foreground` | `oklch(0.28 0.09 264)` | `#112555` | ink on accent | 11.84 pair |
| `--destructive` | `oklch(0.505 0.2 27)` | `#bc0e18` | destructive state | **4.94** on own /10 |
| `--destructive-foreground` | `oklch(0.99 0.002 27)` | `#fdfbfb` | ink on solid destructive | 6.33 pair |
| `--success` | `oklch(0.475 0.11 152)` | `#1d6d3c` | posted, approved, in stock | **4.96** on own /10 |
| `--success-foreground` | `oklch(0.99 0.002 152)` | `#fbfcfb` | ink on solid success | 6.16 pair |
| `--warning` | `oklch(0.495 0.1 72)` | `#84570f` | pending, overdue, low stock | **4.91** on own /10 |
| `--warning-foreground` | `oklch(0.99 0.002 72)` | `#fdfbfa` | ink on solid warning | 6.08 pair |
| `--info` *(stage 3)* | `oklch(0.485 0.135 250)` | `#0561a7` | informational notice | 4.99 on own /10 |
| `--sidebar` | `oklch(0.946 0.01 85)` | `#f0ede6` | the margin | — |
| `--sidebar-foreground` | `oklch(0.175 0.012 85)` | `#13100a` | ink in the margin | 16.20 pair |
| `--border` | `oklch(0.888 0.007 85)` | `#dcdad5` | decorative outline-variant | exempt, with reason |
| `--input` | `oklch(0.618 0.015 85)` | `#8a857c` | interactive boundary | **3.01** on sidebar |
| `--ring` | `var(--primary)` | `#0c1c42` | focus indicator, drawn `/50` | **3.22** on background |
| `--scrim` | `oklch(0.175 0.012 85)` | `#13100a` | dialog overlay, drawn `/15` | n/a — not a text ground |

### Console (`.dark`)

| token | value | hex | tightest measured |
| --- | --- | --- | --- |
| `--background` | `oklch(0.155 0.008 264)` | `#0a0c10` | — |
| `--foreground` | `oklch(0.965 0.004 264)` | `#f2f3f6` | 12.32 on secondary |
| `--card` | `oklch(0.205 0.011 264)` | `#15171c` | — |
| `--popover` | `oklch(0.245 0.013 264)` | `#1d2027` | — |
| `--primary` | `oklch(0.82 0.09 245)` | `#92cbfb` | 10.46 pair |
| `--primary-foreground` | `oklch(0.2 0.05 250)` | `#03172c` | — |
| `--secondary` | `oklch(0.3 0.014 264)` | `#2a2e35` | 12.32 pair |
| `--secondary-foreground` | `oklch(0.965 0.004 264)` | `#f2f3f6` | — |
| `--muted` | `oklch(0.27 0.012 264)` | `#23262c` | — |
| `--muted-foreground` | `oklch(0.72 0.016 264)` | `#9fa5af` | **6.07** on muted |
| `--accent` | `oklch(0.325 0.042 264)` | `#29344a` | — |
| `--accent-foreground` | `oklch(0.965 0.004 264)` | `#f2f3f6` | 11.28 pair |
| `--destructive` | `oklch(0.704 0.18 22)` | `#fc696b` | **5.25** on own /20 |
| `--destructive-foreground` | `oklch(0.18 0.045 22)` | `#220808` | 6.65 pair |
| `--success` | `oklch(0.77 0.15 155)` | `#56d089` | 6.93 on own /20 |
| `--success-foreground` | `oklch(0.18 0.045 155)` | `#001708` | 9.55 pair |
| `--warning` | `oklch(0.81 0.14 78)` | `#f2b54a` | 7.26 on own /20 |
| `--warning-foreground` | `oklch(0.18 0.045 78)` | `#1c0e00` | 10.28 pair |
| `--info` *(stage 3)* | `oklch(0.79 0.11 240)` | `#75c4fa` | 7.02 on own /20 |
| `--sidebar` | `oklch(0.115 0.009 264)` | `#040508` | — |
| `--sidebar-foreground` | `oklch(0.95 0.004 264)` | `#edeef1` | 17.61 pair |
| `--border` | `oklch(0.98 0.006 264 / 13%)` | — | exempt, with reason |
| `--input` | `oklch(0.98 0.006 264 / 42%)` | — | **3.83** on popover |
| `--ring` | `var(--primary)` | `#92cbfb` | **3.40** on popover |
| `--scrim` | `oklch(0.08 0.012 264)` | `#010204` | n/a |

### Separation — the numbers behind §1.1 and §1.2

ΔEok is perceptual distance in Oklab. It sees a hue-only difference, which a luminance contrast ratio cannot.

| adjacency | today | proposed light | proposed dark |
| --- | --- | --- | --- |
| `accent` vs `muted` — *selected vs hovered nav* | **0.000** | 0.041 | 0.063 |
| `accent` vs `secondary` | **0.000** | 0.046 | 0.038 |
| `secondary` vs `muted` | **0.000** | 0.029 | 0.030 |
| `card` vs `background` | 0.000 light / 0.060 dark | 0.024 | 0.050 |
| `popover` vs `card` | **0.000** | 0.016 | 0.040 |
| `sidebar` vs `background` | 0.015 light / 0.060 dark | 0.015 | 0.040 |

`popover` vs `card` at 0.016 in light is the weakest number here, and it is a ceiling problem rather than an oversight: white bounds the ladder from above. In Ledger a floating sheet is separated by its ring and shadow with tone assisting; in Console tone does the work alone. That asymmetry is stated as a limitation, not papered over.

---

## 5. What we take from M3, and what we decline

**Taken.** Container / on-container as the `x` + `x-foreground` pair (already the house rule). Surface elevation as a tonal ladder — three rungs plus one recessed fill. Elevation tint, as chroma gain in the dark surface tokens rather than as an overlay. Outline vs outline-variant, already split three ways here (`--input`, `--ring`, `--border`). Error / warning / success as first-class roles with soft containers. Semantic naming over literal.

**Declined, each with its reason** — ADR-010 deleted twelve consumer-less tokens on 2026-09-05, and R4 would delete these too.

| M3 feature | Cost | Why not |
| --- | --- | --- |
| **Fixed accent colours** (`*-fixed`, `*-fixed-dim`, `on-*-fixed`, `on-*-fixed-variant`) | 12 tokens | They exist so a brand element survives the theme switch. This proposal's thesis is that the two themes are *different concepts*; a token defined as "does not change" contradicts it. There is also no brand banner to put one on. |
| **Five surface containers** (`lowest`…`highest`) | 2 extra tokens | Three rungs have consumers (ground, panel, floating) and one recessed fill has one. The other two do not. Revisit when a screen nests a panel inside a panel inside a dialog. |
| **State layers** (hover 8%, focus 12%, pressed 12% of on-surface) | a grammar change | Already declined in ADR-010/R6 in favour of role-fill-at-alpha (`hover:bg-primary/80`). Unchanged here. |
| **Three contrast levels** (standard / medium / high) | ~50 tokens + a switch | Real accessibility value, and the only declined item we expect to want. It needs a preference source, a persistence story and a second full measurement pass. Stage 3, trigger below. |
| **Tonal palettes as tokens** (5 × 13 tones) | 65 tokens | The tonal palette is the *derivation*, not the interface. Publishing 65 tones is the manifest-and-generator ADR-010 rejected. The derivation lives in this document — §3 states the two lightness ladders and the two hue families, §4 states every resulting value. |
| **Tertiary** | 4–8 tokens | M3's third accent is for expressive branding. This product has no expressive surface, and `--accent` here does a different job (interaction tint). |
| **`--chart-*`** | 5+ tokens | Deleted 2026-09-05 for having no consumer. Returns with the first chart — derivation in §7. |

---

## 6. Staging — a token arrives with its consumer

### Stage 1 — re-value only. **No new tokens.**

Change values in `:root` and `.dark`. R4 is untouched (no new projections), R3 is untouched (no call site changes), R1 re-measures automatically. This is the *entire* two-concept change: warm and cool neutrals, the split of `secondary` / `muted` / `accent`, the elevation ladder, a primary with a hue. It closes §1.1 and §1.2 at zero structural cost.

### Stage 2 — tokens, each in the commit with its consumer

| token | consumer, same commit |
| --- | --- |
| `--destructive-foreground` | `button.tsx` and `badge.tsx` gain a solid destructive variant; §1.4 closes |
| `--success`, `--success-foreground` | `badge.tsx` `success` variant → `members-table.tsx` stops encoding status as `outline` |
| `--warning`, `--warning-foreground` | `badge.tsx` `warning` variant → that table's non-active statuses |
| `--sidebar-foreground` | `app-shell.tsx` / `sidebar-nav.tsx` name their ink; §1.5 closes and R1 starts measuring it |
| `--scrim` | `dialog.tsx:32` `bg-black/10` → `bg-scrim/15`; the last colour literal in the design package |

Each needs its `@theme inline` entry too: `--color-destructive-foreground`, `--color-success`, `--color-success-foreground`, `--color-warning`, `--color-warning-foreground`, `--color-sidebar-foreground`, `--color-scrim`. CSS only — no package `exports` or `paths` change.

### Stage 3 — deferred, each with a stated trigger

| token | trigger |
| --- | --- |
| `--info`, `--info-foreground` | the first informational notice or banner |
| `--chart-1..n` | the first chart |
| inverse surface pair | when a toast or tooltip needs to invert against its ground |
| contrast levels | a user asks, or `prefers-contrast` gets a consumer |

---

## 7. Two checks this proposal adds

Both follow the house pattern: read the CSS as text, prove themselves on a planted defect in the same file.

**R8 — adjacent surfaces and interaction fills must be tellable apart.** ΔEok ≥ 0.015 between every declared adjacency (`accent`/`muted`, `accent`/`secondary`, `secondary`/`muted`, `card`/`background`, `popover`/`card`, `sidebar`/`background`), in both themes. Oklab distance, not luminance contrast, because the light `accent` / `muted` pair separates by hue at nearly equal lightness and a contrast ratio is blind to that. Planted defect: set `--accent` to `--muted`'s value — today's palette, which the check must reject.

This converts §1.1 from an aesthetic observation into an invariant. R1 measures ink against fill and is structurally unable to see fill against fill. It is also the check that makes "two dashboards, no drift" testable for colour: a second screen that reaches for a fill because it *looked* different fails here rather than in review.

**R9 — every declared oklch must be inside sRGB.** Binary-search the maximum in-gamut chroma at the declared L and h; fail when the declaration exceeds it. Planted defect: `oklch(0.82 0.11 245)` — the dark `--primary` this proposal first tried, before measurement moved it to 0.09. Today's palette fails R9 twice (§1.6); every value in §4 passes.

Chart derivation, for when Stage 3 arrives: categorical hues stepped around the wheel from `--primary`, held at the theme's status lightness band (Ledger 0.48–0.51, Console 0.70–0.81) so a series reads as pigment on paper and as signal on glass — each measured against its own ground and against its neighbours under R8.

---

## 8. Open questions for the decision

1. **Does `--ring` stay an alias of `--primary`?** It must, while the focus ring keeps base-nova's `/50` alpha: a half-transparent ring only clears 3:1 when its base is far from the ground, which pins `--primary` dark in Ledger (L ≤ ~0.25) and bright in Console (L ≥ ~0.80). Those two constraints produced the ink-navy and the emitted blue above — so the alias is doing design work, not just saving a token. Breaking it would let `--primary` sit mid-scale: a different, more colourful product.
2. **Is warm paper right for this product?** `#f4f1ed` is a decision about long reading sessions and glare, and it is the most visible single change. The alternative is a neutral `oklch(0.96 0 0)`, which keeps the elevation ladder and the `accent` / `muted` fix and drops only the concept.
3. **Does the light `popover` / `card` gap of ΔEok 0.016 need shadow work?** It is at the ceiling of what tone alone can do.
4. **Contrast levels — worth ~50 tokens?** The only declined M3 feature with real user value.

---

## 9. Appendix — stage 1, ready to paste

Values only. No `@theme inline` change, no new token, no call site touched. Stage 2's additions are commented out below so the diff that adds them also shows the consumer it arrives with.

```css
:root {
  /* Ledger — warm paper (hue 85). Colour is pigment. */
  --background: oklch(0.96 0.006 85);
  --foreground: oklch(0.175 0.012 85);
  --card: oklch(0.984 0.003 85);
  --card-foreground: oklch(0.175 0.012 85);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.175 0.012 85);
  /* Iron-gall navy: reads as authority at arm's length, blue on inspection.
     L is pinned ≤ 0.25 by the focus ring — ring-ring/50 clears 3:1 only
     when its base is far from the ground. */
  --primary: oklch(0.24 0.075 264);
  --primary-foreground: oklch(0.985 0.004 85);
  --secondary: oklch(0.905 0.009 85);
  --secondary-foreground: oklch(0.24 0.075 264);
  /* muted is the recessed strip and sits BELOW the ground; accent is the
     selected/transient tint and is cool, so the two can never be read as
     one grey again (they were, until this change: ΔEok 0.000). */
  --muted: oklch(0.934 0.008 85);
  --muted-foreground: oklch(0.5 0.014 85);
  --accent: oklch(0.925 0.032 264);
  --accent-foreground: oklch(0.28 0.09 264);
  /* Chroma 0.20, not shadcn's 0.245: 0.213 is the sRGB ceiling at this
     L and h, and the declared value must be the rendered one. */
  --destructive: oklch(0.505 0.2 27);
  --border: oklch(0.888 0.007 85);
  --input: oklch(0.618 0.015 85);
  --ring: var(--primary);
  --radius: 0.625rem;
  --sidebar: oklch(0.946 0.01 85);

  /* stage 2 — each lands with its consumer
  --destructive-foreground: oklch(0.99 0.002 27);
  --success: oklch(0.475 0.11 152);
  --success-foreground: oklch(0.99 0.002 152);
  --warning: oklch(0.495 0.1 72);
  --warning-foreground: oklch(0.99 0.002 72);
  --sidebar-foreground: oklch(0.175 0.012 85);
  --scrim: oklch(0.175 0.012 85);
  */
}

.dark {
  /* Console — cool chassis (hue 264). Colour is emission, and surfaces
     gain chroma as they rise (M3's elevation tint, in the token). */
  --background: oklch(0.155 0.008 264);
  --foreground: oklch(0.965 0.004 264);
  --card: oklch(0.205 0.011 264);
  --card-foreground: oklch(0.965 0.004 264);
  --popover: oklch(0.245 0.013 264);
  --popover-foreground: oklch(0.965 0.004 264);
  /* L is pinned ≥ 0.80 by the same /50 ring, from the other direction. */
  --primary: oklch(0.82 0.09 245);
  --primary-foreground: oklch(0.2 0.05 250);
  --secondary: oklch(0.3 0.014 264);
  --secondary-foreground: oklch(0.965 0.004 264);
  /* Here muted sits ABOVE the ground: on a dark chassis a region is read
     by gaining light, not by becoming void. The inverse of :root, on purpose. */
  --muted: oklch(0.27 0.012 264);
  --muted-foreground: oklch(0.72 0.016 264);
  --accent: oklch(0.325 0.042 264);
  --accent-foreground: oklch(0.965 0.004 264);
  --destructive: oklch(0.704 0.18 22);
  --border: oklch(0.98 0.006 264 / 13%);
  --input: oklch(0.98 0.006 264 / 42%);
  --ring: var(--primary);
  /* The sidebar is DARKER than the ground here — a bezel, not a margin. */
  --sidebar: oklch(0.115 0.009 264);

  /* stage 2 — each lands with its consumer
  --destructive-foreground: oklch(0.18 0.045 22);
  --success: oklch(0.77 0.15 155);
  --success-foreground: oklch(0.18 0.045 155);
  --warning: oklch(0.81 0.14 78);
  --warning-foreground: oklch(0.18 0.045 78);
  --sidebar-foreground: oklch(0.95 0.004 264);
  --scrim: oklch(0.08 0.012 264);
  */
}
```
