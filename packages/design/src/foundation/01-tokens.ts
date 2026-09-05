/**
 * AFENDA DESIGN LANGUAGE — TOKENS
 *
 * L1.01
 *
 * Defines the semantic grammar through which design decisions become
 * addressable by Level 2.
 *
 * This file defines:
 *
 *   - token tiers
 *   - token categories
 *   - token identity
 *   - naming grammar
 *   - dependency direction
 *   - aliasing
 *   - ownership
 *   - contexts
 *   - contextual resolution
 *   - tenant boundaries
 *   - component-token rules
 *   - public token API
 *   - constraints
 *   - provenance
 *
 * It deliberately defines NO token values.
 *
 * No:
 *   - hex
 *   - rgb
 *   - oklch
 *   - px
 *   - rem
 *   - font families
 *   - durations
 *   - easing curves
 *   - shadows
 *   - z-index numbers
 *   - CSS custom properties
 *   - Tailwind utilities
 *
 * Those belong to Level 2.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-002 Role before value
 *   AF-PRI-010 Public UI APIs are finite
 */

// -----------------------------------------------------------------------------
// IDENTITY
// -----------------------------------------------------------------------------

export const TOKEN_LANGUAGE = {
  code: "TOK",
  id: "token",
  level: 1,
  order: 1,

  purpose:
    "Define how Afenda names, relates, resolves, exposes, and governs design tokens without defining their implementation values.",
  version: "1.0.0",
} as const;

// -----------------------------------------------------------------------------
// PRINCIPLE
// -----------------------------------------------------------------------------

