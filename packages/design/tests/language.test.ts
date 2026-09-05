import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  COMPONENT_RULE_ID_PATTERN,
  DOMAIN_RULE_ID_PATTERN,
  LANGUAGE_DOMAINS,
  PRINCIPLE_LANGUAGE,
} from "../src/foundation/00-principles";
import { TOKEN_LANGUAGE } from "../src/foundation/01-tokens";
import { COLOR_LANGUAGE, COLOR_PUBLIC_API } from "../src/foundation/02-color";
import {
  TYPOGRAPHY_LANGUAGE,
  TYPOGRAPHY_SYSTEM_TOKENS,
} from "../src/foundation/03-typography";
import {
  GEOMETRY_LANGUAGE,
  GEOMETRY_SYSTEM_TOKENS,
} from "../src/foundation/04-geometry";
import { LAYOUT_LANGUAGE } from "../src/foundation/05-layout";
import {
  MOTION_LANGUAGE,
  MOTION_SYSTEM_TOKENS,
} from "../src/foundation/06-motion";
import { INTERACTION_LANGUAGE } from "../src/foundation/07-interaction";
import { ACCESSIBILITY_LANGUAGE } from "../src/foundation/08-accessibility";
import { CONTENT_LANGUAGE } from "../src/foundation/09-content";

/**
 * The language is data, and Level 2 is held equal to it (ADR-014, ADR-015,
 * docs/architecture.md §6.2). R11 — every Level-1 public semantic has a
 * Level-2 resolution: each colour role in the default block of color.css
 * (and a dark resolution unless declared theme-invariant), each typography
 * role across its five required properties, each geometry and motion
 * identity, and each role's Tailwind projection under its own name. R12 —
 * the ADL stylesheet graph is wired: every relative @import resolves, every
 * sheet is reachable from index.css, and every var(--af-*) is defined in
 * the graph or is a declared input carrying a fallback at every use. R14 —
 * the language holds its own integrity: every domain's identity block
 * agrees with the registry in 00-principles, and every rule ID across the
 * foundation matches the AF grammar and is defined exactly once — the scan
 * that will hold 10-components/* to the same grammar when it lands.
 *
 * Minted 2026-09-05, after index.css imported tokens.css while the file on
 * disk was token.css and nothing failed. Every checker takes its inputs as
 * data, so the same code proves itself on the planted defects below; a
 * green over the real tree means the check ran.
 */

// Vitest runs with the package as cwd; import.meta.url is rewritten by Vite.
const STYLES = join(process.cwd(), "src/styles");

