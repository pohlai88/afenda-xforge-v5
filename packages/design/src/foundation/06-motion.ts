/**
 * AFENDA DESIGN LANGUAGE — MOTION
 *
 * L1.06
 *
 * Defines the semantic motion language of Afenda.
 *
 * Primary influence:
 *
 *   - Material 3 Motion
 *   - Material 3 MotionScheme
 *   - Material 3 transition relationships
 *
 * Afenda adapts these concepts for:
 *
 *   - enterprise SaaS
 *   - recurring professional interaction
 *   - high-frequency workflows
 *   - dense interfaces
 *   - long-session use
 *   - adaptive panes
 *   - overlays and navigation
 *   - reduced-motion accessibility
 *
 * This file defines:
 *
 *   - motion principles
 *   - productive / expressive schemes
 *   - spatial / effects motion
 *   - fast / default / slow speed classes
 *   - semantic motion roles
 *   - transition relationships
 *   - enter / exit semantics
 *   - hierarchy transitions
 *   - lateral transitions
 *   - container transforms
 *   - top-level transitions
 *   - interruption and reversibility
 *   - progress motion
 *   - loading / skeleton policy
 *   - adaptive-layout motion
 *   - reduced-motion behaviour
 *   - tenant boundaries
 *   - public motion API
 *
 * It deliberately defines NO physical animation values.
 *
 * No:
 *   - milliseconds
 *   - cubic-bezier values
 *   - spring stiffness
 *   - spring damping
 *   - spring velocity
 *   - CSS transition strings
 *   - CSS animation definitions
 *   - keyframes
 *   - Tailwind utilities
 *
 * Those belong to Level 2.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-003 Hierarchy before decoration
 *   AF-PRI-005 Adaptation preserves task and context
 *   AF-PRI-007 Accessibility is intrinsic
 *   AF-PRI-008 Motion explains change
 *   AF-PRI-010 Public UI APIs are finite
 *
 * Token authority:
 *   01-tokens.ts
 *
 * Layout authority:
 *   05-layout.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

import type { SystemTokenDefinition } from "./01-tokens";

// =============================================================================
// IDENTITY
// =============================================================================

export const MOTION_LANGUAGE = {
  code: "MOT",

  defaultScheme: "standard",
  id: "motion",
  level: 1,
  order: 6,

  philosophy:
    "Motion explains change and preserves continuity; it does not compete with the work.",

  purpose:
    "Define how Afenda communicates state change, spatial relationship, continuity, hierarchy, and task progression through motion.",
  version: "1.0.0",
} as const;

// =============================================================================
// PRINCIPLES
// =============================================================================

export const MOTION_PRINCIPLES = [
  {
    id: "AF-MOT-001",

    statement:
      "Motion exists to communicate cause, relationship, continuity, hierarchy, state change, or progress.",
    strength: "must",
  },

  {
    id: "AF-MOT-002",

    statement:
      "Standard motion is the default for recurring Afenda product interactions.",
    strength: "must",
  },

  {
    id: "AF-MOT-003",

    statement:
      "Expressive motion is an explicitly admitted capability rather than the default behaviour of the interface.",
    strength: "must",
  },

  {
    id: "AF-MOT-004",

    statement:
      "Motion behaviour is selected by semantic intent rather than arbitrary duration, easing, or animation style.",
    strength: "must",
  },

  {
    id: "AF-MOT-005",

    statement:
      "Spatial motion and effects motion are separate semantic classes because they communicate different kinds of change.",
    strength: "must",
  },

  {
    id: "AF-MOT-006",

    statement:
      "Transition pattern is selected by the relationship between the before and after states rather than by the component's appearance.",
    strength: "must",
  },

  {
    id: "AF-MOT-007",

    statement:
      "Frequently repeated interactions use less motion than rare high-information transitions.",
    strength: "must",
  },

  {
    id: "AF-MOT-008",

    statement:
      "Motion must not delay access to information or completion of routine professional work.",
    strength: "must",
  },

  {
    id: "AF-MOT-009",

    statement:
      "Interruptible user interaction must not be blocked until decorative animation completes.",
    strength: "must",
  },

  {
    id: "AF-MOT-010",

    statement:
      "Reduced-motion preference preserves task meaning and state change while removing or reducing non-essential movement.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// =============================================================================
// MOTION SCHEMES
// =============================================================================

/**
 * Afenda adopts M3's standard / expressive distinction.
 *
 * STANDARD:
 *
 *   - recurring
 *   - functional
 *   - productive
 *   - restrained
 *
 * EXPRESSIVE:
 *
 *   - uncommon
 *   - prominent
 *   - communicative
 *   - deliberately noticeable
 *
 * Scheme changes HOW motion feels.
 *
 * It does not change:
 *
 *   - interaction semantics
 *   - transition relationship
 *   - state meaning
 *   - accessibility
 */
export const MOTION_SCHEMES = {
  expressive: {
    default: false,

    expression: "heightened",

    frequency: "rare",
    purpose:
      "More visually engaging motion for rare, prominent, or communication-led transitions.",
  },
  standard: {
    default: true,

    expression: "restrained",

    frequency: "common",
    purpose:
      "Functional motion for recurring, utilitarian, and productivity-oriented interaction.",
  },
} as const;

export type MotionScheme = keyof typeof MOTION_SCHEMES;

// -----------------------------------------------------------------------------
// SCHEME RULES
// -----------------------------------------------------------------------------

