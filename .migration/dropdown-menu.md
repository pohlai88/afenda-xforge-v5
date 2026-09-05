# dropdown-menu

2026-09-05 — golden pair via CLI. Migrated; one structural fix in the consumer.

## Changed

- `packages/design/src/components/dropdown-menu.tsx` — `@base-ui/react/menu`: Portal > Positioner > Popup; `DropdownMenuLabel` is `Menu.GroupLabel`. Leftover scan: clean.
- `apps/web/features/members/components/member-row-actions.tsx` — trigger `asChild` → `render={<Button … />}`; items `onSelect` → `onClick`; **the "Change role" label and its items are wrapped in `<DropdownMenuGroup>`** (member-row-actions.tsx:69). In Base UI a group label outside a group throws "MenuGroupContext is missing" and the whole popup fails to render — this was the only runtime break of the migration, caught by the unit tests and the last-owner e2e.
- `packages/design/tests/dropdown-menu.test.tsx` — trigger uses `render`; the keyboard contract (Enter opens with first item focused, ArrowDown moves, Escape closes and restores focus) passes on Base UI.

## Left alone

None.

## Behavior changes

- `DropdownMenuLabel` must be inside `DropdownMenuGroup` — any future menu that copies the Radix layout will crash at open. Flagged.
- Plain items close the menu on click (same as Radix). Checkbox/radio items would default to `closeOnClick=false` in Base UI — none used here.

## Verify by hand

`/acme/members` → "Actions for Ada Lovelace": ArrowDown/Up moves between "Make admin", "Make member", "Remove from workspace"; Escape returns focus to the ⋯ button; choosing an item closes the menu and toasts.
