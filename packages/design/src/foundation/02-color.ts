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
  id: "color",
  code: "COL",
  level: 1,
  order: 2,
  version: "1.0.0",

  purpose:
    "Define stable semantic colour roles for enterprise work, interaction, status, surfaces, branding, and analytical information.",

  philosophy:
    "Afenda uses colour primarily to communicate structure, meaning, state, and hierarchy; not to decorate the interface.",
} as const;

// -----------------------------------------------------------------------------
// PRINCIPLES
// -----------------------------------------------------------------------------

export const COLOR_PRINCIPLES = [
  {
    id: "AF-COL-001",
    strength: "must",

    statement:
      "Colour is consumed by semantic role rather than by hue, tone, palette position, or literal value.",
  },

  {
    id: "AF-COL-002",
    strength: "must",

    statement:
      "A container role and its intended content role form a semantic pair.",
  },

  {
    id: "AF-COL-003",
    strength: "must",

    statement:
      "Surfaces establish the primary visual hierarchy of the Afenda workspace; accent colour is used selectively.",
  },

  {
    id: "AF-COL-004",
    strength: "must",

    statement:
      "Colour must not be the sole carrier of consequential information.",
  },

  {
    id: "AF-COL-005",
    strength: "must",

    statement:
      "A semantic colour role retains the same meaning across light, dark, contrast, and tenant contexts.",
  },

  {
    id: "AF-COL-006",
    strength: "must",

    statement:
      "Business status, validation state, interaction state, and analytical meaning are separate semantic concepts even when they currently resolve to similar colours.",
  },

  {
    id: "AF-COL-007",
    strength: "must",

    statement:
      "Tenant expression may influence permitted accent roles but cannot redefine status, validation, accessibility, or analytical meaning.",
  },

  {
    id: "AF-COL-008",
    strength: "must",

    statement:
      "The number of available colour roles does not justify using more colours in a screen.",
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

  surface: {
    purpose:
      "Workspace backgrounds, containers, layers, and containment hierarchy.",
  },

  content: {
    purpose:
      "Text, icons, and other foreground information placed on surfaces.",
  },

  structure: {
    purpose:
      "Boundaries, separators, focus-supporting geometry, and obscuring layers.",
  },

  status: {
    purpose:
      "Stable enterprise meaning such as positive, negative, warning, and informative state.",
  },

  data: {
    purpose:
      "Analytical distinction in charts, metrics, forecasts, comparisons, and visualisations.",
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
    purpose:
      "Highest product accent emphasis for important actions, active emphasis, and strong identity.",

    frequency: "selective",

    tenantCustomisable: true,
  },

  secondary: {
    purpose:
      "Supporting accent used where distinction is needed without competing with primary emphasis.",

    frequency: "limited",

    tenantCustomisable: true,
  },

  tertiary: {
    purpose:
      "Contrasting accent for deliberate differentiation or heightened attention where primary and secondary are insufficient.",

    frequency: "rare",

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
  primary: {
    token: "af.sys.color.primary",

    domain: "accent",

    purpose:
      "Highest-emphasis accent used for important interactive and active elements.",

    foreground: "on-primary",

    tenantCustomisable: true,
  },

  "on-primary": {
    token: "af.sys.color.on-primary",

    domain: "content",

    purpose: "Content displayed directly on primary.",

    background: "primary",

    tenantCustomisable: true,
  },

  "primary-container": {
    token: "af.sys.color.primary-container",

    domain: "accent",

    purpose:
      "Tonal primary container used when primary meaning is required with lower visual intensity.",

    foreground: "on-primary-container",

    tenantCustomisable: true,
  },

  "on-primary-container": {
    token: "af.sys.color.on-primary-container",

    domain: "content",

    purpose: "Content displayed directly on primary-container.",

    background: "primary-container",

    tenantCustomisable: true,
  },
} as const;

// -----------------------------------------------------------------------------
// SECONDARY ROLES
// -----------------------------------------------------------------------------

export const SECONDARY_ROLES = {
  secondary: {
    token: "af.sys.color.secondary",

    domain: "accent",

    purpose:
      "Supporting accent for differentiation with less prominence than primary.",

    foreground: "on-secondary",

    tenantCustomisable: true,
  },

  "on-secondary": {
    token: "af.sys.color.on-secondary",

    domain: "content",

    purpose: "Content displayed directly on secondary.",

    background: "secondary",

    tenantCustomisable: true,
  },

  "secondary-container": {
    token: "af.sys.color.secondary-container",

    domain: "accent",

    purpose: "Lower-intensity secondary container.",

    foreground: "on-secondary-container",

    tenantCustomisable: true,
  },

  "on-secondary-container": {
    token: "af.sys.color.on-secondary-container",

    domain: "content",

    purpose: "Content displayed directly on secondary-container.",

    background: "secondary-container",

    tenantCustomisable: true,
  },
} as const;

// -----------------------------------------------------------------------------
// TERTIARY ROLES
// -----------------------------------------------------------------------------

export const TERTIARY_ROLES = {
  tertiary: {
    token: "af.sys.color.tertiary",

    domain: "accent",

    purpose:
      "Contrasting accent for deliberate differentiation and rare heightened attention.",

    foreground: "on-tertiary",

    tenantCustomisable: true,
  },

  "on-tertiary": {
    token: "af.sys.color.on-tertiary",

    domain: "content",

    purpose: "Content displayed directly on tertiary.",

    background: "tertiary",

    tenantCustomisable: true,
  },

  "tertiary-container": {
    token: "af.sys.color.tertiary-container",

    domain: "accent",

    purpose: "Lower-intensity tertiary container.",

    foreground: "on-tertiary-container",

    tenantCustomisable: true,
  },

  "on-tertiary-container": {
    token: "af.sys.color.on-tertiary-container",

    domain: "content",

    purpose: "Content displayed directly on tertiary-container.",

    background: "tertiary-container",

    tenantCustomisable: true,
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
    token: "af.sys.color.error",

    domain: "status",

    purpose:
      "Validation failure, destructive action, failed operation, or error requiring corrective attention.",

    foreground: "on-error",

    tenantCustomisable: false,
  },

  "on-error": {
    token: "af.sys.color.on-error",

    domain: "content",

    purpose: "Content displayed directly on error.",

    background: "error",

    tenantCustomisable: false,
  },

  "error-container": {
    token: "af.sys.color.error-container",

    domain: "status",

    purpose:
      "Lower-intensity container communicating error or destructive meaning.",

    foreground: "on-error-container",

    tenantCustomisable: false,
  },

  "on-error-container": {
    token: "af.sys.color.on-error-container",

    domain: "content",

    purpose: "Content displayed directly on error-container.",

    background: "error-container",

    tenantCustomisable: false,
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
    token: "af.sys.color.surface",

    purpose: "Default workspace surface and canonical neutral background.",

    foreground: "on-surface",
  },

  "surface-dim": {
    token: "af.sys.color.surface-dim",

    purpose:
      "Deliberately dimmer surface used where stable tonal differentiation is required.",
  },

  "surface-bright": {
    token: "af.sys.color.surface-bright",

    purpose:
      "Deliberately brighter surface used where stable tonal differentiation is required.",
  },

  "surface-container-lowest": {
    token: "af.sys.color.surface-container-lowest",

    purpose: "Lowest-emphasis contained surface.",
  },

  "surface-container-low": {
    token: "af.sys.color.surface-container-low",

    purpose: "Low-emphasis contained surface.",
  },

  "surface-container": {
    token: "af.sys.color.surface-container",

    purpose:
      "Default contained surface for panels, cards, grouped regions, and workspace structures.",
  },

  "surface-container-high": {
    token: "af.sys.color.surface-container-high",

    purpose: "Higher-emphasis contained surface.",
  },

  "surface-container-highest": {
    token: "af.sys.color.surface-container-highest",

    purpose: "Highest-emphasis neutral contained surface.",
  },
} as const;

export type SurfaceRole = keyof typeof SURFACE_ROLES;

// -----------------------------------------------------------------------------
// SURFACE CONTENT
// -----------------------------------------------------------------------------

export const SURFACE_CONTENT_ROLES = {
  "on-surface": {
    token: "af.sys.color.on-surface",

    purpose:
      "Primary text, icons, and information on surfaces and surface containers.",

    emphasis: "primary",
  },

  "on-surface-variant": {
    token: "af.sys.color.on-surface-variant",

    purpose:
      "Lower-emphasis supporting text, icons, metadata, and secondary information on surfaces.",

    emphasis: "secondary",
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
    strength: "must",

    rule: "Surface-container roles communicate containment emphasis rather than elevation height.",
  },

  {
    id: "AF-COL-010",
    strength: "must",

    rule: "Surface hierarchy is preferred over excessive accent colour for structuring dense enterprise screens.",
  },

  {
    id: "AF-COL-011",
    strength: "must",

    rule: "A component must not assume that a numerically or visually stronger surface implies a higher stacking layer.",
  },

  {
    id: "AF-COL-012",
    strength: "should",

    rule: "Most Afenda workspace area should remain within the surface family rather than accent families.",
  },

  {
    id: "AF-COL-013",
    strength: "should",

    rule: "Adjacent surface levels should be used only where containment distinction improves comprehension.",
  },

  {
    id: "AF-COL-014",
    strength: "must",

    rule: "Surface containers use on-surface or on-surface-variant content unless a component contract declares another valid pair.",
  },
] as const;

// -----------------------------------------------------------------------------
// INVERSE ROLES
// -----------------------------------------------------------------------------

export const INVERSE_ROLES = {
  "inverse-surface": {
    token: "af.sys.color.inverse-surface",

    purpose:
      "Contrasting surface used for temporary or deliberately inverted presentation.",

    foreground: "inverse-on-surface",
  },

  "inverse-on-surface": {
    token: "af.sys.color.inverse-on-surface",

    purpose: "Content displayed directly on inverse-surface.",

    background: "inverse-surface",
  },

  "inverse-primary": {
    token: "af.sys.color.inverse-primary",

    purpose: "Primary action/accent used within inverse presentation.",
  },
} as const;

export const INVERSE_RULES = [
  {
    id: "AF-COL-015",
    strength: "must",

    rule: "Inverse roles represent intentional local inversion and are not aliases for dark theme.",
  },

  {
    id: "AF-COL-016",
    strength: "should",

    rule: "Inverse roles are reserved for temporary, floating, notification, or strongly contrasting presentation.",
  },
] as const;

// -----------------------------------------------------------------------------
// STRUCTURAL ROLES
// -----------------------------------------------------------------------------

export const STRUCTURAL_ROLES = {
  outline: {
    token: "af.sys.color.outline",

    purpose:
      "Meaningful boundaries whose visibility contributes to interaction or structure.",

    tenantCustomisable: false,
  },

  "outline-variant": {
    token: "af.sys.color.outline-variant",

    purpose: "Lower-emphasis decorative boundaries and separators.",

    tenantCustomisable: false,
  },

  scrim: {
    token: "af.sys.color.scrim",

    purpose:
      "Obscuring layer used to reduce background prominence behind modal or transient content.",

    tenantCustomisable: false,
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
    strength: "must",

    rule: "Fixed accent roles are used only when preserving tonal presentation across themes is itself required.",
  },

  {
    id: "AF-COL-018",
    strength: "must",

    rule: "Fixed roles must not replace normal accent/container roles merely to avoid implementing theme-aware resolution.",
  },

  {
    id: "AF-COL-019",
    strength: "should",

    rule: "Most standard Afenda components should not require fixed roles.",
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
    disposition: "adapt",

    afenda: "Use surface as the canonical workspace background semantic.",
  },

  "on-background": {
    disposition: "adapt",

    afenda: "Use on-surface as the canonical workspace-content semantic.",
  },

  "surface-variant": {
    disposition: "adapt",

    afenda: "Prefer the explicit surface-container ladder.",
  },

  "surface-tint": {
    disposition: "reject",

    afenda:
      "Afenda does not use surface tint as a public colour semantic; tonal surface hierarchy is explicit.",
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
  positive: {
    purpose:
      "Successful, healthy, favourable, completed, gained, or confirmed state.",

    emotionalIntensity: "low",
  },

  negative: {
    purpose:
      "Unfavourable, declined, decreased, lost, overdue, or adverse business state that is not inherently a system error.",

    emotionalIntensity: "low",
  },

  warning: {
    purpose:
      "Condition requiring attention or caution before it becomes a failure or adverse result.",

    emotionalIntensity: "medium",
  },

  informative: {
    purpose:
      "Contextual or notable information that does not imply success, failure, or warning.",

    emotionalIntensity: "low",
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
  positive: {
    base: "positive",
    onBase: "on-positive",
    container: "positive-container",
    onContainer: "on-positive-container",
  },

  negative: {
    base: "negative",
    onBase: "on-negative",
    container: "negative-container",
    onContainer: "on-negative-container",
  },

  warning: {
    base: "warning",
    onBase: "on-warning",
    container: "warning-container",
    onContainer: "on-warning-container",
  },

  informative: {
    base: "informative",
    onBase: "on-informative",
    container: "informative-container",
    onContainer: "on-informative-container",
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
    strength: "must",

    rule: "Primary, secondary, and tertiary accent colours must not encode enterprise status meaning.",
  },

  {
    id: "AF-COL-021",
    strength: "must",

    rule: "Error and negative are separate semantics even when Level 2 chooses related colour families.",
  },

  {
    id: "AF-COL-022",
    strength: "must",

    rule: "Status meaning must remain stable across tenants and themes.",
  },

  {
    id: "AF-COL-023",
    strength: "must",

    rule: "Status colour must be accompanied by sufficient non-colour information when the status is consequential.",
  },

  {
    id: "AF-COL-024",
    strength: "must",

    rule: "Tenant customisation must not change status-family meaning.",
  },

  {
    id: "AF-COL-025",
    strength: "should",

    rule: "Status colour is used sparingly in dense tables and dashboards so exceptional information remains distinguishable.",
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

  sequential: {
    purpose: "Represent increasing magnitude of one measure.",
  },

  diverging: {
    purpose: "Represent movement or magnitude around a meaningful midpoint.",
  },

  comparison: {
    purpose:
      "Distinguish actual, forecast, target, benchmark, or reference information.",
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
    strength: "must",

    rule: "Data-visualisation colour is governed independently from application accent colour.",
  },

  {
    id: "AF-COL-027",
    strength: "must",

    rule: "Categorical colour communicates distinction but not ordinal magnitude.",
  },

  {
    id: "AF-COL-028",
    strength: "must",

    rule: "Sequential colour communicates ordered magnitude.",
  },

  {
    id: "AF-COL-029",
    strength: "must",

    rule: "Diverging colour requires a meaningful midpoint.",
  },

  {
    id: "AF-COL-030",
    strength: "must",

    rule: "Status colours must not be reused as arbitrary categorical series colours.",
  },

  {
    id: "AF-COL-031",
    strength: "must",

    rule: "Charts containing consequential distinctions must provide a non-colour means of identifying those distinctions.",
  },

  {
    id: "AF-COL-032",
    strength: "should",

    rule: "Data visualisations use the minimum number of distinct colour series required to communicate the information clearly.",
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
    strength: "must",

    rule: "An on-* role is used only on backgrounds for which the colour language declares it compatible.",
  },

  {
    id: "AF-COL-034",
    strength: "must",

    rule: "A foreground role does not inherit compatibility merely because its current resolved value passes a contrast test.",
  },

  {
    id: "AF-COL-035",
    strength: "must",

    rule: "A container and its content pair must be validated together in every supported applicable colour context.",
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
  primary: "on-surface",

  secondary: "on-surface-variant",

  disabled:
    "owned by interaction/component contracts rather than a global semantic text colour",

  inverse: "inverse-on-surface",
} as const;

export const CONTENT_COLOR_RULES = [
  {
    id: "AF-COL-036",
    strength: "must",

    rule: "Typography hierarchy should be established primarily through typography and composition rather than a proliferation of text colours.",
  },

  {
    id: "AF-COL-037",
    strength: "should",

    rule: "Use on-surface for primary information and on-surface-variant for supporting information.",
  },

  {
    id: "AF-COL-038",
    strength: "must",

    rule: "Disabled appearance is owned by interaction/component semantics and must not create a universal disabled-content role that ignores component context.",
  },
] as const;

// -----------------------------------------------------------------------------
// THEME CONTEXT
// -----------------------------------------------------------------------------

export const COLOR_THEME_CONTEXT = {
  context: "theme" satisfies TokenContextId,

  supported: ["light", "dark"],

  default: "light",

  semanticsInvariant: true,
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

  supported: ["standard", "medium", "high"],

  default: "standard",

  semanticsInvariant: true,

  reducedContrast: "deferred",
} as const;

// -----------------------------------------------------------------------------
// TENANT CONTEXT
// -----------------------------------------------------------------------------

export const COLOR_TENANT_CONTEXT = {
  context: "tenant" satisfies TokenContextId,

  policy: "deny-by-default",

  customisableFamilies: ["primary", "secondary", "tertiary"],

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
    strength: "must",

    rule: "Light and dark themes may resolve different values but preserve identical semantic colour-role identities.",
  },

  {
    id: "AF-COL-040",
    strength: "must",

    rule: "Contrast preference changes resolution where required without changing semantic hierarchy or status meaning.",
  },

  {
    id: "AF-COL-041",
    strength: "must",

    rule: "Density must not change semantic colour.",
  },

  {
    id: "AF-COL-042",
    strength: "must",

    rule: "Writing direction must not change semantic colour.",
  },

  {
    id: "AF-COL-043",
    strength: "must",

    rule: "Tenant theme changes may affect only roles explicitly declared tenant-customisable.",
  },
] as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const COLOR_TENANT_RULES = [
  {
    id: "AF-COL-044",
    strength: "must",

    rule: "Tenant accent customisation changes expression but not action hierarchy.",
  },

  {
    id: "AF-COL-045",
    strength: "must",

    rule: "Tenant colours must satisfy the same pairing and accessibility contracts as Afenda defaults.",
  },

  {
    id: "AF-COL-046",
    strength: "must",

    rule: "Tenant customisation cannot redefine error, positive, negative, warning, or informative semantics.",
  },

  {
    id: "AF-COL-047",
    strength: "must",

    rule: "Tenant customisation cannot directly override individual component-private colour tokens.",
  },

  {
    id: "AF-COL-048",
    strength: "should",

    rule: "Tenant branding should be concentrated in accent roles rather than recolouring the entire enterprise workspace.",
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
    strength: "must",

    rule: "Every foreground/background pair must satisfy the applicable accessibility contract.",
  },

  {
    id: "AF-COL-050",
    strength: "must",

    rule: "A semantic distinction that affects task completion cannot rely on colour alone.",
  },

  {
    id: "AF-COL-051",
    strength: "must",

    rule: "Tenant and theme resolution must not weaken the applicable accessibility requirement.",
  },

  {
    id: "AF-COL-052",
    strength: "must",

    rule: "Data visualisation must remain interpretable when colour perception is reduced or absent.",
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
  owner: "interaction",

  colorContext: false,

  principle:
    "Interaction state may change the colour role or presentation used by a component, but does not redefine the global colour system.",
} as const;

export const COLOR_STATE_RULES = [
  {
    id: "AF-COL-053",
    strength: "must",

    rule: "Hover, focus, pressed, selected, disabled, loading, and invalid are not global colour contexts.",
  },

  {
    id: "AF-COL-054",
    strength: "must",

    rule: "A component state may select a different permitted semantic role only when its Level-1 component contract defines that behaviour.",
  },

  {
    id: "AF-COL-055",
    strength: "must",

    rule: "Focus indication must not be derived solely from hover or selection colour.",
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
    rank: 1,
    family: "surface",
    usage: "dominant",
  },

  {
    rank: 2,
    family: "content",
    usage: "dominant",
  },

  {
    rank: 3,
    family: "structure",
    usage: "supporting",
  },

  {
    rank: 4,
    family: "primary",
    usage: "selective",
  },

  {
    rank: 5,
    family: "secondary",
    usage: "limited",
  },

  {
    rank: 6,
    family: "tertiary",
    usage: "rare",
  },

  {
    rank: 7,
    family: "status",
    usage: "semantic-only",
  },
] as const;

// -----------------------------------------------------------------------------
// COLOR RESTRAINT
// -----------------------------------------------------------------------------

export const COLOR_RESTRAINT_RULES = [
  {
    id: "AF-COL-056",
    strength: "must",

    rule: "Colour prominence must correspond to semantic importance.",
  },

  {
    id: "AF-COL-057",
    strength: "should",

    rule: "Dense workspaces should obtain hierarchy primarily from surfaces, spacing, typography, and alignment before introducing additional accent colour.",
  },

  {
    id: "AF-COL-058",
    strength: "should",

    rule: "Tertiary colour should be uncommon enough that its appearance carries meaningful differentiation.",
  },

  {
    id: "AF-COL-059",
    strength: "must",

    rule: "Status colour is not decorative.",
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

  inverse: ["inverse-surface", "inverse-on-surface", "inverse-primary"],

  structure: ["outline", "outline-variant", "scrim"],

  error: ["error", "on-error", "error-container", "on-error-container"],

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

  data: {
    categorical: DATA_CATEGORICAL_ROLES,
    sequential: DATA_SEQUENTIAL_ROLES,
    diverging: DATA_DIVERGING_ROLES,
    comparison: DATA_COMPARISON_ROLES,
  },
} as const;

// -----------------------------------------------------------------------------
// FORBIDDEN USAGE
// -----------------------------------------------------------------------------

export const COLOR_FORBIDS = [
  {
    id: "AF-COL-060",
    strength: "must",

    behaviour:
      "application code selects colour by literal hue or palette step when a semantic role exists",
  },

  {
    id: "AF-COL-061",
    strength: "must",

    behaviour:
      "primary, secondary, or tertiary are used as aliases for business status",
  },

  {
    id: "AF-COL-062",
    strength: "must",

    behaviour: "status roles are used decoratively",
  },

  {
    id: "AF-COL-063",
    strength: "must",

    behaviour:
      "data series consume status colours merely because their hues are visually distinct",
  },

  {
    id: "AF-COL-064",
    strength: "must",

    behaviour:
      "tenant configuration directly supplies arbitrary component colours",
  },

  {
    id: "AF-COL-065",
    strength: "must",

    behaviour:
      "an on-* role is placed on an undeclared background solely because the current values appear readable",
  },

  {
    id: "AF-COL-066",
    strength: "must",

    behaviour:
      "dark theme is implemented by treating inverse roles as a dark-theme palette",
  },

  {
    id: "AF-COL-067",
    strength: "must",

    behaviour: "surface-container levels are interpreted as z-index values",
  },

  {
    id: "AF-COL-068",
    strength: "must",

    behaviour: "colour is the sole representation of a consequential state",
  },

  {
    id: "AF-COL-069",
    strength: "must",

    behaviour:
      "components introduce public semantic colours absent from this language or their component contract",
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
  readonly tier: "system";
  readonly category: "color";

  readonly domain: ColorDomain;

  readonly tenantCustomisable: boolean;

  readonly compatibleForegrounds?: readonly string[];

  readonly compatibleBackgrounds?: readonly string[];
}

// -----------------------------------------------------------------------------
// SOURCE PROVENANCE
// -----------------------------------------------------------------------------

export const COLOR_SOURCES = [
  {
    id: "m3-color-system",

    system: "Material 3",

    kind: "design-system",

    disposition: "adapt",

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

    adaptation:
      "Afenda preserves M3's semantic role architecture while adding enterprise status and analytical colour semantics, constraining tenant customisation, and rejecting consumer dynamic-colour behaviour as a product requirement.",
  },

  {
    id: "m3-material-color-utilities",

    system: "Material Color Utilities",

    kind: "colour-engine",

    disposition: "adapt",

    contribution: [
      "scheme-based role resolution",
      "contrast-aware resolution",
      "source-colour derived palette capability",
    ],

    adaptation:
      "Palette-generation mathematics may be used by Level 3, but algorithm choice and concrete colour values are not Level-1 design semantics.",
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
  "semantic-role-model": "adopt",

  "primary-family": "adopt",
  "secondary-family": "adopt",
  "tertiary-family": "adopt",

  "error-family": "adopt",

  "surface-family": "adopt",

  "surface-container-ladder": "adopt",

  "inverse-family": "adopt",

  "outline-family": "adopt",

  "fixed-accent-family": "adopt",

  "light-dark-context": "adopt",

  "contrast-context": "adapt",

  "background-role": "adapt",

  "surface-variant-role": "adapt",

  "surface-tint-role": "reject",

  "wallpaper-dynamic-colour": "reject",

  "content-derived-dynamic-colour": "defer",

  "enterprise-status-system": "adapt",

  "analytical-colour-system": "adapt",
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
  productScheme: "static-custom",

  themeModes: ["light", "dark"],

  contrastModes: ["standard", "medium", "high"],

  tenantExpression: "governed",

  wallpaperDerived: false,

  contentDerived: false,

  generatorMayDeriveReferencePalette: true,
} as const;

// -----------------------------------------------------------------------------
// LEVEL-2 OBLIGATIONS
// -----------------------------------------------------------------------------

export const COLOR_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-COL-070",
    strength: "must",

    obligation:
      "Every active public colour role has a deterministic Level-2 resolution for every supported applicable colour context.",
  },

  {
    id: "AF-COL-071",
    strength: "must",

    obligation:
      "Level 2 preserves declared foreground/background pair relationships.",
  },

  {
    id: "AF-COL-072",
    strength: "must",

    obligation:
      "Level 2 implements the complete supported surface-container hierarchy.",
  },

  {
    id: "AF-COL-073",
    strength: "must",

    obligation:
      "Light and dark schemes preserve identical semantic role identities.",
  },

  {
    id: "AF-COL-074",
    strength: "must",

    obligation: "Tenant resolution cannot mutate protected semantic families.",
  },

  {
    id: "AF-COL-075",
    strength: "must",

    obligation:
      "Analytical colour is implemented independently from application accent and status colour.",
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
  language: [
    "semantic-role-defined",
    "role-domain-defined",
    "pair-defined",
    "context-policy-defined",
    "tenant-policy-defined",
  ],

  implementation: [
    "role-resolved",
    "theme-resolved",
    "contrast-resolved",
    "tenant-safe",
  ],

  governance: [
    "pair-validated",
    "contrast-validated",
    "tenant-validated",
    "semantic-boundary-validated",
  ],

  completeWhen: ["language-defined", "implemented", "proven"],
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
