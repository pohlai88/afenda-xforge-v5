/**
 * AFENDA DESIGN LANGUAGE — ACCESSIBILITY
 *
 * L1.08
 *
 * Defines the accessibility contract of Afenda.
 *
 * Primary authorities:
 *
 *   - WCAG 2.2
 *   - WAI-ARIA
 *   - ARIA Authoring Practices Guide
 *   - CSS accessibility preference standards
 *   - Afenda interaction, typography, geometry, layout, and motion languages
 *
 * Baseline:
 *
 *   WCAG 2.2 Level AA
 *
 * Afenda additionally adopts selected stronger requirements where they
 * materially improve professional SaaS usability.
 *
 * This file defines:
 *
 *   - accessibility principles
 *   - conformance baseline
 *   - reusable accessibility requirement registry
 *   - semantic structure
 *   - accessible names / descriptions
 *   - name / role / state / value
 *   - keyboard operation
 *   - focus
 *   - target size
 *   - pointer / gesture / dragging
 *   - text contrast
 *   - non-text contrast
 *   - colour-independent meaning
 *   - text resize
 *   - reflow
 *   - text spacing
 *   - hover/focus content
 *   - reduced motion
 *   - forced colours / high-contrast resilience
 *   - forms and errors
 *   - transactional error prevention
 *   - status messages / live updates
 *   - tables and data grids
 *   - dialogs and overlays
 *   - authentication
 *   - time-dependent interaction
 *   - component accessibility contracts
 *   - Level-3 proof requirements
 *
 * Accessibility requirements ARE normative values.
 *
 * Therefore this file may define:
 *
 *   - contrast ratios
 *   - CSS-pixel accessibility minima
 *   - resize percentages
 *   - reflow dimensions
 *
 * Those measurements are accessibility requirements rather than
 * design implementation values.
 *
 * Authority:
 *   AF-PRI-004 Density without loss of operability
 *   AF-PRI-005 Adaptation preserves task and context
 *   AF-PRI-006 State is explicit and composable
 *   AF-PRI-007 Accessibility is intrinsic
 *   AF-PRI-010 Public UI APIs are finite
 *
 * Related language:
 *   02-color.ts
 *   03-typography.ts
 *   04-geometry.ts
 *   05-layout.ts
 *   06-motion.ts
 *   07-interaction.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

// =============================================================================
// IDENTITY
// =============================================================================

export const ACCESSIBILITY_LANGUAGE = {
  baseline: "WCAG 2.2 Level AA",
  code: "A11Y",
  id: "accessibility",
  level: 1,
  order: 8,

  philosophy:
    "Accessibility is part of component correctness, not an optional presentation mode.",

  purpose:
    "Define the minimum accessible behaviour and presentation required for Afenda interfaces to be considered conforming.",
  version: "1.0.0",
} as const;

// =============================================================================
// CONFORMANCE PROFILE
// =============================================================================

/**
 * WCAG 2.2 AA is the minimum release baseline.
 *
 * Afenda may adopt selected stronger requirements without claiming that
 * every application page conforms to all WCAG AAA criteria.
 */
export const ACCESSIBILITY_PROFILE = {
  aaaConformanceClaim: false,

  enhancedAfendaRequirements: [
    "strong-focus-appearance",
    "focus-restoration",
    "forced-colors-resilience",
    "reduced-motion-resilience",
    "enterprise-transaction-safety",
    "data-grid-keyboard-contract",
  ],
  normativeBaseline: {
    level: "AA",
    standard: "WCAG",
    version: "2.2",
  },
} as const;

// =============================================================================
// PRINCIPLES
// =============================================================================

