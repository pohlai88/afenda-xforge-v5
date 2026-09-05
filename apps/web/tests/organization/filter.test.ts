import { describe, expect, it } from "vitest";
import {
  parseWorkspaceQuery,
  workspacePath,
  workspaceQueryString,
} from "@/features/organization/filter";

describe("parseWorkspaceQuery", () => {
  it("defaults to the people view with a plain filter", () => {
    expect(parseWorkspaceQuery({})).toEqual({
      filter: { page: 1, pageSize: 25 },
      memberId: undefined,
      view: "people",
    });
  });

  it("reads scope, view, inspector and filter together", () => {
    const query = parseWorkspaceQuery({
      member: "mem_0002",
      role: "owner",
      unit: "unit_0002",
      view: "chart",
    });
    expect(query.view).toBe("chart");
    expect(query.memberId).toBe("mem_0002");
    expect(query.filter).toMatchObject({
      role: "owner",
      unitId: "unit_0002",
    });
  });

  it("normalises invalid values to defaults instead of erroring", () => {
    const query = parseWorkspaceQuery({
      member: "",
      page: "abc",
      role: "emperor",
      view: "spreadsheet",
    });
    expect(query).toEqual({
      filter: { page: 1, pageSize: 25 },
      memberId: undefined,
      view: "people",
    });
  });

  it("takes the first value of a repeated key", () => {
    expect(parseWorkspaceQuery({ view: ["chart", "people"] }).view).toBe(
      "chart"
    );
  });
});

describe("workspaceQueryString", () => {
  it("omits every default so links stay short", () => {
    expect(workspaceQueryString({ filter: {}, view: "people" })).toBe("");
  });

  it("round-trips through the parser", () => {
    const query = workspaceQueryString({
      filter: {
        page: 2,
        query: "ada",
        unitId: "unit_0002" as never,
      },
      memberId: "mem_0003",
      view: "people",
    });
    const parsed = parseWorkspaceQuery(
      Object.fromEntries(new URLSearchParams(query.slice(1)))
    );
    expect(parsed.filter).toMatchObject({
      page: 2,
      query: "ada",
      unitId: "unit_0002",
    });
    expect(parsed.memberId).toBe("mem_0003");
  });
});

describe("workspacePath", () => {
  it("addresses the single-page workspace", () => {
    expect(workspacePath("acme")).toBe("/acme/organization");
  });
});
