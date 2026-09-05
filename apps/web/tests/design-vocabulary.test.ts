import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R3 — a screen writes design vocabulary, never raw visual values.
 * R4 — every projected design token has a statically discoverable consumer,
 * or a declared exemption with a reason; an exemption outliving its reason
 * is itself a finding. R5 — the app's compatibility bridge holds no
 * self-referencing or cyclic alias. R10 — a prefers-reduced-motion block
 * collapses every animation and transition. (docs/architecture.md §6.2.
 * The bridge under test is app/globals.css: the transitional shadcn layer
 * over the canonical @xforge/design/styles/index.css, which R11–R14 hold.)
 *
 * Every checker takes text so the fixtures below prove them on planted
 * violations; a green over the tree means the scan ran over a real
 * population, not that it exists.
 */

const ROOT = process.cwd();
const SCREEN_DIRS = ["app", "components", "features"].map((d) => join(ROOT, d));
const DESIGN_SRC = join(ROOT, "../../packages/design/src");
const GLOBALS = join(ROOT, "app/globals.css");
const BRIDGE_OPEN = "@theme inline {";

const walk = (dir: string): string[] => {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      out.push(...walk(path));
    } else if (path.endsWith(".tsx") || path.endsWith(".ts")) {
      out.push(path);
    }
  }
  return out;
};

// ---------------------------------------------------------------- R3 ----

const PALETTE_HUES =
  "red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone";
const COLOR_UTILITIES =
  "bg|text|border|ring|inset-ring|outline|fill|stroke|divide|placeholder|accent|caret|decoration|shadow|from|to|via";

/** Always refused at a call site: values instead of vocabulary. */
const REFUSED: readonly { code: string; pattern: RegExp; why: string }[] = [
  {
    code: "palette",
    pattern: new RegExp(
      `\\b(?:${COLOR_UTILITIES})-(?:${PALETTE_HUES})-\\d{2,3}\\b`
    ),
    why: "Tailwind palette colour; use a role (bg-primary, text-muted-foreground)",
  },
  {
    code: "literal-colour",
    pattern: new RegExp(
      `\\b(?:${COLOR_UTILITIES})-\\[(?:#|rgb|hsl|oklch|oklab|lab|lch|color\\()`
    ),
    why: "colour literal in a class; declare a token in globals.css",
  },
  {
    code: "arbitrary-value",
    // `w-[319px]`, `z-[9999]`, `duration-[137ms]`; not an arbitrary variant
    // such as `data-[state=open]:` or `[&_svg]:`, which name a selector.
    pattern: /\b[a-z]+(?:-[a-z]+)*-\[[^\]\s]+\](?!:)/,
    why: "arbitrary value; use the scale, or add a token",
  },
  {
    code: "raw-scale",
    pattern: /\b(?:z|duration|delay|opacity)-\d+\b/,
    why: "raw stacking, timing or opacity step; mint a named utility (z-overlay, duration-fast, opacity-disabled) when first needed",
  },
];

interface Finding {
  code: string;
  match: string;
  where: string;
}

const scanVocabulary = (source: string, where: string): Finding[] => {
  const out: Finding[] = [];
  const lines = source.split("\n");
  for (const [index, line] of lines.entries()) {
    for (const rule of REFUSED) {
      const m = rule.pattern.exec(line);
      if (m) {
        out.push({
          code: rule.code,
          match: m[0],
          where: `${where}:${index + 1}`,
        });
      }
    }
  }
  return out;
};

