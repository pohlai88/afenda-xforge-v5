import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ComponentContract } from "../src/blocks/contract";
import type { BlockManifest, PartManifest } from "../src/blocks/manifest";
import { COMPONENT_RULE_ID_PATTERN } from "../src/foundation/00-principles";
import { COLOR_PUBLIC_API } from "../src/foundation/02-color";
import { STATE_SIGNALS } from "../src/foundation/07-interaction";

/**
 * R15 — a block is held equal to its contract (ADR-016,
 * docs/architecture.md §6.2). A block is DEFINED, not rendered: its
 * folder carries the component's whole truth under its own name —
 * <name>-contract.ts, <name>-manifest.ts (parts keyed by the data-slot each
 * stamps, every part's base, variants and sizes as ADL utility literals) and
 * <name>.tsx deriving its classes from that data; never index, never a
 * numbered file. For every contract, the manifest's part keys equal the
 * contract's anatomy, it defines exactly the admitted variants and sizes,
 * and draws exactly the colour roles it admits — both directions, so the
 * admitted list cannot rot and a boolean-gated part has nowhere to live. Behaviour rules must exist, AF-CMP rule IDs
 * stay inside the grammar, the exemplar must use the block, and a
 * data-slot string literal in a render is refused (the definition owns
 * identity, never the render). Contracts, manifests and block folders are
 * paired all ways.
 *
 * States are held the same way, across all three levels: a contract may only
 * admit a state STATE_SIGNALS defines (L1), every selector that registry names
 * must exist in the Level-2 interaction styles, and a block admitting any
 * state must compose the mechanism they arrive through. The convention check
 * closes the loop — a boolean state is matched by PRESENCE, because Base UI
 * serialises one as the empty string and `[data-disabled="true"]` therefore
 * matches nothing it renders (AF-INT-157).
 *
 * Every checker takes data and text, so the planted defects below prove
 * each one; a green over the tree means the checks ran.
 */

const ROOT = process.cwd();
const BLOCKS_DIR = join(ROOT, "src/blocks");
const FOUNDATION = join(ROOT, "src/foundation");
const STYLES = join(ROOT, "src/styles");

/** The mechanism a block composes to receive any state presentation at all. */
const STATE_MECHANISM = "af-interactive";

/**
 * A boolean state matched by its value rather than its presence. `:not(…)`
 * guards are stripped first: `[data-disabled]:not([data-disabled="false"])`
 * is the correct form and must not read as a violation of itself.
 */
const NOT_CLAUSE = /:not\([^)]*\)/g;
const BOOLEAN_BY_VALUE = /\[data-[a-z-]+="(?:true|false)"\]/g;

const SLOT_STRING_LITERAL = /data-slot="/;
const COLOR_CLASS =
  /(?<![a-z0-9-])(?:bg|text|border|outline|fill|stroke|decoration|state-layer)-([a-z0-9-]+)/g;

/** Vite's import.meta.glob, typed locally: vite is not a direct dependency. */
declare global {
  interface ImportMeta {
    readonly glob: (
      pattern: string,
      options: { readonly eager: true }
    ) => Record<string, Record<string, unknown>>;
  }
}

const COLOR_ROLES = new Set<string>(
  (function leaves(value: unknown): string[] {
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
  })(COLOR_PUBLIC_API)
);

const pickExport = <T>(
  modules: Record<string, Record<string, unknown>>,
  suffix: string,
  exclude: string
): Map<string, T> => {
  const out = new Map<string, T>();
  for (const [path, mod] of Object.entries(modules)) {
    if (path.endsWith(exclude)) {
      continue;
    }
    const name = Object.keys(mod).find((k) => k.endsWith(suffix));
    if (!name) {
      throw new Error(`${path} exports no *${suffix}`);
    }
    const id = path.split("/").at(-1)?.replace(".ts", "") ?? "";
    out.set(
      path.includes("/blocks/") ? (path.split("/").at(-2) ?? "") : id,
      mod[name] as T
    );
  }
  return out;
};

const contracts = pickExport<ComponentContract>(
  import.meta.glob("../src/blocks/*/*-contract.ts", { eager: true }),
  "_CONTRACT",
  "/blocks/contract.ts"
);

