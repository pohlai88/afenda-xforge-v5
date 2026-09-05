import { render, screen } from "@testing-library/react";
import { acmeMembers } from "@xforge/contracts/fixtures/members";
import { describe, expect, it, vi } from "vitest";
import { MembersEmptyState } from "@/features/members/components/members-empty-state";
import { MembersTable } from "@/features/members/components/members-table";

const hedy = /Hedy Lamarr/;

// Server actions import @/lib/data (server-only); these tests only need their shape.
vi.mock("@/features/members/actions", () => ({
  inviteMember: vi.fn(),
  removeMember: vi.fn(),
  updateMemberRole: vi.fn(),
}));

describe("MembersTable", () => {
  it("renders one row per member with role, status and actions", () => {
    render(<MembersTable members={acmeMembers} orgSlug="acme" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(acmeMembers.length + 1);
    expect(
      screen.getAllByRole("columnheader").map((h) => h.textContent)
    ).toEqual(["Member", "Role", "Status", "Joined", "Actions"]);
    expect(screen.getByText("ada@acme.example")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: hedy })).toHaveTextContent(
      "invited"
    );
    expect(
      screen.getByRole("button", { name: "Actions for Ada Lovelace" })
    ).toBeInTheDocument();
  });

  it("says when a filter matches nobody", () => {
    render(<MembersTable members={[]} orgSlug="acme" />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(
      screen.getByText("No members match these filters.")
    ).toBeInTheDocument();
  });
});

describe("MembersEmptyState", () => {
  it("invites the first member", () => {
    render(<MembersEmptyState orgSlug="acme" />);
    expect(
      screen.getByRole("heading", { name: "No members yet" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Invite member" })
    ).toBeInTheDocument();
  });
});
