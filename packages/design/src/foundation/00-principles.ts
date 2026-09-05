/**
 * AFENDA DESIGN LANGUAGE — PRINCIPLES
 *
 * Level 1 authority root.
 *
 * This file defines the constitution of the Afenda design language:
 *
 *   - what Level 1 is
 *   - what Level 1 may and may not contain
 *   - the canonical design-language taxonomy
 *   - the source-disposition model
 *   - the rule-ID grammar
 *   - the decision precedence
 *   - the principles every later language and component contract must obey
 *
 * It contains no visual implementation.
 *
 * No:
 *   - CSS
 *   - Tailwind classes
 *   - React implementation
 *   - token values
 *   - colour values
 *   - spacing values
 *   - font metrics
 *   - animation timings
 *   - component recipes
 *
 * Those belong to Level 2.
 *
 * Level 3 may inspect this file and Level 2 to prove conformance.
 */

// -----------------------------------------------------------------------------
// IDENTITY
// -----------------------------------------------------------------------------

export const AFENDA_DESIGN_LANGUAGE = {
  id: "afenda-design-language",
  name: "Afenda Design Language",
  shortName: "ADL",
  level: 1,
  version: "1.0.0",

  purpose:
    "Define the semantic, behavioural, accessibility, adaptive, and public API contract of Afenda user interfaces.",

  productContext: [
    "enterprise SaaS",
    "data-intensive workflows",
    "long-session professional use",
    "multi-tenant deployment",
    "multi-locale deployment",
    "keyboard, pointer, touch, and assistive-technology access",
  ],
} as const;

// -----------------------------------------------------------------------------
// THREE-LEVEL ARCHITECTURE
// -----------------------------------------------------------------------------

export const DESIGN_LEVELS = {
  1: {
    name: "language",
    authority: "normative",
    responsibility:
      "Defines principles, taxonomy, semantics, rules, legal public APIs, constraints, and adaptation.",
  },

  2: {
    name: "implementation",
    authority: "implementing",
    responsibility:
      "Implements Level 1 through tokens, styles, primitives, components, layouts, recipes, and patterns.",
  },

  3: {
    name: "governance",
    authority: "verifying",
    responsibility:
      "Validates, generates, tests, measures, and proves that Level 2 conforms to Level 1.",
  },
} as const;

/**
 * There is deliberately no intermediate specification layer.
 *
 * Level 1 decides.
 * Level 2 implements.
 * Level 3 proves and automates.
 */
export const INTERMEDIATE_SPECIFICATION_LAYER_ALLOWED = false;

// -----------------------------------------------------------------------------
// LEVEL-1 CONTRACT
// -----------------------------------------------------------------------------

/**
 * Every Level-1 domain must express these concerns where applicable.
 *
 * A section may be empty only when the domain can prove that the concern
 * does not apply.
 */
export const LANGUAGE_SECTIONS = [
  "principle",
  "taxonomy",
  "semantics",
  "rules",
  "api",
  "constraints",
  "adaptation",
  "sources",
] as const;

export type LanguageSection = (typeof LANGUAGE_SECTIONS)[number];

/**
 * Level 1 defines meaning and legal capability.
 *
 * It must not encode the implementation selected to realise that capability.
 */
export const LEVEL_1_MAY_DEFINE = [
  "design principles",
  "semantic concepts",
  "named taxonomy",
  "relationships between concepts",
  "public component capabilities",
  "public component API",
  "legal variants",
  "legal sizes",
  "legal states",
  "component anatomy",
  "behavioural requirements",
  "accessibility requirements",
  "adaptive behaviour",
  "content requirements",
  "invariants",
  "forbidden combinations",
  "source provenance",
] as const;

export const LEVEL_1_MUST_NOT_DEFINE = [
  "CSS declarations",
  "CSS selectors",
  "Tailwind utility classes",
  "framework-specific rendering code",
  "React component implementation",
  "CVA recipes",
  "Base UI implementation details",
  "shadcn implementation details",
  "literal colour values",
  "literal spacing values",
  "literal radius values",
  "literal typography metrics",
  "literal animation durations",
  "literal easing curves",
  "literal shadow values",
  "literal z-index values",
  "generated output",
] as const;