const manifests = pickExport<BlockManifest>(
  import.meta.glob("../src/blocks/*/*-manifest.ts", { eager: true }),
  "_MANIFEST",
  "/blocks/manifest.ts"
);

const blockSource = (id: string): string =>
  readFileSync(join(BLOCKS_DIR, id, `${id}.tsx`), "utf8");

const foundationText = (() => {
  const parts: string[] = [];
  for (const entry of readdirSync(FOUNDATION, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      for (const f of readdirSync(join(FOUNDATION, entry.name))) {
        if (f.endsWith(".ts")) {
          parts.push(readFileSync(join(FOUNDATION, entry.name, f), "utf8"));
        }
      }
    } else if (entry.name.endsWith(".ts")) {
      parts.push(readFileSync(join(FOUNDATION, entry.name), "utf8"));
    }
  }
  return parts.join("\n");
})();

const populationFindings = (
  contractIds: readonly string[],
  manifestIds: readonly string[],
  blockDirs: readonly string[]
): string[] => {
  const out: string[] = [];
  for (const id of contractIds) {
    if (!blockDirs.includes(id)) {
      out.push(`contract ${id} has no block in src/blocks/${id}/`);
    }
    if (!manifestIds.includes(id)) {
      out.push(
        `contract ${id} has no manifest in src/blocks/${id}/${id}-manifest.ts`
      );
    }
  }
  for (const dir of blockDirs) {
    if (!contractIds.includes(dir)) {
      out.push(
        `block ${dir} has no contract in src/blocks/${dir}/${dir}-contract.ts`
      );
    }
  }
  return out;
};

/**
 * The naming law: every file in a block folder carries the component's
 * actual name — never index, never a numbered file. The globs above can
 * only pair correctly-named files, so a stray name is surfaced here by
 * name rather than as a mysterious missing pair.
 */
const nameFindings = (dir: string, files: readonly string[]): string[] => {
  const expected = new Set([
    `${dir}-contract.ts`,
    `${dir}-manifest.ts`,
    `${dir}.tsx`,
  ]);
  return files
    .filter((file) => !expected.has(file))
    .map(
      (file) =>
        `block ${dir} carries ${file}; a block file is named by its component (${dir}-contract.ts, ${dir}-manifest.ts, ${dir}.tsx)`
    );
};

const slotFindings = (
  contract: ComponentContract,
  manifest: BlockManifest,
  source: string
): string[] => {
  const declared = Object.keys(contract.anatomy);
  const defined = Object.keys(manifest.parts);
  const out: string[] = [];
  for (const slot of defined) {
    if (!declared.includes(slot)) {
      out.push(
        `${contract.id}: manifest part ${slot} is not in the contract's anatomy`
      );
    }
  }
  for (const slot of declared) {
    if (!defined.includes(slot)) {
      out.push(`${contract.id}: declared part ${slot} is not in the manifest`);
    }
  }
  if (SLOT_STRING_LITERAL.test(source)) {
    out.push(
      `${contract.id}: the render carries a data-slot string literal — identity belongs to the manifest, not the render`
    );
  }
  return out;
};

/** Axis names defined anywhere in the block: the union across its parts. */
const definedAxis = (
  manifest: BlockManifest,
  axis: "sizes" | "variants"
): string[] => [
  ...new Set(
    Object.values(manifest.parts).flatMap((p) => Object.keys(p[axis] ?? {}))
  ),
];

const apiFindings = (
  contract: ComponentContract,
  manifest: BlockManifest
): string[] => {
  const out: string[] = [];
  for (const [axis, declared, defined] of [
    [
      "variant",
      Object.keys(contract.api.variants),
      definedAxis(manifest, "variants"),
    ],
    ["size", Object.keys(contract.api.sizes), definedAxis(manifest, "sizes")],
  ] as const) {
    for (const name of declared) {
      if (!defined.includes(name)) {
        out.push(`${contract.id}: admitted ${axis} ${name} is not defined`);
      }
    }
    for (const name of defined) {
      if (!declared.includes(name)) {
        out.push(
          `${contract.id}: defines ${axis} ${name}, which the contract does not admit`
        );
      }
    }
  }
  return out;
};

const manifestClasses = (manifest: BlockManifest): string =>
  Object.values(manifest.parts)
    .flatMap((p) => [
      ...p.base,
      ...Object.values(p.variants ?? {}).flat(),
      ...Object.values(p.sizes ?? {}).flat(),
    ])
    .join(" ");