export const ACCESSIBILITY_PRINCIPLES = [
  {
    id: "AF-A11Y-001",

    statement:
      "Accessibility is intrinsic to component semantics, behaviour, and presentation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-002",

    statement:
      "Native platform semantics are preferred when they accurately represent the required interaction.",
    strength: "must",
  },

  {
    id: "AF-A11Y-003",

    statement:
      "ARIA supplements native semantics when required and must not replace correct native semantics without reason.",
    strength: "must",
  },

  {
    id: "AF-A11Y-004",

    statement:
      "An ARIA role is a behavioural contract: the component must implement the interaction model expected for that role.",
    strength: "must",
  },

  {
    id: "AF-A11Y-005",

    statement:
      "Visual appearance, DOM semantics, keyboard behaviour, and programmatic state must describe the same component.",
    strength: "must",
  },

  {
    id: "AF-A11Y-006",

    statement:
      "Essential capability must not depend on one sensory characteristic, one input device, or one visual presentation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-007",

    statement:
      "Accessibility requirements remain invariant across theme, density, tenant, layout, direction, and script contexts.",
    strength: "must",
  },

  {
    id: "AF-A11Y-008",

    statement:
      "Automated accessibility testing contributes evidence but does not by itself prove accessibility conformance.",
    strength: "must",
  },

  {
    id: "AF-A11Y-009",

    statement:
      "A component that cannot satisfy its accessibility contract is not a conforming Afenda component.",
    strength: "must",
  },

  {
    id: "AF-A11Y-010",

    statement:
      "Accessibility failure takes precedence over visual fidelity, density, branding, or expressive behaviour.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// =============================================================================
// POUR TAXONOMY
// =============================================================================

export const ACCESSIBILITY_DOMAINS = {
  operable: {
    purpose:
      "Functionality can be operated through supported input mechanisms.",
  },
  perceivable: {
    purpose:
      "Information and component state can be perceived in supported presentations.",
  },

  robust: {
    purpose:
      "Semantics remain available to browsers, assistive technologies, and user-controlled presentation modes.",
  },

  understandable: {
    purpose:
      "Information, actions, errors, and behaviour remain understandable and predictable.",
  },
} as const;

export type AccessibilityDomain = keyof typeof ACCESSIBILITY_DOMAINS;

// =============================================================================
// REQUIREMENT REGISTRY
// =============================================================================

/**
 * THIS IS THE CANONICAL ACCESSIBILITY VOCABULARY.
 *
 * Component contracts reference these IDs rather than rewriting accessibility
 * prose repeatedly.
 *
 * Example:
 *
 * Button:
 *
 * accessibility: [
 *   "accessible-name",
 *   "name-role-state-value",
 *   "keyboard-operability",
 *   "focus-visible",
 *   "target-size",
 * ]
 */
export const ACCESSIBILITY_REQUIREMENTS = {
  // AUTH / TIME

  "accessible-authentication": {
    domain: "understandable",

    purpose:
      "Authentication does not unnecessarily depend on cognitive function tests without supported alternatives.",
  },

  "accessible-description": {
    domain: "robust",

    purpose:
      "Additional description is exposed when the accessible name alone is insufficient.",
  },

  "accessible-name": {
    domain: "robust",

    purpose:
      "Interactive and meaningful named components expose an appropriate accessible name.",
  },

  "concurrent-input": {
    domain: "operable",

    purpose:
      "Supporting one input mechanism does not unnecessarily disable another.",
  },

  // OVERLAYS

  "dialog-focus": {
    domain: "operable",

    purpose:
      "Dialog focus entry, containment, dismissal, and restoration follow the declared dialog interaction model.",
  },

  "drag-alternative": {
    domain: "operable",

    purpose:
      "Dragging operations have a non-drag single-pointer alternative unless dragging is essential.",
  },

  "error-identification": {
    domain: "understandable",

    purpose: "Detected input errors are identified and described.",
  },

  "error-prevention": {
    domain: "understandable",

    purpose:
      "Consequential submissions support reversal, checking, correction, or confirmation as appropriate.",
  },

  "error-suggestion": {
    domain: "understandable",

    purpose: "Corrective suggestions are provided where known and appropriate.",
  },

  "focus-not-obscured": {
    domain: "operable",

    purpose:
      "Focused components remain visible despite author-created overlays or sticky regions.",
  },

  "focus-order": {
    domain: "operable",

    purpose: "Focus movement preserves meaning and task sequence.",
  },

  "focus-restoration": {
    domain: "operable",

    purpose:
      "Temporary interactions restore meaningful focus when they close or remove focused content.",
  },

  "focus-visible": {
    domain: "operable",

    purpose: "Keyboard focus has a visible indication.",
  },

  "forced-colors": {
    domain: "robust",

    purpose:
      "Components remain understandable and operable under forced user colour palettes.",
  },

  "grid-semantics": {
    domain: "robust",

    purpose:
      "Interactive data grids expose composite-widget structure, navigation, selection, and editing semantics.",
  },

  "hover-focus-content": {
    domain: "perceivable",

    purpose:
      "Additional content triggered by hover or focus remains dismissible, hoverable where needed, and persistent long enough to use.",
  },

  // KEYBOARD / FOCUS

  "keyboard-operability": {
    domain: "operable",

    purpose:
      "Functionality is operable through the keyboard interface where required.",
  },

  // FORMS / ERRORS

  "labels-instructions": {
    domain: "understandable",

    purpose:
      "Inputs and required operations have sufficient labels and instructions.",
  },

  "name-role-state-value": {
    domain: "robust",

    purpose:
      "Component name, role, state, properties, and values are programmatically determinable where applicable.",
  },

  "no-keyboard-trap": {
    domain: "operable",

    purpose:
      "Keyboard focus can enter and leave components according to their interaction model.",
  },

  "non-colour-meaning": {
    domain: "perceivable",

    purpose: "Consequential information is not represented using colour alone.",
  },

  "non-text-contrast": {
    domain: "perceivable",

    purpose:
      "Essential component boundaries, states, controls, and graphics remain distinguishable.",
  },

  "pointer-cancellation": {
    domain: "operable",

    purpose: "Pointer activation permits cancellation where applicable.",
  },

  "pointer-gesture-alternative": {
    domain: "operable",

    purpose:
      "Path-based or multipoint gestures have a simpler alternative unless essential.",
  },

  // USER PREFERENCE

  "reduced-motion": {
    domain: "perceivable",

    purpose: "Motion adapts appropriately to user reduced-motion preference.",
  },

  "redundant-entry": {
    domain: "understandable",

    purpose:
      "Previously supplied information is not unnecessarily required again within the same process.",
  },

  reflow: {
    domain: "perceivable",

    purpose:
      "Content adapts to magnification and constrained presentation without unnecessary two-dimensional scrolling.",
  },
  // SEMANTICS

  "semantic-structure": {
    domain: "robust",

    purpose:
      "Programmatic structure reflects the information and interaction structure.",
  },

  // STATUS

  "status-announcement": {
    domain: "robust",

    purpose:
      "Important status updates are programmatically available without unnecessary focus movement.",
  },

  "strong-focus-appearance": {
    domain: "operable",

    purpose:
      "Author-styled focus indicators remain large and contrasting enough to locate reliably.",
  },

  // STRUCTURED DATA

  "table-semantics": {
    domain: "robust",

    purpose:
      "Static tabular information exposes correct row, column, and header relationships.",
  },

  // POINTER / TOUCH / GESTURE

  "target-size": {
    domain: "operable",

    purpose: "Pointer targets meet minimum size or spacing requirements.",
  },

  // VISUAL

  "text-contrast": {
    domain: "perceivable",

    purpose: "Text remains visually distinguishable from its background.",
  },

  "text-resize": {
    domain: "perceivable",

    purpose: "Text enlarges without loss of content or functionality.",
  },

  "text-spacing": {
    domain: "perceivable",

    purpose:
      "User-adjusted text spacing does not cause loss of content or functionality.",
  },

  "time-limit-control": {
    domain: "operable",

    purpose:
      "User-controlled work is protected from inaccessible time limits where applicable.",
  },
} as const satisfies Readonly<
  Record<
    string,
    {
      domain: AccessibilityDomain;
      purpose: string;
    }
  >
>;

export type AccessibilityRequirement = keyof typeof ACCESSIBILITY_REQUIREMENTS;

// =============================================================================
// SEMANTIC STRUCTURE
// =============================================================================

export const SEMANTIC_RULES = [
  {
    id: "AF-A11Y-011",

    rule: "Use native semantic HTML when native semantics correctly represent the component.",
    strength: "must",
  },

  {
    id: "AF-A11Y-012",

    rule: "ARIA must not be added where it duplicates or conflicts with correct native semantics.",
    strength: "must",
  },

  {
    id: "AF-A11Y-013",

    rule: "Custom widgets expose the role, states, properties, and keyboard behaviour required by their interaction pattern.",
    strength: "must",
  },

  {
    id: "AF-A11Y-014",

    rule: "Visual headings, lists, tables, regions, labels, and controls preserve appropriate programmatic structure.",
    strength: "must",
  },

  {
    id: "AF-A11Y-015",

    rule: "Semantic source order remains meaningful independently from visual layout.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACCESSIBLE NAME / DESCRIPTION
// =============================================================================

export const NAMING_RULES = [
  {
    id: "AF-A11Y-016",

    rule: "Interactive controls have an accessible name appropriate to their function.",
    strength: "must",
  },

  {
    id: "AF-A11Y-017",

    rule: "Icon-only interactive controls require an accessible name.",
    strength: "must",
  },

  {
    id: "AF-A11Y-018",

    rule: "Visible control labels and accessible names describe the same operation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-019",

    rule: "Where a visible text label exists, the programmatic name includes the visible label wording where required for label-in-name compatibility.",
    strength: "must",
  },

  {
    id: "AF-A11Y-020",

    rule: "Descriptions supplement rather than redundantly replace concise accessible names.",
    strength: "must",
  },

  {
    id: "AF-A11Y-021",

    rule: "Generated accessible names must not depend on information available only visually.",
    strength: "must",
  },
] as const;

// =============================================================================
// NAME / ROLE / STATE / VALUE
// =============================================================================

export const PROGRAMMATIC_SEMANTICS_RULES = [
  {
    id: "AF-A11Y-022",

    rule: "The programmatic role matches the component's actual interaction behaviour.",
    strength: "must",
  },

  {
    id: "AF-A11Y-023",

    rule: "Selected, checked, expanded, disabled, readonly, invalid, busy, current, and other applicable states remain programmatically determinable.",
    strength: "must",
  },

  {
    id: "AF-A11Y-024",

    rule: "Range components expose current value and applicable minimum and maximum values.",
    strength: "must",
  },

  {
    id: "AF-A11Y-025",

    rule: "Programmatic state updates occur when semantic state changes rather than after presentation animation completes.",
    strength: "must",
  },

  {
    id: "AF-A11Y-026",

    rule: "Visible and programmatic states must not contradict one another.",
    strength: "must",
  },
] as const;

// =============================================================================
// KEYBOARD
// =============================================================================

export const KEYBOARD_RULES = [
  {
    id: "AF-A11Y-027",

    rule: "All functionality that requires ordinary user interaction is keyboard-operable unless the function inherently depends on a path or analog movement.",
    strength: "must",
  },

  {
    id: "AF-A11Y-028",

    rule: "Keyboard operation does not require timing-sensitive key combinations unless the interaction inherently requires timing.",
    strength: "must",
  },

  {
    id: "AF-A11Y-029",

    rule: "Users can move focus away from a component using standard or clearly documented keyboard interaction.",
    strength: "must",
  },

  {
    id: "AF-A11Y-030",

    rule: "Tab moves between components while composite-widget internal navigation follows the component's declared keyboard pattern.",
    strength: "must",
  },

  {
    id: "AF-A11Y-031",

    rule: "Custom composite widgets implement the keyboard conventions expected for their semantic role.",
    strength: "must",
  },

  {
    id: "AF-A11Y-032",

    rule: "Keyboard shortcuts must not unintentionally conflict with text entry, browser shortcuts, operating-system shortcuts, or assistive technologies.",
    strength: "must",
  },

  {
    id: "AF-A11Y-033",

    rule: "Pointer-only interaction success does not constitute proof of keyboard operability.",
    strength: "must",
  },
] as const;

// =============================================================================
// FOCUS
// =============================================================================

export const FOCUS_POLICY = {
  appearance: {
    afendaStrength: "must",

    minimumContrastChange: 3,

    minimumEquivalentPerimeterCssPx: 2,
    sourceLevel: "WCAG 2.2 AAA",
  },

  notObscuredEnhanced: {
    afendaStrength: "should",

    requirement:
      "prefer no author-created content obscuring any part of the focused component",
    sourceLevel: "WCAG 2.2 AAA",
  },

  notObscuredMinimum: {
    level: "WCAG 2.2 AA",

    requirement:
      "focused component is not entirely hidden by author-created content",
  },
  visible: {
    level: "WCAG 2.2 AA",

    required: true,
  },
} as const;

// -----------------------------------------------------------------------------
// FOCUS RULES
// -----------------------------------------------------------------------------

export const FOCUS_RULES = [
  {
    id: "AF-A11Y-034",

    rule: "Keyboard focus has a visible indicator.",
    strength: "must",
  },

  {
    id: "AF-A11Y-035",

    rule: "Author-styled focus indicators provide an indicator area at least equivalent to a two-CSS-pixel perimeter of the unfocused component.",
    strength: "must",
  },

  {
    id: "AF-A11Y-036",

    rule: "Author-styled focus indication provides at least a 3:1 visual change between the relevant focused and unfocused pixels.",
    strength: "must",
  },

  {
    id: "AF-A11Y-037",

    rule: "Focus-visible remains distinguishable from hover, selected, checked, current, invalid, and other simultaneous state presentation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-038",

    rule: "Author-created content must not entirely obscure the focused component.",
    strength: "must",
  },

  {
    id: "AF-A11Y-039",

    rule: "Afenda layouts should keep the entire focused component visible where reasonably possible.",
    strength: "should",
  },

  {
    id: "AF-A11Y-040",

    rule: "Opening, closing, deleting, hiding, or adapting content must not cause keyboard focus to become lost.",
    strength: "must",
  },

  {
    id: "AF-A11Y-041",

    rule: "Temporary interactions restore focus to a meaningful location where focus restoration is applicable.",
    strength: "must",
  },

  {
    id: "AF-A11Y-042",

    rule: "Sticky headers, sticky footers, floating panes, overlays, and notifications must respect focus visibility.",
    strength: "must",
  },
] as const;

// =============================================================================
// POINTER TARGET SIZE
// =============================================================================

/**
 * WCAG 2.2 AA baseline:
 *
 *   24 × 24 CSS px
 *
 * with defined exceptions.
 *
 * This is a minimum conformance floor, NOT Afenda's visual component size.
 *
 * 04-geometry.ts may resolve ordinary Afenda targets larger than this.
 */
export const POINTER_TARGET_MINIMUM = {
  exceptions: [
    "sufficient-spacing",
    "equivalent-control",
    "inline-target",
    "user-agent-controlled",
    "essential-presentation",
  ],

  heightCssPx: 24,
  level: "WCAG 2.2 AA",

  widthCssPx: 24,
} as const;

// -----------------------------------------------------------------------------
// TARGET RULES
// -----------------------------------------------------------------------------

export const TARGET_RULES = [
  {
    id: "AF-A11Y-043",

    rule: "Pointer targets meet the WCAG 2.2 AA target-size requirement or one of its defined exceptions.",
    strength: "must",
  },

  {
    id: "AF-A11Y-044",

    rule: "Compact visual geometry does not reduce effective target geometry below the applicable accessibility requirement.",
    strength: "must",
  },

  {
    id: "AF-A11Y-045",

    rule: "Closely adjacent undersized targets must satisfy the applicable spacing exception rather than relying on precision pointing.",
    strength: "must",
  },

  {
    id: "AF-A11Y-046",

    rule: "Density changes must not invalidate target-size conformance.",
    strength: "must",
  },

  {
    id: "AF-A11Y-047",

    rule: "Frequently used and consequential Afenda controls should use target geometry larger than the WCAG minimum where the layout permits it.",
    strength: "should",
  },
] as const;

// =============================================================================
// POINTER CANCELLATION
// =============================================================================

export const POINTER_CANCELLATION_RULES = [
  {
    id: "AF-A11Y-048",

    rule: "Consequential pointer actions normally complete on an up-event or equivalent completed activation rather than irreversible down-event activation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-049",

    rule: "Where pointer cancellation is applicable, moving away or otherwise cancelling before completed activation prevents the action.",
    strength: "must",
  },

  {
    id: "AF-A11Y-050",

    rule: "Down-event activation is reserved for interactions where down-event behaviour is essential.",
    strength: "must",
  },
] as const;

// =============================================================================
// POINTER GESTURES
// =============================================================================

export const POINTER_GESTURE_RULES = [
  {
    id: "AF-A11Y-051",

    rule: "Functionality using multipoint gestures has a single-pointer alternative unless the multipoint gesture is essential.",
    strength: "must",
  },

  {
    id: "AF-A11Y-052",

    rule: "Functionality using path-based gestures has a simple-pointer alternative unless the path is essential.",
    strength: "must",
  },

  {
    id: "AF-A11Y-053",

    rule: "Swipe, pinch, and gesture shortcuts must not become the only discoverable mechanism for ordinary product capability.",
    strength: "must",
  },
] as const;

// =============================================================================
// DRAGGING
// =============================================================================

export const DRAGGING_RULES = [
  {
    id: "AF-A11Y-054",

    rule: "Functionality using dragging has a non-drag single-pointer mechanism unless dragging itself is essential.",
    strength: "must",
  },

  {
    id: "AF-A11Y-055",

    rule: "A keyboard-only alternative does not by itself satisfy the requirement for a non-drag pointer alternative.",
    strength: "must",
  },

  {
    id: "AF-A11Y-056",

    rule: "Keyboard-operable draggable components also satisfy their independent keyboard interaction contract.",
    strength: "must",
  },

  {
    id: "AF-A11Y-057",

    rule: "Pane resizing, column reordering, row reordering, workflow editing, and dashboard arrangement provide required alternative operation.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONCURRENT INPUT
// =============================================================================

export const CONCURRENT_INPUT_RULES = [
  {
    id: "AF-A11Y-058",

    rule: "Supporting touch must not disable keyboard or pointer operation without essential reason.",
    strength: "must",
  },

  {
    id: "AF-A11Y-059",

    rule: "Supporting keyboard input must not prevent concurrent pointer interaction.",
    strength: "must",
  },

  {
    id: "AF-A11Y-060",

    rule: "Viewport dimensions must not be used as proof of the user's input mechanism.",
    strength: "must",
  },
] as const;

// =============================================================================
// TEXT CONTRAST
// =============================================================================

export const TEXT_CONTRAST = {
  largeText: {
    minimumRatio: 3,
  },
  normalText: {
    minimumRatio: 4.5,
  },
} as const;

// -----------------------------------------------------------------------------
// TEXT CONTRAST RULES
// -----------------------------------------------------------------------------

export const TEXT_CONTRAST_RULES = [
  {
    id: "AF-A11Y-061",

    rule: "Normal text and images of text meet a minimum contrast ratio of 4.5:1 unless a WCAG exception applies.",
    strength: "must",
  },

  {
    id: "AF-A11Y-062",

    rule: "Large-scale text meets a minimum contrast ratio of 3:1 unless a WCAG exception applies.",
    strength: "must",
  },

  {
    id: "AF-A11Y-063",

    rule: "Placeholder, hover, focus, supporting, and error text remain subject to applicable text contrast requirements.",
    strength: "must",
  },

  {
    id: "AF-A11Y-064",

    rule: "Tenant customisation and theme changes must not reduce text contrast below the applicable requirement.",
    strength: "must",
  },
] as const;

// =============================================================================
// NON-TEXT CONTRAST
// =============================================================================

export const NON_TEXT_CONTRAST = {
  minimumRatio: 3,
} as const;

// -----------------------------------------------------------------------------
// NON-TEXT CONTRAST RULES
// -----------------------------------------------------------------------------

export const NON_TEXT_CONTRAST_RULES = [
  {
    id: "AF-A11Y-065",

    rule: "Visual information required to identify controls and their states meets the applicable 3:1 non-text contrast requirement.",
    strength: "must",
  },

  {
    id: "AF-A11Y-066",

    rule: "Essential graphical information meets the applicable non-text contrast requirement.",
    strength: "must",
  },

  {
    id: "AF-A11Y-067",

    rule: "Focus, validation, selection, drag target, and similar essential state boundaries remain sufficiently perceptible.",
    strength: "must",
  },
] as const;

// =============================================================================
// COLOUR-INDEPENDENT MEANING
// =============================================================================

export const NON_COLOUR_RULES = [
  {
    id: "AF-A11Y-068",

    rule: "Colour is not the only visual means of conveying consequential information.",
    strength: "must",
  },

  {
    id: "AF-A11Y-069",

    rule: "Positive, negative, warning, error, selection, validation, and data-series distinctions provide sufficient non-colour information where required.",
    strength: "must",
  },

  {
    id: "AF-A11Y-070",

    rule: "A change from one colour role to another does not by itself constitute an accessible state indicator.",
    strength: "must",
  },
] as const;

// =============================================================================
// TEXT RESIZE
// =============================================================================

export const TEXT_RESIZE_REQUIREMENT = {
  level: "WCAG 2.2 AA",

  minimumPercent: 200,

  requirement: "no loss of content or functionality",
} as const;

// -----------------------------------------------------------------------------
// TEXT RESIZE RULES
// -----------------------------------------------------------------------------

export const TEXT_RESIZE_RULES = [
  {
    id: "AF-A11Y-071",

    rule: "Text can be resized to at least 200 percent without loss of content or functionality.",
    strength: "must",
  },

  {
    id: "AF-A11Y-072",

    rule: "Controls containing text remain usable when text enlarges.",
    strength: "must",
  },

  {
    id: "AF-A11Y-073",

    rule: "Responsive breakpoints must not counteract browser zoom in a way that prevents required text enlargement.",
    strength: "must",
  },

  {
    id: "AF-A11Y-074",

    rule: "Essential information must not become permanently clipped or unavailable because text enlarged.",
    strength: "must",
  },

  {
    id: "AF-A11Y-075",

    rule: "Where truncation remains necessary in specialised components, the full essential content is available through an accessible mechanism.",
    strength: "must",
  },
] as const;

// =============================================================================
// REFLOW
// =============================================================================

export const REFLOW_REQUIREMENT = {
  exception: "content whose usage or meaning requires two-dimensional layout",

  horizontalReading: {
    equivalentHeightCssPx: 256,
  },
  level: "WCAG 2.2 AA",

  verticalReading: {
    equivalentWidthCssPx: 320,
  },
} as const;

// -----------------------------------------------------------------------------
// REFLOW RULES
// -----------------------------------------------------------------------------

export const REFLOW_RULES = [
  {
    id: "AF-A11Y-076",

    rule: "Non-exempt vertically scrolling content remains usable at an equivalent width of 320 CSS pixels without requiring two-dimensional scrolling.",
    strength: "must",
  },

  {
    id: "AF-A11Y-077",

    rule: "Content does not disappear merely because the interface has reflowed.",
    strength: "must",
  },

  {
    id: "AF-A11Y-078",

    rule: "Data tables, diagrams, maps, complex canvases, and other genuinely two-dimensional content may retain local two-dimensional scrolling where required for meaning or operation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-079",

    rule: "A two-dimensional exception for a data table does not exempt unrelated page content from reflow.",
    strength: "must",
  },

  {
    id: "AF-A11Y-080",

    rule: "Adaptive pane changes preserve essential information and functionality under zoom and reflow.",
    strength: "must",
  },
] as const;

// =============================================================================
// TEXT SPACING
// =============================================================================

/**
 * WCAG 2.2 SC 1.4.12 governs user-overridden text spacing.
 *
 * Level 3 should test the normative WCAG values.
 */
export const TEXT_SPACING_REQUIREMENT = {
  letterSpacing: "0.12 × font size",
  lineHeight: "1.5 × font size",

  paragraphSpacing: "2 × font size",

  requirement: "no loss of content or functionality",

  wordSpacing: "0.16 × font size",
} as const;

// -----------------------------------------------------------------------------
// TEXT SPACING RULES
// -----------------------------------------------------------------------------

export const TEXT_SPACING_RULES = [
  {
    id: "AF-A11Y-081",

    rule: "User text-spacing overrides at WCAG-defined values do not cause loss of content or functionality.",
    strength: "must",
  },

  {
    id: "AF-A11Y-082",

    rule: "Fixed-height text containers must not clip required content when user spacing changes.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONTENT ON HOVER OR FOCUS
// =============================================================================

export const HOVER_FOCUS_CONTENT_RULES = [
  {
    id: "AF-A11Y-083",

    rule: "Additional content triggered by hover or focus can be dismissed without moving pointer or focus unless the additional content communicates an input error or does not obscure other content.",
    strength: "must",
  },

  {
    id: "AF-A11Y-084",

    rule: "Hover-triggered additional content remains hoverable when pointer movement into that content is required to use it.",
    strength: "must",
  },

  {
    id: "AF-A11Y-085",

    rule: "Additional hover/focus content remains available until the trigger condition ends, the user dismisses it, or its information is no longer valid.",
    strength: "must",
  },
] as const;

// =============================================================================
// REDUCED MOTION
// =============================================================================

export const REDUCED_MOTION_RULES = [
  {
    id: "AF-A11Y-086",

    rule: "Every governed component with motion has a reduced-motion presentation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-087",

    rule: "Reduced-motion presentation preserves the same semantic state and task capability.",
    strength: "must",
  },

  {
    id: "AF-A11Y-088",

    rule: "Non-essential spatial and repetitive motion is removed or materially reduced according to 06-motion.ts.",
    strength: "must",
  },

  {
    id: "AF-A11Y-089",

    rule: "Disabling animation must not remove essential state feedback.",
    strength: "must",
  },
] as const;

// =============================================================================
// FORCED COLOURS / HIGH-CONTRAST RESILIENCE
// =============================================================================

/**
 * Forced colours is a USER-AGENT accessibility mode.
 *
 * It is not an Afenda theme.
 */
export const FORCED_COLORS_POLICY = {
  defaultAuthorAdjustment: "allow-user-agent",

  optOut: "exception-only",

  semanticStateChange: false,
  supported: true,
} as const;

// -----------------------------------------------------------------------------
// FORCED COLOUR RULES
// -----------------------------------------------------------------------------

export const FORCED_COLOR_RULES = [
  {
    id: "AF-A11Y-090",

    rule: "Core Afenda functionality remains operable when the user agent applies a forced colour palette.",
    strength: "must",
  },

  {
    id: "AF-A11Y-091",

    rule: "Focus, selection, checked, invalid, current, disabled, and other consequential states remain distinguishable in forced-colours presentation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-092",

    rule: "Meaning must not depend on box shadow, background image, subtle colour difference, or another treatment that may disappear in forced-colours mode.",
    strength: "must",
  },

  {
    id: "AF-A11Y-093",

    rule: "Opting an element out of user-agent forced colour adjustment requires an explicit accessibility reason and equivalent user-preference handling.",
    strength: "must",
  },

  {
    id: "AF-A11Y-094",

    rule: "Tenant branding does not override user-required forced-colour presentation.",
    strength: "must",
  },
] as const;

// =============================================================================
// FORMS / LABELS
// =============================================================================

export const FORM_ACCESSIBILITY_RULES = [
  {
    id: "AF-A11Y-095",

    rule: "Inputs expose labels that identify the requested information or operation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-096",

    rule: "Required format or entry constraints are communicated when users need them to complete the task.",
    strength: "must",
  },

  {
    id: "AF-A11Y-097",

    rule: "Placeholder text must not act as the sole persistent label for required form controls.",
    strength: "must",
  },

  {
    id: "AF-A11Y-098",

    rule: "Required and optional status remains understandable independently from colour.",
    strength: "must",
  },

  {
    id: "AF-A11Y-099",

    rule: "Related inputs expose their programmatic grouping where the relationship is necessary to understand them.",
    strength: "must",
  },
] as const;

// =============================================================================
// ERRORS
// =============================================================================

export const ERROR_RULES = [
  {
    id: "AF-A11Y-100",

    rule: "Detected input errors identify the affected input or data and describe the error in text.",
    strength: "must",
  },

  {
    id: "AF-A11Y-101",

    rule: "Known correction suggestions are provided when appropriate and when doing so would not compromise security or the purpose of the content.",
    strength: "must",
  },

  {
    id: "AF-A11Y-102",

    rule: "Error indication is associated programmatically with the relevant control or data region.",
    strength: "must",
  },

  {
    id: "AF-A11Y-103",

    rule: "Submitting a form with errors does not cause users to lose entered data unnecessarily.",
    strength: "must",
  },

  {
    id: "AF-A11Y-104",

    rule: "Moving focus to an error is a workflow decision and not an automatic consequence of becoming invalid.",
    strength: "must",
  },

  {
    id: "AF-A11Y-105",

    rule: "Error summaries and field-level errors remain mutually consistent when both are presented.",
    strength: "must",
  },
] as const;

// =============================================================================
// ENTERPRISE TRANSACTION SAFETY
// =============================================================================

/**
 * Particularly important for Afenda:
 *
 *   payroll
 *   accounting
 *   posting
 *   approvals
 *   banking
 *   statutory submissions
 *   deletion
 *   irreversible workflow actions
 *
 * WCAG 3.3.4 specifically addresses legal, financial, and data transactions.
 */
export const TRANSACTION_SAFETY = {
  acceptedMechanisms: [
    "reversible",
    "checked-before-commit",
    "confirmed-before-finalisation",
  ],
  appliesTo: [
    "legal-commitment",
    "financial-transaction",
    "data-deletion",
    "data-modification-with-material-consequence",
  ],
} as const;

// -----------------------------------------------------------------------------
// TRANSACTION RULES
// -----------------------------------------------------------------------------

export const TRANSACTION_RULES = [
  {
    id: "AF-A11Y-106",

    rule: "Consequential legal, financial, or data transactions provide an applicable mechanism for reversal, verification, correction, or confirmation.",
    strength: "must",
  },

  {
    id: "AF-A11Y-107",

    rule: "Final confirmation identifies the object, scope, and material consequence of the transaction where ambiguity would create risk.",
    strength: "must",
  },

  {
    id: "AF-A11Y-108",

    rule: "Confirmation dialogs must not rely on colour or button position alone to communicate the consequential choice.",
    strength: "must",
  },

  {
    id: "AF-A11Y-109",

    rule: "Keyboard and assistive-technology users receive the same opportunity to review and correct consequential information before commitment.",
    strength: "must",
  },
] as const;

// =============================================================================
// REDUNDANT ENTRY
// =============================================================================

export const REDUNDANT_ENTRY_RULES = [
  {
    id: "AF-A11Y-110",

    rule: "Information previously entered by or provided for the user within the same process is auto-populated or available for selection unless re-entry is essential, required for security, or the information is no longer valid.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATUS MESSAGES
// =============================================================================

/**
 * Status information frequently changes in Afenda without navigation:
 *
 *   "Saved"
 *   "Payroll run created"
 *   "7 rows selected"
 *   "Import complete"
 *   "Validation failed"
 *   "Report generation started"
 *
 * Focus should normally remain where the user is working.
 */
export const STATUS_RULES = [
  {
    id: "AF-A11Y-111",

    rule: "Important status messages are programmatically determinable without requiring focus movement where the status can be communicated through status semantics.",
    strength: "must",
  },

  {
    id: "AF-A11Y-112",

    rule: "Status announcements communicate meaningful state rather than every incidental visual update.",
    strength: "must",
  },

  {
    id: "AF-A11Y-113",

    rule: "Repeated high-frequency status updates must not create unusable announcement noise.",
    strength: "must",
  },

  {
    id: "AF-A11Y-114",

    rule: "Loading and progress announcements remain consistent with actual operation state.",
    strength: "must",
  },

  {
    id: "AF-A11Y-115",

    rule: "An operation must not announce success before the underlying operation has succeeded.",
    strength: "must",
  },
] as const;

// =============================================================================
// TABLES
// =============================================================================

export const TABLE_RULES = [
  {
    id: "AF-A11Y-116",

    rule: "Static tabular data uses table semantics rather than interactive grid semantics.",
    strength: "must",
  },

  {
    id: "AF-A11Y-117",

    rule: "Column and row headers are programmatically associated with the cells they describe where applicable.",
    strength: "must",
  },

  {
    id: "AF-A11Y-118",

    rule: "Visual sorting, grouping, totals, and hierarchy do not remove the underlying relationships required to interpret the table.",
    strength: "must",
  },

  {
    id: "AF-A11Y-119",

    rule: "Horizontal scrolling required by genuinely tabular structure is locally contained rather than forcing unrelated page content to scroll in two dimensions.",
    strength: "must",
  },
] as const;

// =============================================================================
// DATA GRIDS
// =============================================================================

/**
 * An interactive DataGrid is a COMPOSITE WIDGET.
 *
 * It is not merely a table with role="grid".
 */
export const DATA_GRID_ACCESSIBILITY = {
  focusModel: "managed",

  internalNavigation: "directional",

  pageTabStops: "one-composite-entry",

  requiredStructure: ["row", "column", "cell", "header relationships"],

  virtualisationRequires: [
    "logical row information",
    "logical column information",
    "stable focus semantics",
  ],
} as const;

// -----------------------------------------------------------------------------
// GRID RULES
// -----------------------------------------------------------------------------

export const DATA_GRID_RULES = [
  {
    id: "AF-A11Y-120",

    rule: "Interactive DataGrid follows a governed composite-widget keyboard model rather than placing every cell indiscriminately in the page tab sequence.",
    strength: "must",
  },

  {
    id: "AF-A11Y-121",

    rule: "Directional navigation within DataGrid remains predictable and consistent.",
    strength: "must",
  },

  {
    id: "AF-A11Y-122",

    rule: "Grid cells, rows, columns, headers, selection, editing, and sorting expose their applicable programmatic semantics.",
    strength: "must",
  },

  {
    id: "AF-A11Y-123",

    rule: "Virtualised DataGrid preserves logical position information required to understand row and column location.",
    strength: "must",
  },

  {
    id: "AF-A11Y-124",

    rule: "Virtualisation must not cause keyboard focus to disappear when the focused logical item remains part of the current task.",
    strength: "must",
  },

  {
    id: "AF-A11Y-125",

    rule: "Entering and leaving cell editing has a defined keyboard interaction and focus transition.",
    strength: "must",
  },

  {
    id: "AF-A11Y-126",

    rule: "Selection and keyboard focus remain distinct DataGrid semantics.",
    strength: "must",
  },

  {
    id: "AF-A11Y-127",

    rule: "Column resizing and reordering satisfy independent keyboard and non-drag pointer requirements where those capabilities are available.",
    strength: "must",
  },
] as const;

// =============================================================================
// DIALOGS / MODAL INTERACTION
// =============================================================================

export const DIALOG_RULES = [
  {
    id: "AF-A11Y-128",

    rule: "Opening a modal dialog moves focus to an appropriate element within the dialog.",
    strength: "must",
  },

  {
    id: "AF-A11Y-129",

    rule: "Keyboard focus remains within an active modal dialog until it is closed.",
    strength: "must",
  },

  {
    id: "AF-A11Y-130",

    rule: "Modal dialogs provide an accessible mechanism for dismissal where dismissal is allowed.",
    strength: "must",
  },

  {
    id: "AF-A11Y-131",

    rule: "Escape closes ordinary dismissible modal dialogs unless the interaction requires another documented behaviour.",
    strength: "must",
  },

  {
    id: "AF-A11Y-132",

    rule: "Closing a modal restores focus to the invoking control or another meaningful location when the invoker no longer exists or another destination is more appropriate.",
    strength: "must",
  },

  {
    id: "AF-A11Y-133",

    rule: "Background content is not exposed as simultaneously interactive while a true modal interaction is active.",
    strength: "must",
  },
] as const;

// =============================================================================
// AUTHENTICATION
// =============================================================================

export const AUTHENTICATION_RULES = [
  {
    id: "AF-A11Y-134",

    rule: "Authentication does not unnecessarily require users to solve, remember, or transcribe information when accessible alternatives supported by the applicable accessibility requirement are available.",
    strength: "must",
  },

  {
    id: "AF-A11Y-135",

    rule: "Password managers and paste mechanisms must not be blocked without a security requirement that cannot reasonably be satisfied another way.",
    strength: "must",
  },

  {
    id: "AF-A11Y-136",

    rule: "Authentication errors identify the problem without exposing sensitive security information.",
    strength: "must",
  },
] as const;

// =============================================================================
// TIME / SESSION
// =============================================================================

export const TIME_RULES = [
  {
    id: "AF-A11Y-137",

    rule: "Where a user-controlled task has an adjustable time limit, users receive the applicable capability to turn off, adjust, or extend that limit.",
    strength: "must",
  },

  {
    id: "AF-A11Y-138",

    rule: "Session timeout warnings provide sufficient opportunity and an accessible mechanism to continue the session when permitted.",
    strength: "must",
  },

  {
    id: "AF-A11Y-139",

    rule: "Reauthentication should preserve user-entered task state where the security model permits it.",
    strength: "must",
  },
] as const;

// =============================================================================
// COMPONENT ACCESSIBILITY CONTRACT
// =============================================================================

/**
 * Every governed component references accessibility requirements here.
 *
 * It does NOT duplicate WCAG prose.
 *
 * Example:
 *
 * defineComponent({
 *   name: "Button",
 *
 *   accessibility: {
 *     requires: [
 *       "accessible-name",
 *       "name-role-state-value",
 *       "keyboard-operability",
 *       "focus-visible",
 *       "focus-not-obscured",
 *       "target-size",
 *     ],
 *   },
 * })
 */
export interface ComponentAccessibilityContract {
  /**
   * Accessibility exceptions require explicit documented justification.
   */
  readonly exceptions?: readonly {
    requirement: AccessibilityRequirement;

    reason: string;

    authority: string;
  }[];
  readonly requires: readonly AccessibilityRequirement[];

  /**
   * Additional component-specific behavioural obligations.
   */
  readonly rules?: readonly string[];
}

// =============================================================================
// ACCESSIBILITY PROOF CLASSES
// =============================================================================

/**
 * Level 3 may use multiple proof mechanisms.
 *
 * No one proof class is sufficient for every requirement.
 */
export const ACCESSIBILITY_PROOF_CLASSES = {
  accessibilityTree: {
    purpose:
      "Programmatic accessibility name, role, state, value, and relationship inspection.",
  },

  assistiveTechnology: {
    purpose:
      "Manual or automated supported assistive-technology interoperability evidence where required.",
  },

  dom: {
    purpose: "Rendered semantic DOM inspection.",
  },

  keyboard: {
    purpose: "Browser-level keyboard interaction proof.",
  },

  manual: {
    purpose:
      "Human review for requirements not adequately demonstrated through automation.",
  },

  pointer: {
    purpose: "Browser-level pointer and target behaviour proof.",
  },

  preference: {
    purpose:
      "Reduced-motion, forced-colours, contrast, theme, or other user-preference evidence.",
  },
  static: {
    purpose: "Source, type, AST, dependency, or contract analysis.",
  },

  visual: {
    purpose: "Rendered visual state, contrast, focus, and reflow evidence.",
  },
} as const;

export type AccessibilityProofClass = keyof typeof ACCESSIBILITY_PROOF_CLASSES;

// =============================================================================
// PROOF MATRIX
// =============================================================================

export const ACCESSIBILITY_PROOF_MATRIX = {
  "accessible-name": ["dom", "accessibilityTree"],

  "dialog-focus": ["keyboard", "accessibilityTree"],

  "drag-alternative": ["pointer", "keyboard", "manual"],

  "error-identification": ["dom", "accessibilityTree", "keyboard"],

  "focus-not-obscured": ["keyboard", "visual"],

  "focus-visible": ["keyboard", "visual"],

  "forced-colors": ["preference", "visual"],

  "grid-semantics": ["dom", "keyboard", "accessibilityTree"],

  "keyboard-operability": ["keyboard"],

  "name-role-state-value": ["dom", "accessibilityTree"],

  "non-text-contrast": ["visual"],

  "pointer-gesture-alternative": ["pointer", "manual"],

  "reduced-motion": ["preference", "visual"],

  reflow: ["visual"],

  "status-announcement": ["accessibilityTree", "assistiveTechnology"],

  "strong-focus-appearance": ["visual"],

  "target-size": ["pointer", "visual"],

  "text-contrast": ["visual"],

  "text-resize": ["visual"],
} as const;

// =============================================================================
// AUTOMATION BOUNDARY
// =============================================================================

export const AUTOMATED_TESTING_POLICY = {
  automatedProofAloneSufficient: false,

  principle:
    "Automation proves detectable invariants; complete accessibility conformance requires the proof mechanisms appropriate to the requirement.",

  typicalAutomatedCoverage: [
    "missing names",
    "invalid roles",
    "some state relationships",
    "some contrast",
    "some keyboard flows",
    "target geometry",
    "reflow snapshots",
  ],

  typicalHumanOrATCoverage: [
    "meaningful focus order",
    "quality of names",
    "interaction predictability",
    "announcement usefulness",
    "complex grid usability",
    "error comprehension",
  ],
} as const;

// =============================================================================
// CROSS-DOMAIN INVARIANTS
// =============================================================================

export const ACCESSIBILITY_CROSS_DOMAIN_RULES = [
  {
    id: "AF-A11Y-140",

    rule: "Colour resolution satisfies applicable contrast and non-colour requirements in every supported theme and tenant context.",
    strength: "must",
  },

  {
    id: "AF-A11Y-141",

    rule: "Typography remains usable under required text resize, spacing, script, and reflow conditions.",
    strength: "must",
  },

  {
    id: "AF-A11Y-142",

    rule: "Density cannot reduce interaction geometry below applicable target requirements.",
    strength: "must",
  },

  {
    id: "AF-A11Y-143",

    rule: "Layout adaptation preserves focus, semantic order, content availability, and task capability.",
    strength: "must",
  },

  {
    id: "AF-A11Y-144",

    rule: "Motion supports reduced-motion preference without changing semantic state.",
    strength: "must",
  },

  {
    id: "AF-A11Y-145",

    rule: "Interaction state remains programmatically determinable and independently perceivable.",
    strength: "must",
  },

  {
    id: "AF-A11Y-146",

    rule: "Tenant expression cannot override accessibility invariants.",
    strength: "must",
  },
] as const;

// =============================================================================
// PUBLIC API
// =============================================================================

export const ACCESSIBILITY_PUBLIC_API = {
  baseline: {
    level: "AA",
    standard: "WCAG 2.2",
  },

  proofClasses: ACCESSIBILITY_PROOF_CLASSES,

  requirements: ACCESSIBILITY_REQUIREMENTS,
} as const;

// =============================================================================
// FORBIDDEN BEHAVIOUR
// =============================================================================

export const ACCESSIBILITY_FORBIDS = [
  {
    behaviour: "interactive component ships without an accessibility contract",
    id: "AF-A11Y-147",
    strength: "must",
  },

  {
    behaviour:
      "ARIA is used to imitate semantics that correct native HTML already provides without justified need",
    id: "AF-A11Y-148",
    strength: "must",
  },

  {
    behaviour:
      "ARIA role is applied without implementing the expected interaction behaviour",
    id: "AF-A11Y-149",
    strength: "must",
  },

  {
    behaviour:
      "visible and programmatic component state contradict one another",
    id: "AF-A11Y-150",
    strength: "must",
  },

  {
    behaviour:
      "keyboard focus is intentionally removed because its indicator conflicts with visual design",
    id: "AF-A11Y-151",
    strength: "must",
  },

  {
    behaviour:
      "hover is the only path to essential information or functionality",
    id: "AF-A11Y-152",
    strength: "must",
  },

  {
    behaviour: "colour is the sole representation of consequential state",
    id: "AF-A11Y-153",
    strength: "must",
  },

  {
    behaviour: "compact or dense mode bypasses pointer target requirements",
    id: "AF-A11Y-154",
    strength: "must",
  },

  {
    behaviour:
      "drag is the sole operation mechanism where a non-drag alternative is required",
    id: "AF-A11Y-155",
    strength: "must",
  },

  {
    behaviour:
      "keyboard-only drag alternative is treated as proof of the independent non-drag pointer requirement",
    id: "AF-A11Y-156",
    strength: "must",
  },

  {
    behaviour:
      "text is intentionally shrunk during browser zoom so required enlargement cannot be achieved",
    id: "AF-A11Y-157",
    strength: "must",
  },

  {
    behaviour: "required content disappears under supported reflow conditions",
    id: "AF-A11Y-158",
    strength: "must",
  },

  {
    behaviour:
      "important status updates require focus movement solely so assistive technology can detect them",
    id: "AF-A11Y-159",
    strength: "must",
  },

  {
    behaviour:
      "static tabular information is unnecessarily converted into an interactive ARIA grid",
    id: "AF-A11Y-160",
    strength: "must",
  },

  {
    behaviour:
      "interactive grid is implemented only by adding role grid without the corresponding keyboard and focus model",
    id: "AF-A11Y-161",
    strength: "must",
  },

  {
    behaviour:
      "forced-colours user preference is defeated for branding convenience",
    id: "AF-A11Y-162",
    strength: "must",
  },

  {
    behaviour:
      "reduced-motion user preference removes essential feedback or capability",
    id: "AF-A11Y-163",
    strength: "must",
  },

  {
    behaviour:
      "automated accessibility scan alone is treated as complete release evidence",
    id: "AF-A11Y-164",
    strength: "must",
  },

  {
    behaviour: "tenant customisation weakens an accessibility requirement",
    id: "AF-A11Y-165",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const ACCESSIBILITY_SOURCES = [
  {
    adaptation:
      "Afenda adopts Level AA as the minimum product baseline and promotes selected stronger practices into its internal design-system contract.",

    contribution: [
      "WCAG 2.2 AA baseline",
      "contrast",
      "text resize",
      "reflow",
      "text spacing",
      "keyboard",
      "focus",
      "pointer gestures",
      "pointer cancellation",
      "dragging movements",
      "target size",
      "forms",
      "errors",
      "transaction safety",
      "name role value",
      "status messages",
    ],

    disposition: "adopt",
    id: "wcag-2.2",

    system: "W3C Web Content Accessibility Guidelines 2.2",

    uri: "https://www.w3.org/TR/WCAG22/",
  },

  {
    adaptation:
      "Afenda uses ARIA where native semantics do not sufficiently represent the governed interaction.",

    contribution: [
      "roles",
      "states",
      "properties",
      "live regions",
      "widget semantics",
    ],

    disposition: "adopt",
    id: "wai-aria",

    system: "WAI-ARIA",

    uri: "https://www.w3.org/WAI/standards-guidelines/aria/",
  },

  {
    adaptation:
      "Afenda uses APG as the primary interaction-pattern reference while component contracts remain the normative Afenda API.",

    contribution: [
      "keyboard conventions",
      "focus management",
      "composite widgets",
      "dialog pattern",
      "grid pattern",
      "role-specific interaction behaviour",
    ],

    disposition: "adapt",
    id: "aria-apg",

    system: "ARIA Authoring Practices Guide",

    uri: "https://www.w3.org/WAI/ARIA/apg/",
  },

  {
    adaptation:
      "Afenda treats forced colours as a protected user accessibility presentation rather than an application theme.",

    contribution: [
      "forced colour palettes",
      "user-agent colour adjustment",
      "forced-color-adjust",
    ],

    disposition: "adopt",
    id: "css-color-adjust",

    system: "CSS Color Adjustment Module",

    uri: "https://www.w3.org/TR/css-color-adjust-1/",
  },

  {
    adaptation:
      "Afenda retains M3's accessibility discipline while using WCAG and web-platform standards as normative authority for web SaaS.",

    contribution: [
      "accessible interaction intent",
      "touch-target discipline",
      "text scaling awareness",
      "state communication",
    ],

    disposition: "adapt",
    id: "m3-accessibility",

    system: "Material 3",
  },
] as const satisfies readonly {
  id: string;
  system: string;
  uri?: string;
  disposition: SourceDisposition;
  contribution: readonly string[];
  adaptation: string;
}[];

// =============================================================================
// SOURCE DISPOSITION
// =============================================================================

export const ACCESSIBILITY_SOURCE_DISPOSITION = {
  "apg-dialog-pattern": "adapt",

  "apg-grid-pattern": "adapt",

  "apg-keyboard-patterns": "adapt",

  "aria-role-state-property-model": "adopt",

  "forced-colors": "adopt",

  "m3-48dp-universal-web-minimum": "reject",

  "m3-accessibility-discipline": "adopt",
  "wcag-2.2-aa": "adopt",

  "wcag-dragging-movements": "adopt",

  "wcag-error-identification": "adopt",

  "wcag-error-prevention": "adopt",

  "wcag-focus-appearance-aaa": "adapt",

  "wcag-focus-not-obscured-enhanced": "adapt",

  "wcag-focus-not-obscured-minimum": "adopt",

  "wcag-focus-visible": "adopt",

  "wcag-keyboard": "adopt",

  "wcag-non-text-contrast": "adopt",

  "wcag-pointer-cancellation": "adopt",

  "wcag-pointer-gestures": "adopt",

  "wcag-reflow": "adopt",

  "wcag-status-messages": "adopt",

  "wcag-target-size-minimum": "adopt",

  "wcag-text-contrast": "adopt",

  "wcag-text-resize": "adopt",

  "wcag-text-spacing": "adopt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const ACCESSIBILITY_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-A11Y-166",

    obligation:
      "Every governed interactive component implements its declared accessibility requirement set.",
    strength: "must",
  },

  {
    id: "AF-A11Y-167",

    obligation:
      "Component semantic state remains synchronised with its programmatic accessibility state.",
    strength: "must",
  },

  {
    id: "AF-A11Y-168",

    obligation:
      "Level 2 uses native semantics where they satisfy the Level-1 contract.",
    strength: "must",
  },

  {
    id: "AF-A11Y-169",

    obligation:
      "Custom widgets implement the keyboard, focus, role, state, and property model required by their component contract.",
    strength: "must",
  },

  {
    id: "AF-A11Y-170",

    obligation:
      "All supported themes and tenant schemes preserve accessibility conformance.",
    strength: "must",
  },

  {
    id: "AF-A11Y-171",

    obligation:
      "All supported density modes preserve accessibility conformance.",
    strength: "must",
  },

  {
    id: "AF-A11Y-172",

    obligation:
      "All supported adaptive layout states preserve accessibility conformance.",
    strength: "must",
  },

  {
    id: "AF-A11Y-173",

    obligation:
      "Reduced-motion and forced-colours presentations remain supported.",
    strength: "must",
  },

  {
    id: "AF-A11Y-174",

    obligation:
      "Interactive data components implement the accessibility pattern declared by their Level-1 component contract.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const ACCESSIBILITY_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-A11Y-175",

    prove:
      "every governed interactive component declares an accessibility contract",
  },

  {
    id: "AF-A11Y-176",

    prove:
      "all required accessible names, roles, states, values, and relationships are present",
  },

  {
    id: "AF-A11Y-177",

    prove:
      "all required keyboard operations behave according to component contracts",
  },

  {
    id: "AF-A11Y-178",

    prove:
      "keyboard focus remains visible, ordered, persistent, and not entirely obscured",
  },

  {
    id: "AF-A11Y-179",

    prove:
      "author-styled focus indicators satisfy Afenda's strong focus appearance requirement",
  },

  {
    id: "AF-A11Y-180",

    prove:
      "pointer targets meet the applicable minimum-size or spacing requirement",
  },

  {
    id: "AF-A11Y-181",

    prove:
      "path-based and multipoint gestures provide required simpler alternatives",
  },

  {
    id: "AF-A11Y-182",

    prove: "drag functionality provides required non-drag pointer alternatives",
  },

  {
    id: "AF-A11Y-183",

    prove:
      "text and non-text contrast remain conformant across supported themes and tenant customisation",
  },

  {
    id: "AF-A11Y-184",

    prove: "consequential information does not rely on colour alone",
  },

  {
    id: "AF-A11Y-185",

    prove: "text remains usable at the required 200 percent enlargement",
  },

  {
    id: "AF-A11Y-186",

    prove: "non-exempt content satisfies the required reflow condition",
  },

  {
    id: "AF-A11Y-187",

    prove:
      "WCAG text-spacing overrides cause no loss of content or functionality",
  },

  {
    id: "AF-A11Y-188",

    prove:
      "reduced-motion mode preserves task capability and required state feedback",
  },

  {
    id: "AF-A11Y-189",

    prove:
      "forced-colours mode preserves component operation and consequential state distinction",
  },

  {
    id: "AF-A11Y-190",

    prove: "form errors are programmatically associated and understandable",
  },

  {
    id: "AF-A11Y-191",

    prove:
      "consequential transaction flows provide applicable review, correction, confirmation, or reversal",
  },

  {
    id: "AF-A11Y-192",

    prove:
      "important status updates are programmatically available without inappropriate focus movement",
  },

  {
    id: "AF-A11Y-193",

    prove:
      "static tables and interactive data grids use their correct semantic patterns",
  },

  {
    id: "AF-A11Y-194",

    prove:
      "DataGrid keyboard navigation, editing, selection, virtualisation, and focus behaviour satisfy its component contract",
  },

  {
    id: "AF-A11Y-195",

    prove:
      "modal dialog focus entry, containment, dismissal, and restoration satisfy the dialog contract",
  },

  {
    id: "AF-A11Y-196",

    prove:
      "no release relies solely on automated accessibility scanning as its complete accessibility evidence",
  },
] as const;

// =============================================================================
// RELEASE GATE
// =============================================================================

export const ACCESSIBILITY_RELEASE_GATE = {
  baseline: "WCAG 2.2 AA",

  policy: "fail-closed",

  releaseAllowedWhen: [
    "no known Level-A failures",
    "no known Level-AA failures",
    "all applicable Afenda mandatory enhancements pass",
    "component-specific accessibility contracts pass",
  ],

  waiverPolicy: {
    mustNotConvertFailureToPass: true,
    permitted: true,

    requires: [
      "specific failed requirement",
      "documented user impact",
      "documented technical reason",
      "approved remediation plan",
      "expiry or re-review condition",
    ],
  },
} as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const ACCESSIBILITY_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "static-validated",
    "dom-validated",
    "keyboard-validated",
    "pointer-validated",
    "visual-validated",
    "preference-validated",
    "accessibility-tree-validated",
    "manual-evidence-where-required",
  ],

  implementation: [
    "semantic",
    "keyboard-operable",
    "focus-operable",
    "pointer-operable",
    "perceivable",
    "adaptive",
    "preference-resilient",
  ],
  language: [
    "baseline-defined",
    "requirements-defined",
    "component-contract-defined",
    "proof-model-defined",
    "release-gate-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type AccessibilityPublicApi = typeof ACCESSIBILITY_PUBLIC_API;

export type AccessibilityRequirementDefinition =
  (typeof ACCESSIBILITY_REQUIREMENTS)[AccessibilityRequirement];

export type AccessibilityProofClassDefinition =
  (typeof ACCESSIBILITY_PROOF_CLASSES)[AccessibilityProofClass];

export type AccessibilitySourceDisposition =
  (typeof ACCESSIBILITY_SOURCE_DISPOSITION)[keyof typeof ACCESSIBILITY_SOURCE_DISPOSITION];