export const MOTION_SCHEME_RULES = [
  {
    id: "AF-MOT-011",

    rule: "Standard is the default motion scheme for authenticated Afenda product work.",
    strength: "must",
  },

  {
    id: "AF-MOT-012",

    rule: "Expressive motion requires a defined communication purpose.",
    strength: "must",
  },

  {
    id: "AF-MOT-013",

    rule: "Routine controls, menus, fields, grids, filtering, sorting, selection, and recurring workflow interactions use standard motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-014",

    rule: "Expressive motion may be used for sparse onboarding, major completion, important workspace introduction, or equivalent low-frequency moments.",
    strength: "should",
  },

  {
    id: "AF-MOT-015",

    rule: "A child component must not become expressive merely because it appears inside an expressive region.",
    strength: "must",
  },

  {
    id: "AF-MOT-016",

    rule: "Tenant branding must not change the global Afenda motion scheme.",
    strength: "must",
  },
] as const;

// =============================================================================
// MOTION TYPES
// =============================================================================

/**
 * This distinction is taken directly from the strongest part of the
 * newer M3 MotionScheme model.
 *
 * SPATIAL
 * affects geometry or spatial relationship:
 *
 *   position
 *   translation
 *   size
 *   bounds
 *   shape
 *   rotation
 *
 * EFFECTS
 * alters non-spatial visual properties:
 *
 *   opacity
 *   colour
 *   emphasis
 *
 * Level 2 determines the concrete animation mechanism.
 */
export const MOTION_TYPES = {
  effects: {
    examples: ["opacity", "colour", "visual emphasis"],

    mayOvershoot: false,
    purpose:
      "Communicate non-spatial visual change without implying physical displacement.",
  },
  spatial: {
    examples: ["position", "size", "bounds", "shape", "rotation"],

    mayOvershoot: "scheme-dependent",
    purpose:
      "Communicate movement, geometry change, expansion, collapse, spatial relationship, or continuity.",
  },
} as const;

export type MotionType = keyof typeof MOTION_TYPES;

// -----------------------------------------------------------------------------
// TYPE RULES
// -----------------------------------------------------------------------------

export const MOTION_TYPE_RULES = [
  {
    id: "AF-MOT-017",

    rule: "A motion token identifies whether it governs spatial or effects motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-018",

    rule: "Colour and opacity changes use effects motion rather than spatial motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-019",

    rule: "Position, size, bounds, and structural geometry changes use spatial motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-020",

    rule: "Effects motion must not overshoot a semantic value such as opacity or colour.",
    strength: "must",
  },

  {
    id: "AF-MOT-021",

    rule: "The visual implementation of a motion type must not change the semantic relationship being communicated.",
    strength: "must",
  },
] as const;

// =============================================================================
// SPEED CLASSES
// =============================================================================

/**
 * Afenda adopts M3's fast / default / slow vocabulary.
 *
 * Speed expresses SCALE / interaction scope.
 *
 * It is NOT a raw duration.
 */
export const MOTION_SPEEDS = {
  default: {
    purpose: "Ordinary component and partial-workspace transitions.",

    scope: "medium",
  },
  fast: {
    purpose: "Small, frequent, local transitions requiring immediate feedback.",

    scope: "small",
  },

  slow: {
    purpose:
      "Large structural transitions whose spatial relationship needs more time to remain understandable.",

    scope: "large",
  },
} as const;

export type MotionSpeed = keyof typeof MOTION_SPEEDS;

// -----------------------------------------------------------------------------
// SPEED RULES
// -----------------------------------------------------------------------------

export const MOTION_SPEED_RULES = [
  {
    id: "AF-MOT-022",

    rule: "Motion speed is selected by transition scope and semantic purpose rather than arbitrary preference.",
    strength: "must",
  },

  {
    id: "AF-MOT-023",

    rule: "Frequently repeated local feedback normally uses fast motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-024",

    rule: "Partial-workspace structural transitions normally use default motion.",
    strength: "must",
  },

  {
    id: "AF-MOT-025",

    rule: "Slow motion is reserved for large spatial transitions where continuity would otherwise be difficult to perceive.",
    strength: "must",
  },

  {
    id: "AF-MOT-026",

    rule: "Slow must not mean intentionally delaying user access to the resulting state.",
    strength: "must",
  },
] as const;

// =============================================================================
// CORE MOTION SPECS
// =============================================================================

/**
 * The six semantic specs are the foundation of Level-2 motion tokens:
 *
 *             SPATIAL          EFFECTS
 *
 * fast        fastSpatial      fastEffects
 * default     defaultSpatial   defaultEffects
 * slow        slowSpatial      slowEffects
 *
 * This intentionally mirrors M3's modern MotionScheme structure.
 */
export const MOTION_SPECS = {
  "default-effects": {
    speed: "default",
    type: "effects",
  },

  "default-spatial": {
    speed: "default",
    type: "spatial",
  },

  "fast-effects": {
    speed: "fast",
    type: "effects",
  },
  "fast-spatial": {
    speed: "fast",
    type: "spatial",
  },

  "slow-effects": {
    speed: "slow",
    type: "effects",
  },

  "slow-spatial": {
    speed: "slow",
    type: "spatial",
  },
} as const satisfies Readonly<
  Record<
    string,
    {
      speed: MotionSpeed;
      type: MotionType;
    }
  >
>;

export type MotionSpec = keyof typeof MOTION_SPECS;

// =============================================================================
// SEMANTIC MOTION ROLES
// =============================================================================

