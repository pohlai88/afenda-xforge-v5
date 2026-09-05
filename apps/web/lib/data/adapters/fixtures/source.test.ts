import { organizations } from "@xforge/contracts/fixtures/organizations";
import { runMemberContract } from "@xforge/contracts/member/contract";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import { runOrganizationContract } from "@xforge/contracts/organization/contract";
import { describe, expect, it } from "vitest";
import { parseFaultsEnv } from "./faults";
import { createFixtureDomainSources } from "./source";

runOrganizationContract(() => createFixtureDomainSources());
runMemberContract(() => createFixtureDomainSources());

describe("fault injection", () => {
  it("throws only for the faulted operation and organization", async () => {
    const sources = createFixtureDomainSources({
      faults: parseFaultsEnv("members.list@northwind"),
    });
    const filter = memberFilterSchema.parse({});
    await expect(
      sources.members.list(organizations.northwind.id, filter)
    ).rejects.toThrow("fixture fault");
    await expect(
      sources.members.list(organizations.acme.id, filter)
    ).resolves.toMatchObject({
      total: 8,
    });
    await expect(
      sources.organizations.getBySlug(organizations.northwind.slug)
    ).resolves.toMatchObject({ slug: "northwind" });
  });

  it("rejects an unparseable FIXTURE_FAULTS value", () => {
    expect(() => parseFaultsEnv("members.explode@acme")).toThrow(
      "cannot parse"
    );
  });

  it("isolates instances from each other", async () => {
    const a = createFixtureDomainSources();
    const b = createFixtureDomainSources();
    await a.members.invite(organizations.acme.id, {
      email: "only-in-a@acme.example",
      name: "Only A",
      role: "member",
    });
    const filter = memberFilterSchema.parse({});
    expect((await a.members.list(organizations.acme.id, filter)).total).toBe(9);
    expect((await b.members.list(organizations.acme.id, filter)).total).toBe(8);
  });
});