const roleFindings = (
  contract: ComponentContract,
  manifest: BlockManifest
): string[] => {
  const drawn = new Set<string>();
  for (const m of manifestClasses(manifest).matchAll(COLOR_CLASS)) {
    const name = m[1] ?? "";
    if (COLOR_ROLES.has(name)) {
      drawn.add(name);
    }
  }
  const out: string[] = [];
  for (const role of drawn) {
    if (!contract.tokens.includes(role)) {
      out.push(
        `${contract.id}: draws ${role}, which the contract does not admit`
      );
    }
  }
  for (const role of contract.tokens) {
    if (!drawn.has(role)) {
      out.push(`${contract.id}: admits ${role}, which no class draws`);
    }
  }
  return out;
};

const behaviourFindings = (
  contract: ComponentContract,
  foundation: string
): string[] =>
  contract.behaviour
    .filter((id) => !foundation.includes(`id: "${id}"`))
    .map((id) => `${contract.id}: behaviour rule ${id} is defined nowhere`);

const ruleFindings = (contract: ComponentContract): string[] =>
  contract.rules
    .filter(
      (r) =>
        !(
          COMPONENT_RULE_ID_PATTERN.test(r.id) &&
          r.id.startsWith(`AF-CMP-${contract.code}-`)
        )
    )
    .map(
      (r) =>
        `${contract.id}: rule ${r.id} is outside the AF-CMP-${contract.code} grammar`
    );

const exemplarFindings = (contract: ComponentContract): string[] => {
  const path = join(ROOT, "../..", contract.exemplar);
  if (!existsSync(path)) {
    return [`${contract.id}: exemplar ${contract.exemplar} does not exist`];
  }
  if (
    !readFileSync(path, "utf8").includes(`@xforge/design/blocks/${contract.id}`)
  ) {
    return [
      `${contract.id}: exemplar ${contract.exemplar} does not use the block`,
    ];
  }
  return [];
};

/** Level-1 state name -> the DOM signals it answers to, across all axes. */
const SIGNALS = new Map<string, readonly string[]>(
  Object.values(STATE_SIGNALS).flatMap((axis) => Object.entries(axis))
);

const interactionText = ["interaction.css", "accessibility.css"]
  .map((f) => readFileSync(join(STYLES, f), "utf8"))
  .join("\n");

const stateFindings = (
  contract: ComponentContract,
  styles: string
): string[] => {
  const out: string[] = [];
  for (const state of contract.api.states) {
    const signals = SIGNALS.get(state);
    if (!signals) {
      out.push(
        `${contract.id}: admits state ${state}, which the interaction language does not define`
      );
      continue;
    }
    for (const selector of signals) {
      if (!styles.includes(selector)) {
        out.push(
          `${contract.id}: state ${state} is signalled by ${selector}, which the interaction styles never match`
        );
      }
    }
  }
  return out;
};

const mechanismFindings = (
  contract: ComponentContract,
  manifest: BlockManifest
): string[] =>
  contract.api.states.length > 0 &&
  !Object.values(manifest.parts).some((p) => p.base.includes(STATE_MECHANISM))
    ? [
        `${contract.id}: admits states but no part's base composes ${STATE_MECHANISM}, which delivers them`,
      ]
    : [];

const conventionFindings = (styles: string): string[] =>
  [
    ...new Set(styles.replace(NOT_CLAUSE, "").match(BOOLEAN_BY_VALUE) ?? []),
  ].map(
    (selector) =>
      `${selector} matches a boolean state by value; Base UI serialises one as the empty string, so a boolean state is matched by presence (AF-INT-157)`
  );

/** The first part of a manifest, with its slot, for planted rebuilds. */
const soleEntry = (manifest: BlockManifest): [string, PartManifest] => {
  const [entry] = Object.entries(manifest.parts);
  if (!entry) {
    throw new Error("manifest has no parts");
  }
  return entry;
};

const paired = (): [ComponentContract, BlockManifest][] =>
  [...contracts.entries()].flatMap(([id, contract]) => {
    const manifest = manifests.get(id);
    return manifest ? [[contract, manifest]] : [];
  });

