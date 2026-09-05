/**
 * AFENDA DESIGN LANGUAGE — INTERACTION
 *
 * L1.07
 *
 * Defines the behavioural interaction language of Afenda.
 *
 * Primary influences:
 *
 *   - Material 3 interaction states
 *   - Material 3 state-layer model
 *   - Material 3 selection
 *   - Material 3 gesture vocabulary
 *   - web platform interaction semantics
 *
 * Afenda extends those concepts for:
 *
 *   - enterprise SaaS
 *   - keyboard-first professional use
 *   - pointer and touch coexistence
 *   - composable component states
 *   - selection and navigation
 *   - validation
 *   - asynchronous operations
 *   - drag and drop
 *   - resizable workspaces
 *   - gesture equivalence
 *   - assistive technology
 *
 * This file defines:
 *
 *   - interaction principles
 *   - state axes
 *   - availability
 *   - engagement
 *   - selection
 *   - checked state
 *   - current navigation
 *   - disclosure
 *   - validation
 *   - asynchronous operation
 *   - drag / drop
 *   - focus semantics
 *   - activation
 *   - input modalities
 *   - pointer behaviour
 *   - gesture behaviour
 *   - state composition
 *   - state presentation
 *   - component interaction contracts
 *
 * It deliberately defines NO visual state values.
 *
 * No:
 *   - opacity values
 *   - colours
 *   - CSS pseudo-class implementations
 *   - ripple implementations
 *   - focus-ring dimensions
 *   - ARIA attribute implementation code
 *   - event-handler implementation
 *
 * Those belong to Level 2.
 *
 * 08-accessibility.ts defines measurable and programmatic accessibility
 * requirements that interaction contracts must satisfy.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-005 Adaptation preserves task and context
 *   AF-PRI-006 State is explicit and composable
 *   AF-PRI-007 Accessibility is intrinsic
 *   AF-PRI-008 Motion explains change
 *   AF-PRI-010 Public UI APIs are finite
 *
 * Colour authority:
 *   02-color.ts
 *
 * Geometry authority:
 *   04-geometry.ts
 *
 * Layout authority:
 *   05-layout.ts
 *
 * Motion authority:
 *   06-motion.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

// =============================================================================
// IDENTITY
// =============================================================================

export const INTERACTION_LANGUAGE = {
  code: "INT",
  id: "interaction",
  level: 1,
  order: 7,

  philosophy:
    "Interaction state is semantic behaviour first and visual presentation second.",

  purpose:
    "Define how Afenda components expose, change, combine, and communicate interactive state across supported input modalities.",
  version: "1.0.0",
} as const;

// =============================================================================
// PRINCIPLES
// =============================================================================

export const INTERACTION_PRINCIPLES = [
  {
    id: "AF-INT-001",

    statement:
      "Interactive states are explicit semantic concepts rather than incidental visual styles.",
    strength: "must",
  },

  {
    id: "AF-INT-002",

    statement:
      "Independent state dimensions may coexist and must not be collapsed into one mutually exclusive state list.",
    strength: "must",
  },

  {
    id: "AF-INT-003",

    statement:
      "Interaction behaviour is independent from the input device used to invoke it.",
    strength: "must",
  },

  {
    id: "AF-INT-004",

    statement:
      "Hover is an enhancement and never the only path to essential information or functionality.",
    strength: "must",
  },

  {
    id: "AF-INT-005",

    statement:
      "Keyboard, pointer, touch, and assistive interaction must resolve to the same underlying semantic action where they invoke the same capability.",
    strength: "must",
  },

  {
    id: "AF-INT-006",

    statement:
      "Selection, checked state, current location, focus, and activation are distinct semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-007",

    statement:
      "Disabled, readonly, loading, and invalid are distinct component states and must not be used interchangeably.",
    strength: "must",
  },

  {
    id: "AF-INT-008",

    statement:
      "A gesture may enhance an interaction but must not unnecessarily become the sole mechanism for completing a task.",
    strength: "must",
  },

  {
    id: "AF-INT-009",

    statement:
      "State remains understandable independently from animation or colour alone.",
    strength: "must",
  },

  {
    id: "AF-INT-010",

    statement:
      "Application code uses interaction capabilities admitted by component contracts rather than inventing component behaviour locally.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// =============================================================================
// STATE MODEL
// =============================================================================

/**
 * THIS IS THE CORE AFENDA INTERACTION MODEL.
 *
 * States are organised into independent AXES.
 *
 * Example:
 *
 * A selected table row may be:
 *
 *   availability = enabled
 *   engagement   = focus-visible
 *   selection    = selected
 *   operation    = idle
 *
 * simultaneously.
 *
 * Another moment may be:
 *
 *   availability = enabled
 *   engagement   = hover
 *   selection    = selected
 *
 * There is deliberately no:
 *
 *   STATE = "selected-hover"
 *
 * combinatorial state explosion.
 */
export const INTERACTION_AXES = {
  availability: {
    purpose: "Whether and how the component permits user operation.",
  },

  check: {
    purpose: "Boolean or tri-state choice semantics.",
  },

  disclosure: {
    purpose: "Whether controlled content is collapsed or expanded.",
  },

  drag: {
    purpose: "Direct-manipulation state for draggable items and drop targets.",
  },

  engagement: {
    purpose:
      "Transient relationship between user input/focus and the component.",
  },

  navigation: {
    purpose:
      "Whether a navigation item represents the user's current location.",
  },

  operation: {
    purpose:
      "Whether an asynchronous or otherwise ongoing component operation is active.",
  },

  selection: {
    purpose: "Whether an item is selected within a selectable collection.",
  },

  validation: {
    purpose:
      "Whether user-provided or governed input currently violates validation requirements.",
  },
} as const;

export type InteractionAxis = keyof typeof INTERACTION_AXES;

// =============================================================================
// AVAILABILITY
// =============================================================================

export const AVAILABILITY_STATES = {
  disabled: {
    purpose: "Component is currently unavailable for its normal action.",
  },
  enabled: {
    purpose: "Component permits its normal interaction capabilities.",
  },

  readonly: {
    purpose:
      "Component exposes content or value but does not permit modification through its normal editing operation.",
  },
} as const;

export type AvailabilityState = keyof typeof AVAILABILITY_STATES;

// -----------------------------------------------------------------------------
// AVAILABILITY RULES
// -----------------------------------------------------------------------------

