/**
 * AFENDA DESIGN LANGUAGE — COMMON BUTTON
 *
 * AF-CMP-COMMON-BUTTON. The first locked block (ADR-016): the contract,
 * manifest and render live side by side in this folder, held equal by R15.
 */

import type { ComponentContract } from "../contract";

export const COMMON_BUTTON_CONTRACT = {
  anatomy: {
    button: {
      partClass: "container",
      purpose:
        "The interaction target and its fill; the state layer, focus ring and invalid boundary attach here. Icons are svg children of the label ink, not stamped parts.",
    },
  },

  api: {
    sizes: {
      default: "The productive control rhythm for toolbars, forms and rows.",
      icon: "A square icon-only action at the default rhythm; requires an accessible name (AF-CMP-COMMON-BUTTON-002).",
      "icon-sm":
        "A square icon-only action in dense chrome (row actions, the shell); sits on the 24px target floor.",
      lg: "Marketing and empty-state prominence; never inside dense data chrome.",
      sm: "Dense chrome: pagination, filters, inline row actions.",
    },

    states: ["hover", "focus-visible", "pressed", "disabled", "invalid"],

    variants: {
      default:
        "The one primary action of a view region: the filled primary pair.",
      destructive:
        "A destructive act, quiet until confirmed: the error-container pair, never the full error fill at rest.",
      ghost:
        "A low-emphasis action in chrome; ink only, the state layer is its whole fill grammar.",
      link: "A navigation act presented inline with text; underline on hover is the affordance.",
      outline:
        "A secondary action beside a primary: outline boundary, surface ink.",
      secondary:
        "The tonal middle emphasis (M3 filled-tonal): the secondary-container pair.",
    },
  },

  behaviour: ["AF-INT-023", "AF-A11Y-034"],

  code: "COMMON-BUTTON",

  do: [
    "one default-variant button per view region; the rest step down",
    "a link that must look like a button wears buttonVariants on the real anchor",
    "icon-only sizes carry an accessible name",
    "a pending submit keeps focus: disabled plus focusableWhenDisabled",
  ],

  dont: [
    "no raw <button> in a screen — this block is the way",
    "no render={<Link />}: the Button enforces button semantics and never wraps a link",
    "no recoloured default for destructive acts; use the destructive variant",
    "no palette or arbitrary colour on any part",
    'no bare form button — Base UI injects type="button", so a submit says so',
  ],

  exemplar: "apps/web/features/members/components/members-pagination.tsx",

  id: "common-button",

  intents: [
    "action",
    "submit",
    "primary action",
    "secondary action",
    "destructive action",
    "icon action",
    "cta",
  ],

  purpose:
    "The single action target of the language: one element, one act, with emphasis graded by variant rather than by invented styling.",

  rules: [
    {
      id: "AF-CMP-COMMON-BUTTON-001",
      rule: "A view region presents at most one default-variant button; additional actions step down through secondary, outline, ghost or link.",
      strength: "must",
    },
    {
      id: "AF-CMP-COMMON-BUTTON-002",
      rule: "An icon-only button carries an accessible name (aria-label, or a visible name supplied through render).",
      strength: "must",
    },
    {
      id: "AF-CMP-COMMON-BUTTON-003",
      rule: "A destructive act uses the destructive variant; a recoloured default is not a destructive affordance.",
      strength: "must",
    },
    {
      id: "AF-CMP-COMMON-BUTTON-004",
      rule: "The Button never wraps a link: it enforces button semantics (Base UI). A navigation act that must look like a button wears buttonVariants on the real anchor; onClick-plus-router is not navigation.",
      strength: "must",
    },
    {
      id: "AF-CMP-COMMON-BUTTON-005",
      rule: "The block draws only the colour roles this contract admits; hover is the state layer at the governed opacity, never an invented tone.",
      strength: "must",
    },
  ],

  sources: [
    {
      disposition: "adapt",
      id: "m3-common-buttons",
      note: "Emphasis tiers (filled, tonal, outlined, text) and the state-layer hover grammar are taken; M3's five named button kinds collapse into the variant axis, and elevation stays flat per the geometry language.",
      system: "Material 3",
    },
    {
      disposition: "adapt",
      id: "base-ui-button",
      note: "Behaviour, focus handling, focusableWhenDisabled and the disabled state come from @base-ui/react/button unchanged. The render polymorphism does not extend to links: Base UI enforces button semantics and warns when a true nativeButton renders a non-button, so a link wears buttonVariants on the real anchor instead (AF-CMP-COMMON-BUTTON-004). Its className-as-a-function styling hook is refused — every class this block draws lives in the manifest, where Tailwind's scanner and R15 both read it.",
      system: "Base UI",
    },
    {
      disposition: "reject",
      id: "prototyper-button-gradient",
      note: "The three-layer gradient primary triples the tokens per tone and a gradient pair cannot be measured by R13.",
      system: "Prototyper UI",
    },
  ],

  tokens: [
    "primary",
    "on-primary",
    "error-container",
    "on-error-container",
    "secondary-container",
    "on-secondary-container",
    "on-surface",
    "outline",
  ],

  version: "1.0.0",
} as const satisfies ComponentContract;
