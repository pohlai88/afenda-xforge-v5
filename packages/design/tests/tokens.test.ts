import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R1 — every declared colour pair and required boundary is measured in every
 * theme, at rest and in the states the components draw. R5 — the @theme
 * bridge holds no self-referencing or cyclic alias. R8 — adjacent fills are
 * tellable apart (Oklab distance, which a contrast ratio cannot see). R9 —
 * every declared oklch is inside sRGB, so the measured colour is the one on
 * screen. (docs/architecture.md §6.2, docs/color-system-v2.md.) Every checker
 * takes CSS text, so the same code proves itself on a planted defect below;
 * a green over the real file means the check ran, not that it exists.
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
const MIN_PAIRS_PER_THEME = 20;
/** Oklab distance below which two fills read as one colour. */
const SEPARATION = 0.015;
const GAMUT_TOLERANCE = 1e-6;
const THEMES = [
  ["light", ":root"],
  ["dark", ".dark"],
] as const;

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

/** oklch → linear sRGB, unclamped: a channel outside [0, 1] is out of gamut. */
const linearRaw = ({ l, c, h }: Color): [number, number, number] => {
  const rad = (h * Math.PI) / 180;
  const A = c * Math.cos(rad);
  const B = c * Math.sin(rad);
  const l3 = (l + 0.396_337_777_4 * A + 0.215_803_757_3 * B) ** 3;
  const m3 = (l - 0.105_561_345_8 * A - 0.063_854_172_8 * B) ** 3;
  const s3 = (l - 0.089_484_177_5 * A - 1.291_485_548 * B) ** 3;
  return [
    4.076_741_662_1 * l3 - 3.307_711_591_3 * m3 + 0.230_969_929_2 * s3,
    -1.268_438_004_6 * l3 + 2.609_757_401_1 * m3 - 0.341_319_396_5 * s3,
    -0.004_196_086_3 * l3 - 0.703_418_614_7 * m3 + 1.707_614_701 * s3,
  ];
};

const linear = (color: Color): number[] => linearRaw(color).map(clamp);

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
 * The pairs the components draw, at rest and in their states. `*-foreground`
 * on its fill is added for every such token, so a new tone is measured the
 * moment it is declared.
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
    fill: "sidebar",
    floor: TEXT,
    ink: "muted-foreground",
    why: "the shell's eyebrow",
  },
  {
    fill: "sidebar",
    floor: TEXT,
    ink: "foreground",
    why: "the shell's ink, inherited — the one surface R1 never saw before",
  },
  {
    fill: "muted",
    floor: TEXT,
    ink: "foreground",
    why: "ghost and outline buttons, hovered (hover:bg-muted hover:text-foreground)",
  },
  {
    fill: "background",
    floor: TEXT,
    ink: "destructive",
    why: "field error copy, and the invalid border as a boundary",
  },
  {
    fill: "destructive",
    fillAlpha: 0.1,
    floor: TEXT,
    ink: "destructive",
    why: "soft destructive button and badge, at rest (bg-destructive/10)",
  },
  {
    fill: "destructive",
    fillAlpha: 0.2,
    floor: TEXT,
    ink: "destructive",
    why: "soft destructive button and badge, hovered (hover:bg-destructive/20)",
  },
  {
    fill: "primary",
    fillAlpha: 0.8,
    floor: TEXT,
    ink: "primary-foreground",
    why: "default button and badge, hovered (hover:bg-primary/80)",
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
    fill: "popover",
    floor: BOUNDARY,
    ink: "input",
    why: "field boundary inside a dialog",
  },
  {
    fill: "sidebar",
    floor: BOUNDARY,
    ink: "input",
    why: "field boundary in the shell",
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
  {
    fill: "sidebar",
    floor: BOUNDARY,
    ink: "ring",
    inkAlpha: 0.5,
    why: "focus ring on the theme toggle and nav links",
  },
];

/** Pairs deliberately outside the measurement, each with its reason. */
const EXEMPT: Readonly<Record<string, string>> = {
  border:
    "outline-variant: dividers and card edges are decorative; every container here carries text at 4.5:1 (M3 color-roles.md:167)",
  "invalid-ring":
    "ring-destructive/20 is the second indicator beside a solid border-destructive that measures 5.8:1; a half-transparent ring is not held to 3:1 on its own",
  "secondary-hover":
    "the secondary button hovers to color-mix(in oklch, var(--secondary), var(--foreground) 5%): color-mix is outside this parser, and 5% of the ink moves a 12.5:1 pair by a few percent",
};

interface Measurement {
  floor: number;
  label: string;
  ratio: number;
  theme: string;
}

