import type { BlockManifest } from "../manifest";

/**
 * The Badge definition — what AF-CMP-BADGE looks like, as data. The render in
 * badge.tsx derives its classes from this; R15 holds it equal to
 * ./badge-contract.ts. One part: the key is the data-slot the render stamps.
 * Every variant shares the separator-width border (transparent on the filled
 * tiers) so the outline tier occupies the identical box; the outline variant
 * only recolours it.
 */
export const BADGE_MANIFEST = {
  parts: {
    badge: {
      base: [
        "inline-flex",
        "w-fit",
        "shrink-0",
        "select-none",
        "items-center",
        "justify-center",
        "gap-inline-tight",
        "overflow-hidden",
        "whitespace-nowrap",
        "rounded-full",
        "border-separator",
        "border-transparent",
        "px-inline",
        "py-inline-tight",
        "type-label",
        "[&_svg:not([class*='size-'])]:size-icon-compact",
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
      ],

      variants: {
        error: ["bg-error-container", "text-on-error-container"],
        informative: [
          "bg-informative-container",
          "text-on-informative-container",
        ],
        neutral: ["bg-surface-container-highest", "text-on-surface-variant"],
        outline: ["border-outline", "text-on-surface-variant"],
        positive: ["bg-positive-container", "text-on-positive-container"],
        primary: ["bg-primary-container", "text-on-primary-container"],
        warning: ["bg-warning-container", "text-on-warning-container"],
      },
    },
  },
} as const satisfies BlockManifest;