// -----------------------------------------------------------------------------
// LANGUAGE TAXONOMY
// -----------------------------------------------------------------------------

/**
 * Canonical Level-1 domains.
 *
 * Later Level-1 files MUST belong to one of these domains.
 *
 * M3 documentation taxonomy does not dictate Afenda's code taxonomy.
 * Concepts are grouped according to how Afenda consumes them.
 */
export const LANGUAGE_DOMAINS = [
  {
    order: 0,
    id: "principle",
    code: "PRI",
    file: "00-principles.ts",
    responsibility:
      "Authority, philosophy, language grammar, provenance, and cross-domain invariants.",
  },

  {
    order: 1,
    id: "token",
    code: "TOK",
    file: "01-tokens.ts",
    responsibility:
      "Token tiers, categories, semantic indirection, context, and legal dependency direction.",
  },

  {
    order: 2,
    id: "color",
    code: "COL",
    file: "02-color.ts",
    responsibility:
      "Surface, content, action, status, border, tenant, and data-visualisation colour semantics.",
  },

  {
    order: 3,
    id: "typography",
    code: "TYP",
    file: "03-typography.ts",
    responsibility:
      "Text roles, hierarchy, emphasis, data typography, numeric typography, and readable content structure.",
  },

  {
    order: 4,
    id: "geometry",
    code: "GEO",
    file: "04-geometry.ts",
    responsibility:
      "Spacing, sizing, density, targets, shape, icon geometry, elevation, and stacking semantics.",
  },

  {
    order: 5,
    id: "layout",
    code: "LAY",
    file: "05-layout.ts",
    responsibility:
      "Window, container, scaffold, pane, grid, composition, responsive, and adaptive behaviour.",
  },

  {
    order: 6,
    id: "motion",
    code: "MOT",
    file: "06-motion.ts",
    responsibility:
      "Motion intent, transition relationships, temporal semantics, and reduced-motion behaviour.",
  },

  {
    order: 7,
    id: "interaction",
    code: "INT",
    file: "07-interaction.ts",
    responsibility:
      "Interactive states, selection, focus, disclosure, dragging, modality, and gesture behaviour.",
  },

  {
    order: 8,
    id: "accessibility",
    code: "A11Y",
    file: "08-accessibility.ts",
    responsibility:
      "Perceivability, operability, understandability, robustness, and component accessibility invariants.",
  },

  {
    order: 9,
    id: "content",
    code: "CON",
    file: "09-content.ts",
    responsibility:
      "UX writing, labels, errors, transactions, internationalisation, formatting, and bidirectionality.",
  },

  {
    order: 10,
    id: "component",
    code: "CMP",
    file: "10-components/*",
    responsibility:
      "Purpose, anatomy, features, states, public API, accessibility, and constraints of UI components.",
  },
] as const;

export type LanguageDomain = (typeof LANGUAGE_DOMAINS)[number]["id"];
export type LanguageDomainCode = (typeof LANGUAGE_DOMAINS)[number]["code"];

// -----------------------------------------------------------------------------
// RULE IDENTIFIERS
// -----------------------------------------------------------------------------

/**
 * Every normative Level-1 rule receives a permanent ID.
 *
 * Format:
 *
 *   AF-<DOMAIN>-<NUMBER>
 *
 * Examples:
 *
 *   AF-PRI-001
 *   AF-COL-012
 *   AF-A11Y-021
 *   AF-CMP-BUTTON-004
 *
 * Rule numbers are never reused after deletion.
 */
export const DOMAIN_RULE_ID_PATTERN =
  /^AF-(PRI|TOK|COL|TYP|GEO|LAY|MOT|INT|A11Y|CON)-\d{3}$/;

export const COMPONENT_RULE_ID_PATTERN =
  /^AF-CMP-[A-Z0-9]+(?:-[A-Z0-9]+)*-\d{3}$/;

/**
 * Rule identifiers describe stable policy identity.
 *
 * They MUST NOT encode implementation details, versions, framework names,
 * filenames, or source-system terminology.
 */