const measure = (source: string): Measurement[] => {
  const out: Measurement[] = [];
  for (const [theme, selector] of THEMES) {
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

describe("R1 — declared colour pairs, measured in every theme and state", () => {
  const rows = measure(css);

  it("measures a real population in both themes", () => {
    for (const [theme] of THEMES) {
      expect(
        rows.filter((r) => r.theme === theme).length
      ).toBeGreaterThanOrEqual(MIN_PAIRS_PER_THEME);
    }
  });

  it("holds every pair to its floor", () => {
    expect(failures(rows)).toEqual([]);
  });

  it("keeps each exemption deliberate, with a reason", () => {
    expect(DECLARED.some((p) => p.ink === "border")).toBe(false);
    for (const [name, reason] of Object.entries(EXEMPT)) {
      expect(reason.length, `${name} needs a real reason`).toBeGreaterThan(20);
    }
  });

  it("proves itself on the pair axe once caught", () => {
    const planted = css.replace(
      "--muted-foreground: oklch(0.5 0.014 85);",
      "--muted-foreground: oklch(0.56 0.014 85);"
    );
    expect(planted).not.toBe(css);
    expect(failures(measure(planted))).toContainEqual(
      expect.stringContaining("light: muted-foreground on muted")
    );
  });

  it("proves itself on the hover fill nobody measured", () => {
    const planted = css.replace(
      "--destructive: oklch(0.46 0.185 27);",
      "--destructive: oklch(0.52 0.245 27.325);"
    );
    expect(planted).not.toBe(css);
    expect(failures(measure(planted))).toContainEqual(
      expect.stringContaining(
        "light: destructive on destructive — soft destructive button and badge, hovered"
      )
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

// ---------------------------------------------------------------- R8 ----

/**
 * Fills that sit next to each other on screen, or mean different things on
 * the same element. A contrast ratio measures ink on fill and is blind to
 * fill against fill, which is how three tokens were one grey until
 * 2026-09-05 (docs/color-system-v2.md §1.1).
 */
const ADJACENT: readonly [string, string, string][] = [
  ["accent", "muted", "the current nav item vs a hovered one"],
  ["accent", "secondary", "selected tint vs a secondary control"],
  ["secondary", "muted", "a control's fill vs the recessed strip"],
  ["card", "background", "a panel vs the page"],
  ["popover", "card", "a floating sheet vs a panel"],
  ["sidebar", "background", "the shell vs the page"],
];

const oklab = ({ c, h, l }: Color): [number, number, number] => {
  const rad = (h * Math.PI) / 180;
  return [l, c * Math.cos(rad), c * Math.sin(rad)];
};

/** Perceptual distance in Oklab — sees a hue-only difference at equal lightness. */
const distance = (a: Color, b: Color): number => {
  const [l1, a1, b1] = oklab(a);
  const [l2, a2, b2] = oklab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
};

const tooClose = (source: string): string[] => {
  const out: string[] = [];
  for (const [theme, selector] of THEMES) {
    const t = palette(source, selector);
    for (const [x, y, why] of ADJACENT) {
      const a = t.get(x);
      const b = t.get(y);
      if (!(a && b)) {
        throw new Error(
          `${theme}: ${x} vs ${y} names a token that does not exist`
        );
      }
      const d = distance(a, b);
      if (d < SEPARATION) {
        out.push(
          `${theme}: ${x} vs ${y} — ${why} = ${d.toFixed(3)} < ${SEPARATION}`
        );
      }
    }
  }
  return out;
};

describe("R8 — adjacent fills are tellable apart", () => {
  it("separates every declared adjacency in both themes", () => {
    expect(tooClose(css)).toEqual([]);
  });

  it("proves itself on the palette that had three names for one grey", () => {
    const planted = css.replace(
      "--accent: oklch(0.925 0.032 264);",
      "--accent: oklch(0.934 0.008 85);"
    );
    expect(planted).not.toBe(css);
    expect(tooClose(planted)).toEqual([
      expect.stringContaining("light: accent vs muted"),
    ]);
  });
});

// ---------------------------------------------------------------- R9 ----

const inGamut = (color: Color): boolean =>
  linearRaw(color).every(
    (v) => v >= -GAMUT_TOLERANCE && v <= 1 + GAMUT_TOLERANCE
  );

/** The largest chroma sRGB holds at this lightness and hue. */
const chromaCeiling = (color: Color): number => {
  let lo = 0;
  let hi = 0.4;
  for (let i = 0; i < 40; i += 1) {
    const mid = (lo + hi) / 2;
    if (inGamut({ ...color, c: mid })) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return lo;
};

/** Declarations sRGB cannot show; the browser would gamut-map them to a different colour. */
const outOfGamut = (source: string): string[] => {
  const out: string[] = [];
  for (const [theme, selector] of THEMES) {
    for (const m of block(source, selector).matchAll(TOKEN)) {
      const [, name = "", value = ""] = m;
      const color = parseColor(value);
      if (color && !inGamut(color)) {
        out.push(
          `${theme}: --${name} oklch(${color.l} ${color.c} ${color.h}) exceeds sRGB; chroma ceiling here is ${chromaCeiling(color).toFixed(3)}`
        );
      }
    }
  }
  return out;
};

describe("R9 — every declared colour is inside sRGB", () => {
  it("declares only colours the screen can show", () => {
    expect(outOfGamut(css)).toEqual([]);
  });

  it("proves itself on the emitted blue the proposal first tried", () => {
    const planted = css.replace(
      "--primary: oklch(0.82 0.09 245);",
      "--primary: oklch(0.82 0.11 245);"
    );
    expect(planted).not.toBe(css);
    expect(outOfGamut(planted)).toEqual([
      expect.stringContaining(
        "dark: --primary oklch(0.82 0.11 245) exceeds sRGB"
      ),
    ]);
  });
});
