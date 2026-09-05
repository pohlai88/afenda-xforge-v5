import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * R13 — the physics of the ADL colour schemes are measured, not asserted
 * (docs/architecture.md §6.2; the ADL twin of R1/R8/R9, which hold the
 * legacy globals.css). Across all six schemes — light and dark, each at
 * standard, medium and high contrast — every derived text pair holds
 * 4.5:1, every boundary probe 3:1, hover composites stay legible, data
 * colours clear their floors, the surface ladder keeps its steps tellable
 * apart in Oklab (one structural waiver, ratcheted), sequential ramps are
 * monotonic, and every reference oklch is inside sRGB.
 *
 * Every checker takes CSS text, so the same code proves itself on the
 * planted defects below; a green over the real files means the check ran.
 *
 * The ratios are WCAG 2.2, not APCA (which Base UI's accessibility page
 * suggests): AA conformance is the normative bar the language commits to,
 * and APCA is the WCAG 3 draft model. Revisit when WCAG 3 is a standard.
 */

// Vitest runs with the package as cwd; import.meta.url is rewritten by Vite.
const STYLES = join(process.cwd(), "src/styles");
const tokensCss = readFileSync(join(STYLES, "tokens.css"), "utf8");
const colorCss = readFileSync(join(STYLES, "color.css"), "utf8");

const TEXT = 4.5;
const PROBE = 3;
const SEPARATION = 0.015;
/** interaction.css --af-int-state-hover-opacity resolves --af-ref-opacity-4. */
const HOVER_ALPHA = 0.04;
const MIN_PAIRS_PER_SCHEME = 40;
const GAMUT_TOLERANCE = 1e-6;

const REF_COLOR = /(--af-ref-color-[a-z0-9-]+):\s*oklch\(([^)]+)\)/g;
const OKLCH_ANY = /oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/g;
const SYS_COLOR = /(--af-sys-color-[a-z0-9-]+):\s*([^;]+);/g;
const TENANT_WRAP = /^var\(\s*--af-tenant-[a-z0-9-]+,\s*([\s\S]+?)\s*\)$/;
const REF_VALUE = /^var\(\s*(--af-ref-color-[a-z0-9-]+)\s*\)$/;

const LIGHT = /^:root \{([\s\S]*?)\n\}/m;
const DARK = /^:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/m;
const LIGHT_MEDIUM =
  /^:root:not\(\[data-theme="dark"\]\)\[data-contrast="medium"\] \{([\s\S]*?)\n\}/m;
const DARK_MEDIUM =
  /^:root\[data-theme="dark"\]\[data-contrast="medium"\] \{([\s\S]*?)\n\}/m;
const LIGHT_HIGH =
  /^:root:not\(\[data-theme="dark"\]\)\[data-contrast="high"\] \{([\s\S]*?)\n\}/m;
const DARK_HIGH =
  /^:root\[data-theme="dark"\]\[data-contrast="high"\] \{([\s\S]*?)\n\}/m;

interface Color {
  c: number;
  h: number;
  l: number;
}

/** The one role whose value is not a plain reference, with its reason. */
const EXEMPT: Readonly<Record<string, string>> = {
  scrim:
    "oklch(from black l c h / opacity-38) is relative-colour syntax outside this parser; a 38% black veil under a dialog carries no text of its own",
};

const OKLCH_BODY = /^\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)/;

const parseOklch = (raw: string): Color | undefined => {
  const m = OKLCH_BODY.exec(raw);
  if (!m) {
    return undefined;
  }
  const [, l = "0", pct = "", c = "0", h = "0"] = m;
  return {
    c: Number(c),
    h: Number(h),
    l: pct === "%" ? Number(l) / 100 : Number(l),
  };
};

/** The reference palette: every --af-ref-color-* in tokens.css. */
const paletteOf = (source: string): Map<string, Color> => {
  const out = new Map<string, Color>();
  for (const m of source.matchAll(REF_COLOR)) {
    const [, name = "", body = ""] = m;
    const color = parseOklch(body);
    if (color) {
      out.set(name, color);
    }
  }
  return out;
};