/**
 * The planted rebuilds anchor to the button block by name: it is the block
 * that admits states and variants, so every checker can be shown failing.
 * Positional anchoring ("the first pair") broke when the population grew
 * past blocks that sort before it.
 */
const buttonPair = (): [ComponentContract, BlockManifest] => {
  const pair = paired().find(([contract]) => contract.id === "button");
  if (!pair) {
    throw new Error("no button block");
  }
  return pair;
};

describe("R15 — a block is held equal to its contract", () => {
  const contractIds = [...contracts.keys()];
  const manifestIds = [...manifests.keys()];
  const blockDirs = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);

  it("covers a real population", () => {
    expect(contracts.size).toBeGreaterThanOrEqual(1);
    expect(COLOR_ROLES.size).toBeGreaterThanOrEqual(80);
  });

  it("pairs every contract with a block and manifest, and every block with a contract", () => {
    expect(populationFindings(contractIds, manifestIds, blockDirs)).toEqual([]);
  });

  it("names every block file by its component, never index", () => {
    expect(
      blockDirs.flatMap((dir) =>
        nameFindings(dir, readdirSync(join(BLOCKS_DIR, dir)))
      )
    ).toEqual([]);
  });

  it("proves itself on an index file smuggled into a block", () => {
    expect(nameFindings("dialog", ["dialog-contract.ts", "index.tsx"])).toEqual(
      [
        "block dialog carries index.tsx; a block file is named by its component (dialog-contract.ts, dialog-manifest.ts, dialog.tsx)",
      ]
    );
  });

  it("defines exactly the declared anatomy, never in the render", () => {
    expect(
      paired().flatMap(([c, m]) => slotFindings(c, m, blockSource(c.id)))
    ).toEqual([]);
  });

  it("defines exactly the admitted variants and sizes", () => {
    expect(paired().flatMap(([c, m]) => apiFindings(c, m))).toEqual([]);
  });

  it("draws exactly the admitted colour roles", () => {
    expect(paired().flatMap(([c, m]) => roleFindings(c, m))).toEqual([]);
  });

  it("admits states the language defines, and that Level 2 actually matches", () => {
    expect(
      [...contracts.values()].flatMap((c) => stateFindings(c, interactionText))
    ).toEqual([]);
  });

  it("composes the mechanism its states arrive through", () => {
    expect(paired().flatMap(([c, m]) => mechanismFindings(c, m))).toEqual([]);
  });

  it("matches every boolean state by presence, never by value", () => {
    expect(conventionFindings(interactionText)).toEqual([]);
  });

  it("names behaviour rules that exist, and keeps its own inside the grammar", () => {
    expect(
      [...contracts.values()].flatMap((c) =>
        behaviourFindings(c, foundationText)
      )
    ).toEqual([]);
    expect([...contracts.values()].flatMap((c) => ruleFindings(c))).toEqual([]);
  });

  it("points at a live exemplar, and curates real guidance", () => {
    expect([...contracts.values()].flatMap((c) => exemplarFindings(c))).toEqual(
      []
    );
    for (const c of contracts.values()) {
      // Intents are search keys and may be one word; guidance is sentences.
      expect(c.intents.length).toBeGreaterThanOrEqual(1);
      for (const key of c.intents) {
        expect(key.length, `${c.id} intent too thin`).toBeGreaterThanOrEqual(3);
      }
      for (const list of [c.do, c.dont]) {
        expect(list.length).toBeGreaterThanOrEqual(1);
        for (const line of list) {
          expect(line.length, `${c.id} guidance too thin`).toBeGreaterThan(8);
        }
      }
    }
  });

  it("proves itself on a part the contract never declared", () => {
    const [contract, manifest] = buttonPair();
    const [, part] = soleEntry(manifest);
    const planted = { parts: { "button-glow": part } };
    expect(slotFindings(contract, planted, blockSource(contract.id))).toEqual([
      `${contract.id}: manifest part button-glow is not in the contract's anatomy`,
      `${contract.id}: declared part button is not in the manifest`,
    ]);
  });

  it("proves itself on a data-slot literal smuggled into the render", () => {
    const [contract, manifest] = buttonPair();
    const source = blockSource(contract.id);
    const planted = source.replace("data-slot={SLOT}", 'data-slot="button"');
    expect(planted).not.toBe(source);
    expect(slotFindings(contract, manifest, planted)).toEqual([
      `${contract.id}: the render carries a data-slot string literal — identity belongs to the manifest, not the render`,
    ]);
  });

  it("proves itself on a variant the contract never admitted", () => {
    const [contract, manifest] = buttonPair();
    const [slot, part] = soleEntry(manifest);
    const { ghost, ...rest } = part.variants ?? {};
    const planted = {
      parts: {
        [slot]: { ...part, variants: { ...rest, phantom: ghost ?? [] } },
      },
    };
    const findings = apiFindings(contract, planted);
    expect(findings).toContain(
      `${contract.id}: admitted variant ghost is not defined`
    );
    expect(findings).toContain(
      `${contract.id}: defines variant phantom, which the contract does not admit`
    );
  });

  it("proves itself on colour roles outside the admission", () => {
    const [contract, manifest] = buttonPair();
    const [slot, part] = soleEntry(manifest);
    const planted = {
      parts: {
        [slot]: {
          ...part,
          variants: {
            ...part.variants,
            // positive is unadmitted; dropping border-outline leaves outline
            // (drawn by exactly one class) admitted but undrawn.
            default: [
              "bg-positive",
              "text-on-primary",
              "state-layer-on-primary",
            ],
            outline: [
              "border-boundary",
              "text-on-surface",
              "state-layer-on-surface",
            ],
          },
        },
      },
    };
    const findings = roleFindings(contract, planted);
    expect(findings).toContain(
      `${contract.id}: draws positive, which the contract does not admit`
    );
    expect(findings).toContain(
      `${contract.id}: admits outline, which no class draws`
    );
  });

  it("proves itself on a behaviour rule that does not exist", () => {
    const [contract] = contracts.values();
    if (!contract) {
      throw new Error("no contract");
    }
    const planted = { ...contract, behaviour: ["AF-INT-999"] };
    expect(behaviourFindings(planted, foundationText)).toEqual([
      `${contract.id}: behaviour rule AF-INT-999 is defined nowhere`,
    ]);
  });

  it("proves itself on a state the language never defined", () => {
    const [contract] = contracts.values();
    if (!contract) {
      throw new Error("no contract");
    }
    const planted = {
      ...contract,
      api: { ...contract.api, states: ["glimmer"] },
    };
    expect(stateFindings(planted, interactionText)).toEqual([
      `${contract.id}: admits state glimmer, which the interaction language does not define`,
    ]);
  });

  it("proves itself on a signal Level 2 stopped matching", () => {
    const [contract] = buttonPair();
    // The exact regression this check exists for: the presence-matched
    // attribute rewritten to the value form Base UI never renders.
    const planted = interactionText
      .split("[data-pressed]")
      .join('[data-pressed="true"]');
    expect(stateFindings(contract, planted)).toEqual([
      `${contract.id}: state pressed is signalled by [data-pressed], which the interaction styles never match`,
    ]);
  });

  it("proves itself on a block that drops the state mechanism", () => {
    const [contract, manifest] = buttonPair();
    const [slot, part] = soleEntry(manifest);
    const planted = {
      parts: {
        [slot]: {
          ...part,
          base: part.base.filter((c) => c !== STATE_MECHANISM),
        },
      },
    };
    expect(mechanismFindings(contract, planted)).toEqual([
      `${contract.id}: admits states but no part's base composes ${STATE_MECHANISM}, which delivers them`,
    ]);
  });

  it("proves itself on a boolean state matched by value, and clears the guard", () => {
    expect(
      conventionFindings(
        '.af-interactive[data-disabled="true"] { color: red; }'
      )
    ).toEqual([
      '[data-disabled="true"] matches a boolean state by value; Base UI serialises one as the empty string, so a boolean state is matched by presence (AF-INT-157)',
    ]);
    expect(
      conventionFindings(
        '.af-interactive[data-disabled]:not([data-disabled="false"]) { color: red; }'
      )
    ).toEqual([]);
  });

  it("proves itself on a block without a contract", () => {
    expect(
      populationFindings(contractIds, manifestIds, [...blockDirs, "banner"])
    ).toEqual([
      "block banner has no contract in src/blocks/banner/banner-contract.ts",
    ]);
  });
});
