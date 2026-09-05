import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { BlockManifest } from "../src/blocks/manifest";
import { COMPONENT_RULE_ID_PATTERN } from "../src/foundation/00-principles";
import { COLOR_PUBLIC_API } from "../src/foundation/02-color";
import type { ComponentContract } from "../src/foundation/10-components/contract";

/**
 * R15 — a block is held equal to its contract (ADR-016,
 * docs/architecture.md §6.2). A block is DEFINED, not rendered: its
 * folder carries manifest.ts — base, variants and sizes as ADL utility
 * literals — and index.tsx derives its classes from that data. For every
 * contract in foundation/10-components/, the manifest declares exactly
 * the contract's anatomy slot, exactly its admitted variants and sizes,
 * and draws exactly the colour roles it admits — both directions, so the
 * admitted list cannot rot. Behaviour rules must exist, AF-CMP rule IDs
 * stay inside the grammar, the exemplar must use the block, and a
 * data-slot string literal in a render is refused (the definition owns
 * identity, never the render). Contracts, manifests and block folders are
 * paired all ways.
 *
 * Every checker takes data and text, so the planted defects below prove
 * each one; a green over the tree means the checks ran.
 */

const ROOT = process.cwd();
const BLOCKS_DIR = join(ROOT, "src/blocks");
const FOUNDATION = join(ROOT, "src/foundation");

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
  import.meta.glob("../src/foundation/10-components/*.ts", { eager: true }),
  "_CONTRACT",
  "/contract.ts"
);

const manifests = pickExport<BlockManifest>(
  import.meta.glob("../src/blocks/*/manifest.ts", { eager: true }),
  "_MANIFEST",
  "/blocks/manifest.ts"
);

const blockSource = (id: string): string =>
  readFileSync(join(BLOCKS_DIR, id, "index.tsx"), "utf8");

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
        `contract ${id} has no manifest in src/blocks/${id}/manifest.ts`
      );
    }
  }
  for (const dir of blockDirs) {
    if (!contractIds.includes(dir)) {
      out.push(`block ${dir} has no contract in 10-components/${dir}.ts`);
    }
  }
  return out;
};

const slotFindings = (
  contract: ComponentContract,
  manifest: BlockManifest,
  source: string
): string[] => {
  const declared = Object.keys(contract.anatomy);
  const out: string[] = [];
  if (!declared.includes(manifest.slot)) {
    out.push(
      `${contract.id}: manifest slot ${manifest.slot} is not in the contract's anatomy`
    );
  }
  for (const slot of declared) {
    if (slot !== manifest.slot) {
      out.push(`${contract.id}: declared part ${slot} is not in the manifest`);
    }
  }
  if (SLOT_STRING_LITERAL.test(source)) {
    out.push(
      `${contract.id}: index.tsx carries a data-slot string literal — identity belongs to the manifest, not the render`
    );
  }
  return out;
};

const apiFindings = (
  contract: ComponentContract,
  manifest: BlockManifest
): string[] => {
  const out: string[] = [];
  for (const [axis, declared, defined] of [
    [
      "variant",
      Object.keys(contract.api.variants),
      Object.keys(manifest.variants),
    ],
    ["size", Object.keys(contract.api.sizes), Object.keys(manifest.sizes)],
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
  [
    ...manifest.base,
    ...Object.values(manifest.variants).flat(),
    ...Object.values(manifest.sizes).flat(),
  ].join(" ");

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

const paired = (): [ComponentContract, BlockManifest][] =>
  [...contracts.entries()].flatMap(([id, contract]) => {
    const manifest = manifests.get(id);
    return manifest ? [[contract, manifest]] : [];
  });

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

  it("proves itself on a slot the contract never declared", () => {
    const [pair] = paired();
    if (!pair) {
      throw new Error("no paired block");
    }
    const [contract, manifest] = pair;
    const planted = { ...manifest, slot: "button-glow" };
    expect(slotFindings(contract, planted, blockSource(contract.id))).toEqual([
      `${contract.id}: manifest slot button-glow is not in the contract's anatomy`,
      `${contract.id}: declared part button is not in the manifest`,
    ]);
  });

  it("proves itself on a data-slot literal smuggled into the render", () => {
    const [pair] = paired();
    if (!pair) {
      throw new Error("no paired block");
    }
    const [contract, manifest] = pair;
    const planted = blockSource(contract.id).replace(
      "data-slot={COMMON_BUTTON_MANIFEST.slot}",
      'data-slot="button"'
    );
    expect(slotFindings(contract, manifest, planted)).toEqual([
      `${contract.id}: index.tsx carries a data-slot string literal — identity belongs to the manifest, not the render`,
    ]);
  });

  it("proves itself on a variant the contract never admitted", () => {
    const [pair] = paired();
    if (!pair) {
      throw new Error("no paired block");
    }
    const [contract, manifest] = pair;
    const { ghost, ...rest } = manifest.variants as Record<
      string,
      readonly string[]
    >;
    const planted = {
      ...manifest,
      variants: { ...rest, phantom: ghost ?? [] },
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
    const [pair] = paired();
    if (!pair) {
      throw new Error("no paired block");
    }
    const [contract, manifest] = pair;
    const planted = {
      ...manifest,
      variants: {
        ...manifest.variants,
        // positive is unadmitted; dropping border-outline leaves outline
        // (drawn by exactly one class) admitted but undrawn.
        default: ["bg-positive", "text-on-primary", "state-layer-on-primary"],
        outline: [
          "border-boundary",
          "text-on-surface",
          "state-layer-on-surface",
        ],
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

  it("proves itself on a block without a contract", () => {
    expect(
      populationFindings(contractIds, manifestIds, [...blockDirs, "banner"])
    ).toEqual(["block banner has no contract in 10-components/banner.ts"]);
  });
});
