# button

2026-09-05 — golden pair via CLI (`shadcn add button --overwrite`, style base-nova). Migrated; consumers repointed to `render`.

## Changed

- `packages/design/src/components/button.tsx` — now wraps the real `@base-ui/react/button` primitive (`ButtonPrimitive.Props`), no Slot. Leftover scan `grep -n "radix-ui\|@radix-ui"`: clean.
- Consumers, `asChild` → `render={<Link href=… />}`: `apps/web/app/(marketing)/page.tsx`, `apps/web/app/(auth)/sign-in/page.tsx`, `apps/web/app/not-found.tsx`, `apps/web/app/(app)/not-found.tsx`, `apps/web/features/members/components/members-pagination.tsx`.
- `packages/design/tests/button.test.tsx` — the render-prop case asserts `data-slot="button"` lands on the rendered `<a>`.

## Left alone

None.

## Behavior changes

None observed; a disabled Base UI button sets `aria-disabled` alongside `disabled` on native buttons only when `nativeButton` is false (default true here).

## Verify by hand

Tab to "Open demo workspace" on `/`, press Enter → `/acme`. Pagination Previous/Next render as links with the button look; the disabled one is not focusable.
