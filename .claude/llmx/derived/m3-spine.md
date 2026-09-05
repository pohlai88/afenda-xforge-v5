I verified every finding against the tree and the corpus before revising. Here is the result.

---

# The Material 3 Commitment

**The principle spine for afenda-xForge-v4. Design concept layer.**

Status: proposal for freeze. Written 2026-09-04 against the M3 corpus at `.claude/llmx/m3/` (104 markdown files, sources dated 2025-05-09 to 2026-09-01) and the design system at `packages/design/`.

---

## 0. How to read this

This document decides **what M3 means for us**. It does not decide how a component is built (that is Base UI plus `packages/design/src/components`) and it does not decide how conformance is policed (that is the policy modules, the manifest, and the token schema). Where a decision hands over to one of those layers, the seam is named.

**The seams, named once.**

- `packages/design/policy/tokens.json` — every design value (Rule 3).
- `packages/design/policy/foundations/*.mjs` — the role tables and their checks.
- `packages/design/policy/interaction/*.mjs` — states, focus, keyboard, assistive technology, the accessibility floors.
- `packages/design/policy/foundations/style.mjs` → `generated/style.ts`, `generated/style-manifest.json` — **the seam where a colour role becomes a component-facing word.** `STYLE_NAMES` renames every root on the way out: `primary` → `accent.primary`, `on-surface` → `ink.onSurface`, `statutory-container` → `status.statutory`. See §2.12; this is a deliberate anti-corruption layer, and it is the one place §1's first commitment is restated in a second vocabulary.

Two labels are used throughout:

- **VERIFIED** — cited to a file and a section. M3 claims cite the corpus file and its heading; v4 claims cite the repository file and its export or section. Every v4 claim in this document was read from disk during this pass, and every count in it was derived by executing the module rather than transcribed. M3 claims were read from the corpus file named on the row.
- **ASSUMED** — my judgement, a product inference, or a claim about our future that no file states. Every disposition in Section 2 rests on VERIFIED facts, but the disposition itself is a decision, not a fact.

**Do not read a `--` in the M3 column of a table as "M3 has no opinion."** It means M3 publishes no number. Section 4 lists the places where that absence is the whole finding.

**A note on provenance.** Strings of the form `ADR-034`, `E37` and `E41` appear inside the policy modules and inside `generated/FOUNDATIONS.md`. They are inherited citations from the predecessor repository. **This tree has no `.architecture/` directory, no ADRs and no evidence register** — v4's CLAUDE.md Rule 6 says so explicitly — so those strings name a source that cannot be opened here. Where this document needs a governance reference it cites v4's own six Rules by number, and nothing else. The regeneration check this document leans on is **Rule 4**, not the predecessor's "law 27".

---

## 1. What adopting M3 commits us to

### The six commitments

**1. Colour is assigned by role, never by value.** Every element references a semantically named role — `primary`, `on-primary`, `primary-container` — and never a hex or a palette tone. M3 states the reason plainly: a raw value "will break with light and dark themes, contrast control, and other features" (VERIFIED: `advanced.md` §Apply colors → Map or remap colors → Best practices). Roles come in guaranteed pairs: an `on-X` ink on an `X` fill, an `on-X-container` ink on an `X-container` fill. Only the `on-` prefix carries a contrast guarantee; every other pairing is unmeasured until someone measures it (VERIFIED: same section). Legibility becomes a property of the role graph rather than of each individual decision.

**2. The type scale is five families at three steps, and no product ships all fifteen.** Display, headline, title, body, label, each at large/medium/small, anchored on a Major Second ratio (1.125) at a 14px base (VERIFIED: `typography.md` §Type scale & tokens → Customizing your type scale). M3's own instruction is to select the styles the product needs and remove the rest. Customisation is permitted at line height and tracking; changing type size is not, because it changes how components reflow.

**3. Shape is a size-based roundedness ladder; elevation is distance, not shadow.** The shape scale is a **size-based** ladder of ten styles whose members are **assigned by desired roundedness** rather than by component size, so one component's shape can be remapped without disturbing its dimensions (VERIFIED: `shape.md` §Corner radius scale, §Customizing shapes → Component changes). Elevation tokens "have no shadows or colour of their own" — they codify z-distance and each platform decides how to draw it. M3's default depth cue is tonal difference between surfaces, not a shadow; this is an explicit break from M2 (VERIFIED: `elevation.md` §Overview → Differences from M2).

**4. Every state carries two visual indicators, and states compose.** A state layer plus a second change — colour, elevation, ripple, or an added indicator such as a focus ring (VERIFIED: `states.md` §Overview). Only one state layer may be applied at a time, though the states themselves combine: hover with focused, selected or pressed. Focus, hover, press and drag are each singular in a layout; disabled is not, because it is a property of the element rather than of an input.

**5. Motion carries meaning through direction and area.** Duration scales with the area a transition covers; exits are shorter than entrances; easing is chosen by the transition's relationship to the screen edge, because ending at peak velocity says "you cannot get this back" and ending at rest says "you can" (VERIFIED: `motion-easing-and-duration.md` §Applying easing and duration). Motion is themed once centrally, never specified per animation.

**6. Accessibility is a default, not a pass.** M3 states it as a core design value and argues it economically: anticipating a range of abilities "prevents costly redesigns, reduces tech and design debt, and conserves resources upfront" (VERIFIED: `overview.md` §Accessibility & Material Design). WCAG minimums are framed as a floor to build on rather than a target to reach. Concretely this means contrast is guaranteed by construction (a tone difference of 40 guarantees 3.0, a difference of 50 guarantees 4.5 — VERIFIED: `material-a-z.md` §Contrast), targets are separate from visual bounds, and density is opt-in and always revertible.

### What M3 is not

**It is not a web implementation, and one is not coming on any published schedule.** This is the single most consequential fact in the corpus. Material Views 1.14.0 is the final stable release and the library "is now entering maintenance mode. It won't get any new features, but will receive critical bug fixes." Supported developer libraries are "Android and Jetpack Compose, with in-progress support being developed for Flutter and Web." The Figma Design Kit and the published guidelines "will continue to reflect the latest of what's available in the Material Compose library" (VERIFIED: `material-is-compose-first.md` §The final Material Views release, §Going Compose-first; `material-a-z.md` §Libraries). Adopting M3 means adopting a specification and a vocabulary. We will build every component ourselves, and future M3 guidance will keep arriving shaped like Compose.

**It is mobile-flavoured in its layouts and authoring order.** M3 instructs designers to "start with mobile and make sure your product's layout and components can scale and adapt seamlessly all the way up to spatial environments" (VERIFIED: `layout-overview.md` §Adaptive design → Designing adaptive experiences). The FAB is the exemplar used to illustrate `primary` and `primary-container`. Compact is treated as the default case. Reachability guidance assumes a held device: the top 25% of a horizontal tablet is "likely out of reach unless the grip is adjusted" (VERIFIED: `breakpoints.md` §Medium → Special considerations). Bottom navigation, bottom sheets, swipe-to-reveal, pull-to-refresh and predictive back are phone idioms with no desktop counterpart.

**Its navigation guidance is the exception, and §2.13 takes it separately.** The navigation rail is explicitly scoped away from phones: "Use navigation rails in medium, expanded, large, or extra-large window sizes" (VERIFIED: `navigation-rail.md` §Overview, first bullet). That is exactly the set of window classes this product lives in. Rejecting M3's navigation wholesale as "mobile-flavoured" would discard the one navigation model M3 publishes for our widths, and would do so while v4 already ships its geometry.

**It is full of Google product conventions that are not design principles.** AP Style and American English. Notification character budgets set by the Android shade (title under 29, collapsed body under 40). SMS limits of 160/134 characters. Emoji tone guidance. TalkBack and Switch Access as the named assistive technologies. Material Theme Builder as the authoring tool. Dynamic colour sourced from the device wallpaper. Number grouping rules that would render an Indonesian salary figure wrong.

**And one thing that is neither.** M3 Expressive "isn't a new version of the system. We're not deprecating M3, and this isn't 'M4'" — it is an opt-in expansion (VERIFIED, quoted verbatim: `building-with-m3-expressive.md`). Everything under that banner is a separate decision, taken separately, in Section 5.

---

## 2. Area by area

### 2.1 Colour — **ADOPT the grammar, ADAPT the floors, REJECT the personalisation**

**M3's decision.** Roles, not palettes, are the unit of assignment. Roles are tokenised. Pairing and layering are the accessibility contract, and improper combinations "may break contrast necessary for visual accessibility, particularly when colours are adjusted through dynamic colour features" (VERIFIED: `color-roles.md` §Tab 1 → General concepts). The accent groups are an emphasis ladder, not three brand colours. Error is static by default even inside a dynamic scheme, because semantic meaning outranks personalisation. Surface hierarchy is tone-based and explicitly not tied to elevation (VERIFIED: `color.md` §Overview → What's new Feb 2023). Extra semantic colours are defined as four-role sets — main, on-main, container, on-container — never as a lone hex (VERIFIED: `advanced.md` §Define new colors → Define static colors).

**Outline and outline-variant are two roles with two jobs, and M3 says which is which.** `outline` is for boundaries that define a target and for important boundaries such as a text-field outline; `outline-variant` is for decorative elements such as dividers, and for boundaries only where other elements already supply 4.5:1 contrast. Four explicit don'ts follow: don't use `outline` for dividers (different contrast requirements); don't use `outline` for containers holding multiple elements, such as cards; don't use `outline-variant` to create visual hierarchy; don't use `outline-variant` to define the visual boundary of a target — use `outline` or another colour at 3:1 against the surface (VERIFIED: `color-roles.md` §Tab 1 → Outline, lines 167–180). In a dense grid this is precisely the cell-boundary versus row-divider decision, and both roles are exposed to component authors as `outline.default` and `outline.variant` (VERIFIED: `policy/foundations/style.mjs`, `STYLE_NAMES`).

**Scope.** Universal, except dynamic colour and harmonisation, which are Android platform features.

**What v4 already encodes.** The entire role grammar (VERIFIED: `packages/design/policy/foundations/color.mjs`, `COLOR_ROLE_POLICIES` header; `generated/FOUNDATIONS.md` §Colour rules). **Forty-five** M3 roles are enumerated with exactly one verdict each — carried, or absent with a written reason — and the generator refuses a root of ours placed against no M3 role (VERIFIED, counted by executing the module: `policy/foundations/pairing.mjs`, `M3_COLOR_ROLES` / `assertColorRolesPlaced`; 45 entries, 17 `ours`, 28 `absent`; `generated/FOUNDATIONS.md` §"Material 3 roles, placed" prints all 45 rows). Forty declared ink-on-fill pairs are computed from the token file and printed with their measured ratio in both themes. `XFORGE_ONLY_ROLES` holds 7 entries; six of them are roots in `COLOR_ROLE_CONTRACTS` (20 roots total) and `on-disabled` is a foreground, so the "root carries no M3 role" loop never reaches it.

**The 45 is a coincidence worth stating rather than hiding.** v4's enumeration is 45 because it walks the roles page; M3's own census on that page is also 45 ("all 45 color roles including ... Inverse roles, Scrim and Shadow roles" — VERIFIED: `color-roles.md` §What are color roles?). `surface-tint` sits outside both, because M3 deprecated it on a different page: "Surface tint color is deprecated. Use elevation level tokens (0–5) instead" (VERIFIED: `elevation.md` §Tokens). See §6.2 and Appendix A2 — this is not a completeness gap.

**Status containers follow the container half of M3's four-role custom-colour shape**, deliberately: `info-container`, `success-container`, `warning-container` and `statutory-container` each ship with their on-colour and **no high-emphasis main fill**, "because nothing has asked for one" (VERIFIED: `pairing.mjs`, `XFORGE_ONLY_ROLES`). `statutory` exists because EPF, SOCSO, EIS and PCB are law rather than advice. Minting the main/on-main halves is a one-file change the day a consumer appears.

**Disposition: ADOPT** the grammar, the pairing law, the container/on/variant naming particles, the emphasis ladder, the static-error rule, the outline/outline-variant division of labour, and the custom-colour four-role shape (taking its container half now). **ADAPT** the floors upward: M3's headline guarantee is 3:1 and it concedes that non-`on` pairs may miss 4.5:1; we hold 4.5:1 for all text and decline WCAG's own disabled-state exemption. **REJECT**, and the reasons are three different reasons, not one:

- **Dynamic colour from wallpaper or content, and harmonisation** — Android platform features with no web equivalent. M3 itself names enterprise products as the reason to choose a static scheme (VERIFIED: `choosing-a-scheme.md` §Tab 1 → Static color).
- **Two schemes on one screen** — a product decision; one scheme is what a payroll register needs.
- **The `fixed` family** — refused on its own grounds, and the repository already states them: "a fixed accent that ignores the theme; M3 warns it is likely to break contrast, and nothing has asked" (VERIFIED: `pairing.mjs`, `primary-fixed-dim`).
- **The `inverse` family** — refused because no inverted surface exists here, not because of any platform: "the inverse roles exist for snackbars; there is no Toast" (VERIFIED: `pairing.mjs`, `inverse-surface`; the two inverse inks are refused as consequences of that). **This one is reversible the moment a toast, a dark tooltip, or an inverted selected-row treatment is specified** — and §6.4 is already contemplating a selected-row pair.

