import type { BlockManifest } from "../manifest";

/**
 * The Dialog definition — what AF-CMP-DIALOG looks like, as data. The render
 * in dialog.tsx derives every class from this; R15 holds it equal to
 * ./dialog-contract.ts. The M3 rhythm lands on the ADL scale:
 * 24dp container padding and body-to-actions gap -> group, 16dp title-to-body
 * -> field, 8dp between buttons -> inline; the shape is the ADL overlay tier.
 * The content centres with inset-0 + m-auto + h-fit, never a translate —
 * af-motion-popup owns the transform channel (AF-CMP-DIALOG dont).
 */
export const DIALOG_MANIFEST = {
  parts: {
    "dialog-close": {
      base: ["absolute", "top-item", "end-item"],
    },

    "dialog-content": {
      base: [
        "af-motion-popup",
        "fixed",
        "inset-0",
        "z-modal",
        "m-auto",
        "h-fit",
        "w-full",
        "max-w-lg",
        "flex",
        "flex-col",
        "gap-group",
        "rounded-overlay",
        "bg-surface-container-high",
        "text-on-surface",
        "p-group",
      ],
    },

    "dialog-description": {
      base: ["type-body", "text-on-surface-variant"],
    },

    "dialog-footer": {
      base: [
        "flex",
        "flex-col-reverse",
        "gap-inline",
        "sm:flex-row",
        "sm:justify-end",
      ],
    },

    "dialog-header": {
      base: ["flex", "flex-col", "gap-field"],
    },

    "dialog-overlay": {
      base: ["af-motion-veil", "fixed", "inset-0", "z-overlay", "bg-scrim"],
    },

    "dialog-title": {
      base: ["type-component-heading", "text-on-surface"],
    },

    "dialog-trigger": {
      base: [],
    },
  },
} as const satisfies BlockManifest;