const SCHEME_LAYERS: readonly [string, readonly RegExp[]][] = [
  ["light/standard", [LIGHT]],
  ["dark/standard", [LIGHT, DARK]],
  ["light/medium", [LIGHT, LIGHT_MEDIUM]],
  ["dark/medium", [LIGHT, DARK, DARK_MEDIUM]],
  ["light/high", [LIGHT, LIGHT_HIGH]],
  ["dark/high", [LIGHT, DARK, DARK_HIGH]],
];

/** One scheme: role -> colour, later layers overriding earlier ones. */
const schemeOf = (
  source: string,
  layers: readonly RegExp[],
  palette: Map<string, Color>
): Map<string, Color> => {
  const raw = new Map<string, string>();
  for (const layer of layers) {
    const body = layer.exec(source)?.[1];
    if (body === undefined) {
      throw new Error(`a scheme block is missing from color.css (${layer})`);
    }
    for (const m of body.matchAll(SYS_COLOR)) {
      const [, name = "", value = ""] = m;
      raw.set(
        name.replace("--af-sys-color-", ""),
        value.replace(/\s+/g, " ").trim()
      );
    }
  }
  const out = new Map<string, Color>();
  for (const [role, value] of raw) {
    const unwrapped = TENANT_WRAP.exec(value)?.[1]?.trim() ?? value;
    const ref = REF_VALUE.exec(unwrapped)?.[1];
    const color = ref ? palette.get(ref) : undefined;
    if (color) {
      out.set(role, color);
    } else if (!(role in EXEMPT)) {
      throw new Error(`${role} resolves to no reference colour: ${value}`);
    }
  }
  return out;
};

const clamp = (v: number) => Math.min(1, Math.max(0, v));

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
const composite = (top: Color, alpha: number, under: Color): number[] => {
  const t = linear(top).map(gamma);
  const u = linear(under).map(gamma);
  return t.map((v, i) => degamma(alpha * v + (1 - alpha) * (u[i] ?? 0)));
};

const luminance = (rgb: number[]) =>
  0.2126 * (rgb[0] ?? 0) + 0.7152 * (rgb[1] ?? 0) + 0.0722 * (rgb[2] ?? 0);

const ratioOf = (inkRgb: number[], fillRgb: number[]): number => {
  const [hi = 0, lo = 0] = [luminance(inkRgb), luminance(fillRgb)].sort(
    (x, y) => y - x
  );
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
};

const contrast = (ink: Color, fill: Color): number =>
  ratioOf(linear(ink), linear(fill));

const oklab = ({ c, h, l }: Color): [number, number, number] => {
  const rad = (h * Math.PI) / 180;
  return [l, c * Math.cos(rad), c * Math.sin(rad)];
};

const distance = (a: Color, b: Color): number => {
  const [l1, a1, b1] = oklab(a);
  const [l2, a2, b2] = oklab(b);
  return Math.sqrt((l1 - l2) ** 2 + (a1 - a2) ** 2 + (b1 - b2) ** 2);
};

const SURFACES = [
  "surface",
  "surface-dim",
  "surface-bright",
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
] as const;

const PAIRED = [
  "primary",
  "secondary",
  "tertiary",
  "error",
  "positive",
  "negative",
  "warning",
  "informative",
] as const;

const FIXED = ["primary", "secondary", "tertiary"] as const;

interface Pair {
  fill: string;
  floor: number;
  ink: string;
}

