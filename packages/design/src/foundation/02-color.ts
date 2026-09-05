/**
 * AFENDA DESIGN LANGUAGE — COLOR
 *
 * L1.02
 *
 * Defines the semantic colour language of Afenda.
 *
 * This file defines:
 *
 *   - colour principles
 *   - colour-role taxonomy
 *   - accent families
 *   - container / on-container relationships
 *   - surface hierarchy
 *   - inverse roles
 *   - fixed roles
 *   - structural roles
 *   - enterprise status roles
 *   - analytical / data roles
 *   - theme behaviour
 *   - contrast behaviour
 *   - tenant customisation boundaries
 *   - accessibility invariants
 *   - public colour API
 *   - M3 source disposition
 *
 * It deliberately defines NO colour values.
 *
 * No:
 *   - hex
 *   - RGB
 *   - HSL
 *   - HCT values
 *   - OKLCH values
 *   - CSS variables
 *   - Tailwind classes
 *   - palette-generation algorithms
 *
 * Those belong to Level 2 / Level 3.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-002 Role before value
 *   AF-PRI-003 Hierarchy before decoration
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

export const COLOR_LANGUAGE = {
  code: "COL",
  id: "color",
  level: 1,
  order: 2,

  philosophy:
    "Afenda uses colour primarily to communicate structure, meaning, state, and hierarchy; not to decorate the interface.",

  purpose:
    "Define stable semantic colour roles for enterprise work, interaction, status, surfaces, branding, and analytical information.",
  version: "1.0.0",
} as const;

// -----------------------------------------------------------------------------
// PRINCIPLES
// -----------------------------------------------------------------------------

export const COLOR_PRINCIPLES = [
  {
    id: "AF-COL-001",

    statement:
      "Colour is consumed by semantic role rather than by hue, tone, palette position, or literal value.",
    strength: "must",
  },

  {
    id: "AF-COL-002",

    statement:
      "A container role and its intended content role form a semantic pair.",
    strength: "must",
  },

  {
    id: "AF-COL-003",

    statement:
      "Surfaces establish the primary visual hierarchy of the Afenda workspace; accent colour is used selectively.",
    strength: "must",
  },

  {
    id: "AF-COL-004",

    statement:
      "Colour must not be the sole carrier of consequential information.",
    strength: "must",
  },

  {
    id: "AF-COL-005",

    statement:
      "A semantic colour role retains the same meaning across light, dark, contrast, and tenant contexts.",
    strength: "must",
  },

  {
    id: "AF-COL-006",

    statement:
      "Business status, validation state, interaction state, and analytical meaning are separate semantic concepts even when they currently resolve to similar colours.",
    strength: "must",
  },

  {
    id: "AF-COL-007",

    statement:
      "Tenant expression may influence permitted accent roles but cannot redefine status, validation, accessibility, or analytical meaning.",
    strength: "must",
  },

  {
    id: "AF-COL-008",

    statement:
      "The number of available colour roles does not justify using more colours in a screen.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// -----------------------------------------------------------------------------
// HIGH-LEVEL TAXONOMY
// -----------------------------------------------------------------------------

export const COLOR_DOMAINS = {
  accent: {
    purpose: "Product emphasis, actions, selection, and controlled expression.",
  },

  content: {
    purpose:
      "Text, icons, and other foreground information placed on surfaces.",
  },

  data: {
    purpose:
      "Analytical distinction in charts, metrics, forecasts, comparisons, and visualisations.",
  },

  status: {
    purpose:
      "Stable enterprise meaning such as positive, negative, warning, and informative state.",
  },

  structure: {
    purpose:
      "Boundaries, separators, focus-supporting geometry, and obscuring layers.",
  },

  surface: {
    purpose:
      "Workspace backgrounds, containers, layers, and containment hierarchy.",
  },
} as const;

export type ColorDomain = keyof typeof COLOR_DOMAINS;

// -----------------------------------------------------------------------------
// ACCENT FAMILIES
// -----------------------------------------------------------------------------

/**
 * M3's primary / secondary / tertiary model is adopted.
 *
 * These are prominence and expression families.
 *
 * They are NOT:
 *
 *   primary = success
 *   secondary = warning
 *   tertiary = error
 *
 * Status semantics are defined separately.
 */
export const ACCENT_FAMILIES = {
  primary: {
    frequency: "selective",
    purpose:
      "Highest product accent emphasis for important actions, active emphasis, and strong identity.",

    tenantCustomisable: true,
  },

  secondary: {
    frequency: "limited",
    purpose:
      "Supporting accent used where distinction is needed without competing with primary emphasis.",

    tenantCustomisable: true,
  },

  tertiary: {
    frequency: "rare",
    purpose:
      "Contrasting accent for deliberate differentiation or heightened attention where primary and secondary are insufficient.",

    tenantCustomisable: true,
  },
} as const;

export type AccentFamily = keyof typeof ACCENT_FAMILIES;

// -----------------------------------------------------------------------------
// ACCENT ROLE PATTERN
// -----------------------------------------------------------------------------

/**
 * Every accent family has the same four-role semantic shape.
 *
 * FAMILY
 * ├── base
 * ├── on-base
 * ├── container
 * └── on-container
 *
 * Afenda keeps the M3 relationship even if Level 2 exposes different
 * generated property syntax.
 */
export const ACCENT_ROLE_PATTERN = [
  "base",
  "on-base",
  "container",
  "on-container",
] as const;

export type AccentRoleKind = (typeof ACCENT_ROLE_PATTERN)[number];

