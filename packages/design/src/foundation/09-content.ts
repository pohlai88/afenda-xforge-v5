/**
 * AFENDA DESIGN LANGUAGE — CONTENT
 *
 * L1.09
 *
 * Defines the communication and internationalisation language of Afenda.
 *
 * Primary influences:
 *
 *   - IBM Carbon content guidance
 *   - Material 3 content guidance
 *   - Unicode CLDR
 *   - W3C internationalisation / bidirectional-text guidance
 *   - WCAG content and error requirements
 *
 * Afenda extends these concepts for:
 *
 *   - enterprise SaaS
 *   - ERP and transactional workflows
 *   - financial information
 *   - approvals and posting
 *   - auditability
 *   - multi-tenant products
 *   - multilingual / multiscript deployment
 *   - bidirectional interfaces
 *   - AI-assisted product experiences
 *
 * This file defines:
 *
 *   - content principles
 *   - terminology
 *   - naming
 *   - labels
 *   - action verbs
 *   - transactional verbs
 *   - destructive actions
 *   - statuses
 *   - errors
 *   - warnings
 *   - confirmations
 *   - notifications
 *   - empty states
 *   - help content
 *   - numbers
 *   - currency
 *   - percentages
 *   - dates
 *   - times
 *   - time zones
 *   - measurement units
 *   - localisation
 *   - pluralisation
 *   - directionality
 *   - bidirectional text
 *   - identifiers
 *   - audit language
 *   - AI-generated content
 *   - accessibility relationships
 *
 * It deliberately defines NO localisation implementation.
 *
 * No:
 *   - translation-library API
 *   - i18n framework
 *   - ICU implementation
 *   - Intl implementation
 *   - date-format pattern literals
 *   - number-format pattern literals
 *   - translation-file structure
 *   - CSS direction implementation
 *
 * Those belong to Level 2.
 *
 * Authority:
 *   AF-PRI-001 Semantics before appearance
 *   AF-PRI-005 Adaptation preserves task and context
 *   AF-PRI-007 Accessibility is intrinsic
 *   AF-PRI-009 Tenant expression cannot redefine product semantics
 *   AF-PRI-010 Public UI APIs are finite
 *
 * Related language:
 *   02-color.ts
 *   03-typography.ts
 *   05-layout.ts
 *   07-interaction.ts
 *   08-accessibility.ts
 */

import type { RuleStrength, SourceDisposition } from "./00-principles";

// =============================================================================
// IDENTITY
// =============================================================================

export const CONTENT_LANGUAGE = {
  code: "CON",
  id: "content",
  level: 1,
  order: 9,

  philosophy:
    "Content explains the product's meaning and consequences with the fewest words necessary for confident action.",

  purpose:
    "Define stable, understandable, localisable, auditable, and task-oriented communication across Afenda.",
  version: "1.0.0",
} as const;

// =============================================================================
// PRINCIPLES
// =============================================================================

export const CONTENT_PRINCIPLES = [
  {
    id: "AF-CON-001",

    statement:
      "Content communicates task, meaning, state, and consequence before brand personality.",
    strength: "must",
  },

  {
    id: "AF-CON-002",

    statement:
      "The same product concept uses the same canonical terminology across equivalent contexts.",
    strength: "must",
  },

  {
    id: "AF-CON-003",

    statement:
      "Actions are named by what will happen rather than by vague interaction words.",
    strength: "must",
  },

  {
    id: "AF-CON-004",

    statement:
      "Consequential actions communicate their object, scope, and material consequence where ambiguity could cause harm or error.",
    strength: "must",
  },

  {
    id: "AF-CON-005",

    statement:
      "Error content explains what happened and provides a recovery path when recovery is possible.",
    strength: "must",
  },

  {
    id: "AF-CON-006",

    statement:
      "Content semantics remain stable across languages, tenants, themes, and layouts.",
    strength: "must",
  },

  {
    id: "AF-CON-007",

    statement:
      "Locale determines human-readable formatting conventions without changing the underlying business value.",
    strength: "must",
  },

  {
    id: "AF-CON-008",

    statement:
      "Directionality is a property of text and script and must not be inferred solely from product locale.",
    strength: "must",
  },

  {
    id: "AF-CON-009",

    statement:
      "Machine identifiers, audit evidence, user-facing names, and translated display labels are different content classes.",
    strength: "must",
  },

  {
    id: "AF-CON-010",

    statement:
      "AI-generated content is distinguishable from authoritative system facts where confusing the two could affect a decision or transaction.",
    strength: "must",
  },
] as const satisfies readonly {
  id: string;
  strength: RuleStrength;
  statement: string;
}[];

// =============================================================================
// CONTENT TAXONOMY
// =============================================================================

export const CONTENT_DOMAINS = {
  action: {
    purpose: "Communicates operations available to the user.",
  },

  ai: {
    purpose:
      "Communicates AI-generated, inferred, suggested, or transformed information.",
  },

  audit: {
    purpose: "Communicates immutable or traceable events and actors.",
  },

  confirmation: {
    purpose: "Communicates consequence before or after meaningful operations.",
  },

  direction: {
    purpose: "Represents text and interface directionality.",
  },

  "empty-state": {
    purpose: "Explains meaningful absence and available next action.",
  },

  error: {
    purpose: "Communicates failure or invalid information and recovery.",
  },

  format: {
    purpose: "Human-readable representation of structured values.",
  },

  help: {
    purpose:
      "Supports understanding without replacing clear primary interface content.",
  },

  label: {
    purpose:
      "Names controls, fields, properties, destinations, and information.",
  },

  localisation: {
    purpose:
      "Adapts language and formatting to locale while preserving meaning.",
  },

  notification: {
    purpose: "Communicates asynchronous or contextual product events.",
  },

  status: {
    purpose: "Communicates current process, object, or system state.",
  },
  terminology: {
    purpose: "Canonical product and business concepts.",
  },
} as const;

export type ContentDomain = keyof typeof CONTENT_DOMAINS;

// =============================================================================
// CANONICAL TERMINOLOGY
// =============================================================================

/**
 * Product concepts are named once.
 *
 * Examples:
 *
 *   employee
 *   payroll run
 *   journal
 *   invoice
 *   purchase order
 *   approval
 *
 * Modules do not invent synonyms merely for stylistic variety.
 */
export const TERMINOLOGY_MODEL = {
  aliases:
    "permitted only for search, migration, integration, or explicit domain compatibility",
  canonical: "one preferred product term per semantic concept",

  display: "localisable",

  identity: "stable",
} as const;

// -----------------------------------------------------------------------------
// TERMINOLOGY RULES
// -----------------------------------------------------------------------------

