import { describe, expect, it } from "vitest";
import {
  memberListQueryString,
  parseMemberListQuery,
} from "@/features/members/filter";

describe("parseMemberListQuery", () => {
  it("normalises invalid values to defaults instead of failing", () => {
    expect(parseMemberListQuery({ page: "abc" })).toMatchObject({ page: 1 });
    expect(parseMemberListQuery({ page: "-3" })).toMatchObject({ page: 1 });
    expect(parseMemberListQuery({ pageSize: "999999" })).toMatchObject({
      pageSize: 25,
    });
    expect(parseMemberListQuery({ role: "god" }).role).toBeUndefined();
  });

  it("takes the first value of a repeated key", () => {
    expect(parseMemberListQuery({ page: ["2", "3"] })).toMatchObject({
      page: 2,
    });
  });

  it("keeps valid filters and trims the query", () => {
    expect(
      parseMemberListQuery({
        query: "  ada ",
        role: "owner",
        status: "invited",
      })
    ).toEqual({
      page: 1,
      pageSize: 25,
      query: "ada",
      role: "owner",
      status: "invited",
    });
  });

  it("treats empty strings as absent", () => {
    expect(parseMemberListQuery({ query: "", role: "" })).toEqual({
      page: 1,
      pageSize: 25,
    });
  });
});

describe("memberListQueryString", () => {
  it("omits defaults and encodes the rest", () => {
    expect(memberListQueryString({ page: 1, pageSize: 25 })).toBe("");
    expect(
      memberListQueryString({ page: 2, query: "a b", role: "admin" })
    ).toBe("?query=a+b&role=admin&page=2");
  });
});