/**
 * Specs describe physical class.
 *
 * Roles describe WHY motion exists.
 *
 * Application/component code should normally request a role.
 *
 * Level 2 maps role → spec.
 */
export const MOTION_ROLES = {
  component: {
    defaultScheme: "standard",

    defaultSpeed: "fast",

    defaultType: "spatial",
    purpose:
      "Communicate local component expansion, collapse, reveal, resizing, or geometry change.",
  },

  continuity: {
    defaultScheme: "standard",

    defaultSpeed: "default",

    defaultType: "spatial",
    purpose:
      "Preserve object identity or spatial relationship while a representation changes significantly.",
  },

  emphasis: {
    defaultScheme: "expressive",

    defaultSpeed: "default",

    defaultType: "spatial",
    purpose:
      "Rarely draw deliberate attention to an important transition or communication moment.",
  },
  feedback: {
    defaultScheme: "standard",

    defaultSpeed: "fast",

    defaultType: "effects",
    purpose:
      "Immediate acknowledgement of user interaction or small state change.",
  },

  navigation: {
    defaultScheme: "standard",

    defaultSpeed: "default",

    defaultType: "spatial",
    purpose:
      "Communicate movement between task locations, hierarchy levels, panes, or destinations.",
  },

  overlay: {
    defaultScheme: "standard",

    defaultSpeed: "default",

    defaultType: "spatial",
    purpose:
      "Communicate the appearance, disappearance, or spatial relationship of temporary overlay content.",
  },

  progress: {
    defaultScheme: "standard",

    defaultSpeed: "default",

    defaultType: "effects",
    purpose:
      "Communicate that an operation is ongoing where progress cannot be represented purely as a static state.",
  },

  state: {
    defaultScheme: "standard",

    defaultSpeed: "fast",

    defaultType: "effects",
    purpose:
      "Communicate a meaningful component-state change without changing major structure.",
  },
} as const;

export type MotionRole = keyof typeof MOTION_ROLES;

// -----------------------------------------------------------------------------
// ROLE RULES
// -----------------------------------------------------------------------------

export const MOTION_ROLE_RULES = [
  {
    id: "AF-MOT-027",

    rule: "Application and component contracts request semantic motion roles rather than raw physical animation specifications where an appropriate role exists.",
    strength: "must",
  },

  {
    id: "AF-MOT-028",

    rule: "Feedback motion must not delay the underlying interaction result.",
    strength: "must",
  },

  {
    id: "AF-MOT-029",

    rule: "State motion communicates a state transition and must not invent additional semantic state.",
    strength: "must",
  },

  {
    id: "AF-MOT-030",

    rule: "Navigation motion reflects actual navigation or hierarchy relationships.",
    strength: "must",
  },

  {
    id: "AF-MOT-031",

    rule: "Continuity motion is used only when preserving perceived object identity materially improves comprehension.",
    strength: "must",
  },

  {
    id: "AF-MOT-032",

    rule: "Emphasis motion is rare and must not become the normal feedback mechanism of productive components.",
    strength: "must",
  },
] as const;

// =============================================================================
// TRANSITION RELATIONSHIPS
// =============================================================================

/**
 * M3 transition patterns are selected by the RELATIONSHIP between states.
 *
 * Afenda keeps that model because it prevents components from inventing
 * ad-hoc animation directions.
 */
export const TRANSITION_RELATIONSHIPS = {
  container: {
    examples: [
      "summary to detailed object",
      "compact object preview to expanded presentation",
    ],

    purpose:
      "Preserve identity while one representation transforms into a more detailed or differently structured representation.",

    role: "continuity",
    source: "M3 container-transform",
  },

  "enter-exit-beyond": {
    examples: ["sheet", "navigation region", "adaptive supporting pane"],

    purpose:
      "A structural region enters from or exits beyond an application boundary.",

    role: "navigation",
    source: "M3 enter-exit-beyond-bounds",
  },
  "enter-exit-within": {
    examples: ["menu", "popover", "tooltip", "dialog", "snackbar"],

    purpose:
      "Transient content appears or disappears within the current application bounds.",

    role: "overlay",
    source: "M3 enter-exit-within-bounds",
  },

  hierarchy: {
    examples: ["list to nested detail", "settings hierarchy", "drill-down"],

    purpose:
      "Communicate movement deeper into or back out of an information hierarchy.",

    role: "navigation",
    source: "M3 forward-backward",
  },

  lateral: {
    examples: ["peer tabs", "adjacent period", "sibling workspace"],

    purpose:
      "Communicate movement between peer states or destinations at the same hierarchy level.",

    role: "navigation",
    source: "M3 lateral",
  },

  "top-level": {
    examples: ["top-level module destination change"],

    purpose:
      "Communicate replacement between major product destinations that do not have a directional parent-child relationship.",

    role: "navigation",
    source: "M3 top-level",
  },
} as const;

export type TransitionRelationship = keyof typeof TRANSITION_RELATIONSHIPS;

// -----------------------------------------------------------------------------
// TRANSITION RULES
// -----------------------------------------------------------------------------