export const RULE_ID_RULES = [
  "rule IDs are permanent once published",
  "deleted rule IDs are never reused",
  "rule IDs identify policy, not implementation",
  "renaming implementation does not rename a rule",
  "moving implementation does not rename a rule",
  "source-system terminology does not appear in Afenda rule IDs",
] as const;

// -----------------------------------------------------------------------------
// NORMATIVE STRENGTH
// -----------------------------------------------------------------------------

export const RULE_STRENGTH = {
  must: {
    normative: true,
    meaning: "Required. A conforming implementation may not violate this rule.",
  },

  should: {
    normative: true,
    meaning: "Expected. Deviation requires a documented and reviewable reason.",
  },

  may: {
    normative: false,
    meaning:
      "Permitted capability. Implementations may use it when applicable.",
  },
} as const;

export type RuleStrength = keyof typeof RULE_STRENGTH;

// -----------------------------------------------------------------------------
// SOURCE PROVENANCE
// -----------------------------------------------------------------------------

/**
 * External systems are evidence and design input.
 *
 * They do not become Afenda authority merely because they are referenced.
 */
export const SOURCE_DISPOSITIONS = {
  adopt: {
    meaning:
      "Afenda accepts the source concept without material semantic change.",
  },

  adapt: {
    meaning:
      "Afenda accepts the intent but changes the model, scope, API, or behaviour for the product context.",
  },

  reject: {
    meaning:
      "Afenda has considered the source concept and deliberately does not adopt it.",
  },

  defer: {
    meaning:
      "The concept is relevant but intentionally has no current Afenda contract.",
  },
} as const;

export type SourceDisposition = keyof typeof SOURCE_DISPOSITIONS;

/**
 * Initial external design-language source.
 *
 * Domain-specific M3 pages are registered by their corresponding
 * Level-1 language file rather than duplicated here.
 */
export const LANGUAGE_SOURCES = [
  {
    id: "m3-foundations-principles",
    system: "Material 3",
    kind: "design-system",
    uri: "https://m3.material.io/foundations/overview/principles",
    disposition: "adapt",
    role: "Primary design-system precedent and evidence source for Afenda's foundation language.",
  },
] as const satisfies readonly {
  id: string;
  system: string;
  kind: string;
  uri: string;
  disposition: SourceDisposition;
  role: string;
}[];

// -----------------------------------------------------------------------------
// DECISION PRECEDENCE
// -----------------------------------------------------------------------------

/**
 * When two design goals conflict, the earlier item wins.
 *
 * This prevents aesthetic preference or tenant branding from silently
 * weakening semantic or accessibility behaviour.
 */
export const DECISION_PRECEDENCE = [
  "safety",
  "accessibility",
  "semantic-correctness",
  "task-completion",
  "interaction-clarity",
  "information-clarity",
  "adaptive-continuity",
  "tenant-expression",
  "visual-expression",
] as const;

export type DecisionPriority = (typeof DECISION_PRECEDENCE)[number];

// -----------------------------------------------------------------------------
// AFENDA DESIGN PRINCIPLES
// -----------------------------------------------------------------------------