// -----------------------------------------------------------------------------
// PRIMARY ROLES
// -----------------------------------------------------------------------------

export const PRIMARY_ROLES = {
  "on-primary": {
    background: "primary",

    domain: "content",

    purpose: "Content displayed directly on primary.",

    tenantCustomisable: true,
    token: "af.sys.color.on-primary",
  },

  "on-primary-container": {
    background: "primary-container",

    domain: "content",

    purpose: "Content displayed directly on primary-container.",

    tenantCustomisable: true,
    token: "af.sys.color.on-primary-container",
  },
  primary: {
    domain: "accent",

    foreground: "on-primary",

    purpose:
      "Highest-emphasis accent used for important interactive and active elements.",

    tenantCustomisable: true,
    token: "af.sys.color.primary",
  },

  "primary-container": {
    domain: "accent",

    foreground: "on-primary-container",

    purpose:
      "Tonal primary container used when primary meaning is required with lower visual intensity.",

    tenantCustomisable: true,
    token: "af.sys.color.primary-container",
  },
} as const;

// -----------------------------------------------------------------------------
// SECONDARY ROLES
// -----------------------------------------------------------------------------

export const SECONDARY_ROLES = {
  "on-secondary": {
    background: "secondary",

    domain: "content",

    purpose: "Content displayed directly on secondary.",

    tenantCustomisable: true,
    token: "af.sys.color.on-secondary",
  },

  "on-secondary-container": {
    background: "secondary-container",

    domain: "content",

    purpose: "Content displayed directly on secondary-container.",

    tenantCustomisable: true,
    token: "af.sys.color.on-secondary-container",
  },
  secondary: {
    domain: "accent",

    foreground: "on-secondary",

    purpose:
      "Supporting accent for differentiation with less prominence than primary.",

    tenantCustomisable: true,
    token: "af.sys.color.secondary",
  },

  "secondary-container": {
    domain: "accent",

    foreground: "on-secondary-container",

    purpose: "Lower-intensity secondary container.",

    tenantCustomisable: true,
    token: "af.sys.color.secondary-container",
  },
} as const;

// -----------------------------------------------------------------------------
// TERTIARY ROLES
// -----------------------------------------------------------------------------

export const TERTIARY_ROLES = {
  "on-tertiary": {
    background: "tertiary",

    domain: "content",

    purpose: "Content displayed directly on tertiary.",

    tenantCustomisable: true,
    token: "af.sys.color.on-tertiary",
  },

  "on-tertiary-container": {
    background: "tertiary-container",

    domain: "content",

    purpose: "Content displayed directly on tertiary-container.",

    tenantCustomisable: true,
    token: "af.sys.color.on-tertiary-container",
  },
  tertiary: {
    domain: "accent",

    foreground: "on-tertiary",

    purpose:
      "Contrasting accent for deliberate differentiation and rare heightened attention.",

    tenantCustomisable: true,
    token: "af.sys.color.tertiary",
  },

  "tertiary-container": {
    domain: "accent",

    foreground: "on-tertiary-container",

    purpose: "Lower-intensity tertiary container.",

    tenantCustomisable: true,
    token: "af.sys.color.tertiary-container",
  },
} as const;

// -----------------------------------------------------------------------------
// ERROR / VALIDATION FAMILY
// -----------------------------------------------------------------------------

/**
 * Error is retained from M3 but narrowed semantically.
 *
 * ERROR means:
 *
 *   invalid
 *   failed
 *   destructive
 *   unrecoverable / corrective attention
 *
 * It does NOT mean:
 *
 *   financially negative
 *   decreased
 *   rejected workflow
 *   overdue by itself
 *   low performance
 *
 * Those are product/status semantics.
 */
export const ERROR_ROLES = {
  error: {
    domain: "status",

    foreground: "on-error",

    purpose:
      "Validation failure, destructive action, failed operation, or error requiring corrective attention.",

    tenantCustomisable: false,
    token: "af.sys.color.error",
  },

  "error-container": {
    domain: "status",

    foreground: "on-error-container",

    purpose:
      "Lower-intensity container communicating error or destructive meaning.",

    tenantCustomisable: false,
    token: "af.sys.color.error-container",
  },

  "on-error": {
    background: "error",

    domain: "content",

    purpose: "Content displayed directly on error.",

    tenantCustomisable: false,
    token: "af.sys.color.on-error",
  },

  "on-error-container": {
    background: "error-container",

    domain: "content",

    purpose: "Content displayed directly on error-container.",

    tenantCustomisable: false,
    token: "af.sys.color.on-error-container",
  },
} as const;

// -----------------------------------------------------------------------------
// SURFACE SYSTEM
// -----------------------------------------------------------------------------

/**
 * The M3 surface-container ladder is adopted as a major Afenda foundation.
 *
 * IMPORTANT:
 *
 * These roles represent CONTAINMENT EMPHASIS.
 *
 * They are not:
 *
 *   z-index
 *   DOM nesting
 *   shadow strength
 *   interaction state
 *
 * Higher does not automatically mean "physically above".
 */
