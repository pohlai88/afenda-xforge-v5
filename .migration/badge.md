# badge

2026-09-05 — golden pair via CLI. Migrated.

## Changed

- `packages/design/src/components/badge.tsx` — Slot replaced by `useRender` + `mergeProps` (non-button polymorphic component). Leftover scan: clean.

## Left alone

Consumers pass `variant` only.

## Behavior changes

None.

## Verify by hand

Role and status badges on `/acme/members` render with the same variants as before.
