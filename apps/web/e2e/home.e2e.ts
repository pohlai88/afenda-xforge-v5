import { expect, test } from "@playwright/test";
import { expectNoSeriousViolations } from "./axe";

const acmeOverview = /\/acme$/;

test("home page names the product and opens the demo workspace", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Afenda xForge" })
  ).toBeVisible();
  await expectNoSeriousViolations(page);
  await page.getByRole("link", { name: "Open demo workspace" }).click();
  await expect(page).toHaveURL(acmeOverview);
  await expect(
    page.getByRole("heading", { name: "Acme Industries" })
  ).toBeVisible();
});