export const TERMINOLOGY_RULES = [
  {
    id: "AF-CON-011",

    rule: "Each governed product concept has one canonical semantic term.",
    strength: "must",
  },

  {
    id: "AF-CON-012",

    rule: "Synonyms must not be introduced solely to make interface writing appear less repetitive.",
    strength: "must",
  },

  {
    id: "AF-CON-013",

    rule: "A translation may adapt grammar and idiom while preserving the underlying canonical product concept.",
    strength: "must",
  },

  {
    id: "AF-CON-014",

    rule: "Tenant terminology overrides are permitted only where the product explicitly defines a tenant-localisable business term.",
    strength: "must",
  },

  {
    id: "AF-CON-015",

    rule: "Tenant terminology must not rename technical or statutory concepts where doing so would change their meaning.",
    strength: "must",
  },

  {
    id: "AF-CON-016",

    rule: "Prefer domain terminology already familiar to the intended professional audience over newly invented Afenda terminology.",
    strength: "should",
  },
] as const;

// =============================================================================
// VOICE
// =============================================================================

export const CONTENT_VOICE = {
  actionable: {
    purpose:
      "When action is required, make the next available action understandable.",
  },

  calm: {
    purpose:
      "Avoid unnecessary urgency, celebration, fear, or promotional language.",
  },
  clear: {
    purpose:
      "Use words the intended professional audience can understand quickly.",
  },

  concise: {
    purpose: "Use no more content than the task requires.",
  },

  precise: {
    purpose:
      "Distinguish actions, states, objects, and consequences accurately.",
  },

  professional: {
    purpose:
      "Respect users as capable professionals and avoid patronising language.",
  },
} as const;

// -----------------------------------------------------------------------------
// VOICE RULES
// -----------------------------------------------------------------------------

export const CONTENT_VOICE_RULES = [
  {
    id: "AF-CON-017",

    rule: "Interface content is concise without removing information necessary for confident action.",
    strength: "must",
  },

  {
    id: "AF-CON-018",

    rule: "Content avoids unnecessary marketing language inside operational workflows.",
    strength: "must",
  },

  {
    id: "AF-CON-019",

    rule: "Urgency language is reserved for genuinely time-sensitive or consequential conditions.",
    strength: "must",
  },

  {
    id: "AF-CON-020",

    rule: "Success language remains proportionate to the significance of the completed task.",
    strength: "must",
  },

  {
    id: "AF-CON-021",

    rule: "Interface content must not blame, shame, or ridicule the user.",
    strength: "must",
  },
] as const;

// =============================================================================
// PERSON / PRONOUN
// =============================================================================

export const PERSON_MODEL = {
  product:
    "first-person plural is avoided unless referring to an actual organisation or service operator",

  system: "name the responsible process or object where responsibility matters",
  user: "second-person where direct reference improves clarity",
} as const;

// -----------------------------------------------------------------------------
// PERSON RULES
// -----------------------------------------------------------------------------

export const PERSON_RULES = [
  {
    id: "AF-CON-022",

    rule: "Use direct second-person language when it makes instructions clearer.",
    strength: "should",
  },

  {
    id: "AF-CON-023",

    rule: "Avoid anthropomorphising the product when a factual system description is clearer.",
    strength: "should",
  },

  {
    id: "AF-CON-024",

    rule: "When responsibility matters for audit or workflow meaning, identify the actual actor, role, process, or system rather than using ambiguous pronouns.",
    strength: "must",
  },
] as const;

// =============================================================================
// LABELS
// =============================================================================

export const LABEL_TYPES = {
  action: {
    purpose: "Names an operation.",
  },
  field: {
    purpose: "Names requested or displayed data.",
  },

  metric: {
    purpose: "Names a numerical measure.",
  },

  navigation: {
    purpose: "Names a destination.",
  },

  section: {
    purpose: "Names an information group.",
  },

  status: {
    purpose: "Names a state.",
  },
} as const;

export type LabelType = keyof typeof LABEL_TYPES;

// -----------------------------------------------------------------------------
// LABEL RULES
// -----------------------------------------------------------------------------

