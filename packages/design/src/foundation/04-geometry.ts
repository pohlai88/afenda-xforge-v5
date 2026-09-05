/**
 * AFENDA DESIGN LANGUAGE — GEOMETRY
 *
 * L1.04
 *
 * Defines the physical and spatial language of Afenda.
 *
 * Geometry governs:
 *
 *   - spacing
 *   - sizing
 *   - density
 *   - interaction targets
 *   - shape
 *   - stroke
 *   - icon geometry
 *   - visual elevation
 *   - stacking layers
 *
 * Geometry does NOT govern:
 *
 *   - responsive composition       → 05-layout.ts
 *   - colour hierarchy             → 02-color.ts
 *   - typography                   → 03-typography.ts
 *   - interaction state            → 07-interaction.ts
 *   - accessibility thresholds     → 08-accessibility.ts
 *
 * This file defines semantic geometry.
 *
 * It deliberately defines NO physical values.
 *
 * No:
 *   - px
 *   - rem
 *   - dp
 *   - spacing numbers
 *   - radius numbers
 *   - icon pixel sizes
 *   - border widths
 *   - shadow definitions
 *   - z-index numbers
 *   - Tailwind utilities
 *   - CSS
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
 *   AF-PRI-009 Tenant expression cannot redefine product semantics
 *
 * Token authority:
 *   01-tokens.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

import type { SystemTokenDefinition, TokenContextId } from "./01-tokens";

// -----------------------------------------------------------------------------
// IDENTITY
// -----------------------------------------------------------------------------

export const GEOMETRY_LANGUAGE = {
  code: "GEO",
  id: "geometry",
  level: 1,
  order: 4,

  philosophy:
    "Geometry communicates relationship and function before decoration.",

  purpose:
    "Define stable semantic rules for spatial relationships, physical sizing, density, targets, shapes, icons, elevation, and stacking.",
  version: "1.0.0",
} as const;

// -----------------------------------------------------------------------------
// PRINCIPLES
// -----------------------------------------------------------------------------

export const GEOMETRY_PRINCIPLES = [
  {
    id: "AF-GEO-001",

    statement:
      "Geometry is selected by semantic relationship and interaction purpose rather than by arbitrary physical value.",
    strength: "must",
  },

  {
    id: "AF-GEO-002",

    statement:
      "Spatial proximity communicates relationship; larger separation communicates weaker relationship or stronger structural boundary.",
    strength: "must",
  },

  {
    id: "AF-GEO-003",

    statement:
      "Density may compress productive geometry but must not reduce semantic clarity, interaction accessibility, or required content.",
    strength: "must",
  },

  {
    id: "AF-GEO-004",

    statement:
      "Visual component size and effective interaction target are separate concepts.",
    strength: "must",
  },

  {
    id: "AF-GEO-005",

    statement:
      "Shape communicates component character, containment, or state and is not arbitrary decoration.",
    strength: "must",
  },

  {
    id: "AF-GEO-006",

    statement:
      "Visual elevation communicates depth or temporary separation and is independent from stacking order.",
    strength: "must",
  },

  {
    id: "AF-GEO-007",

    statement:
      "Stacking order exists to resolve overlap and interaction priority, not to create visual prominence.",
    strength: "must",
  },

  {
    id: "AF-GEO-008",

    statement:
      "Icon visual size is independent from the interaction target surrounding the icon.",
    strength: "must",
  },

  {
    id: "AF-GEO-009",

    statement:
      "Productive geometry is deliberately restrained so dense enterprise interfaces remain calm during long working sessions.",
    strength: "must",
  },

  {
    id: "AF-GEO-010",

    statement:
      "Application code consumes semantic geometry rather than reconstructing the design system from arbitrary dimensions.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// -----------------------------------------------------------------------------
// GEOMETRY TAXONOMY
// -----------------------------------------------------------------------------

export const GEOMETRY_DOMAINS = {
  density: {
    purpose:
      "Governed variation in productive component geometry and information packing.",
    tokenCategory: "size",
  },

  elevation: {
    purpose:
      "Visual perception of depth and temporary separation from surrounding surfaces.",
    tokenCategory: "elevation",
  },

  icon: {
    purpose:
      "Visual icon scale and geometric treatment independent from interaction-target size.",
    tokenCategory: "size",
  },

  layer: {
    purpose:
      "Logical stacking and overlap priority independent from visual elevation.",
    tokenCategory: "layer",
  },

  shape: {
    purpose:
      "Corner and container form conveying containment, component character, and permitted expression.",
    tokenCategory: "shape",
  },

  size: {
    purpose:
      "Governed physical dimensions used by controls, structures, indicators, and component anatomy.",
    tokenCategory: "size",
  },
  space: {
    purpose:
      "Relationship and separation between elements, groups, sections, panes, and page regions.",
    tokenCategory: "space",
  },

  stroke: {
    purpose:
      "Thickness semantics for separators, boundaries, emphasis, and focus geometry.",
    tokenCategory: "size",
  },

  target: {
    purpose:
      "Effective interactive regions through which pointer or touch interaction can occur.",
    tokenCategory: "size",
  },
} as const;

export type GeometryDomain = keyof typeof GEOMETRY_DOMAINS;

// =============================================================================
// SPACING
// =============================================================================

// -----------------------------------------------------------------------------
// SPACING MODEL
// -----------------------------------------------------------------------------

/**
 * Afenda does not expose the underlying reference spacing scale to
 * application code.
 *
 * Reference values belong to Level 2:
 *
 *   af.ref.space.*
 *
 * Application/component language consumes relationships:
 *
 *   af.sys.space.inline
 *   af.sys.space.control
 *   af.sys.space.group
 *   af.sys.space.section
 *
 * Component-private geometry may resolve directly to reference spacing
 * when no meaningful system relationship exists.
 */
