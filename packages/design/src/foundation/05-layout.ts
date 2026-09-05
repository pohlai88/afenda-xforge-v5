/**
 * AFENDA DESIGN LANGUAGE — LAYOUT
 *
 * L1.05
 *
 * Defines the structural, compositional, and adaptive layout language
 * of Afenda.
 *
 * Primary influences:
 *
 *   - Material 3 adaptive layout
 *   - Material 3 scaffold / pane model
 *   - Material 3 window size classes
 *
 * Afenda extends these concepts for:
 *
 *   - enterprise web SaaS
 *   - desktop-first professional workflows
 *   - responsive browser windows
 *   - container-query-driven components
 *   - master-detail workflows
 *   - multi-pane workbenches
 *   - inspector panes
 *   - resizable panes
 *   - dense data interfaces
 *   - explicit scroll ownership
 *   - keyboard-accessible adaptive behaviour
 *
 * This file defines:
 *
 *   - layout principles
 *   - adaptive conditions
 *   - window classes
 *   - container classes
 *   - scaffold
 *   - panes
 *   - pane presentation
 *   - pane sizing
 *   - pane persistence
 *   - adaptive strategies
 *   - canonical SaaS layout patterns
 *   - composition primitives
 *   - grid purposes
 *   - content measures
 *   - rulers and alignment
 *   - scroll ownership
 *   - resizing
 *   - safe regions
 *   - tenant constraints
 *   - accessibility invariants
 *   - public layout API
 *
 * It deliberately defines NO physical breakpoints or layout values.
 *
 * No:
 *   - px
 *   - rem
 *   - dp
 *   - media-query values
 *   - container-query values
 *   - column counts
 *   - pane widths
 *   - grid-template-columns
 *   - CSS
 *   - Tailwind classes
 *
 * Those belong to Level 2.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-002 Role before value
 *   AF-PRI-003 Hierarchy before decoration
 *   AF-PRI-004 Density without loss of operability
 *   AF-PRI-005 Adaptation preserves task and context
 *   AF-PRI-007 Accessibility is intrinsic
 *   AF-PRI-010 Public UI APIs are finite
 *
 * Token authority:
 *   01-tokens.ts
 *
 * Geometry authority:
 *   04-geometry.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

// =============================================================================
// IDENTITY
// =============================================================================

export const LAYOUT_LANGUAGE = {
  code: "LAY",
  id: "layout",
  level: 1,
  order: 5,

  philosophy:
    "Layout preserves task, context, hierarchy, and operability as available space changes.",

  purpose:
    "Define how Afenda composes, adapts, constrains, and preserves professional work across available space.",
  version: "1.0.0",
} as const;

// =============================================================================
// PRINCIPLES
// =============================================================================

export const LAYOUT_PRINCIPLES = [
  {
    id: "AF-LAY-001",

    statement:
      "Layout is selected by task structure and available space rather than by device labels.",
    strength: "must",
  },

  {
    id: "AF-LAY-002",

    statement:
      "Adaptive behaviour preserves task, information meaning, and navigational context.",
    strength: "must",
  },

  {
    id: "AF-LAY-003",

    statement:
      "Window conditions govern application-level composition while container conditions govern reusable component composition.",
    strength: "must",
  },

  {
    id: "AF-LAY-004",

    statement:
      "A reusable component must not infer its available space solely from the browser window.",
    strength: "must",
  },

  {
    id: "AF-LAY-005",

    statement:
      "Additional available space is used to reveal useful context before it is used merely to make existing content larger.",
    strength: "must",
  },

  {
    id: "AF-LAY-006",

    statement:
      "Reducing available space may reflow, hide, levitate, or resize presentation but must not silently remove essential capability.",
    strength: "must",
  },

  {
    id: "AF-LAY-007",

    statement: "Every scrollable task region has an explicit scroll owner.",
    strength: "must",
  },

  {
    id: "AF-LAY-008",

    statement:
      "Visual reordering must not create a reading, focus, or task order that contradicts semantic order.",
    strength: "must",
  },

  {
    id: "AF-LAY-009",

    statement:
      "Resizable layout is a user capability and must remain operable without requiring drag interaction alone.",
    strength: "must",
  },

  {
    id: "AF-LAY-010",

    statement:
      "Afenda layout primitives express structural purpose and do not expose arbitrary CSS layout configuration as product API.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// =============================================================================
// ADAPTIVE CONDITIONS
// =============================================================================

/**
 * A CONDITION is information that may justify layout adaptation.
 *
 * A condition does not itself prescribe the response.
 *
 * Example:
 *
 *   window = compact
 *
 * does not inherently mean:
 *
 *   hide inspector
 *
 * The owning pattern chooses the adaptation strategy.
 */
export const ADAPTIVE_CONDITIONS = {
  capability: {
    purpose: "Runtime capability required by an optional layout behaviour.",

    scope: "component-or-pattern",
  },

  "container-width": {
    purpose:
      "Width actually available to a reusable component or contained layout region.",

    scope: "component-or-region",
  },

  "content-requirement": {
    purpose:
      "Minimum structural requirement of the information or task being presented.",

    scope: "component-or-pattern",
  },

  "input-modality": {
    purpose:
      "Available or currently relevant input capabilities where they materially affect presentation.",

    scope: "component-or-pattern",
  },

  "safe-region": {
    purpose:
      "Areas unavailable or inappropriate for application content because of environment or system constraints.",

    scope: "shell-or-pane",
  },

  "window-height": {
    purpose:
      "Available height of the application window where vertical constraint materially affects composition.",

    scope: "application-shell",
  },
  "window-width": {
    purpose: "Available width of the application window.",

    scope: "application-shell",
  },
} as const;

export type AdaptiveCondition = keyof typeof ADAPTIVE_CONDITIONS;

// -----------------------------------------------------------------------------
// CONDITION RULES
// -----------------------------------------------------------------------------

export const ADAPTIVE_CONDITION_RULES = [
  {
    id: "AF-LAY-011",

    rule: "Adaptive conditions describe available circumstances rather than specific device models.",
    strength: "must",
  },

  {
    id: "AF-LAY-012",

    rule: "A component must prefer its own container condition over window width when its composition depends on locally available space.",
    strength: "must",
  },

  {
    id: "AF-LAY-013",

    rule: "A layout adaptation must identify the condition that justifies it.",
    strength: "must",
  },

  {
    id: "AF-LAY-014",

    rule: "Input modality must not be inferred exclusively from viewport width.",
    strength: "must",
  },

  {
    id: "AF-LAY-015",

    rule: "Content requirements may override a layout that technically fits but would make the task unreadable or unusable.",
    strength: "must",
  },
] as const;

// =============================================================================
// WINDOW CLASSES
// =============================================================================

