# avatar

2026-09-05 — golden pair via CLI. Migrated.

## Changed

- `packages/design/src/components/avatar.tsx` — `@base-ui/react/avatar` (Root/Image/Fallback). Leftover scan: clean.

## Left alone

Consumers use `AvatarFallback` only (initials in the members table); `delayMs` → `delay` not applicable.

## Behavior changes

None.

## Verify by hand

`/acme/members` shows two-letter initials per row; contrast is the token fix from the axe run (`--muted-foreground` 0.52), unchanged by the migration.
