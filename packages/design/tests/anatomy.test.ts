import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R2 — a part is a `data-slot`, and the set of parts per component is a
 * reviewed fact (docs/architecture.md §6.3). The anatomy is discovered from
 * source; this file only pins it, so a regenerated component that gains or
 * loses a part is a one-line reviewed diff here.
 */

const COMPONENTS = join(process.cwd(), "src/components");
const SLOT = /data-slot="([a-z-]+)"/g;

/** Components that stamp no part of their own, each with the reason. */
const NO_PARTS: Readonly<Record<string, string>> = {
  badge: "a single element with no sub-parts; its root is the whole anatomy",
  sonner: "a third-party toaster whose markup the design package does not own",
};

/** The reviewed anatomy. Change a component, and this diff is the review. */
const ANATOMY: Readonly<Record<string, readonly string[]>> = {
  avatar: [
    "avatar",
    "avatar-badge",
    "avatar-fallback",
    "avatar-group",
    "avatar-group-count",
    "avatar-image",
  ],
  button: ["button"],
  card: [
    "card",
    "card-action",
    "card-content",
    "card-description",
    "card-footer",
    "card-header",
    "card-title",
  ],
  dialog: [
    "dialog",
    "dialog-close",
    "dialog-content",
    "dialog-description",
    "dialog-footer",
    "dialog-header",
    "dialog-overlay",
    "dialog-portal",
    "dialog-title",
    "dialog-trigger",
  ],
  "dropdown-menu": [
    "dropdown-menu",
    "dropdown-menu-checkbox-item",
    "dropdown-menu-checkbox-item-indicator",
    "dropdown-menu-content",
    "dropdown-menu-group",
    "dropdown-menu-item",
    "dropdown-menu-label",
    "dropdown-menu-portal",
    "dropdown-menu-radio-group",
    "dropdown-menu-radio-item",
    "dropdown-menu-radio-item-indicator",
    "dropdown-menu-separator",
    "dropdown-menu-shortcut",
    "dropdown-menu-sub",
    "dropdown-menu-sub-content",
    "dropdown-menu-sub-trigger",
    "dropdown-menu-trigger",
  ],
  field: [
    "field",
    "field-content",
    "field-description",
    "field-error",
    "field-group",
    "field-label",
    "field-legend",
    "field-separator",
    "field-separator-content",
    "field-set",
  ],
  input: ["input"],
  label: ["label"],
  select: [
    "select-content",
    "select-group",
    "select-item",
    "select-label",
    "select-scroll-down-button",
    "select-scroll-up-button",
    "select-separator",
    "select-trigger",
    "select-value",
  ],
  separator: ["separator"],
  skeleton: ["skeleton"],
  table: [
    "table",
    "table-body",
    "table-caption",
    "table-cell",
    "table-container",
    "table-footer",
    "table-head",
    "table-header",
    "table-row",
  ],
};

const slotsOf = (source: string): string[] =>
  [...new Set([...source.matchAll(SLOT)].map((m) => m[1] ?? ""))].sort();

const discover = (dir: string): Record<string, string[]> => {
  const out: Record<string, string[]> = {};
  for (const file of readdirSync(dir)) {
    if (file.endsWith(".tsx")) {
      out[file.slice(0, -4)] = slotsOf(readFileSync(join(dir, file), "utf8"));
    }
  }
  return out;
};

describe("R2 — anatomy is discovered from data-slot and reviewed", () => {
  const found = discover(COMPONENTS);

  it("covers every component: parts, or a declared absence with a reason", () => {
    const names = Object.keys(found);
    expect(names.length).toBeGreaterThanOrEqual(12);
    for (const name of names) {
      const parts = found[name] ?? [];
      if (parts.length === 0) {
        expect(
          NO_PARTS[name]?.length ?? 0,
          `${name} stamps no data-slot and declares no reason`
        ).toBeGreaterThan(20);
      } else {
        expect(
          NO_PARTS[name],
          `${name} has parts, so it is not an absence`
        ).toBeUndefined();
      }
    }
  });

  it("matches the reviewed anatomy exactly", () => {
    const withParts: Record<string, string[]> = {};
    for (const [name, parts] of Object.entries(found)) {
      if (parts.length > 0) {
        withParts[name] = parts;
      }
    }
    expect(withParts).toEqual(ANATOMY);
  });

  it("proves itself on a component that loses a part", () => {
    const dialog = readFileSync(join(COMPONENTS, "dialog.tsx"), "utf8");
    const planted = dialog.replace('data-slot="dialog-title"', "");
    expect(planted).not.toBe(dialog);
    expect(slotsOf(planted)).not.toEqual(ANATOMY.dialog);
  });
});