export const TRANSITION_RULES = [
  {
    id: "AF-MOT-033",

    rule: "Transition relationship is selected from the semantic relationship between source and destination.",
    strength: "must",
  },

  {
    id: "AF-MOT-034",

    rule: "A component must not select animation direction independently when the enclosing navigation relationship already determines it.",
    strength: "must",
  },

  {
    id: "AF-MOT-035",

    rule: "Hierarchy transitions must distinguish forward and backward progression consistently.",
    strength: "must",
  },

  {
    id: "AF-MOT-036",

    rule: "Lateral transitions must not visually imply deeper or shallower hierarchy.",
    strength: "must",
  },

  {
    id: "AF-MOT-037",

    rule: "Container transitions require a credible persistent identity between source and destination.",
    strength: "must",
  },

  {
    id: "AF-MOT-038",

    rule: "Top-level transitions must not imply directional hierarchy when none exists.",
    strength: "must",
  },

  {
    id: "AF-MOT-039",

    rule: "Enter-exit transitions must preserve the relationship between the transient element and its trigger or application boundary.",
    strength: "must",
  },
] as const;

// =============================================================================
// ENTER / EXIT
// =============================================================================

export const ENTER_EXIT_BEHAVIOUR = {
  beyond: {
    principle:
      "Structural content enters or leaves across an application boundary whose direction is meaningful to the layout.",
    relationship: "enter-exit-beyond",
  },
  within: {
    principle:
      "Transient content appears within the existing task context and should remain spatially associated with its trigger or containing region.",
    relationship: "enter-exit-within",
  },
} as const;

// -----------------------------------------------------------------------------
// ENTER / EXIT RULES
// -----------------------------------------------------------------------------

export const ENTER_EXIT_RULES = [
  {
    id: "AF-MOT-040",

    rule: "Transient overlays use within-bounds semantics unless their structural relationship genuinely originates outside the current workspace.",
    strength: "must",
  },

  {
    id: "AF-MOT-041",

    rule: "Beyond-bounds motion must correspond to a meaningful application or pane boundary.",
    strength: "must",
  },

  {
    id: "AF-MOT-042",

    rule: "Enter and exit are semantic opposites and should preserve a coherent spatial relationship.",
    strength: "must",
  },

  {
    id: "AF-MOT-043",

    rule: "Routine overlays should favour restrained standard motion.",
    strength: "should",
  },
] as const;

// =============================================================================
// CONTAINER TRANSFORM
// =============================================================================

/**
 * Container transform is powerful but can easily become decorative.
 *
 * Afenda therefore gates it strongly.
 */
export const CONTAINER_TRANSFORM = {
  defaultScheme: "standard",

  expressiveEligible: true,
  relationship: "container",

  requires: [
    "persistent identity",
    "clear source",
    "clear destination",
    "continuity materially improves comprehension",
  ],
} as const;

// -----------------------------------------------------------------------------
// CONTAINER TRANSFORM RULES
// -----------------------------------------------------------------------------

export const CONTAINER_TRANSFORM_RULES = [
  {
    id: "AF-MOT-044",

    rule: "A container transform requires a persistent conceptual object between source and destination.",
    strength: "must",
  },

  {
    id: "AF-MOT-045",

    rule: "Container transform must not be used merely because two surfaces share similar shape or position.",
    strength: "must",
  },

  {
    id: "AF-MOT-046",

    rule: "Dense recurring workflows should prefer simpler transitions when container transformation would slow repeated work.",
    strength: "should",
  },

  {
    id: "AF-MOT-047",

    rule: "Reduced-motion presentation must preserve the persistent identity without requiring the spatial transform.",
    strength: "must",
  },
] as const;

// =============================================================================
// ADAPTIVE LAYOUT MOTION
// =============================================================================

/**
 * 05-layout.ts defines:
 *
 *   reflow
 *   show-hide
 *   levitate
 *   resize
 *
 * Motion communicates those changes.
 *
 * Motion does not define the adaptive decision.
 */
export const ADAPTIVE_MOTION = {
  levitate: {
    defaultRole: "overlay",

    defaultType: "spatial",
  },
  reflow: {
    defaultRole: "continuity",

    defaultType: "spatial",
  },

  resize: {
    defaultRole: "continuity",

    defaultType: "spatial",
  },

  "show-hide": {
    defaultRole: "component",

    defaultType: "effects",
  },
} as const;

// -----------------------------------------------------------------------------
// ADAPTIVE RULES
// -----------------------------------------------------------------------------

export const ADAPTIVE_MOTION_RULES = [
  {
    id: "AF-MOT-048",

    rule: "Motion communicates an adaptive layout decision but never determines that decision.",
    strength: "must",
  },

  {
    id: "AF-MOT-049",

    rule: "Reflow motion must preserve comprehension of where important content moved.",
    strength: "must",
  },

  {
    id: "AF-MOT-050",

    rule: "Levitation motion must preserve the semantic identity of the pane moving between co-planar and floating presentation.",
    strength: "must",
  },

  {
    id: "AF-MOT-051",

    rule: "User-controlled resizing responds continuously to user input and must not fight the pointer or keyboard operation with decorative animation.",
    strength: "must",
  },

  {
    id: "AF-MOT-052",

    rule: "A breakpoint-driven layout change must not animate every descendant independently.",
    strength: "must",
  },
] as const;

// =============================================================================
// INTERRUPTION / REVERSIBILITY
// =============================================================================

/**
 * Enterprise software is highly interruptible.
 *
 * A user may:
 *
 *   open
 *   immediately close
 *
 *   expand
 *   immediately collapse
 *
 *   navigate
 *   immediately go back
 *
 * Motion must respond to the latest valid state rather than queueing visual
 * theatre.
 */
export const MOTION_INTERRUPTION = {
  default: "interruptible",

  priority: "latest-valid-state",

  queuedDecorativeMotion: false,
} as const;

// -----------------------------------------------------------------------------
// INTERRUPTION RULES
// -----------------------------------------------------------------------------

