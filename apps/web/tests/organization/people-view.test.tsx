import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { acmeMembers } from "@xforge/contracts/fixtures/members";
import { acmeUnits } from "@xforge/contracts/fixtures/units";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PeopleView } from "@/features/organization/components/people-view";

const { moveMembers, push } = vi.hoisted(() => ({
  moveMembers: vi.fn(),
  push: vi.fn(),
}));

// Server actions import @/lib/data (server-only); jsdom needs their shape only.
vi.mock("@/features/organization/actions", () => ({
  moveMembers,
  updateMember: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const units: OrganizationUnitWithCount[] = acmeUnits.map((unit) => ({
  ...unit,
  memberCount: 0,
}));

const adaRow = /Ada Lovelace/;
const hedyRow = /Hedy Lamarr/;
const applyTwo = /^Apply 2/;

const renderView = (inspectedMemberId?: string) =>
  render(
    <PeopleView
      filter={memberFilterSchema.parse({})}
      inspectedMemberId={inspectedMemberId}
      members={acmeMembers}
      orgSlug="acme"
      units={units}
    />
  );

describe("PeopleView", () => {
  beforeEach(() => {
    moveMembers.mockReset();
    push.mockClear();
  });

  it("renders a row per member with unit, role and status", () => {
    renderView();
    expect(screen.getAllByRole("row")).toHaveLength(acmeMembers.length + 1);
    const ada = screen.getByRole("row", { name: adaRow });
    expect(ada).toHaveTextContent("Chief Executive");
    expect(ada).toHaveTextContent("Acme Group");
    const hedy = screen.getByRole("row", { name: hedyRow });
    expect(hedy).toHaveTextContent("Unassigned");
    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveAttribute(
      "href",
      "/acme/organization?member=mem_0001"
    );
  });

  it("shows the bulk bar only while something is selected", async () => {
    const user = userEvent.setup();
    renderView();
    expect(screen.queryByText("selected")).not.toBeInTheDocument();
    await user.click(
      screen.getByRole("checkbox", { name: "Select Ada Lovelace" })
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Select Grace Hopper" })
    );
    expect(screen.getByText("2")).toHaveTextContent("2");
    expect(
      screen.getByRole("button", { name: "Move to unit…" })
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear selection" }));
    expect(
      screen.queryByRole("button", { name: "Move to unit…" })
    ).not.toBeInTheDocument();
  });

  it("selects everyone on the page from the header checkbox", async () => {
    const user = userEvent.setup();
    renderView();
    await user.click(
      screen.getByRole("checkbox", { name: "Select everyone on this page" })
    );
    expect(
      screen.getByRole("checkbox", { name: "Select Hedy Lamarr" })
    ).toBeChecked();
    expect(screen.getByText(String(acmeMembers.length))).toBeInTheDocument();
  });

  it("moves row focus with j/k and toggles selection with x", async () => {
    const user = userEvent.setup();
    renderView();
    screen.getByRole("link", { name: "Ada Lovelace" }).focus();
    await user.keyboard("j");
    expect(screen.getByRole("link", { name: "Grace Hopper" })).toHaveFocus();
    await user.keyboard("x");
    expect(
      screen.getByRole("checkbox", { name: "Select Grace Hopper" })
    ).toBeChecked();
    await user.keyboard("k");
    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveFocus();
  });

  it("peels layers with Escape: selection first, then the inspector", async () => {
    const user = userEvent.setup();
    renderView("mem_0001");
    screen.getByRole("link", { name: "Ada Lovelace" }).focus();
    await user.keyboard("x");
    await user.keyboard("{Escape}");
    expect(
      screen.getByRole("checkbox", { name: "Select Ada Lovelace" })
    ).not.toBeChecked();
    expect(push).not.toHaveBeenCalled();
    await user.keyboard("{Escape}");
    expect(push).toHaveBeenCalledWith("/acme/organization");
  });

  it("previews the bulk move and commits through the action", async () => {
    const user = userEvent.setup();
    moveMembers.mockResolvedValue({
      data: [acmeMembers[4], acmeMembers[6]],
      ok: true,
    });
    renderView();
    await user.click(
      screen.getByRole("checkbox", { name: "Select Radia Perlman" })
    );
    await user.click(
      screen.getByRole("checkbox", { name: "Select Frances Allen" })
    );
    await user.click(screen.getByRole("button", { name: "Move to unit…" }));
    expect(
      screen.getByRole("heading", { name: "Move 2 people" })
    ).toBeInTheDocument();
    expect(screen.getByText("2 people move from Support")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: applyTwo }));
    await vi.waitFor(() =>
      expect(moveMembers).toHaveBeenCalledWith({
        memberIds: [acmeMembers[4]?.id, acmeMembers[6]?.id],
        orgSlug: "acme",
        unitId: units[0]?.id,
      })
    );
    await vi.waitFor(() =>
      expect(
        screen.queryByRole("button", { name: "Move to unit…" })
      ).not.toBeInTheDocument()
    );
  });
});
