# dialog

2026-09-05 — golden pair via CLI. Migrated; trigger consumers repointed to `render`.

## Changed

- `packages/design/src/components/dialog.tsx` — `@base-ui/react/dialog`: Overlay → Backdrop, Content → Popup (centered, no Positioner), `data-open`/`data-closed` hooks. Leftover scan: clean.
- `apps/web/features/members/components/invite-member-dialog.tsx` — `<DialogTrigger asChild><Button>…` → `<DialogTrigger render={<Button />}>Invite member</DialogTrigger>`. `onOpenChange={setOpen}` unchanged: Base UI passes `(open, eventDetails)`, the setter ignores the second argument.
- `packages/design/tests/dialog.test.tsx` — trigger uses `render`; the focus contract (focus inside on open, Escape closes, focus returns to the trigger) passes on Base UI.

## Left alone

None.

## Behavior changes

Radix `onOpenAutoFocus`/`onCloseAutoFocus` would be `initialFocus`/`finalFocus` — not used here.

## Verify by hand

`/orbit/members` → "Invite member": focus lands in the dialog, Escape closes it and focus returns to the button; submit a duplicate email and the field error is announced.
