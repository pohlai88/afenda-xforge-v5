import { expect, test } from "@playwright/test";
import { expectNoSeriousViolations } from "./axe";

const scopedToOperations = /unit=unit_0002/;
const scopedToSupport = /unit=unit_0003/;
const inspectorOpen = /member=/;
const inspectorOnKatherine = /member=mem_0003/;
const operationsInNavigator = /^Operations/;
const acmeGroupCard = /Acme Group Legal entity/;
const supportCard = /Support Team/;

test.describe("organization workspace", () => {
  // One long journey blew WebKit's 30 s budget under five parallel workers
  // (axe's evaluate alone can take seconds there), so the flow is three
  // focused tests — one axe scan each — and the inspector test enters
  // through a deep link, which also proves the workspace is URL-restorable.
  test("scopes the workspace through the unit tree", async ({ page }) => {
    await page.goto("/acme/organization");
    await expect(
      page.getByRole("heading", { name: "Organization" })
    ).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(9);
    await expectNoSeriousViolations(page);

    // The tree is a scope, not navigation: same page, narrower workspace.
    await page.getByRole("link", { name: operationsInNavigator }).click();
    await expect(page).toHaveURL(scopedToOperations);
    await expect(page.getByRole("row")).toHaveCount(5);
  });

  test("inspects members without leaving the page", async ({ page }) => {
    await page.goto("/acme/organization?unit=unit_0002&member=mem_0002");
    await expect(
      page.getByRole("heading", { level: 2, name: "Grace Hopper" })
    ).toBeVisible();
    await expectNoSeriousViolations(page);

    // Walk the page without losing the panel; each navigation settles on its
    // URL before the next click — a click into a still-settling router can
    // be reverted by the earlier navigation's late payload.
    await page.getByRole("link", { name: "Next member" }).click();
    await expect(page).toHaveURL(inspectorOnKatherine);
    await expect(
      page.getByRole("heading", { level: 2, name: "Katherine Johnson" })
    ).toBeVisible();

    // Close peels only the inspector; the scope survives.
    await page.getByRole("link", { name: "Close inspector" }).click();
    await expect(page).not.toHaveURL(inspectorOpen);
    await expect(page).toHaveURL(scopedToOperations);
  });

  test("previews a bulk move and cancels it", async ({ page }) => {
    // Cancel everything — acme is the counted workspace and must not change.
    await page.goto("/acme/organization?unit=unit_0002");
    await page.getByRole("checkbox", { name: "Select Grace Hopper" }).click();
    await page
      .getByRole("checkbox", { name: "Select Katherine Johnson" })
      .click();
    await expect(page.getByText("2 selected")).toBeVisible();
    await page.getByRole("button", { name: "Move to unit…" }).click();
    await expect(
      page.getByRole("heading", { name: "Move 2 people" })
    ).toBeVisible();
    await expect(page.getByText("2 people move from Operations")).toBeVisible();
    await expectNoSeriousViolations(page);
    await page.getByRole("button", { name: "Cancel" }).click();
    await page.getByRole("button", { name: "Clear selection" }).click();
    await expect(page.getByText("2 selected")).not.toBeVisible();
  });

  test("the org chart is another view of the same context", async ({
    page,
  }) => {
    await page.goto("/acme/organization?view=chart");
    // Chart cards carry type and count in their accessible name; the
    // navigator's "Acme Group 7" does not, so these stay unambiguous.
    await expect(page.getByRole("link", { name: acmeGroupCard })).toBeVisible();
    await expectNoSeriousViolations(page);
    // The chart card's accessible name carries its type and count; the
    // navigator's "Support 2" does not, so this stays unambiguous.
    await page.getByRole("link", { name: supportCard }).click();
    await expect(page).toHaveURL(scopedToSupport);
    await expect(page.getByRole("row")).toHaveCount(3);
  });

  test("shows the empty state for a workspace with no structure", async ({
    page,
  }) => {
    await page.goto("/blank-co/organization");
    await expect(
      page.getByRole("heading", { name: "No members yet" })
    ).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("shows the error boundary when the list fails, with a retry", async ({
    page,
  }) => {
    // FIXTURE_FAULTS=members.list@glitch is set for the e2e server.
    await page.goto("/glitch/organization");
    const heading = page.getByRole("heading", {
      name: "The workspace could not be loaded",
    });
    await expect(heading).toBeVisible();
    await expectNoSeriousViolations(page);
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(heading).toBeVisible();
  });

  test("moves a fresh member through the bulk workflow", async ({
    page,
  }, testInfo) => {
    // orbit is the mutable workspace; the row is proven by its unique name,
    // never by counting (three engines mutate orbit in parallel).
    const stamp = `${testInfo.project.name}-${Date.now()}`;
    const name = `Move Target ${stamp}`;
    await page.goto("/orbit/organization");
    await page.getByRole("button", { name: "Invite member" }).click();
    await page.getByRole("textbox", { name: "Name" }).fill(name);
    await page
      .getByRole("textbox", { name: "Email" })
      .fill(`move-${stamp}@orbit.example`);
    await page.getByRole("button", { name: "Send invite" }).click();

    const row = page.getByRole("row", { name });
    await expect(row).toBeVisible();
    await expect(row).toContainText("Unassigned");

    await row.getByRole("checkbox").click();
    await page.getByRole("button", { name: "Move to unit…" }).click();
    await expect(page.getByText("1 person moves from no unit")).toBeVisible();
    await page.getByRole("button", { name: "Apply 1 change" }).click();

    await expect(row).toContainText("Orbit Labs");
    await expect(
      page.getByRole("button", { name: "Move to unit…" })
    ).not.toBeVisible();
  });
});