const IMPORT_PATH = /@import\s+"\.\/([a-z0-9-]+\.css)"/g;
const AF_DEF = /(--af-[a-z0-9-]+):/g;
const AF_USE = /var\(\s*(--af-[a-z0-9-]+)\s*(,)?/g;
const COLOR_DEF = /--af-sys-color-([a-z0-9-]+):/g;
const LIGHT_BLOCK = /^:root \{([\s\S]*?)\n\}/m;
const DARK_BLOCK = /^:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/m;
const THEME_BLOCKS = /@theme inline \{([\s\S]*?)\n\}/g;
const PROJECTION =
  /--(color|spacing|radius|shadow)-([a-z0-9-]+):\s*var\(\s*--af-sys-([a-z0-9-]+)\s*\)/g;
const TYPE_UTILITY = /@utility type-([a-z0-9-]+) \{/g;
const Z_UTILITY = /@utility z-([a-z0-9-]+) \{/g;

type Graph = ReadonlyMap<string, string>;

const graph: Graph = new Map(
  readdirSync(STYLES)
    .filter((f) => f.endsWith(".css"))
    .map((f) => [f, readFileSync(join(STYLES, f), "utf8")])
);

const sheet = (g: Graph, file: string): string => {
  const text = g.get(file);
  if (text === undefined) {
    throw new Error(`${file} is not in the ADL graph`);
  }
  return text;
};

/** A graph with one sheet's text replaced — how a defect is planted. */
const withSheet = (g: Graph, file: string, text: string): Graph =>
  new Map([...g, [file, text]]);

const joined = (g: Graph): string => [...g.values()].join("\n");

/** Leaf strings of a Level-1 declaration object, however nested. */
const leaves = (value: unknown): string[] => {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap(leaves);
  }
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(leaves);
  }
  return [];
};

/** af.sys.shape.overlay -> --af-sys-shape-overlay */
const toVar = (dottedId: string): string =>
  `--${dottedId.split(".").join("-")}`;

// ---------------------------------------------------------------- R11 ----

const COLOR_ROLES = leaves(COLOR_PUBLIC_API);

/** Roles resolved once, in the default block: the declared theme-invariants. */
const THEME_INVARIANT = new Set<string>([...COLOR_PUBLIC_API.fixed, "scrim"]);

const rolesIn = (blockText: string): Set<string> =>
  new Set([...blockText.matchAll(COLOR_DEF)].map((m) => m[1] ?? ""));

const colorFindings = (g: Graph): string[] => {
  const css = sheet(g, "color.css");
  const light = rolesIn(LIGHT_BLOCK.exec(css)?.[1] ?? "");
  const dark = rolesIn(DARK_BLOCK.exec(css)?.[1] ?? "");
  const out: string[] = [];
  for (const role of COLOR_ROLES) {
    if (!light.has(role)) {
      out.push(`admitted role ${role} has no light resolution`);
    }
    if (!(dark.has(role) || THEME_INVARIANT.has(role) || !light.has(role))) {
      out.push(
        `role ${role} has no dark resolution and is not declared theme-invariant`
      );
    }
  }
  for (const role of light) {
    if (!COLOR_ROLES.includes(role)) {
      out.push(`color.css resolves ${role}, which Level 1 does not admit`);
    }
  }
  for (const role of dark) {
    if (!light.has(role)) {
      out.push(`dark resolves ${role}, which the default block never declares`);
    }
  }
  return out;
};

const TYPE_ROLES = Object.keys(TYPOGRAPHY_SYSTEM_TOKENS);

/** The five required properties of every type role (03-typography L1). */
const TYPE_PROPERTIES = [
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
] as const;

const typographyFindings = (g: Graph): string[] => {
  const css = sheet(g, "typography.css");
  const out: string[] = [];
  for (const role of TYPE_ROLES) {
    for (const property of TYPE_PROPERTIES) {
      if (!css.includes(`--af-sys-type-${role}-${property}:`)) {
        out.push(`type role ${role} is missing ${property}`);
      }
    }
  }
  return out;
};

const IDENTITY_IDS = [
  ...leaves(GEOMETRY_SYSTEM_TOKENS),
  ...leaves(MOTION_SYSTEM_TOKENS),
];

const identityFindings = (g: Graph): string[] => {
  const all = joined(g);
  return IDENTITY_IDS.filter((id) => !all.includes(`${toVar(id)}:`)).map(
    (id) => `${id} has no Level-2 resolution (${toVar(id)})`
  );
};

/** Tailwind namespace -> the system namespace it must project, name for name. */
const NAMESPACE: Readonly<Record<string, string>> = {
  color: "color",
  radius: "shape",
  shadow: "elevation",
  spacing: "space",
};

const projectionFindings = (g: Graph): string[] => {
  const css = sheet(g, "tailwind.css");
  const theme = [...css.matchAll(THEME_BLOCKS)]
    .map((m) => m[1] ?? "")
    .join("\n");
  const defined = new Set([...joined(g).matchAll(AF_DEF)].map((m) => m[1]));
  const out: string[] = [];
  const projected = new Set<string>();
  for (const [, ns = "", name = "", target = ""] of theme.matchAll(
    PROJECTION
  )) {
    projected.add(`${ns}-${name}`);
    const expected = `${NAMESPACE[ns]}-${name}`;
    if (target !== expected) {
      out.push(
        `--${ns}-${name} projects --af-sys-${target}; its name promises --af-sys-${expected}`
      );
    }
    if (!defined.has(`--af-sys-${target}`)) {
      out.push(
        `--${ns}-${name} projects --af-sys-${target}, which no sheet defines`
      );
    }
  }
  for (const role of COLOR_ROLES) {
    if (!projected.has(`color-${role}`)) {
      out.push(
        `admitted colour role ${role} has no --color-${role} projection`
      );
    }
  }
  const typeUtilities = new Set(
    [...css.matchAll(TYPE_UTILITY)].map((m) => m[1])
  );
  for (const role of TYPE_ROLES) {
    if (!typeUtilities.has(role)) {
      out.push(`type role ${role} has no @utility type-${role} projection`);
    }
  }
  const zUtilities = new Set([...css.matchAll(Z_UTILITY)].map((m) => m[1]));
  for (const layer of Object.keys(GEOMETRY_SYSTEM_TOKENS.layer)) {
    if (!zUtilities.has(layer)) {
      out.push(`layer ${layer} has no @utility z-${layer} projection`);
    }
  }
  return out;
};

describe("R11 — every Level-1 public semantic has a Level-2 resolution", () => {
  it("covers a real population", () => {
    expect(COLOR_ROLES.length).toBeGreaterThanOrEqual(80);
    expect(TYPE_ROLES.length).toBeGreaterThanOrEqual(18);
    expect(IDENTITY_IDS.length).toBeGreaterThanOrEqual(45);
  });

  it("resolves every colour role, and only admitted roles", () => {
    expect(colorFindings(graph)).toEqual([]);
  });

  it("resolves every type role across its five required properties", () => {
    expect(typographyFindings(graph)).toEqual([]);
  });

  it("resolves every geometry and motion identity", () => {
    expect(identityFindings(graph)).toEqual([]);
  });

  it("projects every role into Tailwind under its own name", () => {
    expect(projectionFindings(graph)).toEqual([]);
  });

  it("proves itself on a role whose light resolution is dropped", () => {
    const css = sheet(graph, "color.css");
    const planted = css.replace(
      "  --af-sys-color-outline: var(--af-ref-color-slate-55);\n",
      ""
    );
    expect(planted).not.toBe(css);
    expect(colorFindings(withSheet(graph, "color.css", planted))).toEqual([
      "admitted role outline has no light resolution",
      "dark resolves outline, which the default block never declares",
    ]);
  });

  it("proves itself on a role Level 1 never admitted", () => {
    const css = sheet(graph, "color.css");
    const planted = css.replace(
      "--af-sys-color-scrim:",
      "--af-sys-color-veil:"
    );
    expect(planted).not.toBe(css);
    expect(colorFindings(withSheet(graph, "color.css", planted))).toEqual([
      "admitted role scrim has no light resolution",
      "color.css resolves veil, which Level 1 does not admit",
    ]);
  });

  it("proves itself on a type role missing one property", () => {
    const css = sheet(graph, "typography.css");
    const planted = css.replace(
      "--af-sys-type-caption-letter-spacing:",
      "--af-sys-type-caption-letter-spacinng:"
    );
    expect(planted).not.toBe(css);
    expect(
      typographyFindings(withSheet(graph, "typography.css", planted))
    ).toEqual(["type role caption is missing letter-spacing"]);
  });

  it("proves itself on a geometry identity with no resolution", () => {
    const css = sheet(graph, "geometry.css");
    const planted = css.replace(
      "--af-sys-shape-overlay:",
      "--af-sys-shape-hoverlay:"
    );
    expect(planted).not.toBe(css);
    expect(identityFindings(withSheet(graph, "geometry.css", planted))).toEqual(
      [
        "af.sys.shape.overlay has no Level-2 resolution (--af-sys-shape-overlay)",
      ]
    );
  });

  it("proves itself on a projection that lies about its name", () => {
    const css = sheet(graph, "tailwind.css");
    const planted = css.replace(
      "--color-outline: var(--af-sys-color-outline);",
      "--color-outline: var(--af-sys-color-outline-variant);"
    );
    expect(planted).not.toBe(css);
    expect(
      projectionFindings(withSheet(graph, "tailwind.css", planted))
    ).toEqual([
      "--color-outline projects --af-sys-color-outline-variant; its name promises --af-sys-color-outline",
    ]);
  });
});

// ---------------------------------------------------------------- R12 ----

/**
 * Inputs a consumer sets per instance. They are defined by no sheet, so every
 * use must carry a fallback that resolves the governed default.
 */
const DECLARED_INPUTS: Readonly<Record<string, string>> = {
  "--af-layout-gap":
    "per-instance gap for stack/cluster/grid/split; the fallback resolves the primitive's governed spacing role",
  "--af-layout-split-first":
    "first track of a split; the fallback is an even 1fr",
  "--af-layout-split-second":
    "second track of a split; the fallback is an even 1fr",
};

const TENANT_PREFIX = "--af-tenant-";

const importFindings = (g: Graph): string[] => {
  const out: string[] = [];
  const reachable = new Set<string>(["index.css"]);
  const queue = ["index.css"];
  // A for-of array iterator re-checks length each step, so it walks the
  // files the loop itself appends — breadth-first without an index.
  for (const file of queue) {
    for (const [, target = ""] of sheet(g, file).matchAll(IMPORT_PATH)) {
      if (g.has(target)) {
        if (!reachable.has(target)) {
          reachable.add(target);
          queue.push(target);
        }
      } else {
        out.push(`${file} imports ./${target}, which does not exist`);
      }
    }
  }
  for (const file of g.keys()) {
    if (!reachable.has(file)) {
      out.push(`${file} is not reachable from index.css`);
    }
  }
  return out;
};

const varFindings = (g: Graph): string[] => {
  const defined = new Set([...joined(g).matchAll(AF_DEF)].map((m) => m[1]));
  const out: string[] = [];
  for (const [file, text] of g) {
    for (const [, name = "", fallback] of text.matchAll(AF_USE)) {
      if (defined.has(name)) {
        continue;
      }
      const declared =
        name.startsWith(TENANT_PREFIX) || name in DECLARED_INPUTS;
      if (!declared) {
        out.push(`${file} uses ${name}, which nothing defines or declares`);
      } else if (fallback === undefined) {
        out.push(`${file} uses input ${name} without a fallback`);
      }
    }
  }
  return out;
};

describe("R12 — the ADL stylesheet graph is wired", () => {
  it("holds a real graph", () => {
    expect(graph.size).toBeGreaterThanOrEqual(12);
  });

  it("resolves every relative import and reaches every sheet", () => {
    expect(importFindings(graph)).toEqual([]);
  });

  it("defines every var it draws, or declares the input with a fallback", () => {
    expect(varFindings(graph)).toEqual([]);
  });

  it("keeps each declared input deliberate, with a reason", () => {
    for (const [name, reason] of Object.entries(DECLARED_INPUTS)) {
      expect(reason.length, `${name} needs a real reason`).toBeGreaterThan(20);
    }
  });

  it("proves itself on the import that minted this rule", () => {
    const css = sheet(graph, "index.css");
    const planted = css.replace(
      '@import "./tokens.css"',
      '@import "./token.css"'
    );
    expect(planted).not.toBe(css);
    expect(importFindings(withSheet(graph, "index.css", planted))).toEqual([
      "index.css imports ./token.css, which does not exist",
      "tokens.css is not reachable from index.css",
    ]);
  });

  it("proves itself on a var nothing defines", () => {
    const css = sheet(graph, "interaction.css");
    const planted = css.replace(
      "var(--af-sys-color-on-surface)",
      "var(--af-sys-color-on-surfaces)"
    );
    expect(planted).not.toBe(css);
    expect(varFindings(withSheet(graph, "interaction.css", planted))).toEqual([
      "interaction.css uses --af-sys-color-on-surfaces, which nothing defines or declares",
    ]);
  });

  it("proves itself on an input drawn without its fallback", () => {
    const css = sheet(graph, "layout.css");
    const planted = css.replace(
      "gap: var(--af-layout-gap, var(--af-sys-space-item));",
      "gap: var(--af-layout-gap);"
    );
    expect(planted).not.toBe(css);
    expect(varFindings(withSheet(graph, "layout.css", planted))).toEqual([
      "layout.css uses input --af-layout-gap without a fallback",
    ]);
  });
});

// ---------------------------------------------------------------- R14 ----

const FOUNDATION = join(process.cwd(), "src/foundation");

const RULE_ID_DEF = /\bid: "(AF-[A-Z0-9-]+)"/g;

interface DomainIdentity {
  readonly code: string;
  readonly id: string;
  readonly level: number;
  readonly order: number;
  readonly version: string;
}

const IDENTITIES: readonly DomainIdentity[] = [
  PRINCIPLE_LANGUAGE,
  TOKEN_LANGUAGE,
  COLOR_LANGUAGE,
  TYPOGRAPHY_LANGUAGE,
  GEOMETRY_LANGUAGE,
  LAYOUT_LANGUAGE,
  MOTION_LANGUAGE,
  INTERACTION_LANGUAGE,
  ACCESSIBILITY_LANGUAGE,
  CONTENT_LANGUAGE,
];

type RegistryRow = (typeof LANGUAGE_DOMAINS)[number];

const parityFindings = (
  rows: readonly RegistryRow[],
  identities: readonly DomainIdentity[]
): string[] => {
  const out: string[] = [];
  for (const identity of identities) {
    const row = rows.find((r) => r.id === identity.id);
    if (!row) {
      out.push(`${identity.id} declares an identity the registry never admits`);
      continue;
    }
    if (row.code !== identity.code) {
      out.push(
        `${identity.id}: registry code ${row.code} vs file ${identity.code}`
      );
    }
    if (row.order !== identity.order) {
      out.push(
        `${identity.id}: registry order ${row.order} vs file ${identity.order}`
      );
    }
    if (identity.level !== 1) {
      out.push(`${identity.id} claims level ${identity.level}`);
    }
    const prefix = String(identity.order).padStart(2, "0");
    if (!row.file.startsWith(prefix)) {
      out.push(
        `${identity.id}: file ${row.file} does not carry order ${prefix}`
      );
    }
  }
  for (const row of rows) {
    if (row.file.endsWith(".ts") && !identities.some((i) => i.id === row.id)) {
      out.push(`registry row ${row.id} has no identity block under test`);
    }
  }
  return out;
};

/** Every foundation source, 10-components included, for the rule-ID scan. */
const foundationTexts: ReadonlyMap<string, string> = new Map(
  readdirSync(FOUNDATION, { withFileTypes: true }).flatMap(
    (entry): [string, string][] => {
      if (entry.isDirectory()) {
        return readdirSync(join(FOUNDATION, entry.name))
          .filter((f) => f.endsWith(".ts"))
          .map((f) => [
            `${entry.name}/${f}`,
            readFileSync(join(FOUNDATION, entry.name, f), "utf8"),
          ]);
      }
      return entry.name.endsWith(".ts")
        ? [[entry.name, readFileSync(join(FOUNDATION, entry.name), "utf8")]]
        : [];
    }
  )
);

const ruleIdFindings = (texts: ReadonlyMap<string, string>): string[] => {
  const out: string[] = [];
  const seen = new Map<string, string>();
  for (const [file, text] of texts) {
    for (const m of text.matchAll(RULE_ID_DEF)) {
      const id = m[1] ?? "";
      if (
        !(DOMAIN_RULE_ID_PATTERN.test(id) || COMPONENT_RULE_ID_PATTERN.test(id))
      ) {
        out.push(`${file}: ${id} is outside the rule-ID grammar`);
      }
      const earlier = seen.get(id);
      if (earlier) {
        out.push(`${id} is defined in both ${earlier} and ${file}`);
      } else {
        seen.set(id, file);
      }
    }
  }
  return out;
};

describe("R14 — the language holds its own integrity", () => {
  it("covers every authored domain and a real body of rules", () => {
    expect(IDENTITIES).toHaveLength(10);
    let defined = 0;
    for (const text of foundationTexts.values()) {
      defined += [...text.matchAll(RULE_ID_DEF)].length;
    }
    expect(defined).toBeGreaterThanOrEqual(1000);
  });

  it("keeps every identity block equal to its registry row", () => {
    expect(parityFindings(LANGUAGE_DOMAINS, IDENTITIES)).toEqual([]);
  });

  it("keeps every rule ID inside the grammar, defined exactly once", () => {
    expect(ruleIdFindings(foundationTexts)).toEqual([]);
  });

  it("proves itself on an identity that drifts from the registry", () => {
    const drifted = IDENTITIES.map((i) =>
      i.id === "layout" ? { ...i, order: 4 } : i
    );
    expect(parityFindings(LANGUAGE_DOMAINS, drifted)).toEqual([
      "layout: registry order 5 vs file 4",
      "layout: file 05-layout.ts does not carry order 04",
    ]);
  });

  it("proves itself on the duplicate the geometry copy once planted", () => {
    const layout = foundationTexts.get("05-layout.ts") ?? "";
    const planted = layout.replace('id: "AF-LAY-001"', 'id: "AF-GEO-001"');
    expect(planted).not.toBe(layout);
    expect(
      ruleIdFindings(new Map([...foundationTexts, ["05-layout.ts", planted]]))
    ).toEqual([
      "AF-GEO-001 is defined in both 04-geometry.ts and 05-layout.ts",
    ]);
  });

  it("proves itself on an ID outside the grammar", () => {
    const color = foundationTexts.get("02-color.ts") ?? "";
    const planted = color.replace('id: "AF-COL-001"', 'id: "AF-COLOUR-001"');
    expect(planted).not.toBe(color);
    expect(
      ruleIdFindings(new Map([...foundationTexts, ["02-color.ts", planted]]))
    ).toEqual(["02-color.ts: AF-COLOUR-001 is outside the rule-ID grammar"]);
  });
});