export const AVAILABILITY_RULES = [
  {
    id: "AF-INT-011",

    rule: "Enabled is the default availability state unless the component contract defines otherwise.",
    strength: "must",
  },

  {
    id: "AF-INT-012",

    rule: "Disabled means unavailable for the component's normal operation.",
    strength: "must",
  },

  {
    id: "AF-INT-013",

    rule: "Readonly means modification is prohibited while relevant reading, selection, navigation, or copying capabilities may remain available.",
    strength: "must",
  },

  {
    id: "AF-INT-014",

    rule: "Readonly must not be implemented merely as a visually disabled control.",
    strength: "must",
  },

  {
    id: "AF-INT-015",

    rule: "Disabled state does not erase other semantic state such as selected, checked, or expanded.",
    strength: "must",
  },

  {
    id: "AF-INT-016",

    rule: "Component contracts determine the appropriate focus behaviour of disabled widgets according to their interaction pattern.",
    strength: "must",
  },
] as const;

// =============================================================================
// ENGAGEMENT
// =============================================================================

/**
 * Engagement describes transient user interaction.
 *
 * REST is intentionally explicit internally, even though product APIs rarely
 * need to request it.
 */
export const ENGAGEMENT_STATES = {
  "focus-visible": {
    purpose: "The component currently requires a visible focus indicator.",
  },

  hover: {
    purpose:
      "A pointing device indicates potential interaction with the component.",
  },

  pressed: {
    purpose:
      "The component is actively engaged in an activation press interaction.",
  },
  rest: {
    purpose:
      "No transient hover, visible focus, press, or direct-manipulation emphasis is currently required.",
  },
} as const;

export type EngagementState = keyof typeof ENGAGEMENT_STATES;

// -----------------------------------------------------------------------------
// ENGAGEMENT RULES
// -----------------------------------------------------------------------------

export const ENGAGEMENT_RULES = [
  {
    id: "AF-INT-017",

    rule: "Hover indicates pointer proximity and must not imply selection or activation.",
    strength: "must",
  },

  {
    id: "AF-INT-018",

    rule: "Focus-visible communicates keyboard or equivalent focus visibility and must remain distinct from hover.",
    strength: "must",
  },

  {
    id: "AF-INT-019",

    rule: "Pressed represents an in-progress activation interaction rather than a persistent selected state.",
    strength: "must",
  },

  {
    id: "AF-INT-020",

    rule: "Hover, focus-visible, and selection may coexist when their semantic conditions coexist.",
    strength: "must",
  },

  {
    id: "AF-INT-021",

    rule: "Visible focus must remain distinguishable when the component is simultaneously hovered, selected, checked, invalid, or otherwise styled.",
    strength: "must",
  },

  {
    id: "AF-INT-022",

    rule: "Hover-dependent content must also have a non-hover mechanism when the content is necessary for understanding or operating the interface.",
    strength: "must",
  },
] as const;

// =============================================================================
// FOCUS
// =============================================================================

/**
 * DOM / platform focus and FOCUS-VISIBLE are related but not identical.
 *
 * Programmatic focus:
 *
 *   identifies the active interaction target
 *
 * Focus-visible:
 *
 *   determines that the user requires a visible focus indication.
 *
 * Level 2 maps these semantics to the web platform.
 */
export const FOCUS_MODEL = {
  focus: {
    purpose:
      "Identifies the component or composite descendant currently participating in keyboard or equivalent sequential interaction.",
  },

  "focus-visible": {
    purpose: "Requires a clearly perceptible focus indicator.",
  },
} as const;

// -----------------------------------------------------------------------------
// FOCUS STRATEGIES
// -----------------------------------------------------------------------------

/**
 * Composite widgets may require different focus implementations.
 *
 * The component contract selects one.
 */
export const FOCUS_STRATEGIES = {
  descendant: {
    purpose:
      "The composite retains focus while separately identifying an active descendant.",
  },
  direct: {
    purpose:
      "Each interactive item participates directly in platform focus order.",
  },

  roving: {
    purpose:
      "One item within a composite participates in sequential tab order while internal navigation moves active focus among peers.",
  },
} as const;

export type FocusStrategy = keyof typeof FOCUS_STRATEGIES;

// -----------------------------------------------------------------------------
// FOCUS RULES
// -----------------------------------------------------------------------------

export const FOCUS_RULES = [
  {
    id: "AF-INT-023",

    rule: "Every keyboard-operable component has a defined focus strategy.",
    strength: "must",
  },

  {
    id: "AF-INT-024",

    rule: "Focus order follows task and semantic structure rather than visual decoration.",
    strength: "must",
  },

  {
    id: "AF-INT-025",

    rule: "Focus-visible presentation must not depend on hover.",
    strength: "must",
  },

  {
    id: "AF-INT-026",

    rule: "Opening temporary interactive content defines where focus initially moves when focus movement is required.",
    strength: "must",
  },

  {
    id: "AF-INT-027",

    rule: "Closing temporary interactive content defines meaningful focus restoration where applicable.",
    strength: "must",
  },

  {
    id: "AF-INT-028",

    rule: "Adaptive layout changes must not silently discard focus.",
    strength: "must",
  },

  {
    id: "AF-INT-029",

    rule: "A composite component selects one governed focus strategy rather than mixing incompatible strategies incidentally.",
    strength: "must",
  },
] as const;

// =============================================================================
// SELECTION
// =============================================================================

/**
 * SELECTED means:
 *
 *   this item is chosen within a selectable collection
 *
 * It does NOT mean:
 *
 *   currently focused
 *   currently pressed
 *   checked
 *   current navigation destination
 */
export const SELECTION_STATES = {
  selected: {
    purpose: "Selectable collection item is currently selected.",
  },
  unselected: {
    purpose: "Selectable collection item is not currently selected.",
  },
} as const;

export type SelectionState = keyof typeof SELECTION_STATES;

// -----------------------------------------------------------------------------
// SELECTION MODES
// -----------------------------------------------------------------------------

export const SELECTION_MODES = {
  multiple: {
    purpose: "Multiple items may be selected simultaneously.",
  },
  none: {
    purpose: "Collection does not support item selection.",
  },

  single: {
    purpose: "At most one item is selected within the governed collection.",
  },
} as const;

export type SelectionMode = keyof typeof SELECTION_MODES;

// -----------------------------------------------------------------------------
// SELECTION RULES
// -----------------------------------------------------------------------------

export const SELECTION_RULES = [
  {
    id: "AF-INT-030",

    rule: "Selection identifies chosen collection items and must remain separate from focus.",
    strength: "must",
  },

  {
    id: "AF-INT-031",

    rule: "A selectable collection declares its selection mode.",
    strength: "must",
  },

  {
    id: "AF-INT-032",

    rule: "Selected state may coexist with hover, focus-visible, disabled, or other independent state axes.",
    strength: "must",
  },

  {
    id: "AF-INT-033",

    rule: "Selected state must not be represented solely through colour.",
    strength: "must",
  },

  {
    id: "AF-INT-034",

    rule: "Selection persists according to the owning component or workflow contract rather than disappearing merely because focus moves.",
    strength: "must",
  },
] as const;