export const SPACING_MODEL = {
  densityAware: true,

  physicalDirection: "logical",

  publicModel: "semantic-relationship",
  underlyingScale: "reference",
} as const;

// -----------------------------------------------------------------------------
// SPACING ROLES
// -----------------------------------------------------------------------------

export const SPACING_ROLES = {
  control: {
    densitySensitive: true,

    purpose:
      "Internal spacing between meaningful parts of an interactive control.",

    relationship: "strong",
    token: "af.sys.space.control",
  },

  field: {
    densitySensitive: true,

    purpose: "Separation between related form fields or field structures.",

    relationship: "related",
    token: "af.sys.space.field",
  },

  group: {
    densitySensitive: false,

    purpose:
      "Separation between meaningful groups inside one section or component.",

    relationship: "group-boundary",
    token: "af.sys.space.group",
  },

  inline: {
    densitySensitive: true,

    purpose: "Default separation between directly related inline elements.",

    relationship: "strong",
    token: "af.sys.space.inline",
  },
  "inline-tight": {
    densitySensitive: true,

    purpose:
      "Very close separation between strongly related inline elements such as an icon and its immediate label.",

    relationship: "strongest",
    token: "af.sys.space.inline-tight",
  },

  item: {
    densitySensitive: true,

    purpose:
      "Separation between peer items within the same compact collection or repeated structure.",

    relationship: "related",
    token: "af.sys.space.item",
  },

  page: {
    densitySensitive: false,

    purpose:
      "Primary breathing space between application content and its containing page or workspace region.",

    relationship: "structural",
    token: "af.sys.space.page",
  },

  pane: {
    densitySensitive: false,

    purpose: "Structural spacing associated with pane-level composition.",

    relationship: "structural",
    token: "af.sys.space.pane",
  },

  section: {
    densitySensitive: false,

    purpose:
      "Separation between major information sections within a page or pane.",

    relationship: "section-boundary",
    token: "af.sys.space.section",
  },
} as const;

export type SpacingRole = keyof typeof SPACING_ROLES;

// -----------------------------------------------------------------------------
// SPACING RELATIONSHIP ORDER
// -----------------------------------------------------------------------------

export const SPACING_RELATIONSHIP_ORDER = [
  "inline-tight",
  "inline",
  "control",
  "item",
  "field",
  "group",
  "section",
  "pane",
  "page",
] as const;

// -----------------------------------------------------------------------------
// SPACING RULES
// -----------------------------------------------------------------------------

export const SPACING_RULES = [
  {
    id: "AF-GEO-011",

    rule: "Spacing communicates semantic relationship rather than arbitrary visual preference.",
    strength: "must",
  },

  {
    id: "AF-GEO-012",

    rule: "Elements with a stronger semantic relationship should not normally be separated more than unrelated structural groups.",
    strength: "must",
  },

  {
    id: "AF-GEO-013",

    rule: "Application code must not select reference spacing values when a system spacing relationship expresses the intended meaning.",
    strength: "must",
  },

  {
    id: "AF-GEO-014",

    rule: "Component-private spacing may resolve directly to a reference token where no reusable system-level semantic relationship exists.",
    strength: "must",
  },

  {
    id: "AF-GEO-015",

    rule: "Spacing APIs use logical direction rather than assuming left-to-right physical direction.",
    strength: "must",
  },

  {
    id: "AF-GEO-016",

    rule: "Dense interfaces should preserve section and group rhythm even when component-internal geometry becomes more compact.",
    strength: "should",
  },

  {
    id: "AF-GEO-017",

    rule: "A one-off layout measurement does not automatically justify creation of a system spacing token.",
    strength: "must",
  },
] as const;

// =============================================================================
// SIZE
// =============================================================================

// -----------------------------------------------------------------------------
// SIZE INTENTS
// -----------------------------------------------------------------------------

/**
 * Generic size intent may be referenced by component contracts.
 *
 * It does NOT prescribe that every component exposes all sizes.
 *
 * Example:
 *
 *   Button may expose compact/default/large.
 *   Checkbox may expose only default.
 *
 * The component contract decides.
 */
export const SIZE_INTENTS = {
  compact: {
    purpose:
      "Space-efficient productive geometry for components explicitly designed to support a compact size.",
  },

  default: {
    purpose: "Normal productive component geometry.",
  },

  large: {
    purpose:
      "Increased geometry for components requiring stronger presence, easier targeting, or specific layout use.",
  },
} as const;

export type SizeIntent = keyof typeof SIZE_INTENTS;

// -----------------------------------------------------------------------------
// SIZE RULES
// -----------------------------------------------------------------------------

export const SIZE_RULES = [
  {
    id: "AF-GEO-018",

    rule: "A component exposes only size intents admitted by its Level-1 component contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-019",

    rule: "Size intent describes component geometry rather than information importance.",
    strength: "must",
  },

  {
    id: "AF-GEO-020",

    rule: "Large component size must not be used as an arbitrary substitute for semantic prominence.",
    strength: "must",
  },

  {
    id: "AF-GEO-021",

    rule: "Compact size must not weaken the applicable interaction-target or accessibility contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-022",

    rule: "Component size and workspace density are related but independent APIs.",
    strength: "must",
  },
] as const;

// =============================================================================
// DENSITY
// =============================================================================

// -----------------------------------------------------------------------------
// DENSITY MODES
// -----------------------------------------------------------------------------

/**
 * Density is a user/product presentation mode.
 *
 * It controls selected PRODUCTIVE geometry.
 *
 * It does not:
 *
 *   - redefine typography hierarchy
 *   - change colour semantics
 *   - change interaction semantics
 *   - change accessibility requirements
 *   - change business meaning
 */