**DEFER** the three user-selectable contrast levels. The earlier reading of this as an Android-only feature was wrong twice over. M3 frames it as a disability accommodation, not a product flourish: "People with vision disabilities may choose medium or high contrast options for better support", with 3:1 for medium and 7:1 for high (VERIFIED: `color.md` §Contrast). And the web *does* have the delivery mechanism — `prefers-contrast: more` and `forced-colors: active` — which this repository already reasons about: `policy/interaction/focus.mjs` builds the whole focus-indicator refusal list around forced-colors (lines 10, 44, 124, 134, 178, 184), and `policy/foundations/elevation.mjs:13` marks shadow FRAGILE because "forced-colors and low-contrast rendering can remove or erase it." So the honest reason to defer is cost, not absence: two more complete token sets is real work and no need has been named. See §6.10.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Roles enumerated | 45 on the roles page (26 standard + the add-ons it names) | 45 placed, 17 carried, 28 refused with reasons, 7 own roles | v4 is a strict subset plus 7; the two 45s are the same population |
| Colour-role groups | 6 (primary, secondary, tertiary, error, surface, outline) | 4 in use (primary, error, surface, outline) + 4 status containers | no secondary, no tertiary |
| Guaranteed pair contrast | 3:1 minimum | 4.5:1 text, 3:1 ui, 3:1 inactive | v4 higher on text and disabled |
| Non-`on` pair contrast | 4.5:1 small / 3:1 large, unguaranteed | every declared pair measured in both themes, 40 rows | v4 mechanical, M3 advisory |
| `outline` | boundaries that define a target; text-field outline | `outline.default`, measured at 3:1 | agree |
| `outline-variant` | dividers and decoration; only where other elements give 4.5:1 | `outline.variant` | agree in the role, **unassigned in the table** — see §6.13 |
| Custom semantic colour | 4 roles (main, on-main, container, on-container) | container + on-container only, for 4 statuses | main fills deliberately unminted; no consumer |
| Contrast levels | 3 (standard, medium ≥3:1, high 7:1), an OS accessibility setting | 1 | **deferred, not rejected** — web reports it via `prefers-contrast` / `forced-colors` |
| Tonal palette | 13 steps, 0–100 + 95/98/99 | irregular ladders, no tone numbers | shape declared, unused |
| Surface container rungs | 5 (lowest → highest) + bright/dim | 3 (surface, surface-lowest, surface-container) | ladder grows on demand |
| State-layer opacity | hover 8%, focus 10%, press 10%, drag 16% | hover 8%, focus 12%, press 12%, drag 16% | **values differ; see Appendix A1** |
| State-layer mechanism | live opacity composite | explicit opaque `-hover`/`-pressed` fills | deliberate divergence |
| Disabled | on-surface 38% over a 12% container | two explicit roles measured at 3:1 | deliberate divergence |
| Focus colour role | none (indicators borrow accents) | one `focus` role, alias of `primary` | v4-only |
| Perceptual distinctness floor | none published | CIEDE2000 ΔE ≥ 3.0 over 12 surface pairs | v4-only |
| `surface-tint` | deprecated on the elevation page in favour of levels 0–5; **not named on the roles page** | absent, and outside the placement table's declared population | not a gap — see A2 |

### 2.2 Type — **ADOPT the structure, ADAPT weight and tracking, REJECT the metrics below 12px**

**M3's decision.** Fifteen baseline styles across five roles, no product using all of them, brand typeface for display and headline and plain typeface for body and label. Customise line height and tracking, not size. Line height adapts to language script height, and ignoring it "leads to overlapping text and broken UI elements" (VERIFIED: `typography.md` §Type scale & tokens → Language height support). On the web, typeset with bounding boxes and CSS half-leading, not baselines — M3 partitions this itself. Use tabular figures wherever values change.

**Scope.** Universal. The baseline typesetting method is scoped by M3 to Android. Emphasized styles are Expressive opt-in and listed Unavailable for web.

**What v4 already encodes.** All fifteen M3 baseline styles are placed with a verdict, metrics taken from Google's `material-web` token file v0.192; a carried style must match within 0.5px on size and line height, and a differing weight must carry a written note on the row (VERIFIED: `policy/foundations/typography.mjs`, `M3_TYPE_STYLES` / `assertTypeRolesPlaced`; enforced by `tests/type-placement.test.ts`). Eight styles are carried. Hierarchy is checked relationally in every density mode, weight may invert only when size compensates, and **every line box is proved onto the 4px grid — this is the one foundation whose value evaluator the generator actually calls** (VERIFIED: `typographyFailures` imported at `policy/generators/tokens.mjs:132` and called at :795). Contrast with §2.3 and §2.6, whose equivalents are not called.

**Disposition: ADOPT** the five-role structure, the select-don't-ship-all rule, the customise-leading-not-size rule, and the web bounding-box method. **ADAPT** headline and title-large weight to 600, because we set one typeface with no brand face and rank must be carried by size and weight together — already recorded on each row rather than hidden. **ADAPT** tracking from Carbon rather than M3, because M3's per-style values are for Roboto and we set IBM Plex Sans. **REJECT** `label-small` at 11px, the three display sizes, and the emphasized set as a second full scale.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Styles in the scale | 30 (15 baseline + 15 emphasized) | 9 roles, 8 carrying an M3 baseline style | v4 selects 8 of 15 |
| Scale ratio / base | Major Second 1.125, base 14 | not declared as a ratio | v4 anchors on the M3 metrics directly |
| `body-large` | 16 / 24 / 400 | `body` 16 / 24 / 400 | carried |
| `body-medium` | 14 / 20 / 400 | `body-compact` 14 / 20 / 400 | carried |
| `body-small` | 12 / 16 / 400 | `caption` 12 / 16 / 400 | carried |
| `title-large` | 22 / 28 / 400 | `heading` 22 / 28 / **600** | weight, noted |
| `title-medium` | 16 / 24 / 500 | `emphasis` 16 / 24 / 500 | carried |
| `title-medium` (emphasized) | 16 / 24 / 600 | `subheading` | the one emphasized pairing carried |
| `headline-small` | 24 / 32 / 400 | `title` 24 / 32 / **600** | weight, noted |
| `headline-large` | 32 / 40 / 400 | `display` 32 / 40 / **600** | weight, noted |
| `label-large` | 14 / 20 / 500 | `label` 14 / 20 / 500 | carried |
| `label-small` | 11 / 16 / 500 | absent | below v4's 12px floor |
| display-large/medium/small | 57/45/36 | absent | no consumer |
| Line-height ratio, large type | 1.2× | 1.25 / 1.2727 / 1.3333 | v4 grid-derived |
| Line-height ratio, small copy | ~1.5× | 1.5 body, 1.4 label/compact, 1.3333 caption | v4 grid-derived |
| Tracking | per-style, Roboto-tuned | 12px +0.32px, 14px +0.16px, ≥16px 0 (in em) | Carbon, not M3 |
| Line-box grid | not stated | every size × leading on 4px, ±0.05px, **evaluated by the generator** | v4-only, and live |
| Language script height | 4 categories, medium ≈ +7% is default | **not encoded** | see §4 and §6.6 |
| Tabular figures | required in tables | **no token** | see §6.5 |
| Text scaling | 200% without loss of content | rem throughout; grid holds under root change | agree; the operational half is in §2.10 |

### 2.3 Shape — **ADAPT the ladder as values, REJECT it as an API**

**M3's decision.** Ten corner-radius styles on a size-based scale, assigned by desired roundedness. Customisation happens at style level (changing every component mapped to it) or component level (remapping one). M3 **cautions against** applying large or full corners to information-dense components such as cards, and adds extra padding to avoid cutting off content in them; the clipping rationale is stated for the cut-corner family — "a large cut corner on a card will clip content and images in the area more than a rounded corner of the same size" (VERIFIED: `shape.md` §Customizing shapes, lines 137–140). Nested shapes need optical correction: outer radius minus padding equals inner radius. Shape is versatile, not semantic — no meaning may be attached to a particular form.

**Scope.** Universal, except the 35-shape library, shape morphing and "rectangles are fully rounded by default", which are Expressive and, for morph, explicitly unavailable on web.

**What v4 already encodes, and what it does not.** Four semantic containment roles with a strict containment order and a mode-invariance tolerance of 0.001px are **declared** in `RADIUS_ROLES`, and `assertRadiusRoles()` runs at import to prove that table is internally coherent (VERIFIED: `policy/foundations/radius.mjs`; `policy/foundations/index.mjs:272-282`). **The evaluator that would hold tokens.json to it — `radiusFailures` — is called by nothing** (VERIFIED: zero call sites across `packages/` and `apps/`). The repository states the consequence itself: `radius-sm` set larger than `radius-lg`, inverting the nesting order that is the whole of the module, "generated cleanly" (VERIFIED: `policy/foundations/index.mjs:139-147`). The file's position on the API is unaffected and still right: the values resolve to the same core ladder M3 uses, "but those measurements are not the API. The semantic role is the API."

**Disposition: ADAPT.** Take 4/8/12/16 as values and the dense-container caution as a rule. **REJECT** the ten-step scale as a public vocabulary, the shape library, shape morph, and full-rounding by default. A payroll register is exactly the information-dense case M3's own caution describes.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Scale steps | 10 (0, 4, 8, 12, 16, 20, 28, 32, 48, full) | 4 (`precise`, `control`, `container`, `overlay`) | v4 takes 4 of 10 |
| Values carried | 4 / 8 / 12 / 16 | 4 / 8 / 12 / 16 px | identical |
| Default button shape | full (Expressive) | not a token; component decision | rejected |
| `rounded-full` | full | a Tailwind static, not minted | recorded, not owned |
| Nested-shape rule | outer − padding = inner | strict containment `precise < control < container < overlay` | different formulation, same intent |
| Containment / mode-invariance | -- | declared, table-checked at import; **`radiusFailures` never called** | **unenforced against tokens.json** — see A3 |
| Shape morph | expressive scheme, web unavailable | absent | rejected |

### 2.4 Elevation — **ADOPT the model, REJECT the levels, BUILD the shadows ourselves**

**M3's decision.** Elevation is z-distance. Six levels, with +4 and +5 reserved for user-interacted states. Tonal difference is the default separation cue and shadows are applied only where extra protection against a background is needed. Surface colour roles are explicitly not tied to elevation. Component default elevations should not be changed. Crucially: elevation tokens carry no shadow values, and each platform determines its own.

**Scope.** Universal.

**What v4 already encodes.** A **documented preference order** — spacing, then surface, then boundary, then scrim, then shadow — stated in the module header rather than ranked mechanically (VERIFIED: `policy/foundations/elevation.mjs:9-15`; `SEPARATION_MEANS` itself is the alphabetical closed set, carrying no order). What *is* mechanical is the fragility rule: `FRAGILE_MEANS = ['shadow']`, `ROBUST_MEANS` derived from it, and a non-base layer separated only by shadow refused (VERIFIED: same file, `FRAGILE_MEANS` / `ROBUST_MEANS` and the refusal at :236) — because forced-colors and low-contrast rendering can erase a shadow. Three structural layers. Five shadow tokens, each a tight key layer over a wide ambient one with its own colour token rebound in dark. Stacking order is governed as a separate domain, capped at three roles.

**Disposition: ADOPT** elevation-as-distance, tonal-difference-first, the surface/elevation decoupling, and the reservation of the top of the scale for interaction. **REJECT** six levels as a public API — three structural layers carry the product. **BUILD**: M3 supplies no shadow values at all, so ours are ours to own and defend; that is not a divergence, it is a hole M3 declares.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Levels | 6 (0, +1, +2, +3, +4, +5) | 3 structural layers, 5 shadow tokens | v4 fewer, differently framed |
| Level dp heights | 0 / 1 / 3 / 6 / 8 / 12 dp | not carried; shadows specified directly | dp is not our unit |
| Resting range | 0 to +3 | ranks 0–2 | agree in shape |
| Hover delta | +1 level, uniform | not an elevation token; state expressed by fill | deliberate |
| Shadow values | **none published** | 4 non-flat tokens, each key + ambient | v4-only, by necessity |
| Separation preference | tonal difference first, shadow for protection | header-documented order; shadow alone refused as sole separator | agree; order is prose, fragility is mechanical |
| Scrim opacity | 32% | 60% | v4 darker |
| Surface tinting | deprecated | never adopted | agree |
| z-index | not governed | 3 roles, ceiling 3, contiguous from rank 0 | v4-only |

### 2.5 Icons — **DECIDE (currently unmade)**

**M3's decision.** Material Symbols is one variable font in three styles with four axes: weight, fill, grade, optical size. Fill is the state axis (unselected to selected). Outlined is the dense-UI default. Optical size adjusts stroke weight when the icon resizes, and 20dp is named for "dense layouts on desktop". Grade compensates for visual bleed: 0 for dark-on-light, −25 for light-on-dark. Match icon weight and size to adjacent text. A 24dp symbol gets a 48dp target by default; **when a mouse and keyboard are the primary input methods, measurements may be condensed, and a 20dp symbol may use a 40dp target** (VERIFIED: `icons.md` §Applying icons → Accessibility → Target size, lines 282–287).