describe("R3 — a screen writes vocabulary, not values", () => {
  const files = SCREEN_DIRS.flatMap(walk);

  it("scans a real population of screen files", () => {
    expect(files.length).toBeGreaterThanOrEqual(15);
  });

  it("finds no raw visual value in app, components or features", () => {
    const findings = files.flatMap((file) =>
      scanVocabulary(readFileSync(file, "utf8"), relative(ROOT, file))
    );
    expect(findings.map((f) => `${f.where} ${f.code}: ${f.match}`)).toEqual([]);
  });

  it("proves itself on each refused form", () => {
    const planted = [
      'className="bg-red-500 text-slate-700"',
      'className="bg-[#ef4444]"',
      'className="w-[319px] z-[9999] duration-[137ms]"',
      'className="z-50 duration-100 opacity-50"',
    ].join("\n");
    const codes = scanVocabulary(planted, "fixture").map((f) => f.code);
    // A bracketed colour is both a literal colour and an arbitrary value.
    expect(codes).toEqual([
      "palette",
      "literal-colour",
      "arbitrary-value",
      "arbitrary-value",
      "raw-scale",
    ]);
  });

  it("leaves vocabulary and selector variants alone", () => {
    const allowed =
      'className="bg-primary text-primary-foreground hover:bg-muted/50 data-[state=open]:bg-accent [&_svg]:size-4 z-overlay duration-fast opacity-disabled rounded-md"';
    expect(scanVocabulary(allowed, "fixture")).toEqual([]);
  });
});

// ---------------------------------------------------------------- R4 ----

const THEME_TOKEN = /--(color|font|radius)-([a-z0-9-]+):/g;

type Exemptions = Readonly<Record<string, string>>;

/**
 * Tokens without a static consumer today, each with its reason. The radius
 * ladder is one scale derived from `--radius`; an unused rung is kept so a
 * component the CLI adds lands on the ladder, not on Tailwind's default.
 */
const RADIUS_LADDER =
  "a rung of shadcn's radius ladder, derived from --radius; kept so a CLI-added component stays on the scale";
const EXEMPT: Exemptions = {
  "radius-2xl": RADIUS_LADDER,
  "radius-3xl": RADIUS_LADDER,
  "radius-sm": RADIUS_LADDER,
};

interface Projected {
  name: string;
  namespace: string;
}

const bridge = (css: string): Projected[] => {
  const start = css.indexOf(BRIDGE_OPEN);
  const body = css.slice(start, css.indexOf("}", start));
  const out: Projected[] = [];
  for (const m of body.matchAll(THEME_TOKEN)) {
    out.push({ name: m[2] ?? "", namespace: m[1] ?? "" });
  }
  return out;
};

const consumerOf = (namespace: string, name: string): RegExp => {
  const tail = `${name.replaceAll("-", "\\-")}(?![a-z0-9-])`;
  if (namespace === "font") {
    return new RegExp(`\\bfont-${tail}`);
  }
  if (namespace === "radius") {
    return new RegExp(`\\brounded(?:-[a-z]+)*-${tail}`);
  }
  return new RegExp(`\\b(?:${COLOR_UTILITIES})-${tail}|var\\(--${tail}\\)`);
};

/** The surfaces the check can see: the sources, plus the CSS outside the bridge. */
const haystackOf = (css: string, sources: string[]): string => {
  const start = css.indexOf(BRIDGE_OPEN);
  const end = css.indexOf("}", start) + 1;
  return [...sources, css.slice(0, start), css.slice(end)].join("\n");
};

const unconsumed = (
  css: string,
  sources: string[],
  exempt: Exemptions
): string[] => {
  const haystack = haystackOf(css, sources);
  const out: string[] = [];
  for (const { name, namespace } of bridge(css)) {
    const key = `${namespace}-${name}`;
    if (!(consumerOf(namespace, name).test(haystack) || key in exempt)) {
      out.push(`--${key}`);
    }
  }
  return out;
};

/** Exemptions for tokens that have found a consumer since: stale, so a finding. */
const staleExemptions = (
  css: string,
  sources: string[],
  exempt: Exemptions
): string[] => {
  const haystack = haystackOf(css, sources);
  const out: string[] = [];
  for (const { name, namespace } of bridge(css)) {
    const key = `${namespace}-${name}`;
    if (key in exempt && consumerOf(namespace, name).test(haystack)) {
      out.push(`--${key}`);
    }
  }
  return out;
};

