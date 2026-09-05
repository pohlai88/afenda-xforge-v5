import "server-only";
import type { DomainSources } from "@xforge/contracts/sources";
import { getFixtureDomainSources } from "./adapters/fixtures";

const kinds = ["db", "fixtures", "http"] as const;
type DataSourceKind = (typeof kinds)[number];

const kindFromEnv = (): DataSourceKind => {
  const value = process.env.DATA_SOURCE ?? "fixtures";
  if (!(kinds as readonly string[]).includes(value)) {
    throw new Error(
      `DATA_SOURCE must be one of ${kinds.join(", ")}; got "${value}"`
    );
  }
  return value as DataSourceKind;
};

/**
 * The only module that knows adapters exist. Queries and server actions call
 * this; features never import an adapter or a fixture directly.
 */
export const getDomainSources = (): DomainSources => {
  const kind = kindFromEnv();
  if (kind === "fixtures") {
    return getFixtureDomainSources();
  }
  throw new Error(
    `DATA_SOURCE=${kind} is not implemented yet (see docs/architecture.md §5.5)`
  );
};
