/**
 * AFENDA DESIGN LANGUAGE — TYPOGRAPHY
 *
 * L1.03
 *
 * Defines the semantic typography language of Afenda.
 *
 * Primary design influence:
 *   - IBM Carbon productive typography
 *
 * Secondary design influence:
 *   - Material 3 semantic type roles
 *   - IBM Design Language global typography principles
 *
 * Afenda adapts those systems for:
 *
 *   - enterprise SaaS
 *   - dense data interfaces
 *   - long-session professional use
 *   - financial and numerical information
 *   - forms and workflow
 *   - multilingual / multiscript use
 *   - responsive product interfaces
 *   - tenant expression
 *
 * This file defines:
 *
 *   - typography principles
 *   - typeface semantic slots
 *   - productive / expressive strategies
 *   - semantic type roles
 *   - heading hierarchy
 *   - body and supporting typography
 *   - control typography
 *   - data and numeric typography
 *   - code typography
 *   - emphasis
 *   - fixed / fluid behaviour
 *   - script adaptation
 *   - density behaviour
 *   - tenant boundaries
 *   - accessibility invariants
 *   - public typography API
 *
 * It deliberately defines NO typography values.
 *
 * No:
 *   - font-family names
 *   - px
 *   - rem
 *   - numeric font weights
 *   - line-height values
 *   - letter-spacing values
 *   - font files
 *   - clamp() expressions
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

export const TYPOGRAPHY_LANGUAGE = {
  code: "TYP",

  defaultStrategy: "productive",
  id: "typography",
  level: 1,
  order: 3,

  philosophy:
    "Typography organises information before it expresses personality.",

  purpose:
    "Define stable semantic typography for dense professional interfaces, readable content, numerical information, controls, and limited expressive presentation.",
  version: "1.0.0",
} as const;

// -----------------------------------------------------------------------------
// PRINCIPLES
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_PRINCIPLES = [
  {
    id: "AF-TYP-001",

    statement:
      "Typography is selected by information role and task purpose rather than by preferred font size or weight.",
    strength: "must",
  },

  {
    id: "AF-TYP-002",

    statement:
      "Productive typography is the default for Afenda application workspaces.",
    strength: "must",
  },

  {
    id: "AF-TYP-003",

    statement:
      "Typographic hierarchy uses the minimum number of distinguishable levels required to make information structure clear.",
    strength: "must",
  },

  {
    id: "AF-TYP-004",

    statement:
      "Typography must remain readable and structurally stable during long-session professional use.",
    strength: "must",
  },

  {
    id: "AF-TYP-005",

    statement:
      "Data, numbers, identifiers, prose, controls, and headings are different information classes and may require different typographic semantics.",
    strength: "must",
  },

  {
    id: "AF-TYP-006",

    statement:
      "Script adaptation may change typeface or metrics but must not change the semantic hierarchy of content.",
    strength: "must",
  },

  {
    id: "AF-TYP-007",

    statement:
      "Tenant typography may express brand identity only within explicitly permitted roles and must not compromise productive interface typography.",
    strength: "must",
  },

  {
    id: "AF-TYP-008",

    statement:
      "Font weight, size, colour, and case are not substitutes for semantic document structure.",
    strength: "must",
  },

  {
    id: "AF-TYP-009",

    statement:
      "Typography used for numerical comparison must support stable visual comparison of digits.",
    strength: "must",
  },

  {
    id: "AF-TYP-010",

    statement:
      "Fluid typography is an explicit expressive capability rather than the default behaviour of product typography.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// -----------------------------------------------------------------------------
// TYPOGRAPHY STRATEGIES
// -----------------------------------------------------------------------------

/**
 * Carbon's productive / expressive distinction is adapted into Afenda.
 *
 * These are usage STRATEGIES, not separate product themes.
 *
 * Productive:
 *   dense
 *   stable
 *   fixed
 *   task-oriented
 *
 * Expressive:
 *   spacious
 *   prominent
 *   optionally fluid
 *   intentionally rare
 */
export const TYPOGRAPHY_STRATEGIES = {
  expressive: {
    default: false,

    density: "low-information",

    expression: "controlled",
    purpose:
      "Deliberately prominent product moments where communication benefits from increased typographic expression.",

    scaling: "fixed-or-fluid",
  },
  productive: {
    default: true,

    density: "high-information",

    expression: "restrained",
    purpose:
      "Core product work, forms, tables, navigation, dashboards, records, workflows, and operational interfaces.",

    scaling: "fixed",
  },
} as const;

export type TypographyStrategy = keyof typeof TYPOGRAPHY_STRATEGIES;

