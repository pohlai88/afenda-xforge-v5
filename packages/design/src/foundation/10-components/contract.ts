/**
 * AFENDA DESIGN LANGUAGE — COMPONENT CONTRACT
 *
 * The shape every 10-components/<name>.ts declaration satisfies (ADR-016).
 * A contract is the Level-1 lock on one block: its identity, the intents
 * agents find it by, its anatomy as data-slot parts bound to the closed
 * part classes, its finite public API with a semantic reason per entry,
 * the colour roles its classes may draw, the behaviour rules it must
 * satisfy, and its own AF-CMP-<CODE>-NNN rules. R15 holds the block in
 * src/blocks/<name>/ equal to this data; R14 holds the rule IDs to the
 * grammar.
 *
 * Discovered facts (which props exist, which classes are written) live in
 * the block and are read by the checks — a contract never restates what
 * code already states. It declares only what code cannot: meaning.
 */

import type { PartClass } from "../../anatomy";
import type { RuleStrength, SourceDisposition } from "../00-principles";

export interface ComponentPart {
  /** One of the ten closed part classes in anatomy.ts. */
  readonly partClass: PartClass;
  readonly purpose: string;
}

export interface ComponentRule {
  /** AF-CMP-<CODE>-NNN; permanent once published. */
  readonly id: string;
  readonly rule: string;
  readonly strength: RuleStrength;
}

export interface ComponentSource {
  readonly disposition: SourceDisposition;
  readonly id: string;
  readonly note: string;
  readonly system: string;
}

export interface ComponentContract {
  /** Every data-slot the block stamps, classified. Both directions checked. */
  readonly anatomy: Readonly<Record<string, ComponentPart>>;
  /** The finite public API (AF-PRI-010): every entry carries its reason. */
  readonly api: {
    readonly sizes: Readonly<Record<string, string>>;
    /** Interaction axes the block participates in (07-interaction). */
    readonly states: readonly string[];
    readonly variants: Readonly<Record<string, string>>;
  };
  /** Level-1 rule IDs (interaction, accessibility) the block must satisfy. */
  readonly behaviour: readonly string[];
  /** AF-CMP code segment, SCREAMING: BUTTON, DATA-GRID. */
  readonly code: string;
  readonly do: readonly string[];
  readonly dont: readonly string[];
  /** A repo-relative path that uses the block well; liveness-checked. */
  readonly exemplar: string;
  /** The block folder name under src/blocks/. */
  readonly id: string;
  /** Curated search keys — how an agent finds this block. */
  readonly intents: readonly string[];
  readonly purpose: string;
  readonly rules: readonly ComponentRule[];
  readonly sources: readonly ComponentSource[];
  /**
   * The colour roles the block's classes may draw (02-color identities).
   * R15 refuses a colour utility outside this list, and an admitted role
   * no class consumes.
   */
  readonly tokens: readonly string[];
  readonly version: string;
}