export const SURFACE_ROLES = {
  surface: {
    foreground: "on-surface",

    purpose: "Default workspace surface and canonical neutral background.",
    token: "af.sys.color.surface",
  },

  "surface-bright": {
    purpose:
      "Deliberately brighter surface used where stable tonal differentiation is required.",
    token: "af.sys.color.surface-bright",
  },

  "surface-container": {
    purpose:
      "Default contained surface for panels, cards, grouped regions, and workspace structures.",
    token: "af.sys.color.surface-container",
  },

  "surface-container-high": {
    purpose: "Higher-emphasis contained surface.",
    token: "af.sys.color.surface-container-high",
  },

  "surface-container-highest": {
    purpose: "Highest-emphasis neutral contained surface.",
    token: "af.sys.color.surface-container-highest",
  },

  "surface-container-low": {
    purpose: "Low-emphasis contained surface.",
    token: "af.sys.color.surface-container-low",
  },

  "surface-container-lowest": {
    purpose: "Lowest-emphasis contained surface.",
    token: "af.sys.color.surface-container-lowest",
  },

  "surface-dim": {
    purpose:
      "Deliberately dimmer surface used where stable tonal differentiation is required.",
    token: "af.sys.color.surface-dim",
  },
} as const;

export type SurfaceRole = keyof typeof SURFACE_ROLES;

// -----------------------------------------------------------------------------
// SURFACE CONTENT
// -----------------------------------------------------------------------------

export const SURFACE_CONTENT_ROLES = {
  "on-surface": {
    emphasis: "primary",

    purpose:
      "Primary text, icons, and information on surfaces and surface containers.",
    token: "af.sys.color.on-surface",
  },

  "on-surface-variant": {
    emphasis: "secondary",

    purpose:
      "Lower-emphasis supporting text, icons, metadata, and secondary information on surfaces.",
    token: "af.sys.color.on-surface-variant",
  },
} as const;

// -----------------------------------------------------------------------------
// SURFACE HIERARCHY
// -----------------------------------------------------------------------------

export const SURFACE_CONTAINER_ORDER = [
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
] as const;

