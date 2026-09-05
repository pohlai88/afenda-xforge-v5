import type { BlockManifest } from "../manifest";

/**
 * The Button definition — what AF-CMP-COMMON-BUTTON looks like, as data. The
 * render in common-button.tsx derives its classes from this; R15 holds it
 * equal to ./common-button-contract.ts. One part: the key is the data-slot
 * the render stamps.
 */
export const COMMON_BUTTON_MANIFEST = {
  parts: {
    button: {
      base: [
        "af-interactive",
        "af-state-layer",
        "inline-flex",
        "shrink-0",
        "select-none",
        "items-center",
        "justify-center",
        "gap-inline",
        "whitespace-nowrap",
        "no-underline",
        "rounded-control",
        "type-action",
        "target-compact",
        "[&_svg:not([class*='size-'])]:size-icon-compact",
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
      ],

      sizes: {
        default: ["px-item", "py-inline"],
        icon: ["p-inline"],
        "icon-sm": ["p-inline-tight"],
        lg: ["px-field", "py-item"],
        sm: ["px-inline", "py-inline-tight"],
      },

      variants: {
        default: ["bg-primary", "text-on-primary", "state-layer-on-primary"],
        destructive: [
          "bg-error-container",
          "text-on-error-container",
          "state-layer-on-error-container",
        ],
        ghost: ["text-on-surface", "state-layer-on-surface"],
        link: ["text-primary", "hover:underline"],
        outline: [
          "border-boundary",
          "border-outline",
          "text-on-surface",
          "state-layer-on-surface",
        ],
        secondary: [
          "bg-secondary-container",
          "text-on-secondary-container",
          "state-layer-on-secondary-container",
        ],
      },
    },
  },
} as const satisfies BlockManifest;