export const DESIGN_PRINCIPLES = [
  {
    id: "AF-PRI-001",
    name: "Semantics before appearance",
    strength: "must",

    statement:
      "A visual or behavioural choice must be selected by meaning and purpose before appearance.",

    requires: [
      "components are chosen by intended interaction",
      "tokens are consumed by semantic role",
      "visual differences communicate a defined purpose",
    ],

    forbids: [
      "choosing a component only because it looks appropriate",
      "using visual similarity as a substitute for semantic equivalence",
      "creating appearance-only variants without a defined purpose",
    ],
  },

  {
    id: "AF-PRI-002",
    name: "Role before value",
    strength: "must",

    statement:
      "Product code consumes semantic roles; implementation resolves those roles to values.",

    requires: [
      "meaning survives theme changes",
      "meaning survives tenant changes",
      "implementation values remain replaceable without changing product semantics",
    ],

    forbids: [
      "application code depending on raw design values where a semantic role exists",
      "using palette identity as product meaning",
      "using literal geometry as component meaning",
    ],
  },

  {
    id: "AF-PRI-003",
    name: "Hierarchy before decoration",
    strength: "must",

    statement:
      "Visual distinction exists to communicate hierarchy, grouping, state, interaction, or meaning.",

    requires: [
      "prominence corresponds to information or action importance",
      "grouping is visible without unnecessary decoration",
      "supporting information remains visually subordinate",
    ],

    forbids: [
      "decoration that competes with primary work",
      "visual emphasis without semantic reason",
      "adding colour, shadow, shape, or motion solely to make a screen appear richer",
    ],
  },

  {
    id: "AF-PRI-004",
    name: "Density without loss of operability",
    strength: "must",

    statement:
      "Afenda may increase information density, but compression must not remove operability, comprehension, or accessibility.",

    requires: [
      "density changes geometry rather than meaning",
      "critical actions remain discoverable",
      "focus remains visible",
      "keyboard access remains complete",
      "content remains readable",
    ],

    forbids: [
      "using density to remove necessary labels",
      "using density to hide required state",
      "reducing interaction geometry below the applicable accessibility contract",
      "changing semantic colour because density changed",
    ],
  },

  {
    id: "AF-PRI-005",
    name: "Adaptation preserves task and context",
    strength: "must",

    statement:
      "An adaptive interface may change composition, but it must preserve the user's task, information meaning, and navigational context.",

    requires: [
      "responsive behaviour is defined as adaptation rather than arbitrary resizing",
      "important context survives pane or viewport changes",
      "the primary task remains reachable across supported conditions",
    ],

    forbids: [
      "removing essential capability solely because space decreased",
      "reordering content in a way that changes meaning",
      "using viewport width as the only possible adaptation signal",
    ],
  },

  {
    id: "AF-PRI-006",
    name: "State is explicit and composable",
    strength: "must",

    statement:
      "Interactive, selection, validation, disclosure, and workflow states are explicit semantic concepts rather than incidental styling.",

    requires: [
      "state has a defined meaning",
      "legal state combinations are defined by component contracts",
      "state remains perceivable through the applicable accessibility contract",
    ],

    forbids: [
      "inventing unnamed component states in implementation",
      "treating hover, focus, selection, and current navigation as equivalent",
      "communicating consequential state by colour alone",
    ],
  },

  {
    id: "AF-PRI-007",
    name: "Accessibility is intrinsic",
    strength: "must",

    statement:
      "Accessibility is part of the definition of a component and interaction, not a later validation pass.",

    requires: [
      "component contracts declare their accessibility requirements",
      "interactive capability has keyboard semantics where applicable",
      "focus behaviour is defined",
      "accessible naming is defined",
      "required state and value are exposed programmatically",
    ],

    forbids: [
      "shipping a component whose accessibility contract is undefined",
      "treating automated accessibility testing as the accessibility specification",
      "using visual appearance as the only representation of meaning",
    ],
  },

  {
    id: "AF-PRI-008",
    name: "Motion explains change",
    strength: "must",

    statement:
      "Motion communicates cause, relationship, continuity, hierarchy, or state change and is not an independent decorative layer.",

    requires: [
      "motion has a named semantic intent",
      "transition choice follows the relationship between states",
      "reduced-motion behaviour is defined where motion is non-essential",
    ],

    forbids: [
      "inventing arbitrary durations at component call sites",
      "using motion solely to attract attention",
      "requiring non-essential motion to understand an interaction",
    ],
  },

  {
    id: "AF-PRI-009",
    name: "Tenant expression cannot redefine product semantics",
    strength: "must",

    statement:
      "Tenant customisation may express identity but may not alter the semantic meaning, interaction model, or accessibility of Afenda.",

    requires: [
      "tenant customisation passes through governed semantic roles",
      "status meaning remains stable between tenants",
      "component behaviour remains stable between tenant themes",
      "accessibility requirements remain invariant",
    ],

    forbids: [
      "tenant themes redefining success, warning, error, or destructive meaning",
      "tenant branding changing component semantics",
      "tenant customisation bypassing required contrast or state behaviour",
    ],
  },

  {
    id: "AF-PRI-010",
    name: "Public UI APIs are finite",
    strength: "must",

    statement:
      "A governed component or design capability exposes only the public API admitted by the Afenda design language.",

    requires: [
      "every public variant has defined semantics",
      "every public size has defined purpose",
      "every public feature has defined behaviour",
      "every public state has defined meaning",
      "implementation API remains in parity with its Level-1 contract",
    ],

    forbids: [
      "application code inventing ungoverned component variants",
      "implementation exposing public capability absent from Level 1",
      "Level 1 declaring public capability that Level 2 silently does not implement",
    ],
  },
] as const satisfies readonly {
  id: string;
  name: string;
  strength: RuleStrength;
  statement: string;
  requires: readonly string[];
  forbids: readonly string[];
}[];

