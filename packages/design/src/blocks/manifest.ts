/**
 * The block manifest shape (ADR-016): a block is DEFINED, not hand-rendered.
 * Each block folder carries a manifest.ts — its parts keyed by the data-slot
 * each stamps, every part's base composition, variants and sizes as lists of
 * ADL utility literals — and its index.tsx derives the rendered classes from
 * that data mechanically. The part keys ARE the anatomy: R15 holds them equal
 * to the contract's declared slots in both directions, so a part cannot exist
 * outside the contract and a visibility boolean has nowhere to live. The
 * literals stay in data so Tailwind's scanner sees them and nothing about the
 * block's look exists only inside a render.
 */

/** One stamped part: what the slot draws, as ADL utility literals. */
export interface PartManifest {
  /** ADL utilities every variant and size of this part shares. */
  readonly base: readonly string[];
  readonly sizes?: Readonly<Record<string, readonly string[]>>;
  readonly variants?: Readonly<Record<string, readonly string[]>>;
}

export interface BlockManifest {
  /** Every part the block stamps, keyed by data-slot; equals the contract's anatomy. */
  readonly parts: Readonly<Record<string, PartManifest>>;
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