**Icon buttons carry a rule of their own.** An icon button must use a system icon with clear meaning, and "on web, icon buttons should display a tooltip with an accessibility label" — describing the *action*, not the icon's name (VERIFIED: `icon-buttons.md` §Overview, §Behavior → Hover, §Accessibility). It pairs with the tooltip constraint: "Don't hide critical information within tooltips as it's easy to miss. Use an interruptive dialog instead" (VERIFIED: `tooltips.md`). In a toolbar-dense desktop product every icon-only control inherits both.

**Scope.** Universal, and the one area M3 delivers on the web without caveat, through Google Fonts.

**What v4 already encodes.** One density-responsive `icon-size` token, required to fit strictly inside the control box in every mode, with containment cycles refused (VERIFIED: `policy/foundations/sizing.mjs`, `SIZE_ROLES`). Nothing about axes, style, weight, or grade.

**Disposition: DECIDE.** This is the largest genuinely open question in the concept layer. **ASSUMED:** we are not currently committed to Material Symbols as the icon set, and the decision has consequences that reach the token file (a grade token for dark mode, an optical-size binding to `icon-size`, a fill axis for selected navigation). Recommendation: **ADOPT** the principles regardless of icon set — outlined at dense sizes, optical size rather than scaling, weight matched to adjacent text, never colour alone for selection, and **the icon-button tooltip rule with its critical-information exclusion** — and take the Material Symbols decision as a separate, cheap, reversible one.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Standard size | 24dp | 20px default (16 compact / 24 comfortable) | v4 denser by default |
| Desktop-dense optical size | 20dp | 20px default | agree |
| Optical sizes available | 20, 24, 40, 48dp | 3, tied to density | v4 fewer, density-bound |
| Recommended weight / stroke | 400 regular, 2dp | not encoded | gap |
| Minimum weight at 24dp | 200 | not encoded | gap |
| Grade, dark-on-light / light-on-dark | 0 / −25 | not encoded | gap |
| Baseline offset beside text | ≈11.5% of text size | not encoded | gap |
| Target for 24dp symbol | 48dp default; **40dp for a 20dp symbol when mouse+keyboard are primary** | 24px pointer floor, 48px touch policy | v4 below even M3's condensed number — see §2.10 |
| Icon-button tooltip (web) | required, names the action, carries the a11y label | not encoded | ADOPT at component layer |
| Label required below | 20dp | not encoded | gap |

### 2.6 Spacing — **ADOPT the rhythm, REJECT the numeric vocabulary**

**M3's decision.** An 8dp scale where `space100` = 8dp, extended by multipliers. Three categories with an order of preference: padding, then gap, then margin — "Material rarely uses margins in components." Positions are named leading and trailing, never left and right — and M3 states the reason on the bidirectionality page, not the spacing one: "Material's components are built to support RTL, such as naming elements and tokens as 'leading' and 'trailing'" (VERIFIED: `bidirectionality-rtl.md`, line 9; the RTL disposition itself is §2.7). Spacing does not scale with text: at 200% text the same spacing tokens are used. Spacing logic lives in the component, not in a global switch.

**Scope.** Universal as ideas. The shipped token package is Jetpack Compose only — the spacing page's own availability table lists Web as Unavailable.

**What v4 already encodes, and what it does not.** Six ranked relationship roles plus control, row and container geometry are declared, with components naming the relationship rather than a number; adjacent-role collapse is permitted only when the grid genuinely has no headroom (VERIFIED: `policy/foundations/spacing.mjs`, `SPACING_ROLES`; `GRID_PX = 4`, `GRID_TOLERANCE_PX = 0.01`). `assertSpacingRoles()` runs at import and proves that table coherent. **`spacingFailures` and `spacingDensityFailures`, which would hold tokens.json to the 4px rhythm, are called by nothing** — and the repository measured the consequence: `space.4` at 15px, off the grid the module spent 490 lines on, generated cleanly (VERIFIED: `policy/foundations/index.mjs:139-143`). The page frame is held still under density while contents pack.

**Disposition: ADOPT** the rhythm, the padding/gap/margin preference order, leading/trailing naming (for the reason §2.7 records, not as a bare style choice), and the do-not-scale-spacing-with-text rule. **ADAPT** the base to 4px, because 4/8/12/16 are all useful inside dense controls. **REJECT** `spaceNNN` multiplier names as a public API — a component asks for a relationship, not a multiplier.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Base unit | 8dp (`space100`) | 4px (`space.1`), tolerance ±0.01px | v4 finer |
| Scale range | 0×–9× | 0, 4, 8, 12, 16, 24, 32, 40, 48, 64 px | comparable |
| Public vocabulary | `space100`, `space225` | `related`, `tight`, `snug`, `normal`, `loose`, `section` | relational, not numeric |
| 4px rhythm | -- | declared, table-checked at import; **`spacingFailures` never called** | **unenforced against tokens.json** — see A3 |
| Spacing under 200% text | unchanged | unchanged (rem) | agree |
| Position naming | leading / trailing, for RTL support | leading / trailing | agree; see §2.7 for the RTL verdict |
| Density mechanism | density scale 0, −1, −2, −3; each step ≈ −4dp of vertical padding or height | 3 named modes; 11 tokens rebound; control ladder 32 / 40 / 48 px (8px step) | **different shape and step** |
| Text size under density | must not change | type namespaces are on the density denylist, enforced | v4 mechanical, M3 advisory |
| Web availability | Unavailable | shipped | nothing upstream to consume |

### 2.7 Layout, adaptation and direction — **ADOPT the breakpoints, REJECT the authoring order, ADAPT for RTL**

**M3's decision.** Five window-width breakpoints, not devices, because window space is dynamic — and M3 states these "apply to Android and web" (VERIFIED: `breakpoints.md` §Overview). One to three panes, never more, with at least one flexible. M3 **limits** two-pane layouts at medium to lower-density content — "Limit use of two panes for content with lower information density, such as a settings screen" (VERIFIED: `breakpoints.md` §Medium → Panes, line 286) — rather than prohibiting them for dense content outright. Single-pane layouts are reserved for information-dense content at expanded and above. Pane width preference persists, including across a breakpoint change. Text stays between 40 and 60 characters per line at every breakpoint.

**Bidirectionality is a published area of the corpus, and this document previously ignored it.** `bidirectionality-rtl.md` (136 lines) is the most platform-neutral file in the corpus — it is about language, not Android. It states that layouts must support both LTR and RTL through mirroring; that directional icons and linear progress mirror, **except in Hebrew, where linear progress stays LTR**; that media controls are always LTR; that clocks and circular progress never mirror; and that graphs and charts keep LTR directionality (VERIFIED: `bidirectionality-rtl.md` lines 8–53). It is also the source of the leading/trailing naming §2.6 adopts.

**Scope.** Universal for breakpoints, the pane model and bidirectionality. Mobile-flavoured for the scaffold vocabulary, reachability and foldables. Compose-specific for rulers. **Navigation is its own area — §2.13 — and is not scoped away here.**

**What v4 already encodes.** The four M3 window-class boundaries exactly, named as boundaries rather than framework breakpoints, with their resolved widths part of the contract; compact is implicit because it is the range below medium (VERIFIED: `policy/foundations/layout.mjs`, `WINDOW_CLASSES` / `BREAKPOINT_EXPECTED_PX`). The file also records the reason: "Tailwind ships 640/768/1024/1280/1536 and not one of them coincides with these" (VERIFIED: `policy/tokens.json`, breakpoint `$description`). **The same file also declares `SHELL_ROLES` — `header`, `nav-collapsed` and `nav-expanded`, with a `narrowerThan` relation and a cycle check** (VERIFIED: `layout.mjs:135-146`), backed by `size.shell-nav-collapsed` 64px, `size.shell-nav-expanded` 240px, `size.shell-header` 48px and the `semantic.shell.*` block (VERIFIED: `policy/tokens.json:296-303, 917-927`). Adaptive layout and density are held as independent axes by policy. Content ceilings exist; a grid, column or pane token family deliberately does not.

**Disposition: ADOPT** the five window classes verbatim, the pane-count-by-breakpoint model, the single-pane-for-dense-content rule, persistent pane width as a remembered user setting, the co-planar-for-persistent-utilities rule, the 40–60 character measure, and every pane accessibility rule — which are the strongest and most under-implemented part of that area. **REJECT** "start with mobile" as the authoring order: we design the expanded and large data view first and decide what collapses. **REJECT** the reachability model, foldable postures, bottom sheets as a primary surface, and the 412dp fixed pane, which is a handset width reused by analogy.

