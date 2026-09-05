/**
 * The block manifest shape (ADR-016): a block is DEFINED, not hand-rendered.
 * Each block folder carries a manifest.ts — its base composition, variants
 * and sizes as lists of ADL utility literals — and its index.tsx derives
 * the rendered classes from that data mechanically. The literals live in
 * data so Tailwind's scanner sees them, R15 checks them against the
 * Level-1 contract data-to-data, and nothing about the block's look exists
 * only inside a render.
 */

export interface BlockManifest {
  /** ADL utilities every variant and size shares. */
  readonly base: readonly string[];
  readonly sizes: Readonly<Record<string, readonly string[]>>;
  /** The data-slot the root stamps; must be declared in the contract's anatomy. */
  readonly slot: string;
  readonly variants: Readonly<Record<string, readonly string[]>>;
}

/** One variant/size axis as cva expects it, with the key union preserved. */
export const classMap = <K extends string>(
  axis: Readonly<Record<K, readonly string[]>>
): Record<K, string> =>
  Object.fromEntries(
    Object.entries(axis).map(([name, classes]) => [
      name,
      (classes as readonly string[]).join(" "),
    ])
  ) as Record<K, string>;
