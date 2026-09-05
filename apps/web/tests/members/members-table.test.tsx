import { render, screen } from "@testing-library/react";
import { acmeMembers } from "@xforge/contracts/fixtures/members";
import { describe, expect, it } from "vitest";
import { MembersEmptyState } from "@/features/members/components/members-empty-state";
import { MembersTable } from "@/features/members/components/members-table";

const hedy = /Hedy Lamarr/;

describe("MembersTable", () => {
  it("renders one row per member with role and status", () => {
    render(<MembersTable members={acmeMembers} />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(acmeMembers.length + 1);
    expect(
      screen.getAllByRole("columnheader").map((h) => h.textContent)
    ).toEqual(["Member", "Role", "Status", "Joined"]);
    expect(screen.getByText("ada@acme.example")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: hedy })).toHaveTextContent(
      "invited"
    );
  });

  it("says when a filter matches nobody", () => {
    render(<MembersTable members={[]} />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.getByText("No members match these filters.")
    ).toBeInTheDocument();
  });
});

describe("MembersEmptyState", () => {
  it("invites the first member", () => {
    render(<MembersEmptyState />);
    expect(
      screen.getByRole("heading", { name: "No members yet" })
    ).toBeInTheDocument();
  });
});
