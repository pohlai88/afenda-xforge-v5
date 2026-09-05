const operations = [
  "members.invite",
  "members.list",
  "members.remove",
  "members.updateRole",
  "organizations.getBySlug",
] as const;

export type FaultOperation = (typeof operations)[number];

/**
 * Failure injection lives here, in the adapter harness — never in the
 * fixtures, which describe valid domain state only. A fault makes one
 * operation throw for one organization, which is how the error state is
 * driven in dev (`FIXTURE_FAULTS=members.list@northwind`) and in e2e.
 */
export interface FaultSpec {
  error?: Error;
  operation: FaultOperation;
  organizationSlug: string;
}

const isOperation = (value: string): value is FaultOperation =>
  (operations as readonly string[]).includes(value);

/** Parses `op@slug,op@slug` — unknown operations are an error, not ignored. */
export const parseFaultsEnv = (value: string | undefined): FaultSpec[] =>
  (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
    .map((entry) => {
      const [operation, organizationSlug] = entry.split("@");
      if (!(operation && organizationSlug && isOperation(operation))) {
        throw new Error(`FIXTURE_FAULTS: cannot parse "${entry}"`);
      }
      return { operation, organizationSlug };
    });

export const throwIfFaulted = (
  faults: readonly FaultSpec[],
  operation: FaultOperation,
  organizationSlug: string
) => {
  const fault = faults.find(
    (candidate) =>
      candidate.operation === operation &&
      candidate.organizationSlug === organizationSlug
  );
  if (fault) {
    throw (
      fault.error ??
      new Error(`fixture fault: ${operation} for ${organizationSlug}`)
    );
  }
};