export const MOTION_INTERRUPTION_RULES = [
  {
    id: "AF-MOT-053",

    rule: "Interactive motion must converge toward the latest valid application state.",
    strength: "must",
  },

  {
    id: "AF-MOT-054",

    rule: "Rapid repeated interaction must not queue obsolete animations.",
    strength: "must",
  },

  {
    id: "AF-MOT-055",

    rule: "Reversible interactions should preserve visual continuity when direction changes before completion.",
    strength: "must",
  },

  {
    id: "AF-MOT-056",

    rule: "Input must not be unnecessarily disabled solely because a non-critical transition is still animating.",
    strength: "must",
  },

  {
    id: "AF-MOT-057",

    rule: "Motion completion must not be treated as business-operation completion unless the domain operation genuinely depends on it.",
    strength: "must",
  },
] as const;

// =============================================================================
// PROGRESS MOTION
// =============================================================================

/**
 * Motion may communicate that an operation is ongoing.
 *
 * It must never imply certainty the system does not possess.
 */
export const PROGRESS_MOTION = {
  background: {
    continuousMotionRequired: false,
    preferred: "low-attention-state-indicator",
  },
  determinate: {
    continuousMotionRequired: false,
    preferred: "semantic-progress-value",
  },

  indeterminate: {
    continuousMotionRequired: true,
    preferred: "governed-progress-motion",
  },
} as const;

// -----------------------------------------------------------------------------
// PROGRESS RULES
// -----------------------------------------------------------------------------

export const PROGRESS_RULES = [
  {
    id: "AF-MOT-058",

    rule: "Determinate progress must represent actual measurable progress rather than decorative animation.",
    strength: "must",
  },

  {
    id: "AF-MOT-059",

    rule: "Indeterminate motion communicates activity without implying a false completion percentage.",
    strength: "must",
  },

  {
    id: "AF-MOT-060",

    rule: "Long-running background work must not demand continuous visual attention merely because it remains active.",
    strength: "must",
  },

  {
    id: "AF-MOT-061",

    rule: "Reduced-motion presentation must retain understandable progress state.",
    strength: "must",
  },
] as const;

// =============================================================================
// SKELETON / PLACEHOLDER MOTION
// =============================================================================

/**
 * Your M3 source categorises skeleton loaders with transition behaviour.
 *
 * Afenda keeps skeletons as a loading PRESENTATION,
 * not a generic animated decoration.
 */
export const SKELETON_POLICY = {
  animationRequired: false,

  defaultScheme: "standard",
  purpose:
    "Represent temporarily unavailable structural content where preserving anticipated layout materially reduces disruptive movement.",

  reducedMotion: "static",
} as const;

// -----------------------------------------------------------------------------
// SKELETON RULES
// -----------------------------------------------------------------------------

export const SKELETON_RULES = [
  {
    id: "AF-MOT-062",

    rule: "Skeleton presentation is used only when the expected content structure is sufficiently known.",
    strength: "must",
  },

  {
    id: "AF-MOT-063",

    rule: "Skeleton animation is optional and must not be the only indication that content is loading.",
    strength: "must",
  },

  {
    id: "AF-MOT-064",

    rule: "Skeleton presentation must not imitate completed real data in a way that could be mistaken for actual content.",
    strength: "must",
  },

  {
    id: "AF-MOT-065",

    rule: "Reduced-motion mode presents skeleton structure without repetitive motion.",
    strength: "must",
  },
] as const;

// =============================================================================
// PRODUCTIVITY / FREQUENCY
// =============================================================================

/**
 * Repetition matters.
 *
 * An animation that is pleasant once may become expensive after 500 uses.
 */
export const MOTION_FREQUENCY = {
  continuous: {
    motionBudget: "minimal",
  },

  frequent: {
    motionBudget: "restrained",
  },

  occasional: {
    motionBudget: "moderate",
  },

  rare: {
    motionBudget: "expressive-eligible",
  },
} as const;

export type MotionFrequency = keyof typeof MOTION_FREQUENCY;

// -----------------------------------------------------------------------------
// FREQUENCY RULES
// -----------------------------------------------------------------------------

export const MOTION_FREQUENCY_RULES = [
  {
    id: "AF-MOT-066",

    rule: "Motion prominence decreases as interaction frequency increases.",
    strength: "must",
  },

  {
    id: "AF-MOT-067",

    rule: "Continuous animation requires an ongoing-state communication reason.",
    strength: "must",
  },

  {
    id: "AF-MOT-068",

    rule: "High-frequency table, form, keyboard, and workflow operations must remain visually economical.",
    strength: "must",
  },

  {
    id: "AF-MOT-069",

    rule: "Rare product moments may use richer continuity or expressive motion where doing so materially improves comprehension or communication.",
    strength: "should",
  },
] as const;

// =============================================================================
// REDUCED MOTION
// =============================================================================

/**
 * Motion preference is NOT a token context.
 *
 * It affects behavioural presentation and therefore belongs here and in
 * 08-accessibility.ts.
 *
 * The semantic application state must remain identical.
 */
export const REDUCED_MOTION_POLICY = {
  defaultBehaviour: {
    continuous: "remove-unless-required-to-communicate-state",

    effects: "retain-or-simplify",

    essentialSpatial: "simplify",
    nonEssentialSpatial: "remove-or-minimise",
  },
  preference: "user-controlled",

  semanticStateChange: false,
} as const;

// -----------------------------------------------------------------------------
// REDUCED MOTION REQUIREMENTS
// -----------------------------------------------------------------------------

