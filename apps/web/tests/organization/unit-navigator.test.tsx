import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { acmeUnits } from "@xforge/contracts/fixtures/units";
import { memberFilterSchema } from "@xforge/contracts/member/schema";
import type { OrganizationUnitWithCount } from "@xforge/contracts/unit/types";
import { describe, expect, it } from "vitest";
import { UnitNavigator } from "@/features/organization/components/unit-navigator";

const counts: Record<string, number> = {
  "Acme Group": 1,
  Finance: 2,
  Operations: 2,
  Support: 2,
};

const units: OrganizationUnitWithCount[] = acmeUnits.map((unit) => ({
  ...unit,
  memberCount: counts[unit.name] ?? 0,
}));

const operationsId = acmeUnits.find((unit) => unit.name === "Operations")?.id;
const operationsLink = /Operations/;
const supportLink = /Support/;
const financeLink = /Finance/;

const renderNavigator = (activeUnitId?: string) =>
  render(
    <UnitNavigator
      activeUnitId={activeUnitId}
      filter={memberFilterSchema.parse({})}
      orgSlug="acme"
      units={units}
      view="people"
    />
  );

describe("UnitNavigator", () => {
  it("renders the tree with subtree counts and scope links", () => {
    renderNavigator();
    expect(
      screen.getByRole("navigation", { name: "Organization structure" })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All people" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    const operations = screen.getByRole("link", { name: operationsLink });
    expect(operations).toHaveTextContent("4");
    expect(operations).toHaveAttribute(
      "href",
      `/acme/organization?unit=${operationsId}`
    );
  });

  it("marks the active scope, not the route", () => {
    renderNavigator(operationsId);
    expect(screen.getByRole("link", { name: operationsLink })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("link", { name: "All people" })
    ).not.toHaveAttribute("aria-current");
  });

  it("collapses a branch without losing the rest of the tree", async () => {
    const user = userEvent.setup();
    renderNavigator();
    expect(screen.getByRole("link", { name: supportLink })).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Collapse Operations" })
    );
    expect(
      screen.queryByRole("link", { name: supportLink })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: financeLink })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Expand Operations" }));
    expect(screen.getByRole("link", { name: supportLink })).toBeInTheDocument();
  });
});
