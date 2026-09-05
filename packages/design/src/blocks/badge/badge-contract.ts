/**
 * AFENDA DESIGN LANGUAGE — BADGE
 *
 * AF-CMP-BADGE. The read-only classification chip (ADR-016): the contract,
 * manifest and render live side by side in this folder, held equal by R15.
 * Synthesised 2026-09-05 from the components-matrix evaluation: the
 * status-chip-per-row mechanic recurs through every user-administration
 * surface studied; the variant axis below is that mechanic said in measured
 * ADL pairs instead of per-domain colour picks.
 */

import type { ComponentContract } from "../contract";

export const BADGE_CONTRACT = {
  anatomy: {
    badge: {
      partClass: "container",
      purpose:
        "The whole chip: one element, fill or boundary plus label ink. Icons are svg children of the label ink, not stamped parts.",
    },
  },

  api: {
    sizes: {},

    states: [],

    variants: {
      error:
        "A failed or blocking state: suspended, failed, over limit — the error-container pair.",
      informative:
        "An informational state in progress: invited, syncing, in review — the informative-container pair.",
      neutral:
        "The default classification chip: the quiet neutral fill for facts with no outcome — a member role, a category.",
      outline:
        "The quietest tier: boundary only, for dense rows where any fill would shout.",
      positive:
        "A healthy or confirmed state: active, published, paid — the positive-container pair.",
      primary:
        "Identity emphasis — the workspace's own mark (the owner chip, a 'you' marker): the primary-container pair, never a status (AF-COL-061).",
      warning:
        "A state needing attention before it degrades: pending, expiring — the warning-container pair.",
    },
  },

  behaviour: ["AF-A11Y-069", "AF-A11Y-070"],

  code: "BADGE",

  do: [
    "map a domain vocabulary to variants once, as one Record in the feature — never scattered conditionals",
    "keep the text to a word or two; the surrounding cell explains, the badge names",
    "change the element through render (a real <a>, a <dt>) while the classes stay the block's",
  ],

  dont: [
    "no onClick on a badge — an interactive chip (filter, input) is a different component with its own contract",
    "no per-user or hashed colours; identity is the text, never a hue",
    "no icon-only badge: the text is the meaning (AF-CMP-BADGE-001)",
    "no notification dots or corner counts — that is an indicator part of its host, not a badge",
  ],

  exemplar: "apps/web/features/members/components/members-table.tsx",

  id: "badge",

  intents: [
    "status",
    "classification",
    "role chip",
    "tag",
    "state indicator",
    "badge",
  ],

  purpose:
    "The classification mark of the language: a short read-only text chip whose colour role reinforces — never carries — what the text says.",

  rules: [
    {
      id: "AF-CMP-BADGE-001",
      rule: "The badge's text carries its meaning; the colour role reinforces it and is never the only signal (AF-A11Y-069).",
      strength: "must",
    },
    {
      id: "AF-CMP-BADGE-002",
      rule: "A domain status wears the status variant whose semantic it is (positive, warning, informative, error); neutral, outline and primary never encode an outcome, and a status variant is never decoration (AF-COL-061, AF-COL-062).",
      strength: "must",
    },
    {
      id: "AF-CMP-BADGE-003",
      rule: "The badge is read-only: no click affordance, no hover presentation, no state layer. An interactive chip is a different component.",
      strength: "must",
    },
    {
      id: "AF-CMP-BADGE-004",
      rule: "The block draws only the colour roles this contract admits; a palette colour, alpha wash or arbitrary value is refused.",
      strength: "must",
    },
  ],

  sources: [
    {
      disposition: "adapt",
      id: "m3-assist-chips",
      note: "The chip anatomy (container fill or outline boundary, label ink) and the container-pair colour grammar are taken; every chip interaction is dropped — the ADL badge is read-only, and an interactive chip will be its own block. M3's own 'badge' (the notification dot and count on an icon) is a different organ and deliberately not this component.",
      system: "Material 3",
    },
    {
      disposition: "adapt",
      id: "shadcn-badge",
      note: "The flat span, useRender polymorphism and w-fit box are kept so migration is an import swap. The palette variants, alpha washes (destructive/10, hover recolours) and focus ring are refused: every pair here is one R13 measures, and a read-only badge has no hover or focus of its own.",
      system: "shadcn/ui",
    },
    {
      disposition: "adapt",
      id: "studio-user-admin-tables",
      note: "The status-chip-per-row mechanic of the user-administration and team-member blocks (datatable-component-04, account-settings-05) grounds the exemplar; their per-domain colour picks collapse into this semantic variant axis, and their palette utilities and opacity-composited tints do not enter the language (2026-09-05, the components-matrix evaluation).",
      system: "shadcn studio",
    },
  ],

  tokens: [
    "surface-container-highest",
    "on-surface-variant",
    "outline",
    "primary-container",
    "on-primary-container",
    "positive-container",
    "on-positive-container",
    "warning-container",
    "on-warning-container",
    "informative-container",
    "on-informative-container",
    "error-container",
    "on-error-container",
  ],

  version: "1.0.0",
} as const satisfies ComponentContract;