export const TOKEN_PRINCIPLES = [
  {
    id: "AF-TOK-001",

    statement:
      "A token represents a stable design decision or semantic role, not an arbitrary implementation value.",
    strength: "must",
  },

  {
    id: "AF-TOK-002",

    statement:
      "Consumers request semantic meaning; Level 2 resolves that meaning to implementation values.",
    strength: "must",
  },

  {
    id: "AF-TOK-003",

    statement:
      "Token indirection exists only where it creates semantic ownership, contextual resolution, reuse, or governable change.",
    strength: "must",
  },

  {
    id: "AF-TOK-004",

    statement:
      "Token names describe what a value means or where it belongs, never what the current value happens to look like.",
    strength: "must",
  },

  {
    id: "AF-TOK-005",

    statement:
      "A token has one authoritative owner and may be referenced by many consumers.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN TIERS
// -----------------------------------------------------------------------------

/**
 * Tokens form a directed semantic dependency graph:
 *
 *        literal
 *           │
 *           ▼
 *      reference
 *           │
 *           ▼
 *        system
 *           │
 *           ▼
 *       component
 *
 * Application and component code should normally consume system or component
 * roles rather than reference tokens.
 */
export const TOKEN_TIERS = {
  component: {
    code: "comp",

    examples: [
      "button container",
      "field border",
      "data-grid selected row",
      "dialog scrim",
    ],

    intendedConsumers: ["owning-component"],

    mayResolveTo: ["system", "reference"],

    publicToProductCode: false,

    purpose:
      "Component-scoped semantic decisions required when a system role alone cannot accurately describe a component part.",
  },
  reference: {
    code: "ref",

    examples: [
      "colour scale step",
      "spacing scale step",
      "radius scale step",
      "type metric option",
      "motion duration option",
    ],

    intendedConsumers: ["system-token"],

    mayResolveTo: ["literal"],

    publicToProductCode: false,

    purpose:
      "Context-independent design options from which semantic decisions may resolve.",
  },

  system: {
    code: "sys",

    examples: [
      "surface role",
      "content role",
      "status role",
      "section spacing",
      "control shape",
      "body typography",
      "feedback motion",
    ],

    intendedConsumers: [
      "component-token",
      "component",
      "pattern",
      "layout",
      "application",
    ],

    mayResolveTo: ["reference"],

    publicToProductCode: true,

    purpose:
      "Product-wide semantic design decisions whose meaning remains stable across contexts.",
  },
} as const;

export type TokenTier = keyof typeof TOKEN_TIERS;

// -----------------------------------------------------------------------------
// TIER RULES
// -----------------------------------------------------------------------------

export const TOKEN_TIER_RULES = [
  {
    id: "AF-TOK-006",

    rule: "Reference tokens resolve to implementation literals and do not carry product semantics.",
    strength: "must",
  },

  {
    id: "AF-TOK-007",

    rule: "System tokens carry Afenda-wide semantic meaning and normally resolve through reference tokens.",
    strength: "must",
  },

  {
    id: "AF-TOK-008",

    rule: "Component tokens exist only when a component-specific semantic decision cannot be represented accurately by an existing system token.",
    strength: "must",
  },

  {
    id: "AF-TOK-009",

    rule: "Component tokens may resolve to system or reference tokens but must not resolve directly to implementation literals.",
    strength: "must",
  },

  {
    id: "AF-TOK-010",

    rule: "Reference tokens must not depend on system or component tokens.",
    strength: "must",
  },

  {
    id: "AF-TOK-011",

    rule: "System tokens must not depend on component tokens.",
    strength: "must",
  },

  {
    id: "AF-TOK-012",

    rule: "A component token must belong to exactly one component contract.",
    strength: "must",
  },

  {
    id: "AF-TOK-013",

    rule: "A component should consume system tokens directly when no component-specific semantic decision is required.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN CATEGORIES
// -----------------------------------------------------------------------------

/**
 * Categories describe the kind of design decision represented.
 *
 * Categories do not define the complete semantic taxonomy of that domain.
 * For example, `color` owns colour values, while 02-color.ts defines the
 * semantic colour roles Afenda exposes.
 */
export const TOKEN_CATEGORIES = [
  {
    id: "color",
    owner: "color",

    responsibility: "Colour values and semantic colour roles.",
  },

  {
    id: "type",
    owner: "typography",

    responsibility:
      "Typeface, size, weight, line-height, tracking, numeric, and other typographic properties.",
  },

  {
    id: "space",
    owner: "geometry",

    responsibility:
      "Spacing relationships including gap, padding, margin, and layout rhythm.",
  },

  {
    id: "size",
    owner: "geometry",

    responsibility:
      "Governed dimensions including controls, targets, icons, handles, and structural sizes.",
  },

  {
    id: "shape",
    owner: "geometry",

    responsibility: "Corner and shape semantics.",
  },

  {
    id: "elevation",
    owner: "geometry",

    responsibility: "Perceived surface elevation and separation.",
  },

  {
    id: "layer",
    owner: "geometry",

    responsibility:
      "Logical stacking and overlay ordering independent of visual elevation.",
  },

  {
    id: "opacity",
    owner: "geometry",

    responsibility:
      "Governed transparency where opacity itself carries reusable design meaning.",
  },

  {
    id: "motion",
    owner: "motion",

    responsibility: "Duration, easing, and other reusable motion parameters.",
  },
] as const;

export type TokenCategory = (typeof TOKEN_CATEGORIES)[number]["id"];

// -----------------------------------------------------------------------------
// CATEGORY OWNERSHIP
// -----------------------------------------------------------------------------

export const TOKEN_CATEGORY_OWNERS = {
  color: "color",
  elevation: "geometry",
  layer: "geometry",

  motion: "motion",
  opacity: "geometry",
  shape: "geometry",
  size: "geometry",

  space: "geometry",
  type: "typography",
} as const satisfies Readonly<Record<TokenCategory, string>>;

// -----------------------------------------------------------------------------
// WHAT IS NOT A TOKEN CATEGORY
// -----------------------------------------------------------------------------

/**
 * These concepts may select, compose, or consume tokens, but they are
 * behavioural or structural semantics and therefore are not token categories.
 */
export const NON_TOKEN_DOMAINS = [
  "layout",
  "interaction",
  "accessibility",
  "content",
  "component-anatomy",
  "workflow-state",
  "business-state",
] as const;

export const NON_TOKEN_RULES = [
  {
    id: "AF-TOK-014",

    rule: "A concept does not become a token merely because Level 2 needs a configurable value.",
    strength: "must",
  },

  {
    id: "AF-TOK-015",

    rule: "Behavioural states select or alter design roles but remain interaction semantics rather than token categories.",
    strength: "must",
  },

  {
    id: "AF-TOK-016",

    rule: "Business and workflow states remain product semantics even when colour or typography tokens represent them visually.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN IDENTITY
// -----------------------------------------------------------------------------

/**
 * Canonical conceptual token grammar:
 *
 *   af.<tier>.<category>.<role>
 *
 * Examples:
 *
 *   af.ref.color.neutral.900
 *   af.sys.color.surface.base
 *   af.sys.space.section
 *   af.sys.type.body
 *   af.comp.button.container.color
 *
 * This is a LANGUAGE identity.
 *
 * It does not require Level 2 CSS custom properties, TypeScript properties,
 * Tailwind names, JSON paths, or generated artifacts to use identical syntax.
 */
export const TOKEN_IDENTITY = {
  grammar: {
    component: "af.comp.<component>.<part>.<property>",
    reference: "af.ref.<category>.<option>",
    system: "af.sys.<category>.<role>",
  },
  prefix: "af",

  separator: ".",
} as const;

// -----------------------------------------------------------------------------
// TOKEN NAME SEGMENTS
// -----------------------------------------------------------------------------

export const TOKEN_NAME_SEGMENTS = {
  category: {
    description: "Identifies the design property family governed by the token.",
    required: true,
  },

  component: {
    description: "Identifies the owning component for a component token.",
    requiredFor: ["component"],
  },

  part: {
    description:
      "Identifies the semantic anatomy part governed by a component token.",
    requiredFor: ["component"],
  },
  prefix: {
    description: "Identifies the Afenda design language.",
    required: true,
  },

  property: {
    description:
      "Identifies the governed design property of the component part.",
    requiredFor: ["component"],
  },

  role: {
    description: "Identifies the semantic purpose or reference option.",
    required: true,
  },

  tier: {
    description:
      "Identifies reference, system, or component semantic ownership.",
    required: true,
  },
} as const;

// -----------------------------------------------------------------------------
// TOKEN NAMING RULES
// -----------------------------------------------------------------------------

export const TOKEN_NAMING_RULES = [
  {
    id: "AF-TOK-017",

    rule: "Token names progress from general ownership to specific semantic purpose.",
    strength: "must",
  },

  {
    id: "AF-TOK-018",

    rule: "System and component token names describe semantic purpose rather than current visual appearance.",
    strength: "must",
  },

  {
    id: "AF-TOK-019",

    rule: "Token names must not encode literal implementation values.",
    strength: "must",
  },

  {
    id: "AF-TOK-020",

    rule: "Token names must not encode implementation frameworks, CSS technologies, or utility-library terminology.",
    strength: "must",
  },

  {
    id: "AF-TOK-021",

    rule: "Token names must not encode theme names, tenant names, or other contextual values that belong to resolution.",
    strength: "must",
  },

  {
    id: "AF-TOK-022",

    rule: "A semantic token keeps the same identity when its resolved value changes.",
    strength: "must",
  },

  {
    id: "AF-TOK-023",

    rule: "Use the shortest token name that uniquely communicates the token's semantic ownership and purpose.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// INVALID SEMANTIC NAMING
// -----------------------------------------------------------------------------

export const INVALID_SYSTEM_TOKEN_NAME_CONCEPTS = [
  "blue",
  "red",
  "10px",
  "16px",
  "rounded-12",
  "shadow-lg",
  "duration-200",
  "dark-only",
  "tenant-acme",
  "tailwind-primary",
  "shadcn-border",
] as const;

/**
 * These words are not globally forbidden strings.
 *
 * The rule is that implementation appearance must not replace semantic meaning
 * in SYSTEM or COMPONENT token identity.
 */
export const APPEARANCE_BASED_SYSTEM_NAMING_ALLOWED = false;

// -----------------------------------------------------------------------------
// REFERENCE TOKEN SEMANTICS
// -----------------------------------------------------------------------------

/**
 * Reference tokens are intentionally different.
 *
 * A reference token names an available option, so scale or palette identity
 * may legitimately appear there.
 *
 * Example:
 *
 *   af.ref.color.neutral.900
 *
 * is valid because it identifies an option rather than product meaning.
 */
export const REFERENCE_TOKEN_RULES = [
  {
    id: "AF-TOK-024",

    rule: "Reference tokens identify context-independent design options rather than product semantics.",
    strength: "must",
  },

  {
    id: "AF-TOK-025",

    rule: "Reference scale names must remain stable independently of which system roles currently resolve to them.",
    strength: "must",
  },

  {
    id: "AF-TOK-026",

    rule: "Reference-token naming may describe scale position, family, or measurable option identity because reference tokens are not semantic product roles.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// SYSTEM TOKEN SEMANTICS
// -----------------------------------------------------------------------------

export const SYSTEM_TOKEN_RULES = [
  {
    id: "AF-TOK-027",

    rule: "A system token represents one Afenda-wide semantic decision.",
    strength: "must",
  },

  {
    id: "AF-TOK-028",

    rule: "A system token may vary by governed context without changing its semantic identity.",
    strength: "must",
  },

  {
    id: "AF-TOK-029",

    rule: "If two uses have different semantic meaning, they must not share a system-token identity merely because their current values are equal.",
    strength: "must",
  },

  {
    id: "AF-TOK-030",

    rule: "If two uses have the same stable semantic meaning, prefer one shared system role over duplicating roles by component.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// COMPONENT TOKEN SEMANTICS
// -----------------------------------------------------------------------------

export const COMPONENT_TOKEN_PARTS = [
  "container",
  "content",
  "label",
  "icon",
  "indicator",
  "border",
  "supporting-text",
  "track",
  "thumb",
  "handle",
  "scrim",
] as const;

/**
 * This is vocabulary available to component contracts.
 *
 * A component is not required to expose these parts.
 * Its actual anatomy is owned by 10-components/<component>.ts.
 */
export type ComponentTokenPart = (typeof COMPONENT_TOKEN_PARTS)[number];

export const COMPONENT_TOKEN_RULES = [
  {
    id: "AF-TOK-031",

    rule: "A component token exists only for anatomy declared by the owning Level-1 component contract.",
    strength: "must",
  },

  {
    id: "AF-TOK-032",

    rule: "Component-token semantics must not conflict with the meaning of the system token to which they resolve.",
    strength: "must",
  },

  {
    id: "AF-TOK-033",

    rule: "Component tokens must not become an alternative global semantic vocabulary.",
    strength: "must",
  },

  {
    id: "AF-TOK-034",

    rule: "Prefer direct system-token consumption over introducing a component alias whose only purpose is renaming the same meaning.",
    strength: "should",
  },

  {
    id: "AF-TOK-035",

    rule: "Component-token existence does not imply that the token is part of the component's application-facing API.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// ALIASING
// -----------------------------------------------------------------------------

/**
 * An alias preserves semantic indirection.
 *
 * Level 2 may represent aliasing using CSS variables, TypeScript values,
 * generated artifacts, or another mechanism.
 *
 * Level 1 governs the relationship, not the representation.
 */
export const TOKEN_ALIAS_RULES = [
  {
    id: "AF-TOK-036",

    rule: "A token alias points from a more specific semantic decision toward an allowed dependency tier.",
    strength: "must",
  },

  {
    id: "AF-TOK-037",

    rule: "Token alias graphs must be acyclic.",
    strength: "must",
  },

  {
    id: "AF-TOK-038",

    rule: "Every token resolution path must terminate in exactly one implementation value for the active context.",
    strength: "must",
  },

  {
    id: "AF-TOK-039",

    rule: "An unresolved token is a conformance failure rather than an instruction for consumers to provide a fallback value.",
    strength: "must",
  },

  {
    id: "AF-TOK-040",

    rule: "A consumer must not bypass a missing semantic token by reaching into a lower token tier.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// DEPENDENCY GRAPH
// -----------------------------------------------------------------------------

export const TOKEN_DEPENDENCY = {
  component: {
    mayReference: ["system", "reference"],
    resolvesTo: ["system", "reference"],
  },
  reference: {
    mayReference: [],
    resolvesTo: ["literal"],
  },

  system: {
    mayReference: ["reference"],
    resolvesTo: ["reference"],
  },
} as const satisfies Readonly<
  Record<
    TokenTier,
    {
      mayReference: readonly string[];
      resolvesTo: readonly string[];
    }
  >
>;

// -----------------------------------------------------------------------------
// CONSUMPTION BOUNDARIES
// -----------------------------------------------------------------------------

export const TOKEN_CONSUMERS = {
  application: {
    allowed: ["system"],
    discouraged: [],
    forbidden: ["reference", "component"],
  },

  component: {
    allowed: ["system", "own-component"],
    discouraged: [],
    forbidden: ["reference", "foreign-component"],
  },

  pattern: {
    allowed: ["system"],
    discouraged: ["component"],
    forbidden: ["reference"],
  },

  tokenImplementation: {
    allowed: ["reference", "system", "component"],
    discouraged: [],
    forbidden: [],
  },
} as const;

export const TOKEN_CONSUMPTION_RULES = [
  {
    id: "AF-TOK-041",

    rule: "Application code consumes system semantics and does not consume reference tokens directly.",
    strength: "must",
  },

  {
    id: "AF-TOK-042",

    rule: "A component must not consume another component's private component-token namespace.",
    strength: "must",
  },

  {
    id: "AF-TOK-043",

    rule: "A pattern must not create cross-component dependencies by consuming private component tokens.",
    strength: "must",
  },

  {
    id: "AF-TOK-044",

    rule: "Level-2 token implementation is the only layer permitted to bind token identities to literal design values.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// CONTEXTS
// -----------------------------------------------------------------------------

/**
 * Context changes resolution while preserving token identity.
 *
 * Example:
 *
 *   af.sys.color.surface.base
 *
 * remains the same semantic role in:
 *
 *   light
 *   dark
 *   high contrast
 *   tenant A
 *   tenant B
 *
 * Only its resolved implementation value may change.
 */
export const TOKEN_CONTEXTS = [
  {
    examples: ["light", "dark"],
    id: "theme",

    purpose: "Resolve appearance appropriate to the selected visual theme.",

    semanticChangeAllowed: false,
  },

  {
    examples: ["standard", "increased"],
    id: "contrast",

    purpose:
      "Resolve values appropriate to the user's supported contrast preference.",

    semanticChangeAllowed: false,
  },

  {
    examples: ["comfortable", "compact", "dense"],
    id: "density",

    purpose:
      "Resolve governed geometry where density is permitted to alter physical presentation.",

    semanticChangeAllowed: false,
  },

  {
    examples: ["ltr", "rtl"],
    id: "direction",

    purpose: "Resolve directional geometry for supported writing directions.",

    semanticChangeAllowed: false,
  },

  {
    examples: ["latin", "cyrillic", "arabic", "thai", "han", "devanagari"],
    id: "script",

    purpose:
      "Resolve typeface and typographic metrics appropriate to the active writing script without changing semantic type roles.",

    semanticChangeAllowed: false,
  },

  {
    examples: ["default", "tenant-defined"],
    id: "tenant",

    purpose:
      "Resolve tenant-controlled expression through the set of roles explicitly declared tenant-customisable.",

    semanticChangeAllowed: false,
  },
] as const;

export type TokenContext = (typeof TOKEN_CONTEXTS)[number]["id"];

// -----------------------------------------------------------------------------
// CONTEXT RULES
// -----------------------------------------------------------------------------

export const TOKEN_CONTEXT_RULES = [
  {
    id: "AF-TOK-045",

    rule: "Context changes token resolution, not token semantic identity.",
    strength: "must",
  },

  {
    id: "AF-TOK-046",

    rule: "Context axes are independent unless a Level-1 domain explicitly defines a dependency between them.",
    strength: "must",
  },

  {
    id: "AF-TOK-047",

    rule: "The absence of a context-specific override means the token retains its applicable default resolution.",
    strength: "must",
  },

  {
    id: "AF-TOK-048",

    rule: "A context must not be introduced merely to represent a component interaction state.",
    strength: "must",
  },

  {
    id: "AF-TOK-049",

    rule: "Hover, focus, pressed, selected, disabled, invalid, loading, and similar interaction states belong to the interaction or component language and must not become global token-context axes.",
    strength: "must",
  },

  {
    id: "AF-TOK-050",

    rule: "Viewport and container conditions belong to layout adaptation unless they genuinely alter a reusable token resolution.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// CONTEXT COMPOSITION
// -----------------------------------------------------------------------------

/**
 * Contexts may coexist:
 *
 *   tenant
 *   + dark
 *   + increased contrast
 *   + compact density
 *   + rtl
 *
 * Level 1 defines the semantic axes.
 * Level 2 defines their actual resolution strategy.
 * Level 3 proves deterministic resolution.
 */
export const TOKEN_CONTEXT_COMPOSITION = {
  axes: ["tenant", "theme", "contrast", "density", "direction", "script"],
  composable: true,

  deterministicResolutionRequired: true,

  semanticMutationAllowed: false,
} as const;

// -----------------------------------------------------------------------------
// CONTEXT OWNERSHIP
// -----------------------------------------------------------------------------

export const TOKEN_CONTEXT_OWNERS = {
  contrast: "accessibility",
  density: "geometry",
  direction: "content",
  script: "typography",
  tenant: "token",
  theme: "color",
} as const satisfies Readonly<Record<TokenContext, string>>;

// -----------------------------------------------------------------------------
// TENANT CUSTOMISATION
// -----------------------------------------------------------------------------

/**
 * Tenant customisation is a governed token context, not unrestricted theming.
 *
 * Each semantic domain decides which roles MAY vary by tenant.
 */
export const TENANT_TOKEN_POLICY = {
  default: "closed",

  mayCustomise: [
    "declared brand-expression roles",
    "declared tenant typography roles",
    "declared tenant shape expression where permitted",
  ],

  meaning:
    "A token is not tenant-customisable unless its owning Level-1 domain explicitly permits tenant variation.",

  mustNotCustomise: [
    "semantic meaning",
    "accessibility requirements",
    "interaction behaviour",
    "status meaning",
    "workflow meaning",
    "validation meaning",
    "critical safety meaning",
  ],
} as const;

export const TENANT_TOKEN_RULES = [
  {
    id: "AF-TOK-051",

    rule: "Tenant token customisation is deny-by-default.",
    strength: "must",
  },

  {
    id: "AF-TOK-052",

    rule: "A Level-1 domain explicitly declares which of its semantic roles are tenant-customisable.",
    strength: "must",
  },

  {
    id: "AF-TOK-053",

    rule: "Tenant customisation may alter expression but must not alter semantic meaning.",
    strength: "must",
  },

  {
    id: "AF-TOK-054",

    rule: "Tenant customisation must remain subject to all accessibility contracts.",
    strength: "must",
  },

  {
    id: "AF-TOK-055",

    rule: "Tenant customisation must resolve through governed token identities rather than arbitrary consumer-supplied style values.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN LIFECYCLE
// -----------------------------------------------------------------------------

export const TOKEN_LIFECYCLE = [
  "proposed",
  "active",
  "deprecated",
  "retired",
] as const;

export type TokenLifecycle = (typeof TOKEN_LIFECYCLE)[number];

export const TOKEN_LIFECYCLE_RULES = [
  {
    id: "AF-TOK-056",

    rule: "An active token has defined ownership, semantics, tier, category, and resolution.",
    strength: "must",
  },

  {
    id: "AF-TOK-057",

    rule: "A deprecated token remains resolvable during its supported migration period.",
    strength: "must",
  },

  {
    id: "AF-TOK-058",

    rule: "A retired semantic token identity must not be silently reassigned to a different meaning.",
    strength: "must",
  },

  {
    id: "AF-TOK-059",

    rule: "Replacing a token value does not create a new token identity when semantic meaning is unchanged.",
    strength: "must",
  },

  {
    id: "AF-TOK-060",

    rule: "Changing the semantic meaning of a token requires a new semantic identity.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN DEFINITION CONTRACT
// -----------------------------------------------------------------------------

/**
 * This describes what Level 2 must be able to report for a governed token.
 *
 * It does NOT prescribe storage format.
 */
export interface TokenDefinition {
  readonly category: TokenCategory;

  readonly contexts?: readonly TokenContext[];

  readonly description?: string;
  readonly id: string;
  readonly lifecycle: TokenLifecycle;
  readonly owner: string;
  readonly role: string;
  readonly tier: TokenTier;
}

// -----------------------------------------------------------------------------
// SYSTEM TOKEN DEFINITION
// -----------------------------------------------------------------------------

export interface SystemTokenDefinition extends TokenDefinition {
  /**
   * Whether the owning Level-1 semantic domain permits this token's value
   * to vary within the tenant context.
   */
  readonly tenantCustomisable?: boolean;
  readonly tier: "system";
}

// -----------------------------------------------------------------------------
// COMPONENT TOKEN DEFINITION
// -----------------------------------------------------------------------------

export interface ComponentTokenDefinition extends TokenDefinition {
  readonly component: string;

  readonly part: string;

  readonly property: TokenCategory;
  readonly tier: "component";
}

// -----------------------------------------------------------------------------
// REFERENCE TOKEN DEFINITION
// -----------------------------------------------------------------------------

export interface ReferenceTokenDefinition extends TokenDefinition {
  /**
   * Identifies an option in a design-value scale or family.
   *
   * The implementation value itself belongs to Level 2.
   */
  readonly option: string;
  readonly tier: "reference";
}

// -----------------------------------------------------------------------------
// PUBLIC TOKEN API
// -----------------------------------------------------------------------------

/**
 * Level 1 exposes concepts, not a particular TypeScript accessor API.
 *
 * Level 2 may choose:
 *
 *   tokens.color.surface.base
 *   token("color.surface.base")
 *   var(--af-sys-color-surface-base)
 *
 * or another generated representation.
 *
 * Level 3 must prove all representations resolve to the same Level-1 identity.
 */
export const TOKEN_PUBLIC_API = {
  applicationMayRequest: ["system-role"],

  applicationMustNotRequest: [
    "reference-option",
    "foreign-component-role",
    "literal-design-value",
  ],

  componentMayRequest: ["system-role", "own-component-role"],

  semanticIdentityIsImplementationIndependent: true,
} as const;

// -----------------------------------------------------------------------------
// ESCAPE HATCH
// -----------------------------------------------------------------------------

/**
 * Governed systems eventually encounter a legitimate value that has not yet
 * earned reusable token status.
 *
 * Afenda therefore distinguishes:
 *
 *   token-worthy design decision
 *
 * from:
 *
 *   one-off product geometry/content requirement
 *
 * The latter is NOT automatically a token.
 */
export const TOKEN_ESCAPE_HATCH = {
  doesNotImply: [
    "new reference token",
    "new system token",
    "new component token",
  ],
  permitted: true,

  requires: [
    "the value is not already represented by a semantic token",
    "the value does not communicate reusable design semantics",
    "the owning product/component has a legitimate local requirement",
    "the value does not bypass accessibility or tenant constraints",
  ],
} as const;

export const TOKEN_ESCAPE_HATCH_RULES = [
  {
    id: "AF-TOK-061",

    rule: "A one-off implementation value does not automatically justify creation of a token.",
    strength: "must",
  },

  {
    id: "AF-TOK-062",

    rule: "An escape value must not duplicate an existing semantic token merely to avoid using the governed token.",
    strength: "must",
  },

  {
    id: "AF-TOK-063",

    rule: "Repeated escape values with shared semantic purpose should trigger review for promotion into the token language.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// TOKEN CREATION TEST
// -----------------------------------------------------------------------------

/**
 * A new token should exist only when at least one of these conditions is true.
 */
export const TOKEN_CREATION_REASONS = [
  "the value represents reusable semantic meaning",
  "multiple consumers must change together",
  "the value must resolve differently by a governed context",
  "tenant customisation requires a governed semantic boundary",
  "a component needs a stable private semantic decision",
  "Level 3 must govern the value as part of a design invariant",
] as const;

export const TOKEN_CREATION_RULES = [
  {
    id: "AF-TOK-064",

    rule: "A token is created because its semantic or governance role justifies indirection, not merely because a literal value exists.",
    strength: "must",
  },

  {
    id: "AF-TOK-065",

    rule: "Do not create a component token when a stable system token already expresses exactly the same meaning.",
    strength: "should",
  },

  {
    id: "AF-TOK-066",

    rule: "Do not create a system token solely because several unrelated components currently share the same literal value.",
    strength: "should",
  },
] as const;

// -----------------------------------------------------------------------------
// FORBIDDEN TOKEN BEHAVIOUR
// -----------------------------------------------------------------------------

export const TOKEN_FORBIDS = [
  {
    behaviour:
      "application code directly consumes reference tokens for governed design semantics",
    id: "AF-TOK-067",
    strength: "must",
  },

  {
    behaviour:
      "system tokens resolve directly to hardcoded values when a governed reference scale exists for that category",
    id: "AF-TOK-068",
    strength: "must",
  },

  {
    behaviour: "component tokens contain hardcoded implementation values",
    id: "AF-TOK-069",
    strength: "must",
  },

  {
    behaviour: "tenant names appear in canonical semantic-token identities",
    id: "AF-TOK-070",
    strength: "must",
  },

  {
    behaviour:
      "light, dark, density, contrast, or direction variants become separate semantic token identities solely because their values differ",
    id: "AF-TOK-071",
    strength: "must",
  },

  {
    behaviour: "interaction-state meaning is encoded as a global token context",
    id: "AF-TOK-072",
    strength: "must",
  },

  {
    behaviour:
      "component-private tokens are treated as application-level public APIs",
    id: "AF-TOK-073",
    strength: "must",
  },

  {
    behaviour:
      "generated token names introduce semantic decisions absent from Level 1",
    id: "AF-TOK-074",
    strength: "must",
  },

  {
    behaviour:
      "the same semantic identity resolves nondeterministically under the same active contexts",
    id: "AF-TOK-075",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// ADAPTATION
// -----------------------------------------------------------------------------

export const TOKEN_ADAPTATION = {
  contrast: {
    mayChange: [
      "resolved values required to satisfy the supported contrast preference",
    ],

    mustPreserve: ["token identity", "semantic hierarchy", "status meaning"],
  },

  density: {
    mayChange: ["geometry tokens explicitly declared density-sensitive"],

    mustPreserve: [
      "non-density-sensitive tokens",
      "semantic meaning",
      "accessibility floor",
    ],
  },

  direction: {
    mayChange: ["direction-sensitive geometry and directional presentation"],

    mustPreserve: [
      "token identity",
      "information meaning",
      "non-directional geometry",
    ],
  },

  tenant: {
    mayChange: ["roles explicitly declared tenant-customisable"],

    mustPreserve: [
      "semantic meaning",
      "interaction meaning",
      "status meaning",
      "accessibility requirements",
    ],
  },
  theme: {
    mayChange: ["resolved values permitted by the owning domain"],

    mustPreserve: [
      "token identity",
      "semantic meaning",
      "accessibility requirements",
    ],
  },
} as const;

// -----------------------------------------------------------------------------
// SOURCE PROVENANCE
// -----------------------------------------------------------------------------

export const TOKEN_SOURCES = [
  {
    adaptation:
      "Afenda preserves the three-tier semantic model but defines its own categories, contexts, public consumption boundaries, tenant rules, and governance requirements.",

    contribution: [
      "reference, system, and component token tiers",
      "semantic indirection",
      "general-to-specific token naming",
      "contextual token resolution",
    ],

    disposition: "adapt",
    id: "m3-design-tokens",

    kind: "design-system",

    system: "Material 3",
  },
] as const;

// -----------------------------------------------------------------------------
// M3 DISPOSITION
// -----------------------------------------------------------------------------

export const TOKEN_SOURCE_DISPOSITION = {
  "component-to-system-or-reference-indirection": "adopt",

  "contextual-values": "adopt",

  "m3-category-taxonomy": "adapt",

  "m3-context-taxonomy": "adapt",

  "m3-token-prefix": "reject",

  "material-component-token-naming": "adapt",

  "system-to-reference-indirection": "adopt",
  "three-token-classes": "adopt",
} as const;

// -----------------------------------------------------------------------------
// LEVEL-2 OBLIGATIONS
// -----------------------------------------------------------------------------

/**
 * These describe what implementation must achieve.
 *
 * They do not prescribe how.
 */
export const TOKEN_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-TOK-076",

    obligation:
      "Every active Level-1 token identity has exactly one valid Level-2 resolution for every supported applicable context.",
    strength: "must",
  },

  {
    id: "AF-TOK-077",

    obligation: "Level 2 preserves token-tier dependency direction.",
    strength: "must",
  },

  {
    id: "AF-TOK-078",

    obligation:
      "Level 2 exposes system-token identities to their permitted consumers.",
    strength: "must",
  },

  {
    id: "AF-TOK-079",

    obligation:
      "Level 2 prevents private component tokens from becoming accidental application APIs.",
    strength: "must",
  },

  {
    id: "AF-TOK-080",

    obligation: "Context resolution is deterministic.",
    strength: "must",
  },
] as const;

// -----------------------------------------------------------------------------
// LEVEL-3 PROOF REQUIREMENTS
// -----------------------------------------------------------------------------

/**
 * These define WHAT Level 3 must prove.
 *
 * The validators and generators themselves belong to Level 3.
 */
export const TOKEN_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-TOK-081",
    prove: "all token identities are unique",
  },

  {
    id: "AF-TOK-082",
    prove: "all active token references resolve",
  },

  {
    id: "AF-TOK-083",
    prove: "token dependency graphs are acyclic",
  },

  {
    id: "AF-TOK-084",
    prove: "tier dependency direction is legal",
  },

  {
    id: "AF-TOK-085",
    prove: "system tokens do not depend on component tokens",
  },

  {
    id: "AF-TOK-086",
    prove: "application code does not consume reference tokens",
  },

  {
    id: "AF-TOK-087",
    prove:
      "components do not consume component tokens owned by another component",
  },

  {
    id: "AF-TOK-088",
    prove: "every component token belongs to declared component anatomy",
  },

  {
    id: "AF-TOK-089",
    prove: "tenant overrides target only roles declared tenant-customisable",
  },

  {
    id: "AF-TOK-090",
    prove:
      "generated representations preserve canonical Level-1 token identity",
  },

  {
    id: "AF-TOK-091",
    prove:
      "the same supported context set always produces deterministic resolution",
  },
] as const;

// -----------------------------------------------------------------------------
// CONFORMANCE
// -----------------------------------------------------------------------------

export const TOKEN_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "unique",
    "acyclic",
    "complete",
    "deterministic",
    "consumer-safe",
  ],

  implementation: ["resolvable", "dependency-valid", "consumer-boundary-valid"],
  language: [
    "tier-defined",
    "category-defined",
    "semantic-identity-defined",
    "owner-defined",
    "context-policy-defined",
  ],
} as const;

// -----------------------------------------------------------------------------
// PUBLIC TYPES
// -----------------------------------------------------------------------------

export type TokenLanguageId = typeof TOKEN_LANGUAGE.id;

export type TokenContextDefinition = (typeof TOKEN_CONTEXTS)[number];

export type TokenContextId = TokenContextDefinition["id"];

export type TokenCategoryDefinition = (typeof TOKEN_CATEGORIES)[number];

export type TokenSourceDisposition =
  (typeof TOKEN_SOURCE_DISPOSITION)[keyof typeof TOKEN_SOURCE_DISPOSITION];