export const DENSITY_MODES = {
  comfortable: {
    geometryCompression: "none",

    informationDensity: "standard",
    purpose:
      "Default balanced geometry appropriate for general enterprise work and mixed input modalities.",
  },

  compact: {
    geometryCompression: "moderate",

    informationDensity: "increased",
    purpose:
      "More efficient productive geometry for data-intensive professional workflows.",
  },

  dense: {
    geometryCompression: "strong",

    informationDensity: "high",
    purpose:
      "Maximum governed information density for specialised high-volume professional workflows where the component and input environment explicitly support it.",
  },
} as const;

export type DensityMode = keyof typeof DENSITY_MODES;

// -----------------------------------------------------------------------------
// DENSITY CONTEXT
// -----------------------------------------------------------------------------

export const GEOMETRY_DENSITY_CONTEXT = {
  context: "density" satisfies TokenContextId,

  default: "comfortable",

  semanticChangeAllowed: false,

  supported: ["comfortable", "compact", "dense"],
} as const;

// -----------------------------------------------------------------------------
// DENSITY-SENSITIVE GEOMETRY
// -----------------------------------------------------------------------------

export const DENSITY_SENSITIVE_GEOMETRY = [
  "control internal spacing",
  "peer-item spacing",
  "field spacing where explicitly supported",
  "control dimensions",
  "row dimensions",
  "compact icon/control relationships",
  "component-private geometry declared density-sensitive",
] as const;

export const DENSITY_INVARIANT_GEOMETRY = [
  "semantic section hierarchy",
  "semantic page hierarchy",
  "focus visibility",
  "required interaction targets",
  "structural pane meaning",
  "modal interaction priority",
] as const;

// -----------------------------------------------------------------------------
// DENSITY RULES
// -----------------------------------------------------------------------------

export const DENSITY_RULES = [
  {
    id: "AF-GEO-023",

    rule: "Density is a governed context and must not be recreated independently by individual screens.",
    strength: "must",
  },

  {
    id: "AF-GEO-024",

    rule: "Density changes selected geometry while preserving semantic component and token identities.",
    strength: "must",
  },

  {
    id: "AF-GEO-025",

    rule: "A component responds to density only when its Level-1 component contract declares density support.",
    strength: "must",
  },

  {
    id: "AF-GEO-026",

    rule: "Dense mode is not permission to hide labels, remove state, weaken focus, or make required content unavailable.",
    strength: "must",
  },

  {
    id: "AF-GEO-027",

    rule: "Dense mode must remain subordinate to the applicable accessibility target-size contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-028",

    rule: "Density must not alter colour semantics, typographic hierarchy, business state, or interaction meaning.",
    strength: "must",
  },

  {
    id: "AF-GEO-029",

    rule: "Dense mode is intended for specialised information-dense professional workflows rather than as the universal Afenda default.",
    strength: "should",
  },
] as const;

// =============================================================================
// INTERACTION TARGETS
// =============================================================================

// -----------------------------------------------------------------------------
// TARGET ROLES
// -----------------------------------------------------------------------------

/**
 * A target is the EFFECTIVE interactive area.
 *
 * It may be larger than the visible control.
 *
 * Example:
 *
 *     ┌───────────────────────┐
 *     │    effective target   │
 *     │       ┌──────┐        │
 *     │       │ icon │        │
 *     │       └──────┘        │
 *     └───────────────────────┘
 *
 * Accessibility owns actual minimum measurements.
 */
export const TARGET_ROLES = {
  compact: {
    purpose:
      "Smallest permitted governed target for components and environments where the accessibility contract explicitly permits compact interaction.",
    token: "af.sys.size.target.compact",
  },

  default: {
    purpose: "Default interaction target for general Afenda controls.",
    token: "af.sys.size.target.default",
  },

  prominent: {
    purpose:
      "Increased target for important, isolated, touch-oriented, or ergonomically demanding interaction.",
    token: "af.sys.size.target.prominent",
  },
} as const;

export type TargetRole = keyof typeof TARGET_ROLES;

// -----------------------------------------------------------------------------
// TARGET RULES
// -----------------------------------------------------------------------------

export const TARGET_RULES = [
  {
    id: "AF-GEO-030",

    rule: "Visual control size and effective interaction-target size are independent concepts.",
    strength: "must",
  },

  {
    id: "AF-GEO-031",

    rule: "A visually compact control may use a larger effective interaction target.",
    strength: "must",
  },

  {
    id: "AF-GEO-032",

    rule: "The accessibility language determines the applicable minimum interaction-target requirement.",
    strength: "must",
  },

  {
    id: "AF-GEO-033",

    rule: "Density must not bypass the applicable interaction-target requirement.",
    strength: "must",
  },

  {
    id: "AF-GEO-034",

    rule: "Overlapping effective interaction targets must not create ambiguous activation.",
    strength: "must",
  },

  {
    id: "AF-GEO-035",

    rule: "Frequently used and consequential actions should favour comfortable target geometry even in dense workspaces.",
    strength: "should",
  },
] as const;

// =============================================================================
// SHAPE
// =============================================================================

// -----------------------------------------------------------------------------
// SHAPE MODEL
// -----------------------------------------------------------------------------

/**
 * M3 provides a broad roundedness scale.
 *
 * Afenda deliberately exposes fewer SYSTEM semantics.
 *
 * Fine-grained component needs may resolve to reference shape tokens
 * through component-private tokens.
 */
