# Prototyper UI, abstracted, and what it can do for Xforge v4

Read 2026-09-04 from the llms.txt corpus in this folder, against the v4 design package.

## What Prototyper UI is

A shadcn-model component library: 57 components you copy into your project as source
files, built on Base UI primitives, styled with Tailwind v4 utilities inside each
component, with OKLCH design tokens registered through Tailwind's @theme. Same
foundation as v4 (Base UI, Tailwind v4, cva, tailwind-merge, clsx), which is why it is
worth reading at all: nothing in it needs a runtime we do not already have.

Its ten stated principles, compressed:

1.  You own the code (copy-paste, no package dependency).
2.  Base UI native: behaviour, ARIA, focus and keyboard come from Base UI.
3.  Beautiful by default: OKLCH, multi-layer shadows, role-based surfaces, one
    signature easing curve, gradient primary buttons.
4.  Role-based surfaces: surface / overlay / field, each with its own shadow tier.
    Light mode shows depth with shadow; dark mode zeroes shadows and steps lightness.
5.  Shared CSS utilities for focus, disabled and invalid, so five components cannot
    drift into five focus rings.
6.  Flat named exports (Select, SelectTrigger, SelectContent) and a data-slot on
    every part, for greppability and outside targeting.
7.  Progressive disclosure: one-line usage first, full composition when needed.
8.  CSS-first animation, data attributes for state, motion-reduce respected.
9.  Types derived from Base UI props, variants from cva.
10. LLM-friendly by uniformity: read one component, understand all of them.

Around the library sit four things that are NOT the library: Compose (a JSON spec
format for AI-generated screens), Live Canvas (a CRDT-synced browser preview driven by
MCP tools), an MCP server, and Machine Mode (a plain-text view of any Next.js page).

## Where v4 already matches or exceeds it

- Same primitives, same styling stack. No migration would be involved in borrowing.
- v4's token model is stricter: primitive / semantic / component tiers, a generator
  that refuses contrast, typography and distinctness violations at build time, and
  components that SELECT a STYLE symbol rather than writing class strings. Prototyper
  writes utility classes directly in component files; v4 does not allow that.
- v4 has a density axis (default / comfortable / compact) that rebinds control size,
  icon size and spacing. Prototyper has none.
- v4's focus policy is written against WCAG 2.4.7, 2.4.11 and 2.4.13 with contrast
  and perimeter floors. Prototyper's is one utility with a fixed 2px ring.
- v4 already has one focus utility (focus-ring), one control floor (h-control), and
  the pressed state with theme-dependent direction. Prototyper's principle 5 is
  already law here.
- v4 has 38 semantic colour roles including a statutory tone; Prototyper has the
  standard seven (primary, secondary, muted, accent, destructive, success, warning,
  info).

## What can improve the UI and UX, in order of value

### 1. Role-based surface and shadow tiers (adopt the idea, not the values)

Prototyper names three surface roles and gives each its own shadow: surface (cards,
panels), overlay (menus, dialogs, popovers), field (inputs). In dark mode surface and
field shadows go to none and overlays get a 1px inset white glow plus a deep drop.
v4 has five elevation levels (flat, raised, floating, overlay, modal) keyed by height,
and two shadow colours. The gap: v4 has no FIELD tier, so inputs and cards share the
same depth treatment, and the dark-mode "inset glow instead of shadow" rule is not in
the token file. Adding a field elevation and a dark-mode overlay glow to tokens.json
is a one-file change the generator will check.

### 2. OKLCH plus derived states (worth a measured trial, not a rewrite)

Prototyper defines base and foreground colours by hand and derives hover (90% base +
10% foreground), soft variants (15% base on transparent) and nested surface tiers
with color-mix(in oklab). v4 hand-authors every hover and pressed colour as its own
token (primary-hover, primary-pressed, surface-lowest-hover, and so on). Deriving
would remove roughly a third of the semantic colour block and make a new tone (say a
second accent) cost two tokens instead of six. The catch, and Prototyper says it
themselves: ramps and foregrounds cannot be derived safely, and v4's generator
measures contrast on literal values, so derived colours would need the generator to
resolve color-mix before it can prove them. Trial on one role, measure, then decide.

### 3. The "soft" variant family

primary-soft and destructive-soft (15% tint, no fill) with their hovers. v4 has
primary-container and error-container which cover the same visual need, so this is a
naming question, not a gap. Do not add.

### 4. Signature easing

Prototyper's ease-out-fluid, cubic-bezier(0.32, 0.72, 0, 1), is an Apple-style
deceleration used for every overlay entrance. v4 has entrance / exit / standard from
Material. Neither is wrong; one is more distinctive. If v4 wants a recognisable feel
for menus and dialogs, this is the cheapest single token to change and the gallery
will show it immediately.

### 5. Component coverage to grow into

Prototyper's 57 against v4's 23 authored (plus 55 vendored shadcn files not yet
adapted). The ones v4 will need first for a SaaS and does not yet author:

    Tabs, Dialog, Sheet/Drawer, Menu, Select, Toast, Table, Tooltip,
    Breadcrumb, Segmented Control, NumberField, Skeleton

Prototyper's pages for each are complete API references with examples. Under v4's
rule 2 a component enters only when a screen uses it, so this is a reading list for
when a screen asks, not a backlog.

### 6. Progressive disclosure as an API rule

"The simplest usage is one line; advanced usage reveals more knobs." v4's Table
(four contracts, header slot required) and Field are already composition-first.
Worth adopting as a written rule for new components: every component has a one-line
form in its story before it has a full-composition form.

### 7. FormField + react-hook-form + zod

Prototyper's recommended form pattern wires Controller, Field, label, description and
error into one component. v4 has Field and TextInput but no form library and no
validation binding. A SaaS will need it. This is the one place where borrowing a
whole pattern, not just an idea, is justified.

## What NOT to take

- Utility classes inside components. Prototyper's className="flex h-9 w-full ..." is
  exactly the thing v4's STYLE contract exists to refuse. Borrow the shapes, never the
  strings.
- Gradient primary buttons. Three-layer gradient with a light/middle/dark ramp per
  brand colour. Visually distinctive, but it triples the tokens per tone and v4's
  contrast checker cannot measure a gradient.
- Compose, Live Canvas, Machine Mode, the MCP server. They are products beside the
  library. None of them makes a screen better; they make an agent's loop different.
  Not needed to improve UI/UX, and rule 6 (no new infrastructure) applies.
- The shadcn CLI registry install. v4 already vendors shadcn files and refreshes them
  from a scratch project; a second registry is a second source.

## The one-sentence version

Prototyper UI is v4's own stack with fewer rules and more components; take its
surface/field/overlay depth model, trial OKLCH derivation on one role, note the
easing curve, and use its component pages as the reference when a screen asks for a
component v4 does not yet have.
