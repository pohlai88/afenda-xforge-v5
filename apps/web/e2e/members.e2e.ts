import { expect, test } from "@playwright/test";

const ownersOnly = /role=owner/;

test.describe("members list", () => {
  test("lists a populated workspace and narrows by role", async ({ page }) => {
    await page.goto("/acme/members");
    await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(9);
    await page.getByRole("combobox", { name: "Role" }).click();
    await page.getByRole("option", { name: "owner" }).click();
    await expect(page).toHaveURL(ownersOnly);
    await expect(page.getByRole("row")).toHaveCount(3);
    await expect(page.getByText("1–2 of 2")).toBeVisible();
  });

  test("shows the empty state for a workspace with nobody in it", async ({
    page,
  }) => {
    await page.goto("/blank-co/members");
    await expect(
      page.getByRole("heading", { name: "No members yet" })
    ).toBeVisible();
  });

  test("shows the error boundary when the list fails, with a retry", async ({
    page,
  }) => {
    // FIXTURE_FAULTS=members.list@glitch is set for the e2e server.
    await page.goto("/glitch/members");
    await expect(
      page.getByRole("heading", { name: "Members could not be loaded" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Try again" }).click();
    await expect(
      page.getByRole("heading", { name: "Members could not be loaded" })
    ).toBeVisible();
  });
});