export const SHAPE_ROLES = {
  brand: {
    purpose:
      "Optional tenant/product expression for explicitly brand-eligible presentation.",

    tenantCustomisable: true,
    token: "af.sys.shape.brand",
  },

  container: {
    purpose:
      "Default shape for grouped surfaces, cards, panels, and contained regions.",
    token: "af.sys.shape.container",
  },

  control: {
    purpose: "Default productive shape for interactive controls.",
    token: "af.sys.shape.control",
  },

  full: {
    purpose:
      "Fully rounded or circular geometry where component semantics require it.",
    token: "af.sys.shape.full",
  },
  none: {
    purpose: "No semantic rounding, used where square geometry is intentional.",
    token: "af.sys.shape.none",
  },

  overlay: {
    purpose:
      "Shape for temporary floating surfaces such as menus, popovers, and comparable overlays.",
    token: "af.sys.shape.overlay",
  },

  prominent: {
    purpose:
      "More expressive container shape reserved for deliberately prominent non-dense presentation.",
    token: "af.sys.shape.prominent",
  },
} as const;

export type ShapeRole = keyof typeof SHAPE_ROLES;

// -----------------------------------------------------------------------------
// SHAPE RULES
// -----------------------------------------------------------------------------

export const SHAPE_RULES = [
  {
    id: "AF-GEO-036",

    rule: "Shape is selected by component or containment purpose rather than by arbitrary radius preference.",
    strength: "must",
  },

  {
    id: "AF-GEO-037",

    rule: "Productive components use restrained shape roles.",
    strength: "must",
  },

  {
    id: "AF-GEO-038",

    rule: "Prominent or brand shape must not be introduced inside dense operational interfaces unless a component contract explicitly permits it.",
    strength: "must",
  },

  {
    id: "AF-GEO-039",

    rule: "Full shape is reserved for components whose geometry semantically requires pill or circular presentation.",
    strength: "must",
  },

  {
    id: "AF-GEO-040",

    rule: "Application code must not select arbitrary radius values for governed component semantics.",
    strength: "must",
  },

  {
    id: "AF-GEO-041",

    rule: "The number of visible shape families on one productive screen should remain small.",
    strength: "should",
  },

  {
    id: "AF-GEO-042",

    rule: "Shape changes associated with interaction state belong to the component and interaction contracts rather than becoming a global geometry context.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TENANT SHAPE POLICY
// -----------------------------------------------------------------------------

export const SHAPE_TENANT_POLICY = {
  customisable: ["brand"],
  default: "closed",

  principle:
    "Tenant expression may affect explicitly expressive presentation but may not reshape Afenda's productive interaction language.",

  protected: ["none", "control", "container", "overlay", "full"],
} as const;

// =============================================================================
// STROKE / BOUNDARY GEOMETRY
// =============================================================================

// -----------------------------------------------------------------------------
// STROKE ROLES
// -----------------------------------------------------------------------------

/**
 * These use the `size` token category because 01-tokens.ts intentionally
 * keeps the token taxonomy compact.
 *
 * Colour of the stroke is governed by 02-color.ts.
 */
export const STROKE_ROLES = {
  boundary: {
    purpose: "Normal visible component or region boundary.",
    token: "af.sys.size.stroke.boundary",
  },

  emphasis: {
    purpose:
      "Stronger boundary used when structure or state requires increased geometric emphasis.",
    token: "af.sys.size.stroke.emphasis",
  },

  focus: {
    purpose: "Geometric thickness of the governed visible focus indicator.",
    token: "af.sys.size.stroke.focus",
  },
  separator: {
    purpose:
      "Low-emphasis structural separator where geometry itself carries minimal importance.",
    token: "af.sys.size.stroke.separator",
  },
} as const;

export type StrokeRole = keyof typeof STROKE_ROLES;

// -----------------------------------------------------------------------------
// STROKE RULES
// -----------------------------------------------------------------------------

export const STROKE_RULES = [
  {
    id: "AF-GEO-043",

    rule: "Stroke thickness and stroke colour are separate semantic decisions.",
    strength: "must",
  },

  {
    id: "AF-GEO-044",

    rule: "A separator must not be promoted to a meaningful boundary merely by increasing its stroke strength.",
    strength: "must",
  },

  {
    id: "AF-GEO-045",

    rule: "Focus-stroke geometry remains subject to the accessibility focus-indicator contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-046",

    rule: "Dense interfaces should prefer containment, alignment, and spacing over excessive borders.",
    strength: "should",
  },
] as const;

// =============================================================================
// ICON GEOMETRY
// =============================================================================

// -----------------------------------------------------------------------------
// ICON ROLES
// -----------------------------------------------------------------------------

/**
 * These describe VISUAL icon size.
 *
 * They do not describe:
 *
 *   interaction target
 *   semantic importance
 *   icon meaning
 *
 * Icon meaning and accessible naming belong to component/accessibility
 * contracts.
 */
export const ICON_SIZE_ROLES = {
  compact: {
    purpose:
      "Small visual icon used in dense metadata, compact controls, or subordinate affordances.",
    token: "af.sys.size.icon.compact",
  },

  default: {
    purpose: "Standard visual icon size for ordinary controls and navigation.",
    token: "af.sys.size.icon.default",
  },

  display: {
    purpose:
      "Large non-dense iconography used in sparse communication, illustration-like states, or expressive presentation.",
    token: "af.sys.size.icon.display",
  },

  prominent: {
    purpose:
      "Larger visual icon for intentionally prominent controls or presentation.",
    token: "af.sys.size.icon.prominent",
  },
} as const;

export type IconSizeRole = keyof typeof ICON_SIZE_ROLES;

// -----------------------------------------------------------------------------
// ICON RULES
// -----------------------------------------------------------------------------

export const ICON_RULES = [
  {
    id: "AF-GEO-047",

    rule: "Icon visual size must not be assumed to equal the interaction-target size.",
    strength: "must",
  },

  {
    id: "AF-GEO-048",

    rule: "Components use icon roles admitted by their Level-1 component contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-049",

    rule: "Application code must not enlarge an icon solely to make its action more important; action hierarchy is semantic.",
    strength: "must",
  },

  {
    id: "AF-GEO-050",

    rule: "Icons aligned within the same control family should use consistent visual geometry.",
    strength: "should",
  },

  {
    id: "AF-GEO-051",

    rule: "Display iconography must not replace productive control iconography inside dense workflows.",
    strength: "must",
  },

  {
    id: "AF-GEO-052",

    rule: "Icon optical treatment belongs to Level 2 and must remain visually compatible across the supported icon set.",
    strength: "must",
  },
] as const;

// =============================================================================
// ELEVATION
// =============================================================================

// -----------------------------------------------------------------------------
// ELEVATION MODEL
// -----------------------------------------------------------------------------

/**
 * Elevation is visual depth.
 *
 * It may be depicted through:
 *
 *   - tonal surface differentiation
 *   - shadow
 *   - or an approved combination
 *
 * Colour owns tonal surface roles.
 * Geometry owns the depth semantic.
 *
 * Elevation is NOT z-index.
 */
export const ELEVATION_ROLES = {
  flat: {
    purpose: "No perceived visual separation from its containing surface.",
    token: "af.sys.elevation.flat",
  },

  floating: {
    purpose:
      "Temporary surface visually separated from the normal workspace, such as menu or popover presentation.",
    token: "af.sys.elevation.floating",
  },

  modal: {
    purpose:
      "Strong temporary depth relationship for modal interaction requiring separation from the background task.",
    token: "af.sys.elevation.modal",
  },

  raised: {
    purpose:
      "Subtle visual separation for a surface that should read as distinct while remaining part of the workspace.",
    token: "af.sys.elevation.raised",
  },
} as const;

export type ElevationRole = keyof typeof ELEVATION_ROLES;

// -----------------------------------------------------------------------------
// ELEVATION DEPICTION
// -----------------------------------------------------------------------------

export const ELEVATION_DEPICTION = [
  "tonal",
  "shadow",
  "tonal-and-shadow",
] as const;

export type ElevationDepiction = (typeof ELEVATION_DEPICTION)[number];

// -----------------------------------------------------------------------------
// ELEVATION RULES
// -----------------------------------------------------------------------------

export const ELEVATION_RULES = [
  {
    id: "AF-GEO-053",

    rule: "Elevation expresses visual depth and must not determine stacking order.",
    strength: "must",
  },

  {
    id: "AF-GEO-054",

    rule: "Surface colour hierarchy and visual elevation may cooperate but remain separate semantic systems.",
    strength: "must",
  },

  {
    id: "AF-GEO-055",

    rule: "Productive Afenda interfaces prefer tonal containment and restrained elevation over heavy shadow decoration.",
    strength: "should",
  },

  {
    id: "AF-GEO-056",

    rule: "Floating elevation is reserved for genuinely temporary or visually detached surfaces.",
    strength: "must",
  },

  {
    id: "AF-GEO-057",

    rule: "Modal elevation does not itself create modal interaction semantics.",
    strength: "must",
  },

  {
    id: "AF-GEO-058",

    rule: "Interaction-state elevation changes are governed by the owning component contract and 07-interaction.ts.",
    strength: "must",
  },

  {
    id: "AF-GEO-059",

    rule: "Application code must not choose raw shadow utilities as a substitute for governed elevation semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// STACKING LAYERS
// =============================================================================

// -----------------------------------------------------------------------------
// LAYER ROLES
// -----------------------------------------------------------------------------

/**
 * Layers form an ORDERING CONTRACT.
 *
 * Actual z-index values belong to Level 2.
 *
 * Logical order:
 *
 *   base
 *     ↓
 *   sticky
 *     ↓
 *   dropdown
 *     ↓
 *   popover
 *     ↓
 *   overlay
 *     ↓
 *   modal
 *     ↓
 *   toast
 *     ↓
 *   tooltip
 *
 * A higher layer is not necessarily visually more elevated.
 */
export const LAYER_ROLES = {
  base: {
    purpose:
      "Normal application content and non-overlapping workspace elements.",
    token: "af.sys.layer.base",
  },

  dropdown: {
    purpose:
      "Dropdown surfaces that must overlap surrounding application content.",
    token: "af.sys.layer.dropdown",
  },

  modal: {
    purpose:
      "Interaction-blocking modal content above the normal application task.",
    token: "af.sys.layer.modal",
  },

  overlay: {
    purpose:
      "Supporting overlay surfaces such as sheets or other temporary workspace layers.",
    token: "af.sys.layer.overlay",
  },

  popover: {
    purpose:
      "Anchored transient content requiring overlap above ordinary menus and content where necessary.",
    token: "af.sys.layer.popover",
  },

  sticky: {
    purpose:
      "Content that remains positioned relative to scrolling while staying within normal task context.",
    token: "af.sys.layer.sticky",
  },

  toast: {
    purpose:
      "Transient application feedback that must remain visible above ordinary workspace overlays.",
    token: "af.sys.layer.toast",
  },

  tooltip: {
    purpose:
      "Ephemeral explanatory content associated with the current interaction target.",
    token: "af.sys.layer.tooltip",
  },
} as const;

export type LayerRole = keyof typeof LAYER_ROLES;

// -----------------------------------------------------------------------------
// LAYER ORDER
// -----------------------------------------------------------------------------

export const LAYER_ORDER = [
  "base",
  "sticky",
  "dropdown",
  "popover",
  "overlay",
  "modal",
  "toast",
  "tooltip",
] as const satisfies readonly LayerRole[];

// -----------------------------------------------------------------------------
// LAYER RULES
// -----------------------------------------------------------------------------

export const LAYER_RULES = [
  {
    id: "AF-GEO-060",

    rule: "Stacking uses named layer roles rather than arbitrary application-level z-index values.",
    strength: "must",
  },

  {
    id: "AF-GEO-061",

    rule: "Layer order expresses overlap priority rather than visual importance.",
    strength: "must",
  },

  {
    id: "AF-GEO-062",

    rule: "A component must not raise itself above another layer merely to repair an accidental stacking-context implementation problem.",
    strength: "must",
  },

  {
    id: "AF-GEO-063",

    rule: "Creating a new global layer role requires a distinct overlap or interaction responsibility not represented by the existing layer taxonomy.",
    strength: "must",
  },

  {
    id: "AF-GEO-064",

    rule: "Modal interaction semantics and modal layer placement must agree but remain separate contracts.",
    strength: "must",
  },

  {
    id: "AF-GEO-065",

    rule: "Tooltip placement at the highest ordinary explanatory layer does not grant tooltip content modal or persistent interaction semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// GEOMETRY RELATIONSHIPS
// =============================================================================

// -----------------------------------------------------------------------------
// ELEVATION VS LAYER
// -----------------------------------------------------------------------------

export const ELEVATION_LAYER_RELATIONSHIP = {
  coupled: false,
  elevation: "visual depth",

  examples: [
    {
      case: "sticky-table-header",
      elevation: "flat-or-raised",
      layer: "sticky",
    },

    {
      case: "menu",
      elevation: "floating",
      layer: "dropdown",
    },

    {
      case: "dialog",
      elevation: "modal",
      layer: "modal",
    },

    {
      case: "tooltip",
      elevation: "floating",
      layer: "tooltip",
    },
  ],

  layer: "overlap priority",
} as const;

// -----------------------------------------------------------------------------
// SIZE VS TARGET
// -----------------------------------------------------------------------------

export const SIZE_TARGET_RELATIONSHIP = {
  componentSize: "visible physical geometry",

  coupled: false,

  principle:
    "A component may become visually more compact while retaining a larger effective target.",

  targetSize: "effective interactive geometry",
} as const;

// -----------------------------------------------------------------------------
// DENSITY VS LAYOUT
// -----------------------------------------------------------------------------

export const DENSITY_LAYOUT_RELATIONSHIP = {
  coupled: false,
  density: "component and information compression",

  layout: "composition and adaptation",

  principle: "Density must not substitute for responsive or adaptive layout.",
} as const;

// =============================================================================
// CONTEXTS
// =============================================================================

export const GEOMETRY_CONTEXT_POLICY = {
  contrast: {
    note: "Accessibility may require stronger visible boundaries or focus representation without changing the underlying geometry semantic identity.",
    relevant: false,
  },
  density: {
    mayChange: [
      "declared density-sensitive spacing",
      "declared density-sensitive dimensions",
      "declared density-sensitive component geometry",
    ],

    mustPreserve: [
      "semantic role",
      "required target accessibility",
      "layer meaning",
      "shape meaning",
    ],
    relevant: true,
  },

  direction: {
    mayChange: ["logical directional spacing", "directional geometry"],

    mustPreserve: [
      "physical quantity semantics",
      "non-directional shape meaning",
      "layer order",
      "elevation meaning",
    ],
    relevant: true,
  },

  tenant: {
    mayChange: ["brand shape where explicitly permitted"],

    mustPreserve: [
      "productive control geometry",
      "density semantics",
      "target accessibility",
      "layer order",
      "elevation semantics",
    ],
    relevant: true,
  },

  theme: {
    note: "Theme may alter visual colour depiction of depth but does not redefine geometry roles.",
    relevant: false,
  },
} as const;

// =============================================================================
// TENANT POLICY
// =============================================================================

export const GEOMETRY_TENANT_POLICY = {
  customisable: ["brand-shape"],
  default: "closed",

  principle:
    "Tenant expression may decorate explicitly expressive geometry but may not redefine the physical behaviour of the Afenda workspace.",

  protected: [
    "productive spacing",
    "control sizes",
    "interaction targets",
    "density modes",
    "productive shapes",
    "icon geometry",
    "stroke semantics",
    "elevation semantics",
    "layer ordering",
  ],
} as const;

// =============================================================================
// ACCESSIBILITY RELATIONSHIP
// =============================================================================

/**
 * 08-accessibility.ts owns numeric thresholds.
 *
 * Geometry owns the semantic objects to which those requirements apply.
 */
export const GEOMETRY_ACCESSIBILITY_REQUIREMENTS = [
  "target-size",
  "target-spacing",
  "focus-indicator-geometry",
  "text-reflow",
  "zoom-resilience",
  "drag-alternative",
  "pointer-operability",
] as const;

export const GEOMETRY_ACCESSIBILITY_RULES = [
  {
    id: "AF-GEO-066",

    rule: "Geometry must not obstruct content or function when text and interface content grow under supported accessibility settings.",
    strength: "must",
  },

  {
    id: "AF-GEO-067",

    rule: "Effective interaction targets satisfy the applicable accessibility contract independently from visual icon or control size.",
    strength: "must",
  },

  {
    id: "AF-GEO-068",

    rule: "Focus-indicator geometry must remain visible and unobscured according to the accessibility contract.",
    strength: "must",
  },

  {
    id: "AF-GEO-069",

    rule: "Compact or dense geometry must not create overlapping or ambiguous interactive targets.",
    strength: "must",
  },

  {
    id: "AF-GEO-070",

    rule: "Resizable or draggable geometry must have accessible non-drag alternatives where required by the accessibility contract.",
    strength: "must",
  },
] as const;

// =============================================================================
// PUBLIC SYSTEM API
// =============================================================================

export const GEOMETRY_PUBLIC_API = {
  density: ["comfortable", "compact", "dense"],

  elevation: ["flat", "raised", "floating", "modal"],

  icon: ["compact", "default", "prominent", "display"],

  layer: [
    "base",
    "sticky",
    "dropdown",
    "popover",
    "overlay",
    "modal",
    "toast",
    "tooltip",
  ],

  shape: [
    "none",
    "control",
    "container",
    "overlay",
    "prominent",
    "full",
    "brand",
  ],

  size: ["compact", "default", "large"],
  space: [
    "inline-tight",
    "inline",
    "control",
    "item",
    "field",
    "group",
    "section",
    "pane",
    "page",
  ],

  stroke: ["separator", "boundary", "emphasis", "focus"],

  target: ["compact", "default", "prominent"],
} as const;

// =============================================================================
// SYSTEM TOKEN IDENTITIES
// =============================================================================

export const GEOMETRY_SYSTEM_TOKENS = {
  elevation: {
    flat: "af.sys.elevation.flat",

    floating: "af.sys.elevation.floating",

    modal: "af.sys.elevation.modal",

    raised: "af.sys.elevation.raised",
  },

  icon: {
    compact: "af.sys.size.icon.compact",

    default: "af.sys.size.icon.default",

    display: "af.sys.size.icon.display",

    prominent: "af.sys.size.icon.prominent",
  },

  layer: {
    base: "af.sys.layer.base",

    dropdown: "af.sys.layer.dropdown",

    modal: "af.sys.layer.modal",

    overlay: "af.sys.layer.overlay",

    popover: "af.sys.layer.popover",

    sticky: "af.sys.layer.sticky",

    toast: "af.sys.layer.toast",

    tooltip: "af.sys.layer.tooltip",
  },

  shape: {
    brand: "af.sys.shape.brand",

    container: "af.sys.shape.container",

    control: "af.sys.shape.control",

    full: "af.sys.shape.full",
    none: "af.sys.shape.none",

    overlay: "af.sys.shape.overlay",

    prominent: "af.sys.shape.prominent",
  },
  space: {
    control: "af.sys.space.control",

    field: "af.sys.space.field",

    group: "af.sys.space.group",

    inline: "af.sys.space.inline",
    "inline-tight": "af.sys.space.inline-tight",

    item: "af.sys.space.item",

    page: "af.sys.space.page",

    pane: "af.sys.space.pane",

    section: "af.sys.space.section",
  },

  stroke: {
    boundary: "af.sys.size.stroke.boundary",

    emphasis: "af.sys.size.stroke.emphasis",

    focus: "af.sys.size.stroke.focus",
    separator: "af.sys.size.stroke.separator",
  },

  target: {
    compact: "af.sys.size.target.compact",

    default: "af.sys.size.target.default",

    prominent: "af.sys.size.target.prominent",
  },
} as const;

// =============================================================================
// TOKEN CONTRACT
// =============================================================================

export interface GeometryTokenDefinition extends SystemTokenDefinition {
  readonly category: "space" | "size" | "shape" | "elevation" | "layer";

  readonly densitySensitive?: boolean;

  readonly geometryDomain: GeometryDomain;

  readonly tenantCustomisable?: boolean;
  readonly tier: "system";
}

// =============================================================================
// FORBIDDEN USAGE
// =============================================================================

export const GEOMETRY_FORBIDS = [
  {
    behaviour:
      "application code uses arbitrary governed spacing values where a semantic spacing role exists",
    id: "AF-GEO-071",
    strength: "must",
  },

  {
    behaviour:
      "application code introduces arbitrary border radius for governed component shape",
    id: "AF-GEO-072",
    strength: "must",
  },

  {
    behaviour:
      "application code selects raw shadow strength instead of an elevation role",
    id: "AF-GEO-073",
    strength: "must",
  },

  {
    behaviour:
      "application code introduces arbitrary z-index values instead of a governed layer role",
    id: "AF-GEO-074",
    strength: "must",
  },

  {
    behaviour:
      "visual icon size is treated as proof that the corresponding interaction target is accessible",
    id: "AF-GEO-075",
    strength: "must",
  },

  {
    behaviour:
      "dense mode bypasses target, focus, text, or content accessibility requirements",
    id: "AF-GEO-076",
    strength: "must",
  },

  {
    behaviour:
      "surface-container colour level is treated as equivalent to elevation or stacking layer",
    id: "AF-GEO-077",
    strength: "must",
  },

  {
    behaviour:
      "component size is used as the sole indicator of semantic importance",
    id: "AF-GEO-078",
    strength: "must",
  },

  {
    behaviour:
      "tenant configuration directly overrides productive component spacing, targets, layers, or interaction geometry",
    id: "AF-GEO-079",
    strength: "must",
  },

  {
    behaviour:
      "layout problems are solved by introducing new arbitrary geometry values instead of using the layout language",
    id: "AF-GEO-080",
    strength: "must",
  },

  {
    behaviour:
      "a new global geometry token is created merely because a one-off component measurement exists",
    id: "AF-GEO-081",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const GEOMETRY_SOURCES = [
  {
    adaptation:
      "Afenda keeps a Level-2 reference spacing scale but exposes semantic relationship roles rather than Material spacing-step names to application code.",

    contribution: [
      "spacing as a systematic scale",
      "spacing for proximity and grouping",
      "gap, margin, and padding vocabulary",
    ],

    disposition: "adapt",
    id: "m3-spacing",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda supports comfortable, compact, and specialised dense product modes while delegating numeric interaction-target requirements to its web accessibility contract.",

    contribution: [
      "separation of component scaling and information density",
      "density as a user/product presentation capability",
      "minimum interaction-target discipline",
    ],

    disposition: "adapt",
    id: "m3-density",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda collapses the broad Material roundedness ladder into a small productive semantic shape vocabulary and a separately governed brand role.",

    contribution: [
      "shape as semantic component language",
      "shape-scale discipline",
      "full and non-rounded shape concepts",
      "shape as state and expression capability",
    ],

    disposition: "adapt",
    id: "m3-shape",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda defines semantic visual icon roles independent of Material Symbols and does not adopt Material Symbols variable-font axes as design-language requirements.",

    contribution: [
      "standardised icon geometry",
      "separation of icon visual size from surrounding target geometry",
    ],

    disposition: "adapt",
    id: "m3-icon",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda reduces Material's physical elevation ladder to four semantic depth roles and introduces a completely separate web stacking-layer system.",

    contribution: [
      "elevation as visual depth",
      "tonal elevation",
      "shadow elevation",
      "restrained depth hierarchy",
    ],

    disposition: "adapt",
    id: "m3-elevation",

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

export const GEOMETRY_SOURCE_DISPOSITION = {
  "afenda-layer-system": "adapt",

  "afenda-product-density": "adapt",

  // Afenda

  "afenda-semantic-spacing": "adapt",

  "m3-density-user-preference": "adopt",

  "m3-eight-dp-base": "adapt",

  "m3-expressive-shape": "adapt",

  "m3-full-shape-scale-as-public-api": "reject",

  "m3-gap-margin-padding-vocabulary": "adapt",

  "m3-icon-target-separation": "adopt",

  // M3 density

  "m3-information-vs-component-density": "adopt",

  "m3-material-symbol-font-axes": "reject",

  "m3-shadow-elevation": "adapt",

  // M3 shape

  "m3-shape-as-semantic-language": "adopt",

  "m3-shape-morph": "defer",

  "m3-six-level-elevation-as-public-api": "reject",

  "m3-spacing-token-names": "reject",

  // M3 icons

  "m3-standardised-icon-geometry": "adopt",
  // M3 spacing

  "m3-systematic-spacing": "adopt",

  // M3 elevation

  "m3-tonal-elevation": "adapt",

  "m3-universal-48dp-product-rule": "adapt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const GEOMETRY_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-GEO-082",

    obligation:
      "Every active geometry system role has a deterministic Level-2 resolution.",
    strength: "must",
  },

  {
    id: "AF-GEO-083",

    obligation:
      "Level 2 provides an ordered reference spacing scale from which governed system and component spacing may resolve.",
    strength: "must",
  },

  {
    id: "AF-GEO-084",

    obligation:
      "Level 2 implements all supported density contexts without changing semantic role identity.",
    strength: "must",
  },

  {
    id: "AF-GEO-085",

    obligation:
      "Level 2 represents effective interaction-target geometry independently from visible icon or control geometry where required.",
    strength: "must",
  },

  {
    id: "AF-GEO-086",

    obligation:
      "Level 2 implements productive shape roles without requiring application code to know physical radius values.",
    strength: "must",
  },

  {
    id: "AF-GEO-087",

    obligation:
      "Level 2 implements visual elevation independently from stacking-layer order.",
    strength: "must",
  },

  {
    id: "AF-GEO-088",

    obligation:
      "Level 2 provides one deterministic stacking value for every active global layer role.",
    strength: "must",
  },

  {
    id: "AF-GEO-089",

    obligation:
      "Directional spacing resolves through logical rather than physical direction.",
    strength: "must",
  },

  {
    id: "AF-GEO-090",

    obligation:
      "Tenant geometry resolution affects only roles explicitly declared tenant-customisable.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const GEOMETRY_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-GEO-091",

    prove: "all active geometry system roles resolve",
  },

  {
    id: "AF-GEO-092",

    prove:
      "application code does not consume arbitrary spacing values where governed semantic roles exist",
  },

  {
    id: "AF-GEO-093",

    prove: "application code does not introduce arbitrary governed radii",
  },

  {
    id: "AF-GEO-094",

    prove: "application code does not introduce unregistered stacking values",
  },

  {
    id: "AF-GEO-095",

    prove: "global layer values preserve the declared layer order",
  },

  {
    id: "AF-GEO-096",

    prove:
      "visual elevation values do not determine or alias stacking-layer values",
  },

  {
    id: "AF-GEO-097",

    prove: "density modifies only geometry declared density-sensitive",
  },

  {
    id: "AF-GEO-098",

    prove:
      "components declaring density support resolve all supported density modes",
  },

  {
    id: "AF-GEO-099",

    prove:
      "effective interaction targets satisfy the applicable accessibility contract",
  },

  {
    id: "AF-GEO-100",

    prove:
      "icon visual-size conformance is evaluated independently from interaction-target conformance",
  },

  {
    id: "AF-GEO-101",

    prove: "tenant configuration cannot override protected productive geometry",
  },

  {
    id: "AF-GEO-102",

    prove: "directional spacing uses logical-direction semantics",
  },

  {
    id: "AF-GEO-103",

    prove:
      "component APIs expose only geometry capabilities admitted by their Level-1 contracts",
  },

  {
    id: "AF-GEO-104",

    prove:
      "new raw geometry values do not silently become repeated local design-system conventions",
  },
] as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const GEOMETRY_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "raw-geometry-validated",
    "density-validated",
    "target-validated",
    "layer-order-validated",
    "tenant-validated",
    "direction-validated",
  ],

  implementation: [
    "geometry-resolved",
    "density-resolved",
    "target-resolved",
    "shape-resolved",
    "elevation-resolved",
    "layer-resolved",
  ],
  language: [
    "spacing-semantics-defined",
    "size-intent-defined",
    "density-defined",
    "target-semantics-defined",
    "shape-defined",
    "stroke-defined",
    "icon-geometry-defined",
    "elevation-defined",
    "layer-order-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type GeometryPublicApi = typeof GEOMETRY_PUBLIC_API;

export type GeometrySystemTokens = typeof GEOMETRY_SYSTEM_TOKENS;

export type ElevationDepictionMode = (typeof ELEVATION_DEPICTION)[number];

export type GeometrySourceDisposition =
  (typeof GEOMETRY_SOURCE_DISPOSITION)[keyof typeof GEOMETRY_SOURCE_DISPOSITION];