// =============================================================================
// CHECKED STATE
// =============================================================================

/**
 * CHECKED is not SELECTED.
 *
 * Checkbox / switch / radio semantics express a value or choice.
 * Collection selection expresses which objects are chosen for interaction.
 */
export const CHECK_STATES = {
  checked: {
    purpose: "Boolean or choice state is set.",
  },

  indeterminate: {
    purpose:
      "Tri-state control represents a mixed or partially selected state.",
  },
  unchecked: {
    purpose: "Boolean or choice state is not set.",
  },
} as const;

export type CheckState = keyof typeof CHECK_STATES;

// -----------------------------------------------------------------------------
// CHECK RULES
// -----------------------------------------------------------------------------

export const CHECK_RULES = [
  {
    id: "AF-INT-035",

    rule: "Checked and selected are separate semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-036",

    rule: "Indeterminate is used only by component patterns whose value model genuinely supports a mixed state.",
    strength: "must",
  },

  {
    id: "AF-INT-037",

    rule: "Checked state remains programmatically determinable independently from its visual indicator.",
    strength: "must",
  },

  {
    id: "AF-INT-038",

    rule: "A component must not expose indeterminate merely as a decorative intermediate animation state.",
    strength: "must",
  },
] as const;

// =============================================================================
// CURRENT NAVIGATION
// =============================================================================

/**
 * CURRENT means:
 *
 *   this navigation item represents the user's current location/context.
 *
 * It is not selection.
 */
export const NAVIGATION_STATES = {
  current: {
    purpose:
      "Navigation item represents the current page, route, step, location, or equivalent navigation context.",
  },
  none: {
    purpose: "Navigation item does not represent the current destination.",
  },
} as const;

export type NavigationState = keyof typeof NAVIGATION_STATES;

// -----------------------------------------------------------------------------
// NAVIGATION RULES
// -----------------------------------------------------------------------------

export const NAVIGATION_STATE_RULES = [
  {
    id: "AF-INT-039",

    rule: "Current navigation and collection selection are separate semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-040",

    rule: "Current navigation indication persists independently from focus.",
    strength: "must",
  },

  {
    id: "AF-INT-041",

    rule: "A navigation item must not use selected semantics merely because it represents the current destination.",
    strength: "must",
  },
] as const;

// =============================================================================
// DISCLOSURE
// =============================================================================

export const DISCLOSURE_STATES = {
  collapsed: {
    purpose: "Controlled disclosure content is not currently presented.",
  },

  expanded: {
    purpose: "Controlled disclosure content is currently presented.",
  },
} as const;

export type DisclosureState = keyof typeof DISCLOSURE_STATES;

// -----------------------------------------------------------------------------
// DISCLOSURE RULES
// -----------------------------------------------------------------------------

export const DISCLOSURE_RULES = [
  {
    id: "AF-INT-042",

    rule: "Disclosure state describes visibility of controlled content rather than selection.",
    strength: "must",
  },

  {
    id: "AF-INT-043",

    rule: "The controlling component and controlled content have a defined relationship.",
    strength: "must",
  },

  {
    id: "AF-INT-044",

    rule: "Expanded and collapsed state remain programmatically determinable.",
    strength: "must",
  },

  {
    id: "AF-INT-045",

    rule: "Disclosure motion is optional presentation and does not determine when semantic expansion becomes effective.",
    strength: "must",
  },
] as const;

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Interaction owns the INVALID state.
 *
 * 09-content.ts owns error wording.
 * 08-accessibility.ts owns error announcement and programmatic requirements.
 */
export const VALIDATION_STATES = {
  invalid: {
    purpose:
      "Current value violates one or more applicable validation requirements.",
  },
  valid: {
    purpose:
      "Current value does not violate the component's applicable validation requirements.",
  },
} as const;

export type ValidationState = keyof typeof VALIDATION_STATES;

// -----------------------------------------------------------------------------
// VALIDATION RULES
// -----------------------------------------------------------------------------

export const VALIDATION_RULES = [
  {
    id: "AF-INT-046",

    rule: "Invalid state reflects validation outcome rather than general business warning or negative status.",
    strength: "must",
  },

  {
    id: "AF-INT-047",

    rule: "Invalid state may coexist with focus-visible, readonly, disabled, or other applicable independent states.",
    strength: "must",
  },

  {
    id: "AF-INT-048",

    rule: "Invalid state must not be communicated solely by colour.",
    strength: "must",
  },

  {
    id: "AF-INT-049",

    rule: "A validation state transition must not automatically move focus unless the workflow contract requires focus movement.",
    strength: "must",
  },

  {
    id: "AF-INT-050",

    rule: "Valid state does not require decorative success indication unless the task benefits from explicit validation confirmation.",
    strength: "must",
  },
] as const;

// =============================================================================
// OPERATION / LOADING
// =============================================================================

/**
 * LOADING is deliberately separate from DISABLED.
 *
 * Loading communicates ongoing work.
 *
 * Whether additional activation is permitted depends on the component
 * contract.
 */
export const OPERATION_STATES = {
  idle: {
    purpose:
      "No governed asynchronous component operation is currently active.",
  },

  loading: {
    purpose:
      "An initiated operation affecting this component is currently in progress.",
  },
} as const;

export type OperationState = keyof typeof OPERATION_STATES;

// -----------------------------------------------------------------------------
// LOADING BEHAVIOUR
// -----------------------------------------------------------------------------

export const LOADING_BEHAVIOURS = {
  blocking: {
    purpose:
      "Repeated activation or editing is temporarily unavailable while the operation completes.",
  },

  cancellable: {
    purpose:
      "The ongoing operation exposes an explicit cancellation capability.",
  },

  nonblocking: {
    purpose:
      "The operation continues while other permitted interaction remains available.",
  },
} as const;

export type LoadingBehaviour = keyof typeof LOADING_BEHAVIOURS;

// -----------------------------------------------------------------------------
// OPERATION RULES
// -----------------------------------------------------------------------------

