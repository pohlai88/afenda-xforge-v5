import { describe, expect, it } from "vitest";
import { makeMember, makeOrganization } from "../src/fixtures/factory";
import {
  acmeMembers,
  memberList,
  northwindMembers,
} from "../src/fixtures/members";
import { organizationList, organizations } from "../src/fixtures/organizations";
import { memberSchema } from "../src/member/schema";
import { organizationSchema } from "../src/organization/schema";

describe("canonical fixtures", () => {
  it("are valid domain state", () => {
    for (const organization of organizationList) {
      expect(organizationSchema.safeParse(organization).success).toBe(true);
    }
    for (const member of memberList) {
      expect(memberSchema.safeParse(member).success).toBe(true);
    }
  });

  it("keep referential integrity", () => {
    const ids = new Set(organizationList.map((o) => o.id));
    expect(memberList.every((m) => ids.has(m.organizationId))).toBe(true);
  });

  it("use unique ids", () => {
    expect(new Set(memberList.map((m) => m.id)).size).toBe(memberList.length);
    expect(new Set(organizationList.map((o) => o.id)).size).toBe(
      organizationList.length
    );
  });

  it("describe the three workspaces the screens rely on", () => {
    const activeOwners = (members: readonly (typeof memberList)[number][]) =>
      members.filter((m) => m.role === "owner" && m.status === "active").length;
    expect(activeOwners(acmeMembers)).toBe(2);
    expect(activeOwners(northwindMembers)).toBe(1);
    expect(
      memberList.some((m) => m.organizationId === organizations.blankCo.id)
    ).toBe(false);
  });
});

describe("factories", () => {
  it("produce valid, distinct records", () => {
    const organization = makeOrganization();
    const first = makeMember(organization.id);
    const second = makeMember(organization.id, { role: "owner" });
    expect(organizationSchema.safeParse(organization).success).toBe(true);
    expect(memberSchema.safeParse(first).success).toBe(true);
    expect(first.id).not.toBe(second.id);
    expect(second.role).toBe("owner");
  });
});
