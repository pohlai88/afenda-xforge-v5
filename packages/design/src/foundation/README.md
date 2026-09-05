# Afenda Design Language — Level 1

This directory is the **authority root** of the Afenda Design Language (ADL): the
design language expressed as TypeScript data, not prose. Every file here is
normative. Nothing here is implementation.

## The three levels

| Level | Name | Authority | Lives |
| --- | --- | --- | --- |
| 1 | language | normative — decides | this directory |
| 2 | implementation | implementing — realises | `../styles/`, `../blocks/` (governed components; `../components/` is CLI-vendored raw material) |
| 3 | governance | verifying — proves | `../../tests/`, `apps/web/tests/` |

There is deliberately no intermediate specification layer: Level 1 decides,
Level 2 implements, Level 3 proves. Level 2 must never depend on Level 3 at
runtime; Level 1 files import only other Level 1 files (type-only today).

Level 1 defines meaning and legal capability — principles, taxonomy, semantics,
public component APIs, invariants, forbidden combinations, provenance. It must
not contain CSS, Tailwind classes, React, or any literal value (colour, spacing,
radius, type metrics, durations, easings, shadows, z-indices). Those belong to
Level 2, where each lands with its measurement beside it.

## The domains

Canonical registry: `LANGUAGE_DOMAINS` in `00-principles.ts`. Every later
Level-1 file must belong to one of these domains.

| # | File | Code | Responsibility |
| --- | --- | --- | --- |
| 0 | `00-principles.ts` | `PRI` | Authority, philosophy, language grammar, provenance, cross-domain invariants |
| 1 | `01-tokens.ts` | `TOK` | Token tiers, categories, semantic indirection, contexts, dependency direction |
| 2 | `02-color.ts` | `COL` | Surface, content, action, status, border, tenant, and data-visualisation colour semantics |
| 3 | `03-typography.ts` | `TYP` | Text roles, hierarchy, emphasis, data and numeric typography, readable structure |
| 4 | `04-geometry.ts` | `GEO` | Spacing, sizing, density, targets, shape, icon geometry, elevation, stacking |
| 5 | `05-layout.ts` | `LAY` | Window, container, scaffold, pane, grid, composition, responsive and adaptive behaviour |
| 6 | `06-motion.ts` | `MOT` | Motion intent, transition relationships, temporal semantics, reduced motion |
| 7 | `07-interaction.ts` | `INT` | Interactive states, selection, focus, disclosure, dragging, modality, gestures |
| 8 | `08-accessibility.ts` | `A11Y` | Perceivability, operability, understandability, robustness, component a11y invariants |
| 9 | `09-content.ts` | `CON` | UX writing, labels, errors, internationalisation, formatting, bidirectionality |
| 10 | `10-components/*` | `CMP` | Per-component contracts: purpose, anatomy, states, public API, constraints (planned) |

> **Status:** domains 0–9 are authored at version 1.0.0; `10-components/` does
> not exist yet.

## How a domain file is shaped

Every domain file expresses the same skeleton (the `LANGUAGE_SECTIONS`
contract — a section may be empty only when the domain can prove the concern
does not apply):

1. `<DOMAIN>_LANGUAGE` — identity: `{ id, code, level, order, version, purpose }`
2. `<DOMAIN>_PRINCIPLES` — the domain's own principles
3. Taxonomy and semantics — the named concepts, roles, and relationships
4. Rule blocks — numbered, normative
5. `<DOMAIN>_PUBLIC_API` — what Level 2 may legally expose
6. `<DOMAIN>_FORBIDS` — forbidden combinations
7. `<DOMAIN>_SOURCES` + `<DOMAIN>_SOURCE_DISPOSITION` — provenance
8. `<DOMAIN>_IMPLEMENTATION_OBLIGATIONS` — what Level 2 owes
9. `<DOMAIN>_GOVERNANCE_REQUIREMENTS` — what Level 3 must prove
10. `<DOMAIN>_CONFORMANCE` — when the domain counts as realised

A reading note: the repo formatter sorts object keys alphabetically, so
**deliberate order lives in arrays** (`SURFACE_CONTAINER_ORDER`,
`DECISION_PRECEDENCE`, `LAYER_ORDER`, …), never in object key position.

## Rule identifiers

Every normative rule has a permanent ID: `AF-<CODE>-<NNN>` (three digits), or
`AF-CMP-<COMPONENT>-<NNN>` for component contracts. The grammar is pinned by
`DOMAIN_RULE_ID_PATTERN` / `COMPONENT_RULE_ID_PATTERN` in `00-principles.ts`.
IDs are permanent once published, never reused after deletion, and identify
policy — never implementation, filenames, or source-system terminology. A rule
carries a strength: `must` (required), `should` (deviation needs a documented
reason), `may` (permitted capability).

A design decision is stated once in its owning domain and referenced elsewhere
by its ID (AF-PRI-013). Same-named exports in two domains (`FOCUS_RULES`,
`STATUS_RULES`, …) are complementary statements from different domains, not
duplicates — each carries its own domain's IDs.

## Provenance

External design systems are evidence, not authority. Every borrowed concept is
registered in its domain's `_SOURCES` with an explicit disposition: **adopt**
(accepted as-is), **adapt** (intent kept, model changed for Afenda), **reject**
(considered and declined), or **defer** (relevant, no current contract).
Material 3 is the primary precedent (the spine); other systems (e.g. IBM Carbon
for productive typography) are cited where a domain draws on them. A Level-1
statement is an Afenda decision — never a transcription that smuggles in
external authority (AF-PRI-011).

## Contexts

Tokens resolve differently by context without ever changing semantic identity.
The six axes and their owning domains (`TOKEN_CONTEXTS` /
`TOKEN_CONTEXT_OWNERS` in `01-tokens.ts`):

| Axis | Owner | Examples |
| --- | --- | --- |
| `theme` | color | light, dark |
| `contrast` | accessibility | standard, increased |
| `density` | geometry | comfortable, compact, dense |
| `direction` | content | ltr, rtl |
| `script` | typography | latin, arabic, thai, han, … |
| `tenant` | token | default, tenant-defined |

Axes compose; resolution must be deterministic; interaction states (hover,
focus, …) are never context axes.

## When goals conflict

`DECISION_PRECEDENCE` — the earlier item wins:

safety → accessibility → semantic-correctness → task-completion →
interaction-clarity → information-clarity → adaptive-continuity →
tenant-expression → visual-expression

This is what stops tenant branding or aesthetics from silently weakening
semantics or accessibility.

## Consuming the language

```ts
import { DECISION_PRECEDENCE } from "@xforge/design/foundation/00-principles";
import type { TokenContext } from "@xforge/design/foundation/01-tokens";
```

The package exports map (`./foundation/*`) resolves these; keep
`apps/web/tsconfig.json` paths in sync if a consumer is added there. Everything
is `as const` data with derived types — importing a domain costs its data and
nothing else.

A capability is **conforming** only when all three levels agree: Level 1 admits
it, Level 2 implements it, Level 3 proves the implementation does not
contradict Level 1.