/**
 * Afenda adopts the current five-band M3 width-class taxonomy.
 *
 * L1 defines the SEMANTIC bands.
 *
 * Level 2 owns their actual breakpoint values.
 */
export const WINDOW_WIDTH_CLASSES = [
  "compact",
  "medium",
  "expanded",
  "large",
  "extra-large",
] as const;

export type WindowWidthClass = (typeof WINDOW_WIDTH_CLASSES)[number];

// -----------------------------------------------------------------------------
// WINDOW WIDTH SEMANTICS
// -----------------------------------------------------------------------------

export const WINDOW_WIDTH_CLASS_SEMANTICS = {
  compact: {
    defaultPaneCapacity: 1,
    purpose:
      "Constrained application window where the primary task normally requires exclusive or near-exclusive presentation.",
  },

  expanded: {
    defaultPaneCapacity: 2,
    purpose:
      "Window with sufficient width for common two-pane professional compositions.",
  },

  "extra-large": {
    defaultPaneCapacity: 3,
    purpose:
      "Very large professional workspace where three-pane composition and additional structural breathing room are commonly viable.",
  },

  large: {
    defaultPaneCapacity: 3,
    purpose:
      "Large professional workspace supporting richer multi-pane composition without requiring all available panes.",
  },

  medium: {
    defaultPaneCapacity: 1,
    purpose:
      "Moderately constrained window where additional context may be exposed selectively but a single primary pane remains the safe default.",
  },
} as const satisfies Readonly<
  Record<
    WindowWidthClass,
    {
      purpose: string;
      defaultPaneCapacity: number;
    }
  >
>;

// -----------------------------------------------------------------------------
// WINDOW HEIGHT CLASSES
// -----------------------------------------------------------------------------

/**
 * Height is supplemental.
 *
 * Afenda does not create a two-dimensional breakpoint matrix for every
 * component.
 *
 * Height classes are used only where vertical constraint materially changes
 * application-level composition.
 */
export const WINDOW_HEIGHT_CLASSES = ["compact", "medium", "expanded"] as const;

export type WindowHeightClass = (typeof WINDOW_HEIGHT_CLASSES)[number];

// -----------------------------------------------------------------------------
// WINDOW RULES
// -----------------------------------------------------------------------------

