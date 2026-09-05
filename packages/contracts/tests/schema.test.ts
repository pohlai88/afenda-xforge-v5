import { describe, expect, it } from "vitest";
import { organizationSlugSchema } from "../src/ids";
import {
  inviteMemberInputSchema,
  memberFilterSchema,
} from "../src/member/schema";

describe("memberFilterSchema", () => {
  it("applies defaults when nothing is given", () => {
    expect(memberFilterSchema.parse({})).toEqual({ page: 1, pageSize: 25 });
  });

  it("coerces numeric strings from a URL", () => {
    expect(
      memberFilterSchema.parse({ page: "3", pageSize: "50" })
    ).toMatchObject({
      page: 3,
      pageSize: 50,
    });
  });

  it("rejects out-of-range paging", () => {
    expect(memberFilterSchema.safeParse({ page: 0 }).success).toBe(false);
    expect(memberFilterSchema.safeParse({ pageSize: 999 }).success).toBe(false);
    expect(memberFilterSchema.safeParse({ page: "abc" }).success).toBe(false);
  });

  it("trims and bounds the query", () => {
    expect(memberFilterSchema.parse({ query: "  ada " }).query).toBe("ada");
    expect(
      memberFilterSchema.safeParse({ query: "x".repeat(101) }).success
    ).toBe(false);
  });
});

describe("inviteMemberInputSchema", () => {
  it("rejects an invalid email with a field path", () => {
    const result = inviteMemberInputSchema.safeParse({
      email: "not-an-email",
      name: "Someone",
      role: "member",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["email"]);
    }
  });

  it("rejects an unknown role", () => {
    expect(
      inviteMemberInputSchema.safeParse({
        email: "a@b.example",
        name: "A",
        role: "god",
      }).success
    ).toBe(false);
  });
});

describe("organizationSlugSchema", () => {
  it("accepts kebab-case slugs only", () => {
    expect(organizationSlugSchema.safeParse("acme").success).toBe(true);
    expect(organizationSlugSchema.safeParse("blank-co").success).toBe(true);
    expect(organizationSlugSchema.safeParse("Bad Slug").success).toBe(false);
    expect(organizationSlugSchema.safeParse("-leading").success).toBe(false);
  });
});
