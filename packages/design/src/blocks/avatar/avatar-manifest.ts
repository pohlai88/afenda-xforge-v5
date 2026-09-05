import type { BlockManifest } from "../manifest";

/**
 * The Avatar definition — what AF-CMP-AVATAR looks like, as data. The render
 * in avatar.tsx derives every class from this; R15 holds it equal to
 * ./avatar-contract.ts. size-8 (2rem) is the productive row rhythm — a live
 * structural default like the dialog's max-w-lg, not a minted role; the disc
 * clips its media, so the image needs no radius of its own.
 */
export const AVATAR_MANIFEST = {
  parts: {
    avatar: {
      base: [
        "relative",
        "flex",
        "size-8",
        "shrink-0",
        "select-none",
        "overflow-hidden",
        "rounded-full",
      ],
    },

    "avatar-fallback": {
      base: [
        "flex",
        "size-full",
        "items-center",
        "justify-center",
        "bg-surface-container-highest",
        "text-on-surface-variant",
        "type-label",
      ],
    },

    "avatar-image": {
      base: ["aspect-square", "size-full", "object-cover"],
    },
  },
} as const satisfies BlockManifest;
