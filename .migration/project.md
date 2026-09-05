# project

2026-09-05 — whole-project migration, Radix → Base UI, golden pair via the shadcn CLI (`components.json` style `radix-nova` → `base-nova`, then `shadcn add <component> --overwrite` per wrapper in dependency order: button, label, separator, avatar, badge, dialog, dropdown-menu, select). All eight wrappers were pristine (only Biome formatting differed from stock), so no three-way merge was needed.

## Dependency swap

`@base-ui/react` 1.8.0 added to the pnpm catalog and `packages/design`; `radix-ui` removed from `packages/design` after the last wrapper. `grep -rn radix` over the source tree: no references remain. Not touched: `sonner` (not Radix), `card`, `input`, `skeleton`, `table`, `field` (plain components).

## App-code sweep

Against `consumer-props.md`: seven `Button asChild` call sites → `render`; `DialogTrigger`/`DropdownMenuTrigger` `asChild` → `render`; menu items `onSelect` → `onClick`; Select handlers accept `null` and pass `items`; menu label wrapped in a group (runtime requirement, see dropdown-menu.md). Three design behaviour contracts (Dialog, DropdownMenu, Field) pass unchanged on Base UI.

## Final build

`pnpm check` (106 files), `pnpm typecheck` (3 packages), `pnpm test` (59), `pnpm build`, `pnpm --filter @xforge/web test:e2e` (9, incl. axe on every screen state) — all green after the swap. Playwright now always tests a production build (`pnpm build && pnpm start -p 3100`): Next 16 allows a single `next dev` per project, so the previous dev-server e2e collided with the developer's own server.

0 wrappers remain on Radix.
