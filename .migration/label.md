# label

2026-09-05 — golden pair via CLI. Migrated to a native `<label>` (Base UI has no Label primitive).

## Changed

- `packages/design/src/components/label.tsx` — bare `<label data-slot="label">`; Biome's `a11y/noLabelWithoutControl` is switched off for generated components in `biome.jsonc` (the control is always supplied by the consumer via `htmlFor`). Leftover scan: clean.

## Left alone

`field.tsx` (not Radix), consumers unchanged.

## Behavior changes

None.

## Verify by hand

Click the "Search" label on `/acme/members` — focus moves to the input.
