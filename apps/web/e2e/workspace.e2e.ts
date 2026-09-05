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

test("the theme toggle and the d hotkey switch the colour scheme", async ({
  page,
}) => {
  await page.goto("/acme");
  const html = page.locator("html");
  await page.getByRole("button", { name: "Toggle theme" }).click();
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("d");
  await expect(html).toHaveAttribute("data-theme", "light");
});

test.describe("on a phone", () => {
  test.use({ viewport: { height: 812, width: 375 } });

  test("the shell keeps navigation reachable without sideways scrolling", async ({
    page,
  }) => {
    await page.goto("/acme/members");
    const nav = page.getByRole("navigation", { name: "Workspace" });
    await expect(nav.getByRole("link", { name: "Members" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Toggle theme" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    );
    expect(overflow).toBe(0);
    await expectNoSeriousViolations(page);
  });
});