**ADAPT for direction, taking the structural half now.** Adopt logical direction throughout: logical CSS properties (`inline-start` / `inline-end`, not `left` / `right`), leading/trailing naming already in place, and reading order rather than physical order wherever a rule would otherwise say "left to right" (this changes §2.9's tab-order wording). **DEFER** mirroring itself and the per-language exception table — linear progress in Hebrew, media controls, charts — with the reason recorded: every named product locale (Bahasa Malaysia, Bahasa Indonesia, Thai, Vietnamese, English) is LTR, so the exception table has no consumer, while the structural half costs nothing now and is expensive to retrofit. **ASSUMED:** no RTL locale is in scope for this product today. Recording the decision is the point; inheriting it by default from an LTR-only reading is what §5.3 warns about.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Compact | < 600dp | implicit (below medium) | agree |
| Medium | 600–839dp | 600px | agree |
| Expanded | 840–1199dp | 840px | agree |
| Large | 1200–1599dp | 1200px | agree |
| Extra-large | ≥ 1600dp | 1600px | agree |
| Two panes at medium | limited to lower-density content | single pane for dense content | agree, by M3's own limit |
| Window margin | 16dp compact, 24dp above | not a token | gap |
| Inter-pane spacer | 24dp at every multi-pane size | not a token | no pane model yet |
| Fixed pane width | 360dp expanded, 412dp large+ | not a token | rejected as a handset width |
| Max panes | 3 | no pane model | deferred until a consumer exists (`layout.mjs:11-16`) |
| Line measure | 40–60 characters | `content-prose` ceiling exists | different mechanism |
| Grid / columns / gutters | **not published in the layout files** | absent, deliberately | see §4 |
| Position naming | leading / trailing | leading / trailing | agree |
| Logical properties | implied by leading/trailing | **not stated as a rule** | ADOPT — see §6.14 |
| Mirroring + per-language exceptions | published (Hebrew progress, media controls, charts) | absent | **deferred, reason recorded** |
| Authoring order | mobile first | desktop first | deliberate inversion |

### 2.8 Motion — **ADOPT the physics as intent, REJECT the API and most of the ladder**

**M3's decision.** Springs replaced easing-and-duration in May 2025; the old system remains as a fallback and is what transitions still run on. Two schemes, and "Standard... should be used for utilitarian products". Spatial motion may overshoot; effects motion must not. Duration scales with area; exits are shorter than entrances. **The base Emphasized curve has no CSS form** — its CSS row reads "N/A (Use Standard as a fallback)" — but **its decelerate and accelerate siblings do**: `cubic-bezier(0.05, 0.7, 0.1, 1.0)` and `cubic-bezier(0.3, 0.0, 0.8, 0.15)` (VERIFIED: `motion-easing-and-duration.md` §Tokens & specs → Emphasized easing set, CSS row). M3 does **not** instruct rejection of the set: "The Emphasized easing set is recommended for most transitions to capture the style of M3", with Standard offered as "a fallback for platforms that don't support Emphasized easing, like iOS and Web" (VERIFIED: same file, §Choosing an easing set). Transitions "are not receptive to highly stylized motion" and should not use bouncy springs. **Skeleton loaders are one of M3's six transition patterns and are stated as a stability requirement, not decoration**: they abstract where content will appear, carry a subtle pulse from top-left to bottom-right, and content "quickly fades in on top of" them, because "content shifting positions or instantly popping in as it loads... can be distracting and frustrating to use" (VERIFIED: `motion-transitions.md` §Transition patterns → Skeleton loaders; §Applying transitions → Stable layouts). Reduced motion is a behaviour change: subtle fades instead of sliding, decorative effects disabled.

**Springs are published for web, and the earlier reading of this row was wrong.** The Compose spring constants are unpublished, but M3 publishes a **twelve-row conversion table giving a cubic-bezier and a duration for every spring token** — six composites per scheme (spatial and effects × fast, default, slow), across the Standard and Expressive schemes — under the instruction "Use springs when possible, otherwise use curves that mimic the springs", with Web listed as Compatible (VERIFIED: `motion-overview.md` §Specs → Web: Convert springs to curves; §Spring tokens for the 6-per-scheme structure). Expressive fast spatial is `0.42, 1.67, 0.21, 0.90` at 350ms; the three Standard spatial speeds share `0.27, 1.06, 0.18, 1.00` and differ only by duration (350 / 500 / 750ms).

**Scope.** Universal for the direction and duration discipline. Android/Compose for the spring API and device-class token resolution — spring values "differ depending on if the device is a wearable, phone, or tablet" (VERIFIED: `motion-overview.md`, line 81).

**What v4 already encodes, and what it does not.** Six semantic duration roles, each with its own ceiling and a house maximum, so duration cannot become taste. Zero duration is refused in favour of a 0.01ms token, because "a zero-duration transition does not fire `transitionend`, so a component waiting for that event would hang for exactly the people who asked for less motion" (VERIFIED: `policy/tokens.json`, `duration.none` `$description`). **Reduced motion is DECLARED per role and validated as a declaration** — `MOTION_ROLES` gives each role `reducedMotion: 'shortened' | 'unaffected' | 'removed'`, and `assertMotionRoles` checks those strings at import (VERIFIED: `policy/foundations/motion.mjs:87-119, 160`). **The function that would prove the resolved behaviour — `reducedMotionFailures` — is called by nothing**; the generator imports and calls `motionFailures` only, which checks per-role ceilings (VERIFIED: `motion.mjs:448` zero call sites; `generators/tokens.mjs:121, 811`). Nothing ever supplies the normal/reduced resolved pair the function takes. `duration.pulse` at 2000ms exists for "the loading placeholder shimmer" and is the one looping role permitted to answer `removed`.

**Disposition: ADAPT.** Take the spatial/effects distinction, the direction-carries-meaning rule, exits-shorter-than-entrances, the Standard scheme, and **stable layouts with skeleton loaders** — `duration.pulse` is already the token that serves it. **REJECT** the spring API, device-class token resolution, the Expressive scheme's overshoot, container transform, lateral transitions, and everything above roughly 400ms. **REJECT the Emphasized set — as our decision, not M3's**: M3 recommends it and offers Standard only as a platform fallback, so declining it is a v4 call justified by the utilitarian-product argument M3 itself makes for Standard. **REJECT importing any second duration ladder** — see §6.11.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Duration tokens | 16 (short1 50 → extra-long4 1000ms) | 6 primitives (0.01, 70, 110, 150, 240, 2000ms) | v4 far narrower |
| Semantic durations | none; tokens are the API | 6 roles (`none`, `press`, `state`, `base`, `overlay`, `pulse`) | v4 semantic |
| House maximum | 1000ms published | 500ms | v4 tighter |
| Standard easing | cubic-bezier(0.2, 0, 0, 1.0) | `standard` 0.2, 0, 0.38, 0.9 | Carbon curve, not M3 |
| Decelerate / entrance | (0, 0, 0, 1) | `entrance` 0, 0, 0.38, 0.9 | Carbon |
| Accelerate / exit | (0.3, 0, 1, 1) | `exit` 0.2, 0, 1, 0.9 | Carbon |
| Emphasized easing | base curve has **no CSS form**; decelerate `(0.05,0.7,0.1,1.0)` and accelerate `(0.3,0,0.8,0.15)` **do** | not adopted | **v4 decision** — M3 recommends the set |
| Springs | 6 composites per scheme (spatial/effects × fast/default/slow); Compose values unpublished, **but a 12-row web conversion table publishes a cubic-bezier + duration for all of them** | not adopted | **rejected because every spatial curve overshoots (y2 > 1) and slow durations reach 750ms, above our 500ms maximum; values also resolve per device class** |
| Skeleton loaders / stable layout | a named transition pattern; avoid content shifting or popping in | `duration.pulse` 2000ms exists; no concept decision until now | ADOPT |
| Reduced motion | behaviour change, no tokens, no media query named | **declared per role and validated as a declaration; `reducedMotionFailures` is never called** | v4 ahead on structure, **unproved on behaviour** — see A3 |
| Zero duration | not addressed | refused; 0.01ms token | v4-only |

### 2.9 States and interaction — **ADOPT the model, REJECT the mechanism**

**M3's decision.** Two visual indicators per state. The state layer is an overlay in the content's own colour at a fixed opacity, and only one applies at a time. Focus, hover, press and drag are each singular in a layout; disabled is not. Disabled is exempt from contrast, **and disabled components "can't be focused, dragged, or pressed, and they don't change state when tapped or hovered over"** (VERIFIED: `states.md` §Applying states → Disabled → Behavior, line 116). Keyboard focus gets a ring-like indicator on top of the focus state, framed explicitly for web users navigating with Tab. **Tab order follows reading order** (M3 words it "left to right, top to bottom", which §2.7's logical-direction adoption restates as reading order). Escape dismisses modals, clears focus and removes the text cursor without deleting typed text. Pressed is not a touch-only state — it applies to cursor, keyboard and voice alike. On desktop, checkboxes are always visible when selection is the primary activity; when secondary they appear on hover for one item **and for all items once one is selected** (VERIFIED: `selection.md` §Types of selection → Click). **A checkbox or radio button is activated by its adjacent label as well as by the control** (VERIFIED: `checkbox.md` line 134; `radio-button.md` line 116) — which doubles the effective target and is the cheapest available mitigation for §3.1's compact-density control box. **Error text carries the `alert` role, and where both supporting text and error text exist the accessible label reads supporting text first, then error text** (VERIFIED: `text-fields.md` §Accessibility → Labeling elements, lines 492–493); the full error model is §2.15.

**Scope.** Universal, except the ripple, the 40dp/48dp layer-target pair, long-press selection mode and predictive back.

**What v4 already encodes, and what it does not.** Five independent composing axes rather than one enum, each interaction value declaring its expression channel (VERIFIED: `policy/interaction/states.mjs`, `STATE_AXES` / `INTERACTION_STATE_EXPRESSIONS`). The word `active` is prohibited with six replacements. **The prohibition that walks every emitted custom property name — `stateFailures` — is never called**; what runs at import is `assertProhibitedNames` and `assertStateAxes`, which check the prohibition table against the axis table, i.e. exactly the case the module's own comment says is insufficient: "a table can only catch a word it already knows about, and the prohibition is about names nobody has written yet" (VERIFIED: `states.mjs:487-493` and its zero call sites; `interaction/index.mjs:60-62` states it verbatim). Focus survives `selected`, `pressed`, `error`, `hover` and `disabled`, checked against the real state vocabulary by `assertFocusSurvives` in `tests/unit/interaction-policy.test.ts`. One authored focus indicator, an outline on `:focus-visible`, with box-shadow, background-color and opacity each refused with a named failure mode (VERIFIED: `policy/interaction/focus.mjs`, `REFUSED_INDICATORS`).

**Keyboard behaviour has its own module, and this document previously omitted it.** `policy/interaction/keyboard.mjs` declares eight profiles, each with its keys, its focus contract and its **supplier** (`platform`, `library`, `this-system`), plus a `PROFILE_COVERAGE` table in which a profile with neither coverage nor a written `gap` is refused. `composite-grid` is the data-grid answer: keys `Tab, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End, Enter, F2`, one tab stop with roving focus and two-dimensional traversal, `suppliedBy: 'this-system'` — "Base UI ships no grid. Every branch is written in this repository, which is why it is the profile with the least backing and the most exposure" (VERIFIED: `keyboard.mjs:86-131, 148+`).

**Disposition: ADOPT** two-indicators-per-state, one-layer-at-a-time, state composition, the singularity rules, the keyboard contract, **the `alert` role on error text and the supporting-then-error label order**, **the label-as-target rule for checkboxes and radios**, and the desktop selection-visibility rule — that last one is the rule for every table in this product and is the one implementations forget. **REJECT** the live state-layer composite (a composite is a pair the token graph cannot measure), the ripple, and M3's disabled contrast exemption: in payroll the disabled state routinely carries legally consequential values that must still be read. **DIVERGE, knowingly**, on disabled focusability — see the table row below and §3.4.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| State model | one list with combination rules | 5 orthogonal axes (4 painting, 1 not) | v4 more structured |
| State layer opacities | 8 / 10 / 10 / 16 | 8 / 12 / 12 / 16 | **see Appendix A1** |
| State layer mechanism | composited overlay | explicit fills; ratios are a minting rule | deliberate |
| Layer size vs target | 40dp layer inside 48dp target | separate visual and target tokens | same principle |
| Disabled contrast | exempt | 3:1, exemption declined | deliberate |
| **Disabled focusability** | **"can't be focused, dragged, or pressed"** | `FOCUS_SURVIVES` includes `disabled` — a focusable/`aria-disabled` presentation is permitted and must keep its ring | **real divergence, deliberate; same decision as §3.4** |
| Focus indicator | ring-like, mechanism unspecified | `outline`, 2px, 2px offset, `:focus-visible` | v4 specific |
| Focus vs other states | independently configurable | survives 5 named states, checked in the unit suite | v4 mechanical |
| Keyboard model | Tab between components, arrows within | 8 profiles with keys, focus contract and supplier; `composite-grid` is ours to write | v4 more structured; the grid profile is unbacked by any library |
| Tab order | "left to right, top to bottom" | reading order, per §2.7's logical-direction adoption | restated, not changed |
| Label as target | checkbox and radio activate from their label | not encoded | ADOPT — see §3.1 |
| Error announcement | `alert` role on the error message; supporting text before error text in the label | not encoded | ADOPT at component layer — see §2.15 |
| `active` as a name | used freely | prohibited; **the name-walking check exists and is never called** | v4-only, and **decoration today** — see A3 |
| Selected-row layer | **no value published** | `INTERACTION_STATES` binds `highlighted` → `primary-container` and `checked` → `primary` (`style.mjs:108-114`) | **an answer exists**; see §6.4 |

### 2.10 Accessibility — **ADOPT every WCAG floor, exceed two, sit deliberately below both M3 pointer numbers**

**M3's decision.** 4.5:1 small text, 3:1 large text and graphics. Clustered non-text elements need 3:1 container-to-background; standalone prominent ones are exempt. Touch targets at least 48x48dp; pointer targets — "Consider making pointer targets minimums 44 x 44dp", immediately after noting the number comes from iOS (VERIFIED: `designing.md` §Pointer targets, lines 122–129) — and "in most cases, targets separated by 8dp of space or more promote balanced information density and usability" (VERIFIED: same file, line 133). 200% text enlargement without loss of content, understandability or functionality — with text and line height scaling and padding held constant. Density is opt-in, never automatic across breakpoints, never below the target floor, and the control that reverts it must itself be full size. Truncated text always has a route to the full text. Eight ARIA landmarks, sequential headings, source order as reading order, defined initial focus and focus return, two-key shortcut minimum.

**The operational half of the 200% requirement, which this document previously stopped short of.** M3 names four failure modes — unresponsive container with clipped text, unresponsive text, overlapping elements, unwanted truncation — with four remedies: increase container size, reflow the layout (stack rather than fix side-by-side), enable scrolling, and use tooltips for space-constrained labels. **"Vertical scrolling is preferable to horizontal. Users should only be asked to scroll in one direction, rather than both vertically and horizontally."** Components that include no text — progress indicators, checkboxes, radio buttons — "aren't affected by text resizing" and must not be scaled with it. And the flat rule: information must remain available even when truncated; "if there's an ellipsis, but no way to show the truncated text, it is not accessible" (VERIFIED: `writing-and-text.md` §Text truncation lines 43–69, §Text resizing lines 89–137). Two of these bind hard here: a payroll grid scrolls on both axes by construction, and truncated employee names and pay-item descriptions are the default case in a dense row.

**Input profile is an axis of its own, and this document previously let "desktop-first" stand in for "pointer-only".** They are independent, the same way §2.7 holds adaptive layout and density apart:

- **Window class governs layout.** It is reported by width, and it says nothing about how the user touches the screen.
- **Input capability governs the target floor.** It is reported by `pointer` and `any-pointer`, and it says nothing about width.

An expanded-width window is routinely a touchscreen laptop, a Surface, or iPad Safari — the very devices on which an approver signs a payroll run. Nothing in the design package matches `pointer: coarse` or `any-pointer`, so **nothing selects between the two profiles today.**

**Scope.** Universal. This is the strongest and most transferable part of the corpus.

**What v4 already encodes, and what it does not.** Three separate tables kept deliberately apart: the WCAG normative floor, the M3 benchmark **in dp**, and the house policy **in CSS px** (VERIFIED: `policy/interaction/accessibility.mjs`, header). The policy is already input-profile aware in shape — `ACCESSIBILITY_POLICY.target` splits `pointer` (24px, cites WCAG 2.5.8) from `touch` (48px, benchmarked from M3 without equating dp and px) — **but only the pointer half is real.** `size.target-min` = 24px → `semantic.target.minimum` is the only target token in the graph, and the generator calls `assertTargetMinimum` against it in every mode (VERIFIED: `tokens.json:305, 596-601`; `generators/tokens.mjs:461, 473`). **There is no `semantic.target.touch-minimum` token; `assertTouchTargetMinimum` names that path as its default label and is called by nothing** (VERIFIED: `accessibility.mjs:347`, zero call sites; grep of `tokens.json` finds no such path). The 48px in the token file is `size.control-min-comfortable`, a *visual* control box on the density allowlist — the opposite category. Density may compress presentation, never operability: the target namespaces are on the density denylist and the axis fails closed on anything outside the spatial allowlist (VERIFIED: `policy/foundations/density.mjs`, `DENSITY_MAY_REBIND` / `DENSITY_MAY_NOT_REBIND`, enforced by `assertDensityAxis`, which the generator calls). Three evidence levels, each stating what it cannot answer, with exactly one required to be manual — and **the named assistive technologies live in a module this document previously did not cite**: `SUPPORTED_AT = ['JAWS', 'NVDA', 'VoiceOver']` and `SUPPORTED_BROWSERS = ['Chrome', 'Edge', 'Firefox', 'Safari']`, with at least two reader/browser pairings required because "one reader is not a result" (VERIFIED: `policy/interaction/assistive-technology.mjs:104-115`).

**Disposition: ADOPT** every WCAG floor and exceed two of them (text contrast applied to large text, and the declined disabled exemption). **ADOPT** the text-resize failure modes, the reflow-and-scroll remedies, the no-scaling-of-textless-components rule, and the truncation-route rule. **ADAPT** the assistive-technology list: JAWS, NVDA and VoiceOver replace M3's TalkBack and Switch Access, because the platform is different and the survey population is different. **ADAPT** the unit: dp is Android's density-independent pixel and must never be silently relabelled px. **DIVERGE deliberately** and sit below both M3 pointer numbers — 44dp recommended, 40dp for a 20dp symbol under mouse and keyboard — because 44px row actions would inflate row height enough to defeat the density M3 itself endorses for data tables. **That divergence is only sound with the separation rule attached**, which is why target separation moves out of the gap column: WCAG 2.5.8's own spacing exception is half the conformance argument for a row of icon buttons in a dense grid. See §6.13.

| Measurable | M3 | WCAG | v4 today | Divergence |
|---|---|---|---|---|
| Small text contrast | 4.5:1 | 4.5:1 | 4.5:1, applied to all text | v4 declines the large-text exemption |
| Large text / graphics | 3:1 | 3:1 | 3:1 (`ui` kind) | agree |
| Disabled contrast | exempt | exempt | 3:1 | **v4 exceeds both** |
| Clustered non-text | 3:1 | 3:1 | 3:1 on `outline`, `focus`, `primary`, `error` | agree |
| Pointer target | 44x44dp *recommended*; 40dp condensed for a 20dp symbol under mouse+keyboard | 24x24 CSS px (2.5.8) | 24 CSS px, tokenised, asserted in every mode | **v4 at the WCAG floor, below both M3 numbers — deliberate; see §3.5** |
| Touch target | 48x48dp | -- | 48 px **in policy prose only: no token, no live assertion** | **the gap this document previously reported as an adopted floor** |
| Input-profile selection | implied by platform | -- | **nothing matches `pointer` / `any-pointer`** | unbuilt — see §6.14 |
| Target separation | 8dp "in most cases" | the 2.5.8 spacing exception | not a token | **now owned — see §6.13** |
| Text enlargement | 200% | 200% | rem throughout | agree |
| Padding under text scale | constant at 1× | -- | constant | agree |
| Text-resize failure modes | 4 named, 4 remedies | -- | not encoded | ADOPT at component layer |
| Scroll direction under scale | one direction, vertical preferred | -- | not encoded | **a payroll grid cannot give it — see §4** |
| Textless components under scale | must not scale | -- | not encoded | ADOPT at component layer |
| Truncation route | ellipsis needs a tooltip or link, or it is not accessible | -- | not encoded | ADOPT at component layer |
| Density floor | never below 48x48 by default; scale 0/−1/−2/−3, ≈4dp per step | -- | 3 modes, control box 32/40/48px; target floor invariant | **see §3.1** |
| Text size under density | must not change | -- | type namespaces on the density denylist, enforced | v4 mechanical |
| Named assistive technology | TalkBack, Switch Access | -- | JAWS, NVDA, VoiceOver × 4 browsers, ≥2 pairings required | **ADAPT — platform-appropriate** |
| Focus thickness | not specified | -- | 2px, 2px offset | v4 specific |
| Reduced motion | behavioural, no proof mechanism | -- | declared per role, validated as a declaration; **not proved** | see §2.8 and A3 |

### 2.11 Content — **ADAPT the discipline, REJECT the style guide**

**M3's decision.** Sentence case everywhere, no caps blocks (stated as not accessible), second person, abbreviations sparingly, no Latin abbreviations, short sentences because translations average 1.5× longer than English, repeat the noun rather than relying on pronouns, no idiom, disambiguate words that are both noun and verb, explain consequences neutrally rather than raising alarm, and name the confirmation action for what it does rather than "OK".

**Scope.** The localisation discipline is universal. The style guide is American English and AP Style.

**What v4 already encodes.** Nothing in the read files. Content is not a token-layer concern.

**Disposition: ADAPT** the localisation discipline wholesale — it is written for exactly our problem. **REJECT** AP Style, the number-grouping rules (Indonesian inverts them, which would render a salary figure wrong), the anti-abbreviation rule as applied to statutory terms of art, the anti-politeness rule (politeness is grammatically encoded in Bahasa Malaysia, Bahasa Indonesia, Thai and Vietnamese), and second person as the universal address — much of a payroll UI is an administrator acting on a third party's record, where "your salary" is factually wrong.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Case | sentence case, no caps blocks | not encoded | ADOPT at component layer |
| Translation expansion | 1.5× English | not encoded | **sets the label budget; see §2.14** |
| Number grouping | commas 1,000–1M | not encoded | **locale data, not style** |
| Address | second person | not encoded | needs admin vs self-service split |
| Abbreviations | avoid | not encoded | statutory terms are the exception |
| Dialog actions | max 2, confirming trailing | not encoded | ADOPT at component layer |

### 2.12 Tokens — **ADOPT the three-class model, ADAPT the names, REJECT nothing**

This area was missing from the previous draft entirely, and it is the one M3 area v4 has already implemented in full.

**M3's decision.** Three classes of token: **reference** (a raw value, or another reference token; does not change with context), **system** (the themeable decision; "this is where theming occurs", pointing at different reference tokens per context), and **component** (in development; "whenever possible, component tokens should point to a system or reference token, and not contain hardcoded values"). Names run general to specific and are prefixed `ref`, `sys`, `comp`. **Contexts are tags that override a token's value** — form factor, dark theme, dense layouts, right-to-left writing systems — rather than separate token sets. And the adoption test is explicit: not everything should be a token — "Not every stylistic choice of a component will be able to be expressed as a token, but whenever a design choice applies to multiple components of similar intent, a token should be used" (VERIFIED: `design-tokens.md` §Reference/System/Component tokens, lines 107–133).

**Scope.** Universal, and the single most portable idea in the corpus.

**What v4 already encodes.** Three tiers with different names — **primitive**, **semantic**, **component** — 247 custom properties across 123 / 120 / 4, against a component ceiling of 12 (VERIFIED: `generated/FOUNDATIONS.md` §Coverage; `policy/vocabulary.mjs`, `COMPONENT_TOKEN_CEILING = 12`). Semantic tokens point at primitives and never at literals; component tokens point at semantics. **One `$modes` block with two composing axes — `theme` and `density` — emitting three mode blocks (`theme=dark`, `density=compact`, `density=comfortable`)**, with a token rebound by both axes refused because their selectors have equal specificity and the winner would be decided by emission order (VERIFIED: `policy/tokens.json:928-930`; `generated/FOUNDATIONS.md` line 17). That mechanism *is* M3's contexts, built in the shape M3 describes.

**Disposition: ADOPT** the three-class model, tokens-pointing-at-tokens, general-to-specific naming, contexts-as-tags, and the shared-intent adoption test. **ADAPT** the tier names: `primitive`/`semantic` rather than `ref`/`sys`, because those words say what the tier *is* rather than which framework it came from — this is a rename of M3's classes, not a different model, and stating so is the point of this row. **ADAPT** the component-token threshold: M3's test is "applies to multiple components of similar intent"; v4 adds a hard ceiling of 12, which is a stricter form of the same instinct. **ADOPT** contexts as v4's `$modes`, and note the deliberate restriction: M3 names RTL as a context; v4 declares no direction axis, which is consistent with §2.7's decision to take logical properties rather than a mirrored token set.

**One thing the token model does that this document must state, because §1's first commitment is otherwise stated in two vocabularies.** `policy/foundations/style.mjs` renames every colour root on the way out to component authors: `primary` → `accent.primary`, `on-surface` → `ink.onSurface`, `statutory-container` → `status.statutory`, `outline-variant` → `outline.variant`. The table is closed against `COLOR_ROLE_CONTRACTS` — a root nobody named is refused, and a named root that is not a role is refused — so it cannot silently drift. **This rename is intended.** It is an anti-corruption layer: the role name is M3's word and the symbol is Xforge's, and a screen only ever sees the second. It means §1's "every element references a semantically named role" is true through one indirection, and a reader tracing a colour from a screen to `tokens.json` passes through `generated/style.ts` on the way.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Token classes | 3: reference, system, component (`ref`/`sys`/`comp`) | 3: primitive, semantic, component | **rename, same model** |
| Counts | not published | 123 / 120 / 4 | v4-only |
| Component-token test | "applies to multiple components of similar intent" | same, plus a hard ceiling of 12 | v4 stricter |
| Tokens point at tokens | required; component → system → reference | enforced; semantic → primitive, component → semantic | agree |
| Contexts | tags that override a value: form factor, dark theme, dense, RTL | `$modes`: `theme` and `density`, 3 emitted blocks | agree in mechanism; **no direction axis, by §2.7** |
| Two axes on one token | not addressed | refused — equal selector specificity | v4-only |
| Naming | general to specific, platform prefix | general to specific, tier prefix | agree |
| Not everything is a token | stated | stated, plus the ceiling | agree |
| Role → component word | not addressed | `style.mjs` `STYLE_NAMES`, closed against the role contracts | **v4-only, and intended** |

### 2.13 Navigation — **REJECT the compact idioms, ADOPT the rail, DECIDE the switch**

This area was absent from the previous draft, which rejected M3's navigation as "mobile-flavoured" while v4 already shipped its geometry. That was the largest scoping error in the pass.

**M3's decision.** The navigation rail is scoped **away** from phones: "Use navigation rails in medium, expanded, large, or extra-large window sizes" (VERIFIED: `navigation-rail.md` §Overview, first bullet) — exactly the window classes this product lives in. Since May 2025 the rail comes in a **collapsed** and an **expanded** form; the expanded rail "is meant to replace the navigation drawer", and the baseline rail is no longer recommended (VERIFIED: same file, §M3 Expressive update). The navigation drawer is likewise "no longer recommended... use an expanded navigation rail, which has mostly the same functionality of the navigation drawer and adapts better across breakpoints" (VERIFIED: `navigation-drawer.md` line 9). The bottom navigation bar is the compact-window model. M3's adaptive claim — that the navigation *type* changes automatically at a breakpoint — is the genuinely contestable rule here, and it is a layout claim, not a phone idiom.

**Scope.** The rail pair is universal and desktop-first. The bottom navigation bar is compact-only, and M3 scopes it that way itself.

**What v4 already encodes.** `SHELL_ROLES` — `header`, `nav-collapsed`, `nav-expanded` — with a `narrowerThan` relation from collapsed to expanded and a cycle check, backed by `semantic.shell.header` 48px, `semantic.shell.nav-collapsed` 64px and `semantic.shell.nav-expanded` 240px (VERIFIED: `policy/foundations/layout.mjs:135-146`; `policy/tokens.json:296-303, 917-927`). **That is M3's collapsed/expanded rail pair by another name**, already in the token graph, already relationally constrained. The token file records the provenance honestly: these numbers "were hardcoded — `w-60` on the rail is 240px, which is the number this names."

**Disposition: ADOPT** the collapsed/expanded rail as the navigation model at medium and above, and place `SHELL_ROLES` against it. **REJECT** the bottom navigation bar, inside the dense data product — M3 scopes it to compact, and §3.3 concedes that a compact surface will exist, so this rejection is scoped, not global (see §3.4). **REJECT** the navigation drawer, which M3 has itself downgraded and which the expanded rail supersedes. **DECIDE:** whether navigation type changes automatically at a breakpoint, or whether collapse is a user preference that persists. **ASSUMED, and this is the recommendation:** persist it as a user preference and let the breakpoint set only the default, for the same reason M3 gives for persistent pane width in §2.7 — an administrator who collapsed the rail to see more columns did not ask for it back when they resized the window.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Model at medium and above | collapsed / expanded navigation rail | `nav-collapsed` / `nav-expanded`, with `narrowerThan` enforced | **agree; already in the token graph** |
| Collapsed rail width | 96dp (expressive rail) | 64px | v4 narrower — a density decision, not a benchmark |
| Expanded rail width | ~220dp | 240px | comparable |
| Header height | not published as a shell token | 48px (`semantic.shell.header`) | v4-only |
| Destinations | 3–7 plus optional FAB | not constrained | gap, and probably fine |
| Navigation drawer | no longer recommended; use the expanded rail | absent | agree |
| Bottom navigation bar | compact windows | absent | rejected inside the data product |
| Type changes at breakpoint | yes, automatically | **undecided** | see the disposition above |
| Rail position under RTL | moves to the right side of the window | not encoded | deferred with §2.7's mirroring |

### 2.14 Actions and selection — **ADOPT four rules verbatim, ADAPT the label budget**

**M3's decision.** Buttons carry a three-step emphasis ladder — filled for high, outlined for medium, text for low — and "each screen should contain a single prominent button for the primary action" (VERIFIED: `all-buttons.md` §Level of emphasis, lines 30–129). Four rules are worth lifting into a payroll design system without modification, because this product is exactly the failure case each addresses:

1. **Outlined is the escape button.** "Use an outlined button for actions that need attention but aren't the primary action... This is also the button to use for giving someone the opportunity to change their mind or escape a flow" (VERIFIED: `all-buttons.md` line 85). That is the Cancel beside a payroll run's Confirm.
2. **Chips never progress a task.** "Use chips to enhance a person's current journey and encourage action. Use buttons to progress them through the product and for significant actions"; "Avoid using chips to finish or progress a task" (VERIFIED: `chips.md` lines 253, 263).
3. **A switch never precedes a save step.** "The effects of a switch should start immediately, without needing to save"; "Avoid using a switch to select multiple options that require people to save... Use checkboxes instead" (VERIFIED: `switch.md` lines 157, 187).
4. **A button label may not change length dramatically between states, and never wraps or truncates.** "The label length shouldn't change dramatically to be longer or shorter"; "Don't truncate or wrap label text. It should always be fully visible on a single line" (VERIFIED: `common-buttons.md` lines 411, 420).

**The three-way selection-control rule**, stated identically across `checkbox.md`, `radio-button.md` and `switch.md`: checkboxes for multiple related options in a list; radio buttons for one of a list; switches for standalone settings that take effect immediately.

**Scope.** Universal. The one caveat is that M3 has deprecated the segmented button in favour of the connected button group — "Connected button groups replace the segmented button"; the segmented button "is no longer recommended" (VERIFIED: `button-groups.md` lines 11, 29) — and the connected button group is Expressive. On web the answer may be neither, and that is §5.2's problem, not this section's.

**What v4 already encodes.** `INTERACTION_STATES` in `style.mjs` binds `checked`, `unchecked`, `highlighted`, `invalid` and `disabled` to colour roots and selectors, with `disabled` dominating by selector so a disabled control shows no other interaction state. Nothing encodes the emphasis ladder or the label budget.

**Disposition: ADOPT** the emphasis ladder, the one-high-emphasis-button-per-screen rule, the three-way selection-control rule, and the four rules above verbatim. **ADAPT rule 4's consequence for our locales**, which is the row §2.11 implies and never lands: with translations averaging 1.5× English, **the button label budget is set by the longest localisation, not by the English string.** A Confirm/Cancel pair sized to English will wrap in Bahasa Indonesia, and M3 forbids the wrap rather than the width. **ASSUMED:** this is a component-layer measurement obligation, not a token; the token it would need is a minimum action width, and nothing has asked for one.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Emphasis ladder | filled > outlined > text; one high-emphasis button per screen | not encoded | ADOPT at component layer |
| Outlined's job | change your mind, escape a flow | not encoded | ADOPT — this is Cancel |
| Chips | never progress or complete a task | no chip component | ADOPT before one exists |
| Switch | immediate effect, never before a save step | `switch` component tokens exist | ADOPT the rule |
| Selection control choice | checkbox = many of a list; radio = one of a list; switch = standalone immediate | `checked`/`unchecked` states exist, no selection rule | ADOPT |
| Button label | no dramatic length change between states; never wraps or truncates | not encoded | ADOPT |
| Label budget | 1.5× English for translation | not encoded | **ADAPT: budget set by the longest locale** |
| Segmented button | deprecated for the connected button group (Expressive) | absent | neither adopted — see §5.2 |

### 2.15 Forms, feedback and data entry — **ADOPT; this is the highest-value transfer in the corpus**

The previous draft routed this whole subject out of the concept layer on the strength of a claim M3 contradicts in several places. It is corrected here, and it is the most directly usable material M3 publishes for a product with legal consequence.

**M3's error model.** Error text **replaces** supporting text rather than joining it, "which prevents new lines of text from bumping content and changing the layout" (VERIFIED: `text-fields.md` §Anatomy → Error text, line 386). An error icon is "strongly recommended" as "an important second visual indicator" — the non-colour cue (VERIFIED: same file, §Error icon, lines 396–399). On error, "'alert' is applied to the role and the error message to the text label", and where both exist "the label should include the supporting text first, followed by the error text" (VERIFIED: §Accessibility → Labeling elements, lines 492–493). A required field shows an asterisk, and "the accessibility label must include the asterisk" (VERIFIED: line 502). A failed confirming action in a full-screen dialog raises a general failure in a basic dialog (VERIFIED: `dialogs.md` §Full-screen dialog).

**M3's feedback model.** Wait time selects the indicator: under 200ms none; 200ms–5s a loading indicator; over 5s a progress indicator; and for a very long wait, "consider allowing people to navigate away from the page while the process finishes up" (VERIFIED: `progress-indicators.md` §Usage, lines 138–147; the identical table appears in `loading-indicator.md` lines 123–133). A loading indicator must never transition into a progress indicator, though indeterminate may become determinate. **The announcement model is published, not absent**: "Use the progress bar accessibility role, and write an accessibility label that describes the purpose of the progress indicator. The label should include the process, such as 'loading,' and the affected content... For example: 'Loading news article' or 'Refreshing page'" (VERIFIED: `progress-indicators.md` §Accessibility → Labeling elements, line 262). A snackbar uses **a polite (queued) live region**, announces without moving focus, must not trap focus, must not obscure a focused element, and on web should offer a shortcut to reach an actionable snackbar (VERIFIED: `snackbar.md` §Accessibility → Focus, lines 213–235). **A payroll run commit is precisely the >5s case.**

**M3's date and time entry model**, which bears directly on effective-dated ranges and civil dates: people must be able to enter dates manually by typing without the picker; the calendar icon is the exclusive entry point for the picker; each input is a separate tab stop; **no input masks while typing** — format after Enter or blur, "because it changes what they typed" and confuses screen reader users; helper text states the format (default "MM/DD/YYYY") and doubles as the field's description; and non-critical actions such as Clear should be removed to reduce tab stops (VERIFIED: `date-pickers.md` §Accessibility, lines 426–488). Time entry carries the parallel rule that a dial must not be the only route.

**Scope.** Universal. Every rule above is a web-implementable ARIA or interaction rule.

**What v4 already encodes.** `INTERACTION_STATES.invalid` binds to the `error` root with a `data-invalid` selector (VERIFIED: `style.mjs:112`). Nothing else. There is no form component, no date field and no progress component yet, which is exactly why the decision belongs here rather than in a component review after the fact.

**Disposition: ADOPT** all three models. They are the part of M3 most worth taking verbatim, and none of them costs a token.

| Measurable | M3 | v4 today | Divergence |
|---|---|---|---|
| Error text placement | replaces supporting text; layout must not shift | not encoded | ADOPT |
| Error second indicator | error icon strongly recommended | `invalid` → `error` root exists | ADOPT the icon rule |
| Error announcement | `alert` role on the message | not encoded | ADOPT |
| Error label order | supporting text, then error text | not encoded | ADOPT |
| Required field | asterisk, and it must be in the a11y label | not encoded | ADOPT |
| Failed submit | general failure in a basic dialog | not encoded | ADOPT |
| Wait < 200ms | no indicator | not encoded | ADOPT |
| Wait 200ms–5s | loading indicator | not encoded | ADOPT |
| Wait > 5s | progress indicator; allow navigating away if very long | not encoded | ADOPT — **the payroll-run case** |
| Indicator transitions | loading must not become progress; indeterminate may become determinate | not encoded | ADOPT |
| Indicator scope | one per group of work; one variant per process product-wide | not encoded | ADOPT |
| Progress announcement | `progressbar` role, label naming process + affected content | not encoded | ADOPT |
| Transient message | polite live region; no focus move, no focus trap, no obscuring focus; web shortcut to reach it | no snackbar/toast (and no `inverse` roles — §2.1) | ADOPT when one exists |
| Date manual entry | required; picker is optional | not encoded | ADOPT |
| Date input mask | forbidden while typing; format on Enter or blur | not encoded | ADOPT |
| Date format hint | in helper text, which is also the field description | not encoded | ADOPT — see §6.15 |
| Date tab stops | one per input; drop non-critical actions | not encoded | ADOPT |
| Time entry | dial must not be the only route | not encoded | ADOPT |

---

## 3. Where M3 and a dense data product disagree

### 3.1 Density: not a disagreement, a constraint worth copying exactly

The framing correction is worth making explicitly, because it is easy to assume otherwise: **M3 does not treat a dense data product as a deviation.** It names "news, financial portals, dashboards" as the case for higher density and says increasing the density of lists, tables and long forms is the right move when people need to scan and compare (VERIFIED: `grids-spacing.md` §Density → Information density).

The constraint it imposes is not "be less dense" but four rules: density never costs target size; density never changes text size; density is opt-in and never changes automatically with breakpoint or orientation; and the control that reverts density must itself be full size. It also forbids density on menus, snackbars and dialogs, because those depend on selectable area or on being noticed.

**Our resolution.** v4 holds three of the four mechanically — density may rebind only spatial namespaces, target namespaces are on the denylist, and the axis must be symmetric and non-vacuous, all enforced by `assertDensityAxis`, which the generator calls (VERIFIED: `density.mjs:189-278`; `generators/tokens.mjs:778`). Direction is **not** among them: monotonicity (`compact <= default <= comfortable`) belongs to `densityFailures`, which has zero call sites (VERIFIED: `density.mjs:294-302`). The fourth rule (the revert control) is a component obligation.

**The real risk, and it is not where it looks.** At compact density the visual control box resolves to 32px, which is below both M3's 48dp touch floor and above the 24px pointer floor. M3's own answer is the separation of visual bounds from interactive region, which v4 encodes as two independently bindable tokens — **and the assertion that refuses aliasing them, `assertVisualTargetSeparation`, is reached only through `assertSizingModel`, which nothing calls** (VERIFIED: `sizing.mjs:453, 481-483`, zero call sites). So the separation is unguarded at the token layer as well as unbound at the component layer. **Nothing in the token layer binds a component's hit area to the target token, and nothing checks that the two tokens stay distinct.** That binding is where compact density in a payroll grid either holds or fails.

**The cheapest available mitigation is one M3 already publishes and this document previously omitted:** a checkbox or radio button is activated by its adjacent label as well as by the control (§2.9), which roughly doubles the effective target of the densest control in a payroll row without changing a single value. **ASSUMED:** this remains the single highest-consequence unbuilt thing in the density story.

### 3.2 Tables: M3 has no data table, and its list modes have no shape for a payroll row

`material-a-z.md` defines "Data table" in one sentence with no linked guidance. The nearest primitive is the list, and its rules are in tension with a payroll register in a specific and citable way.

M3 says both of the following, on different pages of the same file. §Usage: "List items can contain multiple actions at once, like selection, icon buttons, overflow menus, and more" (line 442), and §Slots permits a selection control in the leading slot alongside action elements in the trailing slot (lines 193, 207). But §Behavior → List selection modes states, as body-text rules rather than captions, that **single-select, multi-select and single-action list items alike "Can't have secondary nested actions"** (lines 613, 623, 631), that "a list can have only one selection mode at a time" (line 92), that "for selection lists, use only one selection interaction per list item" (line 211), and that in a multi-action list "the list item as a whole isn't selectable; only the individual actions are" (line 724).

A pay-line row typically needs a row checkbox **and** several per-row actions **and** several right-aligned numeric columns at once. Under §Usage that is fine; under §Behavior it is not, because multi-select forbids secondary nested actions and multi-action forbids the row itself being selectable. **M3's list documentation contradicts itself here, and the mode table is the operative half — so a row that is both multi-select and multi-action has no M3 mode.** A list item also caps supporting text at three lines. M3's card-collection guidance goes further in the wrong direction: filter and sort options must be placed **outside** the collection, which is the opposite of a column-header sort.

**Resolution.** The table is ours to design, and the keyboard half is further along than the previous draft said. From M3 we take the list keyboard model (Tab into the collection, arrows within, wrapping at each end), the target floor with its separation rule (§2.10), the two-cues-for-selection rule, and the desktop checkbox-visibility rule from §2.9. **v4 already declares the grid keyboard contract**: the `composite-grid` profile in `policy/interaction/keyboard.mjs` names `Tab, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End, Enter, F2`, one roving tab stop, two-dimensional traversal with an editor, and `suppliedBy: 'this-system'` — the profile with the least library backing and the most exposure, and its `PROFILE_COVERAGE` entry says so. Everything else — column headers, sort state, resize, freeze, pagination, cell focus, virtualisation, row-selection header — comes from WCAG and the ARIA Authoring Practices, consistent with M3's own instruction to use semantic HTML and standard platform controls.

### 3.3 Desktop-first: invert the authoring order, keep the breakpoints

M3 says start with mobile. We invert this and design the expanded/large data view first, then decide what collapses. Keeping M3's breakpoints while inverting the order is coherent, because the breakpoints describe available window width and carry no authoring direction of their own.

**ASSUMED, and it is a product decision M3's layout guidance does not make for us:** multi-column payroll tables and forms with legal consequence should not be reflowed into a 599px single pane at all. The honest mobile scope is a read-mostly subset. M3 treats compact as the default case; for us it is a different product surface — **and it is a surface that still needs a navigation model, which is why §3.4's rejections are scoped rather than global.**

Desktop-first is a *layout* decision. It is not an input decision, and §2.10 keeps the two apart.

### 3.4 The FAB and the mobile-first patterns

The FAB is illustrated as the canonical `primary-container` element and carries a rule worth naming because it is genuinely wrong for us: "If the action represented in the FAB is unavailable, the FAB shouldn't appear." In a permissioned payroll app a vanished action is usually worse than a disabled one, because the user needs to know the action exists and why it is closed to them. M3 also grants FABs a contrast exemption on the grounds of standalone prominence — an exemption that must not be borrowed for anything in this product.

**This is the same decision as §2.9's disabled-focusability divergence, seen twice.** M3 says a disabled component cannot be focused; we keep focus on it. An action nobody can reach with a keyboard cannot explain why it is closed, so the two positions are one position: closed actions stay present, stay reachable and stay legible.

**Rejected inside the dense data product**, and the scoping matters because §3.3 concedes a compact read-mostly surface: bottom navigation, bottom sheets as a primary surface, the navigation drawer (which M3 has itself downgraded to "no longer recommended" — see §2.13), swipe-to-reveal, long-press selection mode, pull-to-refresh, predictive back, and the whole reachability model. **If the compact surface is built, its navigation is decided then, from §2.13's ladder, and not inherited from these rejections.**

### 3.5 Where M3's guidance assumes a phone without saying so

Four places worth flagging because each arrives with a plausible M3 citation attached:

- **48dp as the governing target.** It is derived from "about 9mm, regardless of screen size" — a finger argument. For pointer input M3 *recommends* 44x44dp ("Consider making pointer targets minimums 44 x 44dp", immediately after noting the number comes from iOS), and even its own dense-desktop concession is 40dp for a 20dp symbol. WCAG specifies 24 CSS px. Taking 48 as the floor for every row action would inflate row height enough to defeat the density M3 endorses for data tables — but sitting at 24 obliges us to carry the 8dp separation rule that makes 2.5.8's spacing exception available. See §2.10 and §6.13.
- **Two panes at 50/50 at medium.** M3 limits two panes at medium to lower-density content, which is not us. Take the single-pane recommendation, not the 50/50 rule.
- **The 412dp fixed pane.** A handset width reused as a pane width by analogy — and M3's own note records that it contradicts the 400dp side-sheet maximum.
- **Cards cannot scroll internally.** A mobile rule that M3 itself carves out for desktop.

---

## 4. What M3 does not give us at all

Each gap below is real — either M3 publishes nothing, or what it publishes is wrong for a product with legal consequence. The layer that must fill it is named. Rows that the previous draft listed here and that M3 in fact publishes have moved into §2; what remains is genuinely absent.

| Gap | Why M3 has nothing | Which layer fills it |
|---|---|---|
| **Data table semantics** — column headers, sort announcement, row selection header, cell focus, pagination, freeze, virtualisation | M3 defines "data table" in one sentence with no guidance, and its list modes have no shape for a selectable multi-action row | Component layer, from ARIA APG; the keyboard contract already exists as `composite-grid` |
| **Form-level error handling** — `aria-describedby` wiring, error summaries, focus management on submit, cross-field and row-level validation in a grid | M3's model is per-field and complete at that level (adopted in §2.15); it says nothing above the field | Component layer, from WCAG/ARIA |
| **Completion announcement for a backgrounded batch** — a payroll run that outlives the screen | M3 specifies the `progressbar` role and label (adopted in §2.15) but nothing about announcing completion or failure after navigation | Component + product layer |
| **Two-axis scrolling in a data grid** | M3 asks for one scroll direction under text scale, vertical preferred; a wide payroll table cannot give it | **Product decision owed** — see §2.10; the honest answer is a documented divergence with a keyboard route to every column |
| **Session timeout** | absent from the whole corpus | Product layer |
| **Money presentation** — decimal alignment, currency affix, negative representation, display rounding | M3 says "use tabular figures" and stops | Token layer (a numeric font-feature token) + component layer |
| **Locale number and date formatting** | M3's rules are American English and would render an `id-ID` salary wrong | Product layer, from ICU |
| **Statutory colour semantics** | M3 offers the custom-colour shape but no domain roles | Token layer — **already done**: `statutory-container` exists (container half; §2.1) |
| **Permission-driven affordance** — disabled with a reason, not hidden | M3 says hide the unavailable action, and says a disabled control cannot be focused | Product layer; contradicts M3 deliberately, twice (§2.9, §3.4) |
| **Reversal and immutability UI** — correct by reversal, never by patch | absent | Product layer |
| **Effective-dated range editing** — half-open, non-overlapping | absent; M3's date-entry rules (§2.15) cover the field, not the range | Product layer |
| **Tenant and legal-entity context switching** | absent | Product layer |
| **Audit and evidence surfaces** | absent | Product layer |
| **Grid, column and gutter values** | the layout files give column counts only in figure captions | Deferred until a consumer exists — `layout.mjs:11-16` states the reason |
| **Shadow values for elevation levels** | M3 states elevation tokens carry no shadows; each platform decides | Token layer — **already done** |
| **Disabled opacity, selected-row state layer** | no value appears anywhere in the corpus | Token layer — disabled done; selected-row has an existing answer to reconcile (§2.9, §6.4) |
| **Reduced-motion durations** | M3 names the behaviour, never `prefers-reduced-motion`, no reduced set | Token layer — **declared per role, not proved**; `reducedMotionFailures` is never called (§2.8, A3) |
| **Unsaved-work warnings** | *not a gap* — M3 specifies the confirm-on-discard dialog and §2.11's dialog-actions rule governs its buttons (`dialogs.md` line 261) | ADOPT at component layer |
| **A web component library** | Compose-first; web "in progress" | Component layer, entirely ours |

The pattern is worth stating once: **M3 is strongest exactly where we need it least specified (colour, contrast, type structure, the token model, the error and feedback models) and absent exactly where our product is hardest (tables, money, immutability, effective dating).** That is not an argument against M3. It is an argument for taking M3 as the design concept and never as the component specification.

---

## 5. The decade test

### 5.1 Stable enough to build on for ten years

These have survived two generational changes, are platform-independent, and are the parts M3 argues from first principles rather than from Google product convention:

- **The colour role grammar and the `on-` pairing guarantee.** Unchanged in substance since 2021, and the mechanism — contrast guaranteed by tone distance rather than checked pair by pair — is a mathematical claim, not a style position.
- **HCT and the tone-distance rule** (Δ40 → 3.0, Δ50 → 4.5). This is the cleanest thing in the corpus.
- **The token taxonomy**: reference, system, component; role plus context plus attribute plus value; tokens pointing at tokens, never at values. Dispositioned in §2.12.
- **Scheme, theme and mode as three distinct things**, and "a light scheme is not the same as a light theme."
- **The type scale structure** — five families at three steps, select what you need — even though the metrics have moved.
- **The state model**: two indicators, one layer at a time, states compose, focus is independent.
- **The accessibility floors** and the density-is-opt-in policy.
- **Window size classes as available-window descriptions**, and the separation of adaptive layout from density. v4 encodes the boundaries as part of the contract.
- **The separation of visual bounds from interactive target.**
- **The error, feedback and date-entry models** (§2.15) — they are ARIA and interaction rules, not styling, and they do not date.

### 5.2 M3 Expressive, or 2026-direction material, that could move

Everything here is opt-in by M3's own statement, and every item is currently rejected or absent in v4. None of it should enter the token file without a second decision.

| Thing | Why it could move |
|---|---|
| Motion springs | replaced easing-and-duration for components in May 2025; transitions were **not** converted and still run the legacy system, which M3 says will "eventually be updated" |
| Shape morph, the 35-shape library | "Web is not currently available" |
| Emphasized type styles | web availability listed Unavailable |
| The three added corner radii (20, 32, 48dp) and "fully rounded by default" | art direction, added May 2025 |
| Connected button group replacing the segmented button | a deprecation less than two years old |
| Navigation drawer downgraded to "no longer recommended" in favour of the expanded rail | same — **and §2.13 has taken the rail; only the drawer is rejected** |
| Bottom app bar downgraded to "no longer recommended, but is still supported" | same |
| Baseline lists downgraded to "not recommended" | same |
| The spacing token system | Compose-only; may or may not reach web |
| The expressive layout scaffold and new spacing system | announced May 2026, Compose-first |

### 5.3 Things that already moved once, and what that teaches

- **Feb 2023**: light-theme surface moved from tone 99 to 98, neutral palette chroma from 4 to 6, dark surfaces darkened, and elevation-based surface tinting was retired in favour of the five surface container roles.
- **Aug 2024**: `on-primary-container`, `on-secondary-container`, `on-tertiary-container` and `on-error-container` were made more colourful in light theme.
- **May 2026**: "window size class" was renamed "breakpoint."

None of these carry a version identifier — they are month-year entries in a What's New list. A scheme exported from an older M3 will silently disagree with a current one on exactly those roles, and the disagreement will look like a mistake.

**The lesson for us, and it is the repository's own recurring defect:** any number copied from M3 into our token file acquires a second source, and the two will agree until they do not. The defence is already built — the placement tables carry the M3 value and the verdict side by side, and the generator prints them — but it only defends the facts that are actually in a placement table. Appendix A1 is what happens to a number that is not, and Appendix A2 is what happens when a document quotes a count instead of deriving it.

### 5.4 What we would watch for

1. **Whether a first-party M3 web library ever ships.** If it does, the component-layer decision reopens. If it does not — the likelier case given Compose-first — nothing changes, because we never depended on one.
2. **Whether Expressive is absorbed into the baseline.** Compose 1.5.0 promotes the experimental APIs to stable. If Expressive stops being opt-in and becomes the default guidance, our rejections need restating rather than revisiting.
3. **Guidance drifting further into Compose idiom.** Already visible: the spacing tokens are Compose-only and the layout scaffold is documented against the Compose Ruler API.
4. **Another undated colour revision.** The two that have happened both touched roles we carry.
5. **Whether M3 ever publishes a data table.** If it does, we compare rather than adopt; ours will already exist.

---

## 6. What this implies for `tokens.json` and the policy files

Each item is marked **one-file** or **multi-file**, and names what would go red if it were done wrong. Any change to a policy file or the token file also requires regeneration: `pnpm gen:tokens && git diff --exit-code packages/design/generated` is **Rule 4**'s check and will go red on a source change that was not regenerated. That makes almost everything below multi-file in effect; the label refers to the change's own blast radius.

### Immediate — corrections to what already exists

**6.1 Reconcile the state-layer opacities with M3's published values.** **one-file** (`policy/interaction/states.mjs`). v4 declares 8/12/12/16 and calls it "today's M3-derived reference set"; M3 publishes 8/10/10/16. Either retune focus and pressed to 10%, or amend the comment to record the divergence and its reason. **What goes red if done wrong: nothing.** `assertStateLayers` enforces perceptual ordering, not values, by design — so both sets pass. That is precisely why this needs a written verdict rather than a check. If the values change, any `-hover` or `-pressed` role minted from them must be re-derived and `tests/color-pairs.test.ts` will go red on a pair that falls under its floor.

**6.2 Optionally add a `surface-tint` courtesy row — and do not call it a completeness gap.** **one-file** (`policy/foundations/pairing.mjs`) plus regeneration. The placement table declares its own population at `pairing.mjs:190-194`: "Every role m3.material.io/styles/color/roles names (read 2026-09-04): the 26 standard roles and the add-ons the page names." `surface tint` is named nowhere on that page; across the whole corpus it occurs once, on the elevation page, as a deprecation (`elevation.md` line 140). **The table is complete against the population it declares, and its completeness claim is exactly as wide as it reads.** `tests/color-pairs.test.ts:124` holds it to `>= 26 + 5` against that same population. A row would therefore be a courtesy entry for a role from another page, with verdict `absent` and the reason "deprecated by M3 in favour of elevation level tokens 0–5; elevation here is a surface rung plus a two-layer shadow." **Recommendation: skip it.** Adding it widens the declared population without widening the check, which is the second-source shape §5.3 warns about.

**6.3 Resolve the two dormant policy/token mismatches.** **one-file each**.
- `EASING_ROLES` declares `semantic.motion.easing.default`; the token file ships `semantic.ease.standard`, `.entrance`, `.exit`.
- `LAYER_ROLES` declares three roles including `transient` at `semantic.layer.transient`; the token file declares two, and its `$description` explains why the third is deliberately absent.

**What goes red if done wrong: nothing, today.** `assertMotionTokens` has zero call sites; `assertLayerTokens` is reached only through `assertStackingModel`, which also has zero call sites. Both would fail immediately if wired to the real registry. The fix is either to wire them and correct the paths, or to delete the stale declarations. See 6.16.

**6.4 Decide the selected-row fill — starting from the answer that already exists.** **multi-file** (`tokens.json`, `policy/foundations/color.mjs` role contracts, `policy/foundations/pairing.mjs` `COLOR_PAIRS`, plus regeneration). M3 publishes no selected-state layer value anywhere in the corpus — "selected" is named repeatedly as a combinable state and never defined. **But v4 is not empty here**: `style.mjs` `INTERACTION_STATES` already binds `highlighted` → `primary-container` (`data-highlighted`) and `checked` → `primary` (`data-checked`). **The first step is reconciliation, not minting**: decide whether a table row's selected fill is `highlighted`/`primary-container`, or a new root — and if a new root, say what `highlighted` then means. Minting a second selected pair without answering that creates exactly the two-sources-for-one-fact defect A1 is about. **What goes red if a new root is minted wrongly:** `tests/color-pairs.test.ts` if the pair misses 4.5:1 in either theme; the generator if the new root is placed against no M3 role and not declared in `XFORGE_ONLY_ROLES`; the CIEDE2000 check if the new surface is not distinct from its neighbours.

### Near-term — decisions this document makes that the token file does not yet carry

**6.5 Add a tabular-figures decision.** **multi-file** (a numeric font-feature token or a style word, plus whichever check owns it). M3 requires tabular figures "in tables or places where values may change often", and this is a payroll product — every column of currency depends on it. IBM Plex Sans supports the feature. **What goes red if done wrong: nothing today**, because no check owns font features. A check must arrive with the token, or this is a claim with no mechanical source — the exact shape of the 4px-grid defect that `typographyFailures` closes for type and that §2.3 and §2.6 still have open.

**6.6 Encode the language-height obligation, or record its absence.** **one-file** (`policy/foundations/typography.mjs`). M3's medium script category — Thai, Vietnamese, Khmer, Lao, Chinese, Tamil — needs roughly 7% more line height, and ignoring it "leads to overlapping text and broken UI elements." For a South-East Asian product this is the single most under-implemented number in the type area. M3 also identifies precisely which components break: those with fixed heights, built for the small category. That is our table rows and our chips. **What goes red if done wrong: nothing today.** The 4px grid check and the leading floors both pass at the Latin metrics.

**6.7 Bind component hit areas to a named input profile, and wire the separation check.** **multi-file, component + policy layer.** This is §3.1's risk stated as work, and it has two halves the previous draft collapsed into one:
- **Which token a component binds.** `ACCESSIBILITY_POLICY.target` already splits `pointer` (24px, tokenised, asserted) from `touch` (48px, prose only). A component must name which profile its hit area answers, and something must select between them — `@media (pointer: coarse)` / `any-pointer` is the web mechanism, and nothing in the design package matches either today.
- **That the two tokens stay distinct.** `assertVisualTargetSeparation` exists and is reached only through the dormant `assertSizingModel`, so **the compact-density risk is unguarded at the token layer as well as the component layer.**

**What goes red if done wrong: nothing, anywhere** — which is the finding. Wiring the separation check is a policy change; the binding needs a browser-level check (A11y-2 evidence).

**6.8 Take the icon-set decision.** **decision first, then multi-file.** If Material Symbols, then a grade token for dark mode (M3 specifies −25 for light-on-dark), an optical-size binding to `icon-size`, and a fill-axis convention for selected navigation all become token candidates. If not, the M3 icon principles still apply and none of those tokens are needed. **ASSUMED:** this is currently unmade and cheap to defer, but it should be deferred deliberately rather than by omission.

**6.13 Own the 8dp target separation rule.** **multi-file** (a `semantic.target.separation` token or a spacing role obligation, plus the check that reads it). This is not decorative: **WCAG 2.5.8's spacing exception is what lets a sub-24px target conform**, so M3's "targets separated by 8dp of space or more" is half the conformance argument for a row of icon buttons in a dense payroll grid. It is the price of §2.10's deliberate 24px floor. **Owner: the sizing/spacing policy. What would go red:** a row of actions closer than the separation floor, once a check reads the token — which is the check that must arrive with it.

**6.14 State the input-profile and direction axes as rules.** **one-file** (`policy/foundations/layout.mjs` header, or a short section here). Two axis facts have no home: window class governs layout while `pointer`/`any-pointer` governs the target floor (§2.10), and logical CSS properties are the direction rule while mirroring is deferred (§2.7). Both are decisions this document takes; neither has a line of code. **What goes red: nothing** — these are prose rules until 6.7 and 6.13 land.

**6.15 Decide where a date field's format hint lives.** **one-file or component-layer.** M3 puts the format in helper text that doubles as the field description (§2.15). Whether that is a token, a convention, or a `FormField` prop is a component-layer call — but it must be made before the first date field, because retrofitting a description relationship is the expensive kind of accessibility work.

### Deliberately not doing

**6.9 Do not add a grid, column, gutter or pane token family.** `layout.mjs:11-16` already states the reason in its own terms: importing M3's canonical layout vocabulary before we have a consumer "would create a policy that can only pass. The first real pane/grid consumer should bring that model with it." That reasoning stands on its own and needs no rule number; v4 has no rule about measured pain or second use cases, and citing one would be citing something that does not exist here.

**6.10 Do not build medium and high contrast levels yet — but stop calling the web incapable of them.** The switch is an OS accessibility setting on Windows, macOS, iOS and Android alike, and the user agent reports it as `prefers-contrast: more` and `forced-colors: active`. Part of the response is already designed: `focus.mjs` builds its indicator refusals around forced-colors and `elevation.mjs:13` marks shadow FRAGILE for the same reason. **The real cost is two more complete token sets**, and the real reason to wait is that no need has been named. This is a coverage question, not a new subsystem. **ASSUMED:** no need has been named.

**6.11 Do not adopt any of M3's three duration ladders.** There are three, not two: the legacy scale (50–1000ms), the spring-conversion durations published for web (150/200/300/350/500/650/750ms), and the spring tokens themselves. Encoding any of them beside v4's six-role semantic ladder would create two sources for one fact. The web conversion durations are the newest temptation, because they are the one motion artefact M3 aimed squarely at web — and they are also the ones that reach 750ms, above our 500ms maximum.

**6.12 Do not import the M3 shape scale, the spacing multiplier names, or the M3 easing names into any component API.** All three are already refused in policy with written reasons, and all three are the kind of thing that re-enters through a component prop.

**6.16 Decide, once, what to do with the dormant evaluators.** **multi-file.** Appendix A3 enumerates sixteen exported evaluators with zero call sites. There are only two honest endings: wire them to the generator (where `typographyFailures` and `motionFailures` already live) or delete them. Leaving them is the state `foundations/index.mjs:146-147` describes and the state this document was written believing had already been resolved. **This is not "nice to have":** three of this document's own comparison rows — radius containment, the 4px spacing rhythm, and reduced-motion behaviour — are claims with no mechanical source until it is done.

---

## Appendix: open findings from this pass

**A1. The state-layer opacities are a second source that has already diverged.** M3 publishes hover 8%, focus 10%, press 10%, drag 16% (`states.md` §State layers, figure caption). v4 declares 8/12/12/16 and describes it as "today's M3-derived reference set." No check can see the difference, because `assertStateLayers` deliberately enforces ordering rather than values — which is the right policy and also the reason the drift is invisible. This is the repository's recurring defect in its textbook form: two sources for one fact, agreeing until they do not, caught here only because both were read side by side. Fix per 6.1.

**A2. The colour counts in the previous draft were transcribed, not derived — and they were wrong.** The placement table holds **45** roles, 17 `ours` and 28 `absent`, counted by executing `pairing.mjs`; the draft said 44 and 27 in three places. `XFORGE_ONLY_ROLES` is 7, of which 6 are roots in `COLOR_ROLE_CONTRACTS` (20 roots) — `on-disabled` is a foreground, so the "root carries no M3 role" loop never reaches it. `surface-tint` was reported as the one M3 role with no verdict; it is not in the table's declared population at all, so its absence is not a completeness gap (see 6.2). **The lesson is the one §5.3 states: a count quoted in a freeze document must be derived at the time of writing, or it becomes exactly the second source it warns about.**

**A3. Sixteen exported evaluators have zero call sites, and four more are reachable only through them.** The previous draft named two and cited the tree's own header without reading the paragraph above it. `packages/design/policy/foundations/index.mjs:146-147` states the position plainly: *"Nothing was enforcing spacing, radius, sizing, stacking, layout or density against `tokens.json` before this commit, and nothing is now."* Line 141 gives the planted-violation proof: `space.4` at 15px generated cleanly, and so did `radius-sm` set larger than `radius-lg`. `packages/design/policy/interaction/index.mjs:60-62` says the same for the interaction tree: *"`stateFailures` and `focusFailures` are written to be called by the generator and are not called by it."*

Zero call sites across `packages/`, `apps/` and `tests/`:

| Evaluator | File | What is unproved |
|---|---|---|
| `radiusFailures` | `foundations/radius.mjs:231` | containment order, mode invariance to 0.001px |
| `spacingFailures` | `foundations/spacing.mjs:334` | the 4px rhythm |
| `spacingDensityFailures` | `foundations/spacing.mjs:469` | spacing under density |
| `sizingFailures` | `foundations/sizing.mjs:351` | control/icon/target geometry |
| `stackingFailures` | `foundations/stacking.mjs:305` | layer ranks against tokens |
| `layoutFailures` | `foundations/layout.mjs:428` | breakpoint and shell widths, incl. `nav-collapsed < nav-expanded` |
| `densityFailures` | `foundations/density.mjs:302` | direction: `compact <= default <= comfortable` |
| `reducedMotionFailures` | `foundations/motion.mjs:448` | **that the reduced-motion answers are true, not merely well-formed** |
| `stateFailures` | `interaction/states.mjs:493` | **that no emitted custom property uses a prohibited state word** |
| `focusFailures` | `interaction/focus.mjs:432` | the focus indicator against real tokens |
| `pairsBelowFloor` | `foundations/pairing.mjs:149` | (the pair floors are covered by `tests/color-pairs.test.ts` instead) |
| `assertColorModel` | `foundations/color.mjs:1418` | the colour model as a whole |
| `assertSizingModel` | `foundations/sizing.mjs:481` | — and with it `assertVisualTargetSeparation` (:453) |
| `assertSpacingModel` | `foundations/spacing.mjs:533` | — |
| `assertStackingModel` | `foundations/stacking.mjs:386` | — and with it `assertLayerTokens` (:264) |
| `assertMotionModel` | `foundations/motion.mjs:329` | — |

Also dormant: `assertMotionTokens` (`motion.mjs:289`), `assertRadiusTokens` (`radius.mjs:159`), `assertElevationModel` (`elevation.mjs:298`), `assertLayoutModel` (`layout.mjs:579`), and **`assertTouchTargetMinimum` (`accessibility.mjs:347`), whose default label names `semantic.target.touch-minimum` — a token path that does not exist** (§2.10).

What *does* run: `assert*Roles()` at import (`foundations/index.mjs:272-282`), which proves each table internally coherent and says nothing about a token; `assertAccessibilityPolicy`, `assertStateAxes`, `assertProhibitedNames`, `assertStateLayers`, `assertStateColorRoles`, `assertFocusIndicator`, `assertKeyboardCoverage` and `assertAtPairings` at import in the interaction tree; and, from the generator, `assertDensityAxis`, `assertTargetMinimum`, `typographyFailures`, `motionFailures`, `distinctnessFailures` and the elevation and colour placement checks. **Three checks this document cites as v4 strengths — reduced motion proved per role, the `active` prohibition that walks every name, and the visual/target separation — are in the dormant column.** A check that has never been able to fail is decoration. Fix per 6.16.

**A4. Six claims in this document have no mechanical source and will not go red if violated:** tabular figures (6.5), language-height line adjustment (6.6), the binding of component hit areas to an input profile (6.7), target separation (6.13), the radius containment and 4px spacing rhythm (unenforced per A3), and reduced-motion behaviour (declared, not proved). Each is named in §6 with the check that would need to exist.

**A5. Governance citations in the previous draft pointed at a repository that is not this one.** It cited "law 27", "law 30", "law 31", "law 18", "law 20", ADR-034 and evidence-register entries E37 and E41. v4's CLAUDE.md declares **six numbered Rules**, and Rule 6 reads "No architecture folder, no ADRs, no phases." There is no `.architecture/` directory in this tree and no file matching `*adr*`. The regeneration check is **Rule 4**; there is no v4 counterpart to laws 30 or 31, and §6.9's argument is now made from `layout.mjs`'s own words instead. The ADR-034/E37/E41 strings inside `color.mjs`, `pairing.mjs` and `generated/FOUNDATIONS.md` are inherited from the predecessor repository and name a register that cannot be opened here.

**Provenance.** M3 claims are cited to `.claude/llmx/m3/<file>` and its section or line. All v4 claims were read from disk on 2026-09-04 from `packages/design/generated/FOUNDATIONS.md`, `packages/design/policy/tokens.json`, and the policy modules under `packages/design/policy/foundations/` and `packages/design/policy/interaction/` — including `style.mjs`, `keyboard.mjs` and `assistive-technology.mjs`, which the previous draft did not read. Every count in this document was derived by executing the module or by grepping the tree, not transcribed. No verification command was run — this pass read files and made no change, so nothing in the Green loop applies to it.

---

REJECTED FINDINGS:

- **`§3.2` — "lists.md OVERCLAIMS: no prohibition on secondary actions in single-action or single-select modes appears anywhere; those are mode definitions in figure captions."** Rejected on the load-bearing half. `lists.md` §Behavior → List selection modes states, as body-text bullets and not captions, that single-select items "Can't have secondary nested actions" (line 613), multi-select items "Can't have secondary nested actions" (line 623), and single-action items "Can't have secondary nested actions" (line 631). The document's original claim was therefore correct and, if anything, understated — the prohibition also covers multi-select, which is the mode a payroll row's checkbox puts it in, so the specific combination the section calls out (row checkbox plus per-row actions) *is* disallowed by the mode table. The finding is right that §Usage line 442 and the §Slots lists say the opposite, and that the modes table also carries the one-selection-mode and non-selectable-multi-action rules it names. Those were added: §3.2 now cites both halves by line and states the resolution — M3's list documentation contradicts itself, and the mode table is the operative half. The finding's proposed replacement sentence would have removed a verifiable citation in favour of a weaker one.