/** Every pair the roles themselves imply — derived, never listed by hand. */
const derivedPairs = (): Pair[] => {
  const out: Pair[] = [];
  for (const x of PAIRED) {
    out.push(
      { fill: x, floor: TEXT, ink: `on-${x}` },
      { fill: `${x}-container`, floor: TEXT, ink: `on-${x}-container` }
    );
  }
  for (const f of FIXED) {
    for (const fill of [`${f}-fixed`, `${f}-fixed-dim`]) {
      out.push(
        { fill, floor: TEXT, ink: `on-${f}-fixed` },
        { fill, floor: TEXT, ink: `on-${f}-fixed-variant` }
      );
    }
  }
  // The wash is a flattened composite, so R13 measures the rendered pair.
  out.push({ fill: "primary-wash", floor: TEXT, ink: "on-primary-wash" });
  out.push({ fill: "inverse-surface", floor: TEXT, ink: "inverse-on-surface" });
  for (const ink of ["on-surface", "on-surface-variant"]) {
    for (const fill of SURFACES) {
      out.push({ fill, floor: TEXT, ink });
    }
  }
  // The button's link variant declares primary as text ink on the surface
  // family (AF-COL-014 declared pair); the 3:1 probe below is the ring
  // floor and does not cover it (AF-COL-034), so it is held here at 4.5.
  for (const fill of SURFACES) {
    out.push({ fill, floor: TEXT, ink: "primary" });
  }
  return out;
};

const schemes = (
  source: string,
  palette: Map<string, Color>
): [string, Map<string, Color>][] =>
  SCHEME_LAYERS.map(([name, layers]) => [
    name,
    schemeOf(source, layers, palette),
  ]);

const roleOf = (scheme: Map<string, Color>, role: string): Color => {
  const color = scheme.get(role);
  if (!color) {
    throw new Error(`scheme is missing ${role}`);
  }
  return color;
};

const pairFindings = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  for (const [name, scheme] of schemes(source, palette)) {
    for (const pair of derivedPairs()) {
      const ratio = contrast(
        roleOf(scheme, pair.ink),
        roleOf(scheme, pair.fill)
      );
      if (ratio < pair.floor) {
        out.push(
          `${name}: ${pair.ink} on ${pair.fill} = ${ratio} < ${pair.floor}`
        );
      }
    }
  }
  return out;
};

/** outline (structure), primary (focus ring), error (invalid boundary). */
const probeFindings = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  for (const [name, scheme] of schemes(source, palette)) {
    for (const probe of ["outline", "primary", "error"]) {
      for (const fill of SURFACES) {
        const ratio = contrast(roleOf(scheme, probe), roleOf(scheme, fill));
        if (ratio < PROBE) {
          out.push(`${name}: ${probe} on ${fill} = ${ratio} < ${PROBE}`);
        }
      }
    }
  }
  return out;
};

/** Every pair a block manifest hovers with the state layer (button, wash). */
const HOVERED: readonly [string, string][] = [
  ["on-primary", "primary"],
  ["on-secondary", "secondary"],
  ["on-tertiary", "tertiary"],
  ["on-error", "error"],
  ["on-primary-container", "primary-container"],
  ["on-primary-wash", "primary-wash"],
  ["on-error-container", "error-container"],
  ["on-secondary-container", "secondary-container"],
  ["on-tertiary-container", "tertiary-container"],
  ["on-positive-container", "positive-container"],
  ["on-informative-container", "informative-container"],
  ["inverse-on-surface", "inverse-surface"],
  ["on-surface", "surface-container-highest"],
];

/** The state layer is the ink at 4% over the fill; the ink sits on that. */
const hoverFindings = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  for (const [name, scheme] of schemes(source, palette)) {
    for (const [ink, fill] of HOVERED) {
      const inkColor = roleOf(scheme, ink);
      const hovered = composite(inkColor, HOVER_ALPHA, roleOf(scheme, fill));
      const ratio = ratioOf(linear(inkColor), hovered);
      if (ratio < TEXT) {
        out.push(`${name}: ${ink} on hovered ${fill} = ${ratio} < ${TEXT}`);
      }
    }
  }
  return out;
};

