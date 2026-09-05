import { expect, test } from "@playwright/test";
import { expectNoSeriousViolations } from "./axe";

const acmeMembers = /\/acme\/members$/;

test("a known workspace renders its overview and navigation", async ({
  page,
}) => {
  await page.goto("/acme");
  await expect(
    page.getByRole("heading", { name: "Acme Industries" })
  ).toBeVisible();
  await expectNoSeriousViolations(page);
  const nav = page.getByRole("navigation", { name: "Workspace" });
  await expect(nav.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "page"
  );
  await nav.getByRole("link", { name: "Members" }).click();
  await expect(page).toHaveURL(acmeMembers);
  await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
});

test("an unknown workspace is unavailable, without echoing the slug", async ({
  page,
}) => {
  const response = await page.goto("/nope");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Workspace unavailable" })
  ).toBeVisible();
  await expect(page.getByText("nope", { exact: true })).toHaveCount(0);
  await expectNoSeriousViolations(page);
});
