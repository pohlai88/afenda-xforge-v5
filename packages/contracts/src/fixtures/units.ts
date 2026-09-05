import { organizationUnitIdSchema } from "../ids";
import type { OrganizationUnit, OrganizationUnitType } from "../unit/types";
import { organizations } from "./organizations";
import { id } from "./seed";

let counter = 0;

const make = (
  organizationId: OrganizationUnit["organizationId"],
  name: string,
  type: OrganizationUnitType,
  parentId: OrganizationUnit["parentId"] = null
): OrganizationUnit => {
  counter += 1;
  return {
    id: organizationUnitIdSchema.parse(id("unit", counter)),
    name,
    organizationId,
    parentId,
    type,
  };
};

/**
 * The structural fixtures. Only acme carries a real tree — deep enough for
 * subtree scoping to be observable; the other populated workspaces get one
 * root so their people are assignable. blank-co has none — the structural
 * empty state.
 */
const acmeGroup = make(organizations.acme.id, "Acme Group", "legal-entity");
const acmeOperations = make(
  organizations.acme.id,
  "Operations",
  "division",
  acmeGroup.id
);
const acmeSupport = make(
  organizations.acme.id,
  "Support",
  "team",
  acmeOperations.id
);
const acmeFinance = make(
  organizations.acme.id,
  "Finance",
  "department",
  acmeGroup.id
);

export const acmeUnits: readonly OrganizationUnit[] = [
  acmeGroup,
  acmeOperations,
  acmeSupport,
  acmeFinance,
];

export const northwindUnits: readonly OrganizationUnit[] = [
  make(organizations.northwind.id, "Headquarters", "legal-entity"),
];

export const orbitUnits: readonly OrganizationUnit[] = [
  make(organizations.orbit.id, "Orbit Labs", "legal-entity"),
];

export const glitchUnits: readonly OrganizationUnit[] = [
  make(organizations.glitch.id, "Glitch Works", "legal-entity"),
];

export const unitList: readonly OrganizationUnit[] = [
  ...acmeUnits,
  ...northwindUnits,
  ...orbitUnits,
  ...glitchUnits,
];