const dataFindings = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  for (const [name, scheme] of schemes(source, palette)) {
    if (!name.endsWith("/standard")) {
      continue;
    }
    const marks = [
      ...Array.from({ length: 8 }, (_, i) => `categorical-${i + 1}`),
      "diverging-negative",
      "diverging-positive",
    ];
    for (const mark of marks) {
      for (const fill of ["surface", "surface-container"]) {
        const ratio = contrast(roleOf(scheme, mark), roleOf(scheme, fill));
        if (ratio < PROBE) {
          out.push(`${name}: ${mark} on ${fill} = ${ratio} < ${PROBE}`);
        }
      }
    }
    const ramp = [
      "sequential-lowest",
      "sequential-low",
      "sequential-medium",
      "sequential-high",
      "sequential-highest",
    ].map((r) => roleOf(scheme, r).l);
    const descending = name.startsWith("light");
    for (let i = 1; i < ramp.length; i += 1) {
      const previous = ramp[i - 1] ?? 0;
      const current = ramp[i] ?? 0;
      if (descending ? current >= previous : current <= previous) {
        out.push(`${name}: sequential ramp is not monotonic at step ${i}`);
      }
    }
  }
  return out;
};

/**
 * One structural waiver, ratcheted: the gap may never shrink below its
 * recorded value, and once it clears the floor the waiver must go.
 */
const WAIVED: Readonly<
  Record<string, { readonly floor: number; readonly reason: string }>
> = {
  "light/standard: surface-container-lowest vs surface-container-low": {
    floor: 0.0095,
    reason:
      "low is the shelf barely above the ground: between white and the 98.12% ground only 0.0188 of Oklab headroom exists, which cannot hold a full 0.015 step",
  },
};

const LADDER = [
  "surface-container-lowest",
  "surface-container-low",
  "surface-container",
  "surface-container-high",
  "surface-container-highest",
] as const;

const adjacencyFindings = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  for (const [name, scheme] of schemes(source, palette)) {
    if (!name.endsWith("/standard")) {
      continue;
    }
    const steps: [string, string][] = LADDER.slice(1).map((step, i) => [
      LADDER[i] ?? "",
      step,
    ]);
    steps.push(["surface", "surface-dim"], ["surface", "surface-bright"]);
    for (const [a, b] of steps) {
      const d = distance(roleOf(scheme, a), roleOf(scheme, b));
      const waiver = WAIVED[`${name}: ${a} vs ${b}`];
      if (waiver) {
        if (d < waiver.floor - GAMUT_TOLERANCE) {
          out.push(
            `${name}: ${a} vs ${b} = ${d.toFixed(4)} shrank below its ratchet ${waiver.floor}`
          );
        }
      } else if (d < SEPARATION) {
        out.push(`${name}: ${a} vs ${b} = ${d.toFixed(4)} < ${SEPARATION}`);
      }
    }
  }
  return out;
};

const waiverOutlived = (
  source: string,
  palette: Map<string, Color>
): string[] => {
  const out: string[] = [];
  const resolved = new Map(schemes(source, palette));
  for (const key of Object.keys(WAIVED)) {
    const [name = "", pair = ""] = key.split(": ");
    const [a = "", b = ""] = pair.split(" vs ");
    const scheme = resolved.get(name);
    if (!scheme) {
      continue;
    }
    const d = distance(roleOf(scheme, a), roleOf(scheme, b));
    if (d >= SEPARATION) {
      out.push(`${key} now measures ${d.toFixed(4)} — remove the waiver`);
    }
  }
  return out;
};

const inGamut = (color: Color): boolean =>
  linearRaw(color).every(
    (v) => v >= -GAMUT_TOLERANCE && v <= 1 + GAMUT_TOLERANCE
  );

/** Every oklch literal in tokens.css, shadows included. */
const gamutFindings = (source: string): string[] => {
  const out: string[] = [];
  for (const m of source.matchAll(OKLCH_ANY)) {
    const [, l = "0", pct = "", c = "0", h = "0"] = m;
    const color: Color = {
      c: Number(c),
      h: Number(h),
      l: pct === "%" ? Number(l) / 100 : Number(l),
    };
    if (!inGamut(color)) {
      out.push(`oklch(${l}${pct} ${c} ${h}) exceeds sRGB`);
    }
  }
  return out;
};

