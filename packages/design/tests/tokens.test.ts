import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R1 — every declared colour pair and required boundary is measured in every
 * theme. R5 — the @theme bridge holds no self-referencing or cyclic alias.
 * (docs/architecture.md §6.2.) Both checkers take CSS text, so the same code
 * proves itself on a planted defect below; a green over the real file means
 * the check ran, not that it exists.
 */

// Vitest runs with the package as cwd; import.meta.url is rewritten by Vite.
const css = readFileSync(join(process.cwd(), "src/styles/globals.css"), "utf8");

const TOKEN = /--([a-z0-9-]+):\s*([^;]+);/g;
const OKLCH =
  /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/;
const VAR = /^var\(--([a-z0-9-]+)\)$/;
const FONT_SANS_ALIAS = /--font-sans: var\(--[a-z-]+\);/;
const TEXT = 4.5;
const BOUNDARY = 3;
const MIN_PAIRS_PER_THEME = 12;

interface Color {
  a: number;
  c: number;
  h: number;
  l: number;
}

type Palette = Map<string, Color>;

const block = (source: string, selector: string): string => {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) {
    throw new Error(`no "${selector}" block in globals.css`);
  }
  return source.slice(start, source.indexOf("}", start));
};

const parseColor = (raw: string): Color | undefined => {
  const m = OKLCH.exec(raw.trim());
  if (!m) {
    return undefined;
  }
  const [, l = "0", c = "0", h = "0", alpha] = m;
  let a = 1;
  if (alpha !== undefined) {
    a = alpha.endsWith("%")
      ? Number.parseFloat(alpha) / 100
      : Number.parseFloat(alpha);
  }
  return { a, c: Number(c), h: Number(h), l: Number(l) };
};

