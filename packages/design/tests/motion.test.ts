import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R10 — motion is a preference (docs/architecture.md §6.2). tw-animate-css
 * ships no reduced-motion rule and neither does Base UI, so globals.css
 * carries one block that collapses every animation and transition under
 * `prefers-reduced-motion: reduce`. The checker takes CSS text and proves
 * itself on the block's removal.
 */

const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8");

const QUERY = "@media (prefers-reduced-motion: reduce)";
const REQUIRED = [
  "animation-duration: 0.01ms !important",
  "animation-iteration-count: 1 !important",
  "transition-duration: 0.01ms !important",
] as const;

/** The declarations inside the reduced-motion block that are missing. */
const missingUnderReducedMotion = (source: string): string[] => {
  const start = source.indexOf(QUERY);
  if (start < 0) {
    return [QUERY];
  }
  // The block ends at the first `}` that closes a `{` opened after the query
  // at depth zero — the media block itself, not the rule inside it.
  let depth = 0;
  let end = start;
  for (; end < source.length; end += 1) {
    const ch = source[end];
    if (ch === "{") {
      depth += 1;
    } else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        break;
      }
    }
  }
  const block = source.slice(start, end);
  return REQUIRED.filter((declaration) => !block.includes(declaration));
};

describe("R10 — animations and transitions collapse under reduced motion", () => {
  it("declares the block, with every collapse it needs", () => {
    expect(missingUnderReducedMotion(css)).toEqual([]);
  });

  it("proves itself on the block's removal", () => {
    const start = css.indexOf(QUERY);
    expect(start).toBeGreaterThan(0);
    const planted = css.slice(0, start);
    expect(missingUnderReducedMotion(planted)).toEqual([QUERY]);
  });
});
