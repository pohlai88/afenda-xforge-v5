import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { acmeMembers } from "@xforge/contracts/fixtures/members";
import { acmeUnits } from "@xforge/contracts/fixtures/units";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { describe, expect, it, vi } from "vitest";
import { MemberInspector } from "@/features/organization/components/member-inspector";

// Server actions import @/lib/data (server-only); jsdom needs their shape only.
vi.mock("@/features/organization/actions", () => ({
  moveMembers: vi.fn(),
  updateMember: vi.fn(),
}));

const units: OrganizationUnitWithCount[] = acmeUnits.map((unit) => ({
  ...unit,
  memberCount: 0,
}));

const [ada] = acmeMembers;
if (!ada) {
  throw new Error("fixture missing: ada");
}

describe("MemberInspector", () => {
  it("shows the member without leaving the workspace", () => {
    render(
      <MemberInspector
        closeHref="/acme/organization"
        member={ada}
        nextHref="/acme/organization?member=mem_0002"
        orgSlug="acme"
        prevHref={undefined}
        unitName="Acme Group"
        units={units}
      />
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Ada Lovelace" })
    ).toBeInTheDocument();
    expect(screen.getByText("Chief Executive")).toBeInTheDocument();
    expect(screen.getByText("Acme Group")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Close inspector" })
    ).toHaveAttribute("href", "/acme/organization");
    expect(screen.getByRole("link", { name: "Next member" })).toHaveAttribute(
      "href",
      "/acme/organization?member=mem_0002"
    );
    // The first row has no previous member — the control is disabled, not gone.
    expect(
      screen.getByRole("button", { name: "Previous member" })
    ).toBeDisabled();
  });

  it("opens the edit sheet with the contract's fields prefilled", async () => {
    const user = userEvent.setup();
    render(
      <MemberInspector
        closeHref="/acme/organization"
        member={ada}
        nextHref={undefined}
        orgSlug="acme"
        prevHref={undefined}
        unitName="Acme Group"
        units={units}
      />
    );
    await user.click(screen.getByRole("button", { name: "Edit" }));
    expect(
      screen.getByRole("heading", { name: "Edit Ada Lovelace" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveValue(
      "Ada Lovelace"
    );
    expect(screen.getByRole("textbox", { name: "Title" })).toHaveValue(
      "Chief Executive"
    );
    expect(screen.getByRole("combobox", { name: "Unit" })).toHaveTextContent(
      "Acme Group"
    );
    expect(
      screen.getByRole("button", { name: "Save changes" })
    ).toBeInTheDocument();
  });
});
