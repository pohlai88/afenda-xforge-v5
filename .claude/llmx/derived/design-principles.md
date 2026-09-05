# Design principles

Companion to `generated/FOUNDATIONS.md`, which owns every value. This file owns no value and
reproduces none; where a number matters it names the file or the check that holds it.
CLAUDE.md's six rules are not repeated here; they are cited by number. This is the narrative
FOUNDATIONS.md *should* point at — it points at `docs/design-system.md`, a path this repository
does not have, and item 7 is what makes the sentence true: what the tiers mean, what each
policy domain governs, and what is declared but not enforced.

## Who this is for

**Two readers, and they need different things.**

The first is the agent that writes the next component, by reading the last one. It needs to be
told what to write, and the human steering it needs to be told how to find out whether it was
written. So every principle carries the rule in one sentence, the failure it prevents, and how
it is checked today, at a named strength.

The second is the person the product is for: a payroll officer at four in the afternoon on
payroll day, in a bureau processing several companies. Dense columns of figures, statutory
facts — EPF, SOCSO, EIS, PCB — that are neither actions nor warnings, a form at the edge of
the screen that commits money, and eight hours already spent in here. That person is the
criterion for every judgement no check can make. It is why the status set carries — ahead of
any component that paints it — a `statutory` tone beyond the usual four (painted as info, a
legal ceiling reads as advice; painted as body text it disappears), why density may compress
space and never operability, and why a working surface is not required to delight — it is
required to be read once correctly.

**The order is where a defect enters, not where it lands.** An agent writes the Target and the
file shape first, so that is where a wrong component starts (1–3); the token model and the
closed projection are what it then selects from (4–6); the measured properties are where the
defect lands on the person at the screen (7–8); 9 is the three cross-cutting decisions made
once; 10 is the reading surfaces and the honest list of gaps. Four domains get no principle,
for one reason: radius, spacing, stacking and layout state real ladders — a corner names what
it contains, spacing names a relationship, and rendering order is a fact separate from depth,
which is how a system avoids 9999 — but each is held only as a table agreeing with itself, so a
principle here would promise an enforcement that does not exist. They are in the domain table
and in the gap list. Where the defect lands, criterion by criterion, is the obligations ledger
below.

## How to read "checked by"

The strengths are not interchangeable, and a citation without one is a filename pretending to
be a guarantee.

- **generator** — `policy/generators/tokens.mjs` refuses to emit, so `pnpm gen:tokens` itself
  exits non-zero and the `&&` in the loop's last command never reaches the diff. *What it does
  not prove:* anything about a file the generator does not read.
- **compiler** — `tsc --noEmit`, a fast-loop command, refuses at build time: a removed prop, a
  narrowed union, a type that omits an intrinsic prop. *Limit:* it proves nothing about what
  renders, and nothing about a file no build includes.
- **import-time** — an assertion that runs when `@xforge/design/policy` loads, so the generator
  and every test fail before they start. *What it does not prove:* that the table agrees with
  `tokens.json`, or with any component. It proves a table is coherent with itself.
- **unit** — a Vitest case in the `unit` project. `packages/design/tests/*`, `apps/web/tests/*`
  and `tests/unit/design-system-classes.test.ts` are all in it.
- **browser** — a Vitest case in the `browser` project, mounted in Chromium. *Limit, and it is
  the largest one here:* `packages/design/tests/browser.setup.ts` installs a stand-in
  stylesheet and deliberately not `tokens.css`, so nothing in Chromium has ever rendered a
  design token.
- **construction** — the alternative cannot be written: an export map, a null export, an
  `@utility` that is the only way to reach a property, a namespace with nothing left in it.
  Nothing runs; nothing needs to. This is the strongest kind and the easiest to mistake for
  prose.
- **prose** — a comment, a header, or this file. Nothing refuses a violation. The word is used
  honestly, because a check that is claimed and absent is worse than none: it stops the reader
  looking.

A second obligation rides on the same last command and is a different fact from a generator
refusal: rule 4 requires regeneration to be byte-identical, and *that* half is
`git diff --exit-code`, which compares the worktree to the index — so regenerated output staged
before the diff passes vacuously. The loop runs on an unstaged tree, and any instruction to
stage before running it is wrong here, wherever it comes from.

A check counts only when it states its population and has been watched refusing something. The
suites that hold the component set assert the set is non-empty first, because a glob over a
moved directory returns nothing and passes.

## The obligations ledger

What the system owes the person at the screen, what declares it, what proves it, and — the
column that matters — what nothing proves.