export const REDUCED_MOTION_REQUIREMENTS = [
  "preserve-state-meaning",
  "preserve-task-completion",
  "preserve-progress-understanding",
  "remove-non-essential-spatial-motion",
  "avoid-repetitive-motion",
] as const;

// -----------------------------------------------------------------------------
// REDUCED MOTION RULES
// -----------------------------------------------------------------------------

export const REDUCED_MOTION_RULES = [
  {
    id: "AF-MOT-070",

    rule: "Reduced motion preserves the same final application state and task capability.",
    strength: "must",
  },

  {
    id: "AF-MOT-071",

    rule: "Non-essential spatial motion is removed or substantially reduced under the reduced-motion preference.",
    strength: "must",
  },

  {
    id: "AF-MOT-072",

    rule: "Essential state change may use simplified effects when removing all transition would make the change difficult to perceive.",
    strength: "must",
  },

  {
    id: "AF-MOT-073",

    rule: "Reduced-motion behaviour is defined by semantic motion role rather than by globally setting every animation duration to zero.",
    strength: "must",
  },

  {
    id: "AF-MOT-074",

    rule: "Continuous decorative or repetitive motion must stop under reduced-motion preference.",
    strength: "must",
  },

  {
    id: "AF-MOT-075",

    rule: "A component with motion has a valid reduced-motion presentation.",
    strength: "must",
  },
] as const;

// =============================================================================
// FOCUS / ACCESSIBILITY
// =============================================================================

/**
 * Focus visibility is not itself an animation requirement.
 *
 * Motion must never delay focus feedback.
 */
export const MOTION_ACCESSIBILITY_RULES = [
  {
    id: "AF-MOT-076",

    rule: "Visible focus feedback must not wait for an animation sequence to complete.",
    strength: "must",
  },

  {
    id: "AF-MOT-077",

    rule: "Motion must not cause keyboard focus to move unless the interaction or navigation contract requires that focus change.",
    strength: "must",
  },

  {
    id: "AF-MOT-078",

    rule: "Content moved by animation must remain semantically associated with its resulting DOM or accessibility state.",
    strength: "must",
  },

  {
    id: "AF-MOT-079",

    rule: "Motion must not be the sole method of communicating selection, completion, error, warning, or other consequential state.",
    strength: "must",
  },

  {
    id: "AF-MOT-080",

    rule: "Auto-playing motion that persists beyond a transient transition requires an ongoing communication purpose and remains subject to the accessibility language.",
    strength: "must",
  },
] as const;

// =============================================================================
// TENANT POLICY
// =============================================================================

/**
 * Motion is intentionally protected.
 *
 * A tenant may brand Afenda's visual expression.
 * It may not make one tenant's ERP bounce while another behaves normally.
 */
export const MOTION_TENANT_POLICY = {
  customisable: [],
  default: "closed",

  principle:
    "Tenant identity does not redefine Afenda interaction timing or movement semantics.",

  protected: [
    "scheme",
    "motion roles",
    "motion specs",
    "speed semantics",
    "transition relationships",
    "reduced-motion behaviour",
    "interruption behaviour",
  ],
} as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const MOTION_TENANT_RULES = [
  {
    id: "AF-MOT-081",

    rule: "Tenant customisation must not change Afenda motion semantics.",
    strength: "must",
  },

  {
    id: "AF-MOT-082",

    rule: "Tenant branding must not enable expressive motion for components that are not expressive-eligible.",
    strength: "must",
  },

  {
    id: "AF-MOT-083",

    rule: "Tenant customisation must not weaken reduced-motion behaviour.",
    strength: "must",
  },
] as const;

// =============================================================================
// EXPRESSIVE ELIGIBILITY
// =============================================================================

/**
 * Expressive capability is deny-by-default.
 *
 * Component contracts may explicitly opt in.
 */
export const EXPRESSIVE_ELIGIBILITY = {
  default: false,

  normallyIneligible: [
    "button",
    "checkbox",
    "radio",
    "switch",
    "input",
    "select",
    "menu-item",
    "table-row",
    "data-grid-cell",
    "filter",
    "sort",
    "pagination",
    "routine-dialog",
    "routine-popover",
  ],

  potentiallyEligible: [
    "major-success-moment",
    "first-use-onboarding",
    "sparse-empty-state",
    "prominent-workspace-introduction",
    "meaningful-container-continuity",
  ],
} as const;

// -----------------------------------------------------------------------------
// EXPRESSIVE RULES
// -----------------------------------------------------------------------------

export const EXPRESSIVE_RULES = [
  {
    id: "AF-MOT-084",

    rule: "Expressive motion is deny-by-default.",
    strength: "must",
  },

  {
    id: "AF-MOT-085",

    rule: "A component or pattern may use expressive motion only when its Level-1 contract explicitly permits it.",
    strength: "must",
  },

  {
    id: "AF-MOT-086",

    rule: "Expressive eligibility describes motion presentation and does not create a new component variant or semantic state.",
    strength: "must",
  },

  {
    id: "AF-MOT-087",

    rule: "Expressive motion must still satisfy interruption and reduced-motion contracts.",
    strength: "must",
  },
] as const;

// =============================================================================
// MOTION TOKEN IDENTITIES
// =============================================================================

/**
 * These are the canonical six physical motion token identities.
 *
 * Level 2 provides actual:
 *
 *   spring
 *   duration/easing
 *   or another equivalent platform implementation.
 */
