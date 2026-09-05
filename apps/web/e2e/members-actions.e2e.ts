import { expect, test } from "@playwright/test";
import { expectNoSeriousViolations } from "./axe";

// orbit is the mutable workspace: the read-slice e2e counts acme, which must
// stay untouched; northwind's owner cannot be removed, so that run is
// side-effect free. Three browsers invite into orbit at the same time, so the
// proof is the row this test added (unique email), never a row count.
test.describe("members mutations", () => {
  test("invites a member and shows the new row", async ({ page }) => {
    await page.goto("/orbit/members");
    const email = `nia-${Date.now()}-${test.info().project.name}@orbit.example`;
    await page.getByRole("button", { name: "Invite member" }).click();
    const dialog = page.getByRole("dialog", { name: "Invite a member" });
    await dialog.getByLabel("Name").fill("Nia Imara");
    await dialog.getByLabel("Email").fill(email);
    await dialog.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByText("Invited Nia Imara")).toBeVisible();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("row", { name: email })).toContainText(
      "invited"
    );
  });

  test("rejects a duplicate email at the field", async ({ page }) => {
    await page.goto("/orbit/members");
    await page.getByRole("button", { name: "Invite member" }).click();
    const dialog = page.getByRole("dialog", { name: "Invite a member" });
    await dialog.getByLabel("Name").fill("Lynn Again");
    await dialog.getByLabel("Email").fill("lynn@orbit.example");
    await dialog.getByRole("button", { name: "Send invite" }).click();
    await expect(dialog.getByLabel("Email")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    await expect(
      dialog.getByText("A member with this email already exists")
    ).toBeVisible();
    await expectNoSeriousViolations(page);
  });

  test("refuses to remove the last active owner and says why", async ({
    page,
  }) => {
    await page.goto("/northwind/members");
    await page
      .getByRole("button", { name: "Actions for Annie Easley" })
      .click();
    await page
      .getByRole("menuitem", { name: "Remove from workspace…" })
      .click();
    const confirm = page.getByRole("alertdialog", {
      name: "Remove Annie Easley?",
    });
    await expect(confirm).toBeVisible();
    await expectNoSeriousViolations(page);
    await confirm.getByRole("button", { name: "Remove" }).click();
    await expect(
      page.getByText("An organization must keep at least one active owner")
    ).toBeVisible();
    await expect(page.getByRole("row")).toHaveCount(4);
  });
});
