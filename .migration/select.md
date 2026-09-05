# select

2026-09-05 — golden pair via CLI. Migrated; two consumer adjustments.

## Changed

- `packages/design/src/components/select.tsx` — `@base-ui/react/select`: Portal > Positioner > Popup, `alignItemWithTrigger` replaces `position`. Leftover scan: clean.
- `apps/web/features/members/components/members-filters.tsx` — `onValueChange` handlers widened to `(value: string | null)` (Base UI may pass `null`); `items={…}` maps passed to each `<Select>` so `SelectValue` renders the label ("Any role") on the server instead of the raw value.
- `apps/web/features/members/components/invite-member-dialog.tsx` — `items` map on the role select; `name="role"` still produces the form field the server action reads.

## Left alone

None.

## Behavior changes

- `onValueChange` signature is `(value | null, eventDetails)` — handlers typed for `string` do not compile; flagged for future selects.
- Without `items`, `SelectValue` shows the raw value until the popup has mounted once; both selects pass `items`.

## Verify by hand

`/acme/members`: open "Role", arrow to "owner", Enter → URL gains `?role=owner`, table shows 2 rows, "1–2 of 2". The invite dialog's role select submits its value with the form.