export const MOTION_SYSTEM_TOKENS = {
  "default-effects": "af.sys.motion.default.effects",

  "default-spatial": "af.sys.motion.default.spatial",

  "fast-effects": "af.sys.motion.fast.effects",
  "fast-spatial": "af.sys.motion.fast.spatial",

  "slow-effects": "af.sys.motion.slow.effects",

  "slow-spatial": "af.sys.motion.slow.spatial",
} as const satisfies Readonly<Record<MotionSpec, string>>;

// =============================================================================
// MOTION ROLE DEFAULTS
// =============================================================================

/**
 * Role → physical spec is governed here semantically.
 *
 * Level 2 can change physical values without changing this API.
 */
export const MOTION_ROLE_DEFAULTS = {
  component: "fast-spatial",

  continuity: "default-spatial",

  emphasis: "default-spatial",
  feedback: "fast-effects",

  navigation: "default-spatial",

  overlay: "default-spatial",

  progress: "default-effects",

  state: "fast-effects",
} as const satisfies Readonly<Record<MotionRole, MotionSpec>>;

// =============================================================================
// COMPONENT MOTION CONTRACT
// =============================================================================

export interface ComponentMotionContract {
  /**
   * Standard by default.
   */
  readonly expressiveEligible?: boolean;

  /**
   * Whether an in-progress transition must respond immediately
   * to a new valid user state.
   */
  readonly interruptible: boolean;

  /**
   * Every moving component requires a reduced-motion strategy.
   */
  readonly reducedMotion: "remove" | "simplify" | "retain";
  /**
   * Semantic reason for motion.
   */
  readonly roles: readonly MotionRole[];

  /**
   * Transition relationships the component itself may initiate.
   */
  readonly transitions?: readonly TransitionRelationship[];
}

// =============================================================================
// MOTION TOKEN CONTRACT
// =============================================================================

export interface MotionTokenDefinition extends SystemTokenDefinition {
  readonly category: "motion";

  readonly motionType: MotionType;

  readonly role: MotionSpec;

