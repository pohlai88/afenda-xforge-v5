import type { DomainSources } from "@xforge/contracts/sources";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFixtureDomainSources } from "@/lib/data/adapters/fixtures/source";

const revalidatePath = vi.fn();
let sources: DomainSources;

vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => revalidatePath(path),
}));
vi.mock("@/lib/data", () => ({ getDomainSources: () => sources }));

const { inviteMember, removeMember, updateMemberRole } = await import(
  "@/features/members/actions"
);

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }
  return data;
};

const annie = "mem_0009";
const ada = "mem_0001";

describe("member actions", () => {
  beforeEach(() => {
    sources = createFixtureDomainSources();
    revalidatePath.mockClear();
  });

  it("invites into the workspace named by the slug and revalidates the list", async () => {
    const result = await inviteMember(
      null,
      form({
        email: "new@acme.example",
        name: "New Person",
        orgSlug: "acme",
        role: "member",
      })
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toMatchObject({
        organizationId: "org_0001",
        status: "invited",
      });
    }
    expect(revalidatePath).toHaveBeenCalledWith("/acme/members");
  });

  it("returns VALIDATION with field errors for bad input", async () => {
    const result = await inviteMember(
      null,
      form({ email: "nope", name: "", orgSlug: "acme", role: "member" })
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION");
      expect(Object.keys(result.error.fields ?? {})).toEqual(
        expect.arrayContaining(["email", "name"])
      );
    }
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  it("returns CONFLICT on a duplicate email, pointing at the field", async () => {
    const result = await inviteMember(
      null,
      form({
        email: "ada@acme.example",
        name: "Ada Again",
        orgSlug: "acme",
        role: "member",
      })
    );
    expect(result).toMatchObject({
      error: { code: "CONFLICT", fields: { email: [expect.any(String)] } },
      ok: false,
    });
  });

  it("returns NOT_FOUND for an unknown workspace, never trusting a client id", async () => {
    const result = await removeMember({
      memberId: ada,
      orgSlug: "no-such-workspace",
    });
    expect(result).toMatchObject({ error: { code: "NOT_FOUND" }, ok: false });
  });

  it("returns INVARIANT when removing or demoting the last active owner", async () => {
    const removed = await removeMember({
      memberId: annie,
      orgSlug: "northwind",
    });
    expect(removed).toMatchObject({ error: { code: "INVARIANT" }, ok: false });
    const demoted = await updateMemberRole({
      memberId: annie,
      orgSlug: "northwind",
      role: "admin",
    });
    expect(demoted).toMatchObject({ error: { code: "INVARIANT" }, ok: false });
  });

  it("changes a role when the invariant allows it", async () => {
    const result = await updateMemberRole({
      memberId: ada,
      orgSlug: "acme",
      role: "admin",
    });
    expect(result).toMatchObject({ data: { role: "admin" }, ok: true });
    expect(revalidatePath).toHaveBeenCalledWith("/acme/members");
  });
});