export const LABEL_RULES = [
  {
    id: "AF-CON-025",

    rule: "Labels identify their object or function without requiring placeholder text to supply missing meaning.",
    strength: "must",
  },

  {
    id: "AF-CON-026",

    rule: "Equivalent fields and actions use equivalent labels across modules.",
    strength: "must",
  },

  {
    id: "AF-CON-027",

    rule: "Labels avoid unnecessary punctuation where layout already communicates the relationship.",
    strength: "should",
  },

  {
    id: "AF-CON-028",

    rule: "Abbreviations are used only when they are established domain terminology or space constraints have a justified compact representation.",
    strength: "must",
  },

  {
    id: "AF-CON-029",

    rule: "A shortened visible label must not create ambiguity between distinct operations.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACTION LANGUAGE
// =============================================================================

/**
 * Actions use verbs.
 *
 * Avoid generic:
 *
 *   OK
 *   Yes
 *   No
 *   Continue
 *
 * when a specific action can be named.
 */
export const ACTION_VERB_CLASSES = {
  approve: {
    purpose: "Record an authorised positive workflow decision.",
  },

  archive: {
    purpose:
      "Remove an object from active work while retaining it as durable history.",
  },

  cancel: {
    purpose: "Stop a current process or dismiss an uncommitted operation.",
  },

  close: {
    purpose:
      "End an open object, period, process, or workspace state according to domain semantics.",
  },
  create: {
    purpose: "Create a new durable object.",
  },

  delete: {
    purpose: "Remove an object where the domain permits removal.",
  },

  export: {
    purpose: "Generate an external representation of data.",
  },

  import: {
    purpose:
      "Bring externally represented information into the governed product process.",
  },

  post: {
    purpose:
      "Commit a transaction into a governed accounting, inventory, payroll, or equivalent operational state.",
  },

  reject: {
    purpose: "Record an authorised negative workflow decision.",
  },

  release: {
    purpose:
      "Make an approved object or output available for its next external or operational use.",
  },

  reopen: {
    purpose: "Return an eligible closed state to an open state.",
  },

  restore: {
    purpose: "Return a recoverable deleted, archived, or previous state.",
  },

  reverse: {
    purpose:
      "Create the governed opposite transaction that offsets a previously committed transaction.",
  },

  save: {
    purpose:
      "Persist current editable changes without advancing a governed workflow state.",
  },

  submit: {
    purpose:
      "Send a record into a governed review, processing, or workflow stage.",
  },

  void: {
    purpose:
      "Invalidate a previously created or posted business object while retaining its historical record.",
  },
} as const;

export type ActionVerb = keyof typeof ACTION_VERB_CLASSES;

// =============================================================================
// ACTION RULES
// =============================================================================

export const ACTION_RULES = [
  {
    id: "AF-CON-030",

    rule: "Action labels begin with a verb or otherwise unambiguously communicate the resulting operation.",
    strength: "must",
  },

  {
    id: "AF-CON-031",

    rule: "Use the most specific governed action verb that accurately describes the operation.",
    strength: "must",
  },

  {
    id: "AF-CON-032",

    rule: "Save, Submit, Approve, Post, Release, Close, Void, Reverse, Archive, and Delete are not interchangeable verbs.",
    strength: "must",
  },

  {
    id: "AF-CON-033",

    rule: "Action terminology reflects actual domain state transitions rather than visual navigation.",
    strength: "must",
  },

  {
    id: "AF-CON-034",

    rule: "Avoid generic confirmation labels such as OK where the consequential action can be named directly.",
    strength: "should",
  },

  {
    id: "AF-CON-035",

    rule: "Cancel means abandon or dismiss the current operation and must not secretly perform a domain cancellation unless that is the action being named.",
    strength: "must",
  },

  {
    id: "AF-CON-036",

    rule: "Delete, Void, and Reverse remain separate because they imply materially different audit and domain consequences.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONSEQUENCE CLASSIFICATION
// =============================================================================

export const ACTION_CONSEQUENCE = {
  consequential: {
    purpose:
      "Operation creates material financial, legal, payroll, statutory, workflow, or data consequence.",
  },

  irreversible: {
    purpose:
      "Operation cannot reasonably be restored through ordinary user workflow.",
  },

  recoverable: {
    purpose:
      "Operation is not immediately reversible but a governed recovery path exists.",
  },
  reversible: {
    purpose: "Operation can be restored or undone without material loss.",
  },
} as const;

export type ActionConsequence = keyof typeof ACTION_CONSEQUENCE;

// =============================================================================
// DESTRUCTIVE / CONSEQUENTIAL ACTIONS
// =============================================================================

export const CONSEQUENTIAL_ACTION_RULES = [
  {
    id: "AF-CON-037",

    rule: "Consequential action content identifies the operation being performed.",
    strength: "must",
  },

  {
    id: "AF-CON-038",

    rule: "Where ambiguity would create risk, consequential action content identifies the affected object or scope.",
    strength: "must",
  },

  {
    id: "AF-CON-039",

    rule: "Irreversible action content explicitly communicates irreversibility before commitment.",
    strength: "must",
  },

  {
    id: "AF-CON-040",

    rule: "Recoverable actions do not falsely claim permanent deletion.",
    strength: "must",
  },

  {
    id: "AF-CON-041",

    rule: "Destructive visual treatment does not replace explicit consequence wording.",
    strength: "must",
  },

  {
    id: "AF-CON-042",

    rule: "A confirmation action uses the same canonical verb as the operation being confirmed.",
    strength: "must",
  },
] as const;

// =============================================================================
// STATUS LANGUAGE
// =============================================================================

/**
 * Status labels are nouns/adjectives describing CURRENT STATE.
 *
 * Actions are verbs describing TRANSITION.
 *
 * Example:
 *
 * STATUS        ACTION
 *
 * Draft         Submit
 * Submitted     Approve
 * Approved      Post
 * Posted        Reverse
 */
export const STATUS_LANGUAGE = {
  actionForm: "verb",

  canonical: true,
  form: "state-description",
} as const;

// -----------------------------------------------------------------------------
// STATUS RULES
// -----------------------------------------------------------------------------

export const STATUS_CONTENT_RULES = [
  {
    id: "AF-CON-043",

    rule: "Status content describes the current state rather than the action that produced it.",
    strength: "must",
  },

  {
    id: "AF-CON-044",

    rule: "Equivalent workflow states use stable terminology across list, detail, audit, filters, and notifications.",
    strength: "must",
  },

  {
    id: "AF-CON-045",

    rule: "Status wording remains semantically independent from status colour.",
    strength: "must",
  },

  {
    id: "AF-CON-046",

    rule: "Do not collapse materially different workflow states into one friendly display word merely to simplify the interface.",
    strength: "must",
  },
] as const;

// =============================================================================
// ERROR ANATOMY
// =============================================================================

export const ERROR_ANATOMY = [
  "what-happened",
  "why-or-constraint",
  "recovery",
] as const;

export type ErrorContentPart = (typeof ERROR_ANATOMY)[number];

// -----------------------------------------------------------------------------
// ERROR RULES
// -----------------------------------------------------------------------------

export const ERROR_CONTENT_RULES = [
  {
    id: "AF-CON-047",

    rule: "An error identifies what failed or what information is invalid.",
    strength: "must",
  },

  {
    id: "AF-CON-048",

    rule: "When useful and safe, an error explains the reason or applicable constraint.",
    strength: "should",
  },

  {
    id: "AF-CON-049",

    rule: "When recovery is possible, error content identifies the next reasonable recovery action.",
    strength: "must",
  },

  {
    id: "AF-CON-050",

    rule: "Do not expose internal exception messages, stack traces, database details, or implementation terminology as user-facing error content.",
    strength: "must",
  },

  {
    id: "AF-CON-051",

    rule: "Do not imply user error when the product cannot determine responsibility.",
    strength: "must",
  },

  {
    id: "AF-CON-052",

    rule: "Error content distinguishes validation failure, permission failure, conflict, unavailable dependency, and unexpected system failure when those distinctions change recovery.",
    strength: "must",
  },
] as const;

// =============================================================================
// ERROR CATEGORIES
// =============================================================================

export const ERROR_CATEGORIES = {
  conflict: {
    purpose: "The requested change conflicts with newer or incompatible state.",
  },

  dependency: {
    purpose:
      "The operation cannot complete because a required service or prerequisite is unavailable.",
  },

  permission: {
    purpose: "The current actor lacks required authority.",
  },

  system: {
    purpose: "Unexpected product or infrastructure failure.",
  },
  validation: {
    purpose:
      "User-provided or governed data violates an applicable requirement.",
  },
} as const;

export type ErrorCategory = keyof typeof ERROR_CATEGORIES;

// =============================================================================
// WARNING LANGUAGE
// =============================================================================

export const WARNING_RULES = [
  {
    id: "AF-CON-053",

    rule: "Warnings describe a meaningful risk or condition requiring attention before failure or consequence occurs.",
    strength: "must",
  },

  {
    id: "AF-CON-054",

    rule: "Do not label ordinary informational content as a warning merely to increase attention.",
    strength: "must",
  },

  {
    id: "AF-CON-055",

    rule: "Warnings distinguish between advisory information and blocking requirements.",
    strength: "must",
  },
] as const;

// =============================================================================
// CONFIRMATION
// =============================================================================

export const CONFIRMATION_TYPES = {
  "post-action": {
    purpose: "Confirms that an operation actually completed.",
  },
  "pre-action": {
    purpose: "Allows review before a consequential operation.",
  },

  "undo-capable": {
    purpose:
      "Confirms an operation while offering an immediate recovery mechanism.",
  },
} as const;

export type ConfirmationType = keyof typeof CONFIRMATION_TYPES;

// -----------------------------------------------------------------------------
// CONFIRMATION RULES
// -----------------------------------------------------------------------------

export const CONFIRMATION_RULES = [
  {
    id: "AF-CON-056",

    rule: "Pre-action confirmation is reserved for consequential, destructive, unusual, or difficult-to-recover operations.",
    strength: "must",
  },

  {
    id: "AF-CON-057",

    rule: "Routine reversible actions should not require redundant confirmation.",
    strength: "must",
  },

  {
    id: "AF-CON-058",

    rule: "Confirmation content names the actual operation rather than asking generic questions such as Are you sure?",
    strength: "must",
  },

  {
    id: "AF-CON-059",

    rule: "Post-action success content is shown only after the underlying operation has succeeded.",
    strength: "must",
  },

  {
    id: "AF-CON-060",

    rule: "Undo language is offered only when the operation is genuinely reversible through the offered mechanism.",
    strength: "must",
  },
] as const;

// =============================================================================
// NOTIFICATIONS / STATUS MESSAGES
// =============================================================================

export const NOTIFICATION_PRIORITY = {
  actionable: {
    purpose: "Status for which an available user action is relevant.",
  },
  passive: {
    purpose: "Useful status that does not require immediate action.",
  },

  urgent: {
    purpose:
      "Condition requiring prompt attention because delay has material consequence.",
  },
} as const;

export type NotificationPriority = keyof typeof NOTIFICATION_PRIORITY;

// -----------------------------------------------------------------------------
// NOTIFICATION RULES
// -----------------------------------------------------------------------------

export const NOTIFICATION_RULES = [
  {
    id: "AF-CON-061",

    rule: "Notifications communicate meaningful product events rather than every internal state transition.",
    strength: "must",
  },

  {
    id: "AF-CON-062",

    rule: "Notification urgency reflects actual consequence rather than visual preference.",
    strength: "must",
  },

  {
    id: "AF-CON-063",

    rule: "Actionable notifications identify the relevant action.",
    strength: "must",
  },

  {
    id: "AF-CON-064",

    rule: "High-frequency background operations must not produce repetitive notification noise.",
    strength: "must",
  },
] as const;

// =============================================================================
// EMPTY STATES
// =============================================================================

export const EMPTY_STATE_TYPES = {
  filtered: {
    purpose: "Objects may exist but current filters return no matches.",
  },
  initial: {
    purpose: "No objects have been created yet.",
  },

  permission: {
    purpose:
      "Content is unavailable because the actor does not have required access.",
  },

  search: {
    purpose: "Current query returns no matches.",
  },

  unavailable: {
    purpose: "Content cannot currently be retrieved or displayed.",
  },
} as const;

export type EmptyStateType = keyof typeof EMPTY_STATE_TYPES;

// -----------------------------------------------------------------------------
// EMPTY STATE RULES
// -----------------------------------------------------------------------------

export const EMPTY_STATE_RULES = [
  {
    id: "AF-CON-065",

    rule: "Empty-state content explains why the region is empty when the cause is meaningful.",
    strength: "must",
  },

  {
    id: "AF-CON-066",

    rule: "Initial, filtered, search, permission, and unavailable states must not use the same generic empty-state message.",
    strength: "must",
  },

  {
    id: "AF-CON-067",

    rule: "An empty state offers a relevant next action when the user can reasonably resolve the empty condition.",
    strength: "should",
  },

  {
    id: "AF-CON-068",

    rule: "Do not offer an action that the current actor cannot perform.",
    strength: "must",
  },

  {
    id: "AF-CON-069",

    rule: "Empty-state content remains concise and must not become promotional filler inside productive interfaces.",
    strength: "must",
  },
] as const;

// =============================================================================
// HELP / EXPLANATORY CONTENT
// =============================================================================

export const HELP_CONTENT_TYPES = {
  documentation: {
    purpose:
      "Detailed procedural or conceptual information outside immediate task flow.",
  },
  helper: {
    purpose: "Brief local guidance required to complete a task.",
  },

  rationale: {
    purpose:
      "Explanation of why a rule, requirement, or state exists where that understanding materially helps the user.",
  },

  tooltip: {
    purpose:
      "Short supplementary explanation for unfamiliar or ambiguous interface elements.",
  },
} as const;

// -----------------------------------------------------------------------------
// HELP RULES
// -----------------------------------------------------------------------------

export const HELP_RULES = [
  {
    id: "AF-CON-070",

    rule: "Help content supplements a clear interface rather than compensating for unclear primary labels.",
    strength: "must",
  },

  {
    id: "AF-CON-071",

    rule: "Essential instructions must not exist only inside hover-only tooltips.",
    strength: "must",
  },

  {
    id: "AF-CON-072",

    rule: "Prefer local task guidance for short constraints and external documentation for detailed conceptual material.",
    strength: "should",
  },
] as const;

// =============================================================================
// STRUCTURED VALUE FORMATTING
// =============================================================================

/**
 * Underlying business values are independent from presentation.
 *
 * Example:
 *
 *   underlying:
 *     12345.67
 *     MYR
 *
 * presentation:
 *     locale dependent
 *
 * Typography decides numeric glyph behaviour.
 * Content decides human-readable format.
 */
export const FORMAT_DOMAINS = {
  currency: {
    purpose: "Monetary values with explicit currency semantics.",
  },

  date: {
    purpose: "Calendar dates.",
  },

  datetime: {
    purpose: "Combined instant presentation.",
  },

  duration: {
    purpose: "Elapsed or expected time span.",
  },
  number: {
    purpose: "General numerical quantities.",
  },

  percentage: {
    purpose: "Ratios presented as percentages.",
  },

  time: {
    purpose: "Times of day.",
  },

  unit: {
    purpose: "Measured quantities.",
  },
} as const;

export type FormatDomain = keyof typeof FORMAT_DOMAINS;

// =============================================================================
// LOCALE MODEL
// =============================================================================

export const LOCALE_MODEL = {
  direction: "text base direction",
  language: "content language",

  numberingSystem: "numeric symbol system",

  region: "regional formatting and convention",

  script: "writing script",

  timeZone: "time-zone context for instant presentation",
} as const;

// -----------------------------------------------------------------------------
// LOCALE RULES
// -----------------------------------------------------------------------------

export const LOCALE_RULES = [
  {
    id: "AF-CON-073",

    rule: "Human-readable numbers, currencies, dates, times, and units use locale-aware formatting.",
    strength: "must",
  },

  {
    id: "AF-CON-074",

    rule: "Locale formatting must not alter the underlying stored business value.",
    strength: "must",
  },

  {
    id: "AF-CON-075",

    rule: "Language and region are treated as separate locale dimensions where their distinction affects presentation.",
    strength: "must",
  },

  {
    id: "AF-CON-076",

    rule: "Application code must not manually concatenate translated fragments when grammatical structure may vary by language.",
    strength: "must",
  },

  {
    id: "AF-CON-077",

    rule: "Localised messages allow language-appropriate reordering, inflection, and pluralisation.",
    strength: "must",
  },

  {
    id: "AF-CON-078",

    rule: "Tenant preference may select supported locale presentation but must not alter statutory or business meaning.",
    strength: "must",
  },
] as const;

// =============================================================================
// NUMBERS
// =============================================================================

export const NUMBER_FORMAT_RULES = [
  {
    id: "AF-CON-079",

    rule: "Human-readable numerical separators and symbols follow the applicable locale convention.",
    strength: "must",
  },

  {
    id: "AF-CON-080",

    rule: "Precision reflects domain meaning rather than arbitrary display convenience.",
    strength: "must",
  },

  {
    id: "AF-CON-081",

    rule: "Rounding presentation does not silently alter the stored or calculated value.",
    strength: "must",
  },

  {
    id: "AF-CON-082",

    rule: "Approximate numerical presentation is distinguishable from exact value where the distinction affects decisions.",
    strength: "must",
  },
] as const;

// =============================================================================
// CURRENCY
// =============================================================================

export const CURRENCY_RULES = [
  {
    id: "AF-CON-083",

    rule: "Currency values retain explicit currency identity when ambiguity between currencies is possible.",
    strength: "must",
  },

  {
    id: "AF-CON-084",

    rule: "Currency symbol placement, separators, and spacing follow the applicable locale convention.",
    strength: "must",
  },

  {
    id: "AF-CON-085",

    rule: "A currency symbol must not be assumed to uniquely identify a currency where multiple currencies share that symbol.",
    strength: "must",
  },

  {
    id: "AF-CON-086",

    rule: "Accounting presentation and ordinary currency presentation remain separate formatting purposes.",
    strength: "must",
  },
] as const;

// =============================================================================
// PERCENTAGE
// =============================================================================

export const PERCENTAGE_RULES = [
  {
    id: "AF-CON-087",

    rule: "Percentage presentation distinguishes ratio values from already-scaled percentage values in implementation contracts.",
    strength: "must",
  },

  {
    id: "AF-CON-088",

    rule: "Percentage precision reflects the decision significance of the underlying metric.",
    strength: "must",
  },

  {
    id: "AF-CON-089",

    rule: "Positive or negative percentage meaning is communicated independently from typographic sign colour alone.",
    strength: "must",
  },
] as const;

// =============================================================================
// DATE / TIME
// =============================================================================

export const DATE_TIME_SEMANTICS = {
  date: {
    purpose:
      "Calendar date without an implied instant unless the domain defines one.",
  },

  duration: {
    purpose: "Elapsed or expected amount of time.",
  },

  instant: {
    purpose: "Specific moment requiring time-zone-aware presentation.",
  },

  localTime: {
    purpose: "Wall-clock time in a specified local context.",
  },
} as const;

// -----------------------------------------------------------------------------
// DATE/TIME RULES
// -----------------------------------------------------------------------------

export const DATE_TIME_RULES = [
  {
    id: "AF-CON-090",

    rule: "Calendar dates and instants are distinct data semantics.",
    strength: "must",
  },

  {
    id: "AF-CON-091",

    rule: "Human-readable dates follow locale conventions unless an explicit regulatory, contractual, or interoperable format is required.",
    strength: "must",
  },

  {
    id: "AF-CON-092",

    rule: "An instant is presented in an explicit or contextually unambiguous time zone.",
    strength: "must",
  },

  {
    id: "AF-CON-093",

    rule: "Time-zone conversion must not alter date-only business values.",
    strength: "must",
  },

  {
    id: "AF-CON-094",

    rule: "Relative time such as today, yesterday, or 3 hours ago is used only when the reference point remains unambiguous and useful.",
    strength: "must",
  },

  {
    id: "AF-CON-095",

    rule: "Consequential deadlines and audit timestamps provide absolute date or time information rather than relying exclusively on relative wording.",
    strength: "must",
  },
] as const;

// =============================================================================
// MEASUREMENT UNITS
// =============================================================================

export const UNIT_RULES = [
  {
    id: "AF-CON-096",

    rule: "Measured quantities include sufficient unit information to interpret the value.",
    strength: "must",
  },

  {
    id: "AF-CON-097",

    rule: "Unit conversion must not occur silently when the converted value could affect a business decision.",
    strength: "must",
  },

  {
    id: "AF-CON-098",

    rule: "Unit display follows applicable locale and domain conventions.",
    strength: "must",
  },
] as const;

// =============================================================================
// PLURALISATION
// =============================================================================

export const PLURAL_RULES = [
  {
    id: "AF-CON-099",

    rule: "Pluralised messages use the grammatical plural categories required by the target locale.",
    strength: "must",
  },

  {
    id: "AF-CON-100",

    rule: "Application code must not assume that every language has singular and plural as its only grammatical number forms.",
    strength: "must",
  },

  {
    id: "AF-CON-101",

    rule: "Number ranges and counted units remain localisable without English-specific sentence construction.",
    strength: "must",
  },
] as const;

// =============================================================================
// DIRECTION
// =============================================================================

/**
 * Direction is a SCRIPT/TEXT property.
 *
 * It must not be inferred blindly from locale.
 *
 * A single page may contain:
 *
 *   RTL paragraph
 *   LTR invoice ID
 *   Arabic text
 *   English product name
 *   number
 *
 * simultaneously.
 */
export const CONTENT_DIRECTIONS = ["ltr", "rtl", "auto"] as const;

export type ContentDirection = (typeof CONTENT_DIRECTIONS)[number];

// -----------------------------------------------------------------------------
// DIRECTION RULES
// -----------------------------------------------------------------------------

export const DIRECTION_RULES = [
  {
    id: "AF-CON-102",

    rule: "Base document direction follows the active content direction.",
    strength: "must",
  },

  {
    id: "AF-CON-103",

    rule: "Direction is treated as a property of content and script rather than inferred solely from language or region.",
    strength: "must",
  },

  {
    id: "AF-CON-104",

    rule: "Interface layout uses logical start and end semantics so direction may change without rewriting component geometry.",
    strength: "must",
  },

  {
    id: "AF-CON-105",

    rule: "Direction-sensitive icons mirror only when their semantic direction requires mirroring.",
    strength: "must",
  },

  {
    id: "AF-CON-106",

    rule: "Non-directional symbols and brand marks must not mirror merely because the interface direction changes.",
    strength: "must",
  },
] as const;

// =============================================================================
// BIDIRECTIONAL CONTENT
// =============================================================================

export const BIDI_CONTENT_CLASSES = {
  identifier: {
    purpose:
      "Codes, account numbers, invoice IDs, URLs, emails, and other sequences whose internal ordering must remain intact.",
  },

  isolated: {
    purpose:
      "User-generated or externally supplied text whose direction must not disrupt surrounding bidi ordering.",
  },
  natural: {
    purpose:
      "Content whose base direction follows the surrounding document or explicitly declared content language.",
  },
} as const;

export type BidiContentClass = keyof typeof BIDI_CONTENT_CLASSES;

// -----------------------------------------------------------------------------
// BIDI RULES
// -----------------------------------------------------------------------------

export const BIDI_RULES = [
  {
    id: "AF-CON-107",

    rule: "Bidirectional content is stored and presented in logical order rather than visual order.",
    strength: "must",
  },

  {
    id: "AF-CON-108",

    rule: "Externally supplied or user-generated text is isolated from surrounding bidirectional text where its direction is not trusted or known.",
    strength: "must",
  },

  {
    id: "AF-CON-109",

    rule: "Machine identifiers preserve their character sequence regardless of surrounding interface direction.",
    strength: "must",
  },

  {
    id: "AF-CON-110",

    rule: "Directionality must not be simulated through manual punctuation, whitespace, or character reversal.",
    strength: "must",
  },

  {
    id: "AF-CON-111",

    rule: "Form fields that accept unknown-direction user text support automatic or content-appropriate base direction where applicable.",
    strength: "must",
  },
] as const;

// =============================================================================
// IDENTIFIERS
// =============================================================================

/**
 * Identifiers are not ordinary prose.
 *
 * Examples:
 *
 *   INV-2026-00183
 *   EMP-004182
 *   UUID
 *   tax ID
 *   bank account
 *   email
 *   URL
 */
export const IDENTIFIER_RULES = [
  {
    id: "AF-CON-112",

    rule: "Identifiers preserve exact characters, order, and meaningful punctuation.",
    strength: "must",
  },

  {
    id: "AF-CON-113",

    rule: "Identifiers are not translated.",
    strength: "must",
  },

  {
    id: "AF-CON-114",

    rule: "Visual wrapping or truncation must not alter the identifier value copied, announced, exported, or submitted.",
    strength: "must",
  },

  {
    id: "AF-CON-115",

    rule: "Where identifiers are masked for privacy or security, masking presentation must remain distinguishable from the underlying canonical value.",
    strength: "must",
  },

  {
    id: "AF-CON-116",

    rule: "Identifier labels and identifier values are separate content semantics.",
    strength: "must",
  },
] as const;

// =============================================================================
// AUDIT CONTENT
// =============================================================================

/**
 * Audit language is evidence.
 *
 * It prioritises factual precision over conversational tone.
 */
export const AUDIT_EVENT_MODEL = {
  action: {
    purpose: "What operation occurred.",
  },
  actor: {
    purpose: "Who or what performed the event.",
  },

  object: {
    purpose: "What object or record was affected.",
  },

  outcome: {
    purpose: "Result of the event where relevant.",
  },

  reason: {
    purpose: "Recorded rationale where the domain requires it.",
  },

  time: {
    purpose: "When the event occurred.",
  },
} as const;

// -----------------------------------------------------------------------------
// AUDIT RULES
// -----------------------------------------------------------------------------

export const AUDIT_RULES = [
  {
    id: "AF-CON-117",

    rule: "Audit content states factual recorded events rather than inferred intention.",
    strength: "must",
  },

  {
    id: "AF-CON-118",

    rule: "Audit action terminology uses the same canonical operation semantics as the underlying domain action.",
    strength: "must",
  },

  {
    id: "AF-CON-119",

    rule: "Audit timestamps remain absolute and time-zone interpretable.",
    strength: "must",
  },

  {
    id: "AF-CON-120",

    rule: "Human actor, automated process, integration, and system action remain distinguishable where provenance matters.",
    strength: "must",
  },

  {
    id: "AF-CON-121",

    rule: "Audit history must not rewrite historical terminology in a way that changes the recorded event meaning.",
    strength: "must",
  },
] as const;

// =============================================================================
// AI-GENERATED CONTENT
// =============================================================================

export const AI_CONTENT_CLASSES = {
  authoritative: {
    purpose:
      "Content produced through a governed deterministic system process rather than generative inference.",
  },

  draft: {
    purpose:
      "Generated editable content requiring user review before authoritative use.",
  },

  inference: {
    purpose: "Derived interpretation not directly stored as source fact.",
  },
  suggestion: {
    purpose: "Optional recommendation the user may choose to apply.",
  },

  summary: {
    purpose: "Generated synthesis of underlying information.",
  },
} as const;

export type AiContentClass = keyof typeof AI_CONTENT_CLASSES;

// -----------------------------------------------------------------------------
// AI CONTENT RULES
// -----------------------------------------------------------------------------

export const AI_CONTENT_RULES = [
  {
    id: "AF-CON-122",

    rule: "AI-generated suggestion, draft, summary, or inference must not be presented as an authoritative stored fact where the distinction affects decisions.",
    strength: "must",
  },

  {
    id: "AF-CON-123",

    rule: "AI-assisted transactional content remains reviewable before committing consequential operations.",
    strength: "must",
  },

  {
    id: "AF-CON-124",

    rule: "AI-generated content must not silently replace canonical business data.",
    strength: "must",
  },

  {
    id: "AF-CON-125",

    rule: "Where source evidence is available and material to trust, the interface preserves a way to distinguish generated synthesis from its supporting records.",
    strength: "must",
  },

  {
    id: "AF-CON-126",

    rule: "AI confidence, uncertainty, or limitations are communicated when omission could materially mislead the user.",
    strength: "must",
  },

  {
    id: "AF-CON-127",

    rule: "AI-generated error explanations or recommendations do not override authoritative domain validation or workflow state.",
    strength: "must",
  },
] as const;

// =============================================================================
// ACCESSIBILITY RELATIONSHIP
// =============================================================================

export const CONTENT_ACCESSIBILITY_REQUIREMENTS = [
  "accessible-name",
  "accessible-description",
  "labels-instructions",
  "error-identification",
  "error-suggestion",
  "error-prevention",
  "status-announcement",
  "non-colour-meaning",
  "text-resize",
  "reflow",
  "hover-focus-content",
] as const;

// -----------------------------------------------------------------------------
// ACCESSIBILITY RULES
// -----------------------------------------------------------------------------

export const CONTENT_ACCESSIBILITY_RULES = [
  {
    id: "AF-CON-128",

    rule: "Visible labels and programmatic names remain semantically aligned.",
    strength: "must",
  },

  {
    id: "AF-CON-129",

    rule: "Error content identifies the problem in text rather than relying solely on visual styling.",
    strength: "must",
  },

  {
    id: "AF-CON-130",

    rule: "Essential instructions remain available without requiring hover.",
    strength: "must",
  },

  {
    id: "AF-CON-131",

    rule: "Status wording remains useful when announced without surrounding visual context.",
    strength: "must",
  },

  {
    id: "AF-CON-132",

    rule: "Truncation must not permanently remove information required to complete the task.",
    strength: "must",
  },
] as const;

// =============================================================================
// TENANT CONTENT POLICY
// =============================================================================

export const CONTENT_TENANT_POLICY = {
  customisable: [
    "permitted brand names",
    "permitted tenant business vocabulary",
    "tenant help content",
    "tenant-specific instructions",
  ],
  default: "closed",

  principle:
    "Tenant vocabulary may adapt business expression where explicitly permitted but cannot redefine Afenda system semantics.",

  protected: [
    "system action semantics",
    "workflow verbs",
    "error categories",
    "statutory terminology",
    "audit meaning",
    "accessibility wording requirements",
    "formatting semantics",
    "AI disclosure semantics",
  ],
} as const;

// -----------------------------------------------------------------------------
// TENANT RULES
// -----------------------------------------------------------------------------

export const CONTENT_TENANT_RULES = [
  {
    id: "AF-CON-133",

    rule: "Tenant terminology substitution is deny-by-default.",
    strength: "must",
  },

  {
    id: "AF-CON-134",

    rule: "Tenant terminology may change a permitted display name but not the underlying canonical concept identity.",
    strength: "must",
  },

  {
    id: "AF-CON-135",

    rule: "Tenant wording must remain localisable and accessible.",
    strength: "must",
  },
] as const;

// =============================================================================
// PUBLIC API
// =============================================================================

export const CONTENT_PUBLIC_API = {
  action: [
    "create",
    "save",
    "submit",
    "approve",
    "reject",
    "post",
    "release",
    "close",
    "reopen",
    "cancel",
    "void",
    "reverse",
    "delete",
    "restore",
    "archive",
    "export",
    "import",
  ],

  ai: ["suggestion", "draft", "summary", "inference", "authoritative"],

  bidi: ["natural", "isolated", "identifier"],

  confirmation: ["pre-action", "post-action", "undo-capable"],

  consequence: ["reversible", "recoverable", "irreversible", "consequential"],

  direction: ["ltr", "rtl", "auto"],

  emptyState: ["initial", "filtered", "search", "permission", "unavailable"],

  errorCategory: [
    "validation",
    "permission",
    "conflict",
    "dependency",
    "system",
  ],

  format: [
    "number",
    "currency",
    "percentage",
    "date",
    "time",
    "datetime",
    "duration",
    "unit",
  ],
} as const;

// =============================================================================
// CONTENT CONTRACT
// =============================================================================

export interface ContentContract {
  readonly actions?: readonly ActionVerb[];

  readonly auditRelevant?: boolean;

  readonly bidiSensitive?: boolean;

  readonly consequence?: ActionConsequence;

  readonly errorCategories?: readonly ErrorCategory[];

  readonly formats?: readonly FormatDomain[];

  readonly localisable: boolean;
  readonly terminology?: readonly string[];
}

// =============================================================================
// TRANSACTION CONTENT CONTRACT
// =============================================================================

export interface TransactionContentContract {
  readonly action: ActionVerb;

  readonly confirmationRequired: boolean;

  readonly consequence: ActionConsequence;

  readonly objectRequired: boolean;

  readonly reversible: boolean;

  readonly scopeRequired: boolean;
}

// =============================================================================
// FORBIDDEN USAGE
// =============================================================================

export const CONTENT_FORBIDS = [
  {
    behaviour:
      "equivalent business concepts use different terminology solely for stylistic variety",
    id: "AF-CON-136",
    strength: "must",
  },

  {
    behaviour:
      "generic OK, Yes, or Continue replaces a specific consequential action label where the operation can be named",
    id: "AF-CON-137",
    strength: "must",
  },

  {
    behaviour:
      "Save, Submit, Approve, Post, Release, Void, Reverse, Delete, and Close are treated as interchangeable operations",
    id: "AF-CON-138",
    strength: "must",
  },

  {
    behaviour:
      "destructive consequence is communicated solely through red colour or destructive styling",
    id: "AF-CON-139",
    strength: "must",
  },

  {
    behaviour:
      "internal exception text or stack traces are shown as normal user-facing error content",
    id: "AF-CON-140",
    strength: "must",
  },

  {
    behaviour: "error content blames the user when responsibility is unknown",
    id: "AF-CON-141",
    strength: "must",
  },

  {
    behaviour: "placeholder text is the only persistent field label",
    id: "AF-CON-142",
    strength: "must",
  },

  {
    behaviour:
      "human-readable number, currency, date, time, or unit formatting is manually assembled from locale-specific punctuation",
    id: "AF-CON-143",
    strength: "must",
  },

  {
    behaviour:
      "translated sentences are constructed by concatenating independently translated fragments whose grammatical order may vary",
    id: "AF-CON-144",
    strength: "must",
  },

  {
    behaviour:
      "English singular-plural assumptions are embedded into canonical message semantics",
    id: "AF-CON-145",
    strength: "must",
  },

  {
    behaviour:
      "text direction is inferred solely from country or interface width",
    id: "AF-CON-146",
    strength: "must",
  },

  {
    behaviour:
      "RTL support is implemented by manually reversing text or data order",
    id: "AF-CON-147",
    strength: "must",
  },

  {
    behaviour: "machine identifiers are translated",
    id: "AF-CON-148",
    strength: "must",
  },

  {
    behaviour:
      "relative date wording is the only representation of a consequential deadline or audit event",
    id: "AF-CON-149",
    strength: "must",
  },

  {
    behaviour:
      "AI-generated inference is silently presented as authoritative stored business data",
    id: "AF-CON-150",
    strength: "must",
  },

  {
    behaviour:
      "tenant terminology changes protected system or statutory meaning",
    id: "AF-CON-151",
    strength: "must",
  },
] as const;

// =============================================================================
// SOURCE PROVENANCE
// =============================================================================

export const CONTENT_SOURCES = [
  {
    adaptation:
      "Afenda adopts Carbon's enterprise-product content discipline while extending it with transactional verbs, audit language, international formatting, and AI-content semantics.",

    contribution: [
      "product-interface content as a design discipline",
      "clear and purposeful writing",
      "action labels",
      "content accessibility",
      "consistent product terminology",
    ],

    disposition: "adapt",
    id: "carbon-content",

    system: "IBM Carbon Design System",
  },

  {
    adaptation:
      "Afenda preserves concise and task-oriented writing but expands the model for ERP transactions and multi-locale enterprise workflows.",

    contribution: [
      "concise interface writing",
      "action-oriented labels",
      "pronoun guidance",
      "punctuation discipline",
      "global writing guidance",
    ],

    disposition: "adapt",
    id: "m3-content",

    system: "Material 3",
  },

  {
    adaptation:
      "Afenda treats CLDR-backed conventions as the reference for locale-sensitive human-readable formatting while Level 2 chooses the actual formatting implementation.",

    contribution: [
      "locale identifiers",
      "number formatting",
      "currency formatting",
      "date formatting",
      "time formatting",
      "units",
      "plural rules",
      "locale display names",
    ],

    disposition: "adopt",
    id: "unicode-cldr",

    system: "Unicode CLDR",
  },

  {
    adaptation:
      "Afenda makes bidi resilience a core content contract and relies on logical layout semantics from 04-geometry.ts and 05-layout.ts.",

    contribution: [
      "RTL page direction",
      "bidirectional text handling",
      "logical ordering",
      "text direction independent from language assumptions",
      "direction handling for user-generated content",
    ],

    disposition: "adopt",
    id: "w3c-bidi",

    system: "W3C Internationalisation",
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

export const CONTENT_SOURCE_DISPOSITION = {
  "afenda-ai-content-semantics": "adapt",

  "afenda-audit-language": "adapt",

  "afenda-error-anatomy": "adapt",

  "afenda-transaction-consequence": "adapt",

  // Afenda

  "afenda-transaction-verbs": "adapt",

  "carbon-action-label-discipline": "adopt",
  // Carbon

  "carbon-clear-purposeful-product-content": "adopt",

  "carbon-enterprise-tone": "adapt",

  "carbon-writing-accessibility": "adopt",

  "cldr-currency-format": "adopt",

  "cldr-date-time-format": "adopt",

  // Unicode

  "cldr-locale-formatting": "adopt",

  "cldr-number-format": "adopt",

  "cldr-plural-rules": "adopt",

  "m3-action-oriented-content": "adopt",

  // M3

  "m3-concise-writing": "adopt",

  "m3-global-writing": "adopt",

  "m3-pronoun-guidance": "adapt",

  "m3-punctuation": "adapt",

  "w3c-bidi-isolation": "adopt",

  "w3c-document-direction": "adopt",

  // W3C bidi

  "w3c-logical-text-order": "adopt",
} as const satisfies Readonly<Record<string, SourceDisposition>>;

// =============================================================================
// LEVEL-2 OBLIGATIONS
// =============================================================================

export const CONTENT_IMPLEMENTATION_OBLIGATIONS = [
  {
    id: "AF-CON-152",

    obligation:
      "Level 2 uses canonical terminology identities rather than independently authored synonyms for governed concepts.",
    strength: "must",
  },

  {
    id: "AF-CON-153",

    obligation:
      "Level 2 supports localisation of every user-facing content string that is not intentionally invariant.",
    strength: "must",
  },

  {
    id: "AF-CON-154",

    obligation:
      "Level 2 formats human-readable numbers, currency, dates, times, and units using governed locale-aware mechanisms.",
    strength: "must",
  },

  {
    id: "AF-CON-155",

    obligation:
      "Level 2 supports grammatical message variation and pluralisation without English-specific string concatenation.",
    strength: "must",
  },

  {
    id: "AF-CON-156",

    obligation:
      "Level 2 preserves logical text ordering and correct directionality for supported RTL and mixed-direction content.",
    strength: "must",
  },

  {
    id: "AF-CON-157",

    obligation:
      "Level 2 preserves canonical identifiers independently from translated display labels.",
    strength: "must",
  },

  {
    id: "AF-CON-158",

    obligation:
      "Level 2 exposes audit content using canonical actor, action, object, time, and outcome semantics.",
    strength: "must",
  },

  {
    id: "AF-CON-159",

    obligation:
      "AI-generated content presentation preserves the distinctions required by the AI content contract.",
    strength: "must",
  },
] as const;

// =============================================================================
// LEVEL-3 PROOF REQUIREMENTS
// =============================================================================

export const CONTENT_GOVERNANCE_REQUIREMENTS = [
  {
    id: "AF-CON-160",

    prove: "governed action APIs use canonical action verbs",
  },

  {
    id: "AF-CON-161",

    prove: "protected workflow actions do not use conflicting terminology",
  },

  {
    id: "AF-CON-162",

    prove:
      "consequential actions have the required consequence and confirmation content",
  },

  {
    id: "AF-CON-163",

    prove: "error messages expose required error anatomy where applicable",
  },

  {
    id: "AF-CON-164",

    prove:
      "user-facing localisable strings are not unnecessarily hardcoded in product implementation",
  },

  {
    id: "AF-CON-165",

    prove:
      "locale-sensitive structured values are formatted through the governed localisation mechanism",
  },

  {
    id: "AF-CON-166",

    prove:
      "translated messages are not assembled through unsafe grammatical string concatenation",
  },

  {
    id: "AF-CON-167",

    prove: "supported pluralised content has locale-appropriate message forms",
  },

  {
    id: "AF-CON-168",

    prove:
      "supported RTL layouts and mixed-direction content preserve logical order",
  },

  {
    id: "AF-CON-169",

    prove:
      "identifiers remain invariant across supported locales and directions",
  },

  {
    id: "AF-CON-170",

    prove: "audit events use stable canonical action and actor semantics",
  },

  {
    id: "AF-CON-171",

    prove:
      "AI-generated or inferred consequential content is not indistinguishably substituted for authoritative business facts",
  },

  {
    id: "AF-CON-172",

    prove:
      "tenant terminology overrides affect only explicitly customisable concepts",
  },

  {
    id: "AF-CON-173",

    prove:
      "essential content remains accessible under truncation, localisation expansion, text resize, and reflow",
  },
] as const;

// =============================================================================
// CONFORMANCE
// =============================================================================

export const CONTENT_CONFORMANCE = {
  completeWhen: ["language-defined", "implemented", "proven"],

  governance: [
    "terminology-validated",
    "transaction-content-validated",
    "localisation-validated",
    "formatting-validated",
    "rtl-validated",
    "audit-validated",
    "ai-content-validated",
  ],

  implementation: [
    "terminology-consistent",
    "localisable",
    "locale-aware",
    "bidi-capable",
    "audit-capable",
    "ai-distinguishable",
  ],
  language: [
    "terminology-defined",
    "action-language-defined",
    "consequence-defined",
    "error-anatomy-defined",
    "status-defined",
    "formatting-defined",
    "locale-defined",
    "direction-defined",
    "audit-defined",
    "ai-content-defined",
  ],
} as const;

// =============================================================================
// PUBLIC TYPES
// =============================================================================

export type ContentPublicApi = typeof CONTENT_PUBLIC_API;

export type ContentSourceDisposition =
  (typeof CONTENT_SOURCE_DISPOSITION)[keyof typeof CONTENT_SOURCE_DISPOSITION];
