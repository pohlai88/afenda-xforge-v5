/**
 * AFENDA DESIGN LANGUAGE — AVATAR
 *
 * AF-CMP-AVATAR. The identity disc (ADR-016): the contract, manifest and
 * render live side by side in this folder, held equal by R15. Synthesised
 * 2026-09-05 from the components-matrix evaluation: the identity cell — a
 * disc beside a name/email stack — anchors every member row studied, and
 * this block is that cell's disc, scoped to what the members screens
 * observe today (contract-first is not future-first: no size axis, no
 * status dot, no group stack until a screen needs them).
 */

import type { ComponentContract } from "../contract";

export const AVATAR_CONTRACT = {
  anatomy: {
    avatar: {
      partClass: "container",
      purpose:
        "The identity disc: a fixed circle at the productive row rhythm that clips its media; one size until a screen observes another.",
    },
    "avatar-fallback": {
      partClass: "container",
      purpose:
        "The initials fill shown until the image resolves, and always when there is none: the neutral container pair, never an identity hue.",
    },
    "avatar-image": {
      partClass: "media",
      purpose:
        "The person's photograph, clipped by the disc; no colour of its own. Decorative beside a visible name (AF-CMP-AVATAR-001).",
    },
  },

  api: {
    sizes: {},

    states: [],

    variants: {},
  },

  behaviour: ["AF-A11Y-061", "AF-A11Y-092"],

  code: "AVATAR",

  do: [
    "derive the initials in the feature from the same display name the row shows",
    "give a lone avatar — no adjacent name — the person's name through the image alt",
    "compose a presence dot as an indicator part of the host component, never inside this block",
  ],

  dont: [
    "no identity hues or per-user hashed colours on the fallback (AF-CMP-AVATAR-003)",
    "no alt text repeating a name already visible beside the disc",
    "no size improvised at a call site — a new size is a contract change carrying its rhythm reason",
  ],

  exemplar: "apps/web/features/members/components/members-table.tsx",

  id: "avatar",

  intents: [
    "avatar",
    "identity",
    "profile picture",
    "initials",
    "member photo",
    "person",
  ],

  purpose:
    "The identity anchor of the language: a fixed disc showing a person's photograph or their initials, always beside — never instead of — their name in text.",

  rules: [
    {
      id: "AF-CMP-AVATAR-001",
      rule: "An avatar beside the person's visible name is decorative: the image carries an empty alt and the disc no accessible name of its own; standing alone, the image's alt is the person's name.",
      strength: "must",
    },
    {
      id: "AF-CMP-AVATAR-002",
      rule: "The fallback is anatomy, always authored — the person's initials from their display name; an empty disc is not an identity.",
      strength: "must",
    },
    {
      id: "AF-CMP-AVATAR-003",
      rule: "Identity is never a colour: the fallback draws the neutral container pair only. Per-user hashed hues are refused until the colour language mints measured identity pairs.",
      strength: "must",
    },
  ],

  sources: [
    {
      disposition: "adopt",
      id: "base-ui-avatar",
      note: "Root/Image/Fallback behaviour comes from @base-ui/react/avatar unchanged: the fallback renders until the image reports loaded, and again on error — no layout shift, no flash of an empty disc.",
      system: "Base UI",
    },
    {
      disposition: "adapt",
      id: "m3-list-avatar",
      note: "M3 specifies the avatar as list-item and chip anatomy — a leading disc with initials on a container pair — rather than a standalone component; that grammar is taken, sized to this table rhythm and flat per the geometry language.",
      system: "Material 3",
    },
    {
      disposition: "adapt",
      id: "shadcn-avatar",
      note: "Part naming is kept so migration is an import swap. The size axis, the AvatarBadge status dot and the group stack stay with the vendored layer until a screen observes them; the mix-blend edge ring is dropped — a boundary that changes composition per theme cannot be measured by R13.",
      system: "shadcn/ui",
    },
    {
      disposition: "adapt",
      id: "studio-identity-cells",
      note: "The identity-cell mechanic — a disc beside a name/email stack in every user-administration row, avatar stacks on pending invitations — grounds the single productive size; the stock-avatar CDN is refused, assets are the application's own (2026-09-05, the components-matrix evaluation).",
      system: "shadcn studio",
    },
  ],

  tokens: ["surface-container-highest", "on-surface-variant"],

  version: "1.0.0",
} as const satisfies ComponentContract;
