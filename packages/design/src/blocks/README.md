# Blocks — the governed component realization

A **block** is a component the Afenda Design Language governs (ADR-016).
Each block folder holds the component's whole truth — its Level-1 contract,
its manifest and its render, side by side. Screens consume blocks; blocks
are what the contracts lock.

## Why this directory exists

`../components/` is the shadcn CLI's write target — `pnpm dlx shadcn add
<name> -c apps/web --overwrite` lands there through the aliases, and a
refresh may overwrite any file in it. That is deliberate (it keeps
`shadcn diff` meaningful), which is exactly why governed code cannot live
there. **The CLI never writes here.** `../components/` remains the vendored
raw material; a block may compose those primitives or reach for
`@base-ui/react` directly.

## Shape

A block is **defined, not rendered**. One folder per component, and every
file in it carries the component's actual name — never `index`, never a
numbered file (R15 refuses a stray name).

```
blocks/
  contract.ts               the ComponentContract shape
  manifest.ts               the BlockManifest shape + classMap deriver
  dialog/
    dialog-contract.ts      the Level-1 contract: purpose, anatomy, rules,
                            admitted API and tokens, dispositions
    dialog-manifest.ts      the definition: parts keyed by data-slot, each
                            part's classes as ADL utility literals
    dialog.tsx              the render: derives every class from the
                            manifest; a data-slot string literal here is
                            refused (R15)
  ...
```

Import as `@xforge/design/blocks/<name>` — each block registers an explicit
entry in the package `exports` map **and** `apps/web/tsconfig.json` paths
(a `paths` target allows one `*`, so per-block entries are the mechanism;
add both lines when a block lands).

## Rules of the layer

- A block lands **with its contract**: `<name>-contract.ts` declares
  purpose, intents, anatomy (data-slot parts bound to `anatomy.ts` part
  classes), the finite public API (variants, sizes, states — each with a
  semantic reason), admitted colour roles, behaviour and accessibility
  rule references (`AF-CMP-<NAME>-NNN`), do/dont, exemplar, and sources
  with dispositions. The contract is the SSOT for what the component *is
  and may be*; the manifest is the SSOT for what it *draws* — the overlap
  is the check (R15), double-entry style, and R14 holds the contract's
  rule IDs to the grammar.
- A block writes **ADL vocabulary only** — the semantic utilities the
  Tailwind projection provides. No shadcn compatibility aliases: when a
  component becomes a block, its bridge lines leave `apps/web/app/globals.css`
  and R4 confirms they went unconsumed.
- Full Ultracite standards apply here. The relaxed upstream-style override
  is scoped to `../components/` and does not extend to blocks.
- The contract is held equal to the block by check (R15, minted with the
  first block), the same way R11 holds the styles to the foundation.