| Obligation | Criterion | Declared in | Proved by | Not proved |
|---|---|---|---|---|
| Text contrast | 1.4.3 | `contrast.text` in `interaction/accessibility.mjs`; the large-text exemption is declined | **unit** `color-pairs.test.ts` in both themes; **generator** `assertColorPolicies` over composition-derived pairs | a recipe placing an ink on a fill outside its declared pairs |
| Non-text contrast | 1.4.11 | `contrast.ui`; `contrast.inactive` as a house floor with its reason | the same suites; the outline, error, focus and on-disabled rows | rendering under forced-colors |
| Target size | 2.5.8 | `WCAG_MINIMUM.target`; the pointer profile adopts it, the touch profile is a house floor benchmarked from M3 without equating dp and px | **generator** `assertTargetFloor` in every density mode; **unit** `tokens.test.ts` | a rendered box; the touch profile is applied by nothing |
| Focus visible | 2.4.7 | `WCAG_FOCUS_REQUIREMENTS.visible`, evidence class `browser` | nothing — the Chromium project never loads `tokens.css` | all of it |
| Focus not obscured | 2.4.11 | `.notObscured`, evidence class `browser` | nothing | all of it |
| Focus appearance | 2.4.13 | `FOCUS_INDICATOR`; **import-time** `assertFocusIndicator` | **unit** `color-pairs.test.ts`: focus against the surfaces controls sit on, and focus as an alias of primary | the focused-versus-unfocused change contrast (`focusFailures` is uncalled); nothing in a browser |
| Keyboard | 2.1.1 | `PROFILE_KEYBOARD`: what each profile owes and who supplies it | **browser** `switch.browser.test.tsx`, `combobox.browser.test.tsx`; **import-time** `assertKeyboardCoverage` demands a declaration per profile | every `PROFILE_COVERAGE` row declares an empty spec list; no tab-stop walk |
| Focus management | 2.1.2, 2.4.3 | `PROFILE_KEYBOARD.modal.focus` in `interaction/keyboard.mjs`: trapped on open, returned to the trigger on close | the Base UI primitive's own behaviour, and nothing in this repository | that focus is trapped, that it returns to the trigger, or that it returns anywhere |
| Name, role, value | 4.1.2 | each adapter's `Contract` line | **unit** `status.test.tsx`, `alert.test.tsx`, `switch.test.tsx`; the Chromium suites | what a reader announces |
| Status messages | 4.1.3 | the `Status` contract and the `ALERT_TONE` table | **unit** `status.test.tsx`, `alert.test.tsx`: role and live-region attributes rendered, and refused as props | the announcement itself |
| Pause, stop, hide | 2.2.2 | `MOTION_ROLES`: the one loop answers `removed` | **import-time** `assertMotionRoles`; **generator** `motionFailures`; **construction** the `prefers-reduced-motion` block in `globals.css` | the resolved reduced value (`reducedMotionFailures` is uncalled) |
| Use of colour | 1.4.1 | `ALERT_TONE` binds an icon per tone; Field renders the error as text | **unit** `alert.test.tsx`, one case | every other component; that the bound icon is rendered |

## Principles

### 1. A screen cannot paint; the refusal is the type

**Rule.** A component's public Target accepts no `className` and no `style`, so the only way to
change what a component looks like is to change the component.

**Prevents.** A call site that styles past the language. Once one screen can pass a class,
every check downstream (contrast, density, theme) measures a page that is not the one rendered,
and review has to catch it by eye. `src/lib/props.ts` records the measurement it closed:
thirteen of fifteen Targets, carried from the previous repository.

