import { expect, test } from "@playwright/test";

test("home page renders the ready state", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Project ready!" })
  ).toBeVisible();
});