  readonly speed: MotionSpeed;
  readonly tier: "system";
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Normal product code consumes:
 *
 *   role
 *   relationship
 *
 * not:
 *
 *   milliseconds
 *   spring
 *   cubic-bezier
 *
 * Component implementation may resolve those through MOTION_SYSTEM_TOKENS.
 */
export const MOTION_PUBLIC_API = {
  relationship: [
    "enter-exit-within",
    "enter-exit-beyond",
    "hierarchy",
    "lateral",
    "container",
    "top-level",
  ],

  role: [
    "feedback",
    "state",
    "component",
    "overlay",
    "navigation",
    "continuity",
    "progress",
    "emphasis",
  ],
  scheme: ["standard", "expressive"],

  speed: ["fast", "default", "slow"],

  type: ["spatial", "effects"],
} as const;

// =============================================================================
// FORBIDDEN USAGE
// =============================================================================

export const MOTION_FORBIDS = [
  {
    behaviour:
      "application code chooses arbitrary animation duration where a governed semantic motion role exists",
    id: "AF-MOT-088",
    strength: "must",
  },

  {
    behaviour:
      "application code chooses arbitrary easing or spring values for governed component motion",
    id: "AF-MOT-089",
    strength: "must",
  },

  {
    behaviour:
      "routine productive interactions use expressive motion without explicit Level-1 eligibility",
    id: "AF-MOT-090",
    strength: "must",
  },

  {
    behaviour: "motion is used solely to make a screen feel more dynamic",
    id: "AF-MOT-091",
    strength: "must",
  },

  {
    behaviour:
      "effects motion overshoots opacity, colour, or another semantic non-spatial target",
    id: "AF-MOT-092",
    strength: "must",
  },

  {
    behaviour: "a transition implies hierarchy that does not exist",
    id: "AF-MOT-093",
    strength: "must",
  },

  {
    behaviour:
      "container transform is used where no persistent conceptual object exists",
    id: "AF-MOT-094",
    strength: "must",
  },

  {
    behaviour:
      "user input is blocked solely until a non-critical animation completes",
    id: "AF-MOT-095",
    strength: "must",
  },

  {
    behaviour:
      "obsolete animations are queued after newer application state has already been requested",
    id: "AF-MOT-096",
    strength: "must",
  },

  {
    behaviour:
      "reduced-motion support is implemented only by globally shortening every animation without considering semantic role",
    id: "AF-MOT-097",
    strength: "must",
  },

  {
    behaviour:
      "continuous decorative animation runs without an ongoing communication purpose",
    id: "AF-MOT-098",
    strength: "must",
  },

  {
    behaviour: "tenant configuration changes product motion semantics",
    id: "AF-MOT-099",
    strength: "must",
  },

  {
    behaviour:
      "business-operation completion depends on presentation animation completion when the operation itself is already complete",
    id: "AF-MOT-100",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const MOTION_SOURCES = [
  {
    adaptation:
      "Afenda adopts the six-spec semantic model while making standard motion mandatory by default for productive SaaS interaction and expressive motion deny-by-default.",

    contribution: [
      "standard and expressive motion schemes",
      "fast, default, and slow speed classes",
      "spatial and effects motion classes",
      "theme-level motion scheme",
    ],

    disposition: "adapt",
    id: "m3-motion-scheme",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda preserves the relationship-based model but exposes product-oriented transition names and adds interruption, frequency, adaptive-pane, and professional-workflow constraints.",

    contribution: [
      "container transform",
      "enter-exit within bounds",
      "enter-exit beyond bounds",
      "forward-backward hierarchy",
      "lateral transition",
      "top-level transition",
    ],

    disposition: "adapt",
    id: "m3-motion-transition",

    system: "Material 3",
  },

  {
    adaptation:
      "Concrete timing and spring values remain Level 2. Level 1 exposes only semantic schemes, speeds, types, and roles.",

    contribution: [
      "standard easing",
      "emphasized easing",
      "duration bands",
      "spring-based motion",
    ],

    disposition: "adapt",
    id: "m3-easing-duration",

    system: "Material 3",
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

export const MOTION_SOURCE_DISPOSITION = {
  "afenda-adaptive-pane-motion": "adapt",

  "afenda-expressive-deny-by-default": "adapt",

  "afenda-frequency-policy": "adapt",

  "afenda-interruption-policy": "adapt",

  // Afenda

  "afenda-semantic-motion-roles": "adapt",

  "m3-concrete-spring-values-in-l1": "reject",

  // M3 transition model

  "m3-container-transform": "adopt",

  "m3-default-effects": "adopt",

  "m3-default-spatial": "adopt",

  // Older timing tokens

  "m3-duration-token-ladder-as-public-api": "reject",

  "m3-easing-token-ladder-as-public-api": "reject",

  "m3-enter-exit-beyond-bounds": "adopt",

  "m3-enter-exit-within-bounds": "adopt",

  "m3-expressive-scheme": "adapt",

  "m3-fast-effects": "adopt",

  "m3-fast-spatial": "adopt",

  "m3-forward-backward": "adapt",

  "m3-lateral": "adopt",

  "m3-slow-effects": "adopt",

  "m3-slow-spatial": "adopt",
  // Modern M3 motion scheme

  "m3-standard-scheme": "adopt",

  "m3-top-level": "adopt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const MOTION_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-MOT-101",

    obligation:
      "Every active motion spec has one deterministic Level-2 implementation for the standard scheme.",
    strength: "must",
  },

  {
    id: "AF-MOT-102",

    obligation:
      "Every expressive-eligible motion spec has a deterministic expressive implementation where expressive mode is supported.",
    strength: "must",
  },

  {
    id: "AF-MOT-103",

    obligation: "Effects motion does not overshoot its semantic target.",
    strength: "must",
  },

  {
    id: "AF-MOT-104",

    obligation:
      "Every component declaring motion has a reduced-motion implementation.",
    strength: "must",
  },

  {
    id: "AF-MOT-105",

    obligation:
      "Interactive motion is interruptible where its Level-1 component contract requires interruption.",
    strength: "must",
  },

  {
    id: "AF-MOT-106",

    obligation:
      "Transition direction and relationship remain consistent across equivalent navigation operations.",
    strength: "must",
  },

  {
    id: "AF-MOT-107",

    obligation:
      "Adaptive pane transitions preserve the task and pane identity defined by 05-layout.ts.",
    strength: "must",
  },

  {
    id: "AF-MOT-108",

    obligation:
      "Level 2 exposes semantic motion roles without requiring application code to supply raw timing values.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const MOTION_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-MOT-109",

    prove: "every active motion spec resolves in the standard scheme",
  },

  {
    id: "AF-MOT-110",

    prove:
      "expressive motion appears only in explicitly eligible component or pattern contracts",
  },

  {
    id: "AF-MOT-111",

    prove:
      "application code does not introduce arbitrary governed animation durations",
  },

  {
    id: "AF-MOT-112",

    prove:
      "application code does not introduce arbitrary governed easing or spring definitions",
  },

  {
    id: "AF-MOT-113",

    prove: "effects specs do not overshoot semantic values",
  },

  {
    id: "AF-MOT-114",

    prove: "every animated governed component has reduced-motion coverage",
  },

  {
    id: "AF-MOT-115",

    prove: "routine high-frequency components use standard motion",
  },

  {
    id: "AF-MOT-116",

    prove:
      "navigation transition relationship matches the declared hierarchy or peer relationship",
  },

  {
    id: "AF-MOT-117",

    prove:
      "interruptible components converge toward the latest requested valid state",
  },

  {
    id: "AF-MOT-118",

    prove:
      "continuous motion exists only in explicitly admitted ongoing-state components",
  },

  {
    id: "AF-MOT-119",

    prove:
      "adaptive layout animation preserves pane identity and focus semantics",
  },

  {
    id: "AF-MOT-120",

    prove: "tenant configuration cannot override protected motion semantics",
  },
] as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const MOTION_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "raw-motion-validated",
    "scheme-validated",
    "transition-validated",
    "interruption-validated",
    "reduced-motion-validated",
  ],

  implementation: [
    "standard-resolved",
    "expressive-resolved-where-applicable",
    "role-resolved",
    "transition-resolved",
    "reduced-motion-resolved",
  ],
  language: [
    "scheme-defined",
    "type-defined",
    "speed-defined",
    "role-defined",
    "transition-relationship-defined",
    "interruption-defined",
    "reduced-motion-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type MotionPublicApi = typeof MOTION_PUBLIC_API;

export type MotionRoleDefinition = (typeof MOTION_ROLES)[MotionRole];

export type MotionSpecDefinition = (typeof MOTION_SPECS)[MotionSpec];

export type TransitionRelationshipDefinition =
  (typeof TRANSITION_RELATIONSHIPS)[TransitionRelationship];

export type MotionSourceDisposition =
  (typeof MOTION_SOURCE_DISPOSITION)[keyof typeof MOTION_SOURCE_DISPOSITION];