describe("R4 — every projected token has a statically discoverable consumer", () => {
  const css = readFileSync(GLOBALS, "utf8");
  const surfaces = [...SCREEN_DIRS.flatMap(walk), ...walk(DESIGN_SRC)]
    .filter((f) => !(f.endsWith(".test.ts") || f.endsWith(".test.tsx")))
    .map((f) => readFileSync(f, "utf8"));

  it("reads a real bridge and a real set of surfaces", () => {
    expect(bridge(css).length).toBeGreaterThanOrEqual(20);
    expect(surfaces.length).toBeGreaterThanOrEqual(25);
  });

  it("finds a consumer for every projected token, or a reason", () => {
    expect(unconsumed(css, surfaces, EXEMPT)).toEqual([]);
    for (const [token, reason] of Object.entries(EXEMPT)) {
      expect(reason.length, `${token} needs a real reason`).toBeGreaterThan(20);
    }
  });

  it("refuses an exemption that has outlived its reason", () => {
    expect(staleExemptions(css, surfaces, EXEMPT)).toEqual([]);
  });

  it("proves itself on a token nothing consumes", () => {
    const planted = css.replace(
      BRIDGE_OPEN,
      `${BRIDGE_OPEN}\n  --color-nobody: var(--nobody);`
    );
    expect(unconsumed(planted, surfaces, EXEMPT)).toEqual(["--color-nobody"]);
  });

  it("proves itself on a stale exemption", () => {
    const planted: Exemptions = {
      ...EXEMPT,
      "color-primary": "was unused once",
    };
    expect(staleExemptions(css, surfaces, planted)).toEqual([
      "--color-primary",
    ]);
  });
});

// ---------------------------------------------------------------- R5 ----

const BRIDGE_TOKEN = /--([a-z0-9-]+):\s*([^;]+);/g;
const SINGLE_VAR = /^var\(--([a-z0-9-]+)\)$/;

/** Alias chains inside the bridge; a self-reference is a cycle of one. */
const aliasCycles = (source: string): string[] => {
  const start = source.indexOf(BRIDGE_OPEN);
  const body = source.slice(start, source.indexOf("}", start));
  const refs = new Map<string, string>();
  for (const m of body.matchAll(BRIDGE_TOKEN)) {
    const [, name = "", value = ""] = m;
    const ref = SINGLE_VAR.exec(value.trim());
    if (ref) {
      refs.set(name, ref[1] ?? "");
    }
  }
  const cycles: string[] = [];
  for (const begin of refs.keys()) {
    let current: string | undefined = begin;
    for (let hops = 0; hops <= refs.size; hops += 1) {
      current = current === undefined ? undefined : refs.get(current);
      if (current === begin) {
        cycles.push(`--${begin} reaches itself`);
        break;
      }
    }
  }
  return cycles;
};

describe("R5 — the bridge holds no self-reference or cycle", () => {
  const css = readFileSync(GLOBALS, "utf8");

  it("resolves every alias to something outside itself", () => {
    expect(aliasCycles(css)).toEqual([]);
  });

  it("proves itself on a self-referencing font alias", () => {
    const planted = css.replace(
      "--font-heading: var(--font-sans);",
      "--font-heading: var(--font-heading);"
    );
    expect(planted).not.toBe(css);
    expect(aliasCycles(planted)).toEqual(["--font-heading reaches itself"]);
  });
});

// ---------------------------------------------------------------- R10 ----

/** The collapse every animation and transition must obey under the preference. */
const REDUCED_MOTION_DECLARATIONS = [
  "animation-duration: 0.01ms !important",
  "animation-iteration-count: 1 !important",
  "transition-duration: 0.01ms !important",
  "scroll-behavior: auto !important",
] as const;

const reducedMotionFindings = (source: string): string[] => {
  const open = source.indexOf("@media (prefers-reduced-motion: reduce)");
  if (open < 0) {
    return ["no prefers-reduced-motion block"];
  }
  const body = source.slice(open);
  return REDUCED_MOTION_DECLARATIONS.filter((d) => !body.includes(d)).map(
    (d) => `missing "${d}"`
  );
};

describe("R10 — motion is a preference", () => {
  const css = readFileSync(GLOBALS, "utf8");

  it("collapses every animation and transition under the preference", () => {
    expect(reducedMotionFindings(css)).toEqual([]);
  });

  it("proves itself on a collapse that spares transitions", () => {
    const planted = css.replace("transition-duration: 0.01ms !important;", "");
    expect(planted).not.toBe(css);
    expect(reducedMotionFindings(planted)).toEqual([
      'missing "transition-duration: 0.01ms !important"',
    ]);
  });
});