export const OPERATION_RULES = [
  {
    id: "AF-INT-051",

    rule: "Loading and disabled are separate semantic states.",
    strength: "must",
  },

  {
    id: "AF-INT-052",

    rule: "A component supporting loading declares whether loading is blocking, nonblocking, or cancellable.",
    strength: "must",
  },

  {
    id: "AF-INT-053",

    rule: "Blocking loading prevents accidental duplicate activation where duplicate operation would be unsafe or meaningless.",
    strength: "must",
  },

  {
    id: "AF-INT-054",

    rule: "Loading must remain programmatically understandable independently from animated presentation.",
    strength: "must",
  },

  {
    id: "AF-INT-055",

    rule: "A loading indicator does not imply successful completion.",
    strength: "must",
  },

  {
    id: "AF-INT-056",

    rule: "Completion of presentation motion is not used as the definition of operation completion.",
    strength: "must",
  },
] as const;

// =============================================================================
// DRAG / DROP
// =============================================================================

/**
 * Drag-and-drop requires more semantics than M3's visual `dragged` state.
 */
export const DRAG_STATES = {
  dragging: {
    purpose:
      "Object or its representation is currently following pointer-driven direct manipulation.",
  },

  "drop-target": {
    purpose:
      "Region is currently a valid destination for the active move operation.",
  },

  grabbed: {
    purpose:
      "Object has been selected as the subject of a move/reorder operation.",
  },
  idle: {
    purpose: "Object is not participating in direct manipulation.",
  },
} as const;

export type DragState = keyof typeof DRAG_STATES;

// -----------------------------------------------------------------------------
// DRAG CAPABILITIES
// -----------------------------------------------------------------------------

export const DRAG_CAPABILITIES = {
  move: {
    purpose: "Move an object from one valid container or location to another.",
  },
  reorder: {
    purpose: "Change relative order among peer objects.",
  },

  resize: {
    purpose: "Change a governed dimension using direct manipulation.",
  },

  spatial: {
    purpose:
      "Place an object at a meaningful spatial position where position itself carries information.",
  },
} as const;

export type DragCapability = keyof typeof DRAG_CAPABILITIES;

// -----------------------------------------------------------------------------
// DRAG RULES
// -----------------------------------------------------------------------------