// -----------------------------------------------------------------------------
// STRATEGY RULES
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_STRATEGY_RULES = [
  {
    id: "AF-TYP-011",

    rule: "Productive typography is the default strategy for authenticated Afenda workspaces.",
    strength: "must",
  },

  {
    id: "AF-TYP-012",

    rule: "Expressive typography requires a defined communication purpose and must not be introduced merely to make a screen appear more visually interesting.",
    strength: "must",
  },

  {
    id: "AF-TYP-013",

    rule: "Tables, forms, menus, navigation, operational dialogs, and dense workflow surfaces use productive typography.",
    strength: "must",
  },

  {
    id: "AF-TYP-014",

    rule: "Expressive typography is limited to sparse moments such as prominent introductions, major empty states, onboarding, or equivalent communication-led contexts.",
    strength: "should",
  },

  {
    id: "AF-TYP-015",

    rule: "A productive component must not become expressive solely because it is rendered inside an expressive page.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TYPEFACE SLOTS
// -----------------------------------------------------------------------------

/**
 * Level 1 defines semantic typeface purposes.
 *
 * Level 2 chooses actual font-family implementations.
 *
 * Afenda deliberately does NOT encode:
 *
 *   Roboto
 *   IBM Plex
 *   Inter
 *   Geist
 *   etc.
 *
 * in Level 1.
 */
export const TYPEFACE_SLOTS = {
  brand: {
    purpose:
      "Optional expressive face used only where the typography contract explicitly permits brand expression.",

    required: false,

    tenantCustomisable: true,
  },

  mono: {
    purpose:
      "Monospaced face for literal code and technical content whose character-cell regularity is meaningful.",

    required: true,

    tenantCustomisable: false,
  },
  ui: {
    purpose:
      "Primary interface face for productive application typography, forms, controls, navigation, data, and body content.",

    required: true,

    tenantCustomisable: false,
  },
} as const;

export type TypefaceSlot = keyof typeof TYPEFACE_SLOTS;

// -----------------------------------------------------------------------------
// TYPEFACE RULES
// -----------------------------------------------------------------------------

export const TYPEFACE_RULES = [
  {
    id: "AF-TYP-016",

    rule: "Core productive application typography resolves through the ui typeface slot.",
    strength: "must",
  },

  {
    id: "AF-TYP-017",

    rule: "The mono slot is used because monospaced character geometry carries technical meaning, not as visual decoration.",
    strength: "must",
  },

  {
    id: "AF-TYP-018",

    rule: "Brand typography must not replace productive UI typography in dense application interfaces.",
    strength: "must",
  },

  {
    id: "AF-TYP-019",

    rule: "Typeface substitution must preserve the semantic hierarchy and accessibility requirements of the role.",
    strength: "must",
  },

  {
    id: "AF-TYP-020",

    rule: "A role does not change semantic identity when its resolved typeface changes for script support.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// HIGH-LEVEL TAXONOMY
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_DOMAINS = {
  body: {
    purpose: "Continuous or explanatory reading.",
  },

  code: {
    purpose: "Literal code and machine-oriented technical content.",
  },

  control: {
    purpose: "Interactive labels and form semantics.",
  },

  data: {
    purpose:
      "Structured values, tables, metrics, numbers, and technical identifiers.",
  },
  display: {
    purpose: "Rare high-prominence communication.",
  },

  heading: {
    purpose: "Structural hierarchy and navigation through information.",
  },

  supporting: {
    purpose: "Secondary explanation, metadata, caption, and legal information.",
  },
} as const;

export type TypographyDomain = keyof typeof TYPOGRAPHY_DOMAINS;

// -----------------------------------------------------------------------------
// SEMANTIC ROLES
// -----------------------------------------------------------------------------

/**
 * Afenda deliberately does NOT expose Material's entire:
 *
 *   Display L/M/S
 *   Headline L/M/S
 *   Title L/M/S
 *   Body L/M/S
 *   Label L/M/S
 *
 * as product-facing semantics.
 *
 * Those are excellent scale categories but too generic for enterprise
 * application authoring.
 *
 * Afenda names roles by PRODUCT PURPOSE.
 */
export const TYPE_ROLES = {
  // ---------------------------------------------------------------------------
  // CONTROL
  // ---------------------------------------------------------------------------

  action: {
    densitySensitive: true,
    domain: "control",

    purpose:
      "Text identifying an interactive action such as a button, menu action, tab, or equivalent control.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  // ---------------------------------------------------------------------------
  // BODY
  // ---------------------------------------------------------------------------

  body: {
    densitySensitive: false,
    domain: "body",

    purpose: "Standard prose, explanation, descriptions, and reading content.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  "body-compact": {
    densitySensitive: true,
    domain: "body",

    purpose:
      "Short-form body content inside space-efficient product components.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  caption: {
    densitySensitive: true,
    domain: "supporting",

    purpose:
      "Compact contextual information, annotations, timestamps, attribution, or secondary metadata.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  // ---------------------------------------------------------------------------
  // CODE
  // ---------------------------------------------------------------------------

  code: {
    densitySensitive: false,
    domain: "code",

    purpose:
      "Literal source code, command text, formulas, technical syntax, or other content where character-cell distinction is meaningful.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "mono",
  },

  "component-heading": {
    densitySensitive: true,
    domain: "heading",

    purpose:
      "Compact heading identifying a self-contained component, panel, card, group, or dialog region.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  // ---------------------------------------------------------------------------
  // DATA
  // ---------------------------------------------------------------------------

  data: {
    densitySensitive: true,
    domain: "data",

    purpose:
      "Structured non-numeric values in tables, records, lists, grids, and dense business information.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  "data-compact": {
    densitySensitive: true,
    domain: "data",

    purpose:
      "Highly space-efficient structured values where compact presentation is explicitly permitted.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },
  // ---------------------------------------------------------------------------
  // EXPRESSIVE / DISPLAY
  // ---------------------------------------------------------------------------

  display: {
    densitySensitive: false,
    domain: "display",

    purpose:
      "Highest-prominence communication in a deliberately sparse expressive context.",

    scaling: "fluid-eligible",

    strategy: "expressive",

    typeface: "brand-or-ui",
  },

  // ---------------------------------------------------------------------------
  // SUPPORTING
  // ---------------------------------------------------------------------------

  helper: {
    densitySensitive: false,
    domain: "supporting",

    purpose:
      "Supporting explanation associated with a control, field, value, or interaction.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  identifier: {
    densitySensitive: true,
    domain: "data",

    purpose:
      "Business or technical identifier whose exact character sequence must remain readily distinguishable.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui-or-mono",
  },

  label: {
    densitySensitive: true,
    domain: "control",

    purpose:
      "Text naming a field, input, property, option, or compact information category.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  legal: {
    densitySensitive: false,
    domain: "supporting",

    purpose:
      "Legal, statutory, compliance, or similarly necessary supporting information.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  metric: {
    densitySensitive: false,
    domain: "data",

    numericFeatures: ["tabular-figures"],

    purpose:
      "Prominent KPI, aggregate, balance, quantity, or analytical summary value.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  numeric: {
    densitySensitive: true,
    domain: "data",

    numericFeatures: ["tabular-figures"],

    purpose:
      "Numbers that users compare, reconcile, scan vertically, or use in calculation-oriented workflows.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  // ---------------------------------------------------------------------------
  // STRUCTURAL HEADINGS
  // ---------------------------------------------------------------------------

  "page-title": {
    densitySensitive: false,
    domain: "heading",

    purpose:
      "Primary title identifying the current page, record, workspace, or task.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  "section-heading": {
    densitySensitive: false,
    domain: "heading",

    purpose:
      "Heading for a major section within the current page or workspace.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },

  "subsection-heading": {
    densitySensitive: false,
    domain: "heading",

    purpose: "Heading for a nested information group below a section.",

    scaling: "fixed",

    strategy: "productive",

    typeface: "ui",
  },
} as const;

export type TypeRole = keyof typeof TYPE_ROLES;

// -----------------------------------------------------------------------------
// ROLE GROUPS
// -----------------------------------------------------------------------------

export const HEADING_ROLES = [
  "page-title",
  "section-heading",
  "subsection-heading",
  "component-heading",
] as const satisfies readonly TypeRole[];

export const BODY_ROLES = [
  "body",
  "body-compact",
] as const satisfies readonly TypeRole[];

export const CONTROL_ROLES = [
  "action",
  "label",
] as const satisfies readonly TypeRole[];

export const SUPPORTING_ROLES = [
  "helper",
  "caption",
  "legal",
] as const satisfies readonly TypeRole[];

export const DATA_ROLES = [
  "data",
  "data-compact",
  "numeric",
  "metric",
  "identifier",
] as const satisfies readonly TypeRole[];

// -----------------------------------------------------------------------------
// HEADING HIERARCHY
// -----------------------------------------------------------------------------

/**
 * This is visual/semantic prominence, NOT HTML heading rank.
 *
 * Document heading structure is accessibility/content semantics.
 *
 * For example:
 *
 *   page-title
 *
 * will commonly correspond to h1, but typography does not force that DOM
 * decision.
 */
export const HEADING_HIERARCHY = [
  "page-title",
  "section-heading",
  "subsection-heading",
  "component-heading",
] as const;

export const HEADING_RULES = [
  {
    id: "AF-TYP-021",

    rule: "Heading typography communicates structural hierarchy but does not replace semantic heading markup.",
    strength: "must",
  },

  {
    id: "AF-TYP-022",

    rule: "Heading roles must be used according to information structure rather than desired visual size.",
    strength: "must",
  },

  {
    id: "AF-TYP-023",

    rule: "A page should normally have one primary page-title role for the current task or destination.",
    strength: "must",
  },

  {
    id: "AF-TYP-024",

    rule: "Use the shallowest heading hierarchy that accurately communicates the information structure.",
    strength: "should",
  },

  {
    id: "AF-TYP-025",

    rule: "Typography must not simulate hierarchy solely through arbitrary bolding, resizing, or colour changes.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// BODY SEMANTICS
// -----------------------------------------------------------------------------

export const BODY_RULES = [
  {
    id: "AF-TYP-026",

    rule: "Body is the default role for continuous explanatory reading.",
    strength: "must",
  },

  {
    id: "AF-TYP-027",

    rule: "Body-compact is intended for short content in productive components and is not the default role for long-form reading.",
    strength: "must",
  },

  {
    id: "AF-TYP-028",

    rule: "Long-form body content should be presented within a readable measure rather than allowed to span arbitrarily wide containers.",
    strength: "should",
  },

  {
    id: "AF-TYP-029",

    rule: "Density must not reduce long-form body typography merely to fit more content.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// CONTROL TYPOGRAPHY
// -----------------------------------------------------------------------------

export const CONTROL_TYPOGRAPHY_RULES = [
  {
    id: "AF-TYP-030",

    rule: "Action typography identifies executable or navigational controls and must not be used as a generic emphasis style.",
    strength: "must",
  },

  {
    id: "AF-TYP-031",

    rule: "Label typography names fields, properties, options, or compact categories and is distinct from body prose.",
    strength: "must",
  },

  {
    id: "AF-TYP-032",

    rule: "Component contracts determine whether action or label typography is baseline or emphasized.",
    strength: "must",
  },

  {
    id: "AF-TYP-033",

    rule: "Control labels must remain readable and available when user text sizing increases.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// SUPPORTING TYPOGRAPHY
// -----------------------------------------------------------------------------

export const SUPPORTING_RULES = [
  {
    id: "AF-TYP-034",

    rule: "Helper text supplements the associated control or value and must not carry information required solely to understand the primary label.",
    strength: "must",
  },

  {
    id: "AF-TYP-035",

    rule: "Caption typography is supporting information and must not be used to hide important task information through reduced prominence.",
    strength: "must",
  },

  {
    id: "AF-TYP-036",

    rule: "Legal or statutory importance does not justify making required text unreadably small.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// NUMERIC TYPOGRAPHY
// -----------------------------------------------------------------------------

/**
 * This is a major Afenda extension.
 *
 * Monetary values, percentages, quantities, payroll figures, journal amounts,
 * inventory, KPIs, and analytical values all use NUMERIC semantics when
 * comparison matters.
 *
 * Currency / percentage / accounting / date formatting themselves belong to
 * the content/domain-formatting language.
 *
 * Typography owns how comparable glyphs behave.
 */
export const NUMERIC_FEATURES = {
  "lining-figures": {
    purpose:
      "Provide consistent full-height digits where supported and appropriate for business-data presentation.",

    requiredFor: [],
  },

  "slashed-zero": {
    purpose:
      "Increase distinction between zero and letter O where technical identification requires it.",

    requiredFor: [],
  },
  "tabular-figures": {
    purpose:
      "Give digits stable advance widths so vertically arranged numerical information can be compared reliably.",

    requiredFor: ["numeric", "metric"],
  },
} as const;

export type NumericFeature = keyof typeof NUMERIC_FEATURES;

// -----------------------------------------------------------------------------
// NUMERIC RULES
// -----------------------------------------------------------------------------

export const NUMERIC_RULES = [
  {
    id: "AF-TYP-037",

    rule: "Comparable numerical data must use the numeric typography role rather than ordinary body typography.",
    strength: "must",
  },

  {
    id: "AF-TYP-038",

    rule: "Numeric typography must provide tabular figures when the resolved typeface supports them.",
    strength: "must",
  },

  {
    id: "AF-TYP-039",

    rule: "Metric typography is used for prominent summary values and not for ordinary table cells.",
    strength: "must",
  },

  {
    id: "AF-TYP-040",

    rule: "Currency, percentage, accounting, measurement, and date formatting remain content semantics rather than separate typography roles.",
    strength: "must",
  },

  {
    id: "AF-TYP-041",

    rule: "Positive, negative, warning, or financial meaning must not be communicated by typography alone.",
    strength: "must",
  },

  {
    id: "AF-TYP-042",

    rule: "Numeric typography should preserve stable glyph widths across supported weights where the resolved typeface permits it.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// IDENTIFIER / CODE DISTINCTION
// -----------------------------------------------------------------------------

export const TECHNICAL_TEXT_RULES = [
  {
    id: "AF-TYP-043",

    rule: "Code typography is reserved for literal technical syntax or content where monospace structure carries meaning.",
    strength: "must",
  },

  {
    id: "AF-TYP-044",

    rule: "Business identifiers must not automatically use code typography merely because they contain machine-generated characters.",
    strength: "must",
  },

  {
    id: "AF-TYP-045",

    rule: "Identifier typography may resolve to the mono slot where character distinction materially improves task accuracy.",
    strength: "may",
  },

  {
    id: "AF-TYP-046",

    rule: "Monospace typography must not be used as a generic visual indicator of technical sophistication.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// EMPHASIS
// -----------------------------------------------------------------------------

/**
 * M3's baseline / emphasized idea is retained as a semantic modifier.
 *
 * Afenda deliberately does NOT duplicate the entire typescale into:
 *
 *   body
 *   body-emphasized
 *   title
 *   title-emphasized
 *   ...
 *
 * Instead, emphasis is an explicitly permitted modifier of a role.
 */
export const TYPE_EMPHASIS = {
  baseline: {
    purpose: "Default presentation of the semantic type role.",
  },

  emphasized: {
    purpose:
      "Increased emphasis within the same semantic type role without changing information hierarchy.",
  },
} as const;

export type TypeEmphasis = keyof typeof TYPE_EMPHASIS;

// -----------------------------------------------------------------------------
// EMPHASIS ELIGIBILITY
// -----------------------------------------------------------------------------

export const EMPHASIS_ELIGIBILITY = {
  action: ["baseline", "emphasized"],

  body: ["baseline", "emphasized"],

  "body-compact": ["baseline", "emphasized"],

  caption: ["baseline"],

  code: ["baseline"],

  "component-heading": ["baseline", "emphasized"],

  data: ["baseline", "emphasized"],

  "data-compact": ["baseline", "emphasized"],
  display: ["baseline"],

  helper: ["baseline"],

  identifier: ["baseline", "emphasized"],

  label: ["baseline", "emphasized"],

  legal: ["baseline"],

  metric: ["baseline", "emphasized"],

  numeric: ["baseline", "emphasized"],

  "page-title": ["baseline"],

  "section-heading": ["baseline"],

  "subsection-heading": ["baseline"],
} as const satisfies Readonly<Record<TypeRole, readonly TypeEmphasis[]>>;

// -----------------------------------------------------------------------------
// EMPHASIS RULES
// -----------------------------------------------------------------------------

export const EMPHASIS_RULES = [
  {
    id: "AF-TYP-047",

    rule: "Emphasis modifies prominence within a semantic role and does not create a new hierarchy level.",
    strength: "must",
  },

  {
    id: "AF-TYP-048",

    rule: "A component may request emphasized typography only where the role declares emphasized presentation eligible.",
    strength: "must",
  },

  {
    id: "AF-TYP-049",

    rule: "Emphasis must not be used as a substitute for selected, invalid, current, or other interaction state.",
    strength: "must",
  },

  {
    id: "AF-TYP-050",

    rule: "Level 2 determines how emphasized typography differs physically from baseline typography.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// FIXED / FLUID BEHAVIOUR
// -----------------------------------------------------------------------------

export const TYPE_SCALING_BEHAVIOURS = {
  fixed: {
    purpose:
      "Typography retains its governed role metrics across layout breakpoints.",
  },

  fluid: {
    purpose:
      "Typography interpolates within a governed range in response to available presentation space.",
  },
} as const;

export type TypeScalingBehaviour = keyof typeof TYPE_SCALING_BEHAVIOURS;

// -----------------------------------------------------------------------------
// FLUID ELIGIBILITY
// -----------------------------------------------------------------------------

export const FLUID_TYPE_ELIGIBILITY = {
  action: false,

  body: false,
  "body-compact": false,
  caption: false,
  code: false,
  "component-heading": false,

  data: false,
  "data-compact": false,
  display: true,

  helper: false,
  identifier: false,
  label: false,
  legal: false,
  metric: false,
  numeric: false,

  "page-title": false,
  "section-heading": false,
  "subsection-heading": false,
} as const satisfies Readonly<Record<TypeRole, boolean>>;

// -----------------------------------------------------------------------------
// SCALING RULES
// -----------------------------------------------------------------------------

export const TYPE_SCALING_RULES = [
  {
    id: "AF-TYP-051",

    rule: "Productive typography uses fixed role metrics rather than viewport-driven fluid scaling.",
    strength: "must",
  },

  {
    id: "AF-TYP-052",

    rule: "Fluid typography may be used only by roles explicitly declared fluid-eligible.",
    strength: "must",
  },

  {
    id: "AF-TYP-053",

    rule: "Fluid scaling must preserve the semantic hierarchy between adjacent roles throughout its supported range.",
    strength: "must",
  },

  {
    id: "AF-TYP-054",

    rule: "User-controlled text scaling is an accessibility requirement and is not the same mechanism as expressive fluid typography.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// DENSITY
// -----------------------------------------------------------------------------

/**
 * Density may affect selected productive roles.
 *
 * It must not create a parallel typography system.
 */
export const TYPOGRAPHY_DENSITY_POLICY = {
  context: "density" satisfies TokenContextId,

  mayAdapt: [
    "component-heading",
    "body-compact",
    "action",
    "label",
    "caption",
    "data",
    "data-compact",
    "numeric",
    "identifier",
  ],

  mustRemainStable: [
    "display",
    "page-title",
    "section-heading",
    "subsection-heading",
    "body",
    "helper",
    "legal",
    "metric",
    "code",
  ],
} as const;

// -----------------------------------------------------------------------------
// DENSITY RULES
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_DENSITY_RULES = [
  {
    id: "AF-TYP-055",

    rule: "Density adaptation must preserve the semantic identity of the typography role.",
    strength: "must",
  },

  {
    id: "AF-TYP-056",

    rule: "Density must not create new typography roles.",
    strength: "must",
  },

  {
    id: "AF-TYP-057",

    rule: "Density must not reduce typography below the applicable accessibility requirement.",
    strength: "must",
  },

  {
    id: "AF-TYP-058",

    rule: "Long-form reading typography does not shrink merely because the surrounding workspace uses a denser mode.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// SCRIPT ADAPTATION
// -----------------------------------------------------------------------------

/**
 * Script is a typography context.
 *
 * Afenda may vary:
 *
 *   typeface
 *   font metrics
 *   line-height
 *   tracking behaviour
 *
 * where required for the active script.
 *
 * It may NOT change:
 *
 *   semantic role
 *   information hierarchy
 *   importance
 *   interaction meaning
 */
export const TYPOGRAPHY_SCRIPT_CONTEXT = {
  context: "script" satisfies TokenContextId,

  mayResolve: [
    "typeface",
    "size-metric",
    "line-height",
    "tracking",
    "weight-availability",
  ],

  mustPreserve: ["role", "hierarchy", "meaning", "accessibility"],

  semanticChangeAllowed: false,
} as const;

// -----------------------------------------------------------------------------
// SCRIPT GROUPS
// -----------------------------------------------------------------------------

/**
 * These are capability groups, not hardcoded metric policies.
 *
 * Level 2 determines actual font and metric resolution.
 */
export const SCRIPT_GROUPS = [
  "latin",
  "cyrillic",
  "greek",
  "hebrew",
  "arabic",
  "thai",
  "devanagari",
  "han",
  "hangul",
  "kana",
  "other-supported",
] as const;

export type ScriptGroup = (typeof SCRIPT_GROUPS)[number];

// -----------------------------------------------------------------------------
// SCRIPT RULES
// -----------------------------------------------------------------------------

export const SCRIPT_RULES = [
  {
    id: "AF-TYP-059",

    rule: "Typography must be capable of resolving script-appropriate typeface and metrics without changing semantic role identity.",
    strength: "must",
  },

  {
    id: "AF-TYP-060",

    rule: "Line-height and glyph metrics must not assume that Latin typography safely fits every supported writing script.",
    strength: "must",
  },

  {
    id: "AF-TYP-061",

    rule: "A fallback typeface must preserve readable hierarchy and required character coverage.",
    strength: "must",
  },

  {
    id: "AF-TYP-062",

    rule: "Missing glyphs or unsupported script coverage are conformance failures for declared supported locales.",
    strength: "must",
  },

  {
    id: "AF-TYP-063",

    rule: "Script adaptation must not rely on scaling the entire interface as a substitute for appropriate typography metrics.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// DIRECTION RELATIONSHIP
// -----------------------------------------------------------------------------

/**
 * Direction and script are related but different.
 *
 * Arabic:
 *   script = arabic
 *   direction = rtl
 *
 * Latin:
 *   script = latin
 *   direction may still appear inside an RTL document.
 */
export const TYPOGRAPHY_DIRECTION_RELATIONSHIP = {
  directionContext: "direction",

  independent: true,
  scriptContext: "script",
} as const;

// -----------------------------------------------------------------------------
// TEXT ALIGNMENT
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_ALIGNMENT = {
  code: "logical-start",

  controls: "component-defined",

  headings: "logical-start",

  numericalData: "component-defined",
  prose: "logical-start",
} as const;

export const ALIGNMENT_RULES = [
  {
    id: "AF-TYP-064",

    rule: "Productive text and headings use logical-start alignment unless the content or component has a stronger semantic reason otherwise.",
    strength: "should",
  },

  {
    id: "AF-TYP-065",

    rule: "Alignment must use writing-direction-aware semantics rather than assuming physical left alignment.",
    strength: "must",
  },

  {
    id: "AF-TYP-066",

    rule: "Numeric alignment policy belongs to the consuming data component or pattern rather than to typography alone.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TEXT TRANSFORMATION
// -----------------------------------------------------------------------------

export const TEXT_TRANSFORMATION_RULES = [
  {
    id: "AF-TYP-067",

    rule: "Case transformation must not be used as the sole mechanism for communicating hierarchy.",
    strength: "must",
  },

  {
    id: "AF-TYP-068",

    rule: "Productive interface typography should preserve sentence or content case rather than rely on all-uppercase styling.",
    strength: "should",
  },

  {
    id: "AF-TYP-069",

    rule: "Acronyms, identifiers, and legally required casing are content semantics rather than decorative typography transformations.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TRUNCATION RELATIONSHIP
// -----------------------------------------------------------------------------

/**
 * Accessibility owns the complete truncation contract.
 *
 * Typography defines only the language-level relationship.
 */
export const TYPOGRAPHY_TRUNCATION = {
  default: "content remains readable rather than being visually clipped",

  ellipsis:
    "permitted only where the component contract provides access to the complete information when required",
  owner: "accessibility",
} as const;

export const TYPOGRAPHY_TRUNCATION_RULES = [
  {
    id: "AF-TYP-070",

    rule: "Typography must not assume fixed single-line presentation for content whose complete meaning is required.",
    strength: "must",
  },

  {
    id: "AF-TYP-071",

    rule: "Truncation must not make essential information permanently unavailable.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// USER TEXT SCALE
// -----------------------------------------------------------------------------

export const USER_TEXT_SCALE_POLICY = {
  independentOf: [
    "productive-density",
    "expressive-fluid-scaling",
    "viewport-breakpoints",
  ],
  owner: "accessibility",

  required: true,
} as const;

// -----------------------------------------------------------------------------
// TENANT CUSTOMISATION
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_TENANT_POLICY = {
  context: "tenant" satisfies TokenContextId,

  customisable: ["brand-typeface-slot"],

  default: "closed",

  protected: [
    "ui-typeface-slot",
    "mono-typeface-slot",
    "semantic-type-roles",
    "hierarchy",
    "productive-strategy",
    "data-numeric-features",
    "accessibility",
  ],
} as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_TENANT_RULES = [
  {
    id: "AF-TYP-072",

    rule: "Tenant typography customisation is limited to roles explicitly permitted to use the brand typeface slot.",
    strength: "must",
  },

  {
    id: "AF-TYP-073",

    rule: "Tenant fonts must not replace the productive UI typeface across core application workflows.",
    strength: "must",
  },

  {
    id: "AF-TYP-074",

    rule: "Tenant typography must preserve required script coverage and accessibility.",
    strength: "must",
  },

  {
    id: "AF-TYP-075",

    rule: "Tenant typography must not change semantic type-role hierarchy.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// BRAND TYPEFACE ELIGIBILITY
// -----------------------------------------------------------------------------

export const BRAND_TYPEFACE_ELIGIBILITY = {
  action: false,

  body: false,
  "body-compact": false,
  caption: false,
  code: false,
  "component-heading": false,

  data: false,
  "data-compact": false,
  display: true,

  helper: false,
  identifier: false,
  label: false,
  legal: false,
  metric: false,
  numeric: false,

  "page-title": false,
  "section-heading": false,
  "subsection-heading": false,
} as const satisfies Readonly<Record<TypeRole, boolean>>;

// -----------------------------------------------------------------------------
// ACCESSIBILITY REQUIREMENTS
// -----------------------------------------------------------------------------

/**
 * 08-accessibility.ts owns numeric accessibility requirements.
 *
 * Typography declares what must be validated.
 */
export const TYPOGRAPHY_ACCESSIBILITY_REQUIREMENTS = [
  "text-resize",
  "text-reflow",
  "readable-line-height",
  "script-legibility",
  "content-not-clipped",
  "truncation-recovery",
  "semantic-heading-structure",
  "contrast",
] as const;

export const TYPOGRAPHY_ACCESSIBILITY_RULES = [
  {
    id: "AF-TYP-076",

    rule: "Typography must remain usable under the supported user text-scaling requirement.",
    strength: "must",
  },

  {
    id: "AF-TYP-077",

    rule: "Components must allow required text to grow without clipping, overlapping, or losing function.",
    strength: "must",
  },

  {
    id: "AF-TYP-078",

    rule: "Visual type roles must not replace semantic document and accessibility structure.",
    strength: "must",
  },

  {
    id: "AF-TYP-079",

    rule: "Supporting typography must remain readable rather than relying on excessively small size or weak contrast to achieve hierarchy.",
    strength: "must",
  },

  {
    id: "AF-TYP-080",

    rule: "Typography must support all characters required by Afenda's declared locale and script support.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// PUBLIC API
// -----------------------------------------------------------------------------

/**
 * Application code requests semantic roles.
 *
 * It does NOT request:
 *
 *   font-size
 *   font-family
 *   weight
 *   line-height
 *   tracking
 *
 * directly for governed typography.
 */
export const TYPOGRAPHY_PUBLIC_API = {
  body: ["body", "body-compact"],

  control: ["action", "label"],

  data: ["data", "data-compact", "numeric", "metric", "identifier"],
  display: ["display"],

  heading: [
    "page-title",
    "section-heading",
    "subsection-heading",
    "component-heading",
  ],

  modifier: ["baseline", "emphasized"],

  supporting: ["helper", "caption", "legal"],

  technical: ["code"],
} as const;

// -----------------------------------------------------------------------------
// TOKEN ROLE IDS
// -----------------------------------------------------------------------------

/**
 * Canonical system-token identities.
 *
 * Actual values belong to Level 2.
 */
export const TYPOGRAPHY_SYSTEM_TOKENS = {
  action: "af.sys.type.action",

  body: "af.sys.type.body",

  "body-compact": "af.sys.type.body-compact",

  caption: "af.sys.type.caption",

  code: "af.sys.type.code",

  "component-heading": "af.sys.type.component-heading",

  data: "af.sys.type.data",

  "data-compact": "af.sys.type.data-compact",
  display: "af.sys.type.display",

  helper: "af.sys.type.helper",

  identifier: "af.sys.type.identifier",

  label: "af.sys.type.label",

  legal: "af.sys.type.legal",

  metric: "af.sys.type.metric",

  numeric: "af.sys.type.numeric",

  "page-title": "af.sys.type.page-title",

  "section-heading": "af.sys.type.section-heading",

  "subsection-heading": "af.sys.type.subsection-heading",
} as const satisfies Readonly<Record<TypeRole, string>>;

// -----------------------------------------------------------------------------
// SYSTEM TOKEN DEFINITION
// -----------------------------------------------------------------------------

export interface TypographyTokenDefinition extends SystemTokenDefinition {
  readonly category: "type";

  readonly densitySensitive: boolean;

  readonly domain: TypographyDomain;

  readonly emphasis: TypeEmphasis;

  readonly numericFeatures?: readonly NumericFeature[];

  readonly role: TypeRole;

  readonly scaling: TypeScalingBehaviour;

  readonly scriptSensitive: boolean;

  readonly strategy: TypographyStrategy;
  readonly tier: "system";

  readonly typefaceSlot: TypefaceSlot;
}

// -----------------------------------------------------------------------------
// IMPLEMENTATION PROPERTIES
// -----------------------------------------------------------------------------

/**
 * A complete Level-2 typography role must be capable of resolving these
 * properties where applicable.
 *
 * Level 1 defines the property vocabulary but NOT the values.
 */
export const TYPOGRAPHY_PROPERTIES = [
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
] as const;

export const OPTIONAL_TYPOGRAPHY_PROPERTIES = [
  "font-style",
  "font-feature-settings",
  "font-variation-settings",
  "font-variant-numeric",
] as const;

// -----------------------------------------------------------------------------
// TYPOGRAPHY IMPLEMENTATION RULES
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_IMPLEMENTATION_RULES = [
  {
    id: "AF-TYP-081",

    rule: "A Level-2 typography role resolves all properties required to render that role consistently.",
    strength: "must",
  },

  {
    id: "AF-TYP-082",

    rule: "Application code must not reconstruct governed typography from independent font-size, weight, and line-height values.",
    strength: "must",
  },

  {
    id: "AF-TYP-083",

    rule: "Component typography must resolve through system or component typography roles according to the token-language dependency contract.",
    strength: "must",
  },

  {
    id: "AF-TYP-084",

    rule: "Font feature configuration required for numeric or code semantics is part of the resolved typography role rather than an application-call-site concern.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// FORBIDDEN USAGE
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_FORBIDS = [
  {
    behaviour:
      "application code selects governed typography using arbitrary font-size values",
    id: "AF-TYP-085",
    strength: "must",
  },

  {
    behaviour:
      "application code selects governed typography using arbitrary font-weight values",
    id: "AF-TYP-086",
    strength: "must",
  },

  {
    behaviour:
      "application code creates local heading styles solely to achieve a desired visual size",
    id: "AF-TYP-087",
    strength: "must",
  },

  {
    behaviour:
      "monospace typography is used decoratively rather than semantically",
    id: "AF-TYP-088",
    strength: "must",
  },

  {
    behaviour:
      "expressive typography is introduced inside dense operational components",
    id: "AF-TYP-089",
    strength: "must",
  },

  {
    behaviour: "tenant fonts replace protected productive or data typography",
    id: "AF-TYP-090",
    strength: "must",
  },

  {
    behaviour:
      "fluid typography is introduced for a role not declared fluid-eligible",
    id: "AF-TYP-091",
    strength: "must",
  },

  {
    behaviour:
      "typographic size or weight is used as the only representation of semantic application state",
    id: "AF-TYP-092",
    strength: "must",
  },

  {
    behaviour:
      "a currency, percentage, date, or accounting format is promoted into a typography role when its difference is content formatting rather than typography",
    id: "AF-TYP-093",
    strength: "must",
  },

  {
    behaviour:
      "Latin font metrics are assumed to be universally safe for every declared supported writing script",
    id: "AF-TYP-094",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// SOURCE PROVENANCE
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_SOURCES = [
  {
    adaptation:
      "Afenda adopts Carbon's productive-first strategy but replaces Carbon's numbered token vocabulary with product-semantic Afenda roles.",

    contribution: [
      "productive and expressive typography strategy",
      "fixed typography for dense product experiences",
      "fluid typography for expressive presentation",
      "compact and long-form body distinction",
      "label, helper, legal, and code utility semantics",
      "enterprise product typography discipline",
    ],

    disposition: "adapt",
    id: "carbon-typography",

    system: "IBM Carbon Design System",
  },

  {
    adaptation:
      "Afenda adopts the global and information-design principles without requiring IBM Plex or IBM's concrete type scale in Level 1.",

    contribution: [
      "global script awareness",
      "reading-oriented leading and measure",
      "strong alignment discipline",
      "enterprise information typography",
      "monospace distinction for technical content",
    ],

    disposition: "adapt",
    id: "ibm-design-language-typography",

    system: "IBM Design Language",
  },

  {
    adaptation:
      "Afenda retains the semantic-role and emphasis concepts but replaces the generic 15-role Material scale with purpose-specific enterprise roles.",

    contribution: [
      "semantic type-role architecture",
      "display, headline, title, body, and label role classes",
      "brand and plain typeface separation",
      "baseline and emphasized typography",
      "script-aware typography principle",
    ],

    disposition: "adapt",
    id: "m3-typography",

    system: "Material 3",
  },
] as const satisfies readonly {
  id: string;
  system: string;
  disposition: SourceDisposition;
  contribution: readonly string[];
  adaptation: string;
}[];

// -----------------------------------------------------------------------------
// SOURCE DISPOSITION
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_SOURCE_DISPOSITION = {
  "carbon-body-compact": "adopt",

  "carbon-body-long": "adapt",

  "carbon-expressive-strategy": "adapt",

  "carbon-fixed-product-headings": "adopt",

  "carbon-fluid-expressive-headings": "adapt",

  "carbon-label-helper-legal-code": "adapt",

  "carbon-numbered-token-names": "reject",
  // Carbon

  "carbon-productive-strategy": "adopt",

  "ibm-global-type-scale": "defer",

  "ibm-logical-reading-alignment": "adapt",

  "ibm-plex-as-required-typeface": "reject",

  // IBM Design Language

  "ibm-script-aware-metrics": "adopt",

  "m3-baseline-emphasized-model": "adapt",

  "m3-brand-plain-typeface-model": "adapt",

  "m3-display-headline-title-body-label-taxonomy": "adapt",

  // M3

  "m3-role-based-typescale": "adopt",

  "m3-script-line-height-awareness": "adopt",

  "m3-three-sizes-per-role": "reject",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// -----------------------------------------------------------------------------
// LEVEL-2 OBLIGATIONS
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-TYP-095",

    obligation:
      "Every active type role has a deterministic Level-2 implementation.",
    strength: "must",
  },

  {
    id: "AF-TYP-096",

    obligation:
      "Every declared supported script has a valid typeface and metric resolution path.",
    strength: "must",
  },

  {
    id: "AF-TYP-097",

    obligation:
      "Numeric and metric roles resolve the required numeric font features.",
    strength: "must",
  },

  {
    id: "AF-TYP-098",

    obligation:
      "Productive typography remains fixed across layout breakpoints except for user-controlled accessibility scaling.",
    strength: "must",
  },

  {
    id: "AF-TYP-099",

    obligation:
      "Brand typography is applied only to roles declared brand-typeface eligible.",
    strength: "must",
  },

  {
    id: "AF-TYP-100",

    obligation:
      "Density-specific typography resolution is limited to roles declared density-sensitive.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// LEVEL-3 PROOF REQUIREMENTS
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-TYP-101",

    prove: "every active typography role has a complete Level-2 resolution",
  },

  {
    id: "AF-TYP-102",

    prove:
      "application code does not reconstruct governed typography from arbitrary values",
  },

  {
    id: "AF-TYP-103",

    prove: "productive components consume productive type roles",
  },

  {
    id: "AF-TYP-104",

    prove: "fluid typography appears only in fluid-eligible roles",
  },

  {
    id: "AF-TYP-105",

    prove: "brand typeface resolution occurs only in brand-eligible roles",
  },

  {
    id: "AF-TYP-106",

    prove: "numeric roles provide the required numerical font features",
  },

  {
    id: "AF-TYP-107",

    prove: "declared supported scripts resolve without missing glyphs",
  },

  {
    id: "AF-TYP-108",

    prove: "density does not alter roles declared density-invariant",
  },

  {
    id: "AF-TYP-109",

    prove: "required content remains available under supported text scaling",
  },

  {
    id: "AF-TYP-110",

    prove:
      "component public APIs do not expose arbitrary typography values that bypass Level-1 roles",
  },
] as const;

// -----------------------------------------------------------------------------
// CONFORMANCE
// -----------------------------------------------------------------------------

export const TYPOGRAPHY_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "role-validated",
    "consumer-validated",
    "script-validated",
    "scaling-validated",
    "accessibility-validated",
  ],

  implementation: [
    "role-resolved",
    "script-resolved",
    "numeric-feature-resolved",
    "density-resolved",
  ],
  language: [
    "role-defined",
    "hierarchy-defined",
    "strategy-defined",
    "typeface-slot-defined",
    "scaling-defined",
    "script-policy-defined",
    "density-policy-defined",
  ],
} as const;

// -----------------------------------------------------------------------------
// PUBLIC TYPES
// -----------------------------------------------------------------------------

export type TypeRoleDefinition = (typeof TYPE_ROLES)[TypeRole];

export type HeadingRole = (typeof HEADING_ROLES)[number];

export type BodyRole = (typeof BODY_ROLES)[number];

export type ControlRole = (typeof CONTROL_ROLES)[number];

export type SupportingRole = (typeof SUPPORTING_ROLES)[number];

export type DataRole = (typeof DATA_ROLES)[number];

export type TypographySystemToken = (typeof TYPOGRAPHY_SYSTEM_TOKENS)[TypeRole];

export type TypographyPublicApi = typeof TYPOGRAPHY_PUBLIC_API;