describe("R13 — the physics of the ADL schemes are measured", () => {
  const palette = paletteOf(tokensCss);

  it("measures a real population in every scheme", () => {
    expect(derivedPairs().length).toBeGreaterThanOrEqual(MIN_PAIRS_PER_SCHEME);
    expect(palette.size).toBeGreaterThanOrEqual(70);
    expect(schemes(colorCss, palette)).toHaveLength(6);
  });

  it("holds every derived text pair to 4.5 in all six schemes", () => {
    expect(pairFindings(colorCss, palette)).toEqual([]);
  });

  it("holds outline, focus and error boundaries to 3 on every surface", () => {
    expect(probeFindings(colorCss, palette)).toEqual([]);
  });

  it("keeps hovered fills legible under the 4% state layer", () => {
    expect(hoverFindings(colorCss, palette)).toEqual([]);
  });

  it("clears the data floors and keeps sequential ramps monotonic", () => {
    expect(dataFindings(colorCss, palette)).toEqual([]);
  });

  it("keeps ladder steps tellable apart, ratcheting the one waiver", () => {
    expect(adjacencyFindings(colorCss, palette)).toEqual([]);
  });

  it("refuses a waiver that has outlived its reason", () => {
    expect(waiverOutlived(colorCss, palette)).toEqual([]);
    for (const { reason } of Object.values(WAIVED)) {
      expect(reason.length).toBeGreaterThan(20);
    }
  });

  it("declares only reference colours sRGB can show", () => {
    expect(gamutFindings(tokensCss)).toEqual([]);
  });

  it("proves itself on a container ink gone pale", () => {
    const planted = colorCss.replace(
      "--af-sys-color-on-warning-container: var(--af-ref-color-amber-47);",
      "--af-sys-color-on-warning-container: var(--af-ref-color-amber-84);"
    );
    expect(planted).not.toBe(colorCss);
    expect(pairFindings(planted, palette)).toContainEqual(
      expect.stringContaining(
        "light/standard: on-warning-container on warning-container"
      )
    );
  });

  it("proves itself on an outline the ladder swallows", () => {
    const planted = colorCss.replace(
      "  --af-sys-color-outline: var(--af-ref-color-slate-55);",
      "  --af-sys-color-outline: var(--af-ref-color-slate-84);"
    );
    expect(planted).not.toBe(colorCss);
    expect(probeFindings(planted, palette)).toContainEqual(
      expect.stringContaining("light/standard: outline on surface")
    );
  });

  it("proves itself on the ladder gap this rule repaired", () => {
    const planted = colorCss.replace(
      "--af-sys-color-surface-container-high: var(--af-ref-color-slate-93);",
      "--af-sys-color-surface-container-high: var(--af-ref-color-slate-96);"
    );
    expect(planted).not.toBe(colorCss);
    expect(adjacencyFindings(planted, palette)).toContainEqual(
      expect.stringContaining(
        "light/standard: surface-container vs surface-container-high"
      )
    );
  });

  it("proves itself on a ramp that loses its order", () => {
    const planted = colorCss.replace(
      "  --af-sys-color-sequential-highest: var(--af-ref-color-blue-45);",
      "  --af-sys-color-sequential-highest: var(--af-ref-color-blue-91);"
    );
    expect(planted).not.toBe(colorCss);
    expect(dataFindings(planted, palette)).toContainEqual(
      expect.stringContaining(
        "light/standard: sequential ramp is not monotonic"
      )
    );
  });

  it("proves itself on a chroma sRGB cannot hold", () => {
    const planted = tokensCss.replace(
      "oklch(44.63% 0.0788 233.77)",
      "oklch(44.63% 0.25 233.77)"
    );
    expect(planted).not.toBe(tokensCss);
    expect(gamutFindings(planted)).toEqual([
      "oklch(44.63% 0.25 233.77) exceeds sRGB",
    ]);
  });
});
