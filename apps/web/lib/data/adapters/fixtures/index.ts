import type { DomainSources } from "@xforge/contracts/sources";
import { parseFaultsEnv } from "./faults";
import { createFixtureDomainSources } from "./source";

const globalForFixtures = globalThis as typeof globalThis & {
  xforgeFixtureSources?: DomainSources;
};

/**
 * The dev-server singleton: one world per server process, kept across HMR so
 * mutations survive a reload. Tests must not use it — they call
 * `createFixtureDomainSources()` for an isolated instance.
 */
export const getFixtureDomainSources = (): DomainSources => {
  globalForFixtures.xforgeFixtureSources ??= createFixtureDomainSources({
    faults: parseFaultsEnv(process.env.FIXTURE_FAULTS),
  });
  return globalForFixtures.xforgeFixtureSources;
};