/** Colours of one theme block; `var(--x)` aliases resolve inside the block. */
const palette = (source: string, selector: string): Palette => {
  const raw = new Map<string, string>();
  for (const m of block(source, selector).matchAll(TOKEN)) {
    const [, name = "", value = ""] = m;
    raw.set(name, value.trim());
  }
  const out: Palette = new Map();
  for (const [name, value] of raw) {
    let current = value;
    for (let hops = 0; hops < 8; hops += 1) {
      const ref = VAR.exec(current);
      if (!ref) {
        break;
      }
      current = raw.get(ref[1] ?? "") ?? "";
    }
    const color = parseColor(current);
    if (color) {
      out.set(name, color);
    }
  }
  return out;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

const linear = ({ l, c, h }: Color): [number, number, number] => {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l3 = (l + 0.396_337_777_4 * A + 0.215_803_757_3 * B) ** 3;
  const m3 = (l - 0.105_561_345_8 * A - 0.063_854_172_8 * B) ** 3;
  const s3 = (l - 0.089_484_177_5 * A - 1.291_485_548 * B) ** 3;
  return [
    clamp(4.076_741_662_1 * l3 - 3.307_711_591_3 * m3 + 0.230_969_929_2 * s3),
    clamp(-1.268_438_004_6 * l3 + 2.609_757_401_1 * m3 - 0.341_319_396_5 * s3),
    clamp(-0.004_196_086_3 * l3 - 0.703_418_614_7 * m3 + 1.707_614_701 * s3),
  ];
};

const gamma = (v: number) =>
  v <= 0.003_130_8 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
const degamma = (v: number) =>
  v <= 0.040_45 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;

/** Browser compositing: alpha blend in gamma sRGB, then back to linear. */
const over = (top: Color, under: number[]): number[] => {
  const t = linear(top).map(gamma);
  const u = under.map(gamma);
  return t.map((v, i) => degamma(top.a * v + (1 - top.a) * (u[i] ?? 0)));
};

const luminance = (rgb: number[]) =>
  0.2126 * (rgb[0] ?? 0) + 0.7152 * (rgb[1] ?? 0) + 0.0722 * (rgb[2] ?? 0);

const contrast = (ink: Color, fill: Color, backdrop: Color): number => {
  const ground = fill.a < 1 ? over(fill, linear(backdrop)) : linear(fill);
  const inkRgb = ink.a < 1 ? over(ink, ground) : linear(ink);
  const [hi = 0, lo = 0] = [luminance(inkRgb), luminance(ground)].sort(
    (x, y) => y - x
  );
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};

interface Pair {
  fill: string;
  fillAlpha?: number;
  floor: number;
  ink: string;
  inkAlpha?: number;
  why: string;
}

/**
 * The pairs the components draw. `*-foreground` on its fill is added for
 * every such token, so a new tone is measured the moment it is declared.
 */
const DECLARED: readonly Pair[] = [
  {
    fill: "background",
    floor: TEXT,
    ink: "muted-foreground",
    why: "secondary copy on the page",
  },
  {
    fill: "card",
    floor: TEXT,
    ink: "muted-foreground",
    why: "secondary copy in cards",
  },
  {
    fill: "background",
    floor: TEXT,
    ink: "destructive",
    why: "field error copy",
  },
  {
    fill: "destructive",
    fillAlpha: 0.1,
    floor: TEXT,
    ink: "destructive",
    why: "soft destructive button and badge (bg-destructive/10)",
  },
  {
    fill: "background",
    floor: BOUNDARY,
    ink: "input",
    why: "field boundary, WCAG 1.4.11",
  },
  {
    fill: "card",
    floor: BOUNDARY,
    ink: "input",
    why: "field boundary inside a card",
  },
  {
    fill: "background",
    floor: BOUNDARY,
    ink: "ring",
    inkAlpha: 0.5,
    why: "focus ring as drawn (ring-3 ring-ring/50)",
  },
  {
    fill: "card",
    floor: BOUNDARY,
    ink: "ring",
    inkAlpha: 0.5,
    why: "focus ring on a card",
  },
  {
    fill: "popover",
    floor: BOUNDARY,
    ink: "ring",
    inkAlpha: 0.5,
    why: "focus ring in a menu or select popup",
  },
];

interface Exemptions {
  border: string;
}

/** Tokens deliberately outside the measurement, each with its reason. */
const EXEMPT: Exemptions = {
  border:
    "outline-variant: dividers and card edges are decorative; every container here carries text at 4.5:1 (M3 color-roles.md:167)",
};

interface Measurement {
  floor: number;
  label: string;
  ratio: number;
  theme: string;
}

const measure = (source: string): Measurement[] => {
  const out: Measurement[] = [];
  for (const [theme, selector] of [
    ["light", ":root"],
    ["dark", ".dark"],
  ] as const) {
    const t = palette(source, selector);
    const backdrop = t.get("background");
    if (!backdrop) {
      throw new Error(`${theme}: no --background`);
    }
    const pairs: Pair[] = [...DECLARED];
    for (const name of t.keys()) {
      if (name.endsWith("-foreground")) {
        pairs.push({
          fill: name.slice(0, -11),
          floor: TEXT,
          ink: name,
          why: "role pair",
        });
      }
    }
    for (const pair of pairs) {
      const ink = t.get(pair.ink);
      const fill = t.get(pair.fill);
      if (!(ink && fill)) {
        throw new Error(
          `${theme}: pair ${pair.ink} on ${pair.fill} names a token that does not exist`
        );
      }
      const ratio = contrast(
        { ...ink, a: pair.inkAlpha ?? ink.a },
        { ...fill, a: pair.fillAlpha ?? fill.a },
        backdrop
      );
      out.push({
        floor: pair.floor,
        label: `${pair.ink} on ${pair.fill} — ${pair.why}`,
        ratio,
        theme,
      });
    }
  }
  return out;
};

const failures = (rows: Measurement[]) =>
  rows
    .filter((r) => r.ratio < r.floor)
    .map((r) => `${r.theme}: ${r.label} = ${r.ratio.toFixed(2)} < ${r.floor}`);

describe("R1 — declared colour pairs, measured in every theme", () => {
  const rows = measure(css);

  it("measures a real population in both themes", () => {
    for (const theme of ["light", "dark"]) {
      expect(
        rows.filter((r) => r.theme === theme).length
      ).toBeGreaterThanOrEqual(MIN_PAIRS_PER_THEME);
    }
  });

  it("holds every pair to its floor", () => {
    expect(failures(rows)).toEqual([]);
  });

  it("keeps the decorative boundary exempt on purpose, with a reason", () => {
    expect(DECLARED.some((p) => p.ink === "border")).toBe(false);
    expect(EXEMPT.border.length).toBeGreaterThan(20);
  });

  it("proves itself on the pair axe once caught", () => {
    const planted = css.replace(
      "--muted-foreground: oklch(0.52 0 0);",
      "--muted-foreground: oklch(0.556 0 0);"
    );
    expect(planted).not.toBe(css);
    expect(failures(measure(planted))).toContainEqual(
      expect.stringContaining("light: muted-foreground on muted")
    );
  });
});

const THEME_BLOCK = "@theme inline";

/** Alias chains inside the @theme bridge; a self-reference is a cycle of one. */
const aliasCycles = (source: string): string[] => {
  const refs = new Map<string, string>();
  for (const m of block(source, THEME_BLOCK).matchAll(TOKEN)) {
    const [, name = "", value = ""] = m;
    const ref = VAR.exec(value.trim());
    if (ref) {
      refs.set(name, ref[1] ?? "");
    }
  }
  const cycles: string[] = [];
  for (const start of refs.keys()) {
    let current: string | undefined = start;
    for (let hops = 0; hops <= refs.size; hops += 1) {
      current = current === undefined ? undefined : refs.get(current);
      if (current === start) {
        cycles.push(`--${start} reaches itself`);
        break;
      }
    }
  }
  return cycles;
};

describe("R5 — the @theme bridge holds no self-reference or cycle", () => {
  it("resolves every alias to something outside itself", () => {
    expect(aliasCycles(css)).toEqual([]);
  });

  it("proves itself on a self-referencing font alias", () => {
    const planted = css.replace(
      FONT_SANS_ALIAS,
      "--font-sans: var(--font-sans);"
    );
    expect(aliasCycles(planted)).toEqual(["--font-sans reaches itself"]);
  });
});
