# Blocks — the governed component realization

A **block** is a component the Afenda Design Language governs: the Level-2
realization of a `foundation/10-components/` contract (ADR-016). Screens
consume blocks; blocks are what the contracts lock.

## Why this directory exists

`../components/` is the shadcn CLI's write target — `pnpm dlx shadcn add
<name> -c apps/web --overwrite` lands there through the aliases, and a
refresh may overwrite any file in it. That is deliberate (it keeps
`shadcn diff` meaningful), which is exactly why governed code cannot live
there. **The CLI never writes here.** `../components/` remains the vendored
raw material; a block may compose those primitives or reach for
`@base-ui/react` directly.

## Shape

A block is **defined, not rendered**. One folder per component: the
manifest is the definition, the render derives from it.

```
blocks/
  manifest.ts        the BlockManifest shape + classMap deriver
  button/
    manifest.ts      the definition: base, variants, sizes as ADL utility
                     literals, and the slot identity
    index.tsx        the render: derives every class from the manifest;
                     a data-slot string literal here is refused (R15)
  ...
```

Import as `@xforge/design/blocks/<name>` (the package `exports` map and
`apps/web/tsconfig.json` paths both resolve it).

## Rules of the layer

- A block lands **with its contract**: `foundation/10-components/<name>.ts`
  declares purpose, intents, anatomy (data-slot parts bound to
  `anatomy.ts` part classes), the finite public API (variants, sizes,
  states — each with a semantic reason), per-part token bindings,
  behaviour and accessibility rule references (`AF-CMP-<NAME>-NNN`),
  do/dont, exemplar, and sources with dispositions.
- A block writes **ADL vocabulary only** — the semantic utilities the
  Tailwind projection provides. No shadcn compatibility aliases: when a
  component becomes a block, its bridge lines leave `apps/web/app/globals.css`
  and R4 confirms they went unconsumed.
- Full Ultracite standards apply here. The relaxed upstream-style override
  is scoped to `../components/` and does not extend to blocks.
- The contract is held equal to the block by check (R15, minted with the
  first block), the same way R11 holds the styles to the foundation.