export const WINDOW_CLASS_RULES = [
  {
    id: "AF-LAY-016",

    rule: "Window classes describe available application space and must not be treated as device categories.",
    strength: "must",
  },

  {
    id: "AF-LAY-017",

    rule: "Application shell and canonical multi-pane patterns may adapt using window classes.",
    strength: "must",
  },

  {
    id: "AF-LAY-018",

    rule: "Reusable components must not use window classes when their actual container width is the relevant constraint.",
    strength: "must",
  },

  {
    id: "AF-LAY-019",

    rule: "Medium-width layouts should remain single-pane by default unless the task has a strong reason to preserve simultaneous panes.",
    strength: "should",
  },

  {
    id: "AF-LAY-020",

    rule: "A larger window class increases available composition capability but does not require additional panes to be visible.",
    strength: "must",
  },

  {
    id: "AF-LAY-021",

    rule: "Window height classes must be used only where vertical constraint changes task composition rather than merely reducing visible scroll area.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONTAINER CLASSES
// =============================================================================

/**
 * Container classes are the reusable-component counterpart to window classes.
 *
 * Example:
 *
 * Browser:
 *
 *   extra-large
 *
 * Inspector:
 *
 *   compact
 *
 * A component inside that inspector must behave as COMPACT.
 */
export const CONTAINER_WIDTH_CLASSES = [
  "compact",
  "medium",
  "expanded",
] as const;

export type ContainerWidthClass = (typeof CONTAINER_WIDTH_CLASSES)[number];

// -----------------------------------------------------------------------------
// CONTAINER SEMANTICS
// -----------------------------------------------------------------------------

export const CONTAINER_WIDTH_CLASS_SEMANTICS = {
  compact: {
    purpose:
      "Contained region requiring strongly space-efficient or vertically reflowed presentation.",
  },

  expanded: {
    purpose:
      "Contained region where richer horizontal component composition is viable.",
  },

  medium: {
    purpose:
      "Contained region with sufficient space for standard component composition.",
  },
} as const;

// -----------------------------------------------------------------------------
// CONTAINER RULES
// -----------------------------------------------------------------------------

export const CONTAINER_RULES = [
  {
    id: "AF-LAY-022",

    rule: "Reusable component adaptation is based on container class when local width determines component composition.",
    strength: "must",
  },

  {
    id: "AF-LAY-023",

    rule: "Container classes preserve component semantic identity.",
    strength: "must",
  },

  {
    id: "AF-LAY-024",

    rule: "Container adaptation must not depend on the component knowing where in the application it is rendered.",
    strength: "must",
  },

  {
    id: "AF-LAY-025",

    rule: "Application modules must not create independent component breakpoint vocabularies where container classes are sufficient.",
    strength: "must",
  },

  {
    id: "AF-LAY-026",

    rule: "A component may use content requirements in addition to container class when class alone cannot preserve usability.",
    strength: "must",
  },
] as const;

// =============================================================================
// ADAPTIVE STRATEGIES
// =============================================================================

/**
 * Afenda adapts M3's pane and component strategies into one small vocabulary.
 */
export const ADAPTIVE_STRATEGIES = {
  levitate: {
    examples: ["inspector becomes sheet", "supporting pane becomes popover"],
    purpose:
      "Move a supporting pane or region out of co-planar layout into a temporary floating or overlay presentation.",
  },
  reflow: {
    examples: [
      "side-by-side regions become stacked",
      "toolbar actions wrap into another line",
      "detail content reorganises vertically",
    ],
    purpose:
      "Reorganise the same task and information into a different structural composition.",
  },

  resize: {
    examples: [
      "pane changes width",
      "grid tracks redistribute available space",
    ],
    purpose:
      "Change dimensions while preserving the same structural role and relationship.",
  },

  "show-hide": {
    examples: [
      "supporting pane becomes separately reachable",
      "secondary labels collapse",
      "optional metadata is deferred",
    ],
    purpose:
      "Reveal or conceal supporting presentation while preserving a route or mechanism to reach required content.",
  },
} as const;

export type AdaptiveStrategy = keyof typeof ADAPTIVE_STRATEGIES;

// -----------------------------------------------------------------------------
// STRATEGY RULES
// -----------------------------------------------------------------------------

export const ADAPTIVE_STRATEGY_RULES = [
  {
    id: "AF-LAY-027",

    rule: "An adaptive transition uses a named strategy rather than arbitrary per-screen responsive behaviour.",
    strength: "must",
  },

  {
    id: "AF-LAY-028",

    rule: "Reflow preserves information meaning and logical reading order.",
    strength: "must",
  },

  {
    id: "AF-LAY-029",

    rule: "Show-hide must preserve access to essential content or capability.",
    strength: "must",
  },

  {
    id: "AF-LAY-030",

    rule: "Levitation changes presentation but does not change the semantic identity of the pane or task.",
    strength: "must",
  },

  {
    id: "AF-LAY-031",

    rule: "Resize must respect the owning region's content and accessibility constraints.",
    strength: "must",
  },

  {
    id: "AF-LAY-032",

    rule: "The same layout pattern may use different adaptive strategies for different panes.",
    strength: "must",
  },
] as const;

// =============================================================================
// SCAFFOLD
// =============================================================================

/**
 * SCAFFOLD is the structural frame of an application workspace.
 *
 * It is not a visual component style.
 */
export const SCAFFOLD_REGIONS = {
  header: {
    purpose:
      "Application or workspace-level orientation, context, and global actions.",
  },
  navigation: {
    purpose:
      "Persistent or adaptive product navigation surrounding the workspace.",
  },

  utility: {
    purpose:
      "Optional supporting application utilities that remain outside the primary task content.",
  },

  workspace: {
    purpose:
      "Primary region containing the current product task and its panes.",
  },
} as const;

export type ScaffoldRegion = keyof typeof SCAFFOLD_REGIONS;

// -----------------------------------------------------------------------------
// SCAFFOLD RULES
// -----------------------------------------------------------------------------

export const SCAFFOLD_RULES = [
  {
    id: "AF-LAY-033",

    rule: "The scaffold establishes application structure before individual page composition.",
    strength: "must",
  },

  {
    id: "AF-LAY-034",

    rule: "Workspace content must not depend on the physical implementation of scaffold navigation.",
    strength: "must",
  },

  {
    id: "AF-LAY-035",

    rule: "Navigation may adapt between co-planar and temporary presentation without changing destination semantics.",
    strength: "must",
  },

  {
    id: "AF-LAY-036",

    rule: "The scaffold owns global safe-region handling.",
    strength: "must",
  },

  {
    id: "AF-LAY-037",

    rule: "Page and component layouts must not recreate the application scaffold.",
    strength: "must",
  },
] as const;

// =============================================================================
// PANES
// =============================================================================

/**
 * A pane is a task-oriented layout region.
 *
 * It is stronger than a generic container.
 *
 * A pane owns:
 *
 *   content responsibility
 *   visibility behaviour
 *   sizing behaviour
 *   optional scrolling
 *   optional resize behaviour
 */
export const PANE_ROLES = {
  detail: {
    purpose: "Primary information or work surface for the selected object.",
  },

  inspector: {
    purpose:
      "Contextual properties, metadata, audit information, configuration, or actions associated with the current object or selection.",
  },

  list: {
    purpose:
      "Collection or navigator pane whose selection establishes the object represented elsewhere.",
  },
  primary: {
    purpose:
      "Principal working region when the task does not naturally separate into list and detail semantics.",
  },

  supporting: {
    purpose:
      "Secondary task context that supports the primary work without owning the principal object.",
  },
} as const;

export type PaneRole = keyof typeof PANE_ROLES;

// -----------------------------------------------------------------------------
// PANE SIZING
// -----------------------------------------------------------------------------

export const PANE_SIZING = {
  fixed: {
    purpose:
      "Pane maintains a governed preferred dimension while another pane consumes remaining space.",
  },

  flexible: {
    purpose: "Pane expands or contracts to consume available scaffold space.",
  },
} as const;

export type PaneSizing = keyof typeof PANE_SIZING;

// -----------------------------------------------------------------------------
// PANE PRESENTATION
// -----------------------------------------------------------------------------

/**
 * Presentation answers WHERE the pane appears relative to the others.
 */
export const PANE_PRESENTATIONS = {
  "co-planar": {
    purpose:
      "Pane participates beside other visible panes in the normal workspace plane.",
  },

  docked: {
    purpose:
      "Supporting pane is attached to an edge while preserving the primary workspace.",
  },

  exclusive: {
    purpose:
      "Pane temporarily occupies the primary available workspace by itself.",
  },

  floating: {
    purpose: "Temporary pane appears above the co-planar workspace.",
  },
} as const;

export type PanePresentation = keyof typeof PANE_PRESENTATIONS;

// -----------------------------------------------------------------------------
// PANE PERSISTENCE
// -----------------------------------------------------------------------------

export const PANE_PERSISTENCE = {
  persistent: {
    purpose:
      "User sizing or visibility preference remains meaningful across applicable navigation and adaptive changes.",
  },

  temporary: {
    purpose:
      "Pane returns to its governed default presentation after its temporary task ends.",
  },
} as const;

export type PanePersistence = keyof typeof PANE_PERSISTENCE;

// -----------------------------------------------------------------------------
// PANE RULES
// -----------------------------------------------------------------------------

export const PANE_RULES = [
  {
    id: "AF-LAY-038",

    rule: "Every pane has one defined task responsibility.",
    strength: "must",
  },

  {
    id: "AF-LAY-039",

    rule: "Pane role remains stable when adaptive presentation changes.",
    strength: "must",
  },

  {
    id: "AF-LAY-040",

    rule: "A supporting or inspector pane must not become the semantic primary task merely because it becomes exclusive at a constrained width.",
    strength: "must",
  },

  {
    id: "AF-LAY-041",

    rule: "Flexible and fixed sizing describe space consumption rather than semantic importance.",
    strength: "must",
  },

  {
    id: "AF-LAY-042",

    rule: "Floating presentation is temporary and must provide a defined dismissal or completion path.",
    strength: "must",
  },

  {
    id: "AF-LAY-043",

    rule: "Pane visibility and presentation changes must preserve state appropriate to the pane's task.",
    strength: "must",
  },

  {
    id: "AF-LAY-044",

    rule: "A pane must not become an arbitrary dumping ground for unrelated utilities.",
    strength: "must",
  },
] as const;

// =============================================================================
// CANONICAL LAYOUT PATTERNS
// =============================================================================

/**
 * Canonical patterns describe recurring TASK STRUCTURES.
 *
 * They are more stable than individual screen layouts.
 */
export const LAYOUT_PATTERNS = {
  "master-detail": {
    maximumVisiblePanes: 2,

    minimumVisiblePanes: 1,

    panes: ["list", "detail"],
    purpose:
      "Collection and selected-record workflow where list and detail benefit from simultaneous visibility when space permits.",
  },

  "master-detail-inspector": {
    maximumVisiblePanes: 3,

    minimumVisiblePanes: 1,

    panes: ["list", "detail", "inspector"],
    purpose:
      "High-information professional workflow combining collection navigation, current-object work, and contextual inspection.",
  },
  "single-pane": {
    maximumVisiblePanes: 1,

    minimumVisiblePanes: 1,

    panes: ["primary"],
    purpose:
      "One principal task region where simultaneous supporting context is unnecessary.",
  },

  "supporting-pane": {
    maximumVisiblePanes: 2,

    minimumVisiblePanes: 1,

    panes: ["primary", "supporting"],
    purpose:
      "Primary task accompanied by supporting context, preview, reference, or secondary work.",
  },

  "workbench-inspector": {
    maximumVisiblePanes: 2,

    minimumVisiblePanes: 1,

    panes: ["primary", "inspector"],
    purpose:
      "Primary professional workspace accompanied by contextual properties, metadata, audit information, or actions.",
  },
} as const;

export type LayoutPattern = keyof typeof LAYOUT_PATTERNS;

// -----------------------------------------------------------------------------
// PATTERN RULES
// -----------------------------------------------------------------------------

export const LAYOUT_PATTERN_RULES = [
  {
    id: "AF-LAY-045",

    rule: "Canonical patterns are selected by task structure rather than visual preference.",
    strength: "must",
  },

  {
    id: "AF-LAY-046",

    rule: "A pattern preserves pane semantics across all supported adaptive states.",
    strength: "must",
  },

  {
    id: "AF-LAY-047",

    rule: "Constrained layouts may reduce simultaneously visible panes without deleting the corresponding task capability.",
    strength: "must",
  },

  {
    id: "AF-LAY-048",

    rule: "Master-detail should display list and detail simultaneously at expanded width and above when doing so materially improves the task.",
    strength: "should",
  },

  {
    id: "AF-LAY-049",

    rule: "Three-pane patterns should normally become simultaneously visible only where the workspace provides sufficient room to preserve productive content width.",
    strength: "should",
  },

  {
    id: "AF-LAY-050",

    rule: "A screen must not invent a new canonical pattern when an existing pattern expresses the same task structure.",
    strength: "must",
  },
] as const;

// =============================================================================
// DEFAULT PATTERN ADAPTATION
// =============================================================================

/**
 * These are DEFAULT semantic behaviours.
 *
 * Individual component/pattern contracts may override them only with an
 * explicit Level-1 reason.
 *
 * No physical breakpoint values are encoded here.
 */
export const DEFAULT_PATTERN_ADAPTATION = {
  "master-detail": {
    compact: ["one-of:list-or-detail"],

    expanded: ["list", "detail"],

    "extra-large": ["list", "detail"],

    large: ["list", "detail"],

    medium: ["one-of:list-or-detail"],
  },

  "master-detail-inspector": {
    compact: ["one-primary-task-pane", "inspector:levitate-or-exclusive"],

    expanded: ["list", "detail", "inspector:show-hide-or-levitate"],

    "extra-large": ["list", "detail", "inspector"],

    large: ["list", "detail", "inspector"],

    medium: ["one-primary-task-pane", "inspector:show-hide-or-levitate"],
  },
  "single-pane": {
    compact: ["primary"],

    expanded: ["primary"],

    "extra-large": ["primary"],

    large: ["primary"],

    medium: ["primary"],
  },

  "supporting-pane": {
    compact: ["primary", "supporting:levitate-or-exclusive"],

    expanded: ["primary", "supporting"],

    "extra-large": ["primary", "supporting"],

    large: ["primary", "supporting"],

    medium: ["primary", "supporting:show-hide-or-levitate"],
  },

  "workbench-inspector": {
    compact: ["primary", "inspector:levitate-or-exclusive"],

    expanded: ["primary", "inspector"],

    "extra-large": ["primary", "inspector"],

    large: ["primary", "inspector"],

    medium: ["primary", "inspector:show-hide-or-levitate"],
  },
} as const;

// =============================================================================
// COMPOSITION PRIMITIVES
// =============================================================================

/**
 * These are semantic LAYOUT PRIMITIVES.
 *
 * Level 2 chooses:
 *
 *   flexbox
 *   grid
 *   block layout
 *   container queries
 *   CSS subgrid
 *   etc.
 *
 * L1 does not care.
 */
export const LAYOUT_PRIMITIVES = {
  cluster: {
    purpose:
      "One-dimensional logical inline grouping that may wrap when space becomes constrained.",
  },

  grid: {
    purpose:
      "Two-dimensional structured placement where aligned tracks materially improve comprehension.",
  },

  pane: {
    purpose:
      "Task-oriented region participating in a canonical or custom governed multi-pane composition.",
  },

  section: {
    purpose:
      "Semantically grouped page or pane content with governed structural spacing.",
  },

  shell: {
    purpose:
      "Top-level application scaffold coordinating global navigation, header, workspace, and safe regions.",
  },

  split: {
    purpose:
      "Two-region composition with a governed relationship and optional resizable boundary.",
  },

  stack: {
    purpose: "One-dimensional logical block flow of related children.",
  },

  toolbar: {
    purpose:
      "Compact action or control region associated with a page, pane, selection, or component.",
  },
} as const;

export type LayoutPrimitive = keyof typeof LAYOUT_PRIMITIVES;

// -----------------------------------------------------------------------------
// PRIMITIVE RULES
// -----------------------------------------------------------------------------

export const LAYOUT_PRIMITIVE_RULES = [
  {
    id: "AF-LAY-051",

    rule: "Layout primitives express composition purpose rather than exposing raw CSS layout mechanics.",
    strength: "must",
  },

  {
    id: "AF-LAY-052",

    rule: "Stack and Cluster express flow direction and relationship; they are not interchangeable merely because both can be implemented with flexbox.",
    strength: "must",
  },

  {
    id: "AF-LAY-053",

    rule: "Grid is used when two-dimensional alignment materially supports the information structure.",
    strength: "must",
  },

  {
    id: "AF-LAY-054",

    rule: "Section represents semantic grouping rather than a generic styled container.",
    strength: "must",
  },

  {
    id: "AF-LAY-055",

    rule: "Toolbar is reserved for controls or actions associated with a defined scope.",
    strength: "must",
  },

  {
    id: "AF-LAY-056",

    rule: "Split describes a meaningful relationship between two regions and must not be used simply to obtain arbitrary columns.",
    strength: "must",
  },
] as const;

// =============================================================================
// GRID PURPOSES
// =============================================================================

/**
 * Afenda does NOT define one universal twelve-column grid.
 *
 * Different task structures require different grid semantics.
 *
 * Actual columns and tracks belong to Level 2.
 */
export const GRID_PURPOSES = {
  dashboard: {
    purpose:
      "Responsive placement of independent analytical or monitoring regions.",
  },

  detail: {
    purpose:
      "Structured presentation of related record properties and detail groups.",
  },

  form: {
    purpose:
      "Structured alignment of labels, fields, supporting content, and actions in forms.",
  },
  page: {
    purpose:
      "General page-level alignment of sections and primary content regions.",
  },
} as const;

export type GridPurpose = keyof typeof GRID_PURPOSES;

// -----------------------------------------------------------------------------
// GRID RULES
// -----------------------------------------------------------------------------

export const GRID_RULES = [
  {
    id: "AF-LAY-057",

    rule: "Grid purpose is selected by information structure rather than by preferred column count.",
    strength: "must",
  },

  {
    id: "AF-LAY-058",

    rule: "Column count is an implementation result and is not a Level-1 semantic API.",
    strength: "must",
  },

  {
    id: "AF-LAY-059",

    rule: "Grid adaptation must preserve meaningful alignment while allowing tracks to reflow or collapse.",
    strength: "must",
  },

  {
    id: "AF-LAY-060",

    rule: "DataGrid is an interactive data component and must not be conflated with the generic layout Grid primitive.",
    strength: "must",
  },

  {
    id: "AF-LAY-061",

    rule: "Form grids should prioritise readable relationships between labels, controls, validation, and supporting information over maximum horizontal density.",
    strength: "should",
  },
] as const;

// =============================================================================
// CONTENT MEASURE
// =============================================================================

/**
 * Measure describes how much horizontal space CONTENT should consume,
 * independently from how much space the pane itself owns.
 *
 * A large pane does not imply that prose or forms should stretch endlessly.
 */
export const CONTENT_MEASURES = {
  compact: {
    purpose:
      "Narrow content whose task naturally benefits from constrained measure.",
  },

  fluid: {
    purpose:
      "Content that legitimately benefits from consuming available width, such as complex tables, dashboards, canvases, or workbenches.",
  },

  form: {
    purpose:
      "Form and task-entry content where excessive width would weaken field relationships.",
  },

  reading: {
    purpose:
      "Continuous prose and explanation requiring comfortable reading measure.",
  },

  record: {
    purpose:
      "Record-detail information that benefits from moderate bounded structure while permitting grouped data.",
  },
} as const;

export type ContentMeasure = keyof typeof CONTENT_MEASURES;

// -----------------------------------------------------------------------------
// MEASURE RULES
// -----------------------------------------------------------------------------

export const CONTENT_MEASURE_RULES = [
  {
    id: "AF-LAY-062",

    rule: "Pane width and content measure are separate layout decisions.",
    strength: "must",
  },

  {
    id: "AF-LAY-063",

    rule: "Reading content must not become arbitrarily wide merely because the containing pane is wide.",
    strength: "must",
  },

  {
    id: "AF-LAY-064",

    rule: "Forms should use bounded measure unless the field structure has a semantic reason to consume wider space.",
    strength: "should",
  },

  {
    id: "AF-LAY-065",

    rule: "Fluid measure is reserved for tasks that genuinely benefit from additional horizontal working area.",
    strength: "must",
  },
] as const;

// =============================================================================
// RULERS / ALIGNMENT
// =============================================================================

/**
 * Rulers are shared logical alignment references.
 *
 * They prevent unrelated components from inventing slightly different
 * alignment edges.
 */
export const LAYOUT_RULERS = {
  action: {
    purpose:
      "Aligns primary action regions and related toolbars where consistent placement improves scanning.",
  },

  content: {
    purpose: "Aligns principal page or pane content.",
  },
  safety: {
    purpose:
      "Keeps application content outside reserved or unavailable environment regions.",
  },

  title: {
    purpose: "Aligns primary titles and their immediate contextual controls.",
  },
} as const;

export type LayoutRuler = keyof typeof LAYOUT_RULERS;

// -----------------------------------------------------------------------------
// LOGICAL ALIGNMENT
// -----------------------------------------------------------------------------

export const LAYOUT_ALIGNMENT = [
  "start",
  "center",
  "end",
  "stretch",
  "baseline",
] as const;

export type LayoutAlignment = (typeof LAYOUT_ALIGNMENT)[number];

// -----------------------------------------------------------------------------
// ALIGNMENT RULES
// -----------------------------------------------------------------------------

export const ALIGNMENT_RULES = [
  {
    id: "AF-LAY-066",

    rule: "Layout alignment uses logical start and end semantics rather than assuming physical left and right.",
    strength: "must",
  },

  {
    id: "AF-LAY-067",

    rule: "Rulers provide shared alignment intent and must not encode physical pixel positions in Level 1.",
    strength: "must",
  },

  {
    id: "AF-LAY-068",

    rule: "Primary page titles and content should share stable alignment references across related product screens.",
    strength: "should",
  },

  {
    id: "AF-LAY-069",

    rule: "Visual alignment must not require semantic source order to become illogical.",
    strength: "must",
  },
] as const;

// =============================================================================
// SCROLL OWNERSHIP
// =============================================================================

/**
 * Scroll ownership is explicit because enterprise SaaS frequently contains:
 *
 *   shell
 *     pane
 *       table
 *         drawer
 *
 * Without ownership, nested same-axis scrolling becomes accidental.
 */
export const SCROLL_OWNERS = {
  pane: {
    purpose:
      "A pane owns its primary content scrolling while scaffold regions remain stable.",
  },

  region: {
    purpose:
      "A deliberately bounded component or sub-region owns scrolling because its task requires independent movement.",
  },
  window: {
    purpose:
      "Document-level scrolling for simpler or constrained presentations where the browser/page owns primary progression.",
  },
} as const;

export type ScrollOwner = keyof typeof SCROLL_OWNERS;

// -----------------------------------------------------------------------------
// SCROLL RULES
// -----------------------------------------------------------------------------

export const SCROLL_RULES = [
  {
    id: "AF-LAY-070",

    rule: "Every primary scrolling axis has an explicit owner.",
    strength: "must",
  },

  {
    id: "AF-LAY-071",

    rule: "Nested scrolling on the same axis requires a specific task reason and must not arise accidentally from component composition.",
    strength: "must",
  },

  {
    id: "AF-LAY-072",

    rule: "Sticky positioning is relative to the intended scroll owner.",
    strength: "must",
  },

  {
    id: "AF-LAY-073",

    rule: "Keyboard-focused content must be capable of becoming visible within its scroll owner.",
    strength: "must",
  },

  {
    id: "AF-LAY-074",

    rule: "Adaptive transitions must not strand the user's scroll context without a defined reason.",
    strength: "must",
  },

  {
    id: "AF-LAY-075",

    rule: "Desktop workbench patterns should prefer pane-owned scrolling when stable scaffold navigation and tools materially aid the task.",
    strength: "should",
  },
] as const;

// =============================================================================
// PANE RESIZING
// =============================================================================

export const PANE_RESIZE_CAPABILITY = {
  none: {
    purpose:
      "Pane sizing is fully governed by the layout and not user-adjustable.",
  },

  persistent: {
    purpose:
      "User size preference is meaningful enough to restore across applicable sessions or layout transitions.",
  },

  temporary: {
    purpose:
      "User may resize the pane for the current task or presentation, but the preference is not expected to persist indefinitely.",
  },
} as const;

export type PaneResizeCapability = keyof typeof PANE_RESIZE_CAPABILITY;

// -----------------------------------------------------------------------------
// RESIZE RULES
// -----------------------------------------------------------------------------

export const PANE_RESIZE_RULES = [
  {
    id: "AF-LAY-076",

    rule: "Resizable panes declare whether resize preference is temporary or persistent.",
    strength: "must",
  },

  {
    id: "AF-LAY-077",

    rule: "Pane resizing must preserve the minimum usable requirements of affected panes.",
    strength: "must",
  },

  {
    id: "AF-LAY-078",

    rule: "Drag is not the only permitted mechanism for operating a resizable pane when accessibility requires an alternative.",
    strength: "must",
  },

  {
    id: "AF-LAY-079",

    rule: "Persistent pane preference survives adaptive changes where the preference remains valid.",
    strength: "must",
  },

  {
    id: "AF-LAY-080",

    rule: "A persisted pane dimension must not override a new layout condition when doing so would make another required pane unusable.",
    strength: "must",
  },

  {
    id: "AF-LAY-081",

    rule: "Pane resize handles are interaction components and require explicit keyboard, focus, pointer, and accessibility semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// SAFE REGIONS
// =============================================================================

export const SAFE_REGION_RULES = [
  {
    id: "AF-LAY-082",

    rule: "Application content must respect declared unavailable or unsafe environment regions.",
    strength: "must",
  },

  {
    id: "AF-LAY-083",

    rule: "Safe-region handling belongs to scaffold and layout infrastructure rather than being independently reconstructed by product screens.",
    strength: "must",
  },

  {
    id: "AF-LAY-084",

    rule: "Avoided regions may cause reflow or partitioning but must not silently remove essential content.",
    strength: "must",
  },
] as const;

// =============================================================================
// FOCUS / NAVIGATION CONTINUITY
// =============================================================================

export const ADAPTIVE_FOCUS_RULES = [
  {
    id: "AF-LAY-085",

    rule: "Adaptive layout must preserve logical focus order.",
    strength: "must",
  },

  {
    id: "AF-LAY-086",

    rule: "When a focused pane becomes hidden or levitated, focus must move according to a defined interaction rule rather than becoming lost.",
    strength: "must",
  },

  {
    id: "AF-LAY-087",

    rule: "Visual pane order must not contradict keyboard or assistive-technology reading order.",
    strength: "must",
  },

  {
    id: "AF-LAY-088",

    rule: "Returning from a temporary pane should restore a meaningful focus position in the originating task where applicable.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONTENT CONTINUITY
// =============================================================================

export const ADAPTIVE_CONTENT_RULES = [
  {
    id: "AF-LAY-089",

    rule: "Reflow must not change the meaning or relationship of content.",
    strength: "must",
  },

  {
    id: "AF-LAY-090",

    rule: "Essential actions remain available in every supported adaptive state.",
    strength: "must",
  },

  {
    id: "AF-LAY-091",

    rule: "A hidden supporting pane must retain a discoverable mechanism for reopening it when its capability remains relevant.",
    strength: "must",
  },

  {
    id: "AF-LAY-092",

    rule: "Changing window or container class must not discard unsaved user work.",
    strength: "must",
  },

  {
    id: "AF-LAY-093",

    rule: "Adaptive presentation must preserve current selection, object context, and workflow state where those remain applicable.",
    strength: "must",
  },
] as const;

// =============================================================================
// DENSITY RELATIONSHIP
// =============================================================================

/**
 * Density and layout are independent.
 *
 * Large window + dense
 * Small window + comfortable
 *
 * are both legitimate.
 */
export const LAYOUT_DENSITY_RELATIONSHIP = {
  density: "governed geometry and information compression",
  independent: true,

  layout: "available-space composition",

  principle: "Responsive layout must not be simulated by changing density.",
} as const;

export const LAYOUT_DENSITY_RULES = [
  {
    id: "AF-LAY-094",

    rule: "Window or container class must not automatically determine workspace density.",
    strength: "must",
  },

  {
    id: "AF-LAY-095",

    rule: "Density must not substitute for reflow when the structure no longer fits.",
    strength: "must",
  },

  {
    id: "AF-LAY-096",

    rule: "Layout adaptation and density adaptation may occur together but preserve independent semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// TENANT POLICY
// =============================================================================

/**
 * Layout is intentionally almost entirely protected.
 *
 * Tenant branding must not create structurally different Afenda products.
 */
export const LAYOUT_TENANT_POLICY = {
  customisable: [],
  default: "closed",

  principle:
    "Tenant identity may alter expression, not product layout semantics.",

  protected: [
    "window classes",
    "container classes",
    "scaffold structure",
    "pane semantics",
    "adaptive strategies",
    "canonical patterns",
    "scroll ownership",
    "resize behaviour",
    "focus continuity",
    "layout primitives",
  ],
} as const;

export const LAYOUT_TENANT_RULES = [
  {
    id: "AF-LAY-097",

    rule: "Tenant customisation must not redefine Afenda window or container classes.",
    strength: "must",
  },

  {
    id: "AF-LAY-098",

    rule: "Tenant customisation must not change canonical pane semantics or adaptive behaviour.",
    strength: "must",
  },

  {
    id: "AF-LAY-099",

    rule: "Tenant branding must not cause equivalent Afenda modules to use structurally incompatible layout models.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACCESSIBILITY RELATIONSHIP
// =============================================================================

/**
 * 08-accessibility.ts owns measurable requirements.
 *
 * Layout declares the things that must be proven.
 */
export const LAYOUT_ACCESSIBILITY_REQUIREMENTS = [
  "reflow",
  "zoom-resilience",
  "text-resize",
  "focus-order",
  "focus-visible",
  "focus-not-obscured",
  "focus-restoration",
  "keyboard-operability",
  "drag-alternative",
  "target-size",
  "reading-order",
] as const;

export const LAYOUT_ACCESSIBILITY_RULES = [
  {
    id: "AF-LAY-100",

    rule: "Layout must remain operable under the supported reflow and zoom accessibility requirements.",
    strength: "must",
  },

  {
    id: "AF-LAY-101",

    rule: "Adaptive reordering must preserve meaningful programmatic and reading order.",
    strength: "must",
  },

  {
    id: "AF-LAY-102",

    rule: "Scrollable and resizable regions must expose the interaction semantics required by the accessibility language.",
    strength: "must",
  },

  {
    id: "AF-LAY-103",

    rule: "Focus must not become permanently obscured by sticky, floating, or modal layout regions.",
    strength: "must",
  },

  {
    id: "AF-LAY-104",

    rule: "A pane hidden by adaptation must not contain the only reachable instance of an essential action.",
    strength: "must",
  },
] as const;

// =============================================================================
// PUBLIC API
// =============================================================================

export const LAYOUT_PUBLIC_API = {
  alignment: ["start", "center", "end", "stretch", "baseline"],
  conditions: {
    containerWidth: CONTAINER_WIDTH_CLASSES,

    windowHeight: WINDOW_HEIGHT_CLASSES,
    windowWidth: WINDOW_WIDTH_CLASSES,
  },

  gridPurposes: ["page", "form", "dashboard", "detail"],

  measure: ["compact", "reading", "form", "record", "fluid"],

  panePresentation: ["co-planar", "docked", "floating", "exclusive"],

  paneResize: ["none", "temporary", "persistent"],

  paneRoles: ["primary", "list", "detail", "supporting", "inspector"],

  paneSizing: ["fixed", "flexible"],

  patterns: [
    "single-pane",
    "master-detail",
    "supporting-pane",
    "workbench-inspector",
    "master-detail-inspector",
  ],

  primitives: [
    "shell",
    "pane",
    "stack",
    "cluster",
    "grid",
    "section",
    "toolbar",
    "split",
  ],

  rulers: ["safety", "title", "content", "action"],

  scrollOwner: ["window", "pane", "region"],

  strategies: ["reflow", "show-hide", "levitate", "resize"],
} as const;

// =============================================================================
// CONTRACT TYPES
// =============================================================================

export interface PaneContract {
  readonly adaptation?: Partial<
    Readonly<Record<WindowWidthClass, readonly AdaptiveStrategy[]>>
  >;

  readonly persistence?: PanePersistence;

  readonly presentation: PanePresentation;

  readonly resize: PaneResizeCapability;
  readonly role: PaneRole;

  readonly scrollOwner?: ScrollOwner;

  readonly sizing: PaneSizing;
}

export interface LayoutPatternContract {
  readonly id: LayoutPattern;

  readonly panes: readonly PaneContract[];

  readonly preservesTaskState: true;

  readonly primaryPane: "primary" | "detail" | "list";

  readonly windowAdaptive: true;
}

export interface ComponentLayoutContract {
  readonly containerAdaptive: boolean;

  readonly contentMeasure?: ContentMeasure;

  readonly strategies?: readonly AdaptiveStrategy[];

  readonly supportedContainerClasses?: readonly ContainerWidthClass[];
}

// =============================================================================
// FORBIDDEN USAGE
// =============================================================================

export const LAYOUT_FORBIDS = [
  {
    behaviour:
      "reusable components use browser window width as a proxy for their actual available space",
    id: "AF-LAY-105",
    strength: "must",
  },

  {
    behaviour: "application modules invent independent breakpoint vocabularies",
    id: "AF-LAY-106",
    strength: "must",
  },

  {
    behaviour:
      "device names such as mobile, tablet, or desktop become canonical layout classes",
    id: "AF-LAY-107",
    strength: "must",
  },

  {
    behaviour:
      "essential capability disappears at a constrained width without another reachable presentation",
    id: "AF-LAY-108",
    strength: "must",
  },

  {
    behaviour: "visual CSS order contradicts logical reading or keyboard order",
    id: "AF-LAY-109",
    strength: "must",
  },

  {
    behaviour:
      "pages create arbitrary nested same-axis scroll regions without explicit ownership",
    id: "AF-LAY-110",
    strength: "must",
  },

  {
    behaviour:
      "application code chooses arbitrary pane widths as reusable design semantics",
    id: "AF-LAY-111",
    strength: "must",
  },

  {
    behaviour:
      "grid column count is exposed as the semantic identity of a Level-1 layout pattern",
    id: "AF-LAY-112",
    strength: "must",
  },

  {
    behaviour:
      "viewport breakpoints are used to solve component-level container constraints",
    id: "AF-LAY-113",
    strength: "must",
  },

  {
    behaviour:
      "responsive behaviour is implemented by changing density instead of adapting layout structure",
    id: "AF-LAY-114",
    strength: "must",
  },

  {
    behaviour:
      "drag is the only means of operating a resizable pane where an accessible alternative is required",
    id: "AF-LAY-115",
    strength: "must",
  },

  {
    behaviour:
      "tenant customisation changes canonical application layout semantics",
    id: "AF-LAY-116",
    strength: "must",
  },

  {
    behaviour:
      "a new canonical pattern is introduced solely because a screen has slightly different visual proportions",
    id: "AF-LAY-117",
    strength: "must",
  },

  {
    behaviour: "generic Grid is used as the interactive data-grid component",
    id: "AF-LAY-118",
    strength: "must",
  },

  {
    behaviour:
      "pane presentation changes cause unsaved task state to be discarded",
    id: "AF-LAY-119",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const LAYOUT_SOURCES = [
  {
    adaptation:
      "Afenda adopts the scaffold and pane concepts while defining SaaS-specific workbench, inspector, scroll, and web container semantics.",

    contribution: [
      "window-oriented adaptive layout",
      "scaffold",
      "bars and rails",
      "panes",
      "rulers",
      "safe regions",
      "one-to-three-pane composition",
    ],

    disposition: "adapt",
    id: "m3-layout",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda adopts semantic window-class names while leaving concrete web breakpoint values to Level 2.",

    contribution: [
      "compact width class",
      "medium width class",
      "expanded width class",
      "large width class",
      "extra-large width class",
      "height classes",
    ],

    disposition: "adapt",
    id: "m3-window-size-classes",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda extends pane adaptation with container-query-driven components, explicit inspector semantics, scroll ownership, and enterprise workbench patterns.",

    contribution: [
      "pane scaffold directives",
      "list-detail layouts",
      "supporting-pane layouts",
      "reflow",
      "levitate",
      "preferred pane dimensions",
      "pane resizing",
      "pane state preservation",
    ],

    disposition: "adapt",
    id: "m3-adaptive-layout",

    system: "Material 3 Adaptive",
  },

  {
    adaptation:
      "Afenda does not adopt a universal column-count system and instead defines task-specific grid purposes.",

    contribution: [
      "adaptive grids",
      "spacing-based grouping",
      "edge-inward scaffold placement",
      "alignment rulers",
    ],

    disposition: "adapt",
    id: "m3-grids",

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

export const LAYOUT_SOURCE_DISPOSITION = {
  // Afenda additions

  "afenda-container-classes": "adapt",

  "afenda-content-measure": "adapt",

  "afenda-master-detail-inspector": "adapt",

  "afenda-scroll-ownership": "adapt",

  "afenda-workbench-inspector": "adapt",

  // Grid

  "m3-adaptive-grid-principle": "adopt",
  // M3 window classes

  "m3-compact-width-class": "adopt",

  "m3-example-column-counts": "reject",

  "m3-expanded-width-class": "adopt",

  "m3-extra-large-width-class": "adopt",

  "m3-fixed-flexible-pane": "adapt",

  "m3-height-classes": "adapt",

  "m3-large-width-class": "adopt",

  "m3-levitate": "adopt",

  "m3-list-detail": "adopt",

  "m3-medium-width-class": "adopt",

  "m3-pane": "adopt",

  "m3-pane-preferred-widths": "adapt",

  "m3-pane-snap-width-values": "reject",

  "m3-published-width-thresholds": "adapt",

  // Adaptive behaviour

  "m3-reflow": "adopt",

  "m3-resize": "adopt",

  "m3-rulers": "adapt",

  "m3-safe-regions": "adopt",

  // Scaffold

  "m3-scaffold": "adopt",

  "m3-show-hide": "adopt",

  // Pane models

  "m3-single-pane": "adopt",

  "m3-supporting-pane": "adopt",

  "m3-three-pane": "adopt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const LAYOUT_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-LAY-120",

    obligation:
      "Level 2 provides deterministic mappings for all supported window classes.",
    strength: "must",
  },

  {
    id: "AF-LAY-121",

    obligation:
      "Level 2 provides deterministic mappings for all supported container classes.",
    strength: "must",
  },

  {
    id: "AF-LAY-122",

    obligation:
      "Reusable container-adaptive components respond to their own containing region rather than the global viewport.",
    strength: "must",
  },

  {
    id: "AF-LAY-123",

    obligation:
      "Every canonical pattern implements all supported adaptive states required by its Level-1 contract.",
    strength: "must",
  },

  {
    id: "AF-LAY-124",

    obligation:
      "Level 2 preserves pane state across adaptive visibility and presentation changes where required.",
    strength: "must",
  },

  {
    id: "AF-LAY-125",

    obligation:
      "Level 2 provides explicit scroll ownership for canonical shell and pane patterns.",
    strength: "must",
  },

  {
    id: "AF-LAY-126",

    obligation:
      "Resizable panes expose all interaction mechanisms required by their accessibility contract.",
    strength: "must",
  },

  {
    id: "AF-LAY-127",

    obligation:
      "Level 2 implements layout alignment using logical direction semantics.",
    strength: "must",
  },

  {
    id: "AF-LAY-128",

    obligation:
      "Adaptive visual composition preserves meaningful semantic source and focus order.",
    strength: "must",
  },

  {
    id: "AF-LAY-129",

    obligation:
      "Level 2 applies governed content measures independently from pane width.",
    strength: "must",
  },

  {
    id: "AF-LAY-130",

    obligation:
      "Level 2 implements safe-region avoidance at scaffold infrastructure level.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const LAYOUT_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-LAY-131",

    prove:
      "all canonical window classes have one deterministic Level-2 mapping",
  },

  {
    id: "AF-LAY-132",

    prove:
      "all canonical container classes have one deterministic Level-2 mapping",
  },

  {
    id: "AF-LAY-133",

    prove:
      "application modules do not introduce undeclared viewport breakpoint vocabularies",
  },

  {
    id: "AF-LAY-134",

    prove:
      "container-adaptive components do not depend on global viewport classes for local composition",
  },

  {
    id: "AF-LAY-135",

    prove:
      "all canonical patterns implement required pane states across supported window classes",
  },

  {
    id: "AF-LAY-136",

    prove:
      "required task capability remains reachable when panes are hidden, levitated, or made exclusive",
  },

  {
    id: "AF-LAY-137",

    prove: "adaptive transitions preserve pane and task state where required",
  },

  {
    id: "AF-LAY-138",

    prove:
      "visual pane reordering does not contradict semantic focus and reading order",
  },

  {
    id: "AF-LAY-139",

    prove: "canonical task regions have explicit scroll ownership",
  },

  {
    id: "AF-LAY-140",

    prove:
      "nested same-axis scrolling appears only in explicitly admitted component or pattern contracts",
  },

  {
    id: "AF-LAY-141",

    prove: "resizable panes provide required non-drag operation",
  },

  {
    id: "AF-LAY-142",

    prove:
      "persistent pane preferences do not violate current minimum usable layout constraints",
  },

  {
    id: "AF-LAY-143",

    prove:
      "required content remains usable under supported reflow, zoom, and text-scaling conditions",
  },

  {
    id: "AF-LAY-144",

    prove:
      "focus is not lost or permanently obscured during adaptive pane transitions",
  },

  {
    id: "AF-LAY-145",

    prove: "tenant configuration cannot alter protected layout semantics",
  },

  {
    id: "AF-LAY-146",

    prove: "generic Grid and interactive DataGrid remain distinct APIs",
  },

  {
    id: "AF-LAY-147",

    prove:
      "new canonical layout patterns have distinct task semantics rather than merely distinct proportions",
  },
] as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const LAYOUT_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "breakpoint-validated",
    "container-validated",
    "pattern-validated",
    "state-continuity-validated",
    "focus-order-validated",
    "scroll-validated",
    "accessibility-validated",
  ],

  implementation: [
    "window-resolved",
    "container-resolved",
    "pattern-adaptive",
    "pane-state-preserved",
    "scroll-owned",
    "resize-operable",
  ],
  language: [
    "condition-defined",
    "window-class-defined",
    "container-class-defined",
    "strategy-defined",
    "scaffold-defined",
    "pane-semantics-defined",
    "pattern-defined",
    "primitive-defined",
    "scroll-defined",
    "resize-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type LayoutPublicApi = typeof LAYOUT_PUBLIC_API;

export type LayoutPatternDefinition = (typeof LAYOUT_PATTERNS)[LayoutPattern];

export type AdaptiveStrategyDefinition =
  (typeof ADAPTIVE_STRATEGIES)[AdaptiveStrategy];

export type WindowWidthClassDefinition =
  (typeof WINDOW_WIDTH_CLASS_SEMANTICS)[WindowWidthClass];

export type ContainerWidthClassDefinition =
  (typeof CONTAINER_WIDTH_CLASS_SEMANTICS)[ContainerWidthClass];

export type LayoutSourceDisposition =
  (typeof LAYOUT_SOURCE_DISPOSITION)[keyof typeof LAYOUT_SOURCE_DISPOSITION];
