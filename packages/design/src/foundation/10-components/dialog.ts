/**
 * AFENDA DESIGN LANGUAGE — DIALOG
 *
 * AF-CMP-DIALOG. The first composite block (ADR-016): realised in
 * src/blocks/dialog/, held equal to this contract by R15.
 */

import type { ComponentContract } from "./contract";

export const DIALOG_CONTRACT = {
  anatomy: {
    "dialog-close": {
      partClass: "action",
      purpose:
        "The always-present dismissal affordance in the container's corner — anatomy, never a visibility boolean (§6.3). Composes the Button block; footer Cancel buttons stamp the same part through DialogClose.",
    },
    "dialog-content": {
      partClass: "container",
      purpose:
        "The modal surface: surface-container-high fill at the overlay shape, centred without transforms so the popup motion owns the transform channel.",
    },
    "dialog-description": {
      partClass: "supporting",
      purpose:
        "The supporting text; wired as the accessible description by the primitive.",
    },
    "dialog-footer": {
      partClass: "structural",
      purpose:
        "The action row: confirming action trailing-most, dismissive to its start (flips with direction).",
    },
    "dialog-header": {
      partClass: "structural",
      purpose:
        "The title-and-description stack at the M3 title-to-body rhythm.",
    },
    "dialog-overlay": {
      partClass: "scrim",
      purpose:
        "The scrim that mutes the screen behind the task; the scrim role carries its own opacity, and its motion is a fade alone.",
    },
    "dialog-title": {
      partClass: "label",
      purpose:
        "The headline naming the single task; the dialog's accessible name. A brief statement or question — never an apology, an alarm or an ambiguity (M3).",
    },
    "dialog-trigger": {
      partClass: "action",
      purpose:
        "The opening act; carries no classes of its own — it is rendered onto the Button block or another governed control.",
    },
  },

  api: {
    sizes: {},

    states: [],

    variants: {},
  },

  behaviour: [
    "AF-A11Y-128",
    "AF-A11Y-129",
    "AF-A11Y-130",
    "AF-A11Y-131",
    "AF-A11Y-132",
  ],

  code: "DIALOG",

  do: [
    "dedicate the dialog to one task; the title states it, the buttons state the acts",
    "open from a trigger rendered onto the Button block",
    "a pending submit disables the confirming action, never the dismissal",
    "let inline field errors stay inline; a dialog reports only failures of its own act",
  ],

  dont: [
    "no showCloseButton: the close affordance is anatomy, always stamped",
    "no third action that navigates away and leaves the task unfinished",
    "no low- or medium-priority information in a dialog — that is a toast",
    "no transform-based centring on the content: the popup motion owns transform",
  ],

  exemplar: "apps/web/features/members/components/invite-member-dialog.tsx",

  id: "dialog",

  intents: [
    "dialog",
    "modal",
    "form dialog",
    "confirmation",
    "critical information",
    "decision",
  ],

  purpose:
    "The interruption of the language: a modal surface dedicated to one task, scrimmed above everything, that holds focus until the task is done or dismissed.",

  rules: [
    {
      id: "AF-CMP-DIALOG-001",
      rule: "A dialog is dedicated to a single task and interrupts only for it; low-priority information goes to a non-blocking surface.",
      strength: "must",
    },
    {
      id: "AF-CMP-DIALOG-002",
      rule: "Dismissal is always available: Escape, the scrim, and the stamped close affordance survive every state; a pending operation disables the confirming action, never a dismissive one.",
      strength: "must",
    },
    {
      id: "AF-CMP-DIALOG-003",
      rule: "A dialog presents at most two actions — one confirming, one dismissive, confirming trailing-most; a lone action is an acknowledgement.",
      strength: "must",
    },
    {
      id: "AF-CMP-DIALOG-004",
      rule: "The close affordance is a declared anatomy part, always stamped; a prop that toggles a part's existence is refused (§6.3).",
      strength: "must",
    },
    {
      id: "AF-CMP-DIALOG-005",
      rule: "Every dialog stamps its title; the title is the accessible name, and an untitled modal is not a dialog of this language.",
      strength: "must",
    },
  ],

  sources: [
    {
      disposition: "adapt",
      id: "m3-dialogs",
      note: "Anatomy, colour roles (surface-container-high, on-surface, on-surface-variant, scrim), the 24/16/8dp rhythm (group/field/inline) and the action grammar are taken. Shape and elevation follow the ADL geometry language — the overlay shape tier and a flat surface — not M3's 28dp and shadow; the corner close affordance is adopted from the full-screen variant into the basic dialog, web idiom.",
      system: "Material 3",
    },
    {
      disposition: "adapt",
      id: "base-ui-dialog",
      note: "Focus trap, initial focus, Escape, focus return and the title/description aria wiring come from @base-ui/react/dialog unchanged. Enter/exit ride [data-starting-style]/[data-ending-style] through af-motion-popup and af-motion-veil at the overlay motion role — transitions, so a half-open dialog cancels smoothly.",
      system: "Base UI",
    },
    {
      disposition: "adapt",
      id: "shadcn-dialog",
      note: "The flat export surface and part naming are kept so migration is an import swap. showCloseButton is refused on both Content and Footer: a part either belongs to the anatomy or is composed by the caller — a boolean-gated slot makes anatomy conditional, which anatomy-as-data cannot express.",
      system: "shadcn/ui",
    },
  ],

  tokens: [
    "scrim",
    "surface-container-high",
    "on-surface",
    "on-surface-variant",
  ],

  version: "1.0.0",
} as const satisfies ComponentContract;
