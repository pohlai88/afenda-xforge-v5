import { organizationSlugSchema } from "@xforge/contracts/ids";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import type { DomainSources } from "@xforge/contracts/sources";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFixtureDomainSources } from "@/lib/data/adapters/fixtures/source";

const revalidatePath = vi.fn();
let sources: DomainSources;

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePath(path),
}));
vi.mock("@/lib/data", () => ({ getDomainSources: () => sources }));

const { moveMembers, updateMember } = await import(
  "@/features/organization/actions"
);

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
};

const ada = "mem_0001";
const radia = "mem_0005";
const frances = "mem_0007";
const mary = "mem_0010";
const finance = "unit_0004";
const northwindHq = "unit_0005";

describe("organization actions", () => {
  beforeEach(() => {
    sources = createFixtureDomainSources();
    revalidatePath.mockClear();
  });

  it("updates a member and revalidates both member screens", async () => {
    const result = await updateMember(
      null,
      form({
        memberId: ada,
        name: "Ada King",
        orgSlug: "acme",
        title: "Chair",
        unitId: finance,
      })
    );
    expect(result).toMatchObject({
      data: { name: "Ada King", title: "Chair", unitId: finance },
      ok: true,
    });
    expect(revalidatePath).toHaveBeenCalledWith("/acme/organization");
    expect(revalidatePath).toHaveBeenCalledWith("/acme/members");
  });

  it("turns an empty title and the unassigned unit into nulls", async () => {
    const result = await updateMember(
      null,
      form({
        memberId: ada,
        name: "Ada Lovelace",
        orgSlug: "acme",
        title: "",
        unitId: "unassigned",
      })
    );
    expect(result).toMatchObject({
      data: { title: null, unitId: null },
      ok: true,
    });
  });

  it("returns VALIDATION with field errors for a blank name", async () => {
    const result = await updateMember(
      null,
      form({
        memberId: ada,
        name: "  ",
        orgSlug: "acme",
        title: "",
        unitId: "unassigned",
      })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
      expect(Object.keys(result.error.fields ?? {})).toContain("name");
    }
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND for a unit in another workspace", async () => {
    const result = await updateMember(
      null,
      form({
        memberId: ada,
        name: "Ada Lovelace",
        orgSlug: "acme",
        title: "",
        unitId: northwindHq,
      })
    );
    expect(result).toMatchObject({ error: { code: "NOT_FOUND" }, ok: false });
  });

  it("moves the selection and revalidates both member screens", async () => {
    const result = await moveMembers({
      memberIds: [radia, frances],
      orgSlug: "acme",
      unitId: finance,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(2);
      expect(result.data.every((member) => member.unitId === finance)).toBe(
        true
      );
    }
    expect(revalidatePath).toHaveBeenCalledWith("/acme/organization");
    expect(revalidatePath).toHaveBeenCalledWith("/acme/members");
  });

  it("moves nobody when one member is outside the workspace", async () => {
    const result = await moveMembers({
      memberIds: [radia, mary],
      orgSlug: "acme",
      unitId: finance,
    });
    expect(result).toMatchObject({ error: { code: "NOT_FOUND" }, ok: false });
    const acme = await sources.organizations.getBySlug(
      organizationSlugSchema.parse("acme")
    );
    const page = await sources.members.list(
      acme.id,
      memberFilterSchema.parse({})
    );
    const untouched = page.items.find((member) => member.id === radia);
    expect(untouched?.unitId).not.toBe(finance);
  });
});
