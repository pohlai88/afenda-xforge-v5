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
  level: 1,
  name: "Afenda Design Language",

  productContext: [
    "enterprise SaaS",
    "data-intensive workflows",
    "long-session professional use",
    "multi-tenant deployment",
    "multi-locale deployment",
    "keyboard, pointer, touch, and assistive-technology access",
  ],

  purpose:
    "Define the semantic, behavioural, accessibility, adaptive, and public API contract of Afenda user interfaces.",
  shortName: "ADL",
  version: "1.0.0",
} as const;

/**
 * The principle domain's own identity.
 *
 * Every Level-1 domain file declares this block; the domain that defines
 * the requirement is not exempt from it.
 */
export const PRINCIPLE_LANGUAGE = {
  code: "PRI",
  id: "principle",
  level: 1,
  order: 0,

  purpose:
    "Define the authority, philosophy, language grammar, provenance, and cross-domain invariants of the Afenda design language.",
  version: "1.0.0",
} as const;

// -----------------------------------------------------------------------------
// THREE-LEVEL ARCHITECTURE
// -----------------------------------------------------------------------------

export const DESIGN_LEVELS = {
  1: {
    authority: "normative",
    name: "language",
    responsibility:
      "Defines principles, taxonomy, semantics, rules, legal public APIs, constraints, and adaptation.",
  },

  2: {
    authority: "implementing",
    name: "implementation",
    responsibility:
      "Implements Level 1 through tokens, styles, primitives, components, layouts, recipes, and patterns.",
  },

  3: {
    authority: "verifying",
    name: "governance",
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
    code: "PRI",
    file: "00-principles.ts",
    id: "principle",
    order: 0,
    responsibility:
      "Authority, philosophy, language grammar, provenance, and cross-domain invariants.",
  },

  {
    code: "TOK",
    file: "01-tokens.ts",
    id: "token",
    order: 1,
    responsibility:
      "Token tiers, categories, semantic indirection, context, and legal dependency direction.",
  },

  {
    code: "COL",
    file: "02-color.ts",
    id: "color",
    order: 2,
    responsibility:
      "Surface, content, action, status, border, tenant, and data-visualisation colour semantics.",
  },

  {
    code: "TYP",
    file: "03-typography.ts",
    id: "typography",
    order: 3,
    responsibility:
      "Text roles, hierarchy, emphasis, data typography, numeric typography, and readable content structure.",
  },

  {
    code: "GEO",
    file: "04-geometry.ts",
    id: "geometry",
    order: 4,
    responsibility:
      "Spacing, sizing, density, targets, shape, icon geometry, elevation, and stacking semantics.",
  },

  {
    code: "LAY",
    file: "05-layout.ts",
    id: "layout",
    order: 5,
    responsibility:
      "Window, container, scaffold, pane, grid, composition, responsive, and adaptive behaviour.",
  },

  {
    code: "MOT",
    file: "06-motion.ts",
    id: "motion",
    order: 6,
    responsibility:
      "Motion intent, transition relationships, temporal semantics, and reduced-motion behaviour.",
  },

  {
    code: "INT",
    file: "07-interaction.ts",
    id: "interaction",
    order: 7,
    responsibility:
      "Interactive states, selection, focus, disclosure, dragging, modality, and gesture behaviour.",
  },

  {
    code: "A11Y",
    file: "08-accessibility.ts",
    id: "accessibility",
    order: 8,
    responsibility:
      "Perceivability, operability, understandability, robustness, and component accessibility invariants.",
  },

  {
    code: "CON",
    file: "09-content.ts",
    id: "content",
    order: 9,
    responsibility:
      "UX writing, labels, errors, transactions, internationalisation, formatting, and bidirectionality.",
  },

  {
    code: "CMP",
    // The component domain lives beside its realisation: each block folder
    // carries <name>-contract.ts, <name>-manifest.ts and <name>.tsx.
    file: "../blocks/*",
    id: "component",
    order: 10,
    responsibility:
      "Purpose, anatomy, features, states, public API, accessibility, and constraints of UI components.",
  },
] as const satisfies readonly {
  order: number;
  id: string;
  code: string;
  file: string;
  responsibility: string;
}[];

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
  may: {
    meaning:
      "Permitted capability. Implementations may use it when applicable.",
    normative: false,
  },
  must: {
    meaning: "Required. A conforming implementation may not violate this rule.",
    normative: true,
  },

  should: {
    meaning: "Expected. Deviation requires a documented and reviewable reason.",
    normative: true,
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
  adapt: {
    meaning:
      "Afenda accepts the intent but changes the model, scope, API, or behaviour for the product context.",
  },
  adopt: {
    meaning:
      "Afenda accepts the source concept without material semantic change.",
  },

  defer: {
    meaning:
      "The concept is relevant but intentionally has no current Afenda contract.",
  },

  reject: {
    meaning:
      "Afenda has considered the source concept and deliberately does not adopt it.",
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
    disposition: "adapt",
    id: "m3-foundations-principles",
    kind: "design-system",
    role: "Primary design-system precedent and evidence source for Afenda's foundation language.",
    system: "Material 3",
    uri: "https://m3.material.io/foundations/overview/principles",
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
    forbids: [
      "choosing a component only because it looks appropriate",
      "using visual similarity as a substitute for semantic equivalence",
      "creating appearance-only variants without a defined purpose",
    ],
    id: "AF-PRI-001",
    name: "Semantics before appearance",

    requires: [
      "components are chosen by intended interaction",
      "tokens are consumed by semantic role",
      "visual differences communicate a defined purpose",
    ],

    statement:
      "A visual or behavioural choice must be selected by meaning and purpose before appearance.",
    strength: "must",
  },

  {
    forbids: [
      "application code depending on raw design values where a semantic role exists",
      "using palette identity as product meaning",
      "using literal geometry as component meaning",
    ],
    id: "AF-PRI-002",
    name: "Role before value",

    requires: [
      "meaning survives theme changes",
      "meaning survives tenant changes",
      "implementation values remain replaceable without changing product semantics",
    ],

    statement:
      "Product code consumes semantic roles; implementation resolves those roles to values.",
    strength: "must",
  },

  {
    forbids: [
      "decoration that competes with primary work",
      "visual emphasis without semantic reason",
      "adding colour, shadow, shape, or motion solely to make a screen appear richer",
    ],
    id: "AF-PRI-003",
    name: "Hierarchy before decoration",

    requires: [
      "prominence corresponds to information or action importance",
      "grouping is visible without unnecessary decoration",
      "supporting information remains visually subordinate",
    ],

    statement:
      "Visual distinction exists to communicate hierarchy, grouping, state, interaction, or meaning.",
    strength: "must",
  },

  {
    forbids: [
      "using density to remove necessary labels",
      "using density to hide required state",
      "reducing interaction geometry below the applicable accessibility contract",
      "changing semantic colour because density changed",
    ],
    id: "AF-PRI-004",
    name: "Density without loss of operability",

    requires: [
      "density changes geometry rather than meaning",
      "critical actions remain discoverable",
      "focus remains visible",
      "keyboard access remains complete",
      "content remains readable",
    ],

    statement:
      "Afenda may increase information density, but compression must not remove operability, comprehension, or accessibility.",
    strength: "must",
  },

  {
    forbids: [
      "removing essential capability solely because space decreased",
      "reordering content in a way that changes meaning",
      "using viewport width as the only possible adaptation signal",
    ],
    id: "AF-PRI-005",
    name: "Adaptation preserves task and context",

    requires: [
      "responsive behaviour is defined as adaptation rather than arbitrary resizing",
      "important context survives pane or viewport changes",
      "the primary task remains reachable across supported conditions",
    ],

    statement:
      "An adaptive interface may change composition, but it must preserve the user's task, information meaning, and navigational context.",
    strength: "must",
  },

  {
    forbids: [
      "inventing unnamed component states in implementation",
      "treating hover, focus, selection, and current navigation as equivalent",
      "communicating consequential state by colour alone",
    ],
    id: "AF-PRI-006",
    name: "State is explicit and composable",

    requires: [
      "state has a defined meaning",
      "legal state combinations are defined by component contracts",
      "state remains perceivable through the applicable accessibility contract",
    ],

    statement:
      "Interactive, selection, validation, disclosure, and workflow states are explicit semantic concepts rather than incidental styling.",
    strength: "must",
  },

  {
    forbids: [
      "shipping a component whose accessibility contract is undefined",
      "treating automated accessibility testing as the accessibility specification",
      "using visual appearance as the only representation of meaning",
    ],
    id: "AF-PRI-007",
    name: "Accessibility is intrinsic",

    requires: [
      "component contracts declare their accessibility requirements",
      "interactive capability has keyboard semantics where applicable",
      "focus behaviour is defined",
      "accessible naming is defined",
      "required state and value are exposed programmatically",
    ],

    statement:
      "Accessibility is part of the definition of a component and interaction, not a later validation pass.",
    strength: "must",
  },

  {
    forbids: [
      "inventing arbitrary durations at component call sites",
      "using motion solely to attract attention",
      "requiring non-essential motion to understand an interaction",
    ],
    id: "AF-PRI-008",
    name: "Motion explains change",

    requires: [
      "motion has a named semantic intent",
      "transition choice follows the relationship between states",
      "reduced-motion behaviour is defined where motion is non-essential",
    ],

    statement:
      "Motion communicates cause, relationship, continuity, hierarchy, or state change and is not an independent decorative layer.",
    strength: "must",
  },

  {
    forbids: [
      "tenant themes redefining success, warning, error, or destructive meaning",
      "tenant branding changing component semantics",
      "tenant customisation bypassing required contrast or state behaviour",
    ],
    id: "AF-PRI-009",
    name: "Tenant expression cannot redefine product semantics",

    requires: [
      "tenant customisation passes through governed semantic roles",
      "status meaning remains stable between tenants",
      "component behaviour remains stable between tenant themes",
      "accessibility requirements remain invariant",
    ],

    statement:
      "Tenant customisation may express identity but may not alter the semantic meaning, interaction model, or accessibility of Afenda.",
    strength: "must",
  },

  {
    forbids: [
      "application code inventing ungoverned component variants",
      "implementation exposing public capability absent from Level 1",
      "Level 1 declaring public capability that Level 2 silently does not implement",
    ],
    id: "AF-PRI-010",
    name: "Public UI APIs are finite",

    requires: [
      "every public variant has defined semantics",
      "every public size has defined purpose",
      "every public feature has defined behaviour",
      "every public state has defined meaning",
      "implementation API remains in parity with its Level-1 contract",
    ],

    statement:
      "A governed component or design capability exposes only the public API admitted by the Afenda design language.",
    strength: "must",
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
  governance: {
    mayDependOn: ["language", "implementation", "governance"],
    mustNotDependOn: [],
  },

  implementation: {
    mayDependOn: ["language", "implementation"],
    mustNotDependOn: ["governance"],
  },
  language: {
    mayDependOn: ["language"],
    mustNotDependOn: ["implementation", "governance"],
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
    rule: "A Level-1 statement defines an Afenda decision, not a transcription of an external design system.",
    strength: "must",
  },

  {
    id: "AF-PRI-012",
    rule: "External design-system guidance is recorded as source provenance with an explicit disposition.",
    strength: "must",
  },

  {
    id: "AF-PRI-013",
    rule: "A design decision is stated once in its owning Level-1 domain and referenced elsewhere by identity.",
    strength: "must",
  },

  {
    id: "AF-PRI-014",
    rule: "Implementation details do not appear in Level-1 normative contracts.",
    strength: "must",
  },

  {
    id: "AF-PRI-015",
    rule: "Generated output never becomes an independent source of design authority.",
    strength: "must",
  },

  {
    id: "AF-PRI-016",
    rule: "A public component capability must have a semantic reason to exist.",
    strength: "must",
  },

  {
    id: "AF-PRI-017",
    rule: "A component may compose existing language concepts but may not redefine their meaning.",
    strength: "must",
  },

  {
    id: "AF-PRI-018",
    rule: "A Level-1 rule that cannot currently be implemented must be explicitly deferred rather than silently ignored.",
    strength: "must",
  },

  {
    id: "AF-PRI-019",
    rule: "A deliberate divergence from an external source must be represented as adapt or reject rather than undocumented drift.",
    strength: "must",
  },

  {
    id: "AF-PRI-020",
    rule: "Level 3 must be able to identify the Level-1 authority governing every generated or validated design-system artifact.",
    strength: "must",
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
  completeWhen: ["admitted", "implemented", "proven"],
  governance: "proven",
  implementation: "implemented",
  language: "admitted",
} as const;

// -----------------------------------------------------------------------------
// PUBLIC TYPES
// -----------------------------------------------------------------------------

export type DesignLevel = keyof typeof DESIGN_LEVELS;

export type LanguageDomainDefinition = (typeof LANGUAGE_DOMAINS)[number];

export type PrincipleId = (typeof DESIGN_PRINCIPLES)[number]["id"];

export type PrincipleName = (typeof DESIGN_PRINCIPLES)[number]["name"];

export type LanguageSourceId = (typeof LANGUAGE_SOURCES)[number]["id"];