// -----------------------------------------------------------------------------
// CROSS-LEVEL DEPENDENCY RULES
// -----------------------------------------------------------------------------

export const LEVEL_DEPENDENCIES = {
  language: {
    mayDependOn: ["language"],
    mustNotDependOn: ["implementation", "governance"],
  },

  implementation: {
    mayDependOn: ["language", "implementation"],
    mustNotDependOn: ["governance"],
  },

  governance: {
    mayDependOn: ["language", "implementation", "governance"],
    mustNotDependOn: [],
  },
} as const;

/**
 * Level 3 may inspect Level 2.
 *
 * Level 2 must never require Level 3 to function at runtime.
 */
export const GOVERNANCE_IS_RUNTIME_DEPENDENCY = false;

// -----------------------------------------------------------------------------
// LANGUAGE AUTHORSHIP RULES
// -----------------------------------------------------------------------------

export const LANGUAGE_AUTHORSHIP_RULES = [
  {
    id: "AF-PRI-011",
    strength: "must",
    rule: "A Level-1 statement defines an Afenda decision, not a transcription of an external design system.",
  },

  {
    id: "AF-PRI-012",
    strength: "must",
    rule: "External design-system guidance is recorded as source provenance with an explicit disposition.",
  },

  {
    id: "AF-PRI-013",
    strength: "must",
    rule: "A design decision is stated once in its owning Level-1 domain and referenced elsewhere by identity.",
  },

  {
    id: "AF-PRI-014",
    strength: "must",
    rule: "Implementation details do not appear in Level-1 normative contracts.",
  },

  {
    id: "AF-PRI-015",
    strength: "must",
    rule: "Generated output never becomes an independent source of design authority.",
  },

  {
    id: "AF-PRI-016",
    strength: "must",
    rule: "A public component capability must have a semantic reason to exist.",
  },

  {
    id: "AF-PRI-017",
    strength: "must",
    rule: "A component may compose existing language concepts but may not redefine their meaning.",
  },

  {
    id: "AF-PRI-018",
    strength: "must",
    rule: "A Level-1 rule that cannot currently be implemented must be explicitly deferred rather than silently ignored.",
  },

  {
    id: "AF-PRI-019",
    strength: "must",
    rule: "A deliberate divergence from an external source must be represented as adapt or reject rather than undocumented drift.",
  },

  {
    id: "AF-PRI-020",
    strength: "must",
    rule: "Level 3 must be able to identify the Level-1 authority governing every generated or validated design-system artifact.",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  rule: string;
}[];

// -----------------------------------------------------------------------------
// CONFORMANCE DEFINITION
// -----------------------------------------------------------------------------

/**
 * A design-system capability is conforming only when:
 *
 *   1. Level 1 admits it.
 *   2. Level 2 implements it.
 *   3. Level 3 can prove the implementation does not contradict Level 1.
 *
 * Level 3 proof mechanisms are defined by governance, not here.
 */
export const CONFORMANCE = {
  language: "admitted",
  implementation: "implemented",
  governance: "proven",

  completeWhen: ["admitted", "implemented", "proven"],
} as const;

// -----------------------------------------------------------------------------
// PUBLIC TYPES
// -----------------------------------------------------------------------------

export type DesignLevel = keyof typeof DESIGN_LEVELS;

export type PrincipleId = (typeof DESIGN_PRINCIPLES)[number]["id"];

export type PrincipleName = (typeof DESIGN_PRINCIPLES)[number]["name"];

export type LanguageSourceId = (typeof LANGUAGE_SOURCES)[number]["id"];
