import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NO_PARTS, PART_CLASSES, PARTS, type PartClass } from "../src/anatomy";

/**
 * R2 — a part is a `data-slot`, the set of parts per component is a reviewed
 * fact, and every part has a class from the closed list in `src/anatomy.ts`
 * (docs/architecture.md §6.3). The anatomy is discovered from source; this
 * file pins it, so a regenerated component that gains or loses a part is a
 * one-line reviewed diff here, and a new part arrives with its class or not
 * at all. The class also fixes the boundary a part may draw: a divider is
 * decorative (--border) and never borrows a target's boundary (--input,
 * --primary, --ring); the field boundary sits only on a container or an
 * indicator. Both checks take source text, so the same code proves itself on
 * planted defects below.
 */

const COMPONENTS = join(process.cwd(), "src/components");
const SLOT = /data-slot="([a-z-]+)"/g;
const STRING_LITERAL = /"([^"]*)"/g;
const WHITESPACE = /\s+/;
/** The opening of a `cn("…")` call — where a planted token goes. */
const CN_OPEN = /cn\(\s*"/;
/** A class token that draws a target's boundary, with any variant prefix. */
const TARGET_BOUNDARY =
  /^(?:[a-z-]+:)*(?:bg|border)-(?:input|primary|ring)(?:\/\d+)?$/;
/** The field boundary specifically, which only a container or indicator owns. */
const FIELD_BOUNDARY = /^(?:[a-z-]+:)*(?:bg|border)-input(?:\/\d+)?$/;
const OWNS_FIELD_BOUNDARY: ReadonlySet<PartClass> = new Set([
  "container",
  "indicator",
]);

/** The reviewed anatomy. Change a component, and this diff is the review. */
const ANATOMY: Readonly<Record<string, readonly string[]>> = {
  "alert-dialog": [
    "alert-dialog",
    "alert-dialog-action",
    "alert-dialog-cancel",
    "alert-dialog-content",
    "alert-dialog-description",
    "alert-dialog-footer",
    "alert-dialog-header",
    "alert-dialog-media",
    "alert-dialog-overlay",
    "alert-dialog-portal",
    "alert-dialog-title",
    "alert-dialog-trigger",
  ],
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

/**
 * The JSX opening tags that stamp `slot`: each from its `<` to its closing
 * `>`, with braces and string literals respected so an arrow function or a
 * quoted `>` inside an attribute does not end the tag early.
 */
const tagsStamping = (source: string, slot: string): string[] => {
  const out: string[] = [];
  const needle = `data-slot="${slot}"`;
  let at = source.indexOf(needle);
  while (at >= 0) {
    const start = source.lastIndexOf("<", at);
    let depth = 0;
    let quote: string | undefined;
    let end = start + 1;
    for (; end < source.length; end += 1) {
      const ch = source[end];
      if (quote) {
        if (ch === quote) {
          quote = undefined;
        }
      } else if (ch === '"' || ch === "'" || ch === "`") {
        quote = ch;
      } else if (ch === "{") {
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
      } else if (ch === ">" && depth === 0) {
        break;
      }
    }
    out.push(source.slice(start, end + 1));
    at = source.indexOf(needle, at + needle.length);
  }
  return out;
};

/** Every whitespace-separated token inside the tag's string literals. */
const tokensOf = (tag: string): string[] =>
  [...tag.matchAll(STRING_LITERAL)]
    .flatMap((m) => (m[1] ?? "").split(WHITESPACE))
    .filter(Boolean);

interface Source {
  name: string;
  text: string;
}

/** Boundary findings over component sources, phrased as the rule they break. */
const boundaryFindings = (sources: readonly Source[]): string[] => {
  const out: string[] = [];
  for (const { name, text } of sources) {
    for (const slot of slotsOf(text)) {
      const cls = PARTS[slot];
      if (!cls) {
        continue;
      }
      const tokens = tagsStamping(text, slot).flatMap(tokensOf);
      if (cls === "divider") {
        for (const token of tokens.filter((t) => TARGET_BOUNDARY.test(t))) {
          out.push(
            `${name}: ${slot} is a divider and draws a target boundary (${token}); dividers use --border only`
          );
        }
      }
      if (!OWNS_FIELD_BOUNDARY.has(cls)) {
        for (const token of tokens.filter((t) => FIELD_BOUNDARY.test(t))) {
          out.push(
            `${name}: ${slot} is ${cls} and carries the field boundary (${token}); only a container or indicator owns --input`
          );
        }
      }
    }
  }
  return out;
};

const readSources = (dir: string): Source[] =>
  readdirSync(dir)
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => ({
      name: file,
      text: readFileSync(join(dir, file), "utf8"),
    }));

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

describe("R2 — every part has a class, and the class fixes its boundary", () => {
  const found = discover(COMPONENTS);
  const discovered = Object.values(found).flat().sort();
  const sources = readSources(COMPONENTS);

  it("classifies every discovered slot, and nothing that does not exist", () => {
    expect(discovered.length).toBeGreaterThanOrEqual(70);
    expect(Object.keys(PARTS).sort()).toEqual(discovered);
  });

  it("uses only the closed class list", () => {
    for (const [slot, cls] of Object.entries(PARTS)) {
      expect(PART_CLASSES, `${slot} has an unknown class`).toContain(cls);
    }
  });

  it("keeps dividers decorative and the field boundary on containers", () => {
    expect(sources.length).toBeGreaterThanOrEqual(12);
    expect(boundaryFindings(sources)).toEqual([]);
  });

  it("proves itself on a separator that borrows the field boundary", () => {
    const separator = sources.find((s) => s.name === "separator.tsx");
    if (!separator) {
      throw new Error("separator.tsx is missing");
    }
    const planted = separator.text.replace("bg-border", "bg-input");
    expect(planted).not.toBe(separator.text);
    expect(boundaryFindings([{ name: separator.name, text: planted }])).toEqual(
      [
        "separator.tsx: separator is a divider and draws a target boundary (bg-input); dividers use --border only",
        "separator.tsx: separator is divider and carries the field boundary (bg-input); only a container or indicator owns --input",
      ]
    );
  });

  it("proves itself on a label that carries the field boundary", () => {
    const label = sources.find((s) => s.name === "label.tsx");
    if (!label) {
      throw new Error("label.tsx is missing");
    }
    const planted = label.text.replace(
      CN_OPEN,
      (open) => `${open}border-input `
    );
    expect(planted).not.toBe(label.text);
    expect(boundaryFindings([{ name: label.name, text: planted }])).toEqual([
      "label.tsx: label is label and carries the field boundary (border-input); only a container or indicator owns --input",
    ]);
  });
});
