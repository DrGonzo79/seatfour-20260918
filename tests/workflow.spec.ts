import { expect, test } from "@playwright/test";

test("matches a player and holds a seat", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Your next game night/ })).toBeVisible();
  await page.getByRole("button", { name: "Social Friday" }).click();
  await page.getByRole("button", { name: "Match me" }).click();
  await expect(page.getByRole("heading", { name: "Catan at Corner Meeple" })).toBeVisible();
  await expect(page.getByText("2 matches")).toBeVisible();
  await page.getByRole("button", { name: "Hold this seat" }).first().click();
  await expect(page.getByText("Seat held for 10 minutes")).toBeVisible();
  await expect(page.getByText(/no reservation or message was sent/i)).toBeVisible();
  await page.getByRole("button", { name: "Release" }).click();
  await expect(page.getByRole("button", { name: "Hold this seat" }).first()).toBeVisible();
});

test("shows validation and empty states", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Travel radius").fill("0");
  await page.getByRole("button", { name: "Match me" }).click();
  await expect(page.locator(".error[role='alert']")).toContainText("between 1 and 30 miles");
  await page.getByLabel("Game").selectOption("Wingspan");
  await page.getByRole("button", { name: "Tuesday", exact: true }).click();
  await page.getByLabel("Travel radius").fill("8");
  await page.getByRole("button", { name: "Match me" }).click();
  await expect(page.getByRole("heading", { name: "No clean fit tonight." })).toBeVisible();
});

test("mobile view has no horizontal overflow", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-only layout assertion");
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
  await page.getByRole("button", { name: "Chess Tuesday" }).click();
  await page.getByRole("button", { name: "Match me" }).click();
  await expect(page.getByRole("heading", { name: "Chess at Knight Shift" })).toBeVisible();
});