export const SURFACE_RULES = [
  {
    id: "AF-COL-009",

    rule: "Surface-container roles communicate containment emphasis rather than elevation height.",
    strength: "must",
  },

  {
    id: "AF-COL-010",

    rule: "Surface hierarchy is preferred over excessive accent colour for structuring dense enterprise screens.",
    strength: "must",
  },

  {
    id: "AF-COL-011",

    rule: "A component must not assume that a numerically or visually stronger surface implies a higher stacking layer.",
    strength: "must",
  },

  {
    id: "AF-COL-012",

    rule: "Most Afenda workspace area should remain within the surface family rather than accent families.",
    strength: "should",
  },

  {
    id: "AF-COL-013",

    rule: "Adjacent surface levels should be used only where containment distinction improves comprehension.",
    strength: "should",
  },

  {
    id: "AF-COL-014",

    rule: "Surface containers use on-surface or on-surface-variant content unless a component contract declares another valid pair.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// INVERSE ROLES
// -----------------------------------------------------------------------------

export const INVERSE_ROLES = {
  "inverse-on-surface": {
    background: "inverse-surface",

    purpose: "Content displayed directly on inverse-surface.",
    token: "af.sys.color.inverse-on-surface",
  },

  "inverse-primary": {
    purpose: "Primary action/accent used within inverse presentation.",
    token: "af.sys.color.inverse-primary",
  },
  "inverse-surface": {
    foreground: "inverse-on-surface",

    purpose:
      "Contrasting surface used for temporary or deliberately inverted presentation.",
    token: "af.sys.color.inverse-surface",
  },
} as const;

export const INVERSE_RULES = [
  {
    id: "AF-COL-015",

    rule: "Inverse roles represent intentional local inversion and are not aliases for dark theme.",
    strength: "must",
  },

  {
    id: "AF-COL-016",

    rule: "Inverse roles are reserved for temporary, floating, notification, or strongly contrasting presentation.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// STRUCTURAL ROLES
// -----------------------------------------------------------------------------

export const STRUCTURAL_ROLES = {
  outline: {
    purpose:
      "Meaningful boundaries whose visibility contributes to interaction or structure.",

    tenantCustomisable: false,
    token: "af.sys.color.outline",
  },

  "outline-variant": {
    purpose: "Lower-emphasis decorative boundaries and separators.",

    tenantCustomisable: false,
    token: "af.sys.color.outline-variant",
  },

  scrim: {
    purpose:
      "Obscuring layer used to reduce background prominence behind modal or transient content.",

    tenantCustomisable: false,
    token: "af.sys.color.scrim",
  },
} as const;

// -----------------------------------------------------------------------------
// FIXED ACCENT ROLES
// -----------------------------------------------------------------------------

/**
 * Fixed roles preserve tonal behaviour across light and dark themes.
 *
 * They are intentionally NOT the default accent roles.
 *
 * Afenda uses them only when theme-invariant accent presentation has a
 * semantic reason.
 */
export const FIXED_ACCENT_ROLES = {
  primary: {
    fixed: "primary-fixed",
    fixedDim: "primary-fixed-dim",
    onFixed: "on-primary-fixed",
    onFixedVariant: "on-primary-fixed-variant",
  },

  secondary: {
    fixed: "secondary-fixed",
    fixedDim: "secondary-fixed-dim",
    onFixed: "on-secondary-fixed",
    onFixedVariant: "on-secondary-fixed-variant",
  },

  tertiary: {
    fixed: "tertiary-fixed",
    fixedDim: "tertiary-fixed-dim",
    onFixed: "on-tertiary-fixed",
    onFixedVariant: "on-tertiary-fixed-variant",
  },
} as const;

export const FIXED_ROLE_SEMANTICS = {
  fixed: "Theme-invariant accent container.",

  "fixed-dim": "More emphasized theme-invariant accent.",

  "on-fixed": "Primary content on the corresponding fixed accent.",

  "on-fixed-variant":
    "Lower-emphasis content on the corresponding fixed accent.",
} as const;

export const FIXED_ROLE_RULES = [
  {
    id: "AF-COL-017",

    rule: "Fixed accent roles are used only when preserving tonal presentation across themes is itself required.",
    strength: "must",
  },

  {
    id: "AF-COL-018",

    rule: "Fixed roles must not replace normal accent/container roles merely to avoid implementing theme-aware resolution.",
    strength: "must",
  },

  {
    id: "AF-COL-019",

    rule: "Most standard Afenda components should not require fixed roles.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// M3 COMPATIBILITY ROLES
// -----------------------------------------------------------------------------

/**
 * Current Material implementations still expose several historical /
 * implementation-facing roles.
 *
 * Afenda does not expose all of them as canonical product semantics.
 */
export const M3_COMPATIBILITY_ROLES = {
  background: {
    afenda: "Use surface as the canonical workspace background semantic.",
    disposition: "adapt",
  },

  "on-background": {
    afenda: "Use on-surface as the canonical workspace-content semantic.",
    disposition: "adapt",
  },

  "surface-tint": {
    afenda:
      "Afenda does not use surface tint as a public colour semantic; tonal surface hierarchy is explicit.",
    disposition: "reject",
  },

  "surface-variant": {
    afenda: "Prefer the explicit surface-container ladder.",
    disposition: "adapt",
  },
} as const satisfies Readonly<
  Record<
    string,
    {
      disposition: SourceDisposition;
      afenda: string;
    }
  >
>;

// -----------------------------------------------------------------------------
// AFENDA ENTERPRISE STATUS SYSTEM
// -----------------------------------------------------------------------------

/**
 * M3 defines `error`, but an enterprise product needs additional semantic
 * statuses.
 *
 * These roles are AFENDA additions.
 *
 * They are independent of accent families.
 */
export const STATUS_FAMILIES = {
  informative: {
    emotionalIntensity: "low",
    purpose:
      "Contextual or notable information that does not imply success, failure, or warning.",
  },

  negative: {
    emotionalIntensity: "low",
    purpose:
      "Unfavourable, declined, decreased, lost, overdue, or adverse business state that is not inherently a system error.",
  },
  positive: {
    emotionalIntensity: "low",
    purpose:
      "Successful, healthy, favourable, completed, gained, or confirmed state.",
  },

  warning: {
    emotionalIntensity: "medium",
    purpose:
      "Condition requiring attention or caution before it becomes a failure or adverse result.",
  },
} as const;

export type StatusFamily = keyof typeof STATUS_FAMILIES;

// -----------------------------------------------------------------------------
// STATUS ROLE PATTERN
// -----------------------------------------------------------------------------

export const STATUS_ROLE_PATTERN = [
  "base",
  "on-base",
  "container",
  "on-container",
] as const;

// -----------------------------------------------------------------------------
// STATUS ROLES
// -----------------------------------------------------------------------------

export const STATUS_ROLES = {
  informative: {
    base: "informative",
    container: "informative-container",
    onBase: "on-informative",
    onContainer: "on-informative-container",
  },

  negative: {
    base: "negative",
    container: "negative-container",
    onBase: "on-negative",
    onContainer: "on-negative-container",
  },
  positive: {
    base: "positive",
    container: "positive-container",
    onBase: "on-positive",
    onContainer: "on-positive-container",
  },

  warning: {
    base: "warning",
    container: "warning-container",
    onBase: "on-warning",
    onContainer: "on-warning-container",
  },
} as const;

// -----------------------------------------------------------------------------
// ERROR VS NEGATIVE
// -----------------------------------------------------------------------------

export const ERROR_STATUS_DISTINCTION = {
  error: [
    "invalid input",
    "failed operation",
    "system failure",
    "destructive action",
    "corrective attention",
  ],

  negative: [
    "financial loss",
    "negative variance",
    "decrease",
    "rejected business outcome",
    "overdue state",
    "adverse trend",
  ],
} as const;

export const STATUS_RULES = [
  {
    id: "AF-COL-020",

    rule: "Primary, secondary, and tertiary accent colours must not encode enterprise status meaning.",
    strength: "must",
  },

  {
    id: "AF-COL-021",

    rule: "Error and negative are separate semantics even when Level 2 chooses related colour families.",
    strength: "must",
  },

  {
    id: "AF-COL-022",

    rule: "Status meaning must remain stable across tenants and themes.",
    strength: "must",
  },

  {
    id: "AF-COL-023",

    rule: "Status colour must be accompanied by sufficient non-colour information when the status is consequential.",
    strength: "must",
  },

  {
    id: "AF-COL-024",

    rule: "Tenant customisation must not change status-family meaning.",
    strength: "must",
  },

  {
    id: "AF-COL-025",

    rule: "Status colour is used sparingly in dense tables and dashboards so exceptional information remains distinguishable.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// DATA / ANALYTICAL COLOUR
// -----------------------------------------------------------------------------

/**
 * Analytical colour is a separate system.
 *
 * Charts MUST NOT obtain arbitrary series colours from primary / secondary /
 * tertiary / status roles.
 */
export const DATA_COLOR_FAMILIES = {
  categorical: {
    purpose: "Distinguish unordered peer series or categories.",
  },

  comparison: {
    purpose:
      "Distinguish actual, forecast, target, benchmark, or reference information.",
  },

  diverging: {
    purpose: "Represent movement or magnitude around a meaningful midpoint.",
  },

  sequential: {
    purpose: "Represent increasing magnitude of one measure.",
  },
} as const;

export const DATA_CATEGORICAL_ROLES = [
  "categorical-1",
  "categorical-2",
  "categorical-3",
  "categorical-4",
  "categorical-5",
  "categorical-6",
  "categorical-7",
  "categorical-8",
] as const;

export const DATA_SEQUENTIAL_ROLES = [
  "sequential-lowest",
  "sequential-low",
  "sequential-medium",
  "sequential-high",
  "sequential-highest",
] as const;

export const DATA_DIVERGING_ROLES = [
  "diverging-negative",
  "diverging-neutral",
  "diverging-positive",
] as const;

export const DATA_COMPARISON_ROLES = [
  "actual",
  "forecast",
  "target",
  "benchmark",
  "reference",
] as const;

// -----------------------------------------------------------------------------
// DATA COLOUR RULES
// -----------------------------------------------------------------------------

export const DATA_COLOR_RULES = [
  {
    id: "AF-COL-026",

    rule: "Data-visualisation colour is governed independently from application accent colour.",
    strength: "must",
  },

  {
    id: "AF-COL-027",

    rule: "Categorical colour communicates distinction but not ordinal magnitude.",
    strength: "must",
  },

  {
    id: "AF-COL-028",

    rule: "Sequential colour communicates ordered magnitude.",
    strength: "must",
  },

  {
    id: "AF-COL-029",

    rule: "Diverging colour requires a meaningful midpoint.",
    strength: "must",
  },

  {
    id: "AF-COL-030",

    rule: "Status colours must not be reused as arbitrary categorical series colours.",
    strength: "must",
  },

  {
    id: "AF-COL-031",

    rule: "Charts containing consequential distinctions must provide a non-colour means of identifying those distinctions.",
    strength: "must",
  },

  {
    id: "AF-COL-032",

    rule: "Data visualisations use the minimum number of distinct colour series required to communicate the information clearly.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// ROLE PAIRING
// -----------------------------------------------------------------------------

/**
 * Content/background pairs are contracts.
 *
 * Level 3 should later be able to enumerate and validate these automatically.
 */
export const COLOR_PAIRS = [
  ["primary", "on-primary"],
  ["primary-container", "on-primary-container"],

  ["secondary", "on-secondary"],
  ["secondary-container", "on-secondary-container"],

  ["tertiary", "on-tertiary"],
  ["tertiary-container", "on-tertiary-container"],

  ["error", "on-error"],
  ["error-container", "on-error-container"],

  ["positive", "on-positive"],
  ["positive-container", "on-positive-container"],

  ["negative", "on-negative"],
  ["negative-container", "on-negative-container"],

  ["warning", "on-warning"],
  ["warning-container", "on-warning-container"],

  ["informative", "on-informative"],
  ["informative-container", "on-informative-container"],

  ["surface", "on-surface"],

  ["inverse-surface", "inverse-on-surface"],

  ["primary-fixed", "on-primary-fixed"],
  ["primary-fixed", "on-primary-fixed-variant"],

  ["secondary-fixed", "on-secondary-fixed"],
  ["secondary-fixed", "on-secondary-fixed-variant"],

  ["tertiary-fixed", "on-tertiary-fixed"],
  ["tertiary-fixed", "on-tertiary-fixed-variant"],
] as const;

// -----------------------------------------------------------------------------
// PAIR RULES
// -----------------------------------------------------------------------------

export const COLOR_PAIR_RULES = [
  {
    id: "AF-COL-033",

    rule: "An on-* role is used only on backgrounds for which the colour language declares it compatible.",
    strength: "must",
  },

  {
    id: "AF-COL-034",

    rule: "A foreground role does not inherit compatibility merely because its current resolved value passes a contrast test.",
    strength: "must",
  },

  {
    id: "AF-COL-035",

    rule: "A container and its content pair must be validated together in every supported applicable colour context.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// CONTENT EMPHASIS
// -----------------------------------------------------------------------------

/**
 * Afenda deliberately keeps text hierarchy small.
 *
 * Colour should not become a five-level text-opacity system.
 */
export const CONTENT_COLOR_ROLES = {
  disabled:
    "owned by interaction/component contracts rather than a global semantic text colour",

  inverse: "inverse-on-surface",
  primary: "on-surface",

  secondary: "on-surface-variant",
} as const;

export const CONTENT_COLOR_RULES = [
  {
    id: "AF-COL-036",

    rule: "Typography hierarchy should be established primarily through typography and composition rather than a proliferation of text colours.",
    strength: "must",
  },

  {
    id: "AF-COL-037",

    rule: "Use on-surface for primary information and on-surface-variant for supporting information.",
    strength: "should",
  },

  {
    id: "AF-COL-038",

    rule: "Disabled appearance is owned by interaction/component semantics and must not create a universal disabled-content role that ignores component context.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// THEME CONTEXT
// -----------------------------------------------------------------------------

export const COLOR_THEME_CONTEXT = {
  context: "theme" satisfies TokenContextId,

  default: "light",

  semanticsInvariant: true,

  supported: ["light", "dark"],
} as const;

// -----------------------------------------------------------------------------
// CONTRAST CONTEXT
// -----------------------------------------------------------------------------

/**
 * Afenda supports the useful M3 contrast idea as a USER / ACCESSIBILITY axis.
 *
 * Reduced contrast is not admitted initially.
 */
export const COLOR_CONTRAST_CONTEXT = {
  context: "contrast" satisfies TokenContextId,

  default: "standard",

  reducedContrast: "deferred",

  semanticsInvariant: true,

  supported: ["standard", "medium", "high"],
} as const;

// -----------------------------------------------------------------------------
// TENANT CONTEXT
// -----------------------------------------------------------------------------

export const COLOR_TENANT_CONTEXT = {
  context: "tenant" satisfies TokenContextId,

  customisableFamilies: ["primary", "secondary", "tertiary"],

  policy: "deny-by-default",

  protectedFamilies: [
    "surface",
    "structure",
    "error",
    "status",
    "data-semantic",
  ],
} as const;

// -----------------------------------------------------------------------------
// DENSITY / DIRECTION
// -----------------------------------------------------------------------------

/**
 * Colour does not change because density or writing direction changes.
 */
export const COLOR_CONTEXT_INVARIANTS = {
  density: "must-not-change-colour-semantics",

  direction: "must-not-change-colour-semantics",
} as const;

// -----------------------------------------------------------------------------
// CONTEXT RULES
// -----------------------------------------------------------------------------

export const COLOR_CONTEXT_RULES = [
  {
    id: "AF-COL-039",

    rule: "Light and dark themes may resolve different values but preserve identical semantic colour-role identities.",
    strength: "must",
  },

  {
    id: "AF-COL-040",

    rule: "Contrast preference changes resolution where required without changing semantic hierarchy or status meaning.",
    strength: "must",
  },

  {
    id: "AF-COL-041",

    rule: "Density must not change semantic colour.",
    strength: "must",
  },

  {
    id: "AF-COL-042",

    rule: "Writing direction must not change semantic colour.",
    strength: "must",
  },

  {
    id: "AF-COL-043",

    rule: "Tenant theme changes may affect only roles explicitly declared tenant-customisable.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const COLOR_TENANT_RULES = [
  {
    id: "AF-COL-044",

    rule: "Tenant accent customisation changes expression but not action hierarchy.",
    strength: "must",
  },

  {
    id: "AF-COL-045",

    rule: "Tenant colours must satisfy the same pairing and accessibility contracts as Afenda defaults.",
    strength: "must",
  },

  {
    id: "AF-COL-046",

    rule: "Tenant customisation cannot redefine error, positive, negative, warning, or informative semantics.",
    strength: "must",
  },

  {
    id: "AF-COL-047",

    rule: "Tenant customisation cannot directly override individual component-private colour tokens.",
    strength: "must",
  },

  {
    id: "AF-COL-048",

    rule: "Tenant branding should be concentrated in accent roles rather than recolouring the entire enterprise workspace.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// ACCESSIBILITY INVARIANTS
// -----------------------------------------------------------------------------

/**
 * Numeric contrast requirements belong to 08-accessibility.ts.
 *
 * Colour declares the relationships that accessibility must validate.
 */
export const COLOR_ACCESSIBILITY_REQUIREMENTS = [
  "text-contrast",
  "essential-non-text-contrast",
  "focus-indicator-contrast",
  "non-colour-meaning",
  "theme-pair-validation",
  "contrast-context-validation",
] as const;

export const COLOR_ACCESSIBILITY_RULES = [
  {
    id: "AF-COL-049",

    rule: "Every foreground/background pair must satisfy the applicable accessibility contract.",
    strength: "must",
  },

  {
    id: "AF-COL-050",

    rule: "A semantic distinction that affects task completion cannot rely on colour alone.",
    strength: "must",
  },

  {
    id: "AF-COL-051",

    rule: "Tenant and theme resolution must not weaken the applicable accessibility requirement.",
    strength: "must",
  },

  {
    id: "AF-COL-052",

    rule: "Data visualisation must remain interpretable when colour perception is reduced or absent.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// STATE RELATIONSHIP
// -----------------------------------------------------------------------------

/**
 * Interaction states are not colour contexts.
 *
 * 07-interaction.ts defines:
 *
 *   hover
 *   focus
 *   pressed
 *   selected
 *   disabled
 *   invalid
 *   etc.
 *
 * Component contracts decide how those states select or transform colour roles.
 */
export const COLOR_STATE_RELATIONSHIP = {
  colorContext: false,
  owner: "interaction",

  principle:
    "Interaction state may change the colour role or presentation used by a component, but does not redefine the global colour system.",
} as const;

export const COLOR_STATE_RULES = [
  {
    id: "AF-COL-053",

    rule: "Hover, focus, pressed, selected, disabled, loading, and invalid are not global colour contexts.",
    strength: "must",
  },

  {
    id: "AF-COL-054",

    rule: "A component state may select a different permitted semantic role only when its Level-1 component contract defines that behaviour.",
    strength: "must",
  },

  {
    id: "AF-COL-055",

    rule: "Focus indication must not be derived solely from hover or selection colour.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// COLOUR USAGE INTENSITY
// -----------------------------------------------------------------------------

/**
 * This is important for Afenda's quiet long-session visual language.
 */
export const COLOR_USAGE_HIERARCHY = [
  {
    family: "surface",
    rank: 1,
    usage: "dominant",
  },

  {
    family: "content",
    rank: 2,
    usage: "dominant",
  },

  {
    family: "structure",
    rank: 3,
    usage: "supporting",
  },

  {
    family: "primary",
    rank: 4,
    usage: "selective",
  },

  {
    family: "secondary",
    rank: 5,
    usage: "limited",
  },

  {
    family: "tertiary",
    rank: 6,
    usage: "rare",
  },

  {
    family: "status",
    rank: 7,
    usage: "semantic-only",
  },
] as const;

// -----------------------------------------------------------------------------
// COLOR RESTRAINT
// -----------------------------------------------------------------------------

export const COLOR_RESTRAINT_RULES = [
  {
    id: "AF-COL-056",

    rule: "Colour prominence must correspond to semantic importance.",
    strength: "must",
  },

  {
    id: "AF-COL-057",

    rule: "Dense workspaces should obtain hierarchy primarily from surfaces, spacing, typography, and alignment before introducing additional accent colour.",
    strength: "should",
  },

  {
    id: "AF-COL-058",

    rule: "Tertiary colour should be uncommon enough that its appearance carries meaningful differentiation.",
    strength: "should",
  },

  {
    id: "AF-COL-059",

    rule: "Status colour is not decorative.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// PUBLIC SYSTEM ROLE GROUPS
// -----------------------------------------------------------------------------

export const COLOR_PUBLIC_API = {
  accent: {
    primary: [
      "primary",
      "on-primary",
      "primary-container",
      "on-primary-container",
    ],

    secondary: [
      "secondary",
      "on-secondary",
      "secondary-container",
      "on-secondary-container",
    ],

    tertiary: [
      "tertiary",
      "on-tertiary",
      "tertiary-container",
      "on-tertiary-container",
    ],
  },

  data: {
    categorical: DATA_CATEGORICAL_ROLES,
    comparison: DATA_COMPARISON_ROLES,
    diverging: DATA_DIVERGING_ROLES,
    sequential: DATA_SEQUENTIAL_ROLES,
  },

  error: ["error", "on-error", "error-container", "on-error-container"],

  fixed: [
    "primary-fixed",
    "primary-fixed-dim",
    "on-primary-fixed",
    "on-primary-fixed-variant",

    "secondary-fixed",
    "secondary-fixed-dim",
    "on-secondary-fixed",
    "on-secondary-fixed-variant",

    "tertiary-fixed",
    "tertiary-fixed-dim",
    "on-tertiary-fixed",
    "on-tertiary-fixed-variant",
  ],

  inverse: ["inverse-surface", "inverse-on-surface", "inverse-primary"],

  status: [
    "positive",
    "on-positive",
    "positive-container",
    "on-positive-container",

    "negative",
    "on-negative",
    "negative-container",
    "on-negative-container",

    "warning",
    "on-warning",
    "warning-container",
    "on-warning-container",

    "informative",
    "on-informative",
    "informative-container",
    "on-informative-container",
  ],

  structure: ["outline", "outline-variant", "scrim"],

  surface: [
    "surface",
    "surface-dim",
    "surface-bright",

    "surface-container-lowest",
    "surface-container-low",
    "surface-container",
    "surface-container-high",
    "surface-container-highest",

    "on-surface",
    "on-surface-variant",
  ],
} as const;

// -----------------------------------------------------------------------------
// FORBIDDEN USAGE
// -----------------------------------------------------------------------------

export const COLOR_FORBIDS = [
  {
    behaviour:
      "application code selects colour by literal hue or palette step when a semantic role exists",
    id: "AF-COL-060",
    strength: "must",
  },

  {
    behaviour:
      "primary, secondary, or tertiary are used as aliases for business status",
    id: "AF-COL-061",
    strength: "must",
  },

  {
    behaviour: "status roles are used decoratively",
    id: "AF-COL-062",
    strength: "must",
  },

  {
    behaviour:
      "data series consume status colours merely because their hues are visually distinct",
    id: "AF-COL-063",
    strength: "must",
  },

  {
    behaviour:
      "tenant configuration directly supplies arbitrary component colours",
    id: "AF-COL-064",
    strength: "must",
  },

  {
    behaviour:
      "an on-* role is placed on an undeclared background solely because the current values appear readable",
    id: "AF-COL-065",
    strength: "must",
  },

  {
    behaviour:
      "dark theme is implemented by treating inverse roles as a dark-theme palette",
    id: "AF-COL-066",
    strength: "must",
  },

  {
    behaviour: "surface-container levels are interpreted as z-index values",
    id: "AF-COL-067",
    strength: "must",
  },

  {
    behaviour: "colour is the sole representation of a consequential state",
    id: "AF-COL-068",
    strength: "must",
  },

  {
    behaviour:
      "components introduce public semantic colours absent from this language or their component contract",
    id: "AF-COL-069",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN CONTRACT
// -----------------------------------------------------------------------------

/**
 * Every Level-2 system colour token must be reportable through this shape.
 *
 * The actual value belongs to Level 2.
 */
export interface ColorTokenDefinition extends SystemTokenDefinition {
  readonly category: "color";

  readonly compatibleBackgrounds?: readonly string[];

  readonly compatibleForegrounds?: readonly string[];

  readonly domain: ColorDomain;

  readonly tenantCustomisable: boolean;
  readonly tier: "system";
}

// -----------------------------------------------------------------------------
// SOURCE PROVENANCE
// -----------------------------------------------------------------------------

export const COLOR_SOURCES = [
  {
    adaptation:
      "Afenda preserves M3's semantic role architecture while adding enterprise status and analytical colour semantics, constraining tenant customisation, and rejecting consumer dynamic-colour behaviour as a product requirement.",

    contribution: [
      "semantic colour roles",
      "primary / secondary / tertiary accent families",
      "container and on-container pairing",
      "surface hierarchy",
      "surface-container ladder",
      "inverse roles",
      "outline roles",
      "fixed accent roles",
      "light and dark contextual resolution",
      "contrast-aware colour resolution",
    ],

    disposition: "adapt",
    id: "m3-color-system",

    kind: "design-system",

    system: "Material 3",
  },

  {
    adaptation:
      "Palette-generation mathematics may be used by Level 3, but algorithm choice and concrete colour values are not Level-1 design semantics.",

    contribution: [
      "scheme-based role resolution",
      "contrast-aware resolution",
      "source-colour derived palette capability",
    ],

    disposition: "adapt",
    id: "m3-material-color-utilities",

    kind: "colour-engine",

    system: "Material Color Utilities",
  },
] as const satisfies readonly {
  id: string;
  system: string;
  kind: string;
  disposition: SourceDisposition;
  contribution: readonly string[];
  adaptation: string;
}[];

// -----------------------------------------------------------------------------
// M3 DISPOSITION
// -----------------------------------------------------------------------------

export const M3_COLOR_DISPOSITION = {
  "analytical-colour-system": "adapt",

  "background-role": "adapt",

  "content-derived-dynamic-colour": "defer",

  "contrast-context": "adapt",

  "enterprise-status-system": "adapt",

  "error-family": "adopt",

  "fixed-accent-family": "adopt",

  "inverse-family": "adopt",

  "light-dark-context": "adopt",

  "outline-family": "adopt",

  "primary-family": "adopt",
  "secondary-family": "adopt",
  "semantic-role-model": "adopt",

  "surface-container-ladder": "adopt",

  "surface-family": "adopt",

  "surface-tint-role": "reject",

  "surface-variant-role": "adapt",
  "tertiary-family": "adopt",

  "wallpaper-dynamic-colour": "reject",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// -----------------------------------------------------------------------------
// SCHEME STRATEGY
// -----------------------------------------------------------------------------

/**
 * Afenda is an enterprise product.
 *
 * Its semantic scheme is controlled rather than derived from arbitrary
 * user wallpaper or content.
 *
 * Level 3 MAY use colour-generation algorithms to construct governed
 * reference palettes from approved sources.
 *
 * That does not make dynamic colour a Level-1 product capability.
 */
export const COLOR_SCHEME_STRATEGY = {
  contentDerived: false,

  contrastModes: ["standard", "medium", "high"],

  generatorMayDeriveReferencePalette: true,
  productScheme: "static-custom",

  tenantExpression: "governed",

  themeModes: ["light", "dark"],

  wallpaperDerived: false,
} as const;

// -----------------------------------------------------------------------------
// LEVEL-2 OBLIGATIONS
// -----------------------------------------------------------------------------

export const COLOR_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-COL-070",

    obligation:
      "Every active public colour role has a deterministic Level-2 resolution for every supported applicable colour context.",
    strength: "must",
  },

  {
    id: "AF-COL-071",

    obligation:
      "Level 2 preserves declared foreground/background pair relationships.",
    strength: "must",
  },

  {
    id: "AF-COL-072",

    obligation:
      "Level 2 implements the complete supported surface-container hierarchy.",
    strength: "must",
  },

  {
    id: "AF-COL-073",

    obligation:
      "Light and dark schemes preserve identical semantic role identities.",
    strength: "must",
  },

  {
    id: "AF-COL-074",

    obligation: "Tenant resolution cannot mutate protected semantic families.",
    strength: "must",
  },

  {
    id: "AF-COL-075",

    obligation:
      "Analytical colour is implemented independently from application accent and status colour.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// LEVEL-3 PROOF REQUIREMENTS
// -----------------------------------------------------------------------------

export const COLOR_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-COL-076",

    prove:
      "every active colour role resolves in every supported applicable context",
  },

  {
    id: "AF-COL-077",

    prove:
      "all declared foreground/background pairs satisfy their accessibility contract",
  },

  {
    id: "AF-COL-078",

    prove: "tenant overrides target only tenant-customisable roles",
  },

  {
    id: "AF-COL-079",

    prove: "status-role meaning is identical across themes and tenants",
  },

  {
    id: "AF-COL-080",

    prove: "surface-container ordering remains semantically complete",
  },

  {
    id: "AF-COL-081",

    prove:
      "application source does not consume reference palette values where a governed semantic role exists",
  },

  {
    id: "AF-COL-082",

    prove: "status colours are not used as arbitrary data-series colours",
  },

  {
    id: "AF-COL-083",

    prove:
      "forbidden M3 compatibility roles are not exposed as new Afenda semantic APIs",
  },

  {
    id: "AF-COL-084",

    prove:
      "colour is not the sole programmatically detectable representation of consequential component state where the applicable accessibility contract requires another representation",
  },
] as const;

// -----------------------------------------------------------------------------
// CONFORMANCE
// -----------------------------------------------------------------------------

export const COLOR_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "pair-validated",
    "contrast-validated",
    "tenant-validated",
    "semantic-boundary-validated",
  ],

  implementation: [
    "role-resolved",
    "theme-resolved",
    "contrast-resolved",
    "tenant-safe",
  ],
  language: [
    "semantic-role-defined",
    "role-domain-defined",
    "pair-defined",
    "context-policy-defined",
    "tenant-policy-defined",
  ],
} as const;

// -----------------------------------------------------------------------------
// PUBLIC TYPES
// -----------------------------------------------------------------------------

export type PrimaryColorRole = keyof typeof PRIMARY_ROLES;

export type SecondaryColorRole = keyof typeof SECONDARY_ROLES;

export type TertiaryColorRole = keyof typeof TERTIARY_ROLES;

export type ErrorColorRole = keyof typeof ERROR_ROLES;

export type StructuralColorRole = keyof typeof STRUCTURAL_ROLES;

export type InverseColorRole = keyof typeof INVERSE_ROLES;

export type SurfaceContentRole = keyof typeof SURFACE_CONTENT_ROLES;

export type StatusColorFamily = keyof typeof STATUS_ROLES;

export type ColorPublicApi = typeof COLOR_PUBLIC_API;