**Checked by.** **compiler:** `src/lib/props.ts` (`NativeProps` omits both props at the one
place intrinsic props enter a Target). **construction:** `packages/design/package.json`
(`"./components/ui/*": null`, and `cn` absent from `exports`, so a screen cannot compose classes
either); the closed namespaces (`color`, `text`, `leading`, `font-weight`, `tracking`, `shadow`,
`radius`, `spacing`, `container`, `breakpoint` — `TOKEN_PACKAGES.closes` in
`generators/tokens.mjs`), which leave a screen's token-bearing class resolving to nothing.
**unit:** `adapter-schema.test.ts` ("takes intrinsic props through NativeProps, never
ComponentProps"; "names className only as the attribute it passes down");
`apps/web/tests/gallery.test.tsx` ("writes no class and no style"). Rule 3 is the
component-side half of the same boundary, held by `tests/unit/design-system-classes.test.ts`
("writes no design-bearing class literal"; "refuses an arbitrary design value on any prefix,
and only a value"). **What none of this refuses:** a screen writing a non-token utility on a raw
element. Business screens are *inside* Tailwind's scan base — `source("../")` pins it to
`apps/web` — so `opacity-50` on a `<div>` compiles and renders; see principle 5.

### 2. One file shape, and the checks read it

**Rule.** Every authored component is one file under `src/components/`, in one order: a
provenance header (Adaptee, Intent, Owns, Contract), the exported axis tables, the Target type,
and the Adapter function; it stamps `data-slot` on its root and `<root>-<part>` on any part it
renders, exports flat names, and spreads `...props` last.

**Prevents.** The pattern forking. The next component is written by reading this one, so a file
that departs from the shape becomes the shape for whatever copies it; and a check that reads
the shape (the header, the slot, the table) silently stops covering a file that lacks it.

**Checked by.** **unit:** `adapter-schema.test.ts` ("carries the four provenance labels"; "does
not re-export the vendored tree wholesale"; "exports no type built on an adaptee"; "reaches
primitives only through their adapters"); `gallery.test.tsx` ("every shown component's own
slot") reads the root slot of each file that has one. **prose:** flat exports (true of every
file today — no `Object.assign`, no dot-notation compound — and nothing forbids either); a slot
on every root but `ResourceBoundary`, which renders no element of its own and says why in its
header, and which the gallery check skips rather than refuses — the population is
`gallery.test.tsx`'s, not a count kept here; the numbered section markers (in about half the
files); and the variant-typing split, where some Targets derive their union from the exported
table (`keyof typeof BUTTON_VARIANT`) and others from `cva` (`VariantProps`). `'use client'`
appears only where the adaptee needs it; that is deliberate, not drift.

### 3. An axis is an exported table, and everything derives from it

**Rule.** Each word a component owns (a variant, a tone, a gap, a level) lives in one exported
table, and the prop type, the recipe, the gallery and the stories derive from that table and
never restate it.

**Prevents.** A second copy of the vocabulary. Two lists of the same three words agree until one
grows a fourth, and a state nobody frames is scanned by nothing while every check stays green.

**Checked by.** **browser:** `stories.browser.test.tsx` is the general one — it globs the
component modules, treats every SCREAMING_CASE plain-object export as an axis, and requires each
value to be framed by some story and stamped as its data attribute, so a table written tomorrow
is covered without an edit. Its `ATTRIBUTE_OF` records the one table whose attribute is not its
name (`SWATCH_ROLES` stamps `data-colour`) rather than widening the heuristic until nothing can
fail it. **unit:** `gallery.test.tsx` reads `ALERT_TONE`, `BUTTON_VARIANT`, `GRID_COLUMNS`,
`TEXT_TONE` and `TEXT_VARIANT` and requires every word rendered and stamped on the element that
wears it; `swatch.test.tsx` reads `SWATCH_ROLES` again at unit strength. **compiler:**
`button.test.tsx` records the mutation — a variant removed from the table fails to compile at
its call site, because the prop type is the table. **prose:** `stack.tsx`'s header claims both
the gallery's coverage test and the story suite's derive from `STACK_GAP`; the story-suite half
is true, and the gallery half is not — `gallery.test.tsx` derives from five tables and that is
not one of them.

### 4. Three tiers, two axes, and a mode rebinds a role

**Rule.** A primitive carries a value and no role; a semantic token names a role; a component
token names geometry no role covers and aliases a semantic role; nothing reaches past a role to
a primitive, the theme axis rebinds only colour, the density axis rebinds only geometry, and no
token is rebound by both.

**Prevents.** The semantic layer becoming optional decoration, because the quickest way to style
something is to reach past it. And a mode with nothing to rebind, or emission order deciding
what dark-plus-compact renders: two axes claiming one token would be resolved by whichever
block the generator wrote last.

**Checked by.** **generator:** `resolve()` refuses a cycle, a dangling alias and an illegal tier
edge; a mode override is refused if it invents a token or crosses the other axis's `$type`; the
intersection of the axes is refused; mode selectors are emitted qualified on the root so
specificity, not order or subtree, decides; aliases are preserved as `var()` references rather
than resolved. **import-time:** `ALLOWED_EDGES` is data in `vocabulary.mjs`, held by
`assertGroupNamesProjectUnambiguously`. **construction:** a component selects only what it
*changes*, because `page.tsx` declares family, body size, body weight, body leading and the page
ground once at the root and `apps/web/app/layout.tsx` wires it — forty-six components each
minting an individually reasonable font-size was the failure that replaced. **unit:**
`tokens.test.ts` ("what the generator refuses"; "the two axes compose", including the same
result with the mode blocks emitted in the opposite order; "the component tier", including the
ceiling that refuses growth without a deliberate raise).

### 5. The vocabulary is closed in both directions

**Rule.** Every STYLE symbol resolves to a class the application's own build emits, and no class
*in a closed namespace* names anything but a role: Tailwind's default palette and scales are
cleared, every semantic token is projected into a namespace or listed as unprojected with a
reason, and a colour reaches the page only through the channels its kind declares.

**Prevents.** Silence. A word that renders nothing, a class that falls back to Tailwind's
default scale, and an ordinary typo all produce the same output, which is a page that looks
nearly right.

**Checked by.** **unit:** `design-system-classes.test.ts` ("every STYLE symbol resolves to a
class the application build emits", compiled from `apps/web` the way `next dev` compiles it; "a
class naming no role is reported missing"; "the numeric spacing scale compiles to nothing; the
roles still compile"; "a narrowed role compiles only through its declared channels").
**generator:** `tailwindNameOf` throws on a token neither projected nor excluded — there is no
default branch; `assertTailwindProjection` and `assertNoUtilityShadowing` hold the projection
injective at the variable and at the class; `assertExclusionsAreCurrent` refuses a stale
exclusion. **construction:** `generated/twmerge.ts` is projected from the same tables, so `cn`
cannot delete a size role as a colour. **prose:** the closure is a closure of *namespaces*, and
every un-namespaced utility the build can emit stays reachable — `opacity-`, `rotate-`, `z-` and
`duration-` all compile, because each is computed from its own value rather than looked up in a
theme. `opacity-` is the one that ranks first: `states.mjs` says a global opacity is not a
disabled state, `focus.mjs` refuses opacity as a sole indicator, and principle 7 says disabled is
never opacity — three refusals by name, and nothing lexical behind any of them. The literal
scan's `THEMED` prefix list does not cover it, and the two guards `globals.css` names
(`no-raw-stacking-value`, `no-raw-motion-value`) do not exist in this tree. No authored file
writes one today.

### 6. Absence is a list with a reason

**Rule.** Whatever the system deliberately lacks (a story, a gallery group, a STYLE symbol, a
Tailwind utility, a Material 3 role or type style, a hover or pressed companion, a type token
no role names) is written in a list with its reason, and a slot that is merely missing is
refused.

**Prevents.** "Nobody decided" reading the same as "decided against". From the output, a gap and
a decision are indistinguishable unless the decision is recorded where the check reads. And an
exclusion outliving the thing it excluded, which keeps excusing an absence that ended.

**Checked by.** **unit:** `stories.test.ts` (`NOT_STORIED`, each reason held to a length);
`gallery.test.tsx` (`NOT_SHOWN`, likewise); `color-pairs.test.ts` and `type-placement.test.ts`
(every Material 3 colour role and type style carries exactly one verdict: ours, or absent with
a reason). **generator:** `assertStyleNames` (every colour root is named or `{ omit: reason }`,
and the manifest carries an `omitted` list); `tailwindNameOf` and `assertExclusionsAreCurrent`;
`assertColorRoleContracts` (a companion is a reference or `NONE`, never omitted);
`assertTypographyCoverage` (a type token is a role's field or a shim with a reason, and a shim a
role adopts is refused as stale). A reason's length is checked; its truth is review.

### 7. Colour is applied in declared pairs, measured in every theme, and never carries meaning alone

**Rule.** An ink sits only on the fills declared for it; every pair is computed from the token
file in every colour mode against the floor its kind names; hover, pressed, invalid and disabled
are explicit fills, never opacity; two surfaces that must be told apart are measured apart; and
a tone reaches the reader through an icon or a word as well as a hue.

**Prevents.** Contrast known only after a browser saw it, and a composite the token graph cannot
measure — a translucent state layer has no fixed luminance, so every ratio computed from it
describes a colour that is not what renders. The muted ink sat on the danger tint below its
floor for a day because nothing said which fills it was for. For the reader at four o'clock:
a refused write and a failed write rendered as the same pixels, and a statutory fact and a
warning collapsing into one tint on a dark ground.

**Checked by.** **unit:** `color-pairs.test.ts` (`COLOR_PAIRS` from `foundations/pairing.mjs`:
every pair in light and dark — including the invalid field's outline against the surfaces fields
sit on — and the pair the browser once found); `alert.test.tsx` (every tone renders the *role*
its row declares; the icon is proved *declared* per row, and that it is rendered is proved by
nothing). **generator:** `assertColorPolicies` (every semantic colour role has a policy; pairs
are derived from composition contexts rather than listed; alpha is refused on a measuring kind;
a failed pair is thrown), `assertRampsDescend` (a primitive ramp that stops descending fails
generation), and `distinctnessFailures` (the declared surface and status pairs, in every mode —
contrast never measures surface against surface). **import-time:** `assertColorPolicyKinds`, so
a misspelled kind cannot fail open. **unit:** `tokens.test.ts` ("the disabled state is measured
rather than composited"; "colour role contracts"; "colour channels"). The floors live in
`interaction/accessibility.mjs`, each citing its WCAG criterion or stating a house reason, and
are the first assertion in the graph because colour imports them. **prose:** meaning carried by
colour alone beyond Alert and Link (see the ledger's last row).

### 8. Density compresses presentation, never operability or hierarchy

**Rule.** The interactive target floor holds in every density mode and is a different fact from
a control's visual size; type is mode-invariant; and adjacent type ranks differ in size or
weight in every mode.

**Prevents.** Compact shaving the hit area — the mode where it would be shaved, for the person
clicking rows all afternoon — and a heading collapsing into body while every token stays
individually valid. Both shipped once.

**Checked by.** **generator:** `assertTargetFloor` per mode over `semantic.target.minimum` and
`semantic.control.min-size`, through `assertTargetMinimum` (which refuses a value in `rem`
rather than measuring through an assumed root); `assertDensityAxis` (two modes, symmetric,
spatial namespaces only, disjoint from theme); `typographyFailures` run per mode, with the line
box held to the grid whose premise `foundations/spacing.mjs` owns. **unit:** `tokens.test.ts`
("an interactive target below the accessible floor"; "a density mode shrinking the interactive
target below that floor"; "an interactive target stated in rem, which no root size may be
assumed for"; "a density mode that rebinds a token its sibling mode does not"; "the typography
floors hold at a premise, not universally"); and `heading.test.tsx`, which draws the distinction
the generator cannot — the kernel proves adjacent type *roles* differ, this proves a component's
level table *selects* different ones, and it exists because levels 2 and 3 once rendered
pixel-identical. **construction:** `@utility h-control` reads the density-bound floor as
`min-block-size`, so content can grow and the floor cannot clip; `@utility size-icon` reads the
density-bound icon size as `inline-size` and `block-size`, a fixed box by intent and the reason
forty-two icons stopped being 16px in every density. **prose:** the direction rule between
densities (compact no larger than default, default no larger than comfortable) is written in
`density.mjs` and evaluated by nothing.

### 9. Focus, disabled and state are decided once, in the language

**Rule.** There is one focus indicator, an outline; a state selects a declared role and
introduces no styling of its own; disabled dominates every other state by selector; invalid is
the error accent drawn as a line, not a colour a component picks; which pseudo-class means
pressed is a fact of the language; and `active` is not a state name.

**Prevents.** A ring assembled per component that loses a piece in one of them, a box-shadow
ring that vanishes in forced-colors mode for the people who depend on it, and stylesheet order
deciding which fill a disabled unchecked switch shows.

**Checked by.** **construction:** `@utility focus-ring` in `globals.css` is the only focus
*treatment*; `INTERACTION_STATES` emits every at-rest state with `not-data-disabled`;
`COMPANION_VARIANT` decides `pressed` once. **import-time:** `assertFocusIndicator` (mechanism,
activation, floors; box-shadow, background and opacity refused as sole indicators),
`assertStateAxes`, `assertProhibitedNames`, `assertStateLayers`, `assertStateColorRoles`.
**unit:** `design-system-classes.test.ts` ("every interaction state at rest excludes disabled,
so disabled needs no luck to win"; "the custom width utilities compile"); `color-pairs.test.ts`
("the focus ring derives from primary"). **prose:** that every focusable component selects
`STYLE.focus.ring` — true of all six today, and nothing lexical holds it, because the focus
colour root also emits `STYLE.outline.focus.border`, `.outline` and `.ring`, all three in the
manifest and all three proved to compile, so a recipe can assemble a second focus treatment
without ever touching `focus-ring`; the `active` prohibition over emitted token names
(`stateFailures` exists and nothing calls it); and `cursor-not-allowed`, a raw utility in the
recipes that write it rather than a symbol. **Read this principle against the ledger:** its
three focus obligations are the largest unproved region in the system, because the Chromium
project never renders the ring.

### 10. Two readers of every component, a browser where behaviour is on trial, and a written gap where there is neither

**Rule.** Beyond rule 2, which already owes every component a story and a test in the same
commit: the gallery and the stories are each held *equal* to the set of authored components —
both directions, over a population asserted non-empty first — every story mounts in Chromium,
behaviour that crosses an Adapter is proved in a browser, and where a check is owed and absent
the gap is declared where the next agent will read it.

**Prevents.** A component that looks right in the one place that frames it, and a suite that goes
green over an empty population.

**Checked by.** **unit:** `gallery.test.tsx` and `stories.test.ts` (a population asserted before
set equality, both directions); `keyboard-coverage.test.ts` (every component `PROFILE_COVERAGE`
names is an authored file); `style-words.test.ts`, which holds the reading surface's own
reporting — a group prints its recipe once, and a symbol is credited only when every class it
names is present, found when `font-heading` alone credited every heading with `title`. A second
reader is a reader only if what it says about a frame is true. **browser:**
`stories.browser.test.tsx` (every story mounts, discovered by glob so a new story is covered
without an edit); the per-component suites (`switch.browser.test.tsx`,
`combobox.browser.test.tsx`, `resource-boundary.browser.test.tsx`), with the mutation each was
watched failing on recorded in its header. **prose:** rule 2's test half is in standing
violation — eight of the twenty-three authored components have no test file today, the
population is the filesystem's rather than this file's, and nothing holds the set of tests to
the set of components the way the stories are held; keyboard conformance (every profile in
`interaction/keyboard.mjs` declares a gap, so the "every spec it names is a file" case holds
nothing yet); axe runs nowhere in this tree, and the three accessibility evidence levels in
`accessibility.mjs` are declared only.

## What the tiers mean

The token file has three tiers, and the generator refuses every edge between them but two.

**Primitive.** Raw material: a colour, a length, a ratio, a curve, named for what it is and
never for what it is for. A primitive has no role, so no mode can rebind it, and no stylesheet
or component may name one. That is what makes the semantic tier mandatory rather than polite.

**Semantic.** Every role a component may reach for: a surface and the ink that sits on it, an
accent and its container, a status backdrop (including `statutory`, for facts that are law), a
spacing relationship, a radius by what it contains, a duration by the kind of change, an
elevation by distance from the page, a stacking level by rendering order. A role names a
primitive (or another role); a mode rebinds the role; everything downstream follows through
`var()` references the generator preserves rather than resolves.

**Component.** Geometry a component needs that no role names: the switch track, its thumb, its
inset. Each aliases a semantic role, never a number, so density rebinds it. The tier projects
only into spacing utilities and sits under a ceiling that fails generation when exceeded;
raising the ceiling is its own commit with the measured count.

**Two axes.** Theme owns colour; density owns geometry. Each mode block rebinds a set of roles
under a selector on the document root, and the density modes must rebind the same set. The
default density is the absence of the attribute, not a declared mode. What a mode may not touch
is as much the design as what it may: density never touches type, colour, the container and
section spacing, or the target floor.

**The projection.** From the token file the generator emits the custom properties
(`tokens.css`), the Tailwind bridge (`tailwind-theme.css`, references not copies, so utilities
keep responding to a mode), the style contract a component selects from (`style.ts` and its
manifest), the merge groups `cn` needs (`twmerge.ts`), and `FOUNDATIONS.md`. A component writes
`STYLE.<group>.<word>`; the symbol is Xforge's word, the class is the role's, and `STYLE_NAMES`
in `foundations/style.mjs` is the one place the two meet.

## What each policy domain governs

`@xforge/design/policy` is one entry point over four trees. Every policy is `{ id, kind,
assert }` and a policy without an executable assert is refused as documentation; every
validator takes its subject as an argument so it can be shown a violation. The barrel runs no
assertions of its own: order comes from the import graph, not from a list. The last column is
the one that decides what a report may claim.

| Domain | File | Governs | Held by |
|---|---|---|---|
| Kernel | `vocabulary.mjs`, `define-policy.mjs` | tiers and their edges, the naming grammar and its injective CSS projection, admitted value shapes and the DTCG ledger, lifecycle, `NONE`, the component ceiling, the policy contract and the one-id-one-authority registry | import-time; generator for value shapes, unique names and the ceiling |
| Colour | `foundations/color.mjs`, `pairing.mjs` | kinds and the channels each may reach the page through, alpha permission, composition contexts that derive the pairs, root-and-companion contracts, primitive ramp order, surface distinctness, the pairing law, M3 role placement | generator and unit |
| Typography | `foundations/typography.mjs` | roles with five fields each, hierarchy per mode, mode invariance, the grid, shims with reasons, M3 style placement | generator and unit |
| Motion | `foundations/motion.mjs` | duration roles named for the kind of change, ceilings, a reduced-motion answer per role, one easing role plus an easing-intent catalogue that requires no token to exist | import-time; generator for ceilings and zero |
| Elevation | `foundations/elevation.mjs` | structural layers by rank, admitted separation means, shadow never as the sole boundary | import-time only; token existence unchecked |
| Density | `foundations/density.mjs` | the spatial axis: two modes, symmetric, allowlisted namespaces, disjoint from theme | generator; the direction rule is prose |
| Style contract | `foundations/style.mjs` | the words a component may select, colour roots named or omitted with a reason, the five interaction states and companion variants | generator, via `styleTree` |
| Spacing, sizing, radius, stacking, layout | `foundations/*.mjs` | relationship ladders, the grid and root premises, visual size versus interactive target and the off-grid exemptions, containment order, rendering order as a fact separate from depth, M3 window classes and content ceilings | import-time only — table shape, never resolved values |
| Accessibility | `interaction/accessibility.mjs` | the normative floors, adopted floors that cite a criterion or state a reason, two target profiles, three evidence levels that each say what they cannot answer | import-time; generator for the target floor per mode |
| Focus | `interaction/focus.mjs` | one indicator, an outline; refused mechanisms; WCAG as the obligation and M3 as benchmark-not-source | import-time only |
| States | `interaction/states.mjs` | five independent axes, `active` prohibited, ordered layer ratios, state colour roles with declared gaps | import-time only |
| Keyboard, assistive technology | `interaction/*.mjs` | what each profile owes, who supplies it, and what it does with focus; two required screen-reader pairings, with VoiceOver + Safari refused for want of macOS hardware rather than overlooked; the shape of a recorded session | import-time (`assertKeyboardCoverage`, `assertAtPairings`) and unit (`keyboard-coverage.test.ts`); no ledger exists |
| Projection | `projection/tailwind.mjs` | which roles cross into which namespace, exclusions with reasons, injectivity at the variable and at the class, primitives never crossing | generator |

## Declared but not enforced

Listed so a reader does not infer coverage from a file's existence.

- **Resolved-value evaluators with no caller.** `radiusFailures`, `spacingFailures`,
  `spacingDensityFailures`, `sizingFailures`, `stackingFailures`, `layoutFailures`,
  `densityFailures`, `reducedMotionFailures`, `stateFailures` and `focusFailures` are called by
  neither the generator nor a test. So the four ladders stand as tables agreeing with
  themselves — radius's containment order, spacing's relationship rungs, stacking's rendering
  order, layout's window classes and content ceilings; the reduced-motion answer each role
  declares is never proved against a reduced resolution; focus ring thickness is not measured
  per mode. A violation planted in spacing or radius generates cleanly.
  `foundations/index.mjs` describes seven of these as deleted; they are on disk.
- **Validators a policy file says a test calls.** `assertProfileKeyboard`, `assertFocusSurvives`,
  `sessionFailures` and `ledgerFailures` are called by nothing, and the sentences in
  `interaction/index.mjs` and `assistive-technology.mjs` saying a test exercises them name
  `tests/unit/interaction-policy.test.ts` and `tests/unit/at-session.test.ts` — two files this
  repository does not have. `assertKeyboardPolicy`, which wraps two of them, is uncalled as
  well. This is the worst shape in the list: not an absence, a claim.
- **A layer role naming a token the file lacks.** `stacking.mjs` declares a third layer whose
  token `tokens.json` does not hold; `assertLayerTokens` and `assertElevationTokens` are
  uncalled, so the policy passes.
- **Browser evidence.** The Chromium project renders without `tokens.css` by design, so every
  obligation in the ledger with evidence class `browser` is proved by nothing. The Playwright
  suites and the A11y-3 ledger that `A11Y_LEVELS` names are not in this repository.
- **Lifecycle.** States are declared and validated; no token declares one and nothing consumes
  them.
- **Deep imports into the policy tree.** Half of this is construction rather than convention:
  the export map declares `"./policy"` with no wildcard subpath, so a path past the entry point
  is refused by module resolution from outside the package — rule 5. What nothing refuses is a
  relative path *inside* `packages/design`, and a name exported by two modules being dropped
  silently by `export *`.
- **Un-namespaced utilities**, and `cursor-not-allowed` as a literal. See principles 5 and 9.
- **Rule 2's test half, keyboard conformance, axe, AT evidence, and colour-alone meaning.** See
  principle 10 and the ledger.
- **The Tailwind bridge's `@theme inline`.** Load-bearing (a plain `@theme` would freeze every
  utility at the base mode) and emitted by the generator, with no assertion behind it.
- **The Material 3 derivation rule for hover and pressed.** A rule for choosing the companion
  tokens; what ships is the explicit pair, and the rule itself is prose.

## Reading a component before writing one

An agent writes the next component by reading one. Read the one whose shape matches the job:
`button.tsx` for a Base UI primitive with one axis; `card.tsx` for an element with a recipe and
no axis; `switch.tsx` for a primitive whose words are adopted one by one and whose geometry
needed the component tier; `alert.tsx` for an axis whose values carry more than a class (an
icon, a role); `combobox.tsx` for an assembly done once over many primitive parts;
`heading.tsx` for a table that chooses the element and not only the appearance. Every one of
them says in its header what upstream offered, what was adopted, and what was refused until a
screen asks. That header is the documentation; there is no other page.

## Prototyper UI: disposition

Source: Prototyper UI, "Design Principles" (prototyper-ui.com), read 2026-09-04. Each of its
principles was put to two questions: can something here assert it, and is the person at the
screen better off? Where v4's enforced behaviour and the page conflict, the code wins. Where
the answer is an owner's call, STATE.md holds it and this table points there (rule 6) rather
than resolving it.

| Prototyper | Disposition | Why |
|---|---|---|
| 1. You Own The Code | ADAPT, on an open branch | No runtime abstraction, no CSS-in-JS, no provider — agreed. *What* is owned turns on a question STATE.md holds open: what the vendored shadcn tree is for. On the reference-pool branch, ownership is of the Adapter and never of the vendored file — null-exported, unscanned, refreshed from a pinned scratch project, never edited — and "copy the registry file and edit it" is the one edit v4 forbids, the fix being a new axis value in the authored component. On the other branch the vendored file becomes the component layer and is owned directly. And "you" is an agent here. |
| 2. Base UI Native | ADAPT | The six adapters with behaviour sit on a Base UI primitive and say so in their headers; `Link` is interactive too, selects the focus ring, and sits on a native `a`, which its own header states. Base UI's `data-*` states are mapped to declared roles once in `INTERACTION_STATES` — that is v4 consuming them. The page's further claim, that they are a PUBLIC styling contract, is refused: a Target takes no `className`, so no call site can reach them (row 6). Behaviour is proved per adapter in Chromium where a suite exists and declared as a gap where it does not, rather than inherited on trust. |
| 3. Beautiful by Default | REJECT as a principle; its mechanisms separately | Unfalsifiable as a principle. Stacked shadows are ALREADY here — every non-flat elevation is a key layer plus an ambient one — and what `elevation.mjs` refuses is a different, narrower proposition: shadow as the ONLY separator. OKLCH and `color-mix` are below. The signature curve is NOT TAKEN and open, and it is not lost to durations: `EASING_ROLES` holds exactly one token, so a distinctive curve is a one-token change the generator type-checks and the gallery would show immediately; nothing refuses it, and no role has asked for one. The intent catalogue beside it is vocabulary, requiring no token to exist. The three-layer gradient button is a fill no pair can measure. The residue — the default is the only appearance — v4 has by construction (principle 1). |
| 4. Role-Based Surfaces | ADAPT; the field tier is UNDECIDED | Its *surface* is our panel, its *overlay* is our above, and its *field* is not a layer at all. Surfaces are tiered by structural distance with a non-shadow separator required in every mode. Its nesting answer — three derived surface tiers for a card inside a card, the first thing a payroll screen hits — is not taken: `surface`, `surface-lowest` and `surface-container` are an M3 set a layer names, and `panel` fills from `surface-lowest`. The field tier is not this file's to refuse: STATE.md holds it, together with the dark overlay glow as ONE item, under the owner's open questions. The recommendation, for that decision: a field is separated by its outline held to the non-text floor, forty shadowed inputs on a payroll form is noise, and shadow is the separator forced-colours erases. |
| 5. CSS Utilities for Consistency | ADAPT | `focus-ring` is one `@utility` and, stronger than the page, a component cannot write the variant — it selects a symbol. `status-disabled`'s opacity loses to the measured disabled pair; its `pointer-events: none` half is disposed of by nothing here, and it is a real reader-facing call, because a control removed from hit-testing is also removed from the hover that would explain why it is dead. `focus-field-ring` is a second indicator geometry the focus policy exists to prevent. The page's third pattern, INVALID, v4 holds as a state rather than a utility: `invalid` selects the error accent, its outline is a measured pair, and Field renders the error as text. Worth taking: the cursor half — `cursor-not-allowed` is raw in the recipes that write it and deserves a symbol. |
| 6. Flat Exports, shadcn-Compatible | ADAPT, on the same open branch | Flat named exports hold in every file and `data-slot` on every root but one, both by practice with no check — which is why this is not ALREADY. `data-slot` as an external styling hook is refused outright: the slot exists so tests, the gallery and the browser setup can find the element. Whether "shadcn-compatible" is a *goal* is not settled here: `tokens.json`'s `$description` says the paired-role convention was adopted partly so a shadcn block "works here unmodified", and STATE.md holds the branch open. On the reference-pool branch it stops being one, because Targets expose no `className` and the tree is a null export. |
| 7. Progressive Disclosure | ADAPT | Level 1 holds by construction. Level 2 becomes "a knob exists when a screen asked for it" (rule 2): Combobox adopts the Base UI parts it needs and assembles them once; upstream's unused Button variants stay unadopted. Level 3, composition from primitives at the call site, is refused — but NOT by the null export, which governs the vendored tree only: `apps/web` declares no `@base-ui/react`, and a Target exposes no `className`, so a reachable primitive still could not be styled where it is used. Adding the dependency would therefore not open Level 3. The one checkable form of this principle — a component has a one-line form in its story before a full-composition form — is worth adopting and is not adopted; `stories.test.ts` already enumerates one story per component and could hold it (item 11). |
| 8. CSS-First Animation | ADAPT | CSS-only motion and reduced-motion support are the rule here too, and no JS animation library appears in any manifest. The mechanism differs: durations are named for the kind of change with a per-role reduced-motion answer and a house ceiling the generator enforces, and motion is neutralised with a non-zero token so `transitionend` still fires. The `animate-in`/`fade`/`zoom` utilities are not adopted (an entrance animation was dropped for naming a duration no role pairs with), and the per-component `motion-reduce:` variant loses to one global block, because per-component is what gets forgotten. The page's claim that the variant also maps to a data attribute is an unshown customisation. |
| 9. Type Safety | ADAPT | Strict TypeScript and generated variant unions: yes. Deriving props from Base UI's types: no, and by test — `adapter-schema.test.ts` refuses an exported type built on an adaptee, because that is the leak by which upstream vocabulary (including `className`) reaches a screen. Adopted words are listed by hand in the Target. The `keyof typeof` / `VariantProps` split is a uniformity gap named in principle 2, not a policy. |
| 10. LLM-Friendly | ADAPT | Home ground, with two substitutions. Held by a test: four provenance labels, `NativeProps`, no adaptee-typed export, primitives only through adapters, STYLE symbols instead of Tailwind literals. The file-name-to-component-name check exists, but its population is whatever `PROFILE_COVERAGE` names rather than every component — a narrow declared population, which the strength ladder says a check must state. And the page's naming claim is root-to-subpart (`Select` / `SelectTrigger`), which v4 answers with flat exports rather than adopts. Held only by practice: flat exports, `...props` last, a slot on every root. `'use client'` appears only where the adaptee needs it, a deliberate divergence from "every file starts with it" (principle 2). Refused: "`className` + `...props` on every component" is the opposite of v4, by test. Missing here: no MDX or per-component page — the header and the story are the documentation. |
| Colour space: OKLCH, and `color-mix()` derivation | Two questions; the derivation is DEFERRED — STATE.md | The DERIVED hover and pressed states are deferred and STATE.md owns that, so the condition is not restated here — only one fact the earlier comparison leaves out: the single-role measured trial it proposed was never run, so the deferral rests on provability rather than on a measurement. The colour SPACE is a separate question and is deferred nowhere, and the derivation argument does not reach it: an `oklch()` value is itself a literal. What reaches it is the parser — `luminance()` in `vocabulary.mjs` and `srgbToLab()` in `color.mjs` both read six hex digits and nothing else, so an OKLCH literal is unmeasurable today. It re-enters when they accept one. |
| Shadow system: surface / field / overlay tiers | ADAPT | Shadow tiers are bound to structural layers rather than component roles, and every non-base layer carries a separator that is NOT SHADOW — which is exactly what `elevation.mjs` derives, and all it derives. Whether that separator survives forced-colors is a stronger claim and is unproved: `above`'s non-shadow means are colour fills, which forced-colors overrides, and the ledger's 1.4.11 row says so. Shadow colour is an alias to a semantic role, so the dark treatment is the theme rebinding the inks; that is not an answer to the page's reason for zeroing dark shadows, which is that they do not READ on a dark ground. Field tier: see row 4. |
| Forms: FormField over react-hook-form and zod | DEFER — STATE.md | The comparison's strongest ADOPT, and the one place it argued for borrowing a whole pattern rather than an idea. STATE.md defers it until a screen has a form, which is rule 2 read forward; the validation axis in `states.mjs` and Field's text error are what stands in the meantime. Two of the components it would land on, `field.tsx` and `text-input.tsx`, are among those with no test. |
| The soft variant family; component coverage | REJECT; NOT A DISPOSITION | `primary-soft` and `destructive-soft` are a naming question rather than a gap: `primary-container` and `error-container` already cover the need. The component-count gap is not a disposition at all — rule 2 gates entry, so the page's per-component references are the reading list for the day a screen asks, and nothing is owed until then. |
| What we derive vs. define manually | ADAPT | The line is drawn at what the generator can measure, not at what looks safe: every colour that reaches the page is a literal because every one is measured, and the only derivation permitted is an alias the generator resolves and validates. Every companion is a declared reference or `NONE`, refused if missing. The specific derived column (hover, soft, surface tiers, borders) is the candidate list for the day `color-mix()` becomes measurable. |
| Comparison with other libraries | REJECT | Positioning, not a rule. What v4 borrowed is recorded where it was borrowed and asserted where a placement can be: the provenance header of each Adapter, the M3 placement tables, focus recorded as benchmark-not-source. That is stronger than a table, and it is why this row is not simply "already". |

## What this implies for `tokens.json` and policy

Concrete changes these principles would require, each marked by blast radius so they can be
decided one at a time. None is made here.

1. **Load the generated stylesheet in the Chromium setup** so the focus ring renders and 2.4.7,
   2.4.11 and 2.4.13 stop being proved by nothing. `browser.setup.ts` installs a stand-in
   deliberately; changing that premise is the decision. — *one-file* (the assertions that would
   then use it are separate work).
2. **Give `cursor-not-allowed` a STYLE symbol** in the interaction group, and stop writing it
   raw. — *multi-file* (`style.mjs`, regenerate, and the recipes that write it).
3. **Call the ten uncalled evaluators from the generator, or delete them**, and do the same for
   the four validators a policy file claims a test calls. Either answer is defensible; keeping
   them exported beside enforced-looking tables is not. — *multi-file*.
4. **Resolve the third stacking layer**: mint the token `stacking.mjs` declares or delete the
   layer, and call `assertLayerTokens` so the next one cannot drift. — *multi-file*.
5. **Rewrite `tokens.json`'s top-level `$description`** — but only after STATE.md's
   vendored-tree question is decided. It records shadcn "works unmodified" compatibility as a
   goal; rewriting it before the branch is chosen erases the evidence of what was open. —
   *one-file, blocked*.
6. **Fix the STYLE example** in `style.mjs` (and therefore the generated `style.ts` header),
   which cites a group and a class that do not exist. — *one-file*, regenerated.
7. **Repoint the generator's documentation strings** from `docs/design-system.md` (absent) to
   this file, from `pnpm generate` to `gen:tokens`, and drop `FOUNDATIONS.md`'s "Law 27" and its
   claim that a `generate` stage regenerates the document and asserts byte-identity — rule 4
   makes that a manual loop step and no such stage exists here. — *one-file*, regenerated.
8. **Settle the gallery half of `stack.tsx`'s header**: either add `STACK_GAP` to
   `gallery.test.tsx`'s derivation or stop the header claiming it. The story-suite half is
   already true and stays. — *one-file* either way; the choice is which fact is true.
9. **Correct `foundations/index.mjs`'s claim** that seven evaluators were deleted. Fold into
   item 3 if that is taken. — *one-file*.
10. **Add `opacity-`, `z-` and `duration-` to the literal scan** — `opacity-` first, because it
    is the one prefix three separate policies refuse by name — remove the two guard names
    `globals.css` cites that do not exist, and correct that file's header comment saying
    business screens are not scanned, which `source("../")` contradicts. — *one-file* for the
    scan, *one-file* for the comments.
11. **Lift the prose to checks**: flat exports, a slot on every root (with `ResourceBoundary`
    listed under rule 6 as a reasoned absence), every focusable component selecting
    `STYLE.focus.ring` rather than one of the three other focus-coloured channel symbols, and a
    `stories.test.ts` case that each component's first story frame passes no optional prop. —
    *multi-file*.
12. **Write the eight missing tests.** Rule 2 owes each component one and admits no reasoned
    absence, so this is a violation to close rather than a list to curate; if an exception list
    is genuinely wanted, it is an amendment to CLAUDE.md and not an entry here. A check holding
    the set of tests to the set of components, the way the stories are held, is the follow-on. —
    *multi-file*.
13. **Retire every citation of a file this repository does not have** — not only ADR numbers and
    `.architecture/` paths, but `tooling/gallery/proof.mjs` (`stories.test.ts`,
    `stories.browser.test.tsx`, `.storybook/main.ts`), `package-exports.test.ts`
    (`adapter-schema.test.ts`), `tooling/architecture/tests/source-universe.test.mjs`
    (`tokens.test.ts`), and the two phantom test files in item 3's second half. Two populations,
    two fixes: the authored files (headers, tests, policy, stories) are edited; the generated
    ones (`style.ts`, `FOUNDATIONS.md`) are not — their strings live in
    `policy/generators/tokens.mjs` and `policy/foundations/style.mjs`, and the fix is a
    regenerate (rule 4). — *multi-file*.
14. **Correct `09-xforge.md`**, which fails its own path check with seven missing paths, tells
    an agent to stage generated output before the diff (which makes rule 4 pass vacuously), and
    lists a three-command loop where CLAUDE.md lists five. — *one-file*.

One decision is made here and stands: two screen-reader pairings are required, NVDA + Chrome and
JAWS + Chrome, because one reading cannot separate a component defect from a reader quirk, and
`assertAtPairings` refuses a single-pairing table at import. VoiceOver + Safari is refused for
want of macOS hardware — a recorded residual risk rather than an oversight, on the reasoning
that a gate nobody can satisfy is a gate that gets waived. Two further questions look like
decisions and are not this file's to make: the `field` elevation tier with its dark overlay
glow, and `color-mix()` derivation. Both sit in STATE.md, both have an argument above, and both
need the owner rather than a reader.

REJECTED FINDINGS: none — every finding was checked against the tree and held. Two notes on how
they were applied, since neither is a rejection: the `statutory` finding (nit) was resolved in
place with a qualifying clause rather than by moving the point into the gap list, because the
original sentence was about the token status set, which does carry the role; and the three
missing Prototyper dispositions were landed as two rows (forms alone, the soft family and
component coverage together) rather than three, to hold the no-growth constraint. The
globals.css comment correction that finding 1 asks for in the same change is a code edit outside
this document and is carried as item 10.