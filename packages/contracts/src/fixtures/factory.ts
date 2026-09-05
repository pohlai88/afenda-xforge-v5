import {
  memberIdSchema,
  organizationIdSchema,
  organizationSlugSchema,
} from "../ids";
import type { Member } from "../member/types";
import type { Organization } from "../organization/types";
import { dayAfterEpoch, id } from "./seed";

let organizationCounter = 100;
let memberCounter = 100;

export const makeOrganization = (
  overrides: Partial<Organization> = {}
): Organization => {
  organizationCounter += 1;
  const n = organizationCounter;
  return {
    createdAt: dayAfterEpoch(n),
    id: organizationIdSchema.parse(id("org", n)),
    name: `Workspace ${n}`,
    slug: organizationSlugSchema.parse(`workspace-${n}`),
    ...overrides,
  };
};

export const makeMember = (
  organizationId: Member["organizationId"],
  overrides: Partial<Member> = {}
): Member => {
  memberCounter += 1;
  const n = memberCounter;
  return {
    email: `person-${n}@example.test`,
    id: memberIdSchema.parse(id("mem", n)),
    joinedAt: dayAfterEpoch(n),
    name: `Person ${n}`,
    organizationId,
    role: "member",
    status: "active",
    title: null,
    unitId: null,
    ...overrides,
  };
};