export const DRAG_RULES = [
  {
    id: "AF-INT-057",

    rule: "Drag interaction has a defined semantic operation such as reorder, move, resize, or spatial placement.",
    strength: "must",
  },

  {
    id: "AF-INT-058",

    rule: "Dragging is not the only operation mechanism when the same function can reasonably be provided through a non-drag single-pointer alternative.",
    strength: "must",
  },

  {
    id: "AF-INT-059",

    rule: "Keyboard operation is defined independently from pointer drag operation where the component is keyboard-operable.",
    strength: "must",
  },

  {
    id: "AF-INT-060",

    rule: "A valid drop target is distinguishable independently from colour alone.",
    strength: "must",
  },

  {
    id: "AF-INT-061",

    rule: "Cancelling a drag restores a valid prior state unless the component contract explicitly defines another reversible outcome.",
    strength: "must",
  },

  {
    id: "AF-INT-062",

    rule: "A drag operation must not silently trigger an irreversible domain action merely because the pointer was released over a destination.",
    strength: "must",
  },

  {
    id: "AF-INT-063",

    rule: "Resizable-pane drag behaviour remains subordinate to the layout and accessibility contracts.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACTIVATION
// =============================================================================

/**
 * Activation semantics describe what interaction means.
 */
export const ACTIVATION_KINDS = {
  action: {
    purpose: "Invoke an immediate command or operation.",
  },

  disclose: {
    purpose: "Expand or collapse controlled content.",
  },

  edit: {
    purpose: "Change user-editable data or value.",
  },

  navigation: {
    purpose: "Move to another route, destination, object, or location.",
  },

  select: {
    purpose: "Choose an item within a selectable collection.",
  },

  toggle: {
    purpose: "Change a persistent binary component state.",
  },
} as const;

export type ActivationKind = keyof typeof ACTIVATION_KINDS;

// -----------------------------------------------------------------------------
// ACTIVATION RULES
// -----------------------------------------------------------------------------

export const ACTIVATION_RULES = [
  {
    id: "AF-INT-064",

    rule: "Every interactive component has a defined primary interaction purpose.",
    strength: "must",
  },

  {
    id: "AF-INT-065",

    rule: "Action and navigation semantics must not be exchanged merely because they can share similar visual presentation.",
    strength: "must",
  },

  {
    id: "AF-INT-066",

    rule: "Activation through different supported input mechanisms produces the same semantic result.",
    strength: "must",
  },

  {
    id: "AF-INT-067",

    rule: "Consequential pointer activation should normally complete on an activation/click-equivalent event rather than irreversibly on initial pointer-down.",
    strength: "must",
  },

  {
    id: "AF-INT-068",

    rule: "Cancelling pointer interaction before completed activation must not trigger the action where cancellation is supported by the platform pattern.",
    strength: "must",
  },
] as const;

// =============================================================================
// INPUT MODALITIES
// =============================================================================

/**
 * These describe INPUT CAPABILITIES, not device categories.
 *
 * Afenda must support concurrent mechanisms.
 *
 * Laptop users may use:
 *
 *   keyboard
 *   touchpad
 *   touch
 *   assistive technology
 *
 * in the same session.
 */
export const INPUT_MODALITIES = {
  assistive: {
    purpose:
      "Interaction mediated by assistive technologies through programmatic component semantics.",
  },
  keyboard: {
    purpose: "Discrete key-driven operation and navigation.",
  },

  pointer: {
    purpose:
      "Single-point mouse, trackpad, stylus, or equivalent pointing interaction.",
  },

  touch: {
    purpose:
      "Direct pointer interaction where target ergonomics materially differ from fine pointer interaction.",
  },
} as const;

export type InputModality = keyof typeof INPUT_MODALITIES;

// -----------------------------------------------------------------------------
// MODALITY RULES
// -----------------------------------------------------------------------------

export const INPUT_MODALITY_RULES = [
  {
    id: "AF-INT-069",

    rule: "Afenda must not permanently classify a user as keyboard, pointer, or touch based on a previous interaction.",
    strength: "must",
  },

  {
    id: "AF-INT-070",

    rule: "A component may adapt ergonomic presentation to available input capabilities without changing semantic behaviour.",
    strength: "must",
  },

  {
    id: "AF-INT-071",

    rule: "Viewport size must not be used as proof of input modality.",
    strength: "must",
  },

  {
    id: "AF-INT-072",

    rule: "Supporting one input mechanism must not unnecessarily disable another concurrent input mechanism.",
    strength: "must",
  },

  {
    id: "AF-INT-073",

    rule: "Assistive-technology operation depends on the same component meaning, name, role, state, and value exposed by the normal interaction model.",
    strength: "must",
  },
] as const;

// =============================================================================
// POINTER / HOVER
// =============================================================================

export const POINTER_RULES = [
  {
    id: "AF-INT-074",

    rule: "Pointer hover may preview available interaction but must not perform consequential activation.",
    strength: "must",
  },

  {
    id: "AF-INT-075",

    rule: "Essential controls must not exist only during hover.",
    strength: "must",
  },

  {
    id: "AF-INT-076",

    rule: "Additional content opened by hover or focus must remain operable according to the accessibility contract.",
    strength: "must",
  },

  {
    id: "AF-INT-077",

    rule: "Pointer interaction must respect the effective target geometry defined by 04-geometry.ts.",
    strength: "must",
  },

  {
    id: "AF-INT-078",

    rule: "Hover presentation must not visually override a visible focus indicator.",
    strength: "must",
  },
] as const;

// =============================================================================
// GESTURES
// =============================================================================

/**
 * Afenda retains a small gesture vocabulary as interaction capability.
 *
 * Gesture names describe user input.
 *
 * They are not component APIs by themselves.
 */
export const GESTURES = {
  activate: {
    purpose:
      "Single click, tap, keyboard activation, or equivalent simple activation.",
  },

  "double-activate": {
    purpose:
      "Two rapid activations recognised as an optional shortcut where a single-action alternative remains available.",
  },

  drag: {
    purpose:
      "Direct manipulation where an engaged object follows pointer movement.",
  },

  "long-press": {
    purpose:
      "Sustained pointer contact used as an optional shortcut or contextual enhancement.",
  },

  pinch: {
    purpose: "Multipoint scaling gesture.",
  },

  swipe: {
    purpose: "Directional path-based pointer gesture.",
  },
} as const;

export type Gesture = keyof typeof GESTURES;

// -----------------------------------------------------------------------------
// GESTURE RULES
// -----------------------------------------------------------------------------

export const GESTURE_RULES = [
  {
    id: "AF-INT-079",

    rule: "Single activation is the preferred primary pointer interaction for ordinary controls.",
    strength: "must",
  },

  {
    id: "AF-INT-080",

    rule: "Double activation must not be the only mechanism for essential functionality.",
    strength: "must",
  },

  {
    id: "AF-INT-081",

    rule: "Long press must not be the sole mechanism for discovering or invoking essential functionality.",
    strength: "must",
  },

  {
    id: "AF-INT-082",

    rule: "Multipoint or path-based gesture functionality has an equivalent simpler interaction unless the gesture is essential to the function.",
    strength: "must",
  },

  {
    id: "AF-INT-083",

    rule: "A drag alternative must not merely substitute another inaccessible path-based gesture.",
    strength: "must",
  },

  {
    id: "AF-INT-084",

    rule: "Gesture shortcuts may accelerate expert workflows but must not replace discoverable base operations.",
    strength: "should",
  },

  {
    id: "AF-INT-085",

    rule: "Gesture recognition must not interfere with normal scrolling when scrolling is the user's intended operation.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATE COMPOSITION
// =============================================================================

/**
 * This replaces the idea that hover / focus / press / selected etc. form one
 * mutually exclusive cardinality.
 *
 * Independent axes compose.
 */
export const STATE_COMPOSITION = {
  axes: [
    "availability",
    "engagement",
    "selection",
    "check",
    "navigation",
    "disclosure",
    "validation",
    "operation",
    "drag",
  ] as const,
  composable: true,

  principle:
    "Each component declares which axes apply and which combinations are legal.",
} as const;

// -----------------------------------------------------------------------------
// EXAMPLE COMPOSITIONS
// -----------------------------------------------------------------------------

export const STATE_COMPOSITION_EXAMPLES = {
  "checked-disabled-checkbox": {
    availability: "disabled",

    check: "checked",
  },

  "current-navigation-item": {
    engagement: "focus-visible",
    navigation: "current",
  },

  "invalid-text-field": {
    availability: "enabled",

    engagement: "focus-visible",

    operation: "idle",

    validation: "invalid",
  },

  "loading-button": {
    availability: "enabled",

    operation: "loading",
  },

  "readonly-field": {
    availability: "readonly",

    engagement: "focus-visible",
  },
  "selected-grid-row": {
    availability: "enabled",

    engagement: "focus-visible",

    operation: "idle",

    selection: "selected",
  },
} as const;

// -----------------------------------------------------------------------------
// COMPOSITION RULES
// -----------------------------------------------------------------------------

export const STATE_COMPOSITION_RULES = [
  {
    id: "AF-INT-086",

    rule: "Independent state axes may coexist.",
    strength: "must",
  },

  {
    id: "AF-INT-087",

    rule: "Component contracts declare which state axes apply to the component.",
    strength: "must",
  },

  {
    id: "AF-INT-088",

    rule: "Component contracts declare illegal state combinations where semantics would otherwise conflict.",
    strength: "must",
  },

  {
    id: "AF-INT-089",

    rule: "Implementation must not create combinatorial public variant names such as selected-hover-disabled.",
    strength: "must",
  },

  {
    id: "AF-INT-090",

    rule: "One axis must not silently redefine the meaning of another axis.",
    strength: "must",
  },

  {
    id: "AF-INT-091",

    rule: "Disabled availability suppresses prohibited activation but does not erase persistent value or selection semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-092",

    rule: "Focus-visible remains perceivable regardless of other simultaneously active visual states.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATE PRESENTATION
// =============================================================================

/**
 * M3's state-layer model remains useful as one PRESENTATION technique.
 *
 * Afenda does not require every state to be represented by a translucent
 * state layer.
 *
 * State may be communicated through:
 *
 *   colour
 *   state layer
 *   outline
 *   indicator
 *   icon
 *   geometry
 *   elevation
 *   typography
 *   motion
 *
 * provided the relevant semantic and accessibility requirements are met.
 */
export const STATE_PRESENTATION_CHANNELS = {
  container: {
    purpose:
      "Container treatment communicating persistent or transient semantic state.",
  },

  content: {
    purpose: "Foreground treatment supporting state distinction.",
  },

  elevation: {
    purpose: "Governed depth change where interaction semantics justify it.",
  },

  geometry: {
    purpose:
      "Governed geometric change where the component semantics admit it.",
  },

  icon: {
    purpose:
      "Iconographic representation of a state where meaning remains understandable.",
  },

  indicator: {
    purpose: "Dedicated visible mark representing state.",
  },

  motion: {
    purpose: "Transition feedback communicating a state change.",
  },

  outline: {
    purpose:
      "Boundary treatment communicating focus, validation, or other component state.",
  },
  "state-layer": {
    purpose: "Overlay treatment communicating transient interaction emphasis.",
  },
} as const;

export type StatePresentationChannel = keyof typeof STATE_PRESENTATION_CHANNELS;

// -----------------------------------------------------------------------------
// STATE PRESENTATION RULES
// -----------------------------------------------------------------------------

export const STATE_PRESENTATION_RULES = [
  {
    id: "AF-INT-093",

    rule: "Visual state presentation does not define the underlying semantic state.",
    strength: "must",
  },

  {
    id: "AF-INT-094",

    rule: "State layers are optional presentation mechanisms rather than universal interaction semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-095",

    rule: "Raw state-layer opacity values are Level-2 implementation values.",
    strength: "must",
  },

  {
    id: "AF-INT-096",

    rule: "Persistent states such as selected, checked, current, expanded, invalid, and loading remain understandable after transient hover or press presentation ends.",
    strength: "must",
  },

  {
    id: "AF-INT-097",

    rule: "Visible focus remains independently distinguishable from hover, selected, current, invalid, and pressed presentation.",
    strength: "must",
  },

  {
    id: "AF-INT-098",

    rule: "Colour may support state presentation but must not become the sole representation of consequential state.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATE PRIORITY
// =============================================================================

/**
 * This is semantic priority, NOT a mandatory CSS stacking order.
 */
export const INTERACTION_STATE_PRIORITY = [
  "availability",
  "focus-visible",
  "operation",
  "validation",
  "drag",
  "pressed",
  "selection-or-check-or-current",
  "hover",
  "rest",
] as const;

export const STATE_PRIORITY_RULES = [
  {
    id: "AF-INT-099",

    rule: "Higher-priority semantics must remain perceptible when lower-priority presentation is simultaneously active.",
    strength: "must",
  },

  {
    id: "AF-INT-100",

    rule: "Hover must not obscure focus-visible, invalid, loading, or disabled meaning.",
    strength: "must",
  },

  {
    id: "AF-INT-101",

    rule: "Pressed presentation is transient and must not obscure persistent selection or checked state after activation.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATE → PROGRAMMATIC SEMANTICS
// =============================================================================

/**
 * Exact platform implementation belongs to Level 2 / accessibility.
 *
 * This table records the semantic relationship that MUST exist.
 */
export const PROGRAMMATIC_STATE_REQUIREMENTS = {
  checked: "checked state is programmatically determinable",

  current: "current navigation relationship is programmatically determinable",
  disabled: "availability is programmatically determinable",

  expanded:
    "disclosure state and controlled relationship are programmatically determinable",

  indeterminate: "mixed checked state is programmatically determinable",

  invalid: "invalid state is programmatically determinable",

  loading:
    "busy or ongoing-operation state is programmatically determinable where applicable",

  readonly:
    "readonly semantics are programmatically determinable where the platform role supports them",

  selected: "selection state is programmatically determinable",
} as const;

// =============================================================================
// INTERACTION / MOTION
// =============================================================================

export const INTERACTION_MOTION_RELATIONSHIP = {
  disclosure: {
    role: "component",
  },

  drag: {
    role: "continuity",
  },
  hover: {
    role: "state",
  },

  loading: {
    role: "progress",
  },

  pressed: {
    role: "feedback",
  },
} as const;

// -----------------------------------------------------------------------------
// MOTION RULES
// -----------------------------------------------------------------------------

export const INTERACTION_MOTION_RULES = [
  {
    id: "AF-INT-102",

    rule: "Motion communicates interaction-state change but does not determine when the semantic state changes.",
    strength: "must",
  },

  {
    id: "AF-INT-103",

    rule: "Pressed feedback must not delay activation.",
    strength: "must",
  },

  {
    id: "AF-INT-104",

    rule: "Loading remains understandable when repetitive motion is removed.",
    strength: "must",
  },

  {
    id: "AF-INT-105",

    rule: "Drag motion remains responsive to direct manipulation rather than following decorative timing.",
    strength: "must",
  },
] as const;

// =============================================================================
// INTERACTION / LAYOUT
// =============================================================================

export const INTERACTION_LAYOUT_RULES = [
  {
    id: "AF-INT-106",

    rule: "Pane visibility changes preserve applicable component state.",
    strength: "must",
  },

  {
    id: "AF-INT-107",

    rule: "When adaptive layout removes a focused element from presentation, the owning pattern defines meaningful focus transfer.",
    strength: "must",
  },

  {
    id: "AF-INT-108",

    rule: "Resizable layout components declare resize as a governed drag capability and provide the required alternative operation.",
    strength: "must",
  },
] as const;

// =============================================================================
// INTERACTION / CONTENT
// =============================================================================

export const INTERACTION_CONTENT_REQUIREMENTS = {
  destructive: {
    description:
      "Action language communicates object, scope, and consequence where required.",
  },
  disabled: {
    description:
      "Reason may be exposed where unavailable capability would otherwise be confusing.",
  },

  invalid: {
    description:
      "Error communication identifies what is wrong and how to recover where recovery is possible.",
  },

  loading: {
    description:
      "Status communicates ongoing work when the operation is not immediately apparent.",
  },
} as const;

// =============================================================================
// TENANT POLICY
// =============================================================================

/**
 * Interaction is a protected product behaviour.
 */
export const INTERACTION_TENANT_POLICY = {
  customisable: [],
  default: "closed",

  principle:
    "Tenant identity may change permitted presentation but not Afenda interaction semantics.",

  protected: [
    "state semantics",
    "selection semantics",
    "focus behaviour",
    "activation behaviour",
    "gesture behaviour",
    "loading semantics",
    "validation semantics",
    "drag semantics",
    "keyboard behaviour",
  ],
} as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const INTERACTION_TENANT_RULES = [
  {
    id: "AF-INT-109",

    rule: "Tenant customisation must not redefine interaction state semantics.",
    strength: "must",
  },

  {
    id: "AF-INT-110",

    rule: "Tenant customisation must not remove focus, keyboard, pointer, or gesture-equivalence requirements.",
    strength: "must",
  },

  {
    id: "AF-INT-111",

    rule: "Tenant styling must preserve distinguishability of consequential states.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACCESSIBILITY RELATIONSHIP
// =============================================================================

/**
 * 08-accessibility.ts owns normative measurable requirements.
 *
 * Interaction declares what must be made accessible.
 */
export const INTERACTION_ACCESSIBILITY_REQUIREMENTS = [
  "keyboard-operability",
  "focus-visible",
  "focus-order",
  "focus-not-obscured",
  "focus-restoration",
  "name-role-state-value",
  "pointer-cancellation",
  "pointer-gesture-alternative",
  "drag-alternative",
  "target-size",
  "non-colour-state",
  "status-announcement",
  "error-identification",
] as const;

// -----------------------------------------------------------------------------
// ACCESSIBILITY RULES
// -----------------------------------------------------------------------------

export const INTERACTION_ACCESSIBILITY_RULES = [
  {
    id: "AF-INT-112",

    rule: "Interactive capabilities expose the programmatic semantics required by their component contract.",
    strength: "must",
  },

  {
    id: "AF-INT-113",

    rule: "Keyboard focus must not become entirely obscured by author-created layout.",
    strength: "must",
  },

  {
    id: "AF-INT-114",

    rule: "Functionality based on multipoint or path-based gestures provides a simpler pointer mechanism unless the gesture is essential.",
    strength: "must",
  },

  {
    id: "AF-INT-115",

    rule: "Dragging functionality provides a non-drag single-pointer mechanism unless dragging is essential.",
    strength: "must",
  },

  {
    id: "AF-INT-116",

    rule: "Keyboard equivalence and non-drag pointer equivalence are evaluated as separate interaction requirements.",
    strength: "must",
  },

  {
    id: "AF-INT-117",

    rule: "State changes that produce important status information remain perceivable without requiring focus to move to the status content.",
    strength: "must",
  },
] as const;

// =============================================================================
// COMPONENT INTERACTION CONTRACT
// =============================================================================

/**
 * Every governed interactive component declares this information.
 *
 * Example Button:
 *
 *   purpose      = action
 *   availability = enabled | disabled
 *   engagement   = hover | focus-visible | pressed
 *   operation    = idle | loading
 *
 * Example Checkbox:
 *
 *   purpose      = toggle
 *   availability = enabled | disabled | readonly?
 *   engagement   = hover | focus-visible | pressed
 *   check        = unchecked | checked | indeterminate
 *
 * Example DataGrid row:
 *
 *   purpose      = select
 *   availability = enabled
 *   engagement   = hover | focus-visible
 *   selection    = selected | unselected
 */
export interface ComponentInteractionContract {
  readonly activation: readonly ActivationKind[];

  readonly axes: readonly InteractionAxis[];

  readonly dragCapabilities?: readonly DragCapability[];

  readonly focusStrategy?: FocusStrategy;

  readonly gestures?: readonly Gesture[];

  readonly illegalCombinations?: readonly string[];

  readonly loadingBehaviour?: readonly LoadingBehaviour[];

  readonly restoresFocus?: boolean;

  readonly selectionMode?: SelectionMode;
}

// =============================================================================
// COMPONENT STATE MATRIX CONTRACT
// =============================================================================

export interface ComponentStateMatrix {
  readonly availability?: readonly AvailabilityState[];

  readonly check?: readonly CheckState[];

  readonly disclosure?: readonly DisclosureState[];

  readonly drag?: readonly DragState[];

  readonly engagement?: readonly EngagementState[];

  readonly navigation?: readonly NavigationState[];

  readonly operation?: readonly OperationState[];

  readonly selection?: readonly SelectionState[];

  readonly validation?: readonly ValidationState[];
}

// =============================================================================
// PUBLIC API
// =============================================================================

export const INTERACTION_PUBLIC_API = {
  activation: ["action", "navigation", "toggle", "select", "disclose", "edit"],
  availability: ["enabled", "disabled", "readonly"],

  check: ["unchecked", "checked", "indeterminate"],

  disclosure: ["collapsed", "expanded"],

  drag: ["idle", "grabbed", "dragging", "drop-target"],

  engagement: ["hover", "focus-visible", "pressed"],

  focusStrategy: ["direct", "roving", "descendant"],

  gesture: [
    "activate",
    "double-activate",
    "long-press",
    "drag",
    "swipe",
    "pinch",
  ],

  input: ["keyboard", "pointer", "touch", "assistive"],

  navigation: ["current"],

  operation: ["idle", "loading"],

  selection: ["unselected", "selected"],

  validation: ["valid", "invalid"],
} as const;

// =============================================================================
// FORBIDDEN USAGE
// =============================================================================

export const INTERACTION_FORBIDS = [
  {
    behaviour:
      "hover, focus, pressed, selected, checked, and current are treated as interchangeable states",
    id: "AF-INT-118",
    strength: "must",
  },

  {
    behaviour:
      "component implementation creates combined public variants such as selected-hover-focused",
    id: "AF-INT-119",
    strength: "must",
  },

  {
    behaviour: "hover is required to discover essential functionality",
    id: "AF-INT-120",
    strength: "must",
  },

  {
    behaviour:
      "focus-visible presentation disappears because another state such as selected or invalid is active",
    id: "AF-INT-121",
    strength: "must",
  },

  {
    behaviour: "readonly is implemented merely as disabled presentation",
    id: "AF-INT-122",
    strength: "must",
  },

  {
    behaviour: "loading and disabled are treated as equivalent semantics",
    id: "AF-INT-123",
    strength: "must",
  },

  {
    behaviour: "selected is used to represent current navigation location",
    id: "AF-INT-124",
    strength: "must",
  },

  {
    behaviour:
      "checked state is represented using collection-selection semantics",
    id: "AF-INT-125",
    strength: "must",
  },

  {
    behaviour:
      "invalid state is used to represent ordinary business warning or negative outcome",
    id: "AF-INT-126",
    strength: "must",
  },

  {
    behaviour:
      "a path-based, multipoint, long-press, or double-activation gesture is the only ordinary mechanism for essential functionality",
    id: "AF-INT-127",
    strength: "must",
  },

  {
    behaviour:
      "drag is the sole mechanism for an operation where an equivalent non-drag mechanism is required",
    id: "AF-INT-128",
    strength: "must",
  },

  {
    behaviour: "viewport width is used to infer input modality",
    id: "AF-INT-129",
    strength: "must",
  },

  {
    behaviour: "component state is communicated solely through animation",
    id: "AF-INT-130",
    strength: "must",
  },

  {
    behaviour:
      "component state is communicated solely through colour when the state is consequential",
    id: "AF-INT-131",
    strength: "must",
  },

  {
    behaviour:
      "raw M3 state-layer opacity values become application-facing interaction API",
    id: "AF-INT-132",
    strength: "must",
  },

  {
    behaviour: "tenant customisation changes component interaction semantics",
    id: "AF-INT-133",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const INTERACTION_SOURCES = [
  {
    adaptation:
      "Afenda retains M3's core interaction vocabulary but models states as composable semantic axes and does not expose fixed state-layer opacities as Level-1 API.",

    contribution: [
      "hover state",
      "focus state",
      "pressed state",
      "dragged state",
      "disabled state",
      "state-layer visual mechanism",
    ],

    disposition: "adapt",
    id: "m3-interaction-states",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda formally separates selected, checked, current navigation, focus, and pressed semantics.",

    contribution: [
      "selection indication",
      "single and multiple selection patterns",
      "navigation active/current distinction",
    ],

    disposition: "adapt",
    id: "m3-selection",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda treats complex gestures as optional accelerators and subjects them to web keyboard, pointer-gesture, and dragging-equivalence requirements.",

    contribution: [
      "gesture vocabulary",
      "tap and press interaction",
      "drag",
      "swipe",
      "multipoint gesture concepts",
    ],

    disposition: "adapt",
    id: "m3-gestures",

    system: "Material 3",
  },

  {
    adaptation:
      "Numeric and testable accessibility requirements are owned by 08-accessibility.ts while interaction owns the semantic operations they constrain.",

    contribution: [
      "keyboard interaction requirements",
      "focus visibility and focus-not-obscured requirements",
      "pointer gesture alternatives",
      "dragging alternatives",
      "target-size relationship",
      "programmatically determinable state",
    ],

    disposition: "adopt",
    id: "wcag-2.2-input-and-focus",

    system: "WCAG 2.2",
  },
] as const satisfies readonly {
  id: string;
  system: string;
  disposition: SourceDisposition;
  contribution: readonly string[];
  adaptation: string;
}[];

// =============================================================================
// SOURCE DISPOSITION
// =============================================================================

export const INTERACTION_SOURCE_DISPOSITION = {
  "afenda-focus-strategies": "adapt",

  "afenda-input-modality-independence": "adapt",

  "afenda-loading": "adapt",

  "afenda-readonly": "adapt",

  // Afenda additions

  "afenda-state-axes": "adapt",

  "afenda-validation": "adapt",

  "m3-current-navigation-indicator": "adopt",

  "m3-disabled": "adopt",

  "m3-double-tap": "adapt",

  "m3-drag": "adapt",

  "m3-dragged": "adapt",

  "m3-fixed-state-layer-opacities-in-l1": "reject",

  "m3-flat-state-cardinality": "reject",

  "m3-focus": "adapt",
  // M3 state model

  "m3-hover": "adopt",

  "m3-long-press": "adapt",

  "m3-pinch": "adapt",

  "m3-predictive-back": "defer",

  "m3-pressed": "adopt",

  // Selection

  "m3-selection": "adopt",

  "m3-state-layer": "adapt",

  "m3-swipe": "adapt",

  // Gestures

  "m3-tap": "adopt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const INTERACTION_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-INT-134",

    obligation:
      "Every interactive component implements exactly the state axes admitted by its Level-1 component contract.",
    strength: "must",
  },

  {
    id: "AF-INT-135",

    obligation:
      "Independent state axes remain independently observable and do not collapse into generated combination variants.",
    strength: "must",
  },

  {
    id: "AF-INT-136",

    obligation:
      "Every keyboard-operable composite implements one governed focus strategy.",
    strength: "must",
  },

  {
    id: "AF-INT-137",

    obligation:
      "Programmatic component state remains synchronised with visible interaction state.",
    strength: "must",
  },

  {
    id: "AF-INT-138",

    obligation:
      "Loading, disabled, readonly, selected, checked, current, expanded, and invalid semantics use their correct platform-accessibility representation.",
    strength: "must",
  },

  {
    id: "AF-INT-139",

    obligation:
      "Gesture-dependent components implement required simpler interaction alternatives.",
    strength: "must",
  },

  {
    id: "AF-INT-140",

    obligation:
      "Dragging components implement the required non-drag operation.",
    strength: "must",
  },

  {
    id: "AF-INT-141",

    obligation:
      "Focus remains perceivable across every supported combination of component state.",
    strength: "must",
  },

  {
    id: "AF-INT-142",

    obligation:
      "Interaction motion resolves through 06-motion.ts rather than defining local animation semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const INTERACTION_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-INT-143",

    prove:
      "component implementations expose only state axes admitted by their Level-1 contracts",
  },

  {
    id: "AF-INT-144",

    prove: "illegal state combinations are rejected or unreachable",
  },

  {
    id: "AF-INT-145",

    prove:
      "focus-visible remains distinguishable across hover, selection, invalid, checked, current, and loading combinations",
  },

  {
    id: "AF-INT-146",

    prove:
      "selection, checked state, and current navigation use distinct programmatic semantics",
  },

  {
    id: "AF-INT-147",

    prove: "readonly and disabled behaviours remain distinct",
  },

  {
    id: "AF-INT-148",

    prove: "loading semantics do not rely solely on animation",
  },

  {
    id: "AF-INT-149",

    prove:
      "keyboard activation produces equivalent semantic actions to pointer activation",
  },

  {
    id: "AF-INT-150",

    prove: "essential functionality does not require hover",
  },

  {
    id: "AF-INT-151",

    prove:
      "path-based and multipoint gesture features have required simpler alternatives",
  },

  {
    id: "AF-INT-152",

    prove:
      "dragging operations provide required non-drag single-pointer alternatives",
  },

  {
    id: "AF-INT-153",

    prove:
      "dragging operations remain keyboard-operable where the component interaction model requires keyboard operation",
  },

  {
    id: "AF-INT-154",

    prove: "viewport width is not used as the sole proxy for input modality",
  },

  {
    id: "AF-INT-155",

    prove:
      "adaptive layout transitions preserve or intentionally restore focus",
  },

  {
    id: "AF-INT-156",

    prove:
      "tenant configuration cannot redefine protected interaction behaviour",
  },
] as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const INTERACTION_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "state-composition-validated",
    "focus-validated",
    "semantic-state-validated",
    "keyboard-validated",
    "pointer-validated",
    "gesture-validated",
    "drag-validated",
  ],

  implementation: [
    "states-implemented",
    "focus-implemented",
    "programmatic-semantics-implemented",
    "gesture-alternatives-implemented",
    "drag-alternative-implemented",
  ],
  language: [
    "axes-defined",
    "availability-defined",
    "engagement-defined",
    "selection-defined",
    "check-defined",
    "navigation-defined",
    "disclosure-defined",
    "validation-defined",
    "operation-defined",
    "drag-defined",
    "focus-defined",
    "activation-defined",
    "modality-defined",
    "gesture-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type InteractionPublicApi = typeof INTERACTION_PUBLIC_API;

export type InteractionAxisDefinition =
  (typeof INTERACTION_AXES)[InteractionAxis];

export type ActivationKindDefinition =
  (typeof ACTIVATION_KINDS)[ActivationKind];

export type GestureDefinition = (typeof GESTURES)[Gesture];

export type InteractionSourceDisposition =
  (typeof INTERACTION_SOURCE_DISPOSITION)[keyof typeof INTERACTION_SOURCE_DISPOSITION];